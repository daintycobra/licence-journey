export interface JourneyStep {
  id: string;
  number: string;
  titleEn: string;
  titlePt: string;
  duration: string;
  summary: string;
  keyRequirement: string;
  checklist: {
    id: string;
    label: string;
    ptTerm: string;
  }[];
  tip: string;
}

export type SignCategory = "all" | "perigo" | "proibicao" | "obrigacao" | "cedencia";

export type SignGlyphId =
  | "stop"
  | "yield"
  | "priority_road"
  | "roundabout"
  | "speed_50"
  | "no_entry"
  | "no_overtaking"
  | "pedestrian_danger"
  | "slippery_road"
  | "keep_right"
  | "no_parking"
  | "children_danger";

export interface RoadSign {
  id: string;
  code: string;
  glyph: SignGlyphId;
  category: Exclude<SignCategory, "all">;
  categoryEn: string;
  nameEn: string;
  namePt: string;
  ruleEn: string;
  examNote: string;
}

export interface ExamQuestion {
  id: number;
  topicEn: string;
  topicPt: string;
  questionEn: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanationEn: string;
  ruleRef: string;
  signGlyph?: SignGlyphId;
}

export interface FreeResourceLink {
  id: string;
  category: "official" | "practice" | "health";
  categoryLabel: string;
  titleEn: string;
  titlePt: string;
  url: string;
  domainLabel: string;
  descriptionEn: string;
  costLabel: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  outcome: string;
  quote: string;
}

export const GENERATED_IMAGES = {
  heroLisbon: "/src/assets/images/hero_lisbon_highway_drive_1795126025045.jpg",
  theoryStudy: "/src/assets/images/card_theory_study_1795126024320.jpg",
  roundabout: "/src/assets/images/card_lisbon_roundabout_1795126024763.jpg",
  practicalDriving: "/src/assets/images/card_practical_driving_1795126026438.jpg",
} as const;

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "step-1",
    number: "01",
    titleEn: "Documents & Electronic Medical Certificate",
    titlePt: "Documentos e Atestado Médico",
    duration: "1–2 weeks",
    summary:
      "Before enrolling in a Portuguese driving school or applying for a foreign license exchange (Troca), gather your residency ID, tax number (NIF), proof of address, and an electronic medical certificate issued by a doctor in Portugal.",
    keyRequirement: "Minimum age 18 for Category B and at least 185 days of residency in Portugal.",
    checklist: [
      {
        id: "s1-c1",
        label: "Valid residency permit, citizen card, or passport",
        ptTerm: "Título de Residência / Passaporte",
      },
      {
        id: "s1-c2",
        label: "Portuguese Tax Number (NIF) and proof of address",
        ptTerm: "NIF e Comprovativo de Morada",
      },
      {
        id: "s1-c3",
        label: "Electronic Medical Certificate submitted directly to IMT",
        ptTerm: "Atestado Médico Eletrónico (SNS)",
      },
      {
        id: "s1-c4",
        label: "Psychological assessment certificate (if required for Group 2)",
        ptTerm: "Certificado de Avaliação Psicológica",
      },
    ],
    tip: "Doctors at a public health center (Centro de Saúde) or private clinic transmit your Atestado Médico electronically straight into the IMT database.",
  },
  {
    id: "step-2",
    number: "02",
    titleEn: "Driving School Enrollment & Learner Permit",
    titlePt: "Inscrição na Escola de Condução",
    duration: "1 week",
    summary:
      "Register with an IMT-licensed driving school (Escola de Condução). The school files your application with IMT to issue your learner permit (Licença de Aprendizagem), valid for two years.",
    keyRequirement: "Enrollment for Category B (passenger cars) and request for English theory exam if needed.",
    checklist: [
      {
        id: "s2-c1",
        label: "Compare IMT-licensed schools, lesson schedules, and full fee packages",
        ptTerm: "Escola de Condução Licenciada",
      },
      {
        id: "s2-c2",
        label: "Receive your learner permit (valid for 2 years)",
        ptTerm: "Licença de Aprendizagem",
      },
      {
        id: "s2-c3",
        label: "Confirm English exam or translator option early if taking the test in English",
        ptTerm: "Pedido de Exame em Inglês / Tradução",
      },
    ],
    tip: "Ask upfront whether IMT exam fees (Taxas de Exame) and re-test fees are included in the school's quoted package.",
  },
  {
    id: "step-3",
    number: "03",
    titleEn: "Theory Classes & Highway Code Study",
    titlePt: "Aulas de Código da Estrada",
    duration: "4–6 weeks",
    summary:
      "Complete the mandatory 28 hours of theory classes covering Portuguese traffic signs, roundabout lane discipline, speed limits, right-of-way intersections, and road safety regulations.",
    keyRequirement: "Minimum 28 mandatory theory class hours plus consistent mock test scores.",
    checklist: [
      {
        id: "s3-c1",
        label: "Complete all 28 mandatory theory classes",
        ptTerm: "28 Horas de Aulas Teóricas",
      },
      {
        id: "s3-c2",
        label: "Master vertical traffic signs, road markings, and priority rules",
        ptTerm: "Sinalização Vertical e Marcas Rodoviárias",
      },
      {
        id: "s3-c3",
        label: "Score 28/30 or higher on at least 10 consecutive practice exams",
        ptTerm: "Testes de Código (Índice de Bom Condutor)",
      },
    ],
    tip: "Learn key Portuguese exam phrases like 'ceder a passagem' (give way) and 'ultrapassagem' (overtaking) so road signs and real-world instructions feel effortless.",
  },
  {
    id: "step-4",
    number: "04",
    titleEn: "Theory Exam (Exame Teórico)",
    titlePt: "Exame Teórico no IMT / ANIECA",
    duration: "35 minutes",
    summary:
      "Take the official computer-based 30-question multiple-choice exam at an IMT or ANIECA test center. You must answer at least 27 questions correctly (maximum 3 mistakes allowed) within 35 minutes.",
    keyRequirement: "27+ correct out of 30 questions (90% passing score) in 35 minutes.",
    checklist: [
      {
        id: "s4-c1",
        label: "Arrive 15 minutes early with original ID and learner permit",
        ptTerm: "Identificação Original no Centro de Exames",
      },
      {
        id: "s4-c2",
        label: "Inspect every photo carefully: mirrors, lane lines, and corner signs",
        ptTerm: "Leitura Atenta da Imagem e Pergunta",
      },
      {
        id: "s4-c3",
        label: "Receive instant results and unlock your practical driving exam phase",
        ptTerm: "Aprovação no Exame de Código",
      },
    ],
    tip: "Always check the rearview mirror (Espelho Retrovisor) and road line type (Linha Contínua vs. Descontínua) in exam photos before picking an answer.",
  },
  {
    id: "step-5",
    number: "05",
    titleEn: "Practical Lessons & Road Test",
    titlePt: "Aulas Práticas e Exame de Condução",
    duration: "6–10 weeks",
    summary:
      "Complete at least 32 hours of practical driving lessons (and 500 km of practice) covering urban routes, multi-lane roundabouts, parking maneuvers, and motorways before taking the 40-minute practical road test.",
    keyRequirement: "32 practical hours, safe parking & hill starts, and 40-minute on-road test.",
    checklist: [
      {
        id: "s5-c1",
        label: "Complete 32 mandatory practical driving lessons",
        ptTerm: "32 Horas de Aulas Práticas",
      },
      {
        id: "s5-c2",
        label: "Master parallel parking, three-point turns, and hill clutch control",
        ptTerm: "Estacionamento, Inversão e Ponto de Embraiagem",
      },
      {
        id: "s5-c3",
        label: "Pass the 40-minute practical test and collect your temporary driving guide",
        ptTerm: "Exame Prático e Guia Temporária",
      },
      {
        id: "s5-c4",
        label: "Receive your official Carta de Condução card by mail (CTT)",
        ptTerm: "Receção da Carta de Condução (CTT)",
      },
    ],
    tip: "New drivers remain on a 3-year probationary period (Regime Probatório) with stricter alcohol limits (0.20 g/l) and stricter point penalties.",
  },
];

export const ROAD_SIGNS: RoadSign[] = [
  {
    id: "sign-stop",
    code: "B2",
    glyph: "stop",
    category: "cedencia",
    categoryEn: "Priority",
    nameEn: "Mandatory Full Stop (STOP)",
    namePt: "Paragem obrigatória na interseção",
    ruleEn:
      "Bring your vehicle to a complete stop (0 km/h) at the stop line or intersection even if the road looks empty, check both directions, and yield to all traffic before moving.",
    examNote: "Rolling through a STOP sign without stopping the wheels completely is an immediate fail on the practical exam.",
  },
  {
    id: "sign-yield",
    code: "B1",
    glyph: "yield",
    category: "cedencia",
    categoryEn: "Priority",
    nameEn: "Give Way / Yield",
    namePt: "Cedência de passagem",
    ruleEn:
      "Slow down and yield to vehicles already circulating on the priority road or inside the roundabout. Stop completely if necessary.",
    examNote: "Placed at the entry of nearly every roundabout (Rotunda) across Portugal.",
  },
  {
    id: "sign-priority",
    code: "B3",
    glyph: "priority_road",
    category: "cedencia",
    categoryEn: "Priority",
    nameEn: "Priority Road",
    namePt: "Via com prioridade",
    ruleEn:
      "You are driving on a priority road. Vehicles entering from side streets at upcoming intersections must yield to you.",
    examNote: "This priority remains active until you see the end-of-priority diamond with diagonal black bars.",
  },
  {
    id: "sign-roundabout",
    code: "D4",
    glyph: "roundabout",
    category: "obrigacao",
    categoryEn: "Mandatory",
    nameEn: "Roundabout (Mandatory Direction)",
    namePt: "Rotunda (Sentido obrigatório)",
    ruleEn:
      "Circulate counter-clockwise around the central island and yield to traffic already inside the roundabout.",
    examNote: "Use the outer right lane only for the first exit; take an inner lane for the second, third, or later exits.",
  },
  {
    id: "sign-speed-50",
    code: "C13",
    glyph: "speed_50",
    category: "proibicao",
    categoryEn: "Prohibition",
    nameEn: "Maximum Speed Limit 50 km/h",
    namePt: "Proibição de exceder a velocidade máxima",
    ruleEn:
      "Do not exceed 50 km/h from this sign until the next speed limit sign, end-of-restriction sign, or next major intersection.",
    examNote: "50 km/h is also the standard default limit inside all built-up urban areas (Localidades) in Portugal.",
  },
  {
    id: "sign-no-entry",
    code: "C1",
    glyph: "no_entry",
    category: "proibicao",
    categoryEn: "Prohibition",
    nameEn: "No Entry (One-Way Opposite)",
    namePt: "Sentido proibido",
    ruleEn:
      "All vehicles are prohibited from entering from this direction. Traffic flows exclusively from the opposite direction.",
    examNote: "Very common in historic narrow streets of Lisbon, Porto, and Braga.",
  },
  {
    id: "sign-no-overtake",
    code: "C14a",
    glyph: "no_overtaking",
    category: "proibicao",
    categoryEn: "Prohibition",
    nameEn: "No Overtaking",
    namePt: "Proibição de ultrapassar",
    ruleEn:
      "Overtaking four-wheeled motor vehicles is prohibited. However, you may safely overtake two-wheeled motorcycles without a sidecar or bicycles.",
    examNote: "A classic IMT exam trap: remember that overtaking a solo two-wheeled motorcycle is still permitted.",
  },
  {
    id: "sign-no-parking",
    code: "C15",
    glyph: "no_parking",
    category: "proibicao",
    categoryEn: "Prohibition",
    nameEn: "No Parking",
    namePt: "Estacionamento proibido",
    ruleEn:
      "Parking (leaving the vehicle) is forbidden. Brief stopping (Paragem) solely to pick up or drop off passengers or unload goods is still allowed.",
    examNote: "Contrast with C16 (red X), which prohibits both stopping and parking.",
  },
  {
    id: "sign-pedestrian",
    code: "A16a",
    glyph: "pedestrian_danger",
    category: "perigo",
    categoryEn: "Warning",
    nameEn: "Pedestrian Crossing Ahead",
    namePt: "Travessia de peões",
    ruleEn:
      "A zebra crossing (Passadeira) is ahead. Reduce speed early and prepare to stop for any pedestrian waiting or crossing.",
    examNote: "The red triangle warns you in advance; the blue square marks the exact location of the crossing.",
  },
  {
    id: "sign-slippery",
    code: "A5",
    glyph: "slippery_road",
    category: "perigo",
    categoryEn: "Warning",
    nameEn: "Slippery Road Surface",
    namePt: "Pavimento escorregadio",
    ruleEn:
      "Road grip may be reduced due to rain, oil, or traditional cobblestone (Calçada Portuguesa). Avoid sudden braking and increase following distance.",
    examNote: "On wet roads, total braking distance can more than double.",
  },
  {
    id: "sign-children",
    code: "A14",
    glyph: "children_danger",
    category: "perigo",
    categoryEn: "Warning",
    nameEn: "Children / School Zone",
    namePt: "Crianças",
    ruleEn:
      "You are approaching a school, playground, or park frequented by children. Drive slowly and stay ready to brake immediately.",
    examNote: "Always scan between parked cars near schools for sudden movement.",
  },
  {
    id: "sign-keep-right",
    code: "D1c",
    glyph: "keep_right",
    category: "obrigacao",
    categoryEn: "Mandatory",
    nameEn: "Keep Right of Obstacle",
    namePt: "Sentido obrigatório (contornar obstáculo pela direita)",
    ruleEn:
      "You must pass the traffic island, divider, or road obstacle strictly on the right-hand side.",
    examNote: "Blue circular signs always indicate a mandatory action you must follow.",
  },
];

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    topicEn: "Roundabout Rules",
    topicPt: "Circulação em Rotundas",
    signGlyph: "roundabout",
    questionEn:
      "When entering a two-lane roundabout (Rotunda) and intending to leave at the second or third exit (Saída), which lane must you take?",
    options: [
      "Stay in the far-right outer lane all the way around the roundabout.",
      "Take the appropriate inner (left) lane, and move to the right outer lane only after passing the exit immediately before yours.",
      "Use whichever lane has less traffic regardless of your intended exit.",
    ],
    correctIndex: 1,
    explanationEn:
      "Under Article 14.º-A of the Portuguese Código da Estrada, only drivers taking the first exit should enter the right outer lane. For the second, third, or subsequent exits, enter an inner lane and signal right (Pisca) to shift into the outer lane after passing the exit prior to yours.",
    ruleRef: "Código da Estrada · Artigo 14.º-A",
  },
  {
    id: 2,
    topicEn: "Speed Limits",
    topicPt: "Limites de Velocidade",
    signGlyph: "speed_50",
    questionEn:
      "What is the standard maximum speed limit for a Category B passenger car inside built-up urban areas (Dentro das localidades) in Portugal unless signed otherwise?",
    options: ["40 km/h", "50 km/h", "60 km/h"],
    correctIndex: 1,
    explanationEn:
      "Unless a traffic sign establishes a different limit, the default maximum speed limit for light passenger vehicles inside urban areas (Localidades) in Portugal is 50 km/h.",
    ruleRef: "Código da Estrada · Artigo 27.º",
  },
  {
    id: 3,
    topicEn: "Alcohol Limit",
    topicPt: "Taxa de Álcool no Sangue",
    questionEn:
      "For a newly licensed driver in their 3-year probationary period (Regime Probatório), what is the legal blood alcohol threshold at which an offense occurs?",
    options: [
      "0.50 g/l or higher",
      "0.20 g/l or higher",
      "0.80 g/l or higher",
    ],
    correctIndex: 1,
    explanationEn:
      "While experienced passenger-car drivers face penalties starting at 0.50 g/l, probationary drivers (first 3 years) and professional drivers are subject to a stricter limit of 0.20 g/l.",
    ruleRef: "Código da Estrada · Artigo 81.º",
  },
  {
    id: 4,
    topicEn: "Right of Way",
    topicPt: "Cedência de Passagem",
    signGlyph: "stop",
    questionEn:
      "At an unmarked intersection with no traffic lights, police officer, or road signs, two passenger cars arrive simultaneously. Who has priority?",
    options: [
      "The vehicle approaching from the left.",
      "The vehicle approaching from the right (Regra da Direita).",
      "The vehicle traveling at the higher speed.",
    ],
    correctIndex: 1,
    explanationEn:
      "In Portugal, the universal priority rule at unmarked intersections is the right-hand rule (Regra da Direita): you must yield to vehicles approaching from your right.",
    ruleRef: "Código da Estrada · Artigo 30.º",
  },
  {
    id: 5,
    topicEn: "Motorway Rules",
    topicPt: "Autoestrada",
    questionEn:
      "What are the standard minimum and maximum speed limits for an experienced Category B passenger car (without trailer) on a Portuguese motorway (Autoestrada)?",
    options: [
      "Minimum 40 km/h and maximum 100 km/h",
      "Minimum 50 km/h and maximum 120 km/h",
      "Minimum 60 km/h and maximum 130 km/h",
    ],
    correctIndex: 1,
    explanationEn:
      "On Portuguese Autoestradas, light passenger cars without trailers have a standard maximum speed of 120 km/h and must not travel slower than 50 km/h under normal traffic conditions.",
    ruleRef: "Código da Estrada · Artigo 27.º",
  },
  {
    id: 6,
    topicEn: "Traffic Signs",
    topicPt: "Proibição de Ultrapassar",
    signGlyph: "no_overtaking",
    questionEn:
      "When you see the 'No Overtaking' sign (C14a), are you legally permitted to safely overtake a two-wheeled motorcycle without a sidecar?",
    options: [
      "Yes, provided you can do so safely without crossing any solid center line.",
      "No, overtaking any vehicle including bicycles and motorcycles is forbidden.",
      "Only during nighttime hours.",
    ],
    correctIndex: 0,
    explanationEn:
      "Sign C14a prohibits overtaking motor vehicles with four or more wheels (or motorcycles with a sidecar). Safely overtaking a standard two-wheeled motorcycle or bicycle remains allowed if road markings permit.",
    ruleRef: "Regulamento de Sinalização · Sinal C14a",
  },
  {
    id: 7,
    topicEn: "Breakdown Safety",
    topicPt: "Segurança e Equipamento",
    questionEn:
      "If your car breaks down on a motorway or rural road outside a town, what must you do before stepping onto the roadway?",
    options: [
      "Turn on hazard lights only and walk to the trunk.",
      "Put on your reflective vest (Colete retrorrefletor) inside the car first, then place the warning triangle at least 30 meters behind the vehicle.",
      "Exit the car first and put on the vest after opening the trunk.",
    ],
    correctIndex: 1,
    explanationEn:
      "Your reflective vest must be kept within reach inside the cabin so you wear it before stepping out. Place the warning triangle at least 30 meters behind the car so it is visible from 100 meters away.",
    ruleRef: "Código da Estrada · Artigo 88.º",
  },
  {
    id: 8,
    topicEn: "IMT Exam Standards",
    topicPt: "Exame Teórico IMT",
    questionEn:
      "How many questions must you answer correctly out of 30 to pass the official Portuguese Category B theory exam?",
    options: [
      "At least 24 correct (up to 6 mistakes)",
      "At least 27 correct (maximum 3 mistakes)",
      "At least 28 correct (maximum 2 mistakes)",
    ],
    correctIndex: 1,
    explanationEn:
      "The official IMT Category B theory test lasts 35 minutes and contains 30 questions. You must score at least 27 out of 30 (90%) — more than 3 wrong answers results in a fail.",
    ruleRef: "IMT Portugal · Regulamento da Habilitação Legal",
  },
  {
    id: 9,
    topicEn: "Pedestrian Safety",
    topicPt: "Travessia de Peões",
    signGlyph: "pedestrian_danger",
    questionEn:
      "As you approach a zebra crossing (Passadeira), a car in the adjacent lane has stopped to let someone cross. What must you do?",
    options: [
      "Sound your horn and slowly overtake the stopped car.",
      "Never overtake at a pedestrian crossing; slow down and stop so pedestrians can cross safely.",
      "Proceed quickly if the pedestrian has not entered your lane yet.",
    ],
    correctIndex: 1,
    explanationEn:
      "Overtaking immediately before or on a pedestrian crossing is a very serious offense (Contraordenação muito grave). The stopped vehicle blocks your sightline, so you must stop as well.",
    ruleRef: "Código da Estrada · Artigo 41.º e 103.º",
  },
  {
    id: 10,
    topicEn: "Stopping & Parking",
    topicPt: "Paragem e Estacionamento",
    signGlyph: "no_parking",
    questionEn:
      "Where sign C15 (No Parking — single red diagonal line) is posted, may you briefly stop (Paragem) for 30 seconds to drop off a passenger?",
    options: [
      "Yes, brief stopping strictly for passenger pick-up/drop-off or quick loading is permitted.",
      "No, stopping even for a few seconds is completely prohibited.",
      "Only on Sundays and public holidays.",
    ],
    correctIndex: 0,
    explanationEn:
      "Sign C15 (single diagonal red stripe) bans parking (Estacionamento), not brief stopping (Paragem). Sign C16 (red X) bans both stopping and parking.",
    ruleRef: "Regulamento de Sinalização · Sinal C15",
  },
];

export const FREE_RESOURCE_LINKS: FreeResourceLink[] = [
  {
    id: "link-imt",
    category: "official",
    categoryLabel: "Official Government Portal",
    titleEn: "IMT Portugal — Driving Licenses & Online Services",
    titlePt: "IMT Online (Instituto da Mobilidade e dos Transportes)",
    url: "https://www.imt-ip.pt/",
    domainLabel: "imt-ip.pt",
    descriptionEn:
      "Official authority for new driving licenses, foreign license exchanges (Troca de Título), exam center regulations, and official IMT fee tables.",
    costLabel: "100% Free Access",
  },
  {
    id: "link-govpt",
    category: "official",
    categoryLabel: "Official Government Portal",
    titleEn: "Gov.pt — Exchange a Foreign Driving License in Portugal",
    titlePt: "gov.pt · Trocar carta de condução estrangeira",
    url: "https://www.gov.pt/servicos/trocar-carta-de-conducao-estrangeira-por-portuguesa",
    domainLabel: "gov.pt",
    descriptionEn:
      "Step-by-step official government checklist for exchanging non-EU and EU driving licenses, document legalization requirements, and online submission.",
    costLabel: "Free Official Guide",
  },
  {
    id: "link-bomcondutor",
    category: "practice",
    categoryLabel: "Free Theory Practice",
    titleEn: "Bom Condutor — Free Portuguese Código Practice Exams",
    titlePt: "Bom Condutor · Testes de Código Gratuitos",
    url: "https://www.bomcondutor.pt/",
    domainLabel: "bomcondutor.pt",
    descriptionEn:
      "Portugal's most widely used free study platform with thousands of official-style IMT theory questions, topic quizzes, and readiness score tracking.",
    costLabel: "Free Practice",
  },
  {
    id: "link-testedecodigo",
    category: "practice",
    categoryLabel: "Free Theory Practice",
    titleEn: "Teste de Código — Free Timed 30-Question Simulator",
    titlePt: "Testes de Código IMT · Categoria B",
    url: "https://www.testesdecodigo.pt/",
    domainLabel: "testesdecodigo.pt",
    descriptionEn:
      "Take full 30-question timed Código da Estrada mock exams right in your browser without needing to create an account.",
    costLabel: "Free · No Sign-Up",
  },
  {
    id: "link-ansr",
    category: "official",
    categoryLabel: "Traffic Law & Points",
    titleEn: "ANSR — Road Safety & Driving License Points Portal",
    titlePt: "Autoridade Nacional de Segurança Rodoviária",
    url: "https://www.ansr.pt/",
    domainLabel: "ansr.pt",
    descriptionEn:
      "Official road safety authority for the latest Código da Estrada updates, traffic fine schedules, and Portugal's 12-point license system (Carta por Pontos).",
    costLabel: "100% Free",
  },
  {
    id: "link-sns24",
    category: "health",
    categoryLabel: "Health & Medical Certificate",
    titleEn: "SNS 24 — Portuguese Health Service & Appointments",
    titlePt: "Serviço Nacional de Saúde (SNS 24)",
    url: "https://www.sns24.gov.pt/",
    domainLabel: "sns24.gov.pt",
    descriptionEn:
      "Locate your local public health center (Centro de Saúde) and review procedures for obtaining your electronic Atestado Médico for IMT.",
    costLabel: "Public Health Portal",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Suman Gurung",
    location: "Lisbon · Arroios",
    outcome: "Passed Exame Teórico on first try (29/30)",
    quote:
      "Understanding Portuguese road rules in plain English alongside the official Portuguese terms made everything click. I passed both the theory and practical tests on my very first attempt.",
  },
  {
    id: "t2",
    name: "Pramila Shrestha",
    location: "Porto · Boavista",
    outcome: "Full Carta de Condução earned in 4 months",
    quote:
      "Having the exact checklist from Atestado Médico to choosing a driving school saved me weeks of confusion and avoided unnecessary paperwork delays.",
  },
  {
    id: "t3",
    name: "Ramesh Adhikari",
    location: "Braga · Centro",
    outcome: "Scored 28/30 after 3 weeks of mock drills",
    quote:
      "Multi-lane roundabouts and right-of-way intersections used to trip me up every time. Practicing with the visual simulator and asking the AI coach cleared up every doubt.",
  },
];
