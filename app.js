const storeKey = "awung_beauty_records_v1";

const state = {
  section: "type",
  mediaRecorder: null,
  chunks: [],
  startedAt: null,
  timerId: null,
  audioUrl: "",
  seconds: 0,
  typeResult: null,
  comfortRole: "pursuer",
  counselorView: "home",
  counselorUnlocked: sessionStorage.getItem("counselorUnlocked") === "true"
};

const sections = [
  ["type", "갈등 유형"],
  ["comfort", "상담 섹션"],
  ["mailbox", "음성사서함"],
  ["journal", "회기 일기"],
  ["mypage", "마이페이지"]
];

const counselorSections = [
  ["home", "홈"],
  ["type", "갈등 유형"],
  ["comfort", "상담 섹션"],
  ["mailbox", "음성사서함"],
  ["journal", "회기 일기"]
];

const pursuerWords = ["왜", "말해", "말하", "묻", "물어", "얘기", "대답", "확인", "붙잡", "잡고", "쫓", "따라", "서운", "불안", "따지", "연락", "전화", "카톡", "설명", "설득", "외면", "버림", "다가"];
const withdrawerWords = ["피하", "조용", "침묵", "숨", "거리", "압박", "머리", "멈춤", "굳", "혼자", "도망", "방어", "정리", "차단", "부담", "시간", "물러"];
const selfMarkers = ["저는", "제가", "저도", "저를", "저에게", "저한테", "나는", "내가", "나도", "나를", "나에게", "나한테"];
const partnerMarkers = ["상대는", "상대가", "상대도", "상대를", "상대에게", "상대한테", "파트너는", "파트너가", "파트너도", "남편은", "남편이", "아내는", "아내가", "그 사람은", "그 사람도"];
const typeQuestions = [
  {
    question: "상대가 멀어질 때 나는 보통 어떻게 하나요?",
    options: [
      ["p", "바로 묻거나 확인하고 싶어진다"],
      ["w", "나도 조용해지거나 거리를 둔다"],
      ["m", "상황마다 다르다"]
    ]
  },
  {
    question: "말이 커질 때 몸은 어디로 가고 싶나요?",
    options: [
      ["p", "상대 쪽으로 다가가 붙잡고 싶다"],
      ["w", "잠깐 자리를 벗어나 숨고 싶다"],
      ["w", "몸이 굳고 말이 멈춘다"],
      ["m", "다가가고 싶다가도 피하고 싶다"]
    ]
  },
  {
    question: "내가 가장 듣고 싶은 반응은 무엇인가요?",
    options: [
      ["p", "나를 놓지 않겠다고 말해줬으면 한다"],
      ["w", "잠깐 생각할 시간을 줬으면 한다"],
      ["m", "내 마음을 먼저 알아줬으면 한다"]
    ]
  }
];

const moodOptions = [
  "😟 불안",
  "😣 답답함",
  "😠 화남",
  "😢 슬픔",
  "😞 서운함",
  "😔 외로움",
  "😰 두려움",
  "😤 억울함",
  "😶 무기력",
  "😵 혼란",
  "😫 피곤함",
  "😐 멍함",
  "🙂 안도",
  "😌 차분함",
  "🫶 고마움",
  "🌱 희망",
  "✨ 기대",
  "✍️ 기타"
];

const comfortTechniques = {
  pursuer: [
    {
      title: "공감적 반영",
      plain: "내가 크게 말한 내용보다 그 밑의 마음을 스스로 짧게 비춰 보는 연습입니다.",
      why: "안심강아지는 연결이 끊길까 봐 말이 빨라지기 쉽습니다. 오늘은 설득보다 '내가 왜 이렇게 급해졌는지'를 천천히 듣는 것이 목표입니다.",
      tryText: "나는 지금 따지고 싶은 마음 밑에, 당신이 멀어진 것 같아 무섭고 외로운 마음이 있어.",
      counselor: "핵심 단어와 애착 정서를 공감적으로 반영하고, 이차 정서 아래의 일차 정서와 애착 욕구를 추적합니다."
    },
    {
      title: "인정",
      plain: "내 반응을 비난하기 전에, 그 반응이 왜 나왔는지 이해해 보는 연습입니다.",
      why: "안심강아지는 스스로를 '또 예민했다'고 몰아붙이기 쉽습니다. 먼저 반응의 이유가 이해 가능하다는 안전감을 만들어야 합니다.",
      tryText: "내가 자꾸 확인하려 한 건 괴롭히려는 게 아니라, 우리 사이가 괜찮은지 알고 싶어서였어.",
      counselor: "애착 맥락 안에서 반응을 인정하고, 추적 행동의 타당성을 일차 정서와 연결해 정서 조절을 돕습니다."
    },
    {
      title: "몸-마음 확인 질문",
      plain: "싸움의 줄거리 대신, 그 순간 내 몸과 마음에서 일어난 일을 직접 확인하는 연습입니다.",
      why: "안심강아지는 사건 설명과 항의로 빨리 넘어갈 수 있습니다. 내 몸의 신호를 묻는 질문은 속도를 늦추고 진짜 두려움에 닿게 합니다.",
      tryText: "그 말을 들었을 때 내 가슴이 조여 왔어. 그 순간 나는 혼자 남겨지는 느낌이었어.",
      counselor: "촉발 단서, 신체 각성, 의미 구성, 행동화 경향을 환기적 질문으로 풀어 정서 경험을 구체화합니다."
    },
    {
      title: "강조",
      plain: "중요한 마음을 짧고 느리게 다시 말해, 스스로도 더 선명하게 붙잡는 연습입니다.",
      why: "안심강아지의 말은 많아질수록 핵심이 흐려질 수 있습니다. 오늘은 한 문장을 천천히 반복해 핵심 정서를 살립니다.",
      tryText: "나는 당신 마음속에 내가 없을까 봐 두려웠어. 그게 너무 무서워서 말이 커졌어.",
      counselor: "RISSSC 원칙에 따라 반복, 이미지, 단순성, 부드러운 톤, 느린 속도, 내담자 언어를 사용해 정서를 강조합니다."
    },
    {
      title: "재연",
      plain: "항의 대신 내 속마음을 파트너에게 짧고 직접적으로 전해 보는 연습입니다.",
      why: "안심강아지는 항의는 익숙하지만 취약한 마음을 직접 전하는 일은 어렵습니다. 새로운 신호를 보내는 것이 핵심입니다.",
      tryText: "지금 나를 봐주면서, 내가 혼자 남겨진 것 같아 무서웠다는 말을 들어줄 수 있어?",
      counselor: "확장된 정서 경험을 재연으로 안무하고, 개방한 배우자와 듣는 배우자의 경험을 각각 처리합니다."
    }
  ],
  withdrawer: [
    {
      title: "공감적 반영",
      plain: "말이 멈춘 이유를 '무관심'이 아니라 '압도됨'으로 스스로 비춰 보는 연습입니다.",
      why: "쉼표고양이는 마음이 없어서가 아니라 너무 커진 감정을 견디기 어려워 멀어질 수 있습니다. 오늘은 그 보호 반응을 부드럽게 알아차립니다.",
      tryText: "내가 조용해진 건 관심이 없어서가 아니라, 또 실패할 것 같아서 머리가 하얘졌기 때문이야.",
      counselor: "철회 반응을 비판단적으로 추적하고, 차단/이탈 순간을 반영하며 압도감 아래의 일차 정서를 탐색합니다."
    },
    {
      title: "인정",
      plain: "잠깐 물러나고 싶은 마음을 부끄러워하기보다, 몸이 안전을 찾는 방식으로 이해합니다.",
      why: "쉼표고양이는 자신을 '회피하는 사람'으로만 느끼기 쉽습니다. 먼저 왜 물러났는지 인정받아야 다시 접촉할 힘이 생깁니다.",
      tryText: "당신이 실망할까 봐 겁이 나서, 대답을 잘해야 한다는 압박에 잠깐 멈췄어.",
      counselor: "철회 행동을 애착 맥락에서 인정하고, 정서적 압도감을 조절하려는 보호 전략으로 타당화합니다."
    },
    {
      title: "몸-마음 확인 질문",
      plain: "감정 이름이 바로 안 떠오를 때, 몸의 반응이나 머릿속 문장부터 확인하는 연습입니다.",
      why: "쉼표고양이는 '모르겠다'에서 멈추기 쉽습니다. 감정 단어를 억지로 찾기보다 몸, 이미지, 하고 싶은 행동부터 보면 더 쉽게 들어갑니다.",
      tryText: "그때 감정 이름은 잘 모르겠는데, 목이 막히고 방을 나가고 싶었어.",
      counselor: "정서 명명보다 신체 각성, 지각, 애착 의미를 먼저 환기해 철회자의 경험 접근성을 높입니다."
    },
    {
      title: "재구성",
      plain: "내 침묵을 '상대를 버림'이 아니라 '상처 주지 않으려는 서툰 보호'로 다시 이해합니다.",
      why: "쉼표고양이는 침묵 때문에 더 나쁜 사람처럼 느끼고, 그래서 더 숨을 수 있습니다. 반응의 좋은 의도를 찾아야 새 선택이 생깁니다.",
      tryText: "나는 싸움을 키우고 싶지 않아서 멈췄는데, 당신에게는 내가 사라지는 것처럼 보였겠구나.",
      counselor: "방어적 철회를 애착 재구성으로 다루어 부정적 의미를 완화하고 접근 가능한 신호로 재조직합니다."
    },
    {
      title: "재연",
      plain: "완벽한 설명 대신, 사라지지 않았다는 작은 신호를 직접 전하는 연습입니다.",
      why: "쉼표고양이에게 큰 고백은 부담될 수 있습니다. 오늘은 짧고 안전한 한 문장으로 접촉을 유지하는 것이 목표입니다.",
      tryText: "지금 말이 잘 안 나오지만, 나는 여기 있고 당신을 포기한 게 아니야. 잠깐만 천천히 말하고 싶어.",
      counselor: "위험 감수 수준을 세밀하게 조절하며, 최소 단위의 재연으로 접촉을 만들고 수용 반응을 처리합니다."
    }
  ]
};

