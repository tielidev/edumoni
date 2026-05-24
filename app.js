// ============================================================================
// EduMoni: Core Application Logic & State Management
// ============================================================================

// 1. 初始化预置数据 (Mock Database Setup)
const PRESET_PET_ASSETS = [
  // 草系进化链
  { id: "leafox", name: "叶狐", element: "grass", avatar: "🦊", fullBody: "assets/leafox.png", signatureMove: "藤鞭抽击", hp: 140, growthHp: 15, atk: 15, growthAtk: 2.0, def: 18, growthDef: 2.2, spd: 8, growthSpd: 1.0, evoLevel: 20, evoTarget: "fernine", story: "叶狐是温和且充满灵性的草属性宠物。它们非常害羞，喜欢栖息在茂密温暖的树林或灌木丛中。由于叶狐头顶独特的叶片与外界植物完美契合，这使得它擅长隐蔽自己并从阳光中汲取自然治愈能量。相传在森林深处，叶狐的出现预示着丰收与和平。", illustrations: ["assets/leafox_action.png"], threeViews: { front: "assets/leafox_3views.png", side: "", back: "" } },
  { id: "fernine", name: "丛林森狐", element: "grass", avatar: "🦊", fullBody: "🦊🍃", signatureMove: "荆棘飞弹", hp: 168, growthHp: 18, atk: 18, growthAtk: 2.4, def: 22, growthDef: 2.6, spd: 10, growthSpd: 1.2, evoLevel: 40, evoTarget: "sylvaron", story: "叶狐在达到20级后进化而来的形态。丛林森狐的体型更加矫健，身上的叶片也变成了尖锐的荆棘。它警觉性极高，能够通过踩踏地面来感知周围数公里内的一草一木。当发现入侵者时，它会射出如飞箭一般的硬质荆棘。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "sylvaron", name: "森罗贤者", element: "grass", avatar: "🐺", fullBody: "🐺✨", signatureMove: "万木复苏", hp: 218, growthHp: 22, atk: 23, growthAtk: 3.0, def: 29, growthDef: 3.2, spd: 13, growthSpd: 1.5, evoLevel: 0, evoTarget: "", story: "丛林森狐在达到40级并进行终极觉醒的形态。森罗贤者是森林的守护神，拥有沟通大自然、操纵百木生长的神圣力量。它额头上的水晶能散发出温和的光芒，治愈一切受伤的弱小生命。", illustrations: [], threeViews: { front: "", side: "", back: "" } },

  // 火系进化链
  { id: "pyroclaw", name: "小火爪", element: "fire", avatar: "🐼", fullBody: "assets/pyroclaw.png", signatureMove: "火花冲撞", hp: 100, growthHp: 10, atk: 25, growthAtk: 3.5, def: 10, growthDef: 1.0, spd: 12, growthSpd: 1.8, evoLevel: 20, evoTarget: "embercrest", story: "小火爪是热情洋溢且有些顽皮的火属性宠物。它的尾巴上燃烧着永不熄灭的火焰，火焰的大小代表着它精神的状态。它喜欢在温暖的火山岩地带奔跑，脾气稍微有些急躁，但对训练家极其忠诚。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "embercrest", name: "熔岩狂熊猫", element: "fire", avatar: "🐼", fullBody: "🐼☄️", signatureMove: "烈焰喷涌", hp: 120, growthHp: 12, atk: 30, growthAtk: 4.2, def: 12, growthDef: 1.2, spd: 14, growthSpd: 2.2, evoLevel: 40, evoTarget: "ignidrago", story: "小火爪在达到20级进化后的形态。熔岩狂熊猫拥有极其厚实的毛皮，能够抵御极高的温度。它的脾气十分火爆，双手包裹着滚烫的熔岩，能一拳击碎坚硬的岩石，经常在熔岩深渊中进行艰苦的格斗修行。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "ignidrago", name: "爆炎龙尊", element: "fire", avatar: "🐼", fullBody: "🐲🔥", signatureMove: "超新星爆裂", hp: 156, growthHp: 16, atk: 39, growthAtk: 5.5, def: 16, growthDef: 1.6, spd: 18, growthSpd: 2.9, evoLevel: 0, evoTarget: "", story: "熔岩狂熊猫在达到40级并进行终极进化后的姿态。爆炎龙尊是火元素的化身，身上流淌着岩浆般炽热的力量。它每一次咆哮都能引动天降陨石，超新星爆裂更是能瞬间将方圆数十里的坚冰融化殆尽。", illustrations: [], threeViews: { front: "", side: "", back: "" } },

  // 水系进化链
  { id: "bubblefin", name: "泡泡鳍", element: "water", avatar: "🦭", fullBody: "assets/bubblefin.png", signatureMove: "水泡齐射", hp: 120, growthHp: 12, atk: 18, growthAtk: 2.5, def: 15, growthDef: 1.8, spd: 10, growthSpd: 1.2, evoLevel: 20, evoTarget: "aquaglide", story: "泡泡鳍是活泼好动的水属性宠物。它擅长制造各种坚固的彩色水泡，常用来包裹食物或戏弄同伴。泡泡鳍生活在清澈的湖泊或海湾中，生性乐观，对人类非常友好，是孩子们最喜欢的玩伴之一。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "aquaglide", name: "激流喷射兽", element: "water", avatar: "🦭", fullBody: "🦭🌊", signatureMove: "激流喷射", hp: 144, growthHp: 14, atk: 22, growthAtk: 3.0, def: 18, growthDef: 2.2, spd: 12, growthSpd: 1.4, evoLevel: 40, evoTarget: "nepturax", story: "泡泡鳍达到20级进化后的形态。激流喷射兽体型流线型极强，在水中游泳的速度可以超越潜艇。它身上的喷射孔能够爆发出强力的水流，产生极大的反冲力，使其像鱼雷一般在激流中高速穿梭。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "nepturax", name: "海皇波塞龙", element: "water", avatar: "🐉", fullBody: "🐉🔱", signatureMove: "海皇怒涛", hp: 187, growthHp: 18, atk: 29, growthAtk: 3.9, def: 23, growthDef: 2.9, spd: 16, growthSpd: 1.8, evoLevel: 0, evoTarget: "", story: "激流喷射兽在达到40级完成三阶进化后的形态。海皇波塞龙是深海的绝对统治者，手持由深海寒冰与激流凝结而成的三叉戟虚影。它能轻易掀起滔天巨浪，也能够平息狂暴的海啸，保护着大洋的生态平衡。", illustrations: [], threeViews: { front: "", side: "", back: "" } },

  // 其他电系与地系
  { id: "sparky", name: "闪电雀", element: "electric", avatar: "🐦", fullBody: "🐦⚡", signatureMove: "雷光一击", hp: 90, growthHp: 8, atk: 22, growthAtk: 3.2, def: 8, growthDef: 0.8, spd: 18, growthSpd: 2.5, evoLevel: 25, evoTarget: "voltclaw", story: "闪电雀是娇小敏捷的电属性鸟类宠物。它经常在雷雨天在云层中穿梭，吸收闪电的电荷存入羽毛中。它飞行的轨迹犹如一道曲折的闪电，能在瞬间完成九十度的急转弯，极其擅长速度和空中突袭。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "voltclaw", name: "雷鸣鹰", element: "electric", avatar: "🦅", fullBody: "🦅⚡", signatureMove: "苍穹怒雷", hp: 110, growthHp: 10, atk: 28, growthAtk: 3.8, def: 10, growthDef: 1.0, spd: 22, growthSpd: 3.0, evoLevel: 0, evoTarget: "", story: "闪电雀在25级进化后的形态。雷鸣鹰展开双翼可达两米，羽毛在雷电充盈下会发出耀眼的金光。它的双爪锐利无比，附带有高压电流，能够在俯冲的瞬间将敌人麻痹，是天天空中的雷电宣告者。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "muddy", name: "泥泥驼", element: "earth", avatar: "🐪", fullBody: "🐪⛰️", signatureMove: "落石击", hp: 150, growthHp: 16, atk: 16, growthAtk: 2.2, def: 22, growthDef: 2.6, spd: 6, growthSpd: 0.8, evoLevel: 25, evoTarget: "clayback", story: "泥泥驼是性格温吞、耐力超群的地属性宠物。它常年生活在荒凉的隔壁或荒漠中，背上的驼峰由坚硬的矿石构成。它平时行动缓慢，但只要它用力踩踏地面，就能引发局部落石，具有极强的防御力。", illustrations: [], threeViews: { front: "", side: "", back: "" } },
  { id: "clayback", name: "裂地巨兽", element: "earth", avatar: "🐊", fullBody: "🐊⛰️", signatureMove: "地壳崩裂", hp: 185, growthHp: 20, atk: 20, growthAtk: 2.8, def: 28, growthDef: 3.2, spd: 8, growthSpd: 1.0, evoLevel: 0, evoTarget: "", story: "泥泥驼在25级进化后的形态。裂地巨兽体型庞大如小山丘，背部隆起的硬质黏土铠甲能够抵挡几乎所有的物理伤害。它性格沉稳，是绝对可靠的盾牌，一旦发怒，其强力踩踏引发的地壳崩裂会让大地震颤。", illustrations: [], threeViews: { front: "", side: "", back: "" } }
];

const PRESET_SHOP_ITEMS = [
  { id: "food_low", name: "星光莓", category: "food", icon: "🍓", price: 5, effect: 15, desc: "甜滋滋的！喂养后使宠物增加 15 经验值" },
  { id: "food_mid", name: "七彩饼干", category: "food", icon: "🍪", price: 12, effect: 40, desc: "五彩斑斓！喂养后使宠物增加 40 经验值" },
  { id: "food_high", name: "黄金苹果", category: "food", icon: "🍎", price: 25, effect: 100, desc: "蕴藏着纯正能量！喂食后增加 100 经验值" },
  
  { id: "stone_grass", name: "草之结晶", category: "evolution", icon: "🟢", price: 100, effect: 0, desc: "散发着森林气息的晶石。草系叶狐升至20级进化使用。" },
  { id: "stone_fire", name: "火之结晶", category: "evolution", icon: "🔴", price: 100, effect: 0, desc: "温热滚烫的熔岩晶石。火系小火爪升至20级进化使用。" },
  { id: "stone_water", name: "水之结晶", category: "evolution", icon: "🔵", price: 100, effect: 0, desc: "纯净荡漾的激流晶石。水系泡泡鳍升至20级进化使用。" },
  { id: "stone_master", name: "大师进化徽章", category: "evolution", icon: "🏆", price: 250, effect: 0, desc: "最高荣誉的大师徽章。40级宠物进行终极三阶进化使用。" },
  
  { id: "vanity_chef", name: "小厨师帽", category: "vanity", icon: "👩‍🍳", price: 80, effect: 0, desc: "给宠物戴上的精致厨师帽，萌度翻倍！" },
  { id: "vanity_crown", name: "黄金皇冠", category: "vanity", icon: "👑", price: 150, effect: 0, desc: "王者般的尊贵皇冠，彰显霸气！" },
  
  { id: "coupon_friend", name: "同桌体验券 (1天)", category: "coupon", icon: "🎫", price: 150, effect: 0, desc: "可在学校与好朋友申请坐同桌一整天。" },
  { id: "coupon_leader", name: "值日组长体验券 (1周)", category: "coupon", icon: "🎗️", price: 200, effect: 0, desc: "体验当一周的课间值日生组长权力。" },
  { id: "coupon_assistant", name: "小助手特权券 (1天)", category: "coupon", icon: "🛡️", price: 250, effect: 0, desc: "帮老师收发课本、整理教室或代跑腿。" },
  { id: "coupon_nohomework", name: "免写作业券 (1次)", category: "coupon", icon: "🔥", price: 500, effect: 0, desc: "免除一次除期中期末外的功课作业。" }
];

const PRESET_ASSIGNMENTS = [
  { id: 101, title: "分数乘除法口算练习", subject: "数学", description: "完成课本第24页第1到5题，并在本子上写出详细的计算步骤，拍照上传提交。", date: "2026-05-24" },
  { id: 102, title: "课文《春》朗读打卡", subject: "语文", description: "大声朗读课文第三自然段，录音或把熟读确认单拍照提交。", date: "2026-05-23" },
  { id: 103, title: "英语第一单元核心词汇默写", subject: "英语", description: "默写Unit 1的10个重点单词，每词抄写三遍。", date: "2026-05-22" }
];

const PRESET_STUDENTS = [
  {
    id: 1,
    name: "小智 (主角)",
    coins: 160,
    inventory: { "food_low": 3, "food_mid": 1, "food_high": 0, "stone_grass": 0 },
    activePet: {
      assetId: "leafox",
      name: "绿尾叶狐",
      level: 12,
      xp: 450,
      accessories: [] // 皮肤装扮列表
    },
    submissions: [
      { assignmentId: 102, content: "已经朗读完毕，家长检查过，非常流利！", file: "voice_record.mp3", status: "graded", grade: "Good" },
      { assignmentId: 103, content: "单词：apple, banana, orange... 抄写完成了！", file: "english_photo.png", status: "graded", grade: "Excellent" }
    ],
    coupons: [
      { id: "user_c_1", name: "同桌体验券 (1天)", used: false }
    ]
  },
  {
    id: 2,
    name: "小红",
    coins: 80,
    inventory: {},
    activePet: { assetId: "bubblefin", name: "小水泡", level: 16, xp: 800, accessories: [] },
    submissions: [
      { assignmentId: 102, content: "朗读完成打卡", file: "rec.mp3", status: "graded", grade: "Excellent" }
    ],
    coupons: []
  },
  {
    id: 3,
    name: "小刚",
    coins: 40,
    inventory: {},
    activePet: { assetId: "pyroclaw", name: "爆爆熊", level: 9, xp: 200, accessories: ["vanity_chef"] },
    submissions: [],
    coupons: []
  },
  {
    id: 4,
    name: "小华",
    coins: 220,
    inventory: {},
    activePet: { assetId: "sparky", name: "小电光", level: 22, xp: 1900, accessories: [] },
    submissions: [
      { assignmentId: 102, content: "春风吹，吹绿了... 朗读完成！", file: "reading.png", status: "graded", grade: "Excellent" },
      { assignmentId: 103, content: "十个单词已写", file: "words.jpg", status: "graded", grade: "Completed" }
    ],
    coupons: []
  },
  {
    id: 5,
    name: "大雄",
    coins: 10,
    inventory: {},
    activePet: { assetId: "muddy", name: "笨驼驼", element: "earth", level: 5, xp: 400, accessories: [] },
    submissions: [],
    coupons: []
  }
];

// ============================================================================
// 2. 本地数据库读写辅助 (LocalStorage Database Controllers)
// ============================================================================
function dbInit() {
  const SCHEMA_VERSION = "v3";
  const needsReset = localStorage.getItem("EduMoni_Version") !== SCHEMA_VERSION;
  if (!localStorage.getItem("EduMoni_Init") || needsReset) {
    // 强制清除旧版特定的 LocalStorage 数据
    localStorage.removeItem("EduMoni_Pets");
    localStorage.removeItem("EduMoni_Shop");
    localStorage.removeItem("EduMoni_Assignments");
    localStorage.removeItem("EduMoni_Students");
    localStorage.removeItem("EduMoni_Logs");
    
    // 重新写入新版高保真预置数据
    localStorage.setItem("EduMoni_Pets", JSON.stringify(PRESET_PET_ASSETS));
    localStorage.setItem("EduMoni_Shop", JSON.stringify(PRESET_SHOP_ITEMS));
    localStorage.setItem("EduMoni_Assignments", JSON.stringify(PRESET_ASSIGNMENTS));
    localStorage.setItem("EduMoni_Students", JSON.stringify(PRESET_STUDENTS));
    localStorage.setItem("EduMoni_Logs", JSON.stringify([
      { type: "system", text: "系统初始化成功，预置数据库已强制升级至v3版本，已载入三视图及故事资产！" }
    ]));
    localStorage.setItem("EduMoni_Init", "true");
    localStorage.setItem("EduMoni_Version", SCHEMA_VERSION);
  }
}

function getPetsTable() { return JSON.parse(localStorage.getItem("EduMoni_Pets")); }
function savePetsTable(data) { localStorage.setItem("EduMoni_Pets", JSON.stringify(data)); }

function getShopTable() { return JSON.parse(localStorage.getItem("EduMoni_Shop")); }
function saveShopTable(data) { localStorage.setItem("EduMoni_Shop", JSON.stringify(data)); }

function getAssignmentsTable() { return JSON.parse(localStorage.getItem("EduMoni_Assignments")); }
function saveAssignmentsTable(data) { localStorage.setItem("EduMoni_Assignments", JSON.stringify(data)); }

function getStudentsTable() { return JSON.parse(localStorage.getItem("EduMoni_Students")); }
function saveStudentsTable(data) { localStorage.setItem("EduMoni_Students", JSON.stringify(data)); }

function getLogsTable() { return JSON.parse(localStorage.getItem("EduMoni_Logs")); }
function addLog(type, text) {
  const logs = JSON.parse(localStorage.getItem("EduMoni_Logs")) || [];
  logs.unshift({ type, text, time: new Date().toLocaleTimeString() });
  if (logs.length > 50) logs.pop();
  localStorage.setItem("EduMoni_Logs", JSON.stringify(logs));
}

// 初始化
dbInit();

// ============================================================================
// 3. 全局应用状态 (Application State)
// ============================================================================
let appState = {
  currentRole: "student", // "student", "teacher", "admin"
  activeStudentId: 1,     // 默认主角小智
  currentSparringOpponentId: null, // 切磋中选择的同学ID
  battleState: null,       // 对战运行时状态
  dailyBattlesLeft: 3     // 每日切磋限额 (内存状态)
};

// ============================================================================
// 4. 公式计算器 (Stat & Battle Math Calculators)
// ============================================================================

// 4.1 经验值曲线公式
function getXpRequired(level) {
  return Math.floor(10 * Math.pow(level, 1.8) + 15 * level + 20);
}

// 4.2 五维数值计算公式
function getPetStats(petInstance, petAssets) {
  const asset = petAssets.find(a => a.id === petInstance.assetId);
  if (!asset) return { hp: 100, atk: 10, def: 10, spd: 10, element: "grass", signatureMove: "撞击" };

  const level = petInstance.level;
  
  // 计算基础值加每级成长
  let hp = asset.hp + Math.floor(asset.growthHp * (level - 1));
  let atk = asset.atk + Math.floor(asset.growthAtk * (level - 1));
  let def = asset.def + Math.floor(asset.growthDef * (level - 1));
  let spd = asset.spd + Math.floor(asset.growthSpd * (level - 1));

  // 根据当前宠物的进化阶段，提供阶梯性额外实力系数加成
  // 如果是二阶宠物(比如 森狐)，在基础公式上 +20%，如果是终极形态则 +30%
  let multiplier = 1.0;
  if (asset.id.endsWith("crest") || asset.id.endsWith("glide") || asset.id === "fernine" || asset.id === "voltclaw" || asset.id === "clayback") {
    multiplier = 1.2;
  } else if (asset.id.endsWith("drago") || asset.id.endsWith("rax") || asset.id === "sylvaron") {
    multiplier = 1.3;
  }

  hp = Math.floor(hp * multiplier);
  atk = Math.floor(atk * multiplier);
  def = Math.floor(def * multiplier);
  spd = Math.floor(spd * multiplier);

  return {
    hp,
    atk,
    def,
    spd,
    element: asset.element,
    signatureMove: asset.signatureMove,
    avatar: asset.avatar || "🐾",
    fullBody: asset.fullBody || "🐾",
    displayName: petInstance.name || asset.name,
    assetName: asset.name,
    assetId: asset.id,
    power: hp + atk * 4 + def * 4 + spd * 2, // 自定义评估战斗力的公式
    story: asset.story || "",
    illustrations: asset.illustrations || [],
    threeViews: asset.threeViews || { front: "", side: "", back: "" }
  };
}

// 4.3 克制系数判定
function getElementMultiplier(attackerEl, defenderEl) {
  const relations = {
    grass: { earth: 2.0, fire: 0.5 },
    fire: { grass: 2.0, water: 0.5 },
    water: { fire: 2.0, electric: 0.5 },
    electric: { water: 2.0, earth: 0.5 },
    earth: { electric: 2.0, grass: 0.5 }
  };
  
  if (relations[attackerEl] && relations[attackerEl][defenderEl] !== undefined) {
    return relations[attackerEl][defenderEl];
  }
  return 1.0; // 默认普通克制
}

// ============================================================================
// 5. UI 渲染引擎 (Views & Layout Rendering)
// ============================================================================

// 5.1 切换角色视图
function switchRole(roleName) {
  appState.currentRole = roleName;
  
  // 更新导航激活状态
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === roleName);
  });

  // 隐藏所有面板并显示当前角色面板
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  
  const targetPanel = document.getElementById(`${roleName}-view`);
  if (targetPanel) targetPanel.classList.add("active");

  // 触发该角色下的首个活动Tab的渲染
  const activeTabBtn = targetPanel.querySelector(".tab-btn.active");
  if (activeTabBtn) {
    switchTab(roleName, activeTabBtn.dataset.target);
  }
}

// 5.2 切换角色下的子选项卡
function switchTab(roleName, tabTargetId) {
  const container = document.getElementById(`${roleName}-view`);
  if (!container) return;

  // 更新Tab按钮高亮
  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === tabTargetId);
  });

  // 显示隐藏对应的子面板
  container.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === tabTargetId);
  });

  // 执行特定的重绘逻辑
  renderActiveTab(tabTargetId);
}

// 5.3 派发渲染逻辑
function renderActiveTab(tabId) {
  switch (tabId) {
    // 学生端
    case "student-pet-center":
      renderStudentPetCenter();
      break;
    case "student-encyclopedia":
      renderStudentEncyclopedia();
      break;
    case "student-photo-garden":
      renderStudentPhotoGarden();
      break;
    case "student-shop":
      renderStudentShop();
      break;
    case "student-arena":
      renderStudentArena();
      break;
    case "student-homework":
      renderStudentHomework();
      break;
      
    // 教师端
    case "teacher-homework-tab":
      renderTeacherHomework();
      break;
    case "teacher-grading-tab":
      renderTeacherGradingQueue();
      break;
    case "teacher-audit-tab":
      renderTeacherClassStats();
      break;

    // 管理员端
    case "admin-pet-assets":
      renderAdminPetAssets();
      break;
    case "admin-shop-management":
      renderAdminShopItems();
      break;
  }
}

// ============================================================================
// 6. 学生端业务模块 (Student View Controllers)
// ============================================================================

// 6.1 渲染培育中心
function renderStudentPetCenter() {
  const students = getStudentsTable();
  const pets = getPetsTable();
  const student = students.find(s => s.id === appState.activeStudentId);
  if (!student) return;

  const petInst = student.activePet;
  const stats = getPetStats(petInst, pets);
  const nextXpRequired = getXpRequired(petInst.level);

  // 1. 基本文本与图标渲染
  document.getElementById("active-pet-name").innerText = stats.displayName;
  
  const elBadge = document.getElementById("active-pet-element");
  elBadge.innerText = stats.element === "grass" ? "🌿 草系" : 
                       stats.element === "fire" ? "🔥 火系" : 
                       stats.element === "water" ? "💧 水系" : 
                       stats.element === "electric" ? "⚡ 电系" : "⛰️ 地系";
  elBadge.className = `element-badge ${stats.element}`;
  
  document.getElementById("active-pet-level").innerText = petInst.level;

  // 2. 数值进度条
  const xpPct = Math.min(100, (petInst.xp / nextXpRequired) * 100);
  document.getElementById("active-pet-xp-text").innerText = `${petInst.xp} / ${nextXpRequired}`;
  document.getElementById("active-pet-xp-bar").style.width = `${xpPct}%`;

  document.getElementById("active-pet-hp-text").innerText = `${stats.hp} / ${stats.hp}`;
  document.getElementById("active-pet-hp-bar").style.width = `100%`;

  // 3. 五维具体数额
  document.getElementById("active-pet-atk").innerText = stats.atk;
  document.getElementById("active-pet-def").innerText = stats.def;
  document.getElementById("active-pet-spd").innerText = stats.spd;
  document.getElementById("active-pet-power").innerText = stats.power;

  // 4. 立绘与背景发光
  const spriteBox = document.getElementById("active-pet-sprite");
  // 采用 Emoji 动态字渲染，而不是图片，由于没有静态图资产，把 Emoji 写在 src 处不可行，
  // 我们检测是否是 Emoji，如果是直接将其包裹或通过生成 Canvas 的方式；为了精美，直接将 Emoji 塞入父盒子，并隐藏原生 img。
  const wrapper = document.querySelector(".pet-avatar-wrapper");
  let emojiDiv = wrapper.querySelector(".emoji-renderer");
  if (!emojiDiv) {
    emojiDiv = document.createElement("div");
    emojiDiv.className = "emoji-renderer";
    emojiDiv.style.fontSize = "120px";
    emojiDiv.style.userSelect = "none";
    wrapper.appendChild(emojiDiv);
  }
  
  if (stats.fullBody.length <= 4) {
    // 它是 Emoji
    spriteBox.style.display = "none";
    emojiDiv.style.display = "block";
    emojiDiv.innerText = stats.fullBody;
  } else {
    // 它可能是一个 URL，尝试展示 img
    spriteBox.style.display = "block";
    emojiDiv.style.display = "none";
    spriteBox.src = stats.fullBody;
  }

  // 渲染皮肤装扮 (附件饰品)
  const accessoryContainer = document.getElementById("pet-accessory-container");
  accessoryContainer.innerHTML = "";
  if (petInst.accessories && petInst.accessories.length > 0) {
    const shopTable = getShopTable();
    petInst.accessories.forEach(accId => {
      const item = shopTable.find(i => i.id === accId);
      if (item) {
        const accSpan = document.createElement("span");
        accSpan.className = "pet-accessory";
        accSpan.innerText = item.icon;
        accSpan.style.fontSize = "40px";
        accSpan.style.position = "absolute";
        accSpan.style.top = "-20px";
        accSpan.style.left = "40px";
        accessoryContainer.appendChild(accSpan);
      }
    });
  }

  // 发光底色
  const underglow = document.getElementById("pet-underglow");
  underglow.style.backgroundColor = `var(--color-${stats.element})`;

  // 5. 渲染饲料快捷栏
  const foodInv = document.getElementById("food-inventory-row");
  foodInv.innerHTML = "";
  const shopTable = getShopTable();
  const foods = shopTable.filter(i => i.category === "food");

  foods.forEach(food => {
    const count = student.inventory[food.id] || 0;
    const btn = document.createElement("button");
    btn.className = `food-item-btn ${count === 0 ? 'disabled' : ''}`;
    btn.innerHTML = `${food.icon} ${food.name} <strong style="color:var(--accent-cyan)">x${count}</strong>`;
    
    if (count > 0) {
      btn.onclick = () => feedActivePet(food.id);
      
      // 添加原生拖拽支持
      btn.draggable = true;
      btn.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", food.id);
      };
    } else {
      btn.onclick = () => alert("您的背包中没有这种饲料，请前往商店购买！");
    }
    foodInv.appendChild(btn);
  });

  // 支持拖拽到宠物框喂食
  const showcase = document.querySelector(".pet-showcase-panel");
  showcase.ondragover = (e) => e.preventDefault();
  showcase.ondrop = (e) => {
    e.preventDefault();
    const foodId = e.dataTransfer.getData("text/plain");
    if (foodId) feedActivePet(foodId);
  };

  // 6. 渲染进化线指示器
  renderEvolutionTimeline(petInst, pets);
}

// 渲染进化线时间轴
function renderEvolutionTimeline(petInst, pets) {
  const container = document.getElementById("evo-timeline-container");
  container.innerHTML = "";

  // 寻找该宠物的全部进化链条
  // 需要自底向上或自顶向下搜索。最简单的是遍历全局宠物库，拼凑关联。
  const asset = pets.find(a => a.id === petInst.assetId);
  if (!asset) return;

  // 搜寻整条进化路径
  let chain = [];
  
  // 1. 尝试溯源寻找最初形态
  let root = asset;
  let loops = 0;
  while (loops < 10) {
    const parent = pets.find(a => a.evoTarget === root.id);
    if (!parent) break;
    root = parent;
    loops++;
  }

  // 2. 从 root 自顶向下构建 Evolution Chain
  let current = root;
  loops = 0;
  while (current && loops < 10) {
    chain.push(current);
    if (current.evoTarget) {
      current = pets.find(a => a.id === current.evoTarget);
    } else {
      current = null;
    }
    loops++;
  }

  // 3. 渲染
  chain.forEach((node, idx) => {
    const isCurrent = node.id === petInst.assetId;
    const isUnlocked = chain.indexOf(asset) >= idx;

    const step = document.createElement("div");
    step.className = `evo-step ${isCurrent ? 'active' : ''} ${isUnlocked ? 'completed' : ''}`;
    step.innerHTML = `
      <div class="evo-icon-wrap" title="${node.name}">
        <span>${node.avatar || '🐾'}</span>
      </div>
      <span class="evo-name">${node.name}</span>
      <span class="evo-lvl">${idx === 0 ? '初始' : idx === 1 ? 'Lv.20 进化' : 'Lv.40 进化'}</span>
    `;

    // 绑定点击进化检测
    if (isCurrent && node.evoTarget && petInst.level >= node.evoLevel) {
      const evoBtn = document.createElement("button");
      evoBtn.className = "primary-btn";
      evoBtn.style.padding = "2px 8px";
      evoBtn.style.fontSize = "10px";
      evoBtn.style.marginTop = "4px";
      evoBtn.innerText = "触发进化";
      evoBtn.onclick = () => triggerPetEvolution(node);
      step.appendChild(evoBtn);
    }

    container.appendChild(step);

    if (idx < chain.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "evo-arrow";
      arrow.innerHTML = "➜";
      container.appendChild(arrow);
    }
  });
}

// 喂养宠物逻辑
function feedActivePet(foodId) {
  const students = getStudentsTable();
  const shopItems = getShopTable();
  const student = students.find(s => s.id === appState.activeStudentId);
  const food = shopItems.find(i => i.id === foodId);

  if (!student || !food || !student.inventory[foodId] || student.inventory[foodId] <= 0) return;

  // 扣减饲料并增加经验
  student.inventory[foodId]--;
  const pet = student.activePet;
  pet.xp += food.effect;

  // 飞字动效 (Floating text)
  createFloatingText(`+${food.effect} XP`, "xp");

  // 判断是否升级
  let levelUpOccurred = false;
  let nextReq = getXpRequired(pet.level);
  while (pet.xp >= nextReq && pet.level < 100) {
    pet.xp -= nextReq;
    pet.level++;
    levelUpOccurred = true;
    nextReq = getXpRequired(pet.level);
  }

  if (levelUpOccurred) {
    createFloatingText("LEVEL UP! 🎉", "heal");
    addLog("system", `${student.name} 的宠物 ${pet.name} 升级至了等级 ${pet.level}!`);
    // 震屏动效
    const showcase = document.querySelector(".pet-showcase-panel");
    showcase.classList.add("damaged-shake");
    setTimeout(() => showcase.classList.remove("damaged-shake"), 400);
  }

  saveStudentsTable(students);
  renderStudentPetCenter();
}

// 飞字动效生成器
function createFloatingText(text, type) {
  const wrapper = document.querySelector(".pet-avatar-wrapper");
  const bubble = document.createElement("div");
  bubble.className = `damage-bubble ${type === 'heal' ? 'heal' : ''}`;
  bubble.innerText = text;
  bubble.style.left = `${Math.random() * 80 + 80}px`;
  bubble.style.top = `${Math.random() * 80 + 50}px`;
  wrapper.appendChild(bubble);
  setTimeout(() => bubble.remove(), 800);
}

// 触发进化事件
function triggerPetEvolution(currentNodeAsset) {
  const students = getStudentsTable();
  const student = students.find(s => s.id === appState.activeStudentId);
  const petInst = student.activePet;
  const pets = getPetsTable();
  
  const targetAsset = pets.find(a => a.id === currentNodeAsset.evoTarget);
  if (!targetAsset) return;

  // 检查是否具备进化石
  // 规则：一阶到二阶需对应属性进化石，二阶到三阶需大师进化徽章
  let requiredStoneId = "";
  if (currentNodeAsset.evoLevel === 20) {
    requiredStoneId = `stone_${currentNodeAsset.element}`;
  } else {
    requiredStoneId = "stone_master";
  }

  const stoneCount = student.inventory[requiredStoneId] || 0;
  const shopTable = getShopTable();
  const stoneName = shopTable.find(i => i.id === requiredStoneId)?.name || "进化素材";

  if (stoneCount <= 0) {
    alert(`进化失败！您的背包中没有 【${stoneName}】。请前往商店购买！`);
    return;
  }

  // 扣减石头，触发蜕变
  student.inventory[requiredStoneId]--;
  petInst.assetId = targetAsset.id;
  // 更改名字（若为默认名字则更新）
  if (petInst.name === currentNodeAsset.name || petInst.name.includes("叶狐") || petInst.name.includes("火爪") || petInst.name.includes("泡泡")) {
    petInst.name = targetAsset.name;
  }

  // 激发进化觉醒 CSS 动效
  const petSprite = document.getElementById("active-pet-sprite");
  const emojiRenderer = document.querySelector(".emoji-renderer");
  
  const animeTarget = petSprite.style.display === "block" ? petSprite : emojiRenderer;
  if (animeTarget) {
    animeTarget.classList.add("evolving");
    setTimeout(() => {
      animeTarget.classList.remove("evolving");
    }, 2500);
  }

  addLog("system", `太棒了！${student.name} 的宠物进化成为了【${targetAsset.name}】！`);
  saveStudentsTable(students);

  setTimeout(() => {
    renderStudentPetCenter();
  }, 1000);
}

// 6.2 渲染班级大合影页面 (Class Photo Garden)
function renderStudentPhotoGarden() {
  const students = getStudentsTable();
  const pets = getPetsTable();
  const container = document.getElementById("garden-playground");
  container.innerHTML = "";

  students.forEach((student, index) => {
    const petInst = student.activePet;
    const stats = getPetStats(petInst, pets);

    const card = document.createElement("div");
    card.className = "garden-card";
    // 随机动画时间偏差，防止所有人摆动一致
    card.style.animationDelay = `${-0.8 * index}s`;

    // 根据宠物等级决定卡片及大小
    let sizeClass = petInst.level >= 40 ? 'large-pet' : petInst.level >= 20 ? 'mid-pet' : 'small-pet';
    let cardScale = petInst.level >= 40 ? 1.2 : petInst.level >= 20 ? 1.05 : 0.95;
    card.style.transform = `scale(${cardScale})`;

    const spriteHtml = stats.fullBody.length > 4 
      ? `<img src="${stats.fullBody}" class="garden-sprite-img" style="width:80px; height:80px; object-fit:contain; margin-bottom:6px;">`
      : `<div style="font-size: 50px; height:80px; display:flex; align-items:center; justify-content:center; margin-bottom: 6px; user-select:none;">${stats.fullBody}</div>`;

    card.innerHTML = `
      ${spriteHtml}
      <div class="garden-card-name">${stats.displayName}</div>
      <div class="garden-card-owner">${student.name} (Lv. ${petInst.level})</div>
      
      <!-- 悬浮名片详情 (Tooltip) -->
      <div class="garden-tooltip">
        <div style="font-size:32px; float:right; margin-left:8px;">${stats.avatar.length > 4 ? `<img src="${stats.avatar}" style="width:32px; height:32px; object-fit:contain;">` : stats.avatar}</div>
        <div class="tooltip-line"><strong>学生:</strong> ${student.name}</div>
        <div class="tooltip-line"><strong>宠物:</strong> ${stats.displayName} (${stats.assetName})</div>
        <div class="tooltip-line"><strong>等级:</strong> Lv. ${petInst.level}</div>
        <div class="tooltip-line"><strong>属性:</strong> <span class="element-badge ${stats.element}" style="font-size:9px; padding:1px 4px;">${stats.element}</span></div>
        <div class="tooltip-line"><strong>金币值:</strong> 🪙 ${student.coins}</div>
        <div class="tooltip-line"><strong>总战力:</strong> ${stats.power}</div>
      </div>
    `;

    // 交互点击事件
    card.onclick = () => {
      // 触发跳跃或转圈音效及震动
      card.style.animation = "strike-shake 0.4s ease-in-out";
      setTimeout(() => {
        card.style.animation = "float 4s ease-in-out infinite";
        card.style.animationDelay = `${-0.8 * index}s`;
      }, 450);
    };

    container.appendChild(card);
  });
}

// 6.3 渲染积分商城
function renderStudentShop() {
  const students = getStudentsTable();
  const shopItems = getShopTable();
  const student = students.find(s => s.id === appState.activeStudentId);
  if (!student) return;

  // 钱包余额
  document.getElementById("student-coins-val").innerText = student.coins;

  const catalog = document.getElementById("shop-catalog-grid");
  catalog.innerHTML = "";

  shopItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "glass-panel shop-item-card";
    
    let catName = item.category === "food" ? "饲料" : 
                  item.category === "evolution" ? "进化晶石" : 
                  item.category === "vanity" ? "装饰品" : "课堂特权卡券";

    card.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div style="font-size: 11px; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 2px;">${catName}</div>
      <div class="shop-item-name">${item.name}</div>
      <p class="shop-item-desc">${item.desc}</p>
      <div class="shop-item-footer">
        <span class="shop-item-price">🪙 ${item.price}</span>
        <button class="primary-btn" style="padding: 6px 12px; font-size:12px;" onclick="buyShopItem('${item.id}')">购买</button>
      </div>
    `;
    catalog.appendChild(card);
  });
}

// 购买商品
function buyShopItem(itemId) {
  const students = getStudentsTable();
  const shopItems = getShopTable();
  const student = students.find(s => s.id === appState.activeStudentId);
  const item = shopItems.find(i => i.id === itemId);

  if (!student || !item) return;

  if (student.coins < item.price) {
    alert("金币不足！多写作业或积极表现来赚取金币吧！");
    return;
  }

  // 扣减金币
  student.coins -= item.price;
  addLog("shop", `${student.name} 消费 🪙${item.price} 购买了 【${item.name}】`);

  // 发放物品
  if (item.category === "coupon") {
    // 特权卡券，放入兑换券列表
    if (!student.coupons) student.coupons = [];
    const couponInstance = {
      id: "c_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: item.name,
      used: false
    };
    student.coupons.push(couponInstance);
    alert(`购买成功！【${item.name}】已放入您的卡券包。请向老师出示以履行特权！`);
  } else if (item.category === "vanity") {
    // 宠物皮肤装扮，直接装备到宠物
    if (!student.activePet.accessories) student.activePet.accessories = [];
    if (!student.activePet.accessories.includes(item.id)) {
      student.activePet.accessories.push(item.id);
      alert(`购买成功！宠物已自动装备了 ${item.name}！`);
    } else {
      alert(`您已经拥有并为宠物配备了 ${item.name}！金币已退还。`);
      student.coins += item.price; // 退款
    }
  } else {
    // 饲料或进化素材，放入背包
    if (!student.inventory) student.inventory = {};
    student.inventory[item.id] = (student.inventory[item.id] || 0) + 1;
    alert(`购买成功！已将 1个【${item.name}】放入背包！`);
  }

  saveStudentsTable(students);
  renderStudentShop();
}

// 6.4 渲染宠物切磋模块 (Arena)
function renderStudentArena() {
  const students = getStudentsTable();
  const pets = getPetsTable();
  
  // 更新剩余次数
  document.getElementById("arena-daily-count").innerText = appState.dailyBattlesLeft;

  // 1. 渲染切磋对手列表
  const oppList = document.getElementById("arena-opponents-list");
  oppList.innerHTML = "";

  students.forEach(student => {
    // 不能跟自己对战
    if (student.id === appState.activeStudentId) return;

    const petInst = student.activePet;
    const stats = getPetStats(petInst, pets);

    const card = document.createElement("div");
    card.className = "garden-card";
    card.style.animation = "none";
    
    const avatarHtml = stats.avatar.length > 4
      ? `<img src="${stats.avatar}" style="width:40px; height:40px; object-fit:contain; margin-bottom:4px;">`
      : `<div style="font-size: 40px; height:40px; display:flex; align-items:center; justify-content:center; margin-bottom: 4px; user-select:none;">${stats.avatar}</div>`;

    card.innerHTML = `
      ${avatarHtml}
      <div style="font-size:12px; font-weight:700;">${student.name} 的宠物</div>
      <div style="font-size:11px; color:var(--text-muted);">${stats.displayName} (Lv. ${petInst.level})</div>
      <button class="primary-btn" style="padding: 4px 8px; font-size:10px; margin-top:8px;">发起切磋</button>
    `;

    card.onclick = () => {
      startSparringMatch(student.id);
    };

    oppList.appendChild(card);
  });

  // 2. 渲染对阵角色 Sprite 占位（当无对战时）
  if (!appState.battleState) {
    const mainStudent = students.find(s => s.id === appState.activeStudentId);
    const myStats = getPetStats(mainStudent.activePet, pets);
    
    document.getElementById("player-pet-name").innerText = myStats.displayName;
    document.getElementById("player-pet-level").innerText = mainStudent.activePet.level;
    document.getElementById("player-pet-element").innerText = myStats.element.toUpperCase();
    document.getElementById("player-pet-element").className = `element-badge ${myStats.element}`;
    document.getElementById("player-hp-text").innerText = `${myStats.hp}/${myStats.hp}`;
    document.getElementById("player-hp-bar").style.width = "100%";
    
    // 渲染 Sprite (Emoji)
    const pSpriteImg = document.getElementById("player-pet-sprite");
    const pBox = pSpriteImg.parentElement;
    let pEmoji = pBox.querySelector(".emoji-renderer-arena");
    if (!pEmoji) {
      pEmoji = document.createElement("div");
      pEmoji.className = "emoji-renderer-arena";
      pEmoji.style.fontSize = "70px";
      pBox.appendChild(pEmoji);
    }
    if (myStats.fullBody.length <= 4) {
      pSpriteImg.style.display = "none";
      pEmoji.innerText = myStats.fullBody;
      pEmoji.style.display = "block";
    } else {
      pSpriteImg.style.display = "block";
      pSpriteImg.src = myStats.fullBody;
      pEmoji.style.display = "none";
    }

    // Opponent clear
    document.getElementById("opp-pet-name").innerText = "暂无对手";
    document.getElementById("opp-pet-level").innerText = "-";
    document.getElementById("opp-hp-text").innerText = "0/0";
    document.getElementById("opp-hp-bar").style.width = "0%";
    document.getElementById("opp-pet-sprite").style.display = "none";
    const oBox = document.getElementById("opp-pet-sprite").parentElement;
    let oEmoji = oBox.querySelector(".emoji-renderer-arena");
    if (oEmoji) oEmoji.style.display = "none";

    // 禁用技能面板
    document.getElementById("arena-skills-deck").innerHTML = `
      <div style="grid-column: span 2; text-align:center; padding: 20px; color:var(--text-muted);">
        请在下方列表选择一位同学的宠物进行友好切磋！
      </div>
    `;
  }
}

// 开始对战
function startSparringMatch(opponentStudentId) {
  if (appState.dailyBattlesLeft <= 0) {
    alert("今天切磋次数已满！多去写写作业，明天再来竞技场吧。");
    return;
  }

  const students = getStudentsTable();
  const pets = getPetsTable();

  const playerStudent = students.find(s => s.id === appState.activeStudentId);
  const oppStudent = students.find(s => s.id === opponentStudentId);

  if (!playerStudent || !oppStudent) return;

  const playerPetStats = getPetStats(playerStudent.activePet, pets);
  const oppPetStats = getPetStats(oppStudent.activePet, pets);

  // 初始化战斗状态机
  appState.battleState = {
    player: {
      id: playerStudent.id,
      name: playerStudent.name,
      displayName: playerPetStats.displayName,
      element: playerPetStats.element,
      hp: playerPetStats.hp,
      maxHp: playerPetStats.hp,
      atk: playerPetStats.atk,
      def: playerPetStats.def,
      spd: playerPetStats.spd,
      sprite: playerPetStats.fullBody,
      avatar: playerPetStats.avatar,
      signatureMove: playerPetStats.signatureMove,
      shieldActive: false,
      cooldowns: { elemental: 0, heal: 0, shield: 0 }
    },
    opponent: {
      id: oppStudent.id,
      name: oppStudent.name,
      displayName: oppPetStats.displayName,
      element: oppPetStats.element,
      hp: oppPetStats.hp,
      maxHp: oppPetStats.hp,
      atk: oppPetStats.atk,
      def: oppPetStats.def,
      spd: oppPetStats.spd,
      sprite: oppPetStats.fullBody,
      avatar: oppPetStats.avatar,
      signatureMove: oppPetStats.signatureMove,
      shieldActive: false,
      cooldowns: { elemental: 0, heal: 0, shield: 0 }
    },
    round: 1,
    logs: []
  };

  appState.dailyBattlesLeft--;
  document.getElementById("arena-daily-count").innerText = appState.dailyBattlesLeft;

  // 1. 设置战场 UI
  document.getElementById("opp-pet-name").innerText = oppPetStats.displayName;
  document.getElementById("opp-pet-level").innerText = oppStudent.activePet.level;
  document.getElementById("opp-pet-element").innerText = oppPetStats.element.toUpperCase();
  document.getElementById("opp-pet-element").className = `element-badge ${oppPetStats.element}`;
  document.getElementById("opp-hp-text").innerText = `${oppPetStats.hp}/${oppPetStats.hp}`;
  document.getElementById("opp-hp-bar").style.width = "100%";

  const oSpriteImg = document.getElementById("opp-pet-sprite");
  const oBox = oSpriteImg.parentElement;
  let oEmoji = oBox.querySelector(".emoji-renderer-arena");
  if (!oEmoji) {
    oEmoji = document.createElement("div");
    oEmoji.className = "emoji-renderer-arena";
    oEmoji.style.fontSize = "70px";
    oBox.appendChild(oEmoji);
  }
  if (oppPetStats.fullBody.length <= 4) {
    oSpriteImg.style.display = "none";
    oEmoji.innerText = oppPetStats.fullBody;
    oEmoji.style.display = "block";
  } else {
    oSpriteImg.style.display = "block";
    oSpriteImg.src = oppPetStats.fullBody;
    oEmoji.style.display = "none";
  }

  // 2. 清空并初始日志
  const logBox = document.getElementById("arena-battle-logs");
  logBox.innerHTML = `<div class="battle-log-entry system">⚔️ 战斗开始！双方宠物就位：【${playerPetStats.displayName}】 VS 【${oppPetStats.displayName}】！</div>`;
  
  // 3. 判断先手
  let isPlayerTurn = playerPetStats.spd >= oppPetStats.spd;
  logBox.innerHTML += `<div class="battle-log-entry system">💨 速度比拼：【${isPlayerTurn ? playerPetStats.displayName : oppPetStats.displayName}】获得先手优势！</div>`;

  // 渲染技能按钮
  renderBattleSkills();

  // 如果是对手机会，先执行对手 AI 回合
  if (!isPlayerTurn) {
    setTimeout(executeOpponentTurn, 1200);
  }
}

// 渲染对战技能按钮
function renderBattleSkills() {
  const container = document.getElementById("arena-skills-deck");
  container.innerHTML = "";

  const state = appState.battleState;
  if (!state) return;

  const player = state.player;

  const skills = [
    { type: "strike", name: "普通冲撞", desc: "物理攻击，威力 10", cdKey: "none", maxCd: 0 },
    { type: "element", name: player.signatureMove, desc: `${player.element.toUpperCase()}属性招式，威力 20`, cdKey: "elemental", maxCd: 2 },
    { type: "shield", name: "防御护盾", desc: "免除下一回合 50% 伤害", cdKey: "shield", maxCd: 1 },
    { type: "heal", name: "树果饱餐", desc: "恢复 25% 最大生命值", cdKey: "heal", maxCd: 3 }
  ];

  skills.forEach(skill => {
    const btn = document.createElement("button");
    btn.className = `skill-btn ${player.element}-element`;
    
    let cd = 0;
    if (skill.cdKey !== "none") {
      cd = player.cooldowns[skill.cdKey];
    }

    const isCd = cd > 0;
    btn.disabled = isCd;

    btn.innerHTML = `
      <div class="skill-btn-title">
        <span>${skill.name}</span>
        ${isCd ? `<span class="skill-cooldown">冷却中 (${cd}T)</span>` : ''}
      </div>
      <div class="skill-btn-sub">${skill.desc}</div>
    `;

    if (!isCd) {
      btn.onclick = () => handlePlayerAction(skill.type);
    }

    container.appendChild(btn);
  });
}

// 玩家操作响应
function handlePlayerAction(actionType) {
  const state = appState.battleState;
  if (!state) return;

  // 禁用所有按键防止连点
  document.querySelectorAll(".skill-btn").forEach(b => b.disabled = true);

  // 执行动作
  executeAction("player", "opponent", actionType);

  // 检查结束
  if (checkBattleEnd()) return;

  // 进入对手回合
  setTimeout(executeOpponentTurn, 1500);
}

// 敌方 AI 决策
function executeOpponentTurn() {
  const state = appState.battleState;
  if (!state) return;

  const opp = state.opponent;
  let actionType = "strike";

  // 简易智能 AI：
  // 1. 生命低于 40% 且治疗技能可用时优先治疗
  if (opp.hp / opp.maxHp < 0.4 && opp.cooldowns.heal === 0) {
    actionType = "heal";
  }
  // 2. 元素招式可用则概率释放
  else if (opp.cooldowns.elemental === 0 && Math.random() < 0.6) {
    actionType = "element";
  }
  // 3. 概率开盾
  else if (opp.cooldowns.shield === 0 && Math.random() < 0.4) {
    actionType = "shield";
  }

  executeAction("opponent", "player", actionType);

  // 检查结束
  if (checkBattleEnd()) return;

  // 冷却扣减
  updateCooldowns("player");
  renderBattleSkills();
}

// 执行技能数值运算与动效
function executeAction(attackerKey, defenderKey, actionType) {
  const state = appState.battleState;
  const attacker = state[attackerKey];
  const defender = state[defenderKey];

  const logBox = document.getElementById("arena-battle-logs");
  let logText = "";
  let logClass = "strike";

  // 移除双方已存有的盾标记 (护盾持续1回合)
  if (attacker.shieldActive) attacker.shieldActive = false;

  if (actionType === "strike" || actionType === "element") {
    // 1. 物理/属性攻击
    const isElement = actionType === "element";
    const movePower = isElement ? 20 : 10;
    const isPlayerAttacking = attackerKey === "player";
    
    // 计算属性倍率
    let elMult = 1.0;
    if (isElement) {
      elMult = getElementMultiplier(attacker.element, defender.element);
      logClass = "effect";
    }

    // 随机上下 5% 浮动
    const randomFactor = 0.95 + Math.random() * 0.1;
    
    // 伤害公式
    let damage = Math.floor(((attacker.atk * movePower) / (defender.def + 20) + 5) * elMult * randomFactor);
    
    // 检查防守方是否开盾
    if (defender.shieldActive) {
      damage = Math.floor(damage * 0.5);
      logText += `🛡️ 【${defender.displayName}】的防守护盾抵挡了半数伤害！`;
    }

    defender.hp = Math.max(0, defender.hp - damage);

    // 日志
    let elText = isElement ? `释放属性绝招【${attacker.signatureMove}】` : "使出【普通撞击】";
    let multText = elMult > 1.0 ? "，效果绝佳！💥" : elMult < 1.0 ? "，收效甚微... 💧" : "";
    logText += `⚔️ 【${attacker.displayName}】${elText}，对【${defender.displayName}】造成了 **${damage}** 点伤害${multText}`;

    // 动效：受击闪烁与晃动
    animateStrike(defenderKey, damage, false);

    // 设置 CD
    if (isElement) attacker.cooldowns.elemental = 3; // 冷却 2 回合 (自身下回合+下下回合)

  } else if (actionType === "shield") {
    // 2. 护盾开启
    attacker.shieldActive = true;
    attacker.cooldowns.shield = 2; // 冷却1回合
    logClass = "system";
    logText = `🛡️ 【${attacker.displayName}】张开了结界护盾，下一回合受击伤害减半！`;

  } else if (actionType === "heal") {
    // 3. 树果治疗
    const healVal = Math.floor(attacker.maxHp * 0.25);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + healVal);
    attacker.cooldowns.heal = 4; // 冷却3回合
    logClass = "heal";
    logText = `🍒 【${attacker.displayName}】狼吞虎咽地吃下了星光莓，恢复了 **${healVal}** 点生命值！`;
    
    // 动效：绿字漂浮
    animateStrike(attackerKey, healVal, true);
  }

  // 往日志板添加
  logBox.innerHTML += `<div class="battle-log-entry ${logClass}">${logText}</div>`;
  logBox.scrollTop = logBox.scrollHeight;

  // 更新血条 Hud 显示
  updateBattleHud();
}

// 攻击特效渲染
function animateStrike(targetKey, num, isHeal) {
  // 1. 血条数值动画浮字
  const spriteImg = document.getElementById(`${targetKey}-pet-sprite`);
  const box = spriteImg.parentElement;
  
  const bubble = document.createElement("div");
  bubble.className = `damage-bubble ${isHeal ? 'heal' : ''}`;
  bubble.innerText = `${isHeal ? '+' : '-'}${num}`;
  bubble.style.left = "40px";
  bubble.style.top = "40px";
  box.appendChild(bubble);
  setTimeout(() => bubble.remove(), 800);

  // 2. 震屏受击效果
  if (!isHeal) {
    const parentBox = spriteImg.closest(".battle-participant");
    if (parentBox) {
      parentBox.classList.add("damaged-shake");
      setTimeout(() => parentBox.classList.remove("damaged-shake"), 400);
    }
  }
}

// 更新对战血条
function updateBattleHud() {
  const state = appState.battleState;
  if (!state) return;

  const playerPct = (state.player.hp / state.player.maxHp) * 100;
  document.getElementById("player-hp-bar").style.width = `${playerPct}%`;
  document.getElementById("player-hp-text").innerText = `${state.player.hp}/${state.player.maxHp}`;

  const oppPct = (state.opponent.hp / state.opponent.maxHp) * 100;
  document.getElementById("opp-hp-bar").style.width = `${oppPct}%`;
  document.getElementById("opp-hp-text").innerText = `${state.opponent.hp}/${state.opponent.maxHp}`;
}

// 更新技能CD
function updateCooldowns(roleKey) {
  const state = appState.battleState;
  if (!state) return;

  const cds = state[roleKey].cooldowns;
  for (let key in cds) {
    if (cds[key] > 0) cds[key]--;
  }

  const otherCds = state[roleKey === "player" ? "opponent" : "player"].cooldowns;
  for (let key in otherCds) {
    if (otherCds[key] > 0) otherCds[key]--;
  }
}

// 检查对战是否结束
function checkBattleEnd() {
  const state = appState.battleState;
  if (!state) return false;

  const logBox = document.getElementById("arena-battle-logs");
  let gameOver = false;
  let isWin = false;

  if (state.opponent.hp <= 0) {
    gameOver = true;
    isWin = true;
  } else if (state.player.hp <= 0) {
    gameOver = true;
    isWin = false;
  }

  if (gameOver) {
    // 结算逻辑发放奖励
    const students = getStudentsTable();
    const student = students.find(s => s.id === appState.activeStudentId);
    
    let coinReward = isWin ? 5 : 2;
    let xpReward = isWin ? 20 : 5;

    // 修改金币及宠物经验
    student.coins += coinReward;
    const pet = student.activePet;
    pet.xp += xpReward;

    // 升级检测
    let leveled = false;
    let nextReq = getXpRequired(pet.level);
    while (pet.xp >= nextReq && pet.level < 100) {
      pet.xp -= nextReq;
      pet.level++;
      leveled = true;
      nextReq = getXpRequired(pet.level);
    }

    saveStudentsTable(students);

    // 弹出浮层
    const overlay = document.getElementById("arena-result-overlay");
    const title = document.getElementById("battle-result-title");
    const reward = document.getElementById("battle-result-reward");

    overlay.style.display = "flex";
    if (isWin) {
      title.innerText = "切磋胜利！🏆";
      title.className = "result-title win";
      reward.innerHTML = `恭喜你赢得了胜利！<br>获得奖励：🪙 <strong>${coinReward}</strong> 金币，宠物经验 🌟 <strong>${xpReward} XP</strong>！${leveled ? '<br><span style="color:#00e676; font-weight:800;">您的宠物升级啦！</span>' : ''}`;
      addLog("battle", `${student.name} 切磋击败了同学，宠物获得 ${xpReward} XP`);
    } else {
      title.innerText = "切磋结束！💤";
      title.className = "result-title lose";
      reward.innerHTML = `宠物体力耗尽，回去睡个大午觉吧！<br>获得鼓励奖励：🪙 <strong>${coinReward}</strong> 金币，宠物经验 🌟 <strong>${xpReward} XP</strong>！${leveled ? '<br><span style="color:#00e676; font-weight:800;">您的宠物升级啦！</span>' : ''}`;
      addLog("battle", `${student.name} 切磋惜败同学，宠物获得 ${xpReward} XP`);
    }

    // 重置内存对战状态
    appState.battleState = null;
    return true;
  }

  return false;
}

// 6.5 渲染作业提交端 (Student Homework)
function renderStudentHomework() {
  const students = getStudentsTable();
  const assignments = getAssignmentsTable();
  const student = students.find(s => s.id === appState.activeStudentId);
  if (!student) return;

  const tbody = document.getElementById("student-homework-tbody");
  tbody.innerHTML = "";

  assignments.forEach(task => {
    // 检查此作业该学生的提交状态
    const submission = student.submissions.find(sub => sub.assignmentId === task.id);
    
    let statusText = "";
    let actionHtml = "";

    if (!submission) {
      statusText = `<span class="badge-pending">待完成</span>`;
      actionHtml = `<button class="primary-btn" style="padding:4px 8px; font-size:11px;" onclick="openSubmitHomeworkForm(${task.id})">去提交</button>`;
    } else if (submission.status === "pending") {
      statusText = `<span class="badge-pending">待批改 (已提交)</span>`;
      actionHtml = `<span style="font-size:12px; color:var(--text-muted);">等待老师打分中</span>`;
    } else {
      let gradeColor = submission.grade === "Excellent" ? "#81c784" : submission.grade === "Good" ? "#64b5f6" : "#ffb74d";
      statusText = `<span class="badge-completed">已批改: <strong style="color:${gradeColor}">${submission.grade}</strong></span>`;
      actionHtml = `<span style="font-size:12px; color:var(--text-secondary);">已领金币与苹果</span>`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="element-badge grass" style="font-size:10px;">${task.subject}</span></td>
      <td>
        <strong style="font-size:14px;">${task.title}</strong>
        <p style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${task.description}</p>
      </td>
      <td>${statusText}</td>
      <td>${actionHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openSubmitHomeworkForm(taskId) {
  const assignments = getAssignmentsTable();
  const task = assignments.find(t => t.id === taskId);
  if (!task) return;

  const card = document.getElementById("homework-submit-card");
  card.style.display = "block";
  document.getElementById("submit-assignment-title").innerText = `提交作业：${task.title}`;
  
  // 绑定确认提交事件
  document.getElementById("submit-homework-confirm-btn").onclick = () => {
    const text = document.getElementById("submit-homework-text").value;
    const file = document.getElementById("submit-homework-file").value;

    if (!text.trim()) {
      alert("请输入作答文本！如果是拍照提交，请在此填写备注文字。");
      return;
    }

    const students = getStudentsTable();
    const student = students.find(s => s.id === appState.activeStudentId);
    
    // 增加提交记录
    student.submissions.push({
      assignmentId: taskId,
      content: text,
      file: file,
      status: "pending",
      grade: ""
    });

    saveStudentsTable(students);
    card.style.display = "none";
    document.getElementById("submit-homework-text").value = "";
    
    alert("提交成功！已把作业提交至老师的作业批改终端。");
    addLog("homework", `${student.name} 提交了作业 【${task.title}】`);
    renderStudentHomework();
  };

  document.getElementById("submit-homework-cancel-btn").onclick = () => {
    card.style.display = "none";
  };
}

// ============================================================================
// 6.6 学生端宠物图鉴档案 (Student Encyclopedia View)
// ============================================================================
let currentSelectedEncyclopediaPetId = null;

function renderStudentEncyclopedia() {
  const pets = getPetsTable();
  const listContainer = document.getElementById("encyclopedia-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  if (pets.length === 0) {
    listContainer.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:10px;">暂无宠物数据</p>`;
    document.getElementById("encyclopedia-detail").innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 120px 0;">请从左侧选择一只宠物查看详细档案...</p>`;
    return;
  }

  // 默认选中第一个
  if (!currentSelectedEncyclopediaPetId || !pets.some(p => p.id === currentSelectedEncyclopediaPetId)) {
    currentSelectedEncyclopediaPetId = pets[0].id;
  }

  pets.forEach(pet => {
    const card = document.createElement("div");
    card.className = `asset-item-card ${pet.id === currentSelectedEncyclopediaPetId ? 'selected' : ''}`;
    card.dataset.id = pet.id;

    const avatarHtml = pet.avatar && pet.avatar.length > 4
      ? `<img src="${pet.avatar}" class="asset-item-avatar" style="width:36px; height:36px; object-fit:contain;">`
      : `<span style="font-size: 24px; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">${pet.avatar || '🐾'}</span>`;

    card.innerHTML = `
      <div class="asset-item-brief">
        ${avatarHtml}
        <div>
          <span class="asset-item-name">${pet.name}</span>
          <span class="asset-item-el" style="margin-left: 6px;">(${pet.element})</span>
        </div>
      </div>
      <span class="element-badge ${pet.element}" style="font-size:10px; padding:2px 6px;">${pet.element}</span>
    `;

    card.onclick = () => {
      currentSelectedEncyclopediaPetId = pet.id;
      document.querySelectorAll("#encyclopedia-list .asset-item-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      renderEncyclopediaDetail(pet.id);
    };

    listContainer.appendChild(card);
  });

  renderEncyclopediaDetail(currentSelectedEncyclopediaPetId);
}

function renderEncyclopediaDetail(petId) {
  const pets = getPetsTable();
  const pet = pets.find(p => p.id === petId);
  const detailContainer = document.getElementById("encyclopedia-detail");
  if (!detailContainer) return;

  if (!pet) {
    detailContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 120px 0;">请从左侧选择一只宠物查看详细档案...</p>`;
    return;
  }

  // 整理立绘资源数组 (首选主立绘，若无则使用 avatar, 随后是备用立绘)
  const allImages = [];
  if (pet.fullBody) {
    allImages.push({ type: "fullBody", url: pet.fullBody, label: "主立绘" });
  } else if (pet.avatar && pet.avatar.length > 4) {
    allImages.push({ type: "avatar", url: pet.avatar, label: "主立绘" });
  }

  if (pet.illustrations && Array.isArray(pet.illustrations)) {
    pet.illustrations.forEach((url, i) => {
      if (url) allImages.push({ type: "illustration", url: url, label: `姿态 ${i + 1}` });
    });
  }

  // 属性成长雷达/展示数据
  const power = pet.hp + pet.atk * 4 + pet.def * 4 + pet.spd * 2;

  // 进化链信息
  let evoInfoHtml = "";
  if (pet.evoLevel > 0 && pet.evoTarget) {
    const targetPet = pets.find(p => p.id === pet.evoTarget);
    const targetName = targetPet ? targetPet.name : pet.evoTarget;
    evoInfoHtml = `<span style="color: var(--accent-cyan);">🧬 ${pet.evoLevel}级 进化为 [${targetName}]</span>`;
  } else {
    evoInfoHtml = `<span style="color: var(--text-muted);">🧬 已达到终极进化形态</span>`;
  }

  // 核心内容
  detailContainer.innerHTML = `
    <!-- Top Hero Section -->
    <div class="encyclopedia-hero" style="display: flex; gap: 24px; align-items: stretch;">
      <!-- Hero Image Box -->
      <div class="glass-panel" id="encyclopedia-main-img-box" style="flex: 1.2; display: flex; align-items: center; justify-content: center; min-height: 280px; background: rgba(0,0,0,0.2); position: relative; border-radius: var(--radius-md); overflow: hidden;">
        <!-- 主立绘图 -->
        <div id="encyclopedia-main-img-container" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
          ${renderEncyclopediaMainImage(allImages[0] ? allImages[0].url : pet.avatar)}
        </div>
      </div>

      <!-- Hero Brief Box -->
      <div style="flex: 1.8; display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="font-size: 26px; margin: 0; font-weight: 800; color: #fff;">${pet.name}</h2>
            <span class="element-badge ${pet.element}" style="font-size: 13px; padding: 4px 10px;">${pet.element}</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">ID: ${pet.id} | ${evoInfoHtml}</p>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div class="tooltip-line"><strong>专属大招:</strong> <span style="color:#ffca28; font-weight:700;">${pet.signatureMove || '冲撞'}</span></div>
            <div class="tooltip-line"><strong>成长潜力:</strong> 
              <span style="color:#00e5ff; font-weight:700;">★ ★ ★ ★ ☆</span>
            </div>
            <div class="tooltip-line"><strong>综合战力评分:</strong> <span style="color:var(--accent-pink); font-weight:700;">${power}</span></div>
          </div>
        </div>

        <!-- 核心基础属性 -->
        <div class="glass-panel" style="padding: 12px; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; gap: 8px;">
          <h4 style="font-size:12px; margin:0 0 4px 0; color:var(--text-secondary); text-transform: uppercase;">核心基础属性 (Base Stats)</h4>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${renderStatBar("生命值 (HP)", pet.hp, pet.growthHp, 250, "#4caf50")}
            ${renderStatBar("攻击力 (ATK)", pet.atk, pet.growthAtk, 100, "#ff5252")}
            ${renderStatBar("防御力 (DEF)", pet.def, pet.growthDef, 100, "#2196f3")}
            ${renderStatBar("敏捷度 (SPD)", pet.spd, pet.growthSpd, 100, "#ffeb3b")}
          </div>
        </div>
      </div>
    </div>

    <!-- Background Lore Story -->
    <div class="glass-panel story-quote-card" style="padding: 16px 20px; background: rgba(255,255,255,0.02); border-left: 4px solid var(--accent-cyan); position: relative;">
      <span style="position: absolute; left: 8px; top: 0px; font-size: 36px; color: rgba(255,255,255,0.08); font-family: Georgia, serif; line-height: 1;">“</span>
      <h3 style="font-size: 14px; margin-bottom: 8px; color: var(--text-secondary);">宠物背景描述与生境考据</h3>
      <p style="font-size: 13px; line-height: 1.6; color: var(--text-secondary); text-indent: 2em; margin: 0;">
        ${pet.story || "关于这只神秘宠物的故事正在由生态学者编撰中，敬请期待！"}
      </p>
    </div>

    <!-- Illustrations Gallery (立绘选集) -->
    <div>
      <h3 style="font-size: 14px; margin-bottom: 10px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
        <span>🖼️ 多姿态立绘选集</span>
        <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">(点击缩略图切换上方主视图)</span>
      </h3>
      <div class="gallery-thumb-grid" style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px;">
        ${allImages.map((img, idx) => `
          <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="switchEncyclopediaMainImg('${img.url.replace(/'/g, "\\'")}', this)" style="width: 70px; height: 70px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; overflow: hidden; flex-shrink: 0;">
            ${img.url.length > 4 
              ? `<img src="${img.url}" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;">` 
              : `<span style="font-size: 32px;">${img.url}</span>`
            }
          </div>
        `).join("")}
        ${allImages.length === 0 ? `<p style="color:var(--text-muted); font-size:12px;">暂无其他变体立绘</p>` : ""}
      </div>
    </div>

    <!-- Concept Three-Views (三视图) -->
    <div>
      <h3 style="font-size: 14px; margin-bottom: 10px; color: var(--text-secondary);">📐 设计开发三视图参考</h3>
      ${renderThreeViewsSection(pet.threeViews)}
    </div>
  `;
}

function renderEncyclopediaMainImage(urlOrEmoji) {
  if (!urlOrEmoji) return `<span style="font-size: 80px; user-select:none;">🐾</span>`;
  if (urlOrEmoji.length > 4) {
    return `<img src="${urlOrEmoji}" class="encyclopedia-main-img" style="max-width: 100%; max-height: 240px; object-fit: contain; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4)); animation: float 6s ease-in-out infinite;">`;
  } else {
    return `<span style="font-size: 96px; user-select:none; animation: float 6s ease-in-out infinite;">${urlOrEmoji}</span>`;
  }
}

function renderStatBar(label, base, growth, maxVal, color) {
  const pct = Math.min(100, (base / maxVal) * 100);
  return `
    <div style="display: flex; align-items: center; gap: 10px; font-size: 12px;">
      <span style="width: 80px; color: var(--text-secondary); font-weight:600;">${label}</span>
      <span style="width: 30px; font-weight: 700; text-align: right; color:#fff;">${base}</span>
      <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; position: relative;">
        <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: 3px; transition: width 0.3s ease;"></div>
      </div>
      <span style="width: 50px; color: var(--text-muted); text-align: left; font-size: 10px;">(成长 +${growth})</span>
    </div>
  `;
}

function renderThreeViewsSection(threeViews) {
  if (!threeViews) {
    return `<div class="glass-panel" style="padding:20px; text-align:center; color:var(--text-muted); font-size:12px;">暂无设计三视图资产</div>`;
  }

  const { front, side, back } = threeViews;

  const hasFront = !!front;
  const hasSide = !!side;
  const hasBack = !!back;

  if (hasFront && !hasSide && !hasBack) {
    return `
      <div class="glass-panel three-views-container" style="padding: 12px; background: rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; gap: 6px; border-radius: var(--radius-md);">
        ${front.length > 4 
          ? `<img src="${front}" style="max-width: 100%; max-height: 320px; object-fit: contain; border-radius: var(--radius-sm);" onclick="openImageModal('${front}')">` 
          : `<span style="font-size:48px;">${front}</span>`
        }
        <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">概念设计三视图合集 (点击可查看大图)</span>
      </div>
    `;
  } else if (hasFront || hasSide || hasBack) {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
        <div class="glass-panel three-views-container" style="padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(0,0,0,0.1); border-radius: var(--radius-md);">
          ${front ? (front.length > 4 ? `<img src="${front}" style="width: 100%; height: 120px; object-fit: contain;" onclick="openImageModal('${front}')">` : `<span style="font-size:40px; height:120px; display:flex; align-items:center;">${front}</span>`) : `<span style="color:var(--text-muted); font-size:12px; height:120px; display:flex; align-items:center;">无正面资产</span>`}
          <span style="font-size: 11px; color: var(--text-secondary); font-weight:700;">正面 (Front)</span>
        </div>
        <div class="glass-panel three-views-container" style="padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(0,0,0,0.1); border-radius: var(--radius-md);">
          ${side ? (side.length > 4 ? `<img src="${side}" style="width: 100%; height: 120px; object-fit: contain;" onclick="openImageModal('${side}')">` : `<span style="font-size:40px; height:120px; display:flex; align-items:center;">${side}</span>`) : `<span style="color:var(--text-muted); font-size:12px; height:120px; display:flex; align-items:center;">无侧面资产</span>`}
          <span style="font-size: 11px; color: var(--text-secondary); font-weight:700;">侧面 (Side)</span>
        </div>
        <div class="glass-panel three-views-container" style="padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(0,0,0,0.1); border-radius: var(--radius-md);">
          ${back ? (back.length > 4 ? `<img src="${back}" style="width: 100%; height: 120px; object-fit: contain;" onclick="openImageModal('${back}')">` : `<span style="font-size:40px; height:120px; display:flex; align-items:center;">${back}</span>`) : `<span style="color:var(--text-muted); font-size:12px; height:120px; display:flex; align-items:center;">无背面资产</span>`}
          <span style="font-size: 11px; color: var(--text-secondary); font-weight:700;">背面 (Back)</span>
        </div>
      </div>
    `;
  } else {
    return `<div class="glass-panel" style="padding:20px; text-align:center; color:var(--text-muted); font-size:12px;">暂无设计三视图资产</div>`;
  }
}

function switchEncyclopediaMainImg(url, thumbElement) {
  const container = document.getElementById("encyclopedia-main-img-container");
  if (!container) return;
  
  document.querySelectorAll(".gallery-thumb").forEach(el => el.classList.remove("active"));
  if (thumbElement) thumbElement.classList.add("active");
  
  container.innerHTML = renderEncyclopediaMainImage(url);
}

function openImageModal(imgUrl) {
  let modal = document.getElementById("encyclopedia-image-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "encyclopedia-image-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    modal.style.backdropFilter = "blur(10px)";
    modal.style.zIndex = "9999";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.cursor = "zoom-out";
    
    modal.onclick = () => {
      modal.style.display = "none";
    };
    
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `<img src="${imgUrl}" style="max-width: 90%; max-height: 90%; object-fit: contain; box-shadow: 0 20px 40px rgba(0,0,0,0.6); border-radius: var(--radius-md); animation: zoomIn 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);">`;
  modal.style.display = "flex";
}

// ============================================================================
// 7. 教师端业务模块 (Teacher Console Controllers)
// ============================================================================
// ============================================================================

// 7.1 教师发布作业
function renderTeacherHomework() {
  const assignments = getAssignmentsTable();
  const tbody = document.getElementById("teacher-view").querySelector("#teacher-homework-tbody");
  tbody.innerHTML = "";

  const students = getStudentsTable();

  assignments.forEach(task => {
    // 统计该作业收到了多少个提交
    let totalSubmissions = 0;
    students.forEach(s => {
      if (s.submissions.some(sub => sub.assignmentId === task.id)) {
        totalSubmissions++;
      }
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="element-badge earth" style="font-size:10px;">${task.subject}</span></td>
      <td><strong>${task.title}</strong></td>
      <td><strong style="color:var(--accent-cyan)">${totalSubmissions}</strong> / ${students.length} 人已交</td>
      <td><span class="badge-completed">发布中</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// 7.2 渲染批改队列
function renderTeacherGradingQueue() {
  const students = getStudentsTable();
  const assignments = getAssignmentsTable();
  const tbody = document.getElementById("teacher-grading-queue-tbody");
  tbody.innerHTML = "";

  let gradingQueue = [];

  students.forEach(student => {
    student.submissions.forEach(sub => {
      if (sub.status === "pending") {
        const task = assignments.find(t => t.id === sub.assignmentId);
        gradingQueue.push({
          studentId: student.id,
          studentName: student.name,
          taskTitle: task ? task.title : "未知作业",
          submission: sub
        });
      }
    });
  });

  if (gradingQueue.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">🎉 太棒了，当前没有任何待批改的作业！</td></tr>`;
    document.getElementById("grading-detail-container").innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">当前队列已清空...</p>`;
    return;
  }

  gradingQueue.forEach(item => {
    const tr = document.createElement("tr");
    tr.className = "asset-item-card";
    tr.innerHTML = `
      <td><strong>${item.studentName}</strong></td>
      <td>${item.taskTitle}</td>
      <td><span class="badge-pending">待评审</span></td>
    `;
    
    tr.onclick = () => {
      openGradingPanel(item);
    };

    tbody.appendChild(tr);
  });
}

// 开启作业打分面板
function openGradingPanel(queueItem) {
  const container = document.getElementById("grading-detail-container");
  container.innerHTML = `
    <div class="grading-panel">
      <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
        <h3>批改学生：${queueItem.studentName}</h3>
        <span class="element-badge water" style="font-size:11px;">${queueItem.taskTitle}</span>
      </div>
      
      <div class="homework-content-preview">
        <strong>学生作答内容：</strong><br>
        <p style="margin-top: 6px; white-space: pre-wrap;">${queueItem.submission.content}</p>
        ${queueItem.submission.file ? `<div style="margin-top: 10px; font-size:12px; color:var(--accent-cyan);">📁 模拟附件：${queueItem.submission.file}</div>` : ''}
      </div>

      <p style="font-size:12px; color:var(--text-secondary);">请做出评价等级（将直接奖励对应的金币和宠物饲料）：</p>
      
      <div class="grading-actions-row">
        <button class="grade-btn excellent" onclick="submitGrade(${queueItem.studentId}, ${queueItem.submission.assignmentId}, 'Excellent')">⭐ 优秀 (A)</button>
        <button class="grade-btn good" onclick="submitGrade(${queueItem.studentId}, ${queueItem.submission.assignmentId}, 'Good')">👍 良好 (B)</button>
        <button class="grade-btn completed" onclick="submitGrade(${queueItem.studentId}, ${queueItem.submission.assignmentId}, 'Completed')">✅ 已完成 (C)</button>
      </div>
    </div>
  `;
}

// 提交分数并分发奖励
function submitGrade(studentId, assignmentId, grade) {
  const students = getStudentsTable();
  const assignments = getAssignmentsTable();
  const student = students.find(s => s.id === studentId);
  const task = assignments.find(t => t.id === assignmentId);
  if (!student || !task) return;

  const sub = student.submissions.find(s => s.assignmentId === assignmentId);
  if (!sub) return;

  // 1. 修改作业状态
  sub.status = "graded";
  sub.grade = grade;

  // 2. 发放金币和饲料
  // 优秀: 30金币 + 3高级饲料 + 50XP
  // 良好: 20金币 + 2中级饲料 + 30XP
  // 完成: 10金币 + 1初级饲料 + 15XP
  let coinReward = 0;
  let foodId = "";
  let foodCount = 0;
  let xpDirect = 0;

  if (grade === "Excellent") {
    coinReward = 30;
    foodId = "food_high"; // 黄金苹果
    foodCount = 3;
    xpDirect = 50;
  } else if (grade === "Good") {
    coinReward = 20;
    foodId = "food_mid";  // 七彩饼干
    foodCount = 2;
    xpDirect = 30;
  } else {
    coinReward = 10;
    foodId = "food_low";  // 星光莓
    foodCount = 1;
    xpDirect = 15;
  }

  // 写入背包与钱包
  student.coins += coinReward;
  if (!student.inventory) student.inventory = {};
  student.inventory[foodId] = (student.inventory[foodId] || 0) + foodCount;

  // 额外增加宠物直属经验
  const pet = student.activePet;
  pet.xp += xpDirect;

  // 自动算宠物升级
  let leveled = false;
  let nextReq = getXpRequired(pet.level);
  while (pet.xp >= nextReq && pet.level < 100) {
    pet.xp -= nextReq;
    pet.level++;
    leveled = true;
    nextReq = getXpRequired(pet.level);
  }

  // 记录日志
  const shopItems = getShopTable();
  const foodName = shopItems.find(i => i.id === foodId)?.name || "零食";
  addLog("homework", `教师批改了 ${student.name} 的作业 【${task.title}】 为 【${grade}】。奖励 🪙${coinReward} 金币，${foodCount}个${foodName}及 ${xpDirect} XP！`);
  if (leveled) {
    addLog("system", `${student.name} 的宠物 ${pet.name} 连升数级至了等级 ${pet.level}!`);
  }

  saveStudentsTable(students);
  alert("批改成功！奖励已分发至学生背包与钱包。");

  // 重绘
  renderTeacherGradingQueue();
}

// 7.3 全班表现奖惩与特权卡券核销
function renderTeacherClassStats() {
  const students = getStudentsTable();
  const pets = getPetsTable();
  
  // 1. 表现面板
  const sTbody = document.getElementById("teacher-class-students-tbody");
  sTbody.innerHTML = "";

  students.forEach(student => {
    const petInst = student.activePet;
    const stats = getPetStats(petInst, pets);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${student.name}</strong></td>
      <td>${stats.displayName} (Lv. ${petInst.level})</td>
      <td style="color:#ffca28; font-weight:700;">🪙 ${student.coins}</td>
      <td>
        <button class="primary-btn" style="padding: 4px 8px; font-size:11px;" onclick="teacherAwardCoins(${student.id})">表现优秀奖励</button>
      </td>
    `;
    sTbody.appendChild(tr);
  });

  // 2. 特权卡券核销
  const auditContainer = document.getElementById("coupon-audit-list");
  auditContainer.innerHTML = "";

  let totalCoupons = 0;
  students.forEach(student => {
    if (student.coupons && student.coupons.length > 0) {
      student.coupons.forEach(coupon => {
        if (!coupon.used) {
          totalCoupons++;
          const item = document.createElement("div");
          item.className = "audit-item";
          item.innerHTML = `
            <div class="audit-item-info">
              <span class="audit-item-title">${coupon.name}</span>
              <span class="audit-item-meta">持有者: <strong>${student.name}</strong></span>
            </div>
            <button class="primary-btn" style="padding: 6px 12px; font-size:12px; background:linear-gradient(135deg, #ff9800, #ff5722)" onclick="useCoupon('${student.id}', '${coupon.id}')">核销使用</button>
          `;
          auditContainer.appendChild(item);
        }
      });
    }
  });

  if (totalCoupons === 0) {
    auditContainer.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--text-muted); font-size:12px;">🎉 目前没有待兑换核销的课堂特权券。</div>`;
  }
}

// 表现优秀奖励金币
function teacherAwardCoins(studentId) {
  const amount = parseInt(prompt("请输入奖励的金币金额（如10、20）：", "15"));
  if (isNaN(amount) || amount <= 0) return;

  const students = getStudentsTable();
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  student.coins += amount;
  addLog("system", `教师手动为 ${student.name} 发放了积极课堂表现奖励 🪙${amount} 金币`);
  saveStudentsTable(students);
  renderTeacherClassStats();
}

// 老师核销卡券
function useCoupon(studentId, couponId) {
  const students = getStudentsTable();
  // 注意，studentId 可能是数字，也可能是字符串，这里做松散比较
  const student = students.find(s => s.id == studentId);
  if (!student || !student.coupons) return;

  const coupon = student.coupons.find(c => c.id === couponId);
  if (!coupon) return;

  coupon.used = true;
  addLog("system", `教师确认了学生 ${student.name} 的课堂特权【${coupon.name}】，并成功进行核销！`);
  saveStudentsTable(students);
  alert("卡券核销成功！该特权已正式作废。");
  renderTeacherClassStats();
}

// ============================================================================
// 8. 管理员端业务模块 (Admin Console Controllers)
// ============================================================================

// 8.1 渲染全局宠物资产列表
function renderAdminPetAssets() {
  const pets = getPetsTable();
  const list = document.getElementById("admin-pet-assets-list");
  list.innerHTML = "";

  pets.forEach(pet => {
    const card = document.createElement("div");
    card.className = "asset-item-card";
    card.dataset.id = pet.id;
    
    const avatarHtml = pet.avatar && pet.avatar.length > 4
      ? `<img src="${pet.avatar}" class="asset-item-avatar" style="width:36px; height:36px; object-fit:contain;">`
      : `<span style="font-size: 24px; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">${pet.avatar || '🐾'}</span>`;

    card.innerHTML = `
      <div class="asset-item-brief">
        ${avatarHtml}
        <div>
          <span class="asset-item-name">${pet.name}</span>
          <span class="asset-item-el" style="margin-left: 6px;">(${pet.element})</span>
        </div>
      </div>
      <span style="font-size:11px; color:var(--text-muted);">HP ${pet.hp} / ATK ${pet.atk}</span>
    `;

    card.onclick = () => {
      document.querySelectorAll(".asset-item-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      loadPetToEditor(pet.id);
    };

    list.appendChild(card);
  });

  // 更新进化目标下拉菜单
  const evoSelect = document.getElementById("edit-pet-evo-target");
  evoSelect.innerHTML = `<option value="">-- 无 (不进化) --</option>`;
  pets.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = `${p.name} (${p.element})`;
    evoSelect.appendChild(opt);
  });
}

// 编辑器载入宠物数据
function loadPetToEditor(petId) {
  const pets = getPetsTable();
  const pet = pets.find(p => p.id === petId);
  if (!pet) return;

  document.getElementById("edit-pet-id").value = pet.id;
  document.getElementById("edit-pet-name").value = pet.name;
  document.getElementById("edit-pet-element").value = pet.element;
  document.getElementById("edit-pet-avatar").value = pet.avatar || "";
  document.getElementById("edit-pet-fullbody").value = pet.fullBody || "";
  document.getElementById("edit-pet-move").value = pet.signatureMove;
  document.getElementById("edit-pet-base-hp").value = pet.hp;
  document.getElementById("edit-pet-growth-hp").value = pet.growthHp;
  document.getElementById("edit-pet-base-atk").value = pet.atk;
  document.getElementById("edit-pet-growth-atk").value = pet.growthAtk;
  document.getElementById("edit-pet-base-def").value = pet.def;
  document.getElementById("edit-pet-growth-def").value = pet.growthDef;
  document.getElementById("edit-pet-base-spd").value = pet.spd;
  document.getElementById("edit-pet-growth-spd").value = pet.growthSpd;
  document.getElementById("edit-pet-evo-level").value = pet.evoLevel || 0;
  document.getElementById("edit-pet-evo-target").value = pet.evoTarget || "";
  document.getElementById("edit-pet-story").value = pet.story || "";
  document.getElementById("edit-pet-illustrations").value = pet.illustrations ? pet.illustrations.join(", ") : "";
  document.getElementById("edit-pet-three-front").value = (pet.threeViews && pet.threeViews.front) || "";
  document.getElementById("edit-pet-three-side").value = (pet.threeViews && pet.threeViews.side) || "";
  document.getElementById("edit-pet-three-back").value = (pet.threeViews && pet.threeViews.back) || "";
}

// 8.2 渲染商城商品管理器货架
function renderAdminShopItems() {
  const shopItems = getShopTable();
  const tbody = document.getElementById("admin-shop-items-tbody");
  tbody.innerHTML = "";

  shopItems.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-size:24px; text-align:center;">${item.icon}</td>
      <td><strong>${item.name}</strong></td>
      <td><span class="element-badge earth" style="font-size:10px;">${item.category}</span></td>
      <td style="color:#ffca28; font-weight:700;">🪙 ${item.price}</td>
      <td>
        <button class="primary-btn" style="padding:4px 8px; font-size:10px; background:#ff5252; border-color:#ff5252;" onclick="deleteShopItem('${item.id}')">下架</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 下架商品
function deleteShopItem(itemId) {
  if (!confirm("确认下架该商品吗？学生将无法继续从商城购买。")) return;
  const shopItems = getShopTable();
  const index = shopItems.findIndex(i => i.id === itemId);
  if (index !== -1) {
    addLog("system", `管理员下架了商品: ${shopItems[index].name}`);
    shopItems.splice(index, 1);
    saveShopTable(shopItems);
    renderAdminShopItems();
  }
}

// ============================================================================
// 9. 事件监听绑定与初始化 (Event Bindings & Initialization)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化 Tab 切换与角色切换
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.onclick = () => switchRole(btn.dataset.role);
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
      const role = btn.closest(".view-panel").id.split("-")[0]; // 'student' or 'teacher' or 'admin'
      switchTab(role, btn.dataset.target);
    };
  });

  // 2. 快捷测试按钮 (快捷+10级)
  document.getElementById("cheat-level-btn").onclick = () => {
    const students = getStudentsTable();
    const student = students.find(s => s.id === appState.activeStudentId);
    if (student) {
      student.activePet.level += 10;
      saveStudentsTable(students);
      renderStudentPetCenter();
      alert("作弊器触发成功！您的宠物已升10级。");
    }
  };

  // 更换初始宠物快捷键
  document.getElementById("change-pet-btn").onclick = () => {
    const petList = ["leafox", "pyroclaw", "bubblefin"];
    const input = prompt("请输入你想更换的宠物ID (leafox: 叶狐, pyroclaw: 小火爪, bubblefin: 泡泡鳍):", "pyroclaw");
    if (petList.includes(input)) {
      const students = getStudentsTable();
      const student = students.find(s => s.id === appState.activeStudentId);
      student.activePet.assetId = input;
      student.activePet.level = 1;
      student.activePet.xp = 0;
      // 匹配默认名字
      const pets = getPetsTable();
      student.activePet.name = pets.find(p => p.id === input).name;
      
      saveStudentsTable(students);
      renderStudentPetCenter();
      alert("初始宠更换成功！已自动重置为1级。");
    } else {
      alert("无效宠物ID！");
    }
  };

  // 3. 对战结算面板关闭按钮
  document.getElementById("close-battle-overlay").onclick = () => {
    document.getElementById("arena-result-overlay").style.display = "none";
    renderStudentArena();
  };

  // 4. 教师发布新作业表单
  document.getElementById("publish-task-btn").onclick = () => {
    const title = document.getElementById("task-title").value;
    const subject = document.getElementById("task-subject").value;
    const desc = document.getElementById("task-description").value;

    if (!title.trim() || !desc.trim()) {
      alert("请完整填写作业标题和描述！");
      return;
    }

    const assignments = getAssignmentsTable();
    const newId = 100 + assignments.length + 1;
    const today = new Date().toISOString().split("T")[0];

    assignments.push({
      id: newId,
      title: title,
      subject: subject,
      description: desc,
      date: today
    });

    saveAssignmentsTable(assignments);
    addLog("homework", `教师发布了新作业 【${title}】`);
    alert("新作业发布成功！全班学生终端已同步显示。");

    // 重绘
    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
    renderTeacherHomework();
  };

  // 5. 管理员新建宠物重置表单
  document.getElementById("add-new-pet-asset-btn").onclick = () => {
    document.getElementById("edit-pet-id").value = "new_" + Date.now();
    document.getElementById("admin-pet-editor-form").reset();
    document.getElementById("edit-pet-name").focus();
  };

  // 管理员保存/编辑宠物
  document.getElementById("admin-pet-editor-form").onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-pet-id").value || "new_" + Date.now();
    const name = document.getElementById("edit-pet-name").value;
    const element = document.getElementById("edit-pet-element").value;
    const avatar = document.getElementById("edit-pet-avatar").value;
    const fullBody = document.getElementById("edit-pet-fullbody").value;
    const move = document.getElementById("edit-pet-move").value;
    const hp = parseInt(document.getElementById("edit-pet-base-hp").value);
    const growthHp = parseFloat(document.getElementById("edit-pet-growth-hp").value);
    const atk = parseInt(document.getElementById("edit-pet-base-atk").value);
    const growthAtk = parseFloat(document.getElementById("edit-pet-growth-atk").value);
    const def = parseInt(document.getElementById("edit-pet-base-def").value);
    const growthDef = parseFloat(document.getElementById("edit-pet-growth-def").value);
    const spd = parseInt(document.getElementById("edit-pet-base-spd").value);
    const growthSpd = parseFloat(document.getElementById("edit-pet-growth-spd").value);
    const evoLevel = parseInt(document.getElementById("edit-pet-evo-level").value) || 0;
    const evoTarget = document.getElementById("edit-pet-evo-target").value || "";
    
    const story = document.getElementById("edit-pet-story").value;
    const illustrationsStr = document.getElementById("edit-pet-illustrations").value;
    const illustrations = illustrationsStr ? illustrationsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
    const threeFront = document.getElementById("edit-pet-three-front").value;
    const threeSide = document.getElementById("edit-pet-three-side").value;
    const threeBack = document.getElementById("edit-pet-three-back").value;
    const threeViews = { front: threeFront, side: threeSide, back: threeBack };

    const pets = getPetsTable();
    const existingIndex = pets.findIndex(p => p.id === id);

    const assetData = {
      id, name, element, avatar, fullBody, signatureMove: move,
      hp, growthHp, atk, growthAtk, def, growthDef, spd, growthSpd,
      evoLevel, evoTarget, story, illustrations, threeViews
    };

    if (existingIndex !== -1) {
      pets[existingIndex] = assetData;
      addLog("system", `管理员修改了宠物角色库: ${name}`);
      alert("角色信息修改成功！");
    } else {
      pets.push(assetData);
      addLog("system", `管理员在角色库中新增了宠物: ${name}`);
      alert("全新宠物角色创建并上架资产库！");
    }

    savePetsTable(pets);
    renderAdminPetAssets();
  };

  // 管理员删除宠物
  document.getElementById("delete-pet-asset-btn").onclick = () => {
    const id = document.getElementById("edit-pet-id").value;
    if (!id) return;
    if (!confirm("确认彻底删除该宠物定义吗？此举将使已有此类宠物的学生发生数据异常。")) return;

    const pets = getPetsTable();
    const index = pets.findIndex(p => p.id === id);
    if (index !== -1) {
      addLog("system", `管理员从宠物库删除了角色: ${pets[index].name}`);
      pets.splice(index, 1);
      savePetsTable(pets);
      renderAdminPetAssets();
      document.getElementById("admin-pet-editor-form").reset();
      document.getElementById("edit-pet-id").value = "";
      alert("角色删除成功。");
    }
  };

  // 6. 管理员上架商品
  document.getElementById("admin-shop-item-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("shop-item-name-input").value;
    const category = document.getElementById("shop-item-category").value;
    const icon = document.getElementById("shop-item-icon-input").value;
    const price = parseInt(document.getElementById("shop-item-price-input").value);
    const effect = parseInt(document.getElementById("shop-item-effect-val").value) || 0;
    const desc = document.getElementById("shop-item-desc-input").value;

    const shopItems = getShopTable();
    const id = "custom_" + Date.now();

    shopItems.push({ id, name, category, icon, price, effect, desc });
    saveShopTable(shopItems);
    addLog("system", `管理员上架了商品: ${name}，售价 🪙${price}`);
    alert(`商品 【${name}】 上架成功！`);

    // 重置
    document.getElementById("admin-shop-item-form").reset();
    document.getElementById("shop-item-icon-input").value = "🎫";
    document.getElementById("shop-item-price-input").value = "100";
    renderAdminShopItems();
  };

  // ==========================================
  // 执行全局初始化角色加载
  // ==========================================
  switchRole("student");
});
