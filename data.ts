// Data structures and dictionary of professional recommendations.
// Refined and optimized to include exactly 3 key high-value jobs in FR, AR and EN.

export interface SuggestionSet {
  title: string;
  tasks: string[];
  skills: {
    hard: string[];
    soft: string[];
  };
  interests: string[];
}

export interface JobDefinition {
  id: string;
  titles: { fr: string; ar: string; en: string };
  keywords: string[];
  tasks: {
    fr: string[];
    ar: string[];
    en: string[];
  };
  skills: {
    fr: { hard: string[]; soft: string[] };
    ar: { hard: string[]; soft: string[] };
    en: { hard: string[]; soft: string[] };
  };
  interests: {
    fr: string[];
    ar: string[];
    en: string[];
  };
}

export interface SectorDefinition {
  id: string;
  label: string;
  emoji: string;
  jobs: {
    id: string;
    title: string; // fallback string title
    keywords: string[];
    tasks: string[];
    skills: {
      hard: string[];
      soft: string[];
    };
    interests: string[];
  }[];
}

export interface ExtJobDefinition {
  id: string;
  titles: { fr: string; ar: string; en: string };
  tasks: {
    fr: string[];
    ar: string[];
    en: string[];
  };
}

export const jobsDatabase: ExtJobDefinition[] = [
  {
    id: "magasinier",
    titles: {
      fr: "Magasinier / Agent de dépôt",
      ar: "أمين مستودع / وكيل شحن",
      en: "Warehouse Agent / Depot Steward"
    },
    tasks: {
      fr: [
        "Réception et vérification des marchandises",
        "Préparation et colisage des commandes",
        "Gestion des stocks et inventaires",
        "Chargement et déchargement des camions"
      ],
      ar: [
        "استلام البضائع والتحقق من سلامتها",
        "تجهيز وتغليف الطلبيات للشحن",
        "متابعة المخزون وإجراء الجرد الدوري",
        "شحن وتفريغ الشاحنات بدقة"
      ],
      en: [
        "Receiving and inspecting incoming goods",
        "Picking, packing, and sorting orders",
        "Inventory control and stock management",
        "Loading and unloading delivery trucks"
      ]
    }
  },
  {
    id: "developpeur_web",
    titles: {
      fr: "Développeur Web",
      ar: "مطور ويب",
      en: "Web Developer"
    },
    tasks: {
      fr: [
        "Développement d'applications web modernes",
        "Intégration d'interfaces responsives",
        "Gestion et optimisation des bases de données",
        "Maintenance et correction de bugs"
      ],
      ar: [
        "تطوير تطبيقات ويب حديثة ومتكاملة",
        "تصميم وبرمجة واجهات مستخدم متجاوبة",
        "إدارة وتحسين قواعد البيانات",
        "صيانة المواقع وإصلاح الأعطال البرمجية"
      ],
      en: [
        "Developing modern web applications",
        "Building responsive user interfaces",
        "Database management and optimization",
        "Website maintenance and bug fixing"
      ]
    }
  },
  {
    id: "commercial",
    titles: {
      fr: "Commercial / Conseiller de vente",
      ar: "مسؤول مبيعات / مستشار تجاري",
      en: "Sales Representative / Advisor"
    },
    tasks: {
      fr: [
        "Prospection de nouveaux clients",
        "Négociation et conclusion de ventes",
        "Suivi et fidélisation du portefeuille client",
        "Analyse des besoins du marché"
      ],
      ar: [
        "البحث عن عملاء جدد واستقطابهم",
        "تفاوض وإتمام الصفقات البيعية",
        "متابعة العملاء وبناء علاقات دائم",
        "تحليل احتياجات السوق ومتطلباته"
      ],
      en: [
        "Prospecting and acquiring new clients",
        "Negotiating and closing sales deals",
        "Client portfolio follow-up and retention",
        "Analyzing market needs and trends"
      ]
    }
  }
];

// Map jobsDatabase to sectors for the explorer to render dynamically
export const SECTORS: SectorDefinition[] = [
  {
    id: "logistique",
    label: "Logistique & Transport",
    emoji: "📦",
    jobs: [
      {
        id: "magasinier",
        title: "Magasinier / Agent de dépôt",
        keywords: ["magasinier", "dépôt", "stocks", "inventaire", "camion", "warehouse", "depot"],
        tasks: jobsDatabase[0].tasks.fr,
        skills: {
          hard: ["Gestion de stock", "Logistique d'entrepôt", "Utilisation de transpalette", "Colisage express"],
          soft: ["Vigilance constante", "Travail d'équipe", "Rigueur d'organisation", "Gestion du stress"]
        },
        interests: ["Logistique verte", "Gestion des flux", "Automatisation de dépôt"]
      }
    ]
  },
  {
    id: "technologies",
    label: "Technologies de l'Information",
    emoji: "💻",
    jobs: [
      {
        id: "developpeur_web",
        title: "Développeur Web",
        keywords: ["développeur", "web", "programmation", "site", "javascript", "developer"],
        tasks: jobsDatabase[1].tasks.fr,
        skills: {
          hard: ["TypeScript & React", "Bases de données SQL", "Intégration responsive", "Développement API"],
          soft: ["Résolution de problèmes", "Esprit analytique", "Collaboration à distance", "Veille technologique"]
        },
        interests: ["Technologies Web", "Logiciels Libres (Open Source)", "Intelligence Artificielle"]
      }
    ]
  },
  {
    id: "commerce",
    label: "Commerce, Vente & Clientèle",
    emoji: "🤝",
    jobs: [
      {
        id: "commercial",
        title: "Commercial / Conseiller de vente",
        keywords: ["commercial", "vente", "client", "négociation", "boutique", "vendeur", "sales"],
        tasks: jobsDatabase[2].tasks.fr,
        skills: {
          hard: ["Négociation de contrats", "Prospection commerciale", "Gestion de portefeuille client", "Analyse de marché"],
          soft: ["Sens du relationnel", "Persuasion", "Écoute active", "Adaptabilité commerciale"]
        },
        interests: ["Techniques de vente", "Fidélisation clients", "Nouveaux marchés"]
      }
    ]
  }
];

export const GENERIC_ETHICAL_DATA: SuggestionSet = {
  title: "Professionnel Responsable",
  tasks: [
    "Pratique continue de la communication bienveillante pour favoriser l'esprit d'équipe.",
    "Participation active aux initiatives environnementales de l'entreprise.",
    "Réduction de l'empreinte carbone à travers des outils collaboratifs écologiques."
  ],
  skills: {
    hard: ["Responsabilité Sociétale (RSE)", "Outils collaboratifs respectueux"],
    soft: ["Empathie naturelle", "Pédagogie positive"]
  },
  interests: ["Éco-citoyenneté", "Sobriété active"]
};

export function analyzePosition(position: string): SuggestionSet {
  if (!position) return GENERIC_ETHICAL_DATA;
  const cleanPos = position.toLowerCase().trim();

  // Try matching our three key roles
  if (cleanPos.includes("magasinier") || cleanPos.includes("depot") || cleanPos.includes("dépôt") || cleanPos.includes("مستودع") || cleanPos.includes("شحن") || cleanPos.includes("warehouse")) {
    const job = SECTORS[0].jobs[0];
    return {
      title: job.title,
      tasks: job.tasks,
      skills: job.skills,
      interests: job.interests
    };
  }
  if (cleanPos.includes("développeur") || cleanPos.includes("dev") || cleanPos.includes("مطور") || cleanPos.includes("web") || cleanPos.includes("developer")) {
    const job = SECTORS[1].jobs[0];
    return {
      title: job.title,
      tasks: job.tasks,
      skills: job.skills,
      interests: job.interests
    };
  }
  if (cleanPos.includes("commercial") || cleanPos.includes("vente") || cleanPos.includes("مبيعات") || cleanPos.includes("sales") || cleanPos.includes("conseiller")) {
    const job = SECTORS[2].jobs[0];
    return {
      title: job.title,
      tasks: job.tasks,
      skills: job.skills,
      interests: job.interests
    };
  }

  return {
    title: position,
    tasks: [
      `Application de pratiques de qualité pour la fonction de : ${position}`,
      "Collaboration active, transparente et constructive avec les membres de l'équipe.",
      "Optimisation constante de l'organisation et transmission bienveillante des savoirs."
    ],
    skills: {
      hard: [`Spécificités applicatives de ${position}`, "Gestion de projet participative"],
      soft: ["Adaptabilité relationnelle", "Rigueur d'exécution"]
    },
    interests: ["Amélioration continue", "Savoir-faire éco-responsable"]
  };
}
