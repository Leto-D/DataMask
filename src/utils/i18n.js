// GRID Extension - Système d'internationalisation
// Support multilingue FR/EN/DE

export const translations = {
  fr: {
    // Général
    app_title: "GRID - AI Prompt Builder",
    app_subtitle: "Création de Prompts & IA",
    app_description: "Outil de productivité pour créer des prompts efficaces",
    start_button: "Commencer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    close: "Fermer",
    copy: "Copier",
    copied: "Copié !",
    edit: "Modifier",
    generate: "Générer",
    
    // Navigation
    home: "Accueil",
    library: "Bibliothèque",
    step1: "Étape 1: Définir l'objectif",
    step2: "Étape 2: Structurer", 
    step3: "Étape 3: Personnaliser",
    result: "Prompt généré",
    
    // Page d'accueil
    features: {
      fast: "Rapide",
      structured: "Structuré", 
      efficient: "Efficace"
    },
    
    // Bibliothèque
    library_title: "Bibliothèque",
    library_subtitle: "Templates et exemples de prompts",
    template_count: "TEMPLATES",
    search_placeholder: "Rechercher des exemples...",
    all_categories: "Toutes les catégories",
    categories: {
      business: "Business",
      marketing: "Marketing",
      education: "Éducation",
      technical: "Technique",
      creative: "Créatif"
    },
    preview: "Aperçu",
    use: "Utiliser",
    
    // Étape 1
    objective_label: "Objectif principal",
    objective_placeholder: "Décrivez précisément ce que vous attendez de l'IA...",
    audience_label: "Audience cible",
    audience_help: "Maintenez Ctrl/Cmd pour sélectionner plusieurs options",
    context_label: "Contexte",
    context_placeholder: "Ex: Entreprise: LeadGenPro, Secteur: Logiciels B2B, Public: investisseurs...",
    instructions_label: "Instructions séquentielles (optionnel)",
    instructions_placeholder: "1. Effectuer une analyse...\n2. Proposer des stratégies...\n3. Identifier les KPIs...",
    success_criteria_label: "Critères de succès",
    success_criteria_placeholder: "Ex: Réponse complète, cohérente, utilisable, avec 3-5 points par section...",
    
    // Suggestions d'objectifs
    objective_suggestions: {
      write_report: "Rédiger un rapport",
      analyze_data: "Analyser des données", 
      create_strategy: "Créer une stratégie",
      solve_problem: "Résoudre un problème",
      optimize_process: "Optimiser un processus",
      evaluate_options: "Évaluer des options",
      plan_project: "Planifier un projet",
      present_results: "Présenter des résultats"
    },
    
    // Audiences
    audiences: {
      beginner: "Débutant",
      intermediate: "Intermédiaire", 
      expert: "Expert",
      management: "Équipe de direction",
      general_public: "Grand public",
      technical: "Public technique"
    },
    
    // Étape 2
    role_label: "Rôle et personnalité",
    role_placeholder: "Choisir un rôle...",
    role_custom_placeholder: "Décrivez le rôle personnalisé...",
    skills_label: "Compétences clés",
    skills_placeholder: "Ex: Analyse stratégique, Optimisation, Leadership...",
    examples_label: "Exemples Input/Output (multishot)",
    examples_placeholder: "Exemple 1:\nInput: Analyser les forces internes\nOutput: Une force pourrait être une équipe commerciale expérimentée\n\nExemple 2:\nInput: Identifier une opportunité\nOutput: Croissance du marché SaaS dans la santé",
    examples_help: "Fournissez 2-5 exemples avec format Input → Output",
    prefill_label: "Préremplissage de la réponse (optionnel)",
    prefill_placeholder: 'Ex: {"Strengths": [, "Weaknesses": [',
    prefill_help: "Format de sortie que l'IA doit commencer à remplir",
    
    // Rôles
    roles: {
      senior_consultant: "Consultant Senior en Stratégie",
      data_analyst: "Analyste de Données",
      marketing_expert: "Expert Marketing",
      senior_developer: "Développeur Senior", 
      technical_writer: "Rédacteur Technique",
      custom: "Rôle personnalisé..."
    },
    
    // Compétences
    skills_suggestions: {
      strategic_analysis: "Analyse stratégique",
      critical_thinking: "Pensée critique",
      communication: "Communication",
      creativity: "Créativité",
      leadership: "Leadership",
      innovation: "Innovation",
      problem_solving: "Résolution de problèmes",
      project_management: "Gestion de projet",
      data_analysis: "Analyse de données",
      business_vision: "Vision business"
    },
    
    // Étape 3
    response_length_label: "Longueur de réponse",
    creativity_level_label: "Niveau de créativité", 
    output_format_label: "Format de sortie",
    reasoning_label: "Raisonnement (Chain-of-thought)",
    advanced_ai_label: "Paramètres IA avancés",
    autonomy_label: "Autonomie (Eagerness)",
    analysis_depth_label: "Profondeur d'analyse",
    verbosity_label: "Verbosité",
    advanced_options_label: "Options avancées",
    
    // Longueurs
    lengths: {
      short: "Courte (100-300 mots)",
      medium: "Moyenne (300-600 mots)",
      detailed: "Détaillée (600+ mots)"
    },
    
    // Créativité
    creativity: {
      factual: "Factuelle (0% créativité)",
      moderate: "Modérée (30% créativité)", 
      creative: "Créative (70% créativité)"
    },
    
    // Formats
    formats: {
      text: "Texte libre",
      report: "Rapport structuré",
      list: "Liste à puces",
      json: "Format JSON"
    },
    
    // Raisonnement
    reasoning_types: {
      none: "Aucun raisonnement spécifique",
      step_by_step: "Raisonnement étape par étape",
      justification: "Justifier les choix", 
      self_reflection: "Auto-réflexion avant réponse"
    },
    
    // Autonomie
    autonomy_levels: {
      low: "Basse - L'IA pose des questions",
      medium: "Moyenne - Équilibrée",
      high: "Haute - L'IA est proactive"
    },
    
    // Profondeur
    analysis_depths: {
      low: "Analyse rapide",
      medium: "Analyse standard", 
      high: "Analyse approfondie"
    },
    
    // Verbosité
    verbosity_levels: {
      concise: "Concise",
      balanced: "Équilibrée",
      detailed: "Détaillée"
    },
    
    // Options avancées
    allow_unknown: "Autoriser \"Je ne sais pas\"",
    require_sources: "Exiger des sources",
    use_xml: "Utiliser structure XML avancée",
    
    // Sélecteur d'IA
    ai_selector_choose: "Choisir IA",
    ai_selector_custom: "Personnaliser...",
    
    // Modal personnalisation IA
    custom_ai_title: "Personnaliser une IA",
    custom_ai_name_label: "Nom de l'IA",
    custom_ai_name_placeholder: "Ex: Mon IA personnalisée",
    custom_ai_url_label: "URL de l'IA",
    custom_ai_url_placeholder: "https://monai.com/chat",
    custom_ai_url_help: "URL vers laquelle rediriger (ex: https://chat.openai.com/)",
    custom_ai_cancel: "Annuler",
    custom_ai_save: "Sauvegarder",
    
    // Pied de page
    footer: "© 2025 GRID - AI Prompt Builder (By LetoD)"
  },
  
  en: {
    // General
    app_title: "GRID - AI Prompt Builder", 
    app_subtitle: "AI Prompt Creation",
    app_description: "Productivity tool for creating effective prompts",
    start_button: "Get Started",
    back: "Back",
    next: "Next", 
    previous: "Previous",
    close: "Close",
    copy: "Copy",
    copied: "Copied!",
    edit: "Edit",
    generate: "Generate",
    
    // Navigation
    home: "Home",
    library: "Library",
    step1: "Step 1: Define Objective",
    step2: "Step 2: Structure",
    step3: "Step 3: Customize", 
    result: "Generated Prompt",
    
    // Homepage
    features: {
      fast: "Fast",
      structured: "Structured",
      efficient: "Efficient"
    },
    
    // Library
    library_title: "Library",
    library_subtitle: "Templates and prompt examples",
    template_count: "TEMPLATES",
    search_placeholder: "Search examples...",
    all_categories: "All categories", 
    categories: {
      business: "Business",
      marketing: "Marketing",
      education: "Education",
      technical: "Technical",
      creative: "Creative"
    },
    preview: "Preview",
    use: "Use",
    
    // Step 1
    objective_label: "Main Objective",
    objective_placeholder: "Describe precisely what you expect from the AI...",
    audience_label: "Target Audience",
    audience_help: "Hold Ctrl/Cmd to select multiple options",
    context_label: "Context",
    context_placeholder: "Ex: Company: LeadGenPro, Sector: B2B Software, Audience: investors...",
    instructions_label: "Sequential Instructions (optional)",
    instructions_placeholder: "1. Perform analysis...\n2. Suggest strategies...\n3. Identify KPIs...",
    success_criteria_label: "Success Criteria",
    success_criteria_placeholder: "Ex: Complete, coherent, usable response with 3-5 points per section...",
    
    // Objective suggestions
    objective_suggestions: {
      write_report: "Write a report",
      analyze_data: "Analyze data",
      create_strategy: "Create a strategy", 
      solve_problem: "Solve a problem",
      optimize_process: "Optimize a process",
      evaluate_options: "Evaluate options",
      plan_project: "Plan a project",
      present_results: "Present results"
    },
    
    // Audiences
    audiences: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      expert: "Expert", 
      management: "Management Team",
      general_public: "General Public",
      technical: "Technical Audience"
    },
    
    // Step 2
    role_label: "Role and Personality",
    role_placeholder: "Choose a role...",
    role_custom_placeholder: "Describe the custom role...",
    skills_label: "Key Skills",
    skills_placeholder: "Ex: Strategic Analysis, Optimization, Leadership...",
    examples_label: "Input/Output Examples (multishot)",
    examples_placeholder: "Example 1:\nInput: Analyze internal strengths\nOutput: A strength could be an experienced sales team\n\nExample 2:\nInput: Identify an opportunity\nOutput: Growth in healthcare SaaS market",
    examples_help: "Provide 2-5 examples with Input → Output format",
    prefill_label: "Response Prefill (optional)", 
    prefill_placeholder: 'Ex: {"Strengths": [, "Weaknesses": [',
    prefill_help: "Output format that AI should start filling",
    
    // Roles
    roles: {
      senior_consultant: "Senior Strategy Consultant",
      data_analyst: "Data Analyst",
      marketing_expert: "Marketing Expert",
      senior_developer: "Senior Developer",
      technical_writer: "Technical Writer",
      custom: "Custom role..."
    },
    
    // Skills
    skills_suggestions: {
      strategic_analysis: "Strategic Analysis",
      critical_thinking: "Critical Thinking", 
      communication: "Communication",
      creativity: "Creativity",
      leadership: "Leadership",
      innovation: "Innovation",
      problem_solving: "Problem Solving",
      project_management: "Project Management",
      data_analysis: "Data Analysis",
      business_vision: "Business Vision"
    },
    
    // Step 3
    response_length_label: "Response Length",
    creativity_level_label: "Creativity Level",
    output_format_label: "Output Format",
    reasoning_label: "Reasoning (Chain-of-thought)",
    advanced_ai_label: "Advanced AI Settings",
    autonomy_label: "Autonomy (Eagerness)",
    analysis_depth_label: "Analysis Depth",
    verbosity_label: "Verbosity",
    advanced_options_label: "Advanced Options",
    
    // Lengths
    lengths: {
      short: "Short (100-300 words)",
      medium: "Medium (300-600 words)",
      detailed: "Detailed (600+ words)"
    },
    
    // Creativity
    creativity: {
      factual: "Factual (0% creativity)",
      moderate: "Moderate (30% creativity)",
      creative: "Creative (70% creativity)"
    },
    
    // Formats
    formats: {
      text: "Free text",
      report: "Structured report",
      list: "Bullet list",
      json: "JSON format"
    },
    
    // Reasoning
    reasoning_types: {
      none: "No specific reasoning",
      step_by_step: "Step-by-step reasoning",
      justification: "Justify choices",
      self_reflection: "Self-reflection before response"
    },
    
    // Autonomy
    autonomy_levels: {
      low: "Low - AI asks questions",
      medium: "Medium - Balanced",
      high: "High - AI is proactive"
    },
    
    // Depth
    analysis_depths: {
      low: "Quick analysis",
      medium: "Standard analysis", 
      high: "Deep analysis"
    },
    
    // Verbosity
    verbosity_levels: {
      concise: "Concise",
      balanced: "Balanced",
      detailed: "Detailed"
    },
    
    // Advanced options
    allow_unknown: "Allow \"I don't know\"",
    require_sources: "Require sources",
    use_xml: "Use advanced XML structure",
    
    // AI Selector
    ai_selector_choose: "Choose AI",
    ai_selector_custom: "Customize...",
    
    // Custom AI Modal
    custom_ai_title: "Customize an AI",
    custom_ai_name_label: "AI Name",
    custom_ai_name_placeholder: "Ex: My custom AI",
    custom_ai_url_label: "AI URL",
    custom_ai_url_placeholder: "https://myai.com/chat",
    custom_ai_url_help: "URL to redirect to (ex: https://chat.openai.com/)",
    custom_ai_cancel: "Cancel",
    custom_ai_save: "Save",
    
    // Footer
    footer: "© 2025 GRID - AI Prompt Builder (By LetoD)"
  },
  
  de: {
    // Allgemein
    app_title: "GRID - AI Prompt Builder",
    app_subtitle: "KI-Prompt-Erstellung",
    app_description: "Produktivitätstool zur Erstellung effektiver Prompts",
    start_button: "Loslegen",
    back: "Zurück",
    next: "Weiter",
    previous: "Vorherige",
    close: "Schließen",
    copy: "Kopieren",
    copied: "Kopiert!",
    edit: "Bearbeiten",
    generate: "Generieren",
    
    // Navigation
    home: "Startseite",
    library: "Bibliothek",
    step1: "Schritt 1: Ziel definieren",
    step2: "Schritt 2: Strukturieren",
    step3: "Schritt 3: Anpassen",
    result: "Generierter Prompt",
    
    // Startseite
    features: {
      fast: "Schnell",
      structured: "Strukturiert",
      efficient: "Effizient"
    },
    
    // Bibliothek
    library_title: "Bibliothek",
    library_subtitle: "Vorlagen und Prompt-Beispiele",
    template_count: "VORLAGEN",
    search_placeholder: "Beispiele suchen...",
    all_categories: "Alle Kategorien",
    categories: {
      business: "Business",
      marketing: "Marketing",
      education: "Bildung",
      technical: "Technisch",
      creative: "Kreativ"
    },
    preview: "Vorschau",
    use: "Verwenden",
    
    // Schritt 1
    objective_label: "Hauptziel",
    objective_placeholder: "Beschreiben Sie genau, was Sie von der KI erwarten...",
    audience_label: "Zielgruppe",
    audience_help: "Halten Sie Strg/Cmd gedrückt, um mehrere Optionen auszuwählen",
    context_label: "Kontext",
    context_placeholder: "Z.B.: Unternehmen: LeadGenPro, Branche: B2B-Software, Zielgruppe: Investoren...",
    instructions_label: "Sequenzielle Anweisungen (optional)",
    instructions_placeholder: "1. Analyse durchführen...\n2. Strategien vorschlagen...\n3. KPIs identifizieren...",
    success_criteria_label: "Erfolgskriterien",
    success_criteria_placeholder: "Z.B.: Vollständige, kohärente, nutzbare Antwort mit 3-5 Punkten pro Abschnitt...",
    
    // Zielvorschläge
    objective_suggestions: {
      write_report: "Bericht schreiben",
      analyze_data: "Daten analysieren",
      create_strategy: "Strategie erstellen",
      solve_problem: "Problem lösen",
      optimize_process: "Prozess optimieren",
      evaluate_options: "Optionen bewerten",
      plan_project: "Projekt planen",
      present_results: "Ergebnisse präsentieren"
    },
    
    // Zielgruppen
    audiences: {
      beginner: "Anfänger",
      intermediate: "Fortgeschritten",
      expert: "Experte",
      management: "Führungsebene",
      general_public: "Allgemeine Öffentlichkeit",
      technical: "Technisches Publikum"
    },
    
    // Schritt 2
    role_label: "Rolle und Persönlichkeit",
    role_placeholder: "Rolle wählen...",
    role_custom_placeholder: "Beschreiben Sie die benutzerdefinierte Rolle...",
    skills_label: "Kernkompetenzen",
    skills_placeholder: "Z.B.: Strategische Analyse, Optimierung, Führung...",
    examples_label: "Input/Output-Beispiele (multishot)",
    examples_placeholder: "Beispiel 1:\nInput: Interne Stärken analysieren\nOutput: Eine Stärke könnte ein erfahrenes Verkaufsteam sein\n\nBeispiel 2:\nInput: Chance identifizieren\nOutput: Wachstum im Gesundheits-SaaS-Markt",
    examples_help: "Geben Sie 2-5 Beispiele im Input → Output-Format an",
    prefill_label: "Antwort-Vorlage (optional)",
    prefill_placeholder: 'Z.B.: {"Strengths": [, "Weaknesses": [',
    prefill_help: "Ausgabeformat, das die KI zu füllen beginnen soll",
    
    // Rollen
    roles: {
      senior_consultant: "Senior Strategieberater",
      data_analyst: "Datenanalyst",
      marketing_expert: "Marketing-Experte",
      senior_developer: "Senior Entwickler",
      technical_writer: "Technischer Redakteur",
      custom: "Benutzerdefinierte Rolle..."
    },
    
    // Fähigkeiten
    skills_suggestions: {
      strategic_analysis: "Strategische Analyse",
      critical_thinking: "Kritisches Denken",
      communication: "Kommunikation",
      creativity: "Kreativität",
      leadership: "Führung",
      innovation: "Innovation",
      problem_solving: "Problemlösung",
      project_management: "Projektmanagement",
      data_analysis: "Datenanalyse",
      business_vision: "Geschäftsvision"
    },
    
    // Schritt 3
    response_length_label: "Antwortlänge",
    creativity_level_label: "Kreativitätslevel",
    output_format_label: "Ausgabeformat",
    reasoning_label: "Begründung (Chain-of-thought)",
    advanced_ai_label: "Erweiterte KI-Einstellungen",
    autonomy_label: "Autonomie (Eigeninitiative)",
    analysis_depth_label: "Analysetiefe",
    verbosity_label: "Ausführlichkeit",
    advanced_options_label: "Erweiterte Optionen",
    
    // Längen
    lengths: {
      short: "Kurz (100-300 Wörter)",
      medium: "Mittel (300-600 Wörter)",
      detailed: "Ausführlich (600+ Wörter)"
    },
    
    // Kreativität
    creativity: {
      factual: "Sachlich (0% Kreativität)",
      moderate: "Moderat (30% Kreativität)",
      creative: "Kreativ (70% Kreativität)"
    },
    
    // Formate
    formats: {
      text: "Freier Text",
      report: "Strukturierter Bericht",
      list: "Stichpunktliste",
      json: "JSON-Format"
    },
    
    // Begründung
    reasoning_types: {
      none: "Keine spezifische Begründung",
      step_by_step: "Schrittweise Begründung",
      justification: "Entscheidungen begründen",
      self_reflection: "Selbstreflexion vor Antwort"
    },
    
    // Autonomie
    autonomy_levels: {
      low: "Niedrig - KI stellt Fragen",
      medium: "Mittel - Ausgewogen",
      high: "Hoch - KI ist proaktiv"
    },
    
    // Tiefe
    analysis_depths: {
      low: "Schnelle Analyse",
      medium: "Standard-Analyse",
      high: "Tiefgehende Analyse"
    },
    
    // Ausführlichkeit
    verbosity_levels: {
      concise: "Prägnant",
      balanced: "Ausgewogen",
      detailed: "Ausführlich"
    },
    
    // Erweiterte Optionen
    allow_unknown: "\"Ich weiß nicht\" erlauben",
    require_sources: "Quellen erforderlich",
    use_xml: "Erweiterte XML-Struktur verwenden",
    
    // KI-Selektor
    ai_selector_choose: "KI wählen",
    ai_selector_custom: "Anpassen...",
    
    // Modal KI-Anpassung
    custom_ai_title: "KI anpassen",
    custom_ai_name_label: "KI-Name",
    custom_ai_name_placeholder: "Z.B.: Meine benutzerdefinierte KI",
    custom_ai_url_label: "KI-URL",
    custom_ai_url_placeholder: "https://meineKI.com/chat",
    custom_ai_url_help: "URL zur Weiterleitung (z.B.: https://chat.openai.com/)",
    custom_ai_cancel: "Abbrechen",
    custom_ai_save: "Speichern",
    
    // Fußzeile
    footer: "© 2025 GRID - AI Prompt Builder (By LetoD)"
  }
};

