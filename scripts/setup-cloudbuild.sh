#!/usr/bin/env bash
# setup-cloudbuild.sh — 一次性脚本，初始化 GCP Cloud Build 自动部署所需的全部资源
# 运行前提：已安装并登录 gcloud CLI，且拥有 Owner/Editor 权限
#
# 用法：
#   ./scripts/setup-cloudbuild.sh \
#     --build-project edumoni-prd \
#     --github-owner  <你的 GitHub 用户名或组织> \
#     --github-repo   EduMoni

set -euo pipefail

# ── 参数解析 ──────────────────────────────────────────────────────────────────
BUILD_PROJECT=""
GITHUB_OWNER=""
GITHUB_REPO=""
FIREBASE_PRD_PROJECT="edumoni-prd"
FIREBASE_FEATURE_PROJECT="edumoni-feature"
SA_NAME="cloudbuild-firebase-deployer"
SECRET_NAME="firebase-sa-key"

show_help() {
  echo "Usage: $0 --build-project PROJECT_ID --github-owner OWNER --github-repo REPO"
  echo ""
  echo "  --build-project   GCP project where Cloud Build runs (e.g. edumoni-prd)"
  echo "  --github-owner    GitHub user/org that owns the repo"
  echo "  --github-repo     GitHub repository name (e.g. EduMoni)"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build-project) BUILD_PROJECT="$2"; shift 2 ;;
    --github-owner)  GITHUB_OWNER="$2";  shift 2 ;;
    --github-repo)   GITHUB_REPO="$2";   shift 2 ;;
    -h|--help) show_help ;;
    *) echo "Unknown option: $1"; show_help ;;
  esac
done

[[ -z "$BUILD_PROJECT" || -z "$GITHUB_OWNER" || -z "$GITHUB_REPO" ]] && show_help

BUILD_PROJECT_NUMBER=$(gcloud projects describe "$BUILD_PROJECT" \
  --format="value(projectNumber)")
CLOUDBUILD_SA="${BUILD_PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
SA_EMAIL="${SA_NAME}@${BUILD_PROJECT}.iam.gserviceaccount.com"

echo "======================================================"
echo " EduMoni Cloud Build Setup"
echo "======================================================"
echo " Cloud Build project : $BUILD_PROJECT"
echo " GitHub              : $GITHUB_OWNER/$GITHUB_REPO"
echo " Firebase prd        : $FIREBASE_PRD_PROJECT"
echo " Firebase feature    : $FIREBASE_FEATURE_PROJECT"
echo "======================================================"
echo ""

# ── 1. 启用所需 API ───────────────────────────────────────────────────────────
echo "[1/6] Enabling GCP APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  firebase.googleapis.com \
  --project "$BUILD_PROJECT"
echo "      APIs enabled."

# ── 2. 创建专用 Service Account ──────────────────────────────────────────────
echo "[2/6] Creating service account: $SA_NAME..."
if gcloud iam service-accounts describe "$SA_EMAIL" \
    --project "$BUILD_PROJECT" &>/dev/null; then
  echo "      Service account already exists, skipping creation."
else
  gcloud iam service-accounts create "$SA_NAME" \
    --display-name "Cloud Build Firebase Deployer" \
    --project "$BUILD_PROJECT"
  echo "      Service account created."
fi

# ── 3. 授予 Firebase Hosting Admin 权限（两个环境项目）──────────────────────
echo "[3/6] Granting Firebase Hosting Admin to service account..."
for PROJECT in "$FIREBASE_PRD_PROJECT" "$FIREBASE_FEATURE_PROJECT"; do
  gcloud projects add-iam-policy-binding "$PROJECT" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/firebasehosting.admin" \
    --quiet
  echo "      Granted on $PROJECT"
done

# ── 4. 生成并存储 Service Account Key 到 Secret Manager ──────────────────────
echo "[4/6] Creating service account key and storing in Secret Manager..."
TMP_KEY=$(mktemp /tmp/firebase-sa-XXXXXX.json)
trap "rm -f $TMP_KEY" EXIT

gcloud iam service-accounts keys create "$TMP_KEY" \
  --iam-account "$SA_EMAIL" \
  --project "$BUILD_PROJECT"

if gcloud secrets describe "$SECRET_NAME" \
    --project "$BUILD_PROJECT" &>/dev/null; then
  echo "      Secret exists, adding new version..."
  gcloud secrets versions add "$SECRET_NAME" \
    --data-file "$TMP_KEY" \
    --project "$BUILD_PROJECT"
else
  echo "      Creating new secret..."
  gcloud secrets create "$SECRET_NAME" \
    --data-file "$TMP_KEY" \
    --replication-policy automatic \
    --project "$BUILD_PROJECT"
fi
echo "      Key stored in Secret Manager as '$SECRET_NAME'."

# ── 5. 授予 Cloud Build SA 读取 Secret 的权限 ─────────────────────────────────
echo "[5/6] Granting Secret Manager access to Cloud Build service account..."
gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member="serviceAccount:$CLOUDBUILD_SA" \
  --role="roles/secretmanager.secretAccessor" \
  --project "$BUILD_PROJECT" \
  --quiet
echo "      Access granted to $CLOUDBUILD_SA"

# ── 6. 创建 Cloud Build Triggers ─────────────────────────────────────────────
echo "[6/6] Creating Cloud Build triggers..."

# 注意：GitHub 仓库必须先在 Cloud Build 控制台完成 GitHub App 授权连接
# 参见：https://console.cloud.google.com/cloud-build/triggers/connect

create_trigger() {
  local TRIGGER_NAME="$1"
  local BRANCH_PATTERN="$2"
  local DESCRIPTION="$3"

  if gcloud builds triggers describe "$TRIGGER_NAME" \
      --project "$BUILD_PROJECT" &>/dev/null; then
    echo "      Trigger '$TRIGGER_NAME' already exists, updating..."
    gcloud builds triggers delete "$TRIGGER_NAME" \
      --project "$BUILD_PROJECT" --quiet
  fi

  gcloud builds triggers create github \
    --name="$TRIGGER_NAME" \
    --description="$DESCRIPTION" \
    --repo-owner="$GITHUB_OWNER" \
    --repo-name="$GITHUB_REPO" \
    --branch-pattern="$BRANCH_PATTERN" \
    --build-config="cloudbuild.yaml" \
    --project "$BUILD_PROJECT"

  echo "      Trigger '$TRIGGER_NAME' created (branch: $BRANCH_PATTERN)"
}

create_trigger \
  "edumoni-deploy-main" \
  "^main$" \
  "Deploy EduMoni to Production on push to main"

create_trigger \
  "edumoni-deploy-feature" \
  "^feature/.*$" \
  "Deploy EduMoni to Feature on push to feature/* branches"

echo ""
echo "======================================================"
echo " Setup complete!"
echo "======================================================"
echo ""
echo " Next steps:"
echo "  1. Connect GitHub repo in Cloud Build Console (if not done):"
echo "     https://console.cloud.google.com/cloud-build/triggers/connect?project=$BUILD_PROJECT"
echo ""
echo "  2. Push to a branch to trigger your first build:"
echo "     git push origin feature/gcp-deploy"
echo ""
echo "  3. Monitor builds at:"
echo "     https://console.cloud.google.com/cloud-build/builds?project=$BUILD_PROJECT"
echo "======================================================"