const counselorTechniqueDetails = [
  {
    title: "공감적 반영",
    purpose: "치료적 동맹을 강화하고, 면담 내용 아래의 핵심 정서 경험과 애착 의미를 드러내어 정서 처리 과정을 조직합니다.",
    when: "내담자가 내용 서술, 방어, 논쟁으로 이동하며 현재 정서 경험에서 이탈할 때 사용합니다. 특히 일차 정서가 짧게 드러나는 순간에 우선 적용합니다.",
    steps: [
      "내담자의 언어, 이미지, 신체 단서를 포착합니다.",
      "내용보다 애착적으로 의미 있는 핵심 메시지를 반영합니다.",
      "반영은 잠정적이고 협력적인 톤으로 제시합니다.",
      "내담자의 수정과 확인을 통해 조율 정확도를 높입니다."
    ],
    phrases: [
      "그 말을 하면서 한숨이 나왔어요. 그만큼 혼자 견디는 느낌이 컸던 것 같아요.",
      "겉으로는 화가 난 것처럼 보이지만, 안쪽에는 붙잡고 싶은 마음이 있는 것처럼 들려요.",
      "지금 말이 멈춘 순간, 몸이 먼저 안전한 곳을 찾은 것 같아요."
    ],
    caution: "반영을 해석, 교육, 문제해결로 대체하지 않습니다. 경험보다 앞서가면 정서적 교감이 끊어질 수 있습니다."
  },
  {
    title: "인정",
    purpose: "내담자의 정서와 행동화 경향을 애착 맥락 안에서 타당화하여 수치심, 방어, 반응성을 낮춥니다.",
    when: "내담자가 자신의 반응을 병리화하거나, 파트너가 상대 반응을 공격/무관심으로 고정 해석할 때 사용합니다.",
    steps: [
      "구체적 상호작용 맥락과 촉발 단서를 짚습니다.",
      "정서 반응과 행동화 경향의 이해 가능성을 언급합니다.",
      "반응을 애착 욕구, 두려움, 보호 전략과 연결합니다.",
      "타당화 이후 일차 정서와 욕구 탐색으로 이동합니다."
    ],
    phrases: [
      "그렇게 중요한 사람에게서 멀어지는 느낌을 받았다면, 확인하고 싶어진 것이 이해됩니다.",
      "비난받을 것 같고 실패할 것 같았다면, 잠깐 멈추고 싶었던 것이 이해돼요.",
      "그 반응은 관계를 망치려는 것이 아니라, 어떻게든 안전해지고 싶은 시도였을 수 있어요."
    ],
    caution: "타당화는 행동의 정당화가 아닙니다. 영향과 책임을 지우지 않으면서 정서 맥락을 열어야 합니다."
  },
  {
    title: "환기적 반응과 질문",
    purpose: "촉발 단서, 신체 각성, 의미 구성, 행동화 경향, 주관적 정서를 풀어 정서 경험에 접근하게 합니다.",
    when: "내담자가 감정 명명에 실패하거나, 경험 수준이 낮고 사건 설명/인지화에 머물 때 사용합니다.",
    steps: [
      "정서 반응을 촉발한 단서(cue)를 확인합니다.",
      "신체 각성(bodily arousal)을 구체화합니다.",
      "상대 반응에 부여된 애착 의미(meaning making)를 묻습니다.",
      "행동화 경향(action tendency)을 탐색합니다."
    ],
    phrases: [
      "그 말을 들은 바로 그 순간, 몸 어디가 먼저 반응했나요?",
      "그 표정이 당신에게 어떤 뜻처럼 들렸나요?",
      "그때 마음은 상대에게 다가가고 싶었나요, 아니면 잠깐 사라지고 싶었나요?"
    ],
    caution: "질문이 평가나 취조처럼 들리지 않도록 반영과 인정 사이에 배치합니다. 경험을 교정하려 하지 않습니다."
  },
  {
    title: "강조",
    purpose: "핵심 정서를 생생하게 확장하여 정서 경험의 깊이를 높이고, 2기 재구조화로 이어질 접근 가능성을 만듭니다.",
    when: "일차 정서, 애착 두려움, 애착 욕구가 짧게 드러났으나 내담자가 곧바로 차단하거나 내용으로 돌아갈 때 사용합니다.",
    steps: [
      "RISSSC: 반복, 이미지, 단순성, 부드러움, 느림, 내담자 언어를 사용합니다.",
      "핵심 단어와 이미지를 반복해 정서 초점을 유지합니다.",
      "정서 강도를 모니터링하며 담아내기(containment)와 균형을 맞춥니다.",
      "확장된 정서를 애착 맥락 안에 둡니다."
    ],
    phrases: [
      "그 말이 중요해 보여요. '내가 당신 마음에 없는 것 같았다.' 여기 잠깐 머물러 볼까요?",
      "머리가 하얘졌다는 말, 그 순간 모든 말이 사라졌다는 뜻처럼 들려요.",
      "혼자 남겨진 느낌. 그 느낌이 지금도 조금 올라오나요?"
    ],
    caution: "과활성화 또는 차단이 보이면 slice it thinner로 강도를 낮춥니다. 강조와 담아내기의 균형이 핵심입니다."
  },
  {
    title: "재구성",
    purpose: "부정적 상호작용 고리 안의 행동을 애착 욕구, 두려움, 보호 전략의 관점으로 재조직합니다.",
    when: "비난-방어, 요구-철회 고리가 고착되어 파트너 행동이 부정적 애착 의미로만 해석될 때 사용합니다.",
    steps: [
      "상호작용 고리와 각자의 행동화 경향을 추적합니다.",
      "행동이 파트너에게 미친 영향을 인정합니다.",
      "행동 밑의 애착 두려움과 욕구를 추측합니다.",
      "새로운 애착 의미가 경험에 맞는지 확인합니다."
    ],
    phrases: [
      "목소리가 커진 것은 공격처럼 보였지만, 사실은 당신을 놓치고 싶지 않은 신호였을 수 있어요.",
      "입을 닫은 것은 버리는 행동처럼 보였지만, 더 망치지 않으려는 멈춤이었을 수 있어요.",
      "두 분 모두 관계를 지키려 했는데, 서로에게는 반대로 보였던 것 같습니다."
    ],
    caution: "재구성이 상처의 영향을 축소하지 않도록 주의합니다. 충분한 반영과 인정 이후에 애착 의미를 제안합니다."
  },
  {
    title: "재연",
    purpose: "확장된 정서 경험을 파트너에게 직접 전달하게 하여 새로운 상호작용 사건을 만들고 애착 결합을 재구조화합니다.",
    when: "내담자가 일차 정서나 애착 욕구에 접촉했고, 수용 배우자가 들을 수 있는 정서적 안전이 확보되었을 때 사용합니다.",
    steps: [
      "무대 준비: 내적 경험과 대인관계적 의미를 정리합니다.",
      "재연 지시: 파트너를 향해 직접 말하도록 초대합니다.",
      "개방한 배우자의 경험을 처리합니다.",
      "듣는 배우자의 수용 경험과 반응을 처리합니다.",
      "새 상호작용을 요약하고 통합합니다."
    ],
    phrases: [
      "지금 이 말을 저에게 하지 말고, 파트너를 보면서 한 문장으로 전해볼 수 있을까요?",
      "말하기 어렵다면 '이 말을 하는 게 어렵다'는 것부터 말해볼 수 있을까요?",
      "방금 그 말을 전했을 때 몸에서 어떤 변화가 있었나요?"
    ],
    caution: "재연은 충분한 정서 확장과 안전 확인 뒤 시행합니다. 방어가 상승하면 총알받이, 인정, 세밀한 위험 조절이 필요합니다."
  }
];

function getRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(storeKey) || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(storeKey, JSON.stringify(records));
    return true;
  } catch {
    alert("브라우저 저장 공간이 부족해 기록을 저장하지 못했습니다. 오래된 녹음이나 기록을 내보낸 뒤 삭제해주세요.");
    return false;
  }
}

function addRecord(record, shouldRender = true) {
  const records = getRecords();
  records.unshift({ id: makeId(), createdAt: new Date().toISOString(), ...record });
  if (!saveRecords(records)) return false;
  if (shouldRender) render();
  return true;
}

function deleteRecord(id) {
  const records = getRecords().filter((record) => record.id !== id);
  if (saveRecords(records)) render();
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `record-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function summarize(text, kind = "기록") {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return `${kind}의 핵심 정서를 아직 요약할 만큼 충분히 적지 않았습니다.`;
  const selfSentences = selfFocusedSentences(clean);
  const selfText = selfSentences.join(" ") || clean;
  const emotions = inferEmotions(selfText);
  const need = inferNeed(selfText);
  const core = pickCoreSentences(selfSentences.length ? selfSentences : splitSentences(clean));
  return `자동 요약: ${emotions.length ? `말하는 사람의 주요 정서는 '${emotions.join(", ")}'로 보이며, ` : ""}${need ? `'${need}' 욕구가 드러납니다. ` : "반복되는 정서와 애착 욕구를 더 확인해볼 수 있습니다. "}\n핵심 문장: ${core}`;
}

function summarizeJournalEntry({ beforeMood, afterMood, moodReason, impressive }) {
  const reason = (moodReason || "").replace(/\s+/g, " ").trim();
  const scene = (impressive || "").replace(/\s+/g, " ").trim();
  const combined = `${reason} ${scene}`.trim();
  if (!combined) {
    return {
      summary: "자동 요약: 아직 회기 내용을 요약할 만큼 충분히 적지 않았습니다.\n인상 깊은 부분: 상담 중 마음에 남은 장면을 적으면 키워드와 함께 정리됩니다.",
      keywords: []
    };
  }

  const emotions = inferEmotions(combined);
  const need = inferNeed(combined);
  const reasonCore = journalSnippet(reason);
  const sceneCore = journalSnippet(scene);
  const keywords = journalKeywords(combined);
  const emotionText = emotions.length ? emotions.join(", ") : "아직 더 살펴볼 감정";
  const needText = need || "이해와 정리";
  const summary = [
    `자동 요약: 상담 전에는 ${beforeMood || "기록한 감정"}에서 출발했고, 상담 후에는 ${afterMood || "새로운 감정"} 쪽으로 조금 이동했습니다.`,
    `오늘 기록에서 두드러지는 정서는 '${emotionText}'이며, 그 밑에는 '${needText}' 욕구가 함께 보입니다.`,
    reason ? `기분이 바뀐 이유: ${reasonCore}` : "기분이 바뀐 이유: 아직 더 적어볼 수 있습니다.",
    scene ? `인상 깊은 부분: ${sceneCore}` : "인상 깊은 부분: 아직 더 적어볼 수 있습니다."
  ].join("\n");
  return { summary, keywords };
}

function journalSnippet(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const sentences = splitSentences(clean);
  const candidates = sentences.length ? sentences : [clean];
  const best = candidates
    .map((sentence, index) => ({ sentence: trimJournalSnippet(sentence), score: coreSentenceScore(sentence), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0];
  return best?.sentence || trimJournalSnippet(clean);
}

function trimJournalSnippet(sentence) {
  const clean = String(sentence || "").replace(/\s+/g, " ").trim();
  if (clean.length <= 72) return clean;
  const cutAt = clean.lastIndexOf(" ", 68);
  return `${clean.slice(0, cutAt > 32 ? cutAt : 68)}...`;
}

function journalKeywords(text) {
  const rules = [
    ["몸의 신호", ["몸", "목", "가슴", "배", "어깨", "머리", "하얘", "긴장", "상태"]],
    ["감정 알아차림", ["기분", "감정", "느낌", "마음"]],
    ["자기 이해", ["나를", "제가", "저의", "돌아볼", "생각", "깨달"]],
    ["상대 이해", ["상대", "남편", "아내", "당신", "파트너"]],
    ["싸움의 고리", ["싸움", "장면", "반복", "패턴", "말이 커", "다툼"]],
    ["멈춤과 거리", ["멈", "쉬", "거리", "나가", "잠깐", "화장실"]],
    ["말하기 연습", ["말", "표현", "얘기", "전하", "질문"]],
    ["듣기와 공감", ["듣", "물어", "공감", "이해"]],
    ["안심 욕구", ["안심", "괜찮", "중요", "소중"]],
    ["변화 가능성", ["좋았", "도움", "가능", "바뀌", "해볼"]]
  ];
  const found = rules.filter(([, words]) => words.some((word) => text.includes(word))).map(([label]) => label);
  return [...new Set(found)].slice(0, 5);
}

function findAny(text, words) {
  return words.find((word) => text.includes(word));
}

function inferEmotions(text) {
  const rules = [
    ["압도감", ["머리가 하얘", "머리 하얘", "말이 안", "말이 막", "듣기 싫", "말하기 싫", "숨이 막", "굳", "얼어", "멍"]],
    ["미안함", ["미안", "죄책", "잘못한", "후회"]],
    ["두려움", ["두려", "무서", "겁", "잃을", "떠날", "버려"]],
    ["외로움", ["외로", "혼자", "소외"]],
    ["서운함", ["서운", "섭섭"]],
    ["불안", ["불안", "초조", "걱정"]],
    ["답답함", ["답답", "막막"]],
    ["슬픔", ["슬픔", "슬프", "눈물", "울컥"]],
    ["억울함", ["억울", "부당"]],
    ["분노", ["화가", "화났", "화났", "분노", "짜증"]],
    ["고마움", ["고마", "감사"]]
  ];
  return rules
    .filter(([, words]) => words.some((word) => text.includes(word)))
    .map(([label]) => label)
    .slice(0, 2);
}

function inferNeed(text) {
  const rules = [
    ["안심", ["안심", "괜찮", "확신"]],
    ["이해", ["이해", "알아", "들어", "들어줬"]],
    ["공간", ["쉬고", "쉬고 싶", "시간", "혼자", "잠깐", "화장실", "나오고"]],
    ["연결", ["같이", "함께", "다가", "붙잡", "관계"]],
    ["존중", ["존중", "중요", "소중"]],
    ["사과", ["사과", "미안"]]
  ];
  const found = rules.find(([, words]) => words.some((word) => text.includes(word)));
  return found ? found[0] : "";
}

function pickCoreSentences(sentences) {
  const scored = sentences
    .map((sentence, index) => ({ sentence: trimSentence(sentence), score: coreSentenceScore(sentence), index }))
    .filter((item) => item.sentence.length >= 8)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
  return scored.length ? scored.join(" ") : "핵심 문장을 고르기에는 아직 내용이 조금 짧습니다.";
}

function coreSentenceScore(sentence) {
  const source = String(sentence);
  let score = 0;
  if (selfMarkers.some((marker) => source.includes(marker))) score += 4;
  if (["머리가 하얘", "미안", "두려", "무서", "외로", "서운", "불안", "답답", "싫었", "피하", "쉬고", "말하기"].some((word) => source.includes(word))) score += 5;
  if (["느꼈", "같았", "싶었", "힘들", "고통", "혼자"].some((word) => source.includes(word))) score += 3;
  if (partnerMarkers.some((marker) => source.includes(marker))) score -= 2;
  return score;
}

function trimSentence(sentence) {
  const clean = String(sentence || "").replace(/\s+/g, " ").trim();
  if (clean.length <= 120) return clean;
  const cutAt = clean.lastIndexOf(" ", 112);
  return `${clean.slice(0, cutAt > 60 ? cutAt : 112)}...`;
}

function scoreType(text, answers = []) {
  const source = selfFocusedText(text);
  const p = pursuerWords.reduce((sum, word) => sum + count(source, word), 0);
  const w = withdrawerWords.reduce((sum, word) => sum + count(source, word), 0);
  const answerP = answers.filter((value) => value === "p").length * 2;
  const answerW = answers.filter((value) => value === "w").length * 2;
  const pursuer = p + answerP;
  const withdrawer = w + answerW;
  let type = "둘 다 조금씩";
  if (pursuer >= withdrawer + 2) type = "안심강아지 경향";
  if (withdrawer >= pursuer + 2) type = "쉼표고양이 경향";
  if (pursuer >= 5 && withdrawer >= 5 && Math.abs(pursuer - withdrawer) < 2) type = "둘 다 조금씩";
  return { type, pursuer, withdrawer };
}

function selfFocusedText(text) {
  const clean = String(text || "").trim();
  if (!clean) return "";
  const focused = selfFocusedSentences(clean);
  return focused.length ? focused.join(" ") : clean;
}

function selfFocusedSentences(text) {
  const sentences = splitSentences(text);
  return sentences.map(focusSelfPart).filter((sentence) => {
    const hasSelf = selfMarkers.some((marker) => sentence.includes(marker));
    const hasPartner = partnerMarkers.some((marker) => sentence.includes(marker));
    return hasSelf || !hasPartner;
  });
}

function splitSentences(text) {
  return String(text || "").split(/(?<=[.!?。！？요다죠함음\.])\s+|\n+/).map((sentence) => sentence.trim()).filter(Boolean);
}

function focusSelfPart(sentence) {
  const firstSelf = firstMarkerIndex(sentence, selfMarkers);
  const firstPartner = firstMarkerIndex(sentence, partnerMarkers);
  if (firstSelf === -1) return sentence;
  if (firstPartner === -1) return sentence;
  if (firstPartner < firstSelf) return sentence.slice(firstSelf);
  return sentence.slice(0, firstPartner);
}

function firstMarkerIndex(text, markers) {
  return markers.reduce((closest, marker) => {
    const index = text.indexOf(marker);
    if (index === -1) return closest;
    return closest === -1 ? index : Math.min(closest, index);
  }, -1);
}

function count(text, word) {
  return (text.match(new RegExp(escapeRegExp(word), "g")) || []).length;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function typeDescription(type) {
  const descriptions = {
    "안심강아지 경향": "갈등 순간 가까이 다가가 확인받고 싶어지는 쪽입니다. 겉으로는 질문, 항의, 설득처럼 보여도 안쪽에는 버려질까 봐 무서운 마음과 안심받고 싶은 욕구가 있을 수 있습니다.",
    "쉼표고양이 경향": "갈등 순간 잠깐 멈추고 안전한 거리를 찾고 싶어지는 쪽입니다. 겉으로는 침묵, 거리두기, 회피처럼 보여도 안쪽에는 실패감, 두려움, 평온해지고 싶은 욕구가 있을 수 있습니다.",
    "둘 다 조금씩": "상황에 따라 가까이 다가가기도 하고 잠깐 물러나기도 합니다. 두 사람이 동시에 불안을 느끼면 서로 더 급해지거나 둘 다 멈출 수 있어, 먼저 몸의 속도를 낮추는 약속이 중요합니다.",
    "혼합형": "한쪽으로 뚜렷하게 기울기보다 여러 반응이 섞여 있습니다. 갈등 주제, 피로도, 안전감에 따라 역할이 바뀌는지 관찰해보면 좋습니다."
  };
  return descriptions[type];
}

function verticalText(text) {
  return [...String(text)].map((char) => `<span>${escapeHtml(char)}</span>`).join("");
}

function render() {
  const counselorNote = localStorage.getItem("counselorNote") || "";
  const sideNav = state.section === "counselor" && state.counselorUnlocked
    ? counselorSections.map(([id, label]) => `<button class="${state.counselorView === id ? "active" : ""}" data-counselor-view="${id}">${label}</button>`).join("")
    : sections.map(([id, label]) => `<button class="${state.section === id ? "active" : ""}" data-section="${id}">${label}</button>`).join("");
  document.getElementById("app").innerHTML = `
    <header class="hero">
      <div class="topbar">
        <div class="brand">
          <span>아웅다웅? 아름다움!</span>
          <small>EFT 커플 상담 개입 도구</small>
        </div>
        <nav class="nav">${sections.map(([id, label]) => `<button class="${state.section === id ? "active" : ""}" data-section="${id}">${label}</button>`).join("")}</nav>
        <button class="counselor-gate ${state.section === "counselor" ? "active" : ""}" id="counselorGate" title="상담자 접근">상담자</button>
      </div>
      <div class="hero-inner">
        <div class="hero-title-wrap">
          <h1><span class="vertical-stack">${verticalText("아웅다웅?")}</span><span class="vertical-stack">${verticalText("아름다움!")}</span></h1>
          <p class="hero-kicker vertical-stack">${verticalText("우리는 왜 싸울까?")}</p>
        </div>
        <div class="hero-meta">
          <span>EFT 커플 상담</span>
          <span>갈등 유형</span>
          <span>상담 섹션</span>
          <span>음성사서함</span>
          <span>회기 일기</span>
        </div>
        <p>갈등의 말싸움 아래 숨어 있는 불안, 거리두기, 다가가고 싶은 마음을 기록하고 나누는 EFT 기반 커플 상담 웹앱입니다.</p>
        ${counselorNote ? `<p class="hero-note">오늘의 한마디: ${escapeHtml(counselorNote)}</p>` : ""}
        <div class="hero-actions">
          <button class="primary-button" data-section="type">내 갈등 유형 보기</button>
          <button class="ghost-button" data-section="comfort">상담 섹션 열기</button>
        </div>
        <div class="hero-mascot-stage" aria-hidden="true">
          <div class="room-card room-card-cat image-card">
            <img src="assets/comma-cat.png" alt="">
            <span class="mascot-label">쉼표고양이</span>
          </div>
          <div class="room-card room-card-dog image-card">
            <img src="assets/reassurance-dog.png" alt="">
            <span class="mascot-label">안심강아지</span>
          </div>
        </div>
      </div>
    </header>
    <main class="app-shell">
      <div class="workspace">
        <aside class="side">${sideNav}</aside>
        <div class="content">
          ${typeSection()}
          ${comfortSection()}
          ${mailboxSection()}
          ${journalSection()}
          ${myPageSection()}
          ${state.counselorUnlocked ? counselorSection() : counselorLockedSection()}
          ${sourcesSection()}
        </div>
      </div>
    </main>
  `;
  bindCommon();
  bindMailbox();
  bindJournal();
  bindType();
  bindComfort();
  bindCounselor();
}

function mailboxSection() {
  const records = getRecords().filter((record) => record.kind === "voice");
  return `
    <section class="section ${state.section === "mailbox" ? "active" : ""}" id="mailbox">
      <h2>음성사서함</h2>
      <p class="lede">말로 바로 부딪히기 어려운 순간, 삐 소리 뒤에 잠깐 멈춰서 마음을 남깁니다. 녹음은 이 브라우저의 로컬 저장소에 보관됩니다.</p>
      <div class="notice privacy">실제 배포에서는 음성 파일 암호화, 커플별 권한, 상담자 접근 로그, 삭제 요청, 보관 기간 동의가 필요합니다.</div>
      <div class="grid">
        <div class="record-box">
          <div class="mini-label">녹음 상태</div>
          <div class="timer" id="timer">${formatTime(state.seconds)}</div>
          <div class="button-row">
            <button class="primary-button" id="startRecord" ${state.mediaRecorder ? "disabled" : ""}>삐 소리 후 녹음</button>
            <button class="danger-button" id="stopRecord" ${state.mediaRecorder ? "" : "disabled"}>정지</button>
          </div>
          <div class="field" style="margin-top:14px">
            <label for="voiceMemo">녹음 내용 메모</label>
            <textarea id="voiceMemo" placeholder="예: 내가 침묵한 건 관심이 없어서가 아니라 말이 커질까 봐 무서웠기 때문이야."></textarea>
          </div>
          <div class="field">
            <label for="voiceOwner">누구의 음성사서함인가요?</label>
            <select id="voiceOwner">
              <option>나</option>
              <option>파트너</option>
              <option>함께</option>
            </select>
          </div>
          <div class="toggle-row">
            <label class="toggle"><input id="sharePartnerVoice" type="checkbox" checked> 파트너에게 공유</label>
            <label class="toggle"><input id="shareCounselorVoice" type="checkbox" checked> 상담자에게 공유</label>
            <label class="toggle"><input id="shareTypeVoice" type="checkbox"> 유형도 함께 알림</label>
          </div>
          <button class="secondary-button" id="saveVoice" ${state.audioUrl && !state.mediaRecorder ? "" : "disabled"} style="margin-top:14px">음성사서함 저장</button>
          ${state.audioUrl ? `<audio controls src="${state.audioUrl}" style="width:100%;margin-top:12px"></audio>` : ""}
        </div>
        <div class="card">
          <h3>상대에게 전할 문장</h3>
          <p class="lede">상담자가 권유한 속도보다 빠르게 해명하지 않고, 내 안쪽 마음을 짧게 전하는 형식입니다.</p>
          <div class="chips">
            <span class="chip">지금은 말이 막혀</span>
            <span class="chip">관심이 없는 게 아니야</span>
            <span class="chip">조금 천천히 듣고 싶어</span>
            <span class="chip">내가 불안해서 확인했어</span>
          </div>
        </div>
      </div>
      <h3>저장된 음성</h3>
      ${recordList(records)}
    </section>
  `;
}

function journalSection() {
  const records = getRecords().filter((record) => record.kind === "journal");
  return `
    <section class="section ${state.section === "journal" ? "active" : ""}" id="journal">
      <h2>오늘 회기 일기</h2>
      <p class="lede">상담 전후의 감정 변화와 오늘 마음에 남은 장면을 기록합니다. 짧아도 좋고, 길게 쓰고 싶으면 충분히 길게 쓸 수 있습니다.</p>
      <div class="grid">
        <form class="card" id="journalForm">
          <div class="grid">
            <div class="field">
              <label for="beforeMood">상담 전 기분</label>
              ${moodSelect("beforeMood", "😟 불안")}
              <input class="other-mood" id="beforeMoodOther" placeholder="상담 전 기분을 직접 적어주세요." hidden>
            </div>
            <div class="field">
              <label for="afterMood">상담 후 기분</label>
              ${moodSelect("afterMood", "🙂 안도")}
              <input class="other-mood" id="afterMoodOther" placeholder="상담 후 기분을 직접 적어주세요." hidden>
            </div>
          </div>
          <div class="field">
            <label for="moodReason">이런 기분이 든 이유</label>
            <textarea id="moodReason"></textarea>
          </div>
          <div class="field tall">
            <label for="impressive">상담 중 가장 인상 깊었던 부분</label>
            <textarea id="impressive"></textarea>
          </div>
          <div class="toggle-row">
            <label class="toggle"><input id="sharePartnerJournal" type="checkbox"> 파트너에게 공유</label>
            <label class="toggle"><input id="shareCounselorJournal" type="checkbox" checked> 상담자에게 공유</label>
            <label class="toggle"><input id="shareTypeJournal" type="checkbox"> 유형도 함께 알림</label>
          </div>
          <button class="primary-button" type="submit" style="margin-top:14px">일기 저장</button>
        </form>
        <div class="card">
          <h3>자동 요약 미리보기</h3>
          <p class="summary" id="journalPreview">내용을 쓰면 정서, 욕구, 핵심 문장을 간단히 요약합니다.</p>
          <div class="chips journal-keywords" id="journalKeywords"></div>
        </div>
      </div>
      <h3>저장된 일기</h3>
      ${recordList(records)}
    </section>
  `;
}

function moodSelect(id, selected) {
  return `
    <select id="${id}">
      ${moodOptions.map((mood) => `<option value="${mood}" ${mood === selected ? "selected" : ""}>${mood}</option>`).join("")}
    </select>
  `;
}

function myPageSection() {
  const records = getRecords();
  const typeRecords = records.filter((record) => record.kind === "type");
  const voiceRecords = records.filter((record) => record.kind === "voice");
  const journalRecords = records.filter((record) => record.kind === "journal");
  const sharedRecords = records.filter((record) => record.sharePartner || record.shareCounselor || record.shareType);
  const latestType = typeRecords[0];
  const latestJournal = journalRecords[0] ? normalizeJournalRecord(journalRecords[0]) : null;
  const voiceGroups = groupBy(voiceRecords, (record) => record.author || "작성자 미지정");
  const groupOrder = ["나", "파트너", "함께", "작성자 미지정"];
  return `
    <section class="section ${state.section === "mypage" ? "active" : ""}" id="mypage">
      <h2>마이페이지</h2>
      <p class="lede">이 브라우저에 저장된 나와 파트너의 갈등 자료, 음성사서함, 회기 일기를 한곳에서 확인합니다.</p>
      <div class="mypage-stats">
        ${statCard("전체 기록", records.length)}
        ${statCard("갈등 유형", typeRecords.length)}
        ${statCard("음성사서함", voiceRecords.length)}
        ${statCard("회기 일기", journalRecords.length)}
        ${statCard("공유 표시", sharedRecords.length)}
      </div>
      <div class="grid">
        <div class="card">
          <h3>최근 갈등 모습</h3>
          ${latestType ? `
            <p><span class="type-badge">${escapeHtml(latestType.type || "유형 기록")}</span></p>
            <p class="summary">${escapeHtml(latestType.summary || "최근 갈등 유형 요약이 아직 없습니다.")}</p>
          ` : `<p class="lede">갈등 유형을 기록하면 최근 모습이 이곳에 정리됩니다.</p>`}
        </div>
        <div class="card">
          <h3>최근 회기 흐름</h3>
          ${latestJournal ? `
            <p>상담 전 ${latestJournal.beforeMood || "기록 없음"} -> 상담 후 ${latestJournal.afterMood || "기록 없음"}</p>
            <p class="summary">${escapeHtml(latestJournal.summary || "")}</p>
            ${latestJournal.keywords?.length ? `<div class="chips">${latestJournal.keywords.map((keyword) => `<span class="chip">${escapeHtml(keyword)}</span>`).join("")}</div>` : ""}
          ` : `<p class="lede">회기 일기를 저장하면 감정 변화와 키워드가 이곳에 정리됩니다.</p>`}
        </div>
      </div>
      <h3>나와 파트너의 음성사서함</h3>
      <div class="mypage-columns">
        ${groupOrder.map((label) => `
          <div class="card">
            <h4>${label}의 음성</h4>
            ${recordList(voiceGroups[label] || [])}
          </div>
        `).join("")}
      </div>
      <h3>갈등 유형 기록</h3>
      ${recordList(typeRecords)}
      <h3>회기 일기 기록</h3>
      ${recordList(journalRecords)}
      <h3>전체 기록</h3>
      ${recordList(records)}
    </section>
  `;
}

function statCard(label, value) {
  return `
    <div class="stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function typeSection() {
  return `
    <section class="section ${state.section === "type" ? "active" : ""}" id="type">
      <h2>싸울 때 내 모습 보기</h2>
      <p class="lede">우리가 싸울 때 내가 가까이 다가가 안심을 찾는지, 잠깐 멈추고 안전한 거리를 찾는지 살펴봅니다. 진단이 아니라 상담 대화를 돕는 자기관찰 도구입니다.</p>
      <div class="grid">
        <div class="card">
          <div class="field tall">
            <label for="conflictStory">우리는 싸울 때</label>
            <textarea id="conflictStory" placeholder="싸움이 시작된 장면을 떠올려보세요.
내가 한 말과 행동, 상대가 한 말과 행동,
그때 마음속에서 가장 크게 올라온 감정이나
차마 말하지 못했던 생각을 편하게 쏟아내듯 적어주세요."></textarea>
          </div>
          ${typeQuestions.map((item, i) => `
            <div class="field">
              <label>${item.question}</label>
              <select class="typeAnswer" data-index="${i}">
                <option value="">선택</option>
                ${item.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
              </select>
            </div>
          `).join("")}
          <div class="toggle-row">
            <label class="toggle"><input id="shareTypeResult" type="checkbox"> 파트너에게 결과 알림</label>
            <label class="toggle"><input id="shareTypeCounselor" type="checkbox" checked> 상담자에게 결과 알림</label>
          </div>
          <button class="primary-button" id="analyzeType" style="margin-top:14px">내 모습 보기</button>
        </div>
        ${typeResultPanel()}
      </div>
    </section>
  `;
}

function typeResultPanel() {
  if (!state.typeResult) {
    return `
      <div class="result-panel" id="typeResult">
        <div class="result-mascots">
          <div class="mini-mascot-card"><img src="assets/reassurance-dog.png" alt=""><strong>안심강아지</strong></div>
          <div class="mini-mascot-card"><img src="assets/comma-cat.png" alt=""><strong>쉼표고양이</strong></div>
        </div>
        <span class="type-badge">아직 분석 전</span>
        <p class="lede" style="margin-top:14px">이야기를 입력하면 안심강아지, 쉼표고양이, 둘 다 조금씩 중 지금 모습에 가까운 설명이 여기에 표시됩니다.</p>
      </div>
    `;
  }

  const { result, summary, text } = state.typeResult;
  const isMixed = result.type === "혼합형" || result.type === "둘 다 조금씩";
  const dominantLabel = result.type === "쉼표고양이 경향" ? "쉼표고양이 점수" : result.type === "안심강아지 경향" ? "안심강아지 점수" : "안심강아지 점수";
  const dominantScore = result.type === "쉼표고양이 경향" ? result.withdrawer : result.pursuer;
  const dominantColor = result.type === "쉼표고양이 경향" ? "var(--rose)" : "var(--blue)";
  const resultMascot = result.type === "쉼표고양이 경향" ? "cat" : result.type === "안심강아지 경향" ? "dog" : "both";
  return `
    <div class="result-panel" id="typeResult">
      <div class="result-mascots ${resultMascot === "both" ? "is-mixed" : ""}">
        ${resultMascot === "both" || resultMascot === "dog" ? `<div class="mini-mascot-card"><img src="assets/reassurance-dog.png" alt=""><strong>안심강아지</strong></div>` : ""}
        ${resultMascot === "both" || resultMascot === "cat" ? `<div class="mini-mascot-card"><img src="assets/comma-cat.png" alt=""><strong>쉼표고양이</strong></div>` : ""}
      </div>
      <span class="type-badge">${result.type}</span>
      <p class="lede" style="margin-top:14px">${typeDescription(result.type)}</p>
      ${isMixed ? `
        <div class="field">
          <label>안심강아지 점수</label>
          <div class="meter"><span style="width:${Math.min(result.pursuer * 10, 100)}%"></span></div>
        </div>
        <div class="field">
          <label>쉼표고양이 점수</label>
          <div class="meter"><span style="width:${Math.min(result.withdrawer * 10, 100)}%;background:var(--rose)"></span></div>
        </div>
      ` : `
        <div class="field">
          <label>${dominantLabel}</label>
          <div class="meter"><span style="width:${Math.min(dominantScore * 10, 100)}%;background:${dominantColor}"></span></div>
        </div>
      `}
      ${text ? `<div class="original-text"><strong>내가 쓴 말</strong><p>${escapeHtml(text)}</p></div>` : ""}
      <p class="summary">${escapeHtml(summary)}</p>
    </div>
  `;
}

function comfortSection() {
  const role = state.comfortRole;
  const roleLabel = role === "pursuer" ? "안심강아지" : "쉼표고양이";
  const techniques = comfortTechniques[role];
  const todayIndex = dailyTechniqueIndex(techniques.length);
  const today = techniques[todayIndex];
  const rest = techniques.filter((_, index) => index !== todayIndex);
  return `
    <section class="section ${state.section === "comfort" ? "active" : ""}" id="comfort">
      <h2>오늘의 EFT 기법</h2>
      <p class="lede">매일 하나의 기법을 골라 천천히 연습합니다. 안심강아지와 쉼표고양이는 같은 갈등 안에서도 필요한 도움이 다를 수 있어, 역할에 따라 추천 문구를 다르게 보여줍니다.</p>
      <div class="role-switch" aria-label="추천 대상 선택">
        <button class="${role === "pursuer" ? "active" : ""}" data-comfort-role="pursuer" type="button">안심강아지</button>
        <button class="${role === "withdrawer" ? "active" : ""}" data-comfort-role="withdrawer" type="button">쉼표고양이</button>
      </div>
      <article class="card daily-technique">
        <div>
          <span class="mini-label">오늘 ${roleLabel}에게 추천</span>
          <h3>${today.title}</h3>
          <p>${today.plain}</p>
        </div>
        <div class="technique-note">
          <strong>왜 이 기법인가요?</strong>
          <p>${today.why}</p>
        </div>
        <div class="try-script">
          <strong>오늘 해볼 문장</strong>
          <p>${today.tryText}</p>
        </div>
      </article>
      <h3>${roleLabel}를 위한 다른 기법</h3>
      <div class="grid technique-grid">
        ${rest.map((item) => `
          <article class="card technique-card">
            <span class="type-badge">${item.title}</span>
            <p>${item.plain}</p>
            <div class="try-script compact">
              <strong>짧은 문장</strong>
              <p>${item.tryText}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function dailyTechniqueIndex(length) {
  const now = new Date();
  const stamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let total = 0;
  for (const char of stamp) total += char.charCodeAt(0);
  return total % length;
}

function counselorLockedSection() {
  return `
    <section class="section ${state.section === "counselor" ? "active" : ""}" id="counselor">
      <h2>상담자 공간</h2>
      <p class="lede">상담자 접근 코드가 필요한 공간입니다. 상단의 상담자 버튼을 눌러 접근해주세요.</p>
      <div class="locked-panel">
        <span class="lock-mark">잠금</span>
        <h3>상담자 전용</h3>
        <p>커플이 상담자에게 공유한 기록과 오늘의 한마디는 상담자 접근 후 확인할 수 있습니다.</p>
        <button class="primary-button" id="lockedCounselorGate" type="button">접근 코드 입력</button>
      </div>
    </section>
  `;
}

function counselorSection() {
  const records = getRecords();
  const sharedRecords = records.filter((record) => record.shareCounselor);
  const content = {
    home: counselorHome(records, sharedRecords),
    type: counselorTypeView(records),
    comfort: counselorComfortView(),
    mailbox: counselorMailboxView(records),
    journal: counselorJournalView(records)
  }[state.counselorView] || counselorHome(records, sharedRecords);
  return `
    <section class="section ${state.section === "counselor" ? "active" : ""}" id="counselor">
      ${content}
    </section>
  `;
}

function counselorHome(records, sharedRecords) {
  return `
    <h2>상담자 공간</h2>
    <p class="lede">커플이 상담자에게 공유한 기록을 한곳에서 봅니다. 왼쪽 카테고리에서 갈등 유형, 상담 기법, 음성사서함, 회기 일기를 나누어 확인할 수 있습니다.</p>
    <div class="notice privacy">실서비스 전 논의 필요: 커플별 로그인, 역할 기반 접근권한, 전송/저장 암호화, 파일 삭제권, 상담자 접근 기록, 위험 발화 대응 기준.</div>
    <div class="grid">
      <form class="card" id="noteForm">
        <div class="field tall">
          <label for="counselorNote">오늘의 한마디</label>
          <textarea id="counselorNote">${escapeHtml(localStorage.getItem("counselorNote") || "")}</textarea>
        </div>
        <button class="primary-button" type="submit">게시</button>
      </form>
      <div class="card">
        <h3>공유 현황</h3>
        <p><strong>${records.length}</strong>개 기록 저장</p>
        <p><strong>${sharedRecords.length}</strong>개 상담자 공유</p>
        <p><strong>${records.filter((r) => r.kind === "type").length}</strong>개 갈등 자료</p>
        <p><strong>${records.filter((r) => r.kind === "voice").length}</strong>개 음성사서함</p>
        <button class="secondary-button" id="exportJson">공유 문서 내보내기</button>
        <button class="danger-button" id="clearAll" style="margin-top:10px">로컬 기록 삭제</button>
      </div>
    </div>
    <h3>최근 상담자 공유 기록</h3>
    ${recordList(sharedRecords.slice(0, 5), true)}
  `;
}

function counselorTypeView(records) {
  const typeRecords = records.filter((record) => record.kind === "type");
  const latest = typeRecords[0];
  const profile = coupleTypeProfile(typeRecords);
  return `
    <h2>커플 갈등 유형</h2>
    <p class="lede">커플이 남긴 갈등 이야기를 모아 보고, 현재 가장 자주 나타나는 모습을 대표 경향으로 정리합니다.</p>
    <div class="grid">
      <div class="card">
        <span class="mini-label">대표 경향</span>
        <h3>${profile.label}</h3>
        <p>${profile.description}</p>
        ${latest ? `<p class="summary">최근 기록 기준: ${escapeHtml(latest.summary || "")}</p>` : ""}
      </div>
      <div class="card">
        <h3>누적 점수</h3>
        <div class="field">
          <label>안심강아지</label>
          <div class="meter"><span style="width:${Math.min(profile.pursuer * 8, 100)}%"></span></div>
        </div>
        <div class="field">
          <label>쉼표고양이</label>
          <div class="meter"><span style="width:${Math.min(profile.withdrawer * 8, 100)}%;background:var(--rose)"></span></div>
        </div>
      </div>
    </div>
    <h3>커플이 적어둔 갈등 자료</h3>
    ${recordList(typeRecords, true)}
  `;
}

function coupleTypeProfile(typeRecords) {
  const pursuer = typeRecords.reduce((sum, record) => sum + Number(record.pursuer || 0), 0);
  const withdrawer = typeRecords.reduce((sum, record) => sum + Number(record.withdrawer || 0), 0);
  if (!typeRecords.length) {
    return { label: "아직 자료 없음", description: "커플이 갈등 이야기를 남기면 대표 경향이 이곳에 정리됩니다.", pursuer: 0, withdrawer: 0 };
  }
  if (pursuer >= withdrawer + 2) {
    return { label: "안심강아지 쪽이 더 자주 보임", description: "연결을 확인하고 가까이 다가가려는 신호가 더 많이 기록되었습니다.", pursuer, withdrawer };
  }
  if (withdrawer >= pursuer + 2) {
    return { label: "쉼표고양이 쪽이 더 자주 보임", description: "압도감을 낮추기 위해 멈추거나 거리를 찾는 신호가 더 많이 기록되었습니다.", pursuer, withdrawer };
  }
  return { label: "둘 다 조금씩 보임", description: "상황에 따라 가까이 다가가기도 하고 잠깐 물러나기도 하는 모습이 함께 보입니다.", pursuer, withdrawer };
}

function counselorComfortView() {
  const pursuerTip = comfortTechniques.pursuer[dailyTechniqueIndex(comfortTechniques.pursuer.length)];
  const withdrawerTip = comfortTechniques.withdrawer[dailyTechniqueIndex(comfortTechniques.withdrawer.length)];
  return `
    <h2>상담자 상담 섹션</h2>
    <p class="lede">오늘 커플의 움직임을 볼 때 참고할 수 있는 상담자용 EFT 개입 추천과 주요 기법 설명입니다. 내담자 화면에는 보이지 않는 상담자 전용 자료입니다.</p>
    <h3>오늘의 상담자 개입 추천</h3>
    <div class="grid counselor-techniques">
      <article class="card technique-card">
        <span class="type-badge">안심강아지: ${pursuerTip.title}</span>
        <p>${pursuerTip.counselor}</p>
      </article>
      <article class="card technique-card">
        <span class="type-badge">쉼표고양이: ${withdrawerTip.title}</span>
        <p>${withdrawerTip.counselor}</p>
      </article>
    </div>
    <h3>EFT 개입기법 상세</h3>
    <div class="counselor-detail-list">
      ${counselorTechniqueDetails.map((item) => `
        <article class="card counselor-detail-card">
          <header>
            <span class="type-badge">${item.title}</span>
            <p>${item.purpose}</p>
          </header>
          <div class="grid">
            <div class="technique-note">
              <strong>언제 쓰나요?</strong>
              <p>${item.when}</p>
            </div>
            <div class="technique-note">
              <strong>주의할 점</strong>
              <p>${item.caution}</p>
            </div>
          </div>
          <div class="grid">
            <div class="record-detail">
              <strong>진행 순서</strong>
              <ol>${item.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
            </div>
            <div class="record-detail">
              <strong>상담자 문장 예시</strong>
              <ul>${item.phrases.map((phrase) => `<li>${phrase}</li>`).join("")}</ul>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function counselorMailboxView(records) {
  const voices = records.filter((record) => record.kind === "voice" && record.shareCounselor);
  const grouped = groupBy(voices, (record) => record.author || "작성자 미지정");
  return `
    <h2>상담자 음성사서함</h2>
    <p class="lede">상담자에게 공유된 음성사서함을 작성자별로 나누어 확인합니다.</p>
    ${Object.keys(grouped).length ? Object.entries(grouped).map(([author, items]) => `
      <h3>${escapeHtml(author)}의 음성사서함</h3>
      ${recordList(items, true)}
    `).join("") : `<div class="empty">상담자에게 공유된 음성사서함이 없습니다.</div>`}
  `;
}

function counselorJournalView(records) {
  const journals = records.filter((record) => record.kind === "journal" && record.shareCounselor);
  return `
    <h2>상담자 회기 일기</h2>
    <p class="lede">상담자에게 공유된 회기 일기를 모아 봅니다. 감정 변화, 인상 깊은 장면, 키워드를 함께 확인할 수 있습니다.</p>
    ${recordList(journals, true)}
  `;
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function sourcesSection() {
  return `
    <section class="section ${state.section === "sources" ? "active" : ""}" id="sources">
      <h2>분류 기준과 근거</h2>
      <p class="lede">앱의 안심강아지/쉼표고양이 언어는 EFT의 부정적 상호작용 순환과 부부 갈등 연구의 demand-withdraw 패턴을 바탕으로 더 부드럽게 바꾼 표현입니다.</p>
      <div class="grid sources">
        <div class="card">
          <h3>앱에 반영한 기준</h3>
          <p>안심강아지는 연결 회복을 위해 항의, 확인, 질문이 빨라지는 패턴을 부드럽게 표현한 이름입니다. 쉼표고양이는 정서적 압도감을 줄이기 위해 침묵, 방어, 거리두기, 회피가 늘어나는 패턴을 부드럽게 표현한 이름입니다.</p>
          <p>두 모습이 모두 나타날 수 있도록 점수 차이가 작거나 두 점수가 모두 높으면 혼합 경향으로 보여줍니다.</p>
        </div>
        <div class="card">
          <h3>참고 문헌</h3>
          <p><a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1752-0606.1985.tb00624.x" target="_blank" rel="noreferrer">Johnson & Greenberg (1985)</a>: Emotionally Focused Couples Therapy outcome study.</p>
          <p><a href="https://link.springer.com/article/10.1007/s10591-021-09610-9" target="_blank" rel="noreferrer">Johnson, 2004/2019 인용 EFT 개요</a>: 부정적 순환을 안정화하고, 정서와 애착 욕구를 다루는 EFT 단계 설명.</p>
          <p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3218801/" target="_blank" rel="noreferrer">Demand-Withdraw Patterns in Marital Conflict in the Home</a>: 부부 갈등에서 요구-철회 패턴을 관찰한 연구 흐름.</p>
          <p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3014221/" target="_blank" rel="noreferrer">Exploring the Basis for Gender Differences in the Demand-Withdraw Pattern</a>: 요구와 철회 행동을 코딩해 분석한 연구.</p>
        </div>
      </div>
    </section>
  `;
}

function recordList(records, counselor = false) {
  if (!records.length) return `<div class="empty">아직 저장된 기록이 없습니다.</div>`;
  return `<div class="list">${records.map((record) => {
    const normalizedRecord = normalizeJournalRecord(record);
    return `
    <article class="entry">
      <header>
        <strong>${normalizedRecord.kind === "voice" ? "음성사서함" : normalizedRecord.kind === "journal" ? "회기 일기" : "갈등 유형"}</strong>
        <time>${new Date(normalizedRecord.createdAt).toLocaleString("ko-KR")}</time>
      </header>
      ${normalizedRecord.audioUrl ? `<audio controls src="${normalizedRecord.audioUrl}" style="width:100%"></audio>` : ""}
      ${normalizedRecord.kind === "voice" && normalizedRecord.author ? `<p><span class="chip">${escapeHtml(normalizedRecord.author)}의 음성</span></p>` : ""}
      ${normalizedRecord.beforeMood ? `<p>상담 전 ${normalizedRecord.beforeMood} -> 상담 후 ${normalizedRecord.afterMood}</p>` : ""}
      ${normalizedRecord.type ? `<p><span class="type-badge">${normalizedRecord.type}</span></p>` : ""}
      ${normalizedRecord.kind === "journal" ? journalRecordBody(normalizedRecord) : normalizedRecord.text ? `<p>${escapeHtml(normalizedRecord.text)}</p>` : ""}
      <p class="summary">${escapeHtml(recordSummary(normalizedRecord))}</p>
      ${normalizedRecord.keywords?.length ? `<div class="chips">${normalizedRecord.keywords.map((keyword) => `<span class="chip">${escapeHtml(keyword)}</span>`).join("")}</div>` : ""}
      <div class="chips">
        ${normalizedRecord.sharePartner ? `<span class="chip">파트너 공유</span>` : ""}
        ${normalizedRecord.shareCounselor ? `<span class="chip">상담자 공유</span>` : ""}
        ${normalizedRecord.shareType ? `<span class="chip">유형 공유</span>` : ""}
        ${counselor && normalizedRecord.pursuer !== undefined ? `<span class="chip">강아지 ${normalizedRecord.pursuer} / 고양이 ${normalizedRecord.withdrawer}</span>` : ""}
      </div>
      <button class="delete-entry" type="button" data-delete-record="${normalizedRecord.id}">기록 삭제</button>
    </article>
  `;
  }).join("")}</div>`;
}

function journalRecordBody(record) {
  const normalizedRecord = normalizeJournalRecord(record);
  return `
    <div class="record-detail"><strong>이런 기분이 든 이유</strong><p>${escapeHtml(normalizedRecord.moodReason || "아직 기록되지 않았습니다.")}</p></div>
    <div class="record-detail"><strong>상담 중 가장 인상 깊었던 부분</strong><p>${escapeHtml(normalizedRecord.impressive || "아직 기록되지 않았습니다.")}</p></div>
  `;
}

function normalizeJournalRecord(record) {
  if (record.kind !== "journal") return record;
  const legacy = splitLegacyJournalText(record.text);
  const moodReason = String(record.moodReason || legacy.moodReason || "").trim();
  const impressive = String(record.impressive || legacy.impressive || "").trim();
  const summary = summarizeJournalEntry({
    beforeMood: record.beforeMood,
    afterMood: record.afterMood,
    moodReason,
    impressive
  });
  return {
    ...record,
    moodReason,
    impressive,
    text: `${moodReason}\n\n${impressive}`.trim(),
    summary: summary.summary,
    keywords: record.keywords?.length ? record.keywords : summary.keywords
  };
}

function splitLegacyJournalText(text) {
  const clean = String(text || "").trim();
  if (!clean) return { moodReason: "", impressive: "" };
  const parts = clean.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { moodReason: parts[0], impressive: parts.slice(1).join("\n\n") };
  }
  return { moodReason: clean, impressive: "" };
}

function recordSummary(record) {
  if (record.kind === "journal") {
    return normalizeJournalRecord(record).summary;
  }
  return record.summary || "";
}

function bindCommon() {
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      state.section = button.dataset.section;
      render();
      document.querySelector(".app-shell").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  const gate = document.getElementById("counselorGate");
  if (gate) {
    gate.addEventListener("click", unlockCounselor);
  }
  const lockedGate = document.getElementById("lockedCounselorGate");
  if (lockedGate) {
    lockedGate.addEventListener("click", unlockCounselor);
  }
  document.querySelectorAll("[data-delete-record]").forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("이 기록을 삭제할까요?")) {
        deleteRecord(button.dataset.deleteRecord);
      }
    });
  });
}

function unlockCounselor() {
  if (!state.counselorUnlocked) {
    const code = prompt("상담자 접근 코드를 입력해주세요.");
    if (code !== "eft2026") {
      alert("상담자 접근 코드가 맞지 않습니다.");
      return;
    }
    state.counselorUnlocked = true;
    sessionStorage.setItem("counselorUnlocked", "true");
  }
  state.section = "counselor";
  state.counselorView = "home";
  render();
  document.querySelector(".app-shell").scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindMailbox() {
  const start = document.getElementById("startRecord");
  const stop = document.getElementById("stopRecord");
  const save = document.getElementById("saveVoice");
  if (!start) return;
  start.addEventListener("click", startRecording);
  stop.addEventListener("click", stopRecording);
  save.addEventListener("click", () => {
    const text = document.getElementById("voiceMemo").value.trim();
    const result = scoreType(text);
    const audioUrl = state.audioUrl;
    state.audioUrl = "";
    state.seconds = 0;
    addRecord({
      kind: "voice",
      audioUrl,
      text,
      author: document.getElementById("voiceOwner").value,
      summary: summarize(text, "음성"),
      sharePartner: document.getElementById("sharePartnerVoice").checked,
      shareCounselor: document.getElementById("shareCounselorVoice").checked,
      shareType: document.getElementById("shareTypeVoice").checked,
      type: document.getElementById("shareTypeVoice").checked ? result.type : "",
      pursuer: result.pursuer,
      withdrawer: result.withdrawer
    });
  });
}

async function startRecording() {
  try {
    await playPromptAndBeep();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.chunks = [];
    state.mediaRecorder = new MediaRecorder(stream);
    state.mediaRecorder.ondataavailable = (event) => state.chunks.push(event.data);
    state.mediaRecorder.onstop = () => {
      const blob = new Blob(state.chunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => {
        state.audioUrl = reader.result;
        stream.getTracks().forEach((track) => track.stop());
        state.mediaRecorder = null;
        clearInterval(state.timerId);
        state.timerId = null;
        render();
      };
      reader.readAsDataURL(blob);
    };
    state.startedAt = Date.now();
    state.seconds = 0;
    state.timerId = setInterval(() => {
      state.seconds = Math.floor((Date.now() - state.startedAt) / 1000);
      const timer = document.getElementById("timer");
      if (timer) timer.textContent = formatTime(state.seconds);
    }, 400);
    state.mediaRecorder.start();
    render();
  } catch (error) {
    alert("마이크 권한이 필요합니다. 브라우저 설정에서 마이크 접근을 허용해주세요.");
  }
}

function stopRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }
}

function playPromptAndBeep() {
  return new Promise((resolve) => {
    const text = "삐 소리 이후 녹음됩니다. 녹음하시겠습니까?";
    const finish = () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.value = 0.08;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
        resolve();
      }, 360);
    };
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ko-KR";
      utter.rate = 0.92;
      utter.onend = finish;
      speechSynthesis.speak(utter);
    } else {
      setTimeout(finish, 900);
    }
  });
}

function bindJournal() {
  const form = document.getElementById("journalForm");
  const preview = document.getElementById("journalPreview");
  const keywordBox = document.getElementById("journalKeywords");
  if (!form) return;
  bindMoodOther("beforeMood", "beforeMoodOther");
  bindMoodOther("afterMood", "afterMoodOther");
  const updatePreview = () => {
    const result = currentJournalSummary();
    preview.textContent = result.summary;
    keywordBox.innerHTML = result.keywords.map((keyword) => `<span class="chip">${escapeHtml(keyword)}</span>`).join("");
  };
  ["moodReason", "impressive", "beforeMood", "afterMood", "beforeMoodOther", "afterMoodOther"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updatePreview);
    document.getElementById(id).addEventListener("change", updatePreview);
  });
  updatePreview();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const moodReason = document.getElementById("moodReason").value.trim();
    const impressive = document.getElementById("impressive").value.trim();
    const text = `${moodReason}\n\n${impressive}`.trim();
    const result = scoreType(text);
    const journalSummary = currentJournalSummary();
    addRecord({
      kind: "journal",
      beforeMood: getMoodValue("beforeMood", "beforeMoodOther"),
      afterMood: getMoodValue("afterMood", "afterMoodOther"),
      moodReason,
      impressive,
      text,
      summary: journalSummary.summary,
      keywords: journalSummary.keywords,
      sharePartner: document.getElementById("sharePartnerJournal").checked,
      shareCounselor: document.getElementById("shareCounselorJournal").checked,
      shareType: document.getElementById("shareTypeJournal").checked,
      type: document.getElementById("shareTypeJournal").checked ? result.type : "",
      pursuer: result.pursuer,
      withdrawer: result.withdrawer
    });
  });
}

function currentJournalSummary() {
  return summarizeJournalEntry({
    beforeMood: getMoodValue("beforeMood", "beforeMoodOther"),
    afterMood: getMoodValue("afterMood", "afterMoodOther"),
    moodReason: document.getElementById("moodReason").value,
    impressive: document.getElementById("impressive").value
  });
}

function bindMoodOther(selectId, inputId) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  if (!select || !input) return;
  const sync = () => {
    const isOther = select.value.includes("기타");
    input.hidden = !isOther;
    if (isOther) input.focus();
  };
  select.addEventListener("change", sync);
  sync();
}

function getMoodValue(selectId, inputId) {
  const selected = document.getElementById(selectId).value;
  const other = document.getElementById(inputId).value.trim();
  if (selected.includes("기타")) return other ? `✍️ ${other}` : selected;
  return selected;
}

function bindType() {
  const button = document.getElementById("analyzeType");
  if (!button) return;
  button.addEventListener("click", () => {
    const text = document.getElementById("conflictStory").value.trim();
    const answers = [...document.querySelectorAll(".typeAnswer")].map((select) => select.value);
    const result = scoreType(text, answers);
    const summary = summarize(text, "갈등 이야기");
    state.typeResult = { result, summary, text };
    addRecord({
      kind: "type",
      text,
      summary,
      sharePartner: document.getElementById("shareTypeResult").checked,
      shareCounselor: document.getElementById("shareTypeCounselor").checked,
      shareType: true,
      type: result.type,
      pursuer: result.pursuer,
      withdrawer: result.withdrawer
    });
  });
}

function bindComfort() {
  document.querySelectorAll("[data-comfort-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.comfortRole = button.dataset.comfortRole;
      render();
      document.getElementById("comfort")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function bindCounselor() {
  document.querySelectorAll("[data-counselor-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.counselorView = button.dataset.counselorView;
      render();
      document.getElementById("counselor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  const form = document.getElementById("noteForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      localStorage.setItem("counselorNote", document.getElementById("counselorNote").value);
      render();
    });
  }
  const exportJson = document.getElementById("exportJson");
  if (exportJson) {
    exportJson.addEventListener("click", () => {
      const data = JSON.stringify({ counselorNote: localStorage.getItem("counselorNote") || "", records: getRecords() }, null, 2);
      const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "awung-beauty-records.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  const clearAll = document.getElementById("clearAll");
  if (clearAll) {
    clearAll.addEventListener("click", () => {
      if (confirm("이 브라우저의 로컬 기록을 모두 삭제할까요?")) {
        if (saveRecords([])) render();
      }
    });
  }
}

function formatTime(total) {
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();

