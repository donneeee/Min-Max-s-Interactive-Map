(() => {
  "use strict";

  const ASSET_VERSION = "20260719-localization-v008";
  const SUPPORTED_LANGUAGES = Object.freeze({
    en: { label: "English", htmlLang: "en" },
    "zh-CN": { label: "简体中文", htmlLang: "zh-CN" },
    ja: { label: "日本語", htmlLang: "ja" },
    ko: { label: "한국어", htmlLang: "ko" },
  });

  // Website-owned interface copy. Game-owned names and descriptions come from
  // the complete UID maps generated from the client localization files.
  const UI_ROWS = [
    ["Document Pickups", "文档拾取", "文書収集物", "문서 수집품"],
    ["Document Pickup", "文档", "文書", "문서"],
    ["Lore & Research", "传说与研究", "伝承・研究", "전승 및 연구"],
    ["Collectibles", "收集品", "収集物", "수집품"],
    ["Chests", "宝箱", "宝箱", "보물 상자"],
    ["Challenges", "挑战", "チャレンジ", "도전"],
    ["Entrances", "入口", "入口", "입구"],
    ["Locations & Services", "地点与服务", "施設・サービス", "장소 및 서비스"],
    ["Other", "其他", "その他", "기타"],
    ["Series", "系列", "シリーズ", "시리즈"],
    ["Blooms", "绽放点", "ブルーム", "블룸"],
    ["Sanctums", "圣所", "サンクタム", "성소"],
    ["Branches", "支点", "ブランチ", "브랜치"],
    ["Outposts", "前哨站", "前哨基地", "전초기지"],
    ["Nurture Sites", "培育点", "育成地点", "육성 지점"],
    ["Vein Abundance Sites", "丰饶矿脉点", "豊穣の脈地点", "풍요의 맥 지점"],
    ["Settings", "设置", "設定", "설정"],
    ["Language", "语言", "言語", "언어"],
    ["Display language", "显示语言", "表示言語", "표시 언어"],
    ["Game data and website interface", "游戏数据与网站界面", "ゲームデータとウェブサイト表示", "게임 데이터 및 웹사이트 인터페이스"],
    ["Language changes apply after the page reloads.", "语言更改将在页面重新加载后生效。", "言語の変更はページの再読み込み後に適用されます。", "언어 변경은 페이지를 새로 고친 후 적용됩니다."],
    ["Map", "地图", "マップ", "지도"],
    ["Maps", "地图", "マップ", "지도"],
    ["Tracking", "追踪", "追跡", "추적"],
    ["Checklist", "清单", "チェックリスト", "체크리스트"],
    ["Aniilog", "研究手册", "アニモノート", "연구 수첩"],
    ["Item-log", "道具图鉴", "アイテムログ", "아이템 도감"],
    ["Search", "搜索", "検索", "검색"],
    ["Filter", "筛选", "フィルター", "필터"],
    ["Filters", "筛选", "フィルター", "필터"],
    ["All", "全部", "すべて", "전체"],
    ["Reset", "重置", "リセット", "초기화"],
    ["Clear all", "全部清除", "すべてクリア", "모두 지우기"],
    ["Fit", "适应", "全体表示", "맞춤"],
    ["Selection", "选择项", "選択", "선택"],
    ["No marker selected", "未选择标记", "マーカーが選択されていません", "선택한 마커가 없습니다"],
    ["Name, area, coordinate", "名称、区域、坐标", "名前、エリア、座標", "이름, 지역, 좌표"],
    ["Aniimo, form, or location", "Aniimo、形态或位置", "Aniimo、形態、場所", "Aniimo, 형태 또는 위치"],
    ["Aniimo, form, skill, or effect", "Aniimo、形态、技能或效果", "Aniimo、形態、スキル、効果", "Aniimo, 형태, 스킬 또는 효과"],
    ["Items", "道具", "アイテム", "아이템"],
    ["Eggs", "蛋", "タマゴ", "알"],
    ["Teleports", "传送点", "テレポート", "순간이동"],
    ["Lumens", "流明", "ルーメン", "루멘"],
    ["Misc", "其他", "その他", "기타"],
    ["Shell Chest", "贝壳宝箱", "貝殻の宝箱", "조개껍데기 보물 상자"],
    ["Overworld Reward", "野外奖励", "フィールド報酬", "필드 보상"],
    ["Interval not yet verified", "刷新间隔尚未验证", "再出現間隔は未確認", "재생성 간격 미확인"],
    ["Changelog", "更新日志", "変更履歴", "변경 내역"],
    ["Loading GitHub changes...", "正在加载 GitHub 更新…", "GitHub の変更を読み込み中…", "GitHub 변경 내역을 불러오는 중…"],
    ["View all changes on GitHub", "在 GitHub 查看所有更新", "GitHub ですべての変更を見る", "GitHub에서 모든 변경 내역 보기"],
    ["No published changes are available.", "暂无已发布的更新。", "公開済みの変更はありません。", "게시된 변경 사항이 없습니다."],
    ["Open settings", "打开设置", "設定を開く", "설정 열기"],
    ["Close settings", "关闭设置", "設定を閉じる", "설정 닫기"],
    ["Close changelog", "关闭更新日志", "変更履歴を閉じる", "변경 내역 닫기"],
    ["Zoom in", "放大", "拡大", "확대"],
    ["Zoom out", "缩小", "縮小", "축소"],
    ["Expand selection", "展开选择项", "選択を展開", "선택 펼치기"],
    ["Collapse selection", "收起选择项", "選択を折りたたむ", "선택 접기"],
    ["This browser", "此浏览器", "このブラウザ", "이 브라우저"],
    ["Local tracking and checklist data", "本地追踪和清单数据", "ローカルの追跡・チェックリストデータ", "로컬 추적 및 체크리스트 데이터"],
    ["Tracked items", "已追踪道具", "追跡中のアイテム", "추적 중인 아이템"],
    ["Checklist entries", "清单条目", "チェックリスト項目", "체크리스트 항목"],
    ["Reset browser data", "重置浏览器数据", "ブラウザデータをリセット", "브라우저 데이터 초기화"],
    ["Resetting...", "正在重置…", "リセット中…", "초기화 중…"],
    ["Aniilog display", "研究手册显示", "アニモノート表示", "연구 수첩 표시"],
    ["Choose whether legacy stats appear in Aniilog comparison bars.", "选择是否在研究手册对比条中显示旧版属性。", "旧仕様のステータスをアニモノートの比較バーに表示するか選択します。", "기존 능력치를 연구 수첩 비교 막대에 표시할지 선택합니다."],
    ["Show Magic Attack", "显示魔法攻击", "魔法攻撃を表示", "마법 공격 표시"],
    ["Hidden by default because Magic Attack is not currently used.", "魔法攻击目前未使用，因此默认隐藏。", "魔法攻撃は現在使用されていないため、既定では非表示です。", "마법 공격은 현재 사용되지 않아 기본적으로 숨겨집니다."],
    ["Browser storage is unavailable", "浏览器存储不可用", "ブラウザストレージを利用できません", "브라우저 저장소를 사용할 수 없습니다"],
    ["The browser did not allow the map to save tracking data.", "浏览器不允许地图保存追踪数据。", "ブラウザがマップの追跡データ保存を許可しませんでした。", "브라우저에서 지도의 추적 데이터 저장을 허용하지 않았습니다."],
    ["Retry browser storage", "重试浏览器存储", "ブラウザストレージを再試行", "브라우저 저장소 다시 시도"],
    ["Sort", "排序", "並び順", "정렬"],
    ["Aniilog number", "研究手册编号", "アニモノート番号", "연구 수첩 번호"],
    ["high to low", "从高到低", "高い順", "높은 순"],
    ["Categories", "分类", "カテゴリー", "카테고리"],
    ["Classes", "职业", "クラス", "클래스"],
    ["Elements", "元素", "属性", "원소"],
    ["Evolution stage", "进化阶段", "進化段階", "진화 단계"],
    ["Special forms", "特殊形态", "特殊形態", "특수 형태"],
    ["Base stat", "基础属性", "基礎ステータス", "기본 능력치"],
    ["Any base stat", "任意基础属性", "任意の基礎ステータス", "모든 기본 능력치"],
    ["Value", "数值", "値", "값"],
    ["Add stat filter", "添加属性筛选", "ステータス条件を追加", "능력치 필터 추가"],
    ["Skills", "技能", "スキル", "스킬"],
    ["Core", "核心", "コア", "코어"],
    ["Ultimate", "终极技能", "アルティメット", "궁극기"],
    ["Trait", "特性", "特性", "특성"],
    ["Mobility skills", "移动技能", "移動スキル", "이동 스킬"],
    ["Exploration", "探索", "探索", "탐험"],
    ["Homeland abilities", "家园能力", "ホームランド能力", "홈랜드 능력"],
    ["Spawn requirements", "出现条件", "出現条件", "출현 조건"],
    ["Known locations", "已知位置", "既知の場所", "알려진 위치"],
    ["Boss variants", "首领变体", "ボス形態", "보스 변형"],
    ["Evolution", "进化", "進化", "진화"],
    ["Aniimo Progression", "Aniimo 养成", "Aniimo 育成", "Aniimo 성장"],
    ["Resonance Training", "共鸣训练", "共鳴トレーニング", "공명 훈련"],
    ["Training levels", "训练等级", "トレーニングレベル", "훈련 레벨"],
    ["Stage material", "阶段材料", "段階素材", "단계 재료"],
    ["Training material", "训练材料", "トレーニング素材", "훈련 재료"],
    ["Stage substitute", "阶段替代材料", "段階代替素材", "단계 대체 재료"],
    ["Starting tier", "起始阶级", "開始ティア", "시작 티어"],
    ["Maximum resonance tier", "最高共鸣阶级", "最大共鳴ティア", "최대 공명 티어"],
    ["Type", "类型", "種類", "유형"],
    ["Form", "形态", "形態", "형태"],
    ["Area", "区域", "エリア", "지역"],
    ["Region", "地区", "地域", "구역"],
    ["Height", "高度", "高さ", "높이"],
    ["Locate", "定位", "場所を表示", "위치 보기"],
    ["Open Tracking", "打开追踪", "追跡を開く", "추적 열기"],
    ["Track Respawn", "追踪刷新", "リスポーンを追跡", "리스폰 추적"],
    ["Start Tracking", "开始追踪", "追跡を開始", "추적 시작"],
    ["Not tracking", "未追踪", "未追跡", "추적 안 함"],
    ["Ready now", "现在可用", "準備完了", "지금 준비됨"],
    ["Basic", "基础", "基本", "기본"],
    ["Legendary", "传奇", "レジェンダリー", "전설"],
    ["Prismana", "Prismana", "Prismana", "Prismana"],
    ["Umbrabow", "Umbrabow", "Umbrabow", "Umbrabow"],
    ["Loading", "正在加载", "読み込み中", "불러오는 중"],
    ["Load failed", "加载失败", "読み込み失敗", "불러오기 실패"],
    ["Loading markers", "正在加载标记", "マーカーを読み込み中", "마커 불러오는 중"],
    ["Marker data unavailable", "标记数据不可用", "マーカーデータを利用できません", "마커 데이터를 사용할 수 없습니다"],
    ["Source data", "数据来源", "データソース", "데이터 출처"],
    ["Locate on Map", "在地图上定位", "マップで場所を表示", "지도에서 위치 보기"],
    ["Base stats", "基础属性", "基礎ステータス", "기본 능력치"],
    ["Base stat total", "基础属性总计", "基礎ステータス合計", "기본 능력치 합계"],
    ["Total", "总计", "合計", "합계"],
    ["Combat skills", "战斗技能", "戦闘スキル", "전투 스킬"],
    ["Mobility skill", "移动技能", "移動スキル", "이동 스킬"],
    ["Exploration skill", "探索技能", "探索スキル", "탐험 스킬"],
    ["Choose a class", "选择职业", "クラスを選択", "클래스 선택"],
    ["Choose an element", "选择元素", "属性を選択", "원소 선택"],
    ["Choose a form", "选择形态", "形態を選択", "형태 선택"],
    ["Choose a stage", "选择阶段", "段階を選択", "단계 선택"],
    ["Choose an ability", "选择能力", "能力を選択", "능력 선택"],
    ["Choose a base stat", "选择基础属性", "基礎ステータスを選択", "기본 능력치 선택"],
    ["Add", "添加", "追加", "추가"],
    ["Clear filters", "清除筛选", "フィルターをクリア", "필터 지우기"],
    ["Expand filters", "展开筛选", "フィルターを展開", "필터 펼치기"],
    ["Collapse filters", "收起筛选", "フィルターを折りたたむ", "필터 접기"],
    ["Sort Aniimo results", "Aniimo 结果排序", "Aniimo の結果を並べ替え", "Aniimo 결과 정렬"],
    ["HP", "生命", "HP", "HP"],
    ["Attack", "攻击", "攻撃", "공격"],
    ["Magic Attack", "魔法攻击", "魔法攻撃", "마법 공격"],
    ["Break", "破韧", "ブレイク", "브레이크"],
    ["Defense", "防御", "防御", "방어"],
    ["Magic Defense", "魔法防御", "魔法防御", "마법 방어"],
    ["Regen", "回复", "回復", "회복"],
    ["Might", "威力", "威力", "위력"],
    ["EP Cost", "EP 消耗", "EP消費", "EP 소모"],
    ["Cooldown", "冷却", "クールダウン", "재사용 대기시간"],
    ["Level", "等级", "レベル", "레벨"],
    ["Class", "职业", "クラス", "클래스"],
    ["Current form", "当前形态", "現在の形態", "현재 형태"],
    ["Has a core skill", "拥有核心技能", "コアスキルあり", "코어 스킬 보유"],
    ["No core skill", "无核心技能", "コアスキルなし", "코어 스킬 없음"],
    ["How to obtain", "获取方式", "入手方法", "획득 방법"],
    ["Carried item effects", "携带道具效果", "携帯アイテム効果", "소지 아이템 효과"],
    ["Base attributes", "基础属性", "基礎属性", "기본 속성"],
    ["Core effect", "核心效果", "コア効果", "핵심 효과"],
    ["Advanced effect", "高级效果", "上級効果", "고급 효과"],
    ["Known maps", "已知地图", "既知のマップ", "알려진 지도"],
    ["Can evolve to", "可进化为", "進化先", "진화 가능"],
    ["Evolved from", "进化来源", "進化元", "진화 이전"],
    ["Requirements", "条件", "条件", "조건"],
    ["Quality", "品质", "品質", "품질"],
    ["Source", "来源", "入手元", "출처"],
    ["Source method", "来源方式", "入手方法", "획득 방식"],
    ["Nurture", "养育", "育成", "육성"],
    ["Boss variant", "首领变体", "ボス形態", "보스 변형"],
    ["Repeatable drops", "可重复掉落", "繰り返し入手可能なドロップ", "반복 획득 가능 보상"],
    ["Possible reward", "可能奖励", "獲得可能報酬", "획득 가능 보상"],
    ["No ability data available", "无能力数据", "能力データがありません", "능력 데이터가 없습니다"],
    ["No combat skill data is currently available", "目前无战斗技能数据", "現在、戦闘スキルデータはありません", "현재 전투 스킬 데이터가 없습니다"],
    ["No Mobility skill is currently listed for this form", "此形态目前没有移动技能", "この形態には現在、移動スキルが登録されていません", "이 형태에는 현재 이동 스킬이 없습니다"],
    ["No Homeland ability is listed for this form", "此形态没有家园能力", "この形態にはホームランド能力がありません", "이 형태에는 홈랜드 능력이 없습니다"],
    ["No Trait is currently listed for this form", "此形态目前没有特性", "この形態には現在、特性が登録されていません", "이 형태에는 현재 특성이 없습니다"],
    ["No Ultimate ability is currently listed for this form", "此形态目前没有终极技能", "この形態には現在、アルティメットが登録されていません", "이 형태에는 현재 궁극기가 없습니다"],
    ["No overworld location is currently confirmed for this form", "此形态目前没有已确认的野外位置", "この形態は現在、フィールド上の場所が確認されていません", "이 형태의 필드 위치는 현재 확인되지 않았습니다"],
    ["No catalogue records are available", "无图鉴记录", "図鑑データがありません", "도감 기록이 없습니다"],
    ["Those filters are too specific", "筛选条件过于具体", "フィルター条件が絞られすぎています", "필터 조건이 너무 구체적입니다"],
    ["Try fewer filters or a different combination", "请减少筛选条件或尝试其他组合", "条件を減らすか、別の組み合わせを試してください", "필터 수를 줄이거나 다른 조합을 시도하세요"],
  ];

  UI_ROWS.push(
    ["Aniimo Research", "Aniimo 研究", "Aniimo リサーチ", "Aniimo 연구"],
    ["Research topic", "研究主题", "リサーチ項目", "연구 주제"],
    ["Research level rewards", "研究等级奖励", "リサーチレベル報酬", "연구 레벨 보상"],
    ["Accessory slot", "饰品栏位", "アクセサリースロット", "액세서리 슬롯"],
    ["Unlock by obtaining", "获取以下伊莫后解锁", "次のAniimoを入手すると解放", "다음 Aniimo 획득 시 해금"],
    ["and", "和", "と", "및"],
    ["habitat areas", "栖息区域", "生息エリア", "서식 지역"],
    ["The Lost Islets", "失落群岛", "失われた群島", "잃어버린 군도"],
    ["Temporary skill-based evolution", "技能触发的临时进化", "スキルによる一時進化", "스킬로 발동하는 임시 진화"],
    ["BREAK", "破韧", "ブレイク", "브레이크"],
    ["Bay", "海湾", "湾", "만"],
    ["Beach", "沙滩", "浜辺", "해변"],
    ["Cloudmist", "云雾", "雲霧", "운무"],
    ["Forest", "森林", "森林", "숲"],
    ["Grassland", "草原", "草原", "초원"],
    ["Highland", "高地", "高地", "고지"],
    ["Mountain", "山地", "山岳", "산악"],
    ["Mountain Woods", "山林", "山林", "산림"],
    ["Mudflat", "滩涂", "干潟", "갯벌"],
    ["Nighttime", "夜间", "夜間", "야간"],
    ["Plateau", "高原", "高原", "고원"],
    ["Rainstorm", "暴雨", "暴雨", "폭우"],
    ["Sea of Flowers", "花海", "花畑", "꽃바다"],
    ["Snowfield", "雪原", "雪原", "설원"],
    ["Special", "特殊", "特殊", "특수"],
    ["Thunderstorm", "雷暴", "雷雨", "뇌우"],
    ["Towerwood", "塔林", "塔の森", "탑의 숲"],
  );

  const UI_TRANSLATIONS = Object.fromEntries(Object.keys(SUPPORTED_LANGUAGES).map((locale) => [locale, new Map()]));
  UI_ROWS.forEach(([english, chinese, japanese, korean]) => {
    UI_TRANSLATIONS.en.set(english, english);
    UI_TRANSLATIONS["zh-CN"].set(english, chinese);
    UI_TRANSLATIONS.ja.set(english, japanese);
    UI_TRANSLATIONS.ko.set(english, korean);
  });

  let activeLocale = "en";
  let payload = null;
  let observer = null;
  let registeredDisplay = new Map();
  let templateMatchers = [];

  function escapePattern(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function compileTemplateMatchers(templates) {
    return Object.entries(templates || {}).map(([source, target]) => {
      const segments = source.split("{value}").map((segment) => escapePattern(segment).replace(/\s+/g, "\\s*"));
      return {
        pattern: new RegExp(`^${segments.join("([+-]?\\d+(?:\\.\\d+)?)")}$`),
        prefix: source.split("{value}", 1)[0],
        target,
      };
    });
  }

  function translateTemplate(text) {
    for (const matcher of templateMatchers) {
      if (matcher.prefix && !text.startsWith(matcher.prefix)) continue;
      const match = text.match(matcher.pattern);
      if (!match) continue;
      let valueIndex = 1;
      return matcher.target.replace(/\{value\}/g, () => match[valueIndex++] || "");
    }
    return "";
  }

  function normalizeLocale(value) {
    const locale = String(value || "").trim();
    return Object.hasOwn(SUPPORTED_LANGUAGES, locale) ? locale : "en";
  }

  function translatePattern(text) {
    const templated = translateTemplate(text);
    if (templated) return templated;
    const statSort = text.match(/^(.+) \(high to low\)$/);
    if (statSort) {
      const translatedStat = translate(statSort[1]);
      const suffix = UI_TRANSLATIONS[activeLocale].get("high to low") || "high to low";
      return `${translatedStat} (${suffix})`;
    }
    const locationMeta = text.match(/^(\d+) spawns?(?: · (\d+) habitats?)?$/);
    if (locationMeta) {
      if (activeLocale === "zh-CN") return `${locationMeta[1]} 个刷新点${locationMeta[2] ? ` · ${locationMeta[2]} 个栖息区域` : ""}`;
      if (activeLocale === "ja") return `${locationMeta[1]} 出現地点${locationMeta[2] ? ` · ${locationMeta[2]} 生息エリア` : ""}`;
      if (activeLocale === "ko") return `출현 지점 ${locationMeta[1]}개${locationMeta[2] ? ` · 서식 지역 ${locationMeta[2]}개` : ""}`;
    }
    const habitatAreas = text.match(/^(.+) habitat areas$/);
    if (habitatAreas) {
      return `${translate(habitatAreas[1])} ${UI_TRANSLATIONS[activeLocale].get("habitat areas")}`;
    }
    const unlock = text.match(/^Unlock by obtaining (.+)$/);
    if (unlock) {
      const conjunction = UI_TRANSLATIONS[activeLocale].get("and") || "and";
      const labels = unlock[1].split(" and ").map((label) => translate(label));
      return `${UI_TRANSLATIONS[activeLocale].get("Unlock by obtaining")} ${labels.join(` ${conjunction} `)}`;
    }
    const patterns = {
      "zh-CN": [
        [/^(\d+) tracked$/, "$1 个已追踪"],
        [/^(\d+) markers$/, "$1 个标记"],
        [/^(\d+) locations$/, "$1 个地点"],
        [/^(\d+) documents?$/, "$1 份文档"],
        [/^(\d+) items$/, "$1 件道具"],
        [/^(\d+) eggs$/, "$1 个蛋"],
        [/^(\d+) teleports$/, "$1 个传送点"],
        [/^(\d+) misc$/, "$1 个其他"],
        [/^Tier (\d+)$/, "阶级 $1"],
        [/^Level (\d+)$/, "等级 $1"],
        [/^(\d+) research topics$/, "$1 个研究主题"],
        [/^(\d+) total research points$/, "研究点数总计 $1"],
      ],
      ja: [
        [/^(\d+) tracked$/, "$1 件追跡中"],
        [/^(\d+) markers$/, "$1 マーカー"],
        [/^(\d+) locations$/, "$1 か所"],
        [/^(\d+) documents?$/, "$1 件の文書"],
        [/^(\d+) items$/, "$1 アイテム"],
        [/^(\d+) eggs$/, "$1 個のタマゴ"],
        [/^(\d+) teleports$/, "$1 テレポート"],
        [/^(\d+) misc$/, "$1 その他"],
        [/^Tier (\d+)$/, "ティア $1"],
        [/^Level (\d+)$/, "レベル $1"],
        [/^(\d+) research topics$/, "$1 件のリサーチ項目"],
        [/^(\d+) total research points$/, "合計リサーチポイント $1"],
      ],
      ko: [
        [/^(\d+) tracked$/, "$1개 추적 중"],
        [/^(\d+) markers$/, "마커 $1개"],
        [/^(\d+) locations$/, "장소 $1개"],
        [/^(\d+) documents?$/, "문서 $1개"],
        [/^(\d+) items$/, "아이템 $1개"],
        [/^(\d+) eggs$/, "알 $1개"],
        [/^(\d+) teleports$/, "순간이동 $1개"],
        [/^(\d+) misc$/, "기타 $1개"],
        [/^Tier (\d+)$/, "티어 $1"],
        [/^Level (\d+)$/, "레벨 $1"],
        [/^(\d+) research topics$/, "연구 주제 $1개"],
        [/^(\d+) total research points$/, "총 연구 포인트 $1"],
      ],
    };
    for (const [pattern, replacement] of patterns[activeLocale] || []) {
      if (pattern.test(text)) return text.replace(pattern, replacement);
    }
    const currentForms = text.match(/^(\d+) current forms \+ (\d+) special forms$/);
    if (currentForms) {
      if (activeLocale === "zh-CN") return `${currentForms[1]} 个当前形态 + ${currentForms[2]} 个特殊形态`;
      if (activeLocale === "ja") return `現行形態 ${currentForms[1]} + 特殊形態 ${currentForms[2]}`;
      if (activeLocale === "ko") return `현재 형태 ${currentForms[1]}개 + 특수 형태 ${currentForms[2]}개`;
    }
    const baseStats = text.match(/^Base stats\s*[·-]\s*Total (\d+)$/);
    if (baseStats) {
      if (activeLocale === "zh-CN") return `基础属性 · 总计 ${baseStats[1]}`;
      if (activeLocale === "ja") return `基礎ステータス · 合計 ${baseStats[1]}`;
      if (activeLocale === "ko") return `기본 능력치 · 합계 ${baseStats[1]}`;
    }
    if (/\d+ markers.*\d+ items/.test(text)) {
      const countTerms = {
        "zh-CN": [["markers", "个标记"], ["items", "件道具"], ["eggs", "个蛋"], ["teleports", "个传送点"], ["Lumens", "个流明"], ["misc", "个其他"]],
        ja: [["markers", "マーカー"], ["items", "アイテム"], ["eggs", "個のタマゴ"], ["teleports", "テレポート"], ["Lumens", "ルーメン"], ["misc", "その他"]],
        ko: [["markers", "개 마커"], ["items", "개 아이템"], ["eggs", "개 알"], ["teleports", "개 순간이동"], ["Lumens", "개 루멘"], ["misc", "개 기타"]],
      };
      const translatedCounts = (countTerms[activeLocale] || []).reduce(
        (result, [english, localized]) => result.replace(new RegExp(`(\\d+) ${english}`, "g"), `$1${localized}`),
        text,
      );
      const aniimoCountTerms = {
        "zh-CN": "个伊莫",
        ja: "体のアニモ",
        ko: "개 애니모",
      };
      return translatedCounts.replace(/(\d+) Aniimo/g, `$1${aniimoCountTerms[activeLocale] || " Aniimo"}`);
    }
    const formSuffix = text.match(/^(.*?)(\s[-–—]\s)([^-–—]+)$/);
    if (formSuffix) {
      const localizedForm = UI_TRANSLATIONS[activeLocale].get(formSuffix[3]) || payload?.display?.[formSuffix[3]];
      if (localizedForm) return `${formSuffix[1]}${formSuffix[2]}${localizedForm}`;
    }
    const parentheticalForm = text.match(/^(.*?)\s\(([^()]+)\)$/);
    if (parentheticalForm) {
      const localizedName = payload?.display?.[parentheticalForm[1]] || parentheticalForm[1];
      const localizedForm = UI_TRANSLATIONS[activeLocale].get(parentheticalForm[2])
        || payload?.display?.[parentheticalForm[2]]
        || parentheticalForm[2];
      if (localizedName !== parentheticalForm[1] || localizedForm !== parentheticalForm[2]) {
        return `${localizedName} (${localizedForm})`;
      }
    }
    return text;
  }

  function translate(value) {
    const source = String(value ?? "");
    if (activeLocale === "en" || !source) return source;
    const direct = registeredDisplay.get(source)
      || UI_TRANSLATIONS[activeLocale].get(source)
      || payload?.display?.[source];
    if (direct) return direct;
    const punctuated = source.match(/^(.*?)([.!?])$/);
    if (punctuated) {
      const translatedBase = UI_TRANSLATIONS[activeLocale].get(punctuated[1])
        || payload?.display?.[punctuated[1]];
      if (translatedBase) return `${translatedBase}${punctuated[2]}`;
    }
    const labeled = source.match(/^(Class|Type):\s*(.+)$/);
    if (labeled) {
      const label = UI_TRANSLATIONS[activeLocale].get(labeled[1]) || labeled[1];
      const content = translate(labeled[2]);
      return `${label}: ${content}`;
    }
    const composite = source.match(/^(.+?):\s+(.+)$/);
    if (composite) {
      const left = translate(composite[1]);
      const right = translate(composite[2]);
      if (left !== composite[1] || right !== composite[2]) return `${left}: ${right}`;
    }
    return translatePattern(source);
  }

  function translateTextNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, [data-i18n-skip]")) return;
    const source = node.nodeValue || "";
    const trimmed = source.trim();
    if (!trimmed) return;
    const translated = translate(trimmed);
    if (translated === trimmed) return;
    const start = source.indexOf(trimmed);
    node.nodeValue = `${source.slice(0, start)}${translated}${source.slice(start + trimmed.length)}`;
  }

  function translateAttributes(element) {
    if (element.matches("[data-i18n-skip]")) return;
    for (const attribute of ["placeholder", "title", "aria-label"]) {
      const source = element.getAttribute(attribute);
      if (!source) continue;
      const translated = translate(source);
      if (translated !== source) element.setAttribute(attribute, translated);
    }
  }

  function translateTree(root = document.body) {
    if (!root || activeLocale === "en") return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (!(root instanceof Element) && !(root instanceof DocumentFragment)) return;
    if (root instanceof Element) translateAttributes(root);
    const elements = root.querySelectorAll?.("*") || [];
    elements.forEach(translateAttributes);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      translateTextNode(node);
      node = walker.nextNode();
    }
  }

  async function load(locale) {
    activeLocale = normalizeLocale(locale);
    document.documentElement.lang = SUPPORTED_LANGUAGES[activeLocale].htmlLang;
    payload = null;
    registeredDisplay = new Map();
    templateMatchers = [];
    if (activeLocale !== "en") {
      const response = await fetch(`./data/i18n/${activeLocale}.json?v=${ASSET_VERSION}`);
      if (!response.ok) throw new Error(`Could not load localization for ${activeLocale}`);
      payload = await response.json();
      if (payload?.locale !== activeLocale || !payload?.texts || !payload?.display) {
        throw new Error(`Localization data has an invalid format for ${activeLocale}`);
      }
      templateMatchers = compileTemplateMatchers(payload.templates);
    }
    window.__aniipediaI18nDiagnostics = {
      locale: activeLocale,
      fallbackLocale: "en",
      uidCount: Number(payload?.uid_count || 0),
      missingEnglishUidCount: Array.isArray(payload?.missing_english_uids) ? payload.missing_english_uids.length : 0,
      displayCount: payload?.display ? Object.keys(payload.display).length : 0,
      templateCount: payload?.templates ? Object.keys(payload.templates).length : 0,
    };
  }

  function registerDisplay(localizations) {
    const additions = localizations?.[activeLocale];
    if (!additions || typeof additions !== "object") return;
    Object.entries(additions).forEach(([source, target]) => {
      if (source && target) registeredDisplay.set(source, target);
    });
    translateTree(document.body);
  }

  function start() {
    translateTree(document.body);
    observer?.disconnect();
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          translateAttributes(mutation.target);
        }
        if (mutation.type === "characterData") translateTextNode(mutation.target);
        mutation.addedNodes.forEach(translateTree);
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  function searchAlias(value) {
    const source = String(value ?? "");
    const localized = translate(source);
    return localized && localized !== source ? `${source} ${localized}` : source;
  }

  window.AniipediaI18n = Object.freeze({
    languages: SUPPORTED_LANGUAGES,
    load,
    normalizeLocale,
    registerDisplay,
    searchAlias,
    start,
    translate,
    translateTree,
    get locale() { return activeLocale; },
  });
})();