// Classe pour gérer l'internationalisation
export class I18n {
  constructor() {
    this.currentLanguage = this.loadLanguage();
    this.translations = translations;
  }
  
  // Charger la langue depuis le stockage local
  loadLanguage() {
    try {
      const saved = localStorage.getItem('grid-language');
      if (saved && translations[saved]) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not load language from storage:', e);
    }
    
    // Détecter la langue du navigateur
    const browserLang = navigator.language.slice(0, 2);
    return translations[browserLang] ? browserLang : 'fr';
  }
  
  // Sauvegarder la langue
  saveLanguage(lang) {
    try {
      localStorage.setItem('grid-language', lang);
    } catch (e) {
      console.warn('Could not save language to storage:', e);
    }
  }
  
  // Changer la langue
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      this.saveLanguage(lang);
      this.updateDOM();
      return true;
    }
    return false;
  }
  
  // Obtenir la langue actuelle
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  // Obtenir les langues disponibles
  getAvailableLanguages() {
    return Object.keys(translations);
  }
  
  // Traduire une clé
  t(key, fallback = null) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return value || fallback || key;
  }
  
  // Mettre à jour le DOM
  updateDOM() {
    // Mettre à jour tous les éléments avec l'attribut data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else {
          element.value = translation;
        }
      } else if (element.closest('button') && element.closest('button').querySelector('svg')) {
        // Ne pas écraser le contenu des éléments dans des boutons qui contiennent des SVG
        return;
      } else {
        element.textContent = translation;
      }
    });
    
    // Mettre à jour les placeholders spécifiques
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
    
    // Mettre à jour les titres
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });
    
    // Mettre à jour les options des selects
    this.updateSelectOptions();
  }
  
  // Mettre à jour les options des selects
  updateSelectOptions() {
    // Audience
    const audienceSelect = document.getElementById('audience');
    if (audienceSelect) {
      Array.from(audienceSelect.options).forEach(option => {
        const key = option.getAttribute('data-i18n-option');
        if (key) {
          option.textContent = this.t(key);
        }
      });
    }
    
    // Rôles
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
      Array.from(roleSelect.options).forEach(option => {
        const key = option.getAttribute('data-i18n-option');
        if (key) {
          option.textContent = this.t(key);
        }
      });
    }
    
    // Sélecteur d'IA
    const aiSelect = document.getElementById('ai-selector');
    if (aiSelect) {
      Array.from(aiSelect.options).forEach(option => {
        const key = option.getAttribute('data-i18n-option');
        if (key) {
          option.textContent = this.t(key);
        }
      });
    }
    
    // Autres selects avec des options traduisibles
    const selectsToUpdate = ['longueur', 'creativite', 'format', 'reasoning', 'eagerness', 'reasoning-effort', 'verbosity'];
    selectsToUpdate.forEach(selectId => {
      const select = document.getElementById(selectId);
      if (select) {
        Array.from(select.options).forEach(option => {
          const key = option.getAttribute('data-i18n-option');
          if (key) {
            option.textContent = this.t(key);
          }
        });
      }
    });
  }
}

// Instance globale
export const i18n = new I18n();

// Fonction helper pour la traduction
export const t = (key, fallback = null) => i18n.t(key, fallback);