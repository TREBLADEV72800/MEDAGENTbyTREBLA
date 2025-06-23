// Mock data per simulare le conversazioni AI di MedAgent

export const mockResponses = {
  // Risposte iniziali basate sui sintomi comuni
  febbre: {
    message: "Capisco che stai avendo febbre. Quando hai misurato la temperatura l'ultima volta e quale valore hai rilevato?",
    urgencyLevel: "medium",
    nextQuestions: [
      "Hai misurato la temperatura di recente?",
      "Hai altri sintomi come brividi o sudorazione?",
      "Hai preso farmaci per abbassare la febbre?"
    ]
  },
  "mal di testa": {
    message: "Mi dispiace che tu abbia mal di testa. Puoi descrivermi il tipo di dolore? È pulsante, sordo, acuto o come una pressione?",
    urgencyLevel: "low",
    nextQuestions: [
      "Il dolore è localizzato in una zona specifica?",
      "Hai sensibilità alla luce o ai rumori?",
      "Hai avuto nausea insieme al mal di testa?"
    ]
  },
  "dolore toracico": {
    message: "Il dolore toracico può avere diverse cause. Per sicurezza, se il dolore è intenso o improvviso, ti consiglio di contattare immediatamente il 118. Puoi descrivermi meglio questo dolore?",
    urgencyLevel: "high",
    nextQuestions: [
      "Il dolore si irradia verso braccio, collo o mandibola?",
      "Hai difficoltà a respirare?",
      "Il dolore peggiora con il movimento o la respirazione?"
    ]
  },
  default: {
    message: "Ti ringrazio per aver condiviso i tuoi sintomi. Per poterti aiutare meglio, ho bisogno di qualche informazione aggiuntiva.",
    urgencyLevel: "low",
    nextQuestions: [
      "Quando sono iniziati i sintomi?",
      "Hai notato qualche fattore scatenante?",
      "Come descrivi l'intensità del disturbo?"
    ]
  }
};

export const mockConversationFlow = [
  {
    id: 1,
    type: "user",
    message: "Ho febbre da due giorni",
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: "assistant",
    message: "Capisco che stai avendo febbre da due giorni. Quando hai misurato la temperatura l'ultima volta e quale valore hai rilevato?",
    urgencyLevel: "medium",
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    type: "user",
    message: "Stamattina avevo 38.5°C",
    timestamp: new Date().toISOString()
  },
  {
    id: 4,
    type: "assistant",
    message: "Una temperatura di 38.5°C indica effettivamente uno stato febbrile. Hai altri sintomi associati come brividi, sudorazione, dolori muscolari o mal di testa?",
    urgencyLevel: "medium",
    timestamp: new Date().toISOString()
  }
];

export const mockResultData = {
  userSummary: {
    title: "Riassunto della tua valutazione",
    symptoms: ["Febbre (38.5°C)", "Dolori muscolari", "Mal di testa lieve"],
    duration: "2 giorni",
    intensity: "Moderata",
    recommendations: [
      "Mantieni un'adeguata idratazione bevendo molti liquidi",
      "Riposa e evita sforzi fisici intensi",
      "Monitora la temperatura corporea regolarmente",
      "Se la febbre persiste oltre 3-4 giorni o supera i 39°C, contatta il medico"
    ],
    urgencyLevel: "medium",
    urgencyMessage: "Situazione da monitorare - Non urgente ma merita attenzione"
  },
  technicalSummary: {
    title: "Valutazione tecnica per operatori sanitari",
    icd10Codes: ["R50.9 - Febbre non specificata", "M79.3 - Mialgia"],
    clinicalNotes: [
      "Sindrome febbrile di 48 ore con temperatura massima rilevata di 38.5°C",
      "Sintomi associati: mialgia generalizzata, cefalea di lieve entità",
      "Paziente adulto, età 25-35 anni, senza condizioni preesistenti note",
      "Anamnesi negativa per viaggi recenti o contatti con soggetti sintomatici"
    ],
    riskFactors: ["Nessun fattore di rischio significativo identificato"],
    recommendations: [
      "Terapia sintomatica con paracetamolo 500-1000mg ogni 6-8 ore se necessario",
      "Osservazione domiciliare con monitoraggio termico",
      "Rivalutazione clinica se persistenza oltre 72-96 ore",
      "Accesso immediato se comparsa di: dispnea, dolore toracico, alterazioni neurologiche"
    ],
    followUp: "Rivalutazione telefonica in 48-72 ore se sintomi persistenti"
  }
};

export const generateMockResponse = (userMessage, conversationHistory) => {
  const message = userMessage.toLowerCase();
  
  // Semplice logica per simulare risposte AI
  if (message.includes('febbre')) {
    return mockResponses.febbre;
  } else if (message.includes('mal di testa') || message.includes('cefalea')) {
    return mockResponses["mal di testa"];
  } else if (message.includes('dolore') && message.includes('petto')) {
    return mockResponses["dolore toracico"];
  } else if (message.includes('meglio') || message.includes('bene')) {
    return {
      message: "Sono felice di sentire che ti senti meglio! È importante continuare a monitorare i tuoi sintomi. C'è altro che vorresti discutere?",
      urgencyLevel: "low",
      nextQuestions: [
        "I sintomi sono completamente scomparsi?",
        "Hai preso qualche farmaco che ti ha aiutato?",
        "Vuoi salvare questa valutazione?"
      ]
    };
  } else {
    return {
      message: "Ti ringrazio per questa informazione. Aiutami a comprendere meglio la situazione. Puoi descrivermi più dettagliatamente come ti senti?",
      urgencyLevel: "low",
      nextQuestions: [
        "Puoi descrivere i sintomi più nel dettaglio?",
        "Hai notato miglioramenti o peggioramenti?",
        "C'è qualcos'altro che ti preoccupa?"
      ]
    };
  }
};

export const mockSessionData = {
  sessionId: "session-" + Date.now(),
  startTime: new Date().toISOString(),
  userProfile: {
    age: "25-35",
    gender: "preferisco-non-dire", 
    mainSymptom: "febbre",
    duration: "2-giorni",
    intensity: 6
  }
};