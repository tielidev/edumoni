#!/usr/bin/env bash
# setup-cloudbuild.sh — 一次性脚本，在单个 GCP 项目 edumoni 中初始化全部资源
# 运行前提：已安装并登录 gcloud + firebase CLI，且拥有 Owner/Editor 权限
#
# 用法：
#   ./scripts/setup-cloudbuild.sh \
#     --github-owner <你的 GitHub 用户名或组织> \
#     --github-repo  EduMoni

set -euo pipefail

# ── 参数解析 ──────────────────────────────────────────────────────────────────
PROJECT_ID="edumoni"
GITHUB_OWNER=""
GITHUB_REPO=""
SA_NAME="cloudbuild-firebase-deployer"
SECRET_NAME="firebase-sa-key"

show_help() {
  echo "Usage: $0 --github-owner OWNER --github-repo REPO"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --github-owner) GITHUB_OWNER="$2"; shift 2 ;;
    --github-repo)  GITHUB_REPO="$2";  shift 2 ;;
    -h|--help) show_help ;;
    *) echo "Unknown option: $1"; show_help ;;
  esac
done

[[ -z "$GITHUB_OWNER" || -z "$GITHUB_REPO" ]] && show_help

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" \
  --format="value(projectNumber)")
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "======================================================"
echo " EduMoni Cloud Build Setup (single project)"
echo "======================================================"
echo " GCP project  : $PROJECT_ID"
echo " GitHub       : $GITHUB_OWNER/$GITHUB_REPO"
echo " Hosting sites: edumoni-prd, edumoni-feature"
echo "======================================================"
echo ""

# ── 1. 启用所需 API ───────────────────────────────────────────────────────────
echo "[1/7] Enabling GCP APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  firebase.googleapis.com \
  --project "$PROJECT_ID"
echo "      APIs enabled."

# ── 2. 创建 Firebase Hosting 站点 ────────────────────────────────────────────
echo "[2/7] Creating Firebase Hosting sites..."
for SITE in edumoni-prd edumoni-feature; do
  if firebase hosting:sites:get "$SITE" --project "$PROJECT_ID" &>/dev/null; then
    echo "      Site '$SITE' already exists, skipping."
  else
    firebase hosting:sites:create "$SITE" --project "$PROJECT_ID"
    echo "      Site '$SITE' created."
  fi
done

# ── 3. 创建专用 Service Account ──────────────────────────────────────────────
echo "[3/7] Creating service account: $SA_NAME..."
if gcloud iam service-accounts describe "$SA_EMAIL" \
    --project "$PROJECT_ID" &>/dev/null; then
  echo "      Service account already exists, skipping."
else
  gcloud iam service-accounts create "$SA_NAME" \
    --display-name "Cloud Build Firebase Deployer" \
    --project "$PROJECT_ID"
  echo "      Service account created."
fi

# ── 4. 授予 Firebase Hosting Admin 权限（同一项目，无需跨项目授权）───────────
echo "[4/7] Granting Firebase Hosting Admin to service account..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/firebasehosting.admin" \
  --quiet
echo "      Granted on project $PROJECT_ID."

# ── 5. 生成并存储 Service Account Key 到 Secret Manager ──────────────────────
echo "[5/7] Creating service account key and storing in Secret Manager..."
TMP_KEY=$(mktemp /tmp/firebase-sa-XXXXXX.json)
trap "rm -f $TMP_KEY" EXIT

gcloud iam service-accounts keys create "$TMP_KEY" \
  --iam-account "$SA_EMAIL" \
  --project "$PROJECT_ID"

if gcloud secrets describe "$SECRET_NAME" \
    --project "$PROJECT_ID" &>/dev/null; then
  echo "      Secret exists, adding new version..."
  gcloud secrets versions add "$SECRET_NAME" \
    --data-file "$TMP_KEY" \
    --project "$PROJECT_ID"
else
  gcloud secrets create "$SECRET_NAME" \
    --data-file "$TMP_KEY" \
    --replication-policy automatic \
    --project "$PROJECT_ID"
fi
echo "      Key stored in Secret Manager as '$SECRET_NAME'."

# ── 6. 授予 Cloud Build SA 读取 Secret 的权限 ─────────────────────────────────
echo "[6/7] Granting Secret Manager access to Cloud Build service account..."
gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member="serviceAccount:$CLOUDBUILD_SA" \
  --role="roles/secretmanager.secretAccessor" \
  --project "$PROJECT_ID" \
  --quiet
echo "      Access granted to $CLOUDBUILD_SA"

# ── 7. 创建 Cloud Build Triggers ─────────────────────────────────────────────
echo "[7/7] Creating Cloud Build triggers..."

create_trigger() {
  local TRIGGER_NAME="$1"
  local BRANCH_PATTERN="$2"
  local DESCRIPTION="$3"

  if gcloud builds triggers describe "$TRIGGER_NAME" \
      --project "$PROJECT_ID" &>/dev/null; then
    echo "      Trigger '$TRIGGER_NAME' exists, recreating..."
    gcloud builds triggers delete "$TRIGGER_NAME" \
      --project "$PROJECT_ID" --quiet
  fi

  gcloud builds triggers create github \
    --name="$TRIGGER_NAME" \
    --description="$DESCRIPTION" \
    --repo-owner="$GITHUB_OWNER" \
    --repo-name="$GITHUB_REPO" \
    --branch-pattern="$BRANCH_PATTERN" \
    --build-config="cloudbuild.yaml" \
    --project "$PROJECT_ID"

  echo "      Trigger '$TRIGGER_NAME' created (branch: $BRANCH_PATTERN)"
}

create_trigger \
  "edumoni-deploy-main" \
  "^main$" \
  "Deploy EduMoni to Production (prd) on push to main"

create_trigger \
  "edumoni-deploy-feature" \
  "^feature/.*$" \
  "Deploy EduMoni to Feature env on push to feature/* branches"

echo ""
echo "======================================================"
echo " Setup complete!"
echo "======================================================"
echo ""
echo " Next steps:"
echo "  1. Connect GitHub repo in Cloud Build Console (if not done):"
echo "     https://console.cloud.google.com/cloud-build/triggers/connect?project=$PROJECT_ID"
echo ""
echo "  2. Push to trigger your first build:"
echo "     git push origin feature/gcp-deploy"
echo ""
echo "  3. Monitor builds:"
echo "     https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
echo "======================================================"
