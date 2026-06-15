import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Check,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  Briefcase,
  Wrench,
  Heart,
  Printer,
  Eye,
  Edit,
  Sliders,
  X,
  ChevronRight,
  RefreshCw,
  Info,
  CheckSquare,
  Square,
  Bookmark,
  FileText,
  HelpCircle,
  Award,
  BookOpen
} from "lucide-react";
import { SECTORS, analyzePosition, GENERIC_ETHICAL_DATA, SuggestionSet, SectorDefinition } from "./data";
import { PALETTES, TEMPLATES, renderCVTemplate, translateText } from "./components/CVPreviewTemplates";

interface Experience {
  id: string;
  company: string;
  role: string;
  years: string;
  tasks: string[];
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface Language {
  id: string;
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Courant' | 'Bilingue' | 'Langue maternelle';
}

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  targetPosition: string;
  bioSummary: string;
  experiences: Experience[];
  selectedHardSkills: string[];
  selectedSoftSkills: string[];
  customSkills: string[];
  educations: Education[];
  languages: Language[];
  selectedInterests: string[];
  customInterests: string[];
  locale?: 'fr' | 'ar' | 'en';
}

export const JOBS_DATABASE: Record<string, Record<'fr' | 'ar' | 'en', { title: string; tasks: string[]; skills: { hard: string[]; soft: string[] }; interests: string[] }>> = {
  "magasinier": {
    fr: {
      title: "Magasinier / Agent de dépôt",
      tasks: [
        "Réception des marchandises, contrôle rigoureux de la conformité des livraisons et signalement des écarts.",
        "Rangement optimal et sécurisé des produits en entrepôt selon la méthode FIFO et critères d'accessibilité.",
        "Préparation minutieuse des commandes clients à partir des bons de préparation et étiquetage réglementaire.",
        "Suivi informatisé permanent de l'état des stocks réels de l'entrepôt pour éviter toute rupture d'approvisionnement."
      ],
      skills: {
        hard: ["Gestion des stocks (FIFO/LIFO)", "Usage de douchettes/scanners RF", "Logiciels WMS/ERP de logistique", "Conduite d'engins (CACES 1,3,5)"],
        soft: ["Rigueur d'organisation", "Excellente condition physique", "Esprit de travail en équipe", "Vigilance sécurité constante"]
      },
      interests: ["Organisation d'ateliers", "Logistique éco-conçue", "Innovations matérielles"]
    },
    ar: {
      title: "أمين مستودع / عامل مخزن",
      tasks: [
        "استلام البضائع وفحص مطابقتها للمواصفات بدقة والإبلاغ عن أي فروقات.",
        "ترتيب المنتجات باحترافية وأمان في المستودع وفق منهجية FIFO لسهولة التفريغ.",
        "تجهيز طلبيات العملاء بدقة وإلصاق بطاقات التعريف والتسليم القانونية.",
        "متابعة دورية ومؤتمتة لحالة المخزون الفعلي لتفادي أي انقطاع في التوريد."
      ],
      skills: {
        hard: ["إدارة المخازن (FIFO/LIFO)", "استخدام قارئ الباركود (RF Scanners)", "برامج تخطيط الخدمات اللوجستية (WMS)", "قيادة آليات الرفع والشحن"],
        soft: ["الالتزام بالدقة والترتيب", "اللياقة والقدرة البدنية العالية", "روح العمل الجماعي والتعاون", "الحذر الدائم والامتثال لمعايير السلامة"]
      },
      interests: ["تنظيم الورشات ومساحات العمل", "الخدمات اللوجستية الصديقة للبيئة", "الابتكارات الميكانيكية"]
    },
    en: {
      title: "Warehouse Agent / Inventory Keeper",
      tasks: [
        "Receiving incoming shipments, verifying packing slips, and noting any shipping discrepancies.",
        "Organizing inventory systematically using FIFO method to guarantee neatness and rapid retrieval.",
        "Picking and packing orders efficiently according to shipping manifests and logistics standards.",
        "Utilizing inventory management systems (WMS) to log stock levels and initiate replenishment orders."
      ],
      skills: {
        hard: ["Inventory Management (FIFO/LIFO)", "RF Scanner & Barcode Systems", "WMS & ERP Logistics Software", "Forklift Operation & Safety"],
        soft: ["Strong attention to detail", "Physical endurance & dexterity", "Team collaboration", "High safety awareness"]
      },
      interests: ["Eco-friendly logistics", "Logistics automation", "Warehouse optimization"]
    }
  },
  "developpeur": {
    fr: {
      title: "Développeur Web",
      tasks: [
        "Développement d'interfaces web réactives et esthétiques avec l'intégration fine de Tailwind et React.",
        "Mise en œuvre d'APIs sécurisées et robustes avec Node.js et Express pour interconnecter des systèmes complexes.",
        "Optimisation de la performance d'affichage et respect scrupuleux des normes d'accessibilité numérique.",
        "Modélisation de bases de données relationnelles ou documentaires avec audits d'index pour accélérer les requêtes."
      ],
      skills: {
        hard: ["JavaScript / TypeScript / React / Node.js", "Tailwind CSS / Sass", "Modélisation de base de données (SQL/NoSQL)", "Git & CI/CD automatisés"],
        soft: ["Esprit analytique poussé", "Autonomie technique et veille", "Excellente communication d'équipe", "Résolution de problèmes complexes"]
      },
      interests: ["Logiciels libres (Open-Source)", "Éco-conception Web", "Sécurité des protocoles"]
    },
    ar: {
      title: "مطور ويب",
      tasks: [
        "تطوير واجهات ويب متجاوبة وجذابة بصرياً باستخدام تقنيات React و Tailwind CSS الحديثة.",
        "بناء وتصميم برمجيات خلفية (APIs) آمنة وسريعة باستخدام Node.js و Express لربط الأنظمة.",
        "تحسين معدلات سرعة تحميل المواقع والامتثال الصارم لمعايير إمكانية الوصول لذوي الاحتياجات الخاصة.",
        "نمذجة وإدارة قواعد البيانات لضمان معالجة سريعة وخالية من الأخطاء لطلبات النظام."
      ],
      skills: {
        hard: ["JavaScript / TypeScript / React / Node.js", "تنسيق واجهات المستخدم (Tailwind CSS)", "إدارة قواعد البيانات (SQL/NoSQL)", "أنظمة التحكم بالإصدارات Git"],
        soft: ["التحليل المنطقي العميق", "التعلم الذاتي المستمر ومواكبة الجديد", "التواصل الفعال مع أعضاء الفريق", "حل المشكلات التقنية بكفاءة"]
      },
      interests: ["البرمجيات الحرة ومفتوحة المصدر", "تطوير الويب الصديق للبيئة", "أمن المعلومات الفني"]
    },
    en: {
      title: "Web Developer",
      tasks: [
        "Building responsive, high-fidelity web user interfaces using React, TypeScript, and Tailwind CSS.",
        "Designing and maintaining robust RESTful APIs and backend services powered by Node.js and Express.",
        "Optimizing web applications for light loading speeds and conforming strictly to accessibility standards.",
        "Designing and query-optimizing SQL/NoSQL databases to support rapid application workflows."
      ],
      skills: {
        hard: ["JavaScript / TypeScript / React / Node.js", "Tailwind CSS & Styling Frameworks", "Database modeling (SQL & NoSQL)", "Git version control & CI/CD Tools"],
        soft: ["Analytical thinking", "Technical continuous self-learning", "Cooperative communication", "Advanced trouble-solving skills"]
      },
      interests: ["Open-source contributions", "Green computing & eco-webdev", "Information architecture"]
    }
  },
  "commercial": {
    fr: {
      title: "Commercial / Attaché commercial",
      tasks: [
        "Développement et fidélisation active d'un portefeuille de clients sur le marché cible.",
        "Prospection de nouveaux prospects à fort potentiel et planification de rendez-vous qualifiés.",
        "Analyse fine des besoins spécifiques des prospects pour proposer des solutions techniques adaptées.",
        "Négociation commerciale argumentée sur les tarifs, délais de livraison et conditions contractuelles."
      ],
      skills: {
        hard: ["Techniques de vente & négociation", "Gestion CRM (Salesforce / HubSpot)", "Analyse financière de rentabilité client", "Présentation d'offres techniques"],
        soft: ["Excellente aisance relationnelle", "Forte persévérance face aux refus", "Charisme de persuasion naturelle", "Sens affûté de l'écoute du client"]
      },
      interests: ["Réseautage professionnel", "Développement commercial de start-ups", "Conférences marketing"]
    },
    ar: {
      title: "ممثل تجاري / مندوب مبيعات",
      tasks: [
        "تنمية وتطوير محفظة العملاء وتوطيد العلاقات معهم لضمان الاستمرارية والولاء.",
        "البحث النشط والميداني عن عملاء محتملين جدد ذوي ملاءة مالية عالية وجدولة لقاءات العمل.",
        "تحليل الاحتياجات الفردية للشركات لإعداد عروض أسعار تجارية وفنية ملائمة ومربحة للطرفين.",
        "إدارة جولات التفاوض حول الأسعار وشروط العقود والآجال بحكمة واقناع."
      ],
      skills: {
        hard: ["أساليب التفاوض والإقناع وتجاوز الاعتراضات", "إدارة علاقات العملاء (CRM Software)", "دراسة ربحية الصفقات والعروض", "مهارات الإلقاء وتقديم العروض"],
        soft: ["اللباقة العالية والذكاء العاطفي", "المثابرة والعزيمة وتحدي الإحباط", "القدرة القيادية والإقناعية بالفطرة", "الإنصات المرتكز على العميل وفهم احتياجاته"]
      },
      interests: ["التواصل المهني والتشبيك", "تطوير الأعمال في الشركات الناشئة", "ريادة الأعمال والاستثمار"]
    },
    en: {
      title: "Sales Agent / Account Executive",
      tasks: [
        "Acquiring, nurturing, and maintaining relationships with strategic business-to-business clients.",
        "Executing target-driven cold outreach and product campaigns to generate qualified leads.",
        "Performing customer needs assessments to compile win-win professional technical Proposals.",
        "Negotiating contractual terms, service agreements, and price configurations to secure sales."
      ],
      skills: {
        hard: ["Negotiation & Closing techniques", "CRM platforms (HubSpot, Salesforce)", "Profitability & pricing modeling", "Client pitching & sales templates"],
        soft: ["Outstanding interpersonal charisma", "Exceptional resilience & perseverance", "Persuasion & executive presence", "Active listening and advisory orientation"]
      },
      interests: ["Business-to-Business Networking", "Strategic startup scaling", "Venture capital conferences"]
    }
  }
};

export const UI_TRANSLATIONS: Record<'fr' | 'ar' | 'en', Record<string, string>> = {
  fr: {
    appTitle: "AuraCV 2026",
    appSubtitle: "Le Pilote d'IA Tunisien de Rédaction de CV Professionnels",
    langLabel: "Langue",
    clearDraft: "Réinitialiser",
    clearDraftConfirm: "Voulez-vous réinitialiser le formulaire ? Vous perdrez la saisie actuelle.",
    secInfoPerso: "Informations Personnelles",
    fullName: "Nom complet",
    email: "E-mail",
    phone: "Téléphone",
    location: "Adresse / Ville",
    avatar: "Photo de profil (URL)",
    secTarget: "Poste visé",
    secTargetAI: "Poste visé (Pilote d'IA)",
    toggleExplorer: "💡 Parcourir les 45 métiers types de 2026",
    closeExplorer: "Fermer l'explorateur de métiers",
    searchExplorer: "Rechercher parmi les 45 métiers types...",
    searchResults: "Résultats de recherche",
    noMatches: "Aucun métier correspondant trouvé.",
    step1Sector: "Étape 1 : Choisir un Secteur",
    step2Job: "Étape 2 : Choisir le Métier (standards 2026)",
    backSectors: "Retour aux secteurs",
    secBio: "Objectif & Résumé professionnel",
    placeholderBio: "Décrivez brièvement vos points forts, aspirations ou valeurs...",
    secExperiences: "Expériences Professionnelles",
    addExp: "Ajouter une expérience",
    noExp: "Aucune expérience renseignée.",
    company: "Entreprise ou Organisme",
    role: "Intitulé du rôle ou poste",
    years: "Période (Ex: 2024 - Présent)",
    tasks: "Missions accomplies (une par ligne)",
    placeholderTasks: "Ex: Optimisation des bases de données\nEx: Management de deux ingénieurs",
    addLang: "Ajouter une langue",
    secLanguages: "Langues",
    noLanguages: "Aucune langue renseignée.",
    langName: "Langue",
    langLevel: "Niveau",
    langLevelDeb: "Débutant",
    langLevelInt: "Intermédiaire",
    langLevelAva: "Avancé",
    langLevelCou: "Courant",
    langLevelBil: "Bilingue",
    langLevelMat: "Langue maternelle",
    secSkills: "Compétences",
    secHardSkills: "Compétences Techniques (Sélectionnées ou personnalisées)",
    secSoftSkills: "Compétences Humaines",
    addCustomSkill: "Ajouter compétence personnalisée",
    secEducations: "Études & Diplômes",
    addEdu: "Ajouter un diplôme",
    school: "Établissement / École",
    degree: "Diplôme / Spécialisation",
    year: "Année d'obtention",
    noEdu: "Aucune formation renseignée.",
    secInterests: "Centres d'intérêt",
    addCustomInterest: "Ajouter intérêt personnalisé",
    secDesign: "Design & Options Premium",
    chooseTemplate: "1. Modèle de CV Premium",
    cvColor: "2. Palette Chromatique",
    fontSize: "3. Taille du texte du CV",
    exportPdf: "Télécharger PDF",
    exportingPdf: "Génération du PDF...",
    cvPreviewTitle: "Aperçu de Votre CV A4",
    tuneAura: "Intelligence AuraCV active"
  },
  ar: {
    appTitle: "أورا سي في 2026",
    appSubtitle: "مساعد الذكاء الاصطناعي الأفضل لصياغة السير الذاتية في تونس",
    langLabel: "اللغة",
    clearDraft: "إعادة تعيين",
    clearDraftConfirm: "هل تريد إعادة تعيين النموذج؟ ستفقد كل البيانات التي أدخلتها.",
    secInfoPerso: "البيانات الشخصية",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    location: "العنوان / المدينة",
    avatar: "رابط الصورة الشخصية",
    secTarget: "الوظيفة المستهدفة",
    secTargetAI: "الوظيفة المستهدفة (مع التزكية الذكية)",
    toggleExplorer: "💡 تصفح 45 وظيفة قياسية لسنة 2026",
    closeExplorer: "إغلاق مستكشف الوظائف",
    searchExplorer: "ابحث عن وظيفة من بين 45 وظيفة...",
    searchResults: "نتائج البحث",
    noMatches: "لم يتم العثور على أي وظائف مطابقة.",
    step1Sector: "الخطوة 1: اختر القطاع",
    step2Job: "الخطوة 2: اختر الوظيفة (معايير 2026)",
    backSectors: "الرجوع إلى القطاعات",
    secBio: "الهدف والملخص المهني",
    placeholderBio: "اكتب نبذة مختصرة عن مهاراتك، اهتماماتك أو قيمك المهنية...",
    secExperiences: "الخبرات المهنية",
    addExp: "إضافة خبرة",
    noExp: "لم يتم ذكر أي خبرات مهنية.",
    company: "الشركة أو المؤسسة",
    role: "المسمى الوظيفي",
    years: "الفترة الزمنية (مثال: 2024 - الآن)",
    tasks: "المهام والإنجازات (مهمة واحدة في كل سطر)",
    placeholderTasks: "مثال: إدارة وتدريب فريق من المهندسين\nمثال: تطوير وتحسين أداء خوادم الويب",
    addLang: "إضافة لغة",
    secLanguages: "اللغات",
    noLanguages: "لا توجد لغات مدخلة.",
    langName: "اللغة",
    langLevel: "المستوى",
    langLevelDeb: "مبتدئ",
    langLevelInt: "متوسط",
    langLevelAva: "متقدم",
    langLevelCou: "متقن",
    langLevelBil: "ثنائي اللغة",
    langLevelMat: "اللغة الأم",
    secSkills: "المهارات",
    secHardSkills: "المهارات التقنية (المحددة أو المخصصة)",
    secSoftSkills: "المهارات الشخصية",
    addCustomSkill: "إضافة مهارة مخصصة",
    secEducations: "التعليم والشهادات",
    addEdu: "إضافة شهادة دراسية",
    school: "المؤسسة التعليمية / الجامعة",
    degree: "الشهادة / الاختصاص",
    year: "سنة التخرج",
    noEdu: "لم يتم ذكر أي شهادات.",
    secInterests: "الاهتمامات",
    addCustomInterest: "إضافة اهتمام مخصص",
    secDesign: "التصميم والخيارات المتميزة",
    chooseTemplate: "1. نموذج السيرة الذاتية",
    cvColor: "2. لوحة الألوان",
    fontSize: "3. حجم خط السيرة الذاتية",
    exportPdf: "تحميل PDF",
    exportingPdf: "جاري إنشاء ملف PDF...",
    cvPreviewTitle: "معاينة السيرة الذاتية (A4)",
    tuneAura: "تزكيات الذكاء الاصطناعي نشطة"
  },
  en: {
    appTitle: "AuraCV 2026",
    appSubtitle: "The Tunisian AI Pilot for Elite Professional Résumés",
    langLabel: "Language",
    clearDraft: "Reset",
    clearDraftConfirm: "Are you sure you want to reset the form? All current inputs will be lost.",
    secInfoPerso: "Personal Information",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    location: "Address / City",
    avatar: "Profile Photo URL",
    secTarget: "Target Position",
    secTargetAI: "Target Position (AI Pilot)",
    toggleExplorer: "💡 Browse 45 Job Types for 2026",
    closeExplorer: "Close Job Explorer",
    searchExplorer: "Search among 45 standard 2026 jobs...",
    searchResults: "Search Results",
    noMatches: "No matching positions found.",
    step1Sector: "Step 1: Choose a Sector",
    step2Job: "Step 2: Choose the Profession (2026 standards)",
    backSectors: "Back to Sectors",
    secBio: "Objective & Professional Summary",
    placeholderBio: "Briefly describe your main strengths, aspirations or values...",
    secExperiences: "Professional Experience",
    addExp: "Add Experience",
    noExp: "No experience specified.",
    company: "Company or Organization",
    role: "Job Title / Role",
    years: "Period (e.g., 2024 - Present)",
    tasks: "Accomplished Tasks (one per line)",
    placeholderTasks: "e.g., Led database optimization initiatives\ne.g., Managed two software engineers",
    addLang: "Add Language",
    secLanguages: "Languages",
    noLanguages: "No languages specified.",
    langName: "Language",
    langLevel: "Level",
    langLevelDeb: "Beginner",
    langLevelInt: "Intermediate",
    langLevelAva: "Advanced",
    langLevelCou: "Fluent",
    langLevelBil: "Bilingual",
    langLevelMat: "Native speaker",
    secSkills: "Skills",
    secHardSkills: "Technical Skills (Selected or customized)",
    secSoftSkills: "Soft Skills",
    addCustomSkill: "Add Custom Skill",
    secEducations: "Education & Degrees",
    addEdu: "Add Degree",
    school: "Institution / School",
    degree: "Degree / Specialization",
    year: "Graduation Year",
    noEdu: "No education specified.",
    secInterests: "Interests",
    addCustomInterest: "Add Custom Interest",
    secDesign: "Premium Design Options",
    chooseTemplate: "1. Premium CV Template",
    cvColor: "2. Color Palette",
    fontSize: "3. CV Text Size",
    exportPdf: "Download PDF",
    exportingPdf: "Generating PDF...",
    cvPreviewTitle: "Your A4 CV Preview",
    tuneAura: "AI Assistant Recommendations Active"
  }
};

const DEFAULT_DRAFT: CVData = {
  fullName: "Alice Mercier",
  email: "alice.mercier@example.com",
  phone: "06 12 34 56 78",
  location: "Paris, France",
  targetPosition: "Développeur Web",
  bioSummary: "Passionnée par le numérique d'intérêt général et l'écologie du code. J'aime concevoir des architectures applicatives performantes, durables et accessibles au plus grand nombre.",
  experiences: [
    {
      id: "exp-1",
      company: "Société Coopérative CoopTech",
      role: "Développeur Web",
      years: "2024 - Présent",
      tasks: [
        "Conception de code sobre et optimisé (Green IT) réduisant significativement la consommation en CPU et en bande passante des serveurs.",
        "Implémentation rigoureuse des standards d'accessibilité numérique (RGAA / WCAG) pour garantir l'inclusion de tous les utilisateurs.",
        "Traitement et protection rigoureuse des données privées des utilisateurs en s'appuyant sur les principes de respect absolu de la vie privée."
      ]
    }
  ],
  selectedHardSkills: ["TypeScript & Frameworks Modernes", "Éco-conception logicielle (Green IT)", "Accessibilité Web (RGAA/WCAG)"],
  selectedSoftSkills: ["Empathie utilisateur", "Collaboration inter-équipes", "Sensibilité éthique pour l'IA"],
  customSkills: [],
  educations: [
    {
      id: "edu-1",
      degree: "Master Ingénierie du Web & Technologies Durables",
      school: "Université de Rennes",
      year: "2023"
    },
    {
      id: "edu-2",
      degree: "Licence Sciences Informatiques",
      school: "Institut National des Sciences Appliquées",
      year: "2021"
    }
  ],
  languages: [
    { id: "lang-1", name: "Français", level: "Langue maternelle" },
    { id: "lang-2", name: "Anglais", level: "Courant" }
  ],
  selectedInterests: ["Sobriété numérique", "Intelligence artificielle éthique", "Logiciels open-source"],
  customInterests: []
};

export default function App() {
  // Mobile UI Tabs: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Locale state selector
  const [currentLang, setCurrentLang] = useState<'fr' | 'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem("auracv-lang");
      if (saved === 'fr' || saved === 'ar' || saved === 'en') return saved;
    } catch (e) {}
    return "fr";
  });

  const tUI = (key: string): string => {
    return UI_TRANSLATIONS[currentLang][key] || UI_TRANSLATIONS["fr"][key] || key;
  };
  
  // Local storage loaded state with explicit backwards-compatibility defaults
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem("auracv-draft-v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DRAFT,
          ...parsed,
          locale: parsed.locale || "fr",
          experiences: parsed.experiences || [],
          selectedHardSkills: parsed.selectedHardSkills || [],
          selectedSoftSkills: parsed.selectedSoftSkills || [],
          customSkills: parsed.customSkills || [],
          educations: parsed.educations || DEFAULT_DRAFT.educations,
          selectedInterests: parsed.selectedInterests || DEFAULT_DRAFT.selectedInterests,
          customInterests: parsed.customInterests || []
        };
      }
    } catch (e) {
      console.error("Failed to load CV draft from localStorage", e);
    }
    return { ...DEFAULT_DRAFT, locale: "fr" };
  });

  // Save changes to localstorage silently
  useEffect(() => {
    localStorage.setItem("auracv-draft-v1", JSON.stringify(cvData));
  }, [cvData]);

  // Synchronize cvData.locale with currentLang
  useEffect(() => {
    setCvData(prev => {
      if (prev.locale !== currentLang) {
        return {
          ...prev,
          locale: currentLang
        };
      }
      return prev;
    });
  }, [currentLang]);

  const handleLangChange = (lang: 'fr' | 'ar' | 'en') => {
    setCurrentLang(lang);
    setCvData(prev => ({
      ...prev,
      locale: lang
    }));
    try {
      localStorage.setItem("auracv-lang", lang);
    } catch (e) {}
    triggerToast(lang === 'ar' ? 'تم تحويل لغة التطبيق إلى العربية 🇹🇳' : lang === 'en' ? 'App language set to English 🇬🇧' : 'Application configurée en Français 🇫🇷');
  };

  // UI States
  const [activeExpForSuggestions, setActiveExpForSuggestions] = useState<string | null>(null);
  const [suggestionSearchKeyword, setSuggestionSearchKeyword] = useState("");
  const [isJobExplorerOpen, setIsJobExplorerOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [selectedPresetColor, setSelectedPresetColor] = useState<string>("slate");
  const [cvFontSize, setCvFontSize] = useState<number>(14); // in pixels
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("auracv-selected-template");
      if (saved) return saved;
    } catch (e) {
      console.error("Failed to load selected template of CV", e);
    }
    return "minimalist_classic";
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Save template type choice to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("auracv-selected-template", selectedTemplate);
    } catch (e) {
      console.error("Failed to save selected template of CV", e);
    }
  }, [selectedTemplate]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Base text fields change handler
  const handleBaseChange = (field: keyof Omit<CVData, "experiences" | "selectedHardSkills" | "selectedSoftSkills" | "customSkills" | "educations" | "selectedInterests" | "customInterests">, value: string) => {
    setCvData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear current resume and start clean
  const handleClearDraft = () => {
    if (confirm("Voulez-vous réinitialiser le formulaire ? Vous perdrez la saisie actuelle.")) {
      setCvData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        targetPosition: "",
        bioSummary: "",
        experiences: [],
        selectedHardSkills: [],
        selectedSoftSkills: [],
        customSkills: [],
        educations: [],
        selectedInterests: [],
        customInterests: []
      });
      triggerToast("Formulaire réinitialisé ! Saisissez vos infos.");
    }
  };

  // Fill in complete sample demo values for the user
  const handleLoadDemo = () => {
    setCvData(DEFAULT_DRAFT);
    triggerToast("Exemple type 2026 chargé avec succès !");
  };

  // Add empty education block
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: "",
      school: "",
      year: ""
    };
    setCvData(prev => ({
      ...prev,
      educations: [...(prev.educations || []), newEdu]
    }));
    triggerToast("Nouveau bloc d'études ajouté.");
  };

  // Remove education block
  const handleRemoveEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      educations: (prev.educations || []).filter(edu => edu.id !== id)
    }));
    triggerToast("Étude/Diplôme supprimé.");
  };

  const handleAddLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: "",
      level: "Débutant"
    };
    setCvData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }));
    triggerToast("Nouvelle langue ajoutée.");
  };

  const handleRemoveLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(lang => lang.id !== id)
    }));
    triggerToast("Langue supprimée.");
  };

  const handleUpdateLanguage = (id: string, field: keyof Language, value: any) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).map(lang => {
        if (lang.id === id) {
          return { ...lang, [field]: value };
        }
        return lang;
      })
    }));
  };

  // Update specific education block field
  const handleUpdateEducation = (id: string, field: keyof Omit<Education, "id">, value: string) => {
    setCvData(prev => ({
      ...prev,
      educations: (prev.educations || []).map(edu => {
        if (edu.id === id) {
          return { ...edu, [field]: value };
        }
        return edu;
      })
    }));
  };

  // Toggle dynamic global interests selection
  const handleToggleGlobalInterest = (interest: string) => {
    setCvData(prev => {
      const current = prev.selectedInterests || [];
      const alreadyHas = current.includes(interest);
      return {
        ...prev,
        selectedInterests: alreadyHas
          ? current.filter(i => i !== interest)
          : [...current, interest]
      };
    });
  };

  const [customInterestInput, setCustomInterestInput] = useState("");
  const handleAddCustomInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = customInterestInput.trim();
    const current = cvData.customInterests || [];
    if (val && !current.includes(val)) {
      setCvData(prev => ({
        ...prev,
        customInterests: [...(prev.customInterests || []), val]
      }));
      setCustomInterestInput("");
      triggerToast(`Intérêt "${val}" ajouté.`);
    }
  };

  const handleRemoveCustomInterest = (val: string) => {
    setCvData(prev => ({
      ...prev,
      customInterests: (prev.customInterests || []).filter(i => i !== val)
    }));
  };

  // Add empty experience block
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      years: "",
      tasks: []
    };
    setCvData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
    triggerToast("Nouveau bloc d'expérience ajouté.");
  };

  // Remove experience block
  const handleRemoveExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
    if (activeExpForSuggestions === id) {
      setActiveExpForSuggestions(null);
    }
    triggerToast("Expérience supprimée.");
  };

  // Update specific experience block field
  const handleUpdateExperience = (id: string, field: keyof Omit<Experience, "id" | "tasks">, value: string) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      })
    }));
  };

  // Toggle tasks bullet items on a specific experience block
  const handleToggleTaskForExperience = (expId: string, taskText: string) => {
    setCvData(prev => {
      const expIdx = prev.experiences.findIndex(e => e.id === expId);
      if (expIdx === -1) return prev;

      const updatedExps = [...prev.experiences];
      const targetExp = updatedExps[expIdx];
      const isExistSelected = targetExp.tasks.includes(taskText);

      if (isExistSelected) {
        // remove task
        targetExp.tasks = targetExp.tasks.filter(t => t !== taskText);
      } else {
        // add task
        targetExp.tasks = [...targetExp.tasks, taskText];
      }

      return {
        ...prev,
        experiences: updatedExps
      };
    });
  };

  // Directly edit task text on a experience block
  const handleEditTaskOnExperience = (expId: string, taskIdx: number, newText: string) => {
    setCvData(prev => {
      const expIdx = prev.experiences.findIndex(e => e.id === expId);
      if (expIdx === -1) return prev;

      const updatedExps = [...prev.experiences];
      const exp = updatedExps[expIdx];
      const nextTasks = [...exp.tasks];
      nextTasks[taskIdx] = newText;
      exp.tasks = nextTasks;

      return {
        ...prev,
        experiences: updatedExps
      };
    });
  };

  // Add empty manual user-written task inside specific experience
  const handleAddManualTaskOnExperience = (expId: string) => {
    setCvData(prev => {
      const expIdx = prev.experiences.findIndex(e => e.id === expId);
      if (expIdx === -1) return prev;

      const updatedExps = [...prev.experiences];
      const exp = updatedExps[expIdx];
      exp.tasks = [...exp.tasks, "Saisissez votre propre puce d'expérience professionnelle éthique..."];
      return {
        ...prev,
        experiences: updatedExps
      };
    });
  };

  // Remove manual task from experience block
  const handleRemoveTaskFromExperience = (expId: string, taskIdx: number) => {
    setCvData(prev => {
      const expIdx = prev.experiences.findIndex(e => e.id === expId);
      if (expIdx === -1) return prev;

      const updatedExps = [...prev.experiences];
      const exp = updatedExps[expIdx];
      exp.tasks = exp.tasks.filter((_, idx) => idx !== taskIdx);
      return {
        ...prev,
        experiences: updatedExps
      };
    });
  };

  // Localized AI suggestion resolver supporting Tunisian Market Job references
  const getLocalizedSuggestions = (query: string): SuggestionSet => {
    const qNorm = query.toLowerCase();
    let foundKey = "";
    if (qNorm.includes("magasinier") || qNorm.includes("dépôt") || qNorm.includes("depot") || qNorm.includes("warehouse") || qNorm.includes("مستودع") || qNorm.includes("مخزن")) {
      foundKey = "magasinier";
    } else if (qNorm.includes("développeur") || qNorm.includes("developpeur") || qNorm.includes("web") || qNorm.includes("developer") || qNorm.includes("مطور") || qNorm.includes("ويب")) {
      foundKey = "developpeur";
    } else if (qNorm.includes("commercial") || qNorm.includes("vente") || qNorm.includes("sales") || qNorm.includes("تجاري") || qNorm.includes("مبيعات")) {
      foundKey = "commercial";
    }

    if (foundKey && JOBS_DATABASE[foundKey]) {
      const jobData = JOBS_DATABASE[foundKey][currentLang];
      return {
        title: jobData.title,
        tasks: jobData.tasks,
        skills: jobData.skills,
        interests: jobData.interests
      };
    }

    // Default analyzer fallback with dynamic node-by-node translation
    const defaultSuggestions = analyzePosition(query);
    if (currentLang === "fr") return defaultSuggestions;

    return {
      title: translateText(defaultSuggestions.title, currentLang),
      tasks: defaultSuggestions.tasks.map(t => translateText(t, currentLang)),
      skills: {
        hard: defaultSuggestions.skills.hard.map(s => translateText(s, currentLang)),
        soft: defaultSuggestions.skills.soft.map(s => translateText(s, currentLang))
      },
      interests: defaultSuggestions.interests.map(i => translateText(i, currentLang))
    };
  };

  // AI suggestions generated for the Active Targeted Experience (or fallback to general position)
  const suggestionsForActiveExperience = useMemo(() => {
    if (!activeExpForSuggestions) return null;
    const targetExp = cvData.experiences.find(e => e.id === activeExpForSuggestions);
    if (!targetExp) return null;

    // Use current experience role, fallback to global targetPosition, fallback to empty
    const query = (suggestionSearchKeyword || targetExp.role || cvData.targetPosition || "").trim();
    return {
      query,
      suggestions: getLocalizedSuggestions(query)
    };
  }, [activeExpForSuggestions, cvData.experiences, cvData.targetPosition, suggestionSearchKeyword, currentLang]);

  // Global skill suggestions loaded whenever global TargetPosition changes
  const globalSuggestedSkills = useMemo(() => {
    const position = cvData.targetPosition;
    return getLocalizedSuggestions(position);
  }, [cvData.targetPosition, currentLang]);

  // Hard/soft toggling actions
  const handleToggleGlobalHardSkill = (skill: string) => {
    setCvData(prev => {
      const alreadyHas = prev.selectedHardSkills.includes(skill);
      return {
        ...prev,
        selectedHardSkills: alreadyHas
          ? prev.selectedHardSkills.filter(s => s !== skill)
          : [...prev.selectedHardSkills, skill]
      };
    });
  };

  const handleToggleGlobalSoftSkill = (skill: string) => {
    setCvData(prev => {
      const alreadyHas = prev.selectedSoftSkills.includes(skill);
      return {
        ...prev,
        selectedSoftSkills: alreadyHas
          ? prev.selectedSoftSkills.filter(s => s !== skill)
          : [...prev.selectedSoftSkills, skill]
      };
    });
  };

  // Handle addition of custom freehand skills
  const [customSkillInput, setCustomSkillInput] = useState("");
  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = customSkillInput.trim();
    if (val && !cvData.customSkills.includes(val)) {
      setCvData(prev => ({
        ...prev,
        customSkills: [...prev.customSkills, val]
      }));
      setCustomSkillInput("");
      triggerToast(`Compétence "${val}" ajoutée.`);
    }
  };

  const handleRemoveCustomSkill = (val: string) => {
    setCvData(prev => ({
      ...prev,
      customSkills: prev.customSkills.filter(s => s !== val)
    }));
  };

  // Print trigger using html2pdf.js from CDN to bypass iframe security sandbox constraints
  const handlePrint = () => {
    const element = document.getElementById("cv-preview-container");
    if (!element) {
      triggerToast("Erreur : Impossible d'accéder au document CV pour l'exporter.");
      return;
    }

    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      triggerToast("Erreur : La bibliothèque PDF n'est pas encore prête. Réessayez dans un instant.");
      return;
    }

    setIsGeneratingPDF(true);
    triggerToast("Génération du PDF en cours...");

    // Setup temporary canvas for resolving modern CSS colors (oklch, oklab, color-mix) to standard browser RGB/Hex format to bypass html2canvas parsing errors.
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const canvasCtx = canvas.getContext("2d");

    const resolveModernColor = (colorStr: string): string => {
      if (!colorStr) return colorStr;
      if (!colorStr.includes("oklch") && !colorStr.includes("oklab") && !colorStr.includes("color-mix")) {
        return colorStr;
      }
      if (!canvasCtx) return colorStr;

      try {
        canvasCtx.fillStyle = "transparent";
        canvasCtx.fillStyle = colorStr;
        const resolved = canvasCtx.fillStyle;
        // If resolved value is still modern spaces or fails, return a safe fallback or original
        if (resolved.includes("oklch") || resolved.includes("oklab") || resolved.includes("color-mix")) {
          return "transparent";
        }
        return resolved;
      } catch (e) {
        return colorStr;
      }
    };

    // Override window.getComputedStyle to intercept oklab/oklch colors and convert them automatically for html2canvas
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function (el, pseudo) {
      const style = originalGetComputedStyle(el, pseudo);
      return new Proxy(style, {
        get(target, prop) {
          const value = (target as any)[prop];
          if (typeof value === "string" && (value.includes("oklch") || value.includes("oklab") || value.includes("color-mix"))) {
            return resolveModernColor(value);
          }
          if (typeof value === "function") {
            if (prop === "getPropertyValue") {
              return function (propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === "string" && (val.includes("oklch") || val.includes("oklab") || val.includes("color-mix"))) {
                  return resolveModernColor(val);
                }
                return val;
              };
            }
            return value.bind(target);
          }
          return value;
        }
      });
    };

    const opt = {
      margin: 0,
      filename: "Mon_CV_2026.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        setIsGeneratingPDF(false);
        window.getComputedStyle = originalGetComputedStyle; // Restore original helper
        triggerToast("Le téléchargement de votre CV a débuté !");
      })
      .catch((err: any) => {
        console.error("Erreur de génération PDF via html2pdf:", err);
        setIsGeneratingPDF(false);
        window.getComputedStyle = originalGetComputedStyle; // Restore original helper
        triggerToast("Une erreur est survenue lors de la création du PDF.");
      });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-slate-800 flex flex-col font-sans transition-all duration-300 p-4 sm:p-6 gap-6">
      
      {/* Toast notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white shadow-xl px-5 py-3 rounded-xl flex items-center gap-2 border border-slate-700 backdrop-blur-md text-sm cursor-pointer whitespace-nowrap"
            onClick={() => setShowToast(false)}
          >
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar themed like Bento Grid */}
      <header className="no-print flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/10">
            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300/20" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              AuraCV <span className="text-emerald-600">2026</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest leading-none mt-1">
              {currentLang === 'ar' ? 'سيرة ذاتية سيادية وذكية 🇹🇳' : currentLang === 'en' ? 'Sovereign & Ethical AI' : 'IA Éthique & Souveraine'}
            </p>
          </div>
        </div>

        {/* Premium Tunisian/Multi-Language Switcher */}
        <div className="flex bg-slate-100 hover:bg-slate-200/50 p-1 rounded-xl items-center gap-1 transition-all shadow-inner">
          <button
            onClick={() => handleLangChange('fr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentLang === 'fr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🇫🇷</span>
            <span>FR</span>
          </button>
          <button
            onClick={() => handleLangChange('ar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentLang === 'ar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🇹🇳</span>
            <span>عربي</span>
          </button>
          <button
            onClick={() => handleLangChange('en')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentLang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-load-demo"
            onClick={handleLoadDemo}
            className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            title={currentLang === 'ar' ? 'تحميل نموذج سيرة ذاتية كامل ومملوء مسبقاً' : currentLang === 'en' ? 'Load a complete pre-filled sample' : 'Charger un exemple complet pré-rempli'}
          >
            {currentLang === 'ar' ? 'نموذج تجريبي' : currentLang === 'en' ? 'Demo Example' : 'Exemple type'}
          </button>
          <button
            id="btn-clear-cv"
            onClick={handleClearDraft}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors border border-transparent cursor-pointer"
            title={currentLang === 'ar' ? 'مسح كافة الحقول مسبقاً' : currentLang === 'en' ? 'Clear all fields' : "Vider tous les champs"}
          >
            {tUI('clearDraft')}
          </button>

          {/* Print Action */}
          <button
            id="btn-print-cv"
            onClick={handlePrint}
            disabled={isGeneratingPDF}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm transform active:scale-95 cursor-pointer ${
              isGeneratingPDF ? "bg-slate-500 text-slate-100 cursor-not-allowed opacity-80" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isGeneratingPDF ? tUI('exportingPdf') : tUI('exportPdf')}</span>
          </button>
        </div>
      </header>

      {/* Horizontal navigation tabs bar exclusively visible on small screens (Mobile optimization) */}
      <div className="no-print lg:hidden sticky top-[73px] z-35 bg-white rounded-2xl border border-slate-100 p-1.5 flex gap-1 shadow-sm">
        <button
          id="tab-edit"
          onClick={() => setActiveTab("edit")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === "edit"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>{currentLang === 'ar' ? '١. صياغة وتزكيات' : currentLang === 'en' ? '1. Draft & AI' : '1. Élaborer & IA'}</span>
        </button>
        <button
          id="tab-preview"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === "preview"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{currentLang === 'ar' ? '٢. معاينة السيرة الذاتية' : currentLang === 'en' ? '2. CV Preview' : `2. Aperçu CV (${cvData.fullName ? cvData.fullName.split(" ")[0] : "Mon CV"})`}</span>
        </button>
      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* EDIT PANEL (LEFT ON LARGE SCREENS) */}
        <div 
          id="editor-section"
          className={`lg:col-span-6 space-y-6 edit-pane ${
            activeTab === "edit" ? "block" : "hidden lg:block"
          }`}
        >
          
          {/* Ethical Banner */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 flex gap-3 text-slate-700 text-xs leading-relaxed shadow-xs">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-950">
                {currentLang === 'ar' ? 'ميثاق سيادة الكاتب والأمانة المهنية : ' : currentLang === 'en' ? 'Author Sovereignty Charter: ' : "Charte de Souveraineté de l'Auteur : "}
              </span>
              {currentLang === 'ar' ? 'هذا المولد أخلاقي لأنه يستبعد الصياغة التلقائية للأوصاف الخيالية. لا يخترع الذكاء الاصطناعي شيئاً نيابة عنك: بل يحلل ملفك الشخصي ويقترح قائمة بالمسؤوليات الحقيقية لعام 2026. أنت تختار وتؤكد فقط المهام التي تمتلكها وتتقنها بالفعل.' : currentLang === 'en' ? 'This generator is ethical because it excludes automated generation of fictional descriptions. The AI does not invent anything for you: it analyzes your profile and proposes a list of real responsibilities for 2026. You select and validate the ones you actually possess.' : "Ce générateur est éthique car il exclut la génération automatisée de descriptions fictives. L'IA n'invente rien à votre place : elle ajoute de la valeur en analysant votre rôle conceptuel pour proposer une liste de responsabilités de 2026 réelles."}
            </div>
          </div>

          {/* SECTION 1: Base Identity */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-slate-600" />
              <h2 className="font-display font-semibold text-slate-950 text-sm">
                {currentLang === 'ar' ? 'الهوية والمعلومات الأساسية' : currentLang === 'en' ? 'Identity & Basic Info' : 'Identité & Infos de Base'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 font-sans">
                <label htmlFor="input-fullname" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">{tUI('fullName')}</label>
                <input
                  id="input-fullname"
                  type="text"
                  placeholder="Ex: Alice Mercier"
                  value={cvData.fullName}
                  onChange={(e) => handleBaseChange("fullName", e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5 col-span-1 sm:col-span-2 md:col-span-1 font-sans">
                <label htmlFor="input-target" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">{tUI('secTargetAI')}</label>
                <div className="relative">
                  <input
                    id="input-target"
                    type="text"
                    placeholder="Ex: Développeur Web, Magasinier, Commercial"
                    value={cvData.targetPosition}
                    onChange={(e) => handleBaseChange("targetPosition", e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 animate-pulse" />
                </div>

                {/* Highly structured, space-saving 45-job exploration tool */}
                <button
                  id="btn-toggle-job-explorer"
                  type="button"
                  onClick={() => setIsJobExplorerOpen(!isJobExplorerOpen)}
                  className="w-full mt-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border border-emerald-250 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 shrink-0" />
                  <span>{isJobExplorerOpen ? tUI('closeExplorer') : tUI('toggleExplorer')}</span>
                </button>

                <AnimatePresence>
                  {isJobExplorerOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-white border border-slate-200 rounded-2xl p-3.5 mt-2.5 shadow-md space-y-3 relative z-20"
                    >
                      {/* Search and autocomplete bar */}
                      <div className="relative">
                        <input
                          id="input-explorer-search"
                          type="text"
                          placeholder={tUI('searchExplorer')}
                          value={jobSearchQuery}
                          onChange={(e) => {
                            setJobSearchQuery(e.target.value);
                            if (selectedSectorId && e.target.value) {
                              setSelectedSectorId(null);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-8 py-2 text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <Sparkles className="w-3 h-3 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        {jobSearchQuery && (
                          <button
                            id="btn-clear-explorer-search"
                            type="button"
                            onClick={() => setJobSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {jobSearchQuery.trim() !== "" ? (
                        <div className="space-y-1.5 font-sans">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                            {tUI('searchResults')} ({
                              SECTORS.flatMap(s => s.jobs).filter(j => 
                                j.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(jobSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                              ).length
                            })
                          </span>
                          <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-0.5">
                            {SECTORS.flatMap(s => s.jobs)
                              .filter(j => j.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(jobSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
                              .map(j => {
                                const sector = SECTORS.find(s => s.jobs.some(job => job.id === j.id));
                                return (
                                  <button
                                    id={`btn-select-searched-job-${j.id}`}
                                    key={j.id}
                                    type="button"
                                    onClick={() => {
                                      const translatedTitle = translateText(j.title, currentLang);
                                      handleBaseChange("targetPosition", translatedTitle);
                                      triggerToast(currentLang === 'ar' ? `تم تفعيل وظيفة "${translatedTitle}"` : currentLang === 'en' ? `Target job "${translatedTitle}" configured!` : `Métier "${j.title}" configuré !`);
                                      setJobSearchQuery("");
                                      setIsJobExplorerOpen(false);
                                    }}
                                    className="w-full text-left p-2 rounded-xl text-[11px] hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center justify-between cursor-pointer group"
                                  >
                                    <span className="font-semibold text-slate-700 group-hover:text-emerald-700 truncate">{translateText(j.title, currentLang)}</span>
                                    <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                                      <span>{sector?.emoji}</span>
                                      <span className="hidden sm:inline bg-slate-100 text-slate-500 rounded-md px-1.5 py-0.5 text-[8px] uppercase">{translateText(sector?.label || '', currentLang).split(' ')[0]}</span>
                                    </span>
                                  </button>
                                );
                              })}
                            {SECTORS.flatMap(s => s.jobs).filter(j => 
                              j.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(jobSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                            ).length === 0 && (
                              <div className="text-[10px] text-slate-400 text-center py-4">{tUI('noMatches')}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {!selectedSectorId ? (
                            <div className="space-y-1.5 font-sans animate-fade-in">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{tUI('step1Sector')}</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {SECTORS.map(s => (
                                  <button
                                    id={`btn-select-sector-${s.id}`}
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedSectorId(s.id);
                                    }}
                                    className="text-left p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col justify-between h-[68px] cursor-pointer relative overflow-hidden group animate-fade-in animate-duration-150"
                                  >
                                    <span className="text-[15px] block">{s.emoji}</span>
                                    <span className="text-[10px] font-bold text-slate-700 leading-tight w-full group-hover:text-emerald-700 line-clamp-2">{translateText(s.label, currentLang)}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 font-sans">
                              {/* Back control */}
                              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                <button
                                  id="btn-back-to-sectors"
                                  type="button"
                                  onClick={() => setSelectedSectorId(null)}
                                  className="text-[9px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 rotate-180 shrink-0" />
                                  <span>{tUI('backSectors')}</span>
                                </button>
                                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                                  <span>{SECTORS.find(s => s.id === selectedSectorId)?.emoji}</span>
                                  <span className="truncate max-w-[130px]">{translateText(SECTORS.find(s => s.id === selectedSectorId)?.label || '', currentLang)}</span>
                                </span>
                              </div>

                              {/* Job listings */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{tUI('step2Job')}</span>
                                <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto pr-0.5">
                                  {SECTORS.find(s => s.id === selectedSectorId)?.jobs.map(j => (
                                    <button
                                      id={`btn-select-job-${j.id}`}
                                      key={j.id}
                                      type="button"
                                      onClick={() => {
                                        const translatedTitle = translateText(j.title, currentLang);
                                        handleBaseChange("targetPosition", translatedTitle);
                                        triggerToast(currentLang === 'ar' ? `تم تفعيل وظيفة "${translatedTitle}"` : currentLang === 'en' ? `Target job "${translatedTitle}" activated!` : `Métier "${j.title}" activé !`);
                                        setIsJobExplorerOpen(false);
                                        setSelectedSectorId(null);
                                      }}
                                      className="w-full text-left p-2 rounded-xl text-[11px] hover:bg-slate-50 border border-transparent hover:border-slate-100 font-medium text-slate-700 hover:text-emerald-700 flex items-center justify-between cursor-pointer"
                                    >
                                      <span className="truncate">{translateText(j.title, currentLang)}</span>
                                      <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="input-email" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Adresse Email</label>
                <input
                  id="input-email"
                  type="email"
                  placeholder="Ex: alice.mercier@example.com"
                  value={cvData.email}
                  onChange={(e) => handleBaseChange("email", e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="input-phone" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Téléphone/Contact</label>
                <input
                  id="input-phone"
                  type="tel"
                  placeholder="Ex: 06 12 34 56 78"
                  value={cvData.phone}
                  onChange={(e) => handleBaseChange("phone", e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="input-location" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Localisation (Ville, Pays)</label>
                <input
                  id="input-location"
                  type="text"
                  placeholder="Ex: Lyon, France"
                  value={cvData.location}
                  onChange={(e) => handleBaseChange("location", e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="input-bio" className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider flex justify-between items-center">
                  <span>Accroche / Profil Éthique (Court Résumé)</span>
                  <span className="text-[9.5px] text-slate-400 font-mono italic">Optionnel</span>
                </label>
                <textarea
                  id="input-bio"
                  placeholder="Décrivez votre vision professionnelle en quelques phrases sincères..."
                  value={cvData.bioSummary}
                  onChange={(e) => handleBaseChange("bioSummary", e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all h-20 resize-none font-medium"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Experiences aligned with Bento Grid styling */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <h2 className="font-display font-semibold text-slate-950 text-sm">Parcours Professionnel</h2>
              </div>
              
              <button
                id="btn-add-exp"
                onClick={handleAddExperience}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            {cvData.experiences.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Aucune expérience renseignée pour le moment.</p>
                <button
                  id="btn-empty-add-exp"
                  onClick={handleAddExperience}
                  className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all font-semibold"
                >
                  Ajouter un premier poste
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cvData.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 transition-all hover:bg-slate-50 relative group space-y-3.5"
                  >
                    
                    {/* Block Toolbar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Poste #{index + 1}</span>
                      </div>
                      <button
                        id={`btn-remove-exp-${exp.id}`}
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-slate-400 hover:text-red-500 rounded p-1 transition-colors cursor-pointer"
                        title="Supprimer ce poste"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label htmlFor={`input-company-${exp.id}`} className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Société / Orga</label>
                        <input
                          id={`input-company-${exp.id}`}
                          type="text"
                          placeholder="Ex: Emmaüs, IBM"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor={`input-role-${exp.id}`} className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Titre du Poste</label>
                        <input
                          id={`input-role-${exp.id}`}
                          type="text"
                          placeholder="Ex: Développeur Logiciel"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor={`input-years-${exp.id}`} className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Années (Début - Fin)</label>
                        <input
                          id={`input-years-${exp.id}`}
                          type="text"
                          placeholder="Ex: 2022 - 2024"
                          value={exp.years}
                          onChange={(e) => handleUpdateExperience(exp.id, "years", e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Suggestions Section triggering */}
                    <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Puces d'expérience</h4>
                          <p className="text-[10px] text-slate-500 leading-tight">Générez des suggestions basées sur ce poste ou saisissez vos propres lignes.</p>
                        </div>
                        
                        <button
                          id={`btn-suggest-tasks-${exp.id}`}
                          onClick={() => {
                            setActiveExpForSuggestions(exp.id);
                            setSuggestionSearchKeyword(exp.role || cvData.targetPosition);
                          }}
                          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-tight transition-all leading-none cursor-pointer ${
                            activeExpForSuggestions === exp.id
                              ? "bg-slate-900 text-white shadow-sm"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80"
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${activeExpForSuggestions === exp.id ? "text-emerald-400" : "text-emerald-600"} animate-pulse`} />
                          <span>Puces Suggérées</span>
                        </button>
                      </div>

                      {/* Display Selected / Custom Tasks lists */}
                      <div className="space-y-1.5 mt-2">
                        {exp.tasks.length === 0 ? (
                          <p className="text-[10.5px] italic text-slate-400">Aucune tâche sélectionnée. Cliquez ci-dessus pour utiliser le conseiller de puces.</p>
                        ) : (
                          <div className="space-y-2">
                            {exp.tasks.map((task, taskIdx) => (
                              <div key={taskIdx} className="flex items-start gap-2 group/line">
                                <span className="text-slate-400 select-none mt-1.5 text-[10px]">•</span>
                                <input
                                  id={`input-task-${exp.id}-${taskIdx}`}
                                  type="text"
                                  value={task}
                                  onChange={(e) => handleEditTaskOnExperience(exp.id, taskIdx, e.target.value)}
                                  className="flex-1 bg-transparent text-xs text-slate-700 font-medium focus:bg-slate-50 border-b border-transparent focus:border-slate-300 py-0.5 focus:px-1.5 outline-none font-sans"
                                />
                                <button
                                  id={`btn-remove-task-${exp.id}-${taskIdx}`}
                                  onClick={() => handleRemoveTaskFromExperience(exp.id, taskIdx)}
                                  className="opacity-0 group-hover/line:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                                  title="Supprimer cette ligne"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          id={`btn-add-manual-task-${exp.id}`}
                          onClick={() => handleAddManualTaskOnExperience(exp.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-950 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>Saisir une ligne sur-mesure</span>
                        </button>
                      </div>
                    </div>

                    {/* SUGGESTIONS PREVIEW INTERFACE - INLINE UNDER THE CARD COMPONENT IN BENTO BLACK DESIGN */}
                    <AnimatePresence>
                      {activeExpForSuggestions === exp.id && suggestionsForActiveExperience && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 mt-3 col-span-1 space-y-4 shadow-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Suggestions IA Éthique</h2>
                            </div>
                            <button
                              id="btn-close-suggestions"
                              onClick={() => {
                                setActiveExpForSuggestions(null);
                                setSuggestionSearchKeyword("");
                              }}
                              className="text-slate-400 hover:text-white p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-[11px] text-slate-400 leading-tight">
                            Basé sur le rôle ciblé : <span className="font-semibold text-slate-200">"{suggestionsForActiveExperience.query}"</span>. L'IA propose des structures standards réelles de 2026.
                          </div>

                          <div className="flex gap-2">
                            <input
                              id="input-change-query"
                              type="text"
                              value={suggestionSearchKeyword}
                              onChange={(e) => setSuggestionSearchKeyword(e.target.value)}
                              placeholder="Changer le secteur ciblé (Ex: Commercial)"
                              className="flex-1 bg-slate-800 border-none rounded-xl px-3 py-2 text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            {suggestionSearchKeyword !== (exp.role || cvData.targetPosition) && (
                              <button
                                id="btn-reset-query"
                                onClick={() => setSuggestionSearchKeyword(exp.role || cvData.targetPosition)}
                                className="text-slate-400 hover:text-white p-2 text-xs cursor-pointer"
                                title="Réinitialiser"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {suggestionsForActiveExperience.suggestions.tasks.map((taskMsg, idx) => {
                              const isChecked = exp.tasks.includes(taskMsg);
                              return (
                                <button
                                  id={`btn-toggle-task-suggestion-${idx}`}
                                  key={idx}
                                  onClick={() => handleToggleTaskForExperience(exp.id, taskMsg)}
                                  className={`w-full text-left p-3 rounded-xl text-xs leading-relaxed transition-all flex gap-2 border cursor-pointer ${
                                    isChecked
                                      ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                                      : "bg-slate-800 text-slate-200 border-transparent hover:bg-slate-750 hover:border-slate-800"
                                  }`}
                                >
                                  <div className="shrink-0 mt-0.5">
                                    {isChecked ? (
                                      <div className="bg-white text-emerald-600 rounded p-0.5"><Check className="w-2.5 h-2.5 stroke-[3]" /></div>
                                    ) : (
                                      <div className="border border-slate-600 w-4 h-4 rounded" />
                                    )}
                                  </div>
                                  <span className="flex-1 font-medium">{taskMsg}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="text-[10px] text-slate-400 bg-slate-800 p-3 rounded-xl leading-relaxed">
                            💡 Cliquez sur n'importe quel élément pour l'insérer ou le retirer directement de votre CV.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2.5: Études & Diplômes (Dynamic dynamic list manager) */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <h2 className="font-display font-semibold text-slate-950 text-sm">Formation & Diplômes</h2>
              </div>
              
              <button
                id="btn-add-edu"
                type="button"
                onClick={handleAddEducation}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer border border-transparent"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un diplôme</span>
              </button>
            </div>

            {(cvData.educations || []).length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Aucun diplôme ou formation renseignée.</p>
                <button
                  id="btn-empty-add-edu"
                  type="button"
                  onClick={handleAddEducation}
                  className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all font-semibold cursor-pointer"
                >
                  Ajouter ma première formation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(cvData.educations || []).map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Formation #{index + 1}</span>
                      <button
                        id={`btn-remove-edu-${edu.id}`}
                        type="button"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-slate-400 hover:text-red-500 rounded p-1 transition-colors cursor-pointer"
                        title="Supprimer cette formation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5 space-y-1">
                        <label htmlFor={`input-edu-degree-${edu.id}`} className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Nom du diplôme / Rôle</label>
                        <input
                          id={`input-edu-degree-${edu.id}`}
                          type="text"
                          placeholder="Ex: Master en Informatique"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label htmlFor={`input-edu-school-${edu.id}`} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-sans">Établissement / Université</label>
                        <input
                          id={`input-edu-school-${edu.id}`}
                          type="text"
                          placeholder="Ex: Université de Rennes"
                          value={edu.school}
                          onChange={(e) => handleUpdateEducation(edu.id, "school", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label htmlFor={`input-edu-year-${edu.id}`} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-sans">Année d'obtention</label>
                        <input
                          id={`input-edu-year-${edu.id}`}
                          type="text"
                          placeholder="Ex: 2023"
                          value={edu.year}
                          onChange={(e) => handleUpdateEducation(edu.id, "year", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2.6: Langues */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <h2 className="font-display font-semibold text-slate-950 text-sm">Langues</h2>
              </div>
              
              <button
                id="btn-add-lang"
                type="button"
                onClick={handleAddLanguage}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer border border-transparent"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            {(cvData.languages || []).length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">Aucune langue renseignée.</p>
                <button
                  id="btn-empty-add-lang"
                  type="button"
                  onClick={handleAddLanguage}
                  className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all font-semibold cursor-pointer"
                >
                  Ajouter une langue
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(cvData.languages || []).map((lang, index) => (
                  <div key={lang.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Langue</label>
                        <input
                          type="text"
                          placeholder="Ex: Anglais"
                          value={lang.name}
                          onChange={(e) => handleUpdateLanguage(lang.id, "name", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                     </div>
                     <div className="flex items-end gap-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Niveau</label>
                          <select
                            value={lang.level}
                            onChange={(e) => handleUpdateLanguage(lang.id, "level", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option>Débutant</option>
                            <option>Intermédiaire</option>
                            <option>Avancé</option>
                            <option>Courant</option>
                            <option>Bilingue</option>
                            <option>Langue maternelle</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="text-slate-400 hover:text-red-500 p-2 rounded-xl border border-slate-200 hover:border-red-200 cursor-pointer mb-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Wrench className="w-4 h-4 text-slate-600" />
              <h2 className="font-display font-semibold text-slate-950 text-sm">Compétences Durables & Techniques</h2>
            </div>

            {/* Simulated IA Pill Box based on Poste Visé */}
            <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-4.5 space-y-4 shadow-2xs">
              <div className="flex items-start justify-between gap-1.5">
                <div className="space-y-1">
                  <span className="bg-emerald-600 text-white rounded-lg py-1 px-2.5 text-[10px] font-bold font-display uppercase tracking-wider inline-block">Conseiller Skills IA</span>
                  <p className="text-xs text-slate-850 font-medium leading-none">Spécifiques à : <span className="font-bold text-emerald-950">"{cvData.targetPosition || "Professionnel engagé"}"</span></p>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce cursor-help shrink-0" />
              </div>

              {/* Hard Skills pills recommendations */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Hard Skills conseillés</h4>
                <div className="flex flex-wrap gap-1.5">
                  {globalSuggestedSkills.skills.hard.map((skill, idx) => {
                    const isActive = cvData.selectedHardSkills.includes(skill);
                    return (
                      <button
                        id={`btn-toggle-hard-skill-${idx}`}
                        key={idx}
                        onClick={() => handleToggleGlobalHardSkill(skill)}
                        className={`text-[10.5px] px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-sm"
                            : "bg-white text-slate-700 border-slate-200/60 hover:border-slate-300"
                        }`}
                      >
                        {isActive && <Check className="w-2.5 h-2.5 shrink-0 stroke-[3]" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soft Skills pills recommendations */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Soft Skills éthiques conseillés</h4>
                <div className="flex flex-wrap gap-1.5">
                  {globalSuggestedSkills.skills.soft.map((skill, idx) => {
                    const isActive = cvData.selectedSoftSkills.includes(skill);
                    return (
                      <button
                        id={`btn-toggle-soft-skill-${idx}`}
                        key={idx}
                        onClick={() => handleToggleGlobalSoftSkill(skill)}
                        className={`text-[10.5px] px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm"
                            : "bg-white text-emerald-900 border-emerald-150 hover:border-emerald-300"
                        }`}
                      >
                        {isActive && <Check className="w-2.5 h-2.5 shrink-0 stroke-[3]" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Manual Skills addition */}
            <form onSubmit={handleAddCustomSkill} className="space-y-2">
              <label htmlFor="input-custom-skill" className="text-[10px] uppercase font-bold text-slate-500 block">Autre compétence sur-mesure</label>
              <div className="flex gap-2">
                <input
                  id="input-custom-skill"
                  type="text"
                  placeholder="Ex: Allemand professionnel, Figma, Docker..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
                <button
                  id="btn-add-custom-skill"
                  type="button"
                  onClick={() => handleAddCustomSkill()}
                  className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-sm text-center"
                >
                  Ajouter
                </button>
              </div>

              {cvData.customSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {cvData.customSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border-slate-200 border rounded-full px-3 py-1 text-[10.5px] font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        id={`btn-remove-custom-skill-${idx}`}
                        type="button"
                        onClick={() => handleRemoveCustomSkill(skill)}
                        className="text-slate-400 hover:text-red-500 font-bold p-0.5 cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </form>
          </section>

          {/* SECTION 3.5: Centres d'intérêt professionnels (IA Suggestions adaptive) */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Heart className="w-4 h-4 text-slate-600" />
              <h2 className="font-display font-semibold text-slate-950 text-sm">Centres d'intérêt Professionnels</h2>
            </div>

            {/* Suggestions adaptives */}
            <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sujets suggérés pour le poste</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(globalSuggestedSkills.interests || ["Engagement RSE", "Amélioration continue", "Sobriété éco-numérique"]).map((interest, idx) => {
                  const isActive = (cvData.selectedInterests || []).includes(interest);
                  return (
                    <button
                      id={`btn-toggle-interest-${idx}`}
                      key={idx}
                      type="button"
                      onClick={() => handleToggleGlobalInterest(interest)}
                      className={`text-[10.5px] px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-xs"
                          : "bg-white text-slate-700 border-slate-200/65 hover:border-slate-300"
                      }`}
                    >
                      {isActive && <Check className="w-2.5 h-2.5 shrink-0 stroke-[3]" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddCustomInterest} className="space-y-2">
              <label htmlFor="input-custom-interest" className="text-[10px] uppercase font-bold text-slate-500 block">Saisir un centre d'intérêt personnalisé</label>
              <div className="flex gap-2">
                <input
                  id="input-custom-interest"
                  type="text"
                  placeholder="Ex: Éco-conception, Volontariat associatif, Échecs..."
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
                <button
                  id="btn-add-custom-interest"
                  type="button"
                  onClick={() => handleAddCustomInterest()}
                  className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-sm text-center"
                >
                  Ajouter
                </button>
              </div>

              {(cvData.customInterests || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(cvData.customInterests || []).map((interest, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border-slate-200 border rounded-full px-3 py-1 text-[10.5px] font-medium"
                    >
                      <span>{interest}</span>
                      <button
                        id={`btn-remove-custom-interest-${idx}`}
                        type="button"
                        onClick={() => handleRemoveCustomInterest(interest)}
                        className="text-slate-400 hover:text-red-500 font-bold p-0.5 cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </form>
          </section>

          {/* Sizing & Layout Screen Controls */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-slate-600" />
              <h2 className="font-display font-semibold text-slate-950 text-sm">Réglage de la mise en page</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-xs">
                {/* Visual Theme Accent */}
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100/70">
                  <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px] block">Palette de Couleurs (6 harmonies professionnelles)</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PALETTES.map(p => {
                      const isActive = selectedPresetColor === p.key;
                      return (
                        <button
                          id={`btn-theme-${p.key}`}
                          key={p.key}
                          onClick={() => {
                            setSelectedPresetColor(p.key);
                            triggerToast(`Harmonie "${p.name}" activée.`);
                          }}
                          className={`text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 justify-between relative ${
                            isActive
                              ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                              : "bg-white border-slate-150 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                          }`}
                          title={p.name}
                        >
                          <div className="flex items-center gap-1.5 w-full">
                            <div className="flex -space-x-1 shrink-0">
                              <span className="w-3.5 h-3.5 rounded-full border border-white/40 block" style={{ backgroundColor: p.primary }} />
                              <span className="w-3.5 h-3.5 rounded-full border border-white/40 block" style={{ backgroundColor: p.secondary }} />
                            </div>
                            {isActive && <Check className="w-3 h-3 text-emerald-400 ml-auto shrink-0" />}
                          </div>
                          <span className="text-[10px] font-bold tracking-tight block truncate uppercase leading-none">
                            {p.key}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Adjustment */}
                <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100/70">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Taille police ({cvFontSize}px)</span>
                    <button 
                      id="btn-reset-font"
                      onClick={() => setCvFontSize(14)} 
                      className="text-[9px] text-slate-400 font-mono cursor-pointer hover:text-slate-600 font-bold"
                    >
                      Défaut
                    </button>
                  </div>
                  <input
                    id="range-font-size"
                    type="range"
                    min="11"
                    max="17"
                    step="0.5"
                    value={cvFontSize}
                    onChange={(e) => setCvFontSize(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                    <span>Compact</span>
                    <span>Grand</span>
                  </div>
                </div>
              </div>

              {/* Choose layout models: 20 high-fidelity premium templates */}
              <div className="space-y-2 pt-1">
                <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px] block">Modèle de CV (20 styles créatifs exclusifs)</span>
                <div className="grid grid-cols-1 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {TEMPLATES.map((tpl) => {
                    const isActive = selectedTemplate === tpl.id;
                    return (
                      <button
                        id={`btn-tpl-${tpl.id}`}
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTemplate(tpl.id);
                          triggerToast(`Modèle "${tpl.name}" activé.`);
                        }}
                        className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative group ${
                          isActive
                            ? "bg-slate-900 border-slate-900 text-white shadow-xs relative z-10"
                            : "bg-white border-slate-100 text-slate-800 hover:bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 transition-all ${
                          isActive 
                            ? "bg-emerald-600 text-white" 
                            : "bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-slate-100"
                        }`}>
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold tracking-tight block truncate">
                              {tpl.name}
                            </span>
                            {tpl.badge && (
                              <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider leading-none ${
                                isActive 
                                  ? "bg-emerald-500 text-slate-950" 
                                  : "bg-emerald-100 text-emerald-900"
                              }`}>
                                {tpl.badge}
                              </span>
                            )}
                          </div>
                          <span className={`text-[9px] block leading-snug ${isActive ? "text-slate-300" : "text-slate-450"}`}>
                            {tpl.desc}
                          </span>
                        </div>
                        {isActive && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Data privacy pledge */}
          <div className="text-center py-2 text-[10px] text-slate-400 leading-normal">
            AuraCV 2026 est une application d'intérêt civique.<br />
            Aucune des données professionnelles ou privées que vous saisissez ne transite vers des tiers ou des régies publicitaires. 100% de la compilation s'effectue localement au sein de votre navigateur.
          </div>

        </div>

        {/* APERÇU LIVE PANEL (RIGHT ON LARGE SCREENS) */}
        <div 
          id="preview-section"
          className={`lg:col-span-6 flex flex-col items-center justify-start ${
            activeTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          
          {/* Desktop Preview Utility Toolbar */}
          <div className="no-print hidden lg:flex items-center justify-between w-full max-w-[21cm] bg-slate-900 text-slate-100 rounded-t-2xl px-5 py-4 border border-slate-800 shadow-md text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-100">Aperçu interactif haute fidélité</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg font-mono">Format A4</span>
              <button
                id="btn-zoom-print"
                onClick={handlePrint}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold border border-transparent shadow-sm transition-all cursor-pointer ${
                  isGeneratingPDF 
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed opacity-80" 
                    : "hover:text-white bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>{isGeneratingPDF ? "Génération du PDF..." : "Télécharger PDF"}</span>
              </button>
            </div>
          </div>

          {/* SCROLLABLE SHEET CONTAINER ON VIEWPORT */}
          <div className="w-full max-w-[21cm] bg-slate-100/70 p-5 sm:p-5 lg:p-8 rounded-b-2xl border-x border-b border-slate-200/60 shadow-xs flex justify-center overflow-x-auto">
            
            {/* REAL CV PAPER SHEET - SIZED LIKE A4 PORTRAIT */}
            <div
              id="cv-preview-container"
              className="bg-white text-slate-900 shadow-xl print-only-full w-full max-w-none sm:max-w-[21cm] p-6 sm:p-10 transition-all font-sans relative border border-slate-200/50 lg:rounded-xs select-text"
              style={{
                fontSize: `${cvFontSize}px`,
                fontFamily: "var(--font-sans)",
                minHeight: "29.7cm",
                "--cv-primary": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).primary,
                "--cv-secondary": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).secondary,
                "--cv-accent": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).accent,
                "--cv-bg-light": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).bgLight,
                "--cv-border": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).border,
                "--cv-text-dark": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).textDark,
                "--cv-text-light": (PALETTES.find(p => p.key === selectedPresetColor) || PALETTES[4]).textLight,
              } as React.CSSProperties}
            >
              {/* Preset highlight line colors mapping */}
              <div 
                className="decorations absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: "var(--cv-primary)" }}
              />

              {/* RENDER THE ACTIVE CHOSEN 1-OF-20 TEMPLATE */}
              {renderCVTemplate(selectedTemplate, cvData)}

              {/* Real time genuine candidate signature footer */}
              <footer className="pt-8 border-t border-slate-100 text-center text-[7.5pt] text-slate-400 flex items-center justify-center gap-1 font-mono uppercase tracking-wider mt-6">
                <span>Candidature authentique • Aucun texte fictif généré robotiquement</span>
              </footer>            </div>
          </div>
          
        </div>
        
      </main>
    </div>
  );
}

// Compact structural helper components representing local data visualization symbols
function BadgeIcon({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${
        color === "emerald" ? "bg-emerald-500" :
        color === "indigo" ? "bg-indigo-500" :
        color === "rose" ? "bg-rose-500" : "bg-slate-500"
      }`} />
      <span>Souveraineté Locale</span>
    </span>
  );
}

