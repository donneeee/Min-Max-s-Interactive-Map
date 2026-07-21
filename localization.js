(() => {
  "use strict";

  const ASSET_VERSION = "20260721-localization-v027";
  const SUPPORTED_LANGUAGES = Object.freeze({
    en: { label: "English", htmlLang: "en" },
    "zh-CN": { label: "简体中文", htmlLang: "zh-CN" },
    ja: { label: "日本語", htmlLang: "ja" },
    ko: { label: "한국어", htmlLang: "ko" },
  });

  // Website-owned interface copy. Game-owned names and descriptions come from
  // the complete UID maps generated from the client localization files.
  const UI_ROWS = [
    ["Team", "队伍", "チーム", "팀"],
    ["Team Builder", "队伍构建器", "チームビルダー", "팀 빌더"],
    ["Standard", "标准", "通常", "일반"],
    ["Co-op", "协作", "協力", "협동"],
    ["Clear", "清空", "クリア", "지우기"],
    ["Clear this saved team?", "要清空这个已保存的队伍吗？", "保存したチームをクリアしますか？", "저장된 팀을 지울까요?"],
    ["Team overview", "队伍概览", "チーム概要", "팀 개요"],
    ["Team slot", "队伍栏位", "チーム枠", "팀 슬롯"],
    ["Main Aniimo", "主控伊莫", "メインアニモ", "메인 애니모"],
    ["Core skill ally", "核心技能队友", "コアスキル仲間", "코어 스킬 동료"],
    ["Empty slot", "空栏位", "空き枠", "빈 슬롯"],
    ["Choose an Aniimo", "选择伊莫", "アニモを選択", "애니모 선택"],
    ["Choose an Aniimo below", "在下方选择伊莫", "下でアニモを選択", "아래에서 애니모 선택"],
    ["Select a team member", "选择队伍成员", "メンバーを選択", "팀원 선택"],
    ["Skill loadout", "技能配置", "スキル構成", "스킬 구성"],
    ["Active skill", "主动技能", "アクティブスキル", "액티브 스킬"],
    ["Choose a skill", "选择技能", "スキルを選択", "스킬 선택"],
    ["Switch-skill (Core)", "切换技能（核心）", "スイッチスキル（コア）", "스위치 스킬(코어)"],
    ["Switch-skill", "切换技能", "スイッチスキル", "스위치 스킬"],
    ["No switch-skill", "无切换技能", "スイッチスキルなし", "스위치 스킬 없음"],
    ["No Core skill available", "没有可用的核心技能", "利用できるコアスキルなし", "사용 가능한 코어 스킬 없음"],
    ["Core skill", "核心技能", "コアスキル", "코어 스킬"],
    ["Co-op Core access", "协作核心技能", "協力用コアスキル", "협동 코어 스킬"],
    ["Active", "主动", "アクティブ", "액티브"],
    ["Passive", "被动", "パッシブ", "패시브"],
    ["Carried item & runes", "携带物与符文", "持ち物とルーン", "소지품 및 룬"],
    ["Carried item", "携带物", "持ち物", "소지품"],
    ["No carried item", "无携带物", "持ち物なし", "소지품 없음"],
    ["No rune", "无符文", "ルーンなし", "룬 없음"],
    ["Main stat", "主属性", "メイン能力", "주 능력치"],
    ["Secondary roll", "副属性词条", "サブ効果", "보조 옵션"],
    ["No secondary roll", "无副属性词条", "サブ効果なし", "보조 옵션 없음"],
    ["Minimum", "最低", "最小", "최소"],
    ["Perfect", "完美", "最大", "최대"],
    ["Confirmed build stats", "已确认构建属性", "確認済みビルド能力", "확인된 빌드 능력치"],
    ["Projected build stats", "预计构筑属性", "予測ビルドステータス", "예상 빌드 능력치"],
    ["Aniimo level", "伊莫等级", "アニモレベル", "애니모 레벨"],
    ["Level scaling", "等级成长", "レベル成長", "레벨 성장"],
    ["Level scaling uses the listed Aniimo template as a neutral reference. Personal Potential (its own progression caps at 24, while carried-item effects can raise effective Potential higher), Personality, Awakening, percentage tier bonuses, carried-item enhancement, and conditional effects remain separate until configured, so these totals are projections rather than an exact personal stat sheet.", "等级成长以列出的伊莫模板作为中性参考。个人潜能（自身养成上限为24，携带物效果可使有效潜能超过24）、性格、觉醒、共鸣阶级百分比加成、携带物强化和条件效果在配置前均单独计算，因此这些总值是预测值，而不是个人属性表的精确结果。", "レベル成長は、表示されているアニモテンプレートを基準値として使用します。個体ポテンシャル（育成自体の上限は24ですが、持ち物効果で有効ポテンシャルは24を超えます）、性格、覚醒、共鳴段階の割合ボーナス、持ち物強化、条件付き効果は設定されるまで別扱いのため、これらの合計値は予測値であり、個体の正確なステータスではありません。", "레벨 성장은 표시된 애니모 템플릿을 중립 기준으로 사용합니다. 개체 포텐셜(자체 성장 상한은 24이며, 소지품 효과로 유효 포텐셜은 24를 초과할 수 있음), 성격, 각성, 공명 티어 비율 보너스, 소지품 강화 및 조건부 효과는 설정 전까지 별도로 처리되므로 이 합계는 예상치이며 개체의 정확한 능력치가 아닙니다."],
    ["Base value", "基础值", "基本値", "기본값"],
    ["Tier", "阶", "段階", "티어"],
    ["Tier bonuses", "阶级加成", "段階ボーナス", "티어 보너스"],
    ["Training level", "训练等级", "訓練レベル", "훈련 레벨"],
    ["Team synergy scenario", "队伍协同情景", "チームシナジー条件", "팀 시너지 조건"],
    ["Sample damage", "示例伤害", "サンプルダメージ", "샘플 피해"],
    ["Combat profile ready", "战斗配置已就绪", "戦闘プロファイル準備完了", "전투 프로필 준비 완료"],
    ["Choose an Aniimo for this slot", "为此栏位选择伊莫", "この枠のアニモを選択", "이 슬롯의 애니모 선택"],
    ["Use the team controls on the left to start configuring this position.", "使用左侧队伍控件开始配置此位置。", "左のチーム操作からこの枠を設定してください。", "왼쪽 팀 설정에서 이 슬롯을 구성하세요."],
    ["Loading Team Builder…", "正在加载队伍构建器…", "チームビルダーを読み込み中…", "팀 빌더 불러오는 중…"],
    ["Control one main Aniimo and bring the Core skills of three allies.", "操控一只主力伊莫，并携带三名队友的核心技能。", "メインのアニモ1体を操作し、3体の仲間のコアスキルを使用します。", "메인 애니모 한 마리를 조작하고 세 동료의 코어 스킬을 가져옵니다."],
    ["Build a four-Aniimo team with two active skills and an optional Core switch-skill each.", "组建四只伊莫的队伍；每只可配置两个主动技能和一个可选的核心切换技能。", "4体のアニモでチームを組み、それぞれにアクティブスキル2つと任意のコア・スイッチスキルを設定します。", "애니모 4마리로 팀을 구성하고 각자 액티브 스킬 2개와 선택형 코어 스위치 스킬을 설정합니다."],
    ["1 main + 3 Core allies", "1只主力 + 3名核心技能队友", "メイン1体 + コアスキル仲間3体", "메인 1마리 + 코어 동료 3마리"],
    ["Up to 4 Aniimo", "最多4只伊莫", "最大4体のアニモ", "애니모 최대 4마리"],
    ["This Aniimo has no Core skill in the current data.", "当前数据中这只伊莫没有核心技能。", "現在のデータでは、このアニモにコアスキルはありません。", "현재 데이터에는 이 애니모의 코어 스킬이 없습니다."],
    ["Resonance Training", "共鸣训练", "共鳴訓練", "공명 훈련"],
    ["Core", "核心", "コア", "코어"],
    ["Advanced", "进阶", "アドバンス", "고급"],
    ["Slot", "槽位", "スロット", "슬롯"],
    ["Toggle the buffs and conditional effects that apply to the situation you want to model.", "切换适用于目标情景的增益和条件效果。", "再現したい状況で有効なバフや条件付き効果を切り替えます。", "모델링할 상황에 적용되는 버프와 조건부 효과를 전환합니다."],
    ["Choose team members and skills to reveal supported synergy effects.", "选择队伍成员和技能以显示支持的协同效果。", "チームメンバーとスキルを選ぶと、対応するシナジー効果が表示されます。", "팀원과 스킬을 선택하면 지원되는 시너지 효과가 표시됩니다."],
    ["Configure one controlled Aniimo and the three Core skills supplied by your personal team.", "配置一只受控伊莫，以及个人队伍其余三只提供的核心技能。", "操作するアニモ1体と、個人チームの残り3体が提供するコアスキルを設定します。", "직접 조작할 애니모 한 마리와 개인 팀의 나머지 세 마리가 제공하는 코어 스킬을 설정합니다."],
    ["Configure four Aniimo, their skill loadouts, progression, carried items, runes, and team effects.", "配置四只伊莫及其技能、养成、携带物、符文和队伍效果。", "4体のアニモについて、スキル構成、育成、持ち物、ルーン、チーム効果を設定します。", "애니모 4마리의 스킬 구성, 성장, 소지품, 룬, 팀 효과를 설정합니다."],
    ["Totals combine listed base values, confirmed flat training gains, rune main stats, and selected rune rolls. Tier bonuses and conditional effects remain separate so their scaling is not guessed.", "总值包含列出的基础值、已确认的固定训练增益、符文主属性和所选词条。阶级加成与条件效果单独显示，以避免猜测其缩放方式。", "合計値には表示された基本値、確認済みの固定訓練上昇、ルーンのメイン能力、選択した追加効果が含まれます。段階ボーナスと条件付き効果は推測を避けるため別表示です。", "합계에는 표시된 기본값, 확인된 고정 훈련 증가치, 룬 주 능력치와 선택한 옵션이 포함됩니다. 티어 보너스와 조건부 효과는 추측을 피하기 위해 별도로 표시합니다."],
    ["Attack, skill Might, rune rolls, carried-item effects, and enabled team buffs are preserved in this build. A damage number will be added after the combat formula and enemy mitigation model are verified.", "此构建会保留攻击、技能威力、符文词条、携带物效果和已启用的队伍增益。验证战斗公式和敌方减伤模型后再加入伤害数值。", "このビルドでは攻撃、スキル威力、ルーン効果、持ち物効果、有効なチームバフを保持します。戦闘式と敵の軽減モデルを確認後、ダメージ値を追加します。", "이 빌드는 공격, 스킬 위력, 룬 옵션, 소지품 효과와 활성화된 팀 버프를 보존합니다. 전투 공식과 적 피해 감소 모델을 검증한 뒤 피해 수치를 추가합니다."],
    ["Selected item", "已选道具", "選択中のアイテム", "선택한 아이템"],
    ["Selected Aniimo", "已选伊莫", "選択中のアニモ", "선택한 애니모"],
    ["Pack contents", "礼包内容", "パック内容", "팩 구성품"],
    ["Contains all listed items", "包含所有列出的物品", "表示されたアイテムをすべて含みます", "표시된 모든 아이템 포함"],
    ["Choose one listed item", "从列出的物品中选择一个", "表示されたアイテムから1つ選択", "표시된 아이템 중 1개 선택"],
    ["Choose one bundle", "选择一个组合", "バンドルを1つ選択", "묶음 1개 선택"],
    ["Randomly grants one result", "随机获得一个结果", "結果を1つランダムで獲得", "결과 중 1개 무작위 획득"],
    ["Listed possible contents", "列出的可能内容", "表示された入手候補", "표시된 획득 가능 구성품"],
    ["Known contents", "已知内容", "判明している内容", "확인된 구성품"],
    ["Shop listings", "商店列表", "ショップ販売", "상점 판매"],
    ["Item Shop", "道具商店", "アイテムショップ", "아이템 상점"],
    ["Receives", "获得", "入手数", "획득"],
    ["Configured purchase limit", "设定购买上限", "設定購入上限", "설정 구매 한도"],
    ["Crafting & production", "制作与生产", "クラフト・生産", "제작 및 생산"],
    ["Produces", "产出", "生産物", "생산"],
    ["Requires", "所需材料", "必要素材", "필요 재료"],
    ["High-speed formula", "高速配方", "高速レシピ", "고속 제조식"],
    ["Progression uses", "养成用途", "育成用途", "성장 용도"],
    ["Aniimo progression", "伊莫养成", "アニモ育成", "애니모 성장"],
    ["Show Aniimo", "显示伊莫", "アニモを表示", "애니모 표시"],
    ["Item crafting", "道具制作", "アイテムクラフト", "아이템 제작"],
    ["Homeland production", "家园生产", "ホーム生産", "홈 생산"],
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
    ["Lumin Collection", "琥珀能量收集", "アンバーエナジー集め", "앰버 에너지 수집"],
    ["Runaway Amber", "逃脱的琥珀", "逃げたアンバー", "탈출한 앰버"],
    ["Lumen Marking", "辉耀印记", "キラメキマーク", "광휘 인장"],
    ["Lumen Markings", "辉耀印记", "キラメキマーク", "광휘 인장"],
    ["Lumen Ember", "辉耀琥珀", "キラメキアンバー", "광휘 앰버"],
    ["Lumen Embers", "辉耀琥珀", "キラメキアンバー", "광휘 앰버"],
    ["Ember", "余烬", "残り火", "불씨"],
    ["Sanctum: All in Sight", "地宫·一目了然", "ダンジョン・一目瞭然", "지하 궁전·명확한 시야"],
    ["Sanctum: Chasing Stormwinds", "地宫·逐电追风", "ダンジョン・疾風迅雷", "지하 궁전·번개와 바람의 질주"],
    ["Sanctum: Courageous Wit", "地宫·智行勇跃", "ダンジョン・智勇兼備", "지하 궁전·지혜로운 도약"],
    ["Sanctum: Double Vision", "地宫·眼观二路", "ダンジョン・二方に目をきかす", "지하 궁전·날카로운 시선"],
    ["Sanctum: Electric Surge", "地宫·电光流转", "ダンジョン・電光流転", "지하 궁전·전류의 흐름"],
    ["Sanctum: First Flame", "地宫·初生之火", "ダンジョン・初生の火", "지하 궁전·태초의 불꽃"],
    ["Sanctum: Flaming Wings", "地宫·逐火之翼", "ダンジョン・逐火の翼", "지하 궁전·화염 속의 비상"],
    ["Sanctum: Mistrider", "地宫·腾云驾雾", "ダンジョン・雲乗り", "지하 궁전·구름을 쫓아서"],
    ["Sanctum: Rigged Maze", "地宫·盘根错节", "ダンジョン・盤根錯節", "지하 궁전·뒤엉킨 뿌리"],
    ["Sanctum: Rising Flames", "地宫·烈火升腾", "ダンジョン・立ち上る炎", "지하 궁전·타오르는 불길"],
    ["Sanctum: Rushing Rapids", "地宫·激流勇进", "ダンジョン・激流勇進", "지하 궁전·몰아치는 급류"],
    ["Sanctum: Shatterstone", "地宫·冲岩裂石", "ダンジョン・ブラストロック", "지하 궁전·암석 파괴자"],
    ["Sanctum: Sword in the Stone", "地宫·石中之剑", "ダンジョン・石中の剣", "지하 궁전·바위 속의 검"],
    ["Sanctum: Through Flame and Thorn", "地宫·披荆燃棘", "ダンジョン・燃ゆるイバラ", "지하 궁전·가시덤불을 헤치고"],
    ["Sanctum: Water to Ice", "地宫·凝水成冰", "ダンジョン・水から氷へ", "지하 궁전·얼어붙는 물결"],
    ["Sanctum: Windborne", "地宫·乘风而起", "ダンジョン・風乗り", "지하 궁전·바람의 비상"],
    ["Sanctum: Wings Unfurled", "地宫·展翼滑翔", "ダンジョン・翼の滑空", "지하 궁전·활강의 날개"],
    ["Settings", "设置", "設定", "설정"],
    ["Settings sections", "设置分区", "設定セクション", "설정 섹션"],
    ["General Settings", "常规设置", "一般設定", "일반 설정"],
    ["Themes", "主题", "テーマ", "테마"],
    ["Filter shortcuts", "筛选快捷操作", "フィルターショートカット", "필터 단축키"],
    ["Map shortcuts", "地图快捷操作", "マップショートカット", "지도 단축키"],
    ["Double-click a filter tab to select every result currently shown in that tab.", "双击筛选标签，可选择该标签中当前显示的所有结果。", "フィルタータブをダブルクリックすると、そのタブに現在表示されているすべての結果を選択できます。", "필터 탭을 두 번 클릭하면 해당 탭에 현재 표시된 모든 결과를 선택합니다."],
    ["Right-click a map icon to deselect that location and remove its pin.", "右键单击地图图标，可取消选择该地点并移除图钉。", "マップアイコンを右クリックすると、その場所の選択を解除してピンを削除できます。", "지도 아이콘을 마우스 오른쪽 버튼으로 클릭하면 해당 위치의 선택을 해제하고 핀을 제거합니다."],
    ["Blessed Aniimo", "受赐福的伊莫", "祝福されたアニモ", "축복받은 애니모"],
    ["Pathfinder Challenge", "联结者挑战", "トリッパーチャレンジ", "모험가 도전"],
    ["Pathfinder Challengers", "联结者挑战", "トリッパーチャレンジ", "모험가 도전"],
    ["Elite Pathfinder Challenge", "精英联结者挑战", "精鋭トリッパーチャレンジ", "엘리트 모험가 도전"],
    ["Elite Pathfinder Challengers", "精英联结者挑战", "精鋭トリッパーチャレンジ", "엘리트 모험가 도전"],
    ["Click the thread line to collapse", "点击分支线可收起", "スレッド線をクリックして折りたたむ", "스레드 선을 클릭하여 접기"],
    ["You have unapplied theme changes. Close Settings and discard this draft?", "您有尚未应用的主题更改。要关闭设置并放弃此草稿吗？", "未適用のテーマ変更があります。設定を閉じて、この下書きを破棄しますか？", "적용하지 않은 테마 변경 사항이 있습니다. 설정을 닫고 이 초안을 버리시겠습니까?"],
    ["Website theme", "网站主题", "ウェブサイトテーマ", "웹사이트 테마"],
    ["Preview UI colors and motifs here. Game artwork and rarity glows always keep their original colors.", "在此预览界面颜色和图案。游戏美术资源与稀有度光效始终保留原始颜色。", "ここでUIの色とモチーフをプレビューできます。ゲーム画像とレアリティの発光色は常に元のままです。", "여기에서 UI 색상과 모티프를 미리 볼 수 있습니다. 게임 이미지와 희귀도 광원은 항상 원래 색상을 유지합니다."],
    ["The original cool mint and gold interface.", "原版的冷薄荷绿与金色界面。", "従来のクールなミントとゴールドの画面です。", "기존의 시원한 민트와 골드 인터페이스입니다."],
    ["Coal-dark fur, glowing orange markings, and golden sparks.", "煤黑色毛发、发光橙色纹路与金色火花。", "石炭色の毛並み、輝くオレンジの模様、金色の火花。", "석탄빛 털, 빛나는 주황 무늬, 황금빛 불꽃."],
    ["Gunmetal armor, cobalt energy, and a sharp magenta glint.", "炮铜色护甲、钴蓝能量与锐利的洋红光芒。", "ガンメタルの鎧、コバルトの力、鋭いマゼンタの輝き。", "건메탈 갑옷, 코발트 에너지, 날카로운 마젠타 빛."],
    ["Custom", "自定义", "カスタム", "사용자 지정"],
    ["Build and save your own palette.", "创建并保存自己的配色。", "自分だけの配色を作成して保存します。", "나만의 색상표를 만들어 저장합니다."],
    ["Live preview", "实时预览", "ライブプレビュー", "실시간 미리보기"],
    ["Aniimo index", "伊莫图鉴", "アニモ図鑑", "애니모 도감"],
    ["Active", "已启用", "選択中", "활성"],
    ["Highlight", "高亮", "ハイライト", "강조"],
    ["Raised card and border", "浮层卡片与边框", "浮き上がったカードと枠線", "돌출 카드와 테두리"],
    ["Primary and muted text remain readable across every surface.", "主要文字和弱化文字在所有表面上都保持清晰。", "メイン文字と補助文字は、どの面でも読みやすく保たれます。", "기본 텍스트와 보조 텍스트가 모든 표면에서 읽기 쉽게 유지됩니다."],
    ["Primary action", "主要操作", "メイン操作", "기본 동작"],
    ["Hover state", "悬停状态", "ホバー状態", "마우스 오버 상태"],
    ["Custom colors", "自定义颜色", "カスタムカラー", "사용자 지정 색상"],
    ["Changes update the example above immediately and remain a draft until Apply theme.", "更改会立即更新上方示例，并在点击“应用主题”前保持为草稿。", "変更は上の例にすぐ反映され、「テーマを適用」を押すまでは下書きのままです。", "변경 사항은 위 예시에 즉시 반영되며 '테마 적용'을 누르기 전까지 초안으로 유지됩니다."],
    ["Start from Aniipedia", "以 Aniipedia 为基础", "Aniipediaから始める", "Aniipedia에서 시작"],
    ["Start from Emberpup", "以小炭犬为基础", "エンバーパップから始める", "엠버펍에서 시작"],
    ["Start from Pawney", "以帕尼为基础", "ポーニーから始める", "포니에서 시작"],
    ["Reset preview", "重置预览", "プレビューをリセット", "미리보기 초기화"],
    ["Apply theme", "应用主题", "テーマを適用", "테마 적용"],
    ["Theme applied", "主题已应用", "テーマ適用済み", "테마 적용됨"],
    ["Page background", "页面背景", "ページ背景", "페이지 배경"],
    ["Background glow", "背景光晕", "背景の光", "배경 광원"],
    ["Surface", "表面", "サーフェス", "표면"],
    ["Raised surface", "浮层表面", "浮き上がった面", "돌출 표면"],
    ["Borders", "边框", "枠線", "테두리"],
    ["Primary text", "主要文字", "メイン文字", "기본 텍스트"],
    ["Muted text", "弱化文字", "補助文字", "보조 텍스트"],
    ["Primary accent", "主要强调色", "メインアクセント", "기본 강조색"],
    ["Ignited accent", "点燃强调色", "点火アクセント", "점화 강조색"],
    ["The deepest page and map-workspace color.", "页面和地图工作区最深的底色。", "ページとマップ作業領域の最も深い色です。", "페이지와 지도 작업 영역의 가장 어두운 색입니다."],
    ["The secondary tone used in page gradients.", "用于页面渐变的辅助色调。", "ページのグラデーションに使う補助色です。", "페이지 그라데이션에 사용하는 보조 색상입니다."],
    ["Sidebar, dialogs, and main panel backgrounds.", "侧边栏、对话框和主面板背景。", "サイドバー、ダイアログ、メインパネルの背景です。", "사이드바, 대화 상자, 기본 패널 배경입니다."],
    ["Cards, inputs, and elevated controls.", "卡片、输入框和浮层控件。", "カード、入力欄、浮き上がった操作部品です。", "카드, 입력란, 돌출 컨트롤입니다."],
    ["Dividers, outlines, and inactive control edges.", "分隔线、轮廓和未启用控件边缘。", "区切り線、輪郭、非選択コントロールの縁です。", "구분선, 윤곽선, 비활성 컨트롤 가장자리입니다."],
    ["Headings and important interface text.", "标题和重要界面文字。", "見出しと重要な画面文字です。", "제목과 중요한 인터페이스 텍스트입니다."],
    ["Descriptions, metadata, and secondary labels.", "说明、元数据和次要标签。", "説明、メタデータ、補助ラベルです。", "설명, 메타데이터, 보조 라벨입니다."],
    ["Active navigation, focus rings, and primary actions.", "启用中的导航、焦点环和主要操作。", "選択中のナビゲーション、フォーカス枠、メイン操作です。", "활성 탐색, 포커스 링, 기본 동작입니다."],
    ["Hover states and the strong end of gradients.", "悬停状态和渐变的浓色端。", "ホバー状態とグラデーションの強い側です。", "마우스 오버 상태와 그라데이션의 진한 쪽입니다."],
    ["Badges, sparks, version text, and small callouts.", "徽章、火花、版本文字和小型提示。", "バッジ、火花、バージョン表示、小さな注記です。", "배지, 불꽃, 버전 텍스트, 작은 안내입니다."],
    ["Game assets keep their original colors", "游戏资源保留原始颜色", "ゲーム画像は元の色のままです", "게임 이미지는 원래 색상을 유지합니다"],
    ["Rarity glows stay unchanged", "稀有度光效保持不变", "レアリティの発光色は変わりません", "희귀도 광원은 변경되지 않습니다"],
    ["Grey", "灰色", "グレー", "회색"],
    ["Blue", "蓝色", "ブルー", "파랑"],
    ["Purple", "紫色", "パープル", "보라"],
    ["Gold", "金色", "ゴールド", "골드"],
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
    ["Open in Aniilog", "\u5728\u7814\u7a76\u624b\u518c\u4e2d\u6253\u5f00", "\u30a2\u30cb\u30e2\u30ce\u30fc\u30c8\u3067\u958b\u304f", "\uc5f0\uad6c \uc218\ucca9\uc5d0\uc11c \uc5f4\uae30"],
    ["Open in Item-log", "\u5728\u9053\u5177\u56fe\u9274\u4e2d\u6253\u5f00", "\u30a2\u30a4\u30c6\u30e0\u30ed\u30b0\u3067\u958b\u304f", "\uc544\uc774\ud15c \ub3c4\uac10\uc5d0\uc11c \uc5f4\uae30"],
    ["Name, area, coordinate", "名称、区域、坐标", "名前、エリア、座標", "이름, 지역, 좌표"],
    ["Aniimo, form, or location", "Aniimo、形态或位置", "Aniimo、形態、場所", "Aniimo, 형태 또는 위치"],
    ["Aniimo, form, skill, or effect", "Aniimo、形态、技能或效果", "Aniimo、形態、スキル、効果", "Aniimo, 형태, 스킬 또는 효과"],
    ["Items", "道具", "アイテム", "아이템"],
    ["Eggs", "蛋", "タマゴ", "알"],
    ["Elite Eggs", "卓越伊莫蛋", "エクセレントアニモのタマゴ", "탁월 애니모 알"],
    ["Alpha Eggs", "头目伊莫蛋", "アルファアニモのタマゴ", "엘리트 애니모 알"],
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
    ["Prismana", "虹光", "虹色", "천휘"],
    ["Blessed", "被赐福", "祝福を受けた", "축복받은"],
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
    ["ATK", "攻击", "攻撃", "공격"],
    ["P.DEF", "物理防御", "物理防御", "물리 방어"],
    ["M.DEF", "魔法防御", "魔法防御", "마법 방어"],
    ["REGEN", "回复", "回復", "회복"],
    ["DMG reduction", "伤害减免", "ダメージ軽減", "피해 감소"],
    ["CD Reduction", "冷却缩减", "クールダウン短縮", "재사용 대기시간 감소"],
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
    ["Rune slots", "符文槽", "ルーンスロット", "룬 슬롯"],
    ["Rune roll data", "符文词条数据", "ルーン効果データ", "룬 옵션 데이터"],
    ["Compatible Rune rolls", "可用符文词条", "装着可能なルーン効果", "호환 룬 옵션"],
    ["Possible secondary rolls", "可出现的副词条", "出現可能なサブ効果", "가능한 보조 옵션"],
    ["Shape", "形状", "形状", "모양"],
    ["Main stat", "主属性", "メインステータス", "주 능력치"],
    ["Rune Energy", "符文能量", "ルーンエナジー", "룬 에너지"],
    ["Secondary attributes", "副词条数", "サブ効果数", "보조 옵션 수"],
    ["Base CP", "基础战力", "基礎CP", "기본 CP"],
    ["Focused roll", "定向词条", "特化効果", "집중 옵션"],
    ["Main", "主属性", "メイン", "주 능력치"],
    ["Slot", "槽位", "スロット", "슬롯"],
    ["Unlock", "解锁", "解放", "해금"],
    ["sockets at max", "个槽位，最高强化", "スロット・最大強化", "개 슬롯 · 최대 강화"],
    ["Offense", "攻击", "攻撃", "공격"],
    ["Support", "辅助", "サポート", "지원"],
    ["Diamond", "钻石", "ひし形", "다이아몬드"],
    ["Square", "方形", "四角", "사각형"],
    ["Circle", "圆形", "円形", "원형"],
    ["Any shape", "任意形状", "任意の形状", "모든 모양"],
    ["Unavailable", "不可用", "利用不可", "이용 불가"],
    ["Not available at this rarity", "此稀有度不可用", "このレアリティでは使用不可", "이 희귀도에서는 사용할 수 없음"],
    ["Fixed slots are tied to this item. Any-shape slots roll separately on each copy.", "固定槽位由该道具决定；任意形状槽位会在每件道具上分别随机。", "固定スロットはアイテム固有です。任意形状スロットは個体ごとに別々に抽選されます。", "고정 슬롯은 아이템에 지정되며, 모든 모양 슬롯은 아이템마다 별도로 결정됩니다."],
    ["Generic secondary rolls use 80–99% of the listed cap; a perfect roll reaches 100%.", "普通副词条为所列上限的 80–99%；完美词条达到 100%。", "通常のサブ効果は表示上限の80～99%、完璧な効果は100%に達します。", "일반 보조 옵션은 표시된 상한의 80~99%이며, 완벽 옵션은 100%에 도달합니다."],
    ["Focused rolls use 60–124% of their base value; a perfect focused roll reaches 125%. Other lines use the shape pool below.", "定向词条为基础值的 60–124%；完美定向词条达到 125%。其他词条使用下方对应形状的词条池。", "特化効果は基準値の60～124%、完璧な特化効果は125%に達します。その他は下記の形状別プールから抽選されます。", "집중 옵션은 기준값의 60~124%이며, 완벽 집중 옵션은 125%에 도달합니다. 다른 옵션은 아래 모양별 목록을 사용합니다."],
    ["Base attributes", "基础属性", "基礎属性", "기본 속성"],
    ["Core effect", "核心效果", "コア効果", "핵심 효과"],
    ["Advanced effect", "高级效果", "上級効果", "고급 효과"],
    ["Known maps", "已知地图", "既知のマップ", "알려진 지도"],
    ["Can evolve to", "可进化为", "進化先", "진화 가능"],
    ["Evolved from", "进化来源", "進化元", "진화 이전"],
    ["Requirements", "条件", "条件", "조건"],
    ["Quality", "品质", "品質", "품질"],
    ["Sells for", "出售可得", "売却価格", "판매 가격"],
    ["Source", "来源", "入手元", "출처"],
    ["Source method", "来源方式", "入手方法", "획득 방식"],
    ["All filters", "所有筛选", "すべてのフィルター", "모든 필터"],
    ["Featured filters", "推荐筛选", "おすすめフィルター", "추천 필터"],
    ["How to obtain", "获取方式", "入手方法", "획득 방법"],
    ["Item filter", "道具筛选", "アイテムフィルター", "아이템 필터"],
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
    const slot = text.match(/^Slot (\d+)$/);
    if (slot) return `${UI_TRANSLATIONS[activeLocale].get("Slot") || "Slot"} ${slot[1]}`;
    const runeUnlock = text.match(/^Unlock \+(\d+)$/);
    if (runeUnlock) return `${UI_TRANSLATIONS[activeLocale].get("Unlock") || "Unlock"} +${runeUnlock[1]}`;
    const socketSummary = text.match(/^(\d+) sockets at max \+(\d+)$/);
    if (socketSummary) {
      if (activeLocale === "zh-CN") return `${socketSummary[1]} 个槽位，最高强化 +${socketSummary[2]}`;
      if (activeLocale === "ja") return `${socketSummary[1]} スロット・最大強化 +${socketSummary[2]}`;
      if (activeLocale === "ko") return `${socketSummary[1]}개 슬롯 · 최대 강화 +${socketSummary[2]}`;
    }
    const runeMain = text.match(/^Main:\s*(.+)$/);
    if (runeMain) {
      const stats = runeMain[1].split(" / ").map((stat) => translate(stat));
      return `${UI_TRANSLATIONS[activeLocale].get("Main") || "Main"}: ${stats.join(" / ")}`;
    }
    const dottedComposite = text.match(/^(.+?)\s·\s(.+)$/);
    if (dottedComposite) {
      const left = translate(dottedComposite[1]);
      const right = translate(dottedComposite[2]);
      if (left !== dottedComposite[1] || right !== dottedComposite[2]) return `${left} · ${right}`;
    }
    const namedRange = text.match(/^(.+?)\s([+-]?\d+(?:\.\d+)?%?(?:–[+-]?\d+(?:\.\d+)?%?)?)$/);
    if (namedRange) {
      const label = translate(namedRange[1]);
      if (label !== namedRange[1]) return `${label} ${namedRange[2]}`;
    }
    const currencyAmount = text.match(/^([\d,]+)\s+(.+)$/);
    if (currencyAmount) {
      const currency = translate(currencyAmount[2]);
      if (currency !== currencyAmount[2]) return `${currencyAmount[1]} ${currency}`;
    }
    const choice = text.match(/^Choice ([\d,]+)$/);
    if (choice) {
      if (activeLocale === "zh-CN") return `选项 ${choice[1]}`;
      if (activeLocale === "ja") return `選択肢 ${choice[1]}`;
      if (activeLocale === "ko") return `선택 ${choice[1]}`;
    }
    const receivesItems = text.match(/^Receives ([\d,]+) items?$/);
    if (receivesItems) {
      if (activeLocale === "zh-CN") return `获得 ${receivesItems[1]} 件道具`;
      if (activeLocale === "ja") return `${receivesItems[1]} 個のアイテムを獲得`;
      if (activeLocale === "ko") return `아이템 ${receivesItems[1]}개 획득`;
    }
    const purchaseLimit = text.match(/^Configured purchase limit: ([\d,]+)$/);
    if (purchaseLimit) {
      if (activeLocale === "zh-CN") return `购买上限：${purchaseLimit[1]}`;
      if (activeLocale === "ja") return `購入上限：${purchaseLimit[1]}`;
      if (activeLocale === "ko") return `구매 제한: ${purchaseLimit[1]}`;
    }
    const usedInRecipes = text.match(/^Used in ([\d,]+) recipes?$/);
    if (usedInRecipes) {
      if (activeLocale === "zh-CN") return `用于 ${usedInRecipes[1]} 个配方`;
      if (activeLocale === "ja") return `${usedInRecipes[1]} 件のレシピで使用`;
      if (activeLocale === "ko") return `레시피 ${usedInRecipes[1]}개에 사용`;
    }
    const itemUse = text.match(/^Uses ([\d,]+) of this item(?:\s·\s(.+))?$/);
    if (itemUse) {
      const suffix = itemUse[2]
        ? ` · ${itemUse[2].split(" · ").map((part) => translate(part)).join(" · ")}`
        : "";
      if (activeLocale === "zh-CN") return `消耗此道具 ${itemUse[1]} 个${suffix}`;
      if (activeLocale === "ja") return `このアイテムを ${itemUse[1]} 個使用${suffix}`;
      if (activeLocale === "ko") return `이 아이템 ${itemUse[1]}개 사용${suffix}`;
    }
    const aniimoCount = text.match(/^([\d,]+) Aniimo$/);
    if (aniimoCount) {
      if (activeLocale === "zh-CN") return `${aniimoCount[1]} 个伊莫`;
      if (activeLocale === "ja") return `${aniimoCount[1]}体のアニモ`;
      if (activeLocale === "ko") return `${aniimoCount[1]}개 애니모`;
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
    const formSuffix = text.match(/^(.*?)(\s[-–—•]\s)([^-–—•]+)$/);
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

  function translateUid(uid, fallback = "") {
    const source = String(fallback ?? "");
    if (activeLocale === "en") return source;
    return payload?.texts?.[String(uid ?? "")] || translate(source);
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
    translateUid,
    translateTree,
    get locale() { return activeLocale; },
  });
})();
