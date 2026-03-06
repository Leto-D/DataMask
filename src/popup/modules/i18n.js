// i18n.js - Systeme de traduction FR/EN/DE

export const translations = {
  fr: {
    app_title: "DataMask - AI Data Privacy",
    app_subtitle: "Creation de Prompts & IA",
    app_description: "Outil de productivite pour creer des prompts efficaces",
    start_button: "Commencer",
    library_button: "Bibliotheque",
    library: "Bibliotheque",
    library_subtitle: "Templates et exemples de prompts",
    step1: "Etape 1: Definir l'objectif",
    step2: "Etape 2: Structurer",
    step3: "Etape 3: Personnaliser",
    library_title: "Bibliotheque",
    result_title: "Prompt genere",

    // Etape 1
    objective_label: "Objectif principal",
    objective_placeholder: "Decrivez precisement ce que vous attendez de l'IA...",
    audience_label: "Audience cible",
    audience_help: "Maintenez Ctrl/Cmd pour selectionner plusieurs options",

    // Etape 2
    context_label: "Contexte",
    context_placeholder: "Ex: Entreprise: LeadGenPro, Secteur: Logiciels B2B, Public: investisseurs...",
    instructions_label: "Instructions sequentielles (optionnel)",
    instructions_placeholder: "1. Effectuer une analyse...\n2. Proposer des strategies...\n3. Identifier les KPIs...",
    success_criteria_label: "Criteres de succes",
    success_criteria_placeholder: "Ex: Reponse complete, coherente, utilisable, avec 3-5 points par section...",

    // Etape 3
    role_label: "Role et personnalite",
    role_placeholder: "Choisir un role...",
    role_custom_placeholder: "Decrivez le role personnalise...",
    skills_label: "Competences cles",
    skills_placeholder: "Ex: Analyse strategique, Optimisation, Leadership...",
    examples_label: "Exemples Input/Output (multishot)",
    examples_placeholder: "Exemple 1:\nInput: [votre exemple]\nOutput: [reponse attendue]\n\nExemple 2:\n...",
    prefill_label: "Preremplissage de la reponse (optionnel)",
    prefill_placeholder: 'Ex: {"Strengths": [, "Weaknesses": [',
    response_length_label: "Longueur de reponse",
    creativity_level_label: "Niveau de creativite",
    output_format_label: "Format de sortie",
    reasoning_label: "Raisonnement (Chain-of-thought)",
    advanced_ai_label: "Parametres IA avances",
    autonomy_label: "Autonomie (Eagerness)",
    analysis_depth_label: "Profondeur d'analyse",
    verbosity_label: "Verbosite",
    advanced_options_label: "Options avancees",

    // Suggestions
    "suggestions.write_report": "Rediger un rapport",
    "suggestions.analyze_data": "Analyser des donnees",
    "suggestions.create_strategy": "Creer une strategie",
    "suggestions.solve_problem": "Resoudre un probleme",
    "suggestions.optimize_process": "Optimiser un processus",
    "suggestions.evaluate_options": "Evaluer des options",
    "suggestions.plan_project": "Planifier un projet",
    "suggestions.present_results": "Presenter des resultats",

    "suggestions.strategic_analysis": "Analyse strategique",
    "suggestions.critical_thinking": "Pensee critique",
    "suggestions.communication": "Communication",
    "suggestions.creativity": "Creativite",
    "suggestions.leadership": "Leadership",
    "suggestions.innovation": "Innovation",
    "suggestions.problem_solving": "Resolution de problemes",
    "suggestions.project_management": "Gestion de projet",
    "suggestions.data_analysis": "Analyse de donnees",
    "suggestions.business_vision": "Vision business",

    // Roles
    "roles.senior_consultant": "Consultant Senior en Strategie",
    "roles.data_analyst": "Analyste de Donnees",
    "roles.marketing_expert": "Expert Marketing",
    "roles.senior_developer": "Developpeur Senior",
    "roles.technical_writer": "Redacteur Technique",
    "roles.custom": "Role personnalise...",
    "roles.expert": "Expert dans le domaine",
    not_specified: "Non specifie",

    copy_button: "Copier",
    back_button: "Retour",
    next_button: "Suivant",
    generate_button: "Generer",
    footer: "\u00A9 2026 DataMask (By LetoD)",
    "features.fast": "Rapide",
    "features.structured": "Structure",
    "features.efficient": "Efficace",
    "audiences.beginner": "Debutant",
    "audiences.intermediate": "Intermediaire",
    "audiences.expert": "Expert",
    "audiences.management": "Equipe de direction",
    "audiences.general_public": "Grand public",
    "audiences.technical": "Public technique",

    examples_help: "Fournissez 2-5 exemples avec format Input -> Output",
    prefill_help: "Format de sortie que l'IA doit commencer a remplir",
    allow_unknown: "Autoriser \"Je ne sais pas\"",
    require_sources: "Exiger des sources",
    use_xml: "Utiliser structure XML avancee",

    "lengths.short": "Courte (100-300 mots)",
    "lengths.medium": "Moyenne (300-600 mots)",
    "lengths.detailed": "Detaillee (600+ mots)",

    "formats.text": "Texte libre",
    "formats.report": "Rapport structure",
    "formats.list": "Liste a puces",
    "formats.json": "Format JSON",
    "formats.table": "Tableau",

    "creativity.factual": "Factuelle (0% creativite)",
    "creativity.moderate": "Moderee (30% creativite)",
    "creativity.creative": "Creative (70% creativite)",

    "reasoning_types.none": "Aucun raisonnement specifique",
    "reasoning_types.step_by_step": "Raisonnement etape par etape",
    "reasoning_types.justification": "Justifier les choix",

    "autonomy_levels.low": "Basse - L'IA pose des questions",
    "autonomy_levels.medium": "Moyenne - Equilibree",
    "autonomy_levels.high": "Haute - L'IA est proactive",

    "analysis_depths.low": "Analyse superficielle",
    "analysis_depths.medium": "Analyse standard",
    "analysis_depths.high": "Analyse approfondie",

    "verbosity_levels.concise": "Concise",
    "verbosity_levels.balanced": "Equilibree",
    "verbosity_levels.detailed": "Detaillee",

    // Builder sections
    builder_title: "Createur de Prompt",
    section_identity: "Identite et Role",
    section_task: "Tache et Objectif",
    section_context: "Contexte",
    section_constraints: "Contraintes",
    section_output: "Format de sortie",
    section_parameters: "Parametres IA",
    live_preview_title: "Apercu temps reel",

    // New fields
    tone_label: "Ton et personnalite",
    tone_default: "Par defaut",
    tone_professional: "Professionnel",
    tone_friendly: "Amical",
    tone_academic: "Academique",
    tone_direct: "Direct",
    data_label: "Donnees pertinentes",
    data_placeholder: "Collez ici les donnees, chiffres ou informations utiles...",
    constraints_label: "Contraintes (formulees positivement)",
    constraints_placeholder: "Ex: Utiliser uniquement des sources verifiables, Repondre en moins de 500 mots...",
    uncertainty_label: "Gestion de l'incertitude",
    uncertainty_none: "Aucune consigne",
    uncertainty_say_so: "Dire \"je ne suis pas sur\"",
    uncertainty_ask: "Poser une question",
    uncertainty_confidence: "Indiquer le niveau de confiance",

    // AI selector & modal
    ai_selector_choose: "Choisir IA",
    ai_selector_custom: "Personnaliser...",
    custom_ai_title: "Personnaliser une IA",
    custom_ai_name_label: "Nom de l'IA",
    custom_ai_name_placeholder: "Ex: Mon IA personnalisee",
    custom_ai_url_label: "URL de l'IA",
    custom_ai_url_placeholder: "https://monai.com/chat",
    custom_ai_url_help: "URL vers laquelle rediriger (ex: https://chat.openai.com/)",
    custom_ai_cancel: "Annuler",
    custom_ai_save: "Sauvegarder",

    // PasteProtect
    paste_protect_label: "PasteProtect",
    paste_protect_detected: "{count} donnee(s) sensible(s) pseudonymisee(s)",
    paste_protect_art9: "{count} donnee(s) sensible(s) Art.9 RGPD detectee(s)",
    paste_protect_error: "PasteProtect: erreur, collage bloque",
    pp_correspondences: "Correspondances",
    pp_pseudonym: "Pseudonyme",
    pp_category: "Categorie",
    pp_rgpd: "RGPD",
    pp_reset: "Reinitialiser",

    // Score
    score_quality: "Qualite du prompt",
    score_words: "mots",
    score_tip_role: "+ Ajoutez un role",
    score_tip_competences: "+ Precisez les competences",
    score_tip_objective: "+ Definissez l'objectif",
    score_tip_objective_detail: "+ Detaillez l'objectif",
    score_tip_context: "+ Ajoutez du contexte",
    score_tip_context_detail: "+ Enrichissez le contexte",
    score_tip_constraints: "+ Ajoutez des contraintes",
    score_tip_format: "+ Choisissez un format",

    // Dashboard
    dash_title: "Tableau de bord",
    dash_subtitle: "Journal de conformite et statistiques",
    dash_protected: "Protegees",
    dash_blocked: "Bloquees",
    dash_last7days: "7 derniers jours",
    dash_by_site: "Par site IA",
    dash_by_category: "Par categorie",
    dash_journal: "Journal",
    dash_date: "Date",
    dash_no_data: "Aucune donnee",
    dash_purge: "Purger",
    dash_purge_confirm: "Supprimer tout le journal et les statistiques ?",

    // Settings
    settings_title: "Parametres",
    settings_subtitle: "Configurer l'anonymisation et PasteProtect",
    settings_pp_title: "PasteProtect",
    settings_pp_enabled: "Activer PasteProtect",
    settings_pp_enabled_desc: "Pseudonymise les donnees au collage",
    settings_categories_title: "Categories de detection",
    settings_cat_contact: "Contact",
    settings_cat_contact_desc: "Emails, telephones, reseaux sociaux",
    settings_cat_financial: "Finance",
    settings_cat_financial_desc: "IBAN, cartes bancaires, TVA",
    settings_cat_identity: "Identite",
    settings_cat_identity_desc: "Noms, securite sociale, dates de naissance",
    settings_cat_technical: "Technique",
    settings_cat_technical_desc: "Adresses IP, cles API, GPS",
    settings_blacklist_title: "Blocage (blacklist)",
    settings_blacklist_desc: "Ces categories bloquent le collage (le texte n'est PAS colle)",
    settings_bl_secu: "Securite sociale",
    settings_bl_card: "Cartes bancaires",
    settings_bl_apikey: "Cles API",
    settings_bl_iban: "IBAN",
    settings_bl_privatekey: "Cles privees",
    settings_confidence_title: "Sensibilite de detection",
    settings_confidence_label: "Seuil de confiance",
    settings_confidence_low: "Basse (plus de detections)",
    settings_confidence_medium: "Moyenne (recommande)",
    settings_confidence_high: "Haute (moins de faux positifs)",
    settings_retention_title: "Conservation du journal",
    settings_retention_label: "Duree de retention",

    // Button titles
    btn_back: "Retour",
    btn_generate: "Generer le prompt",
    btn_edit: "Modifier le prompt",
    btn_copy: "Copier le prompt",
    btn_send_ai: "Envoyer vers l'IA",
    send_ai_copied: "Copie ! Collez avec Ctrl+V",

    // Validation messages
    valid_objective: "Minimum 20 caracteres pour decrire votre objectif",
    valid_context: "Minimum 10 caracteres pour le contexte",
    valid_min5: "Minimum 5 caracteres",
    valid_criteria: "Decrivez vos criteres de succes (min. 10 caracteres)",
    valid_role: "Decrivez le role personnalise (min. 10 caracteres)",
    valid_skills: "Minimum 5 caracteres pour les competences",
    valid_examples: "Ajoutez des exemples detailles (min. 20 caracteres)",
    valid_chars: "caracteres",

    // Prompt labels (used in generated prompt)
    prompt_you_are: "Tu es",
    prompt_with_expertise: "avec une expertise en",
    prompt_tone: "Ton",
    prompt_instructions: "Instructions",
    prompt_audience: "Audience",
    prompt_data: "Donnees",
    prompt_uncertainty: "Incertitude",
    prompt_sources_required: "Sources : requises",
    prompt_criteria: "Criteres",
    prompt_format: "Format",
    prompt_length: "Longueur",
    prompt_prefill: "Preremplissage",
    prompt_creativity: "Creativite",
    prompt_reasoning: "Raisonnement",
    prompt_depth: "Profondeur",
    prompt_autonomy: "Autonomie",
    prompt_verbosity: "Verbosite",
    prompt_md_task: "TACHE",
    prompt_md_context: "CONTEXTE",
    prompt_md_examples: "EXEMPLES",
    prompt_md_constraints: "CONTRAINTES",
    prompt_md_output: "FORMAT DE SORTIE",
    prompt_md_parameters: "PARAMETRES",

    // Welcome
    welcome_slide1_title: "PasteProtect",
    welcome_slide1_desc: "Vos donnees sensibles sont automatiquement pseudonymisees quand vous collez dans ChatGPT, Claude et 4 autres sites IA.",
    welcome_slide2_title: "Prompt Builder ameliore",
    welcome_slide2_desc: "6 sections guidees, adaptation automatique a chaque IA, score de qualite en temps reel.",
    welcome_slide3_title: "Dashboard conformite",
    welcome_slide3_desc: "Journal chiffre, statistiques par site, export pour vos audits RGPD. 100% local.",
    welcome_skip: "Passer",
    welcome_next: "Suivant",

    // v2.1 — Tab bar
    tab_home: "Accueil",
    tab_library: "Bibliotheque",
    tab_result: "Resultat",
    tab_settings: "Reglages",

    // v2.1 — Home view
    home_status_active: "Protection active",
    home_status_inactive: "Inactif",
    home_stat_protected: "protegees",
    home_stat_month: "ce mois",
    home_stat_today: "aujourd'hui",
    home_create_prompt: "Creer un prompt",
    home_quick_recent: "Dernier prompt",
    home_quick_empty: "Aucun recent",
    home_quick_template: "Template rapide",
    home_pp_active: "Actif sur ce site",
    home_pp_inactive: "Inactif sur ce site",

    // v2.1 — Library
    library_search: "Chercher un template...",
    filter_all: "Tous",
    filter_hr: "RH",
    filter_legal: "Juridique",
    filter_finance: "Finance",
    filter_writing: "Redaction",
    filter_tech: "Technique",

    // v2.1 — Result
    result_new: "Nouveau",
    result_title: "Prompt genere",
    score_quality: "Qualite",

    // v2.1 — Settings extras
    settings_language: "Langue",
    settings_appearance: "Apparence",
    settings_dark_mode: "Mode sombre",
    settings_plan: "Plan",
    settings_plan_free_desc: "20 protections/jour, 3 sites + 2 personnalises",
    settings_upgrade: "Upgrade",
    settings_custom_sites: "Sites proteges",
    settings_included_sites: "Sites inclus",
    settings_custom_sites_label: "Sites personnalises",
    settings_custom_site_placeholder: "ex: mistral.ai",
    settings_custom_site_add: "Ajouter",
    settings_custom_sites_count: "sites personnalises",
    settings_custom_sites_count_pro: "sites (illimite en Pro)",
    settings_ai_default: "IA par defaut",
    settings_ai_label: "Modele IA",
    settings_data_title: "Donnees",
    settings_about: "A propos",
    dash_total: "Pseudonymisations totales",
    dash_export_json: "Export JSON",
    dash_export_csv: "Export CSV"
  },
  en: {
    app_title: "DataMask - AI Data Privacy",
    app_subtitle: "Prompt Creation & AI",
    app_description: "Productivity tool for creating effective prompts",
    start_button: "Start",
    library_button: "Library",
    library: "Library",
    library_subtitle: "Templates and prompt examples",
    step1: "Step 1: Define objective",
    step2: "Step 2: Structure",
    step3: "Step 3: Personalize",
    library_title: "Library",
    result_title: "Generated prompt",

    objective_label: "Main objective",
    objective_placeholder: "Describe precisely what you expect from the AI...",
    audience_label: "Target audience",
    audience_help: "Hold Ctrl/Cmd to select multiple options",

    context_label: "Context",
    context_placeholder: "Ex: Company: LeadGenPro, Sector: B2B Software, Audience: investors...",
    instructions_label: "Sequential instructions (optional)",
    instructions_placeholder: "1. Perform an analysis...\n2. Propose strategies...\n3. Identify KPIs...",
    success_criteria_label: "Success criteria",
    success_criteria_placeholder: "Ex: Complete, coherent, usable response, with 3-5 points per section...",

    role_label: "Role and personality",
    role_placeholder: "Choose a role...",
    role_custom_placeholder: "Describe the custom role...",
    skills_label: "Key skills",
    skills_placeholder: "Ex: Strategic analysis, Optimization, Leadership...",
    examples_label: "Input/Output examples (multishot)",
    examples_placeholder: "Example 1:\nInput: [your example]\nOutput: [expected response]\n\nExample 2:\n...",
    prefill_label: "Response prefill (optional)",
    prefill_placeholder: 'Ex: {"Strengths": [, "Weaknesses": [',
    response_length_label: "Response length",
    creativity_level_label: "Creativity level",
    output_format_label: "Output format",
    reasoning_label: "Reasoning (Chain-of-thought)",
    advanced_ai_label: "Advanced AI parameters",
    autonomy_label: "Autonomy (Eagerness)",
    analysis_depth_label: "Analysis depth",
    verbosity_label: "Verbosity",
    advanced_options_label: "Advanced options",

    "suggestions.write_report": "Write a report",
    "suggestions.analyze_data": "Analyze data",
    "suggestions.create_strategy": "Create a strategy",
    "suggestions.solve_problem": "Solve a problem",
    "suggestions.optimize_process": "Optimize a process",
    "suggestions.evaluate_options": "Evaluate options",
    "suggestions.plan_project": "Plan a project",
    "suggestions.present_results": "Present results",

    "suggestions.strategic_analysis": "Strategic analysis",
    "suggestions.critical_thinking": "Critical thinking",
    "suggestions.communication": "Communication",
    "suggestions.creativity": "Creativity",
    "suggestions.leadership": "Leadership",
    "suggestions.innovation": "Innovation",
    "suggestions.problem_solving": "Problem solving",
    "suggestions.project_management": "Project management",
    "suggestions.data_analysis": "Data analysis",
    "suggestions.business_vision": "Business vision",

    "roles.senior_consultant": "Senior Strategy Consultant",
    "roles.data_analyst": "Data Analyst",
    "roles.marketing_expert": "Marketing Expert",
    "roles.senior_developer": "Senior Developer",
    "roles.technical_writer": "Technical Writer",
    "roles.custom": "Custom role...",
    "roles.expert": "Domain Expert",
    not_specified: "Not specified",

    copy_button: "Copy",
    back_button: "Back",
    next_button: "Next",
    generate_button: "Generate",
    footer: "\u00A9 2026 DataMask (By LetoD)",
    "features.fast": "Fast",
    "features.structured": "Structured",
    "features.efficient": "Efficient",
    "audiences.beginner": "Beginner",
    "audiences.intermediate": "Intermediate",
    "audiences.expert": "Expert",
    "audiences.management": "Management team",
    "audiences.general_public": "General public",
    "audiences.technical": "Technical audience",

    examples_help: "Provide 2-5 examples with Input -> Output format",
    prefill_help: "Output format that AI should start filling",
    allow_unknown: "Allow \"I don't know\"",
    require_sources: "Require sources",
    use_xml: "Use advanced XML structure",

    "lengths.short": "Short (100-300 words)",
    "lengths.medium": "Medium (300-600 words)",
    "lengths.detailed": "Detailed (600+ words)",

    "formats.text": "Free text",
    "formats.report": "Structured report",
    "formats.list": "Bullet list",
    "formats.json": "JSON format",
    "formats.table": "Table",

    "creativity.factual": "Factual (0% creativity)",
    "creativity.moderate": "Moderate (30% creativity)",
    "creativity.creative": "Creative (70% creativity)",

    "reasoning_types.none": "No specific reasoning",
    "reasoning_types.step_by_step": "Step-by-step reasoning",
    "reasoning_types.justification": "Justify choices",

    "autonomy_levels.low": "Low - AI asks questions",
    "autonomy_levels.medium": "Medium - Balanced",
    "autonomy_levels.high": "High - AI is proactive",

    "analysis_depths.low": "Superficial analysis",
    "analysis_depths.medium": "Standard analysis",
    "analysis_depths.high": "Deep analysis",

    "verbosity_levels.concise": "Concise",
    "verbosity_levels.balanced": "Balanced",
    "verbosity_levels.detailed": "Detailed",

    builder_title: "Prompt Builder",
    section_identity: "Identity & Role",
    section_task: "Task & Objective",
    section_context: "Context",
    section_constraints: "Constraints",
    section_output: "Output Format",
    section_parameters: "AI Parameters",
    live_preview_title: "Live Preview",
    tone_label: "Tone & personality",
    tone_default: "Default",
    tone_professional: "Professional",
    tone_friendly: "Friendly",
    tone_academic: "Academic",
    tone_direct: "Direct",
    data_label: "Relevant data",
    data_placeholder: "Paste relevant data, figures or information here...",
    constraints_label: "Constraints (positively worded)",
    constraints_placeholder: "Ex: Use only verifiable sources, Respond in under 500 words...",
    uncertainty_label: "Uncertainty handling",
    uncertainty_none: "No instruction",
    uncertainty_say_so: "Say \"I'm not sure\"",
    uncertainty_ask: "Ask a question",
    uncertainty_confidence: "Indicate confidence level",

    ai_selector_choose: "Choose AI",
    ai_selector_custom: "Customize...",
    custom_ai_title: "Customize an AI",
    custom_ai_name_label: "AI Name",
    custom_ai_name_placeholder: "Ex: My custom AI",
    custom_ai_url_label: "AI URL",
    custom_ai_url_placeholder: "https://myai.com/chat",
    custom_ai_url_help: "URL to redirect to (ex: https://chat.openai.com/)",
    custom_ai_cancel: "Cancel",
    custom_ai_save: "Save",

    // PasteProtect
    paste_protect_label: "PasteProtect",
    paste_protect_detected: "{count} sensitive data item(s) pseudonymized",
    paste_protect_art9: "{count} sensitive Art.9 GDPR data item(s) detected",
    paste_protect_error: "PasteProtect: error, paste blocked",
    pp_correspondences: "Correspondences",
    pp_pseudonym: "Pseudonym",
    pp_category: "Category",
    pp_rgpd: "GDPR",
    pp_reset: "Reset",

    // Score
    score_quality: "Prompt quality",
    score_words: "words",
    score_tip_role: "+ Add a role",
    score_tip_competences: "+ Specify expertise",
    score_tip_objective: "+ Define the objective",
    score_tip_objective_detail: "+ Detail the objective",
    score_tip_context: "+ Add context",
    score_tip_context_detail: "+ Enrich the context",
    score_tip_constraints: "+ Add constraints",
    score_tip_format: "+ Choose a format",

    // Dashboard
    dash_title: "Dashboard",
    dash_subtitle: "Compliance journal and statistics",
    dash_protected: "Protected",
    dash_blocked: "Blocked",
    dash_last7days: "Last 7 days",
    dash_by_site: "By AI site",
    dash_by_category: "By category",
    dash_journal: "Journal",
    dash_date: "Date",
    dash_no_data: "No data",
    dash_purge: "Purge",
    dash_purge_confirm: "Delete all journal and statistics?",

    // Settings
    settings_title: "Settings",
    settings_subtitle: "Configure anonymization and PasteProtect",
    settings_pp_title: "PasteProtect",
    settings_pp_enabled: "Enable PasteProtect",
    settings_pp_enabled_desc: "Pseudonymizes data when pasting",
    settings_categories_title: "Detection categories",
    settings_cat_contact: "Contact",
    settings_cat_contact_desc: "Emails, phone numbers, social handles",
    settings_cat_financial: "Financial",
    settings_cat_financial_desc: "IBAN, credit cards, VAT numbers",
    settings_cat_identity: "Identity",
    settings_cat_identity_desc: "Names, social security, dates of birth",
    settings_cat_technical: "Technical",
    settings_cat_technical_desc: "IP addresses, API keys, GPS",
    settings_blacklist_title: "Blocking (blacklist)",
    settings_blacklist_desc: "These categories block pasting entirely (text is NOT pasted)",
    settings_bl_secu: "Social security",
    settings_bl_card: "Credit cards",
    settings_bl_apikey: "API keys",
    settings_bl_iban: "IBAN",
    settings_bl_privatekey: "Private keys",
    settings_confidence_title: "Detection sensitivity",
    settings_confidence_label: "Confidence threshold",
    settings_confidence_low: "Low (more detections)",
    settings_confidence_medium: "Medium (recommended)",
    settings_confidence_high: "High (fewer false positives)",
    settings_retention_title: "Journal retention",
    settings_retention_label: "Retention period",

    // Button titles
    btn_back: "Back",
    btn_generate: "Generate prompt",
    btn_edit: "Edit prompt",
    btn_copy: "Copy prompt",
    btn_send_ai: "Send to AI",
    send_ai_copied: "Copied! Paste with Ctrl+V",

    // Validation messages
    valid_objective: "Minimum 20 characters to describe your objective",
    valid_context: "Minimum 10 characters for context",
    valid_min5: "Minimum 5 characters",
    valid_criteria: "Describe your success criteria (min. 10 characters)",
    valid_role: "Describe the custom role (min. 10 characters)",
    valid_skills: "Minimum 5 characters for skills",
    valid_examples: "Add detailed examples (min. 20 characters)",
    valid_chars: "characters",

    // Prompt labels
    prompt_you_are: "You are",
    prompt_with_expertise: "with expertise in",
    prompt_tone: "Tone",
    prompt_instructions: "Instructions",
    prompt_audience: "Audience",
    prompt_data: "Data",
    prompt_uncertainty: "Uncertainty",
    prompt_sources_required: "Sources: required",
    prompt_criteria: "Criteria",
    prompt_format: "Format",
    prompt_length: "Length",
    prompt_prefill: "Prefill",
    prompt_creativity: "Creativity",
    prompt_reasoning: "Reasoning",
    prompt_depth: "Depth",
    prompt_autonomy: "Autonomy",
    prompt_verbosity: "Verbosity",
    prompt_md_task: "TASK",
    prompt_md_context: "CONTEXT",
    prompt_md_examples: "EXAMPLES",
    prompt_md_constraints: "CONSTRAINTS",
    prompt_md_output: "OUTPUT FORMAT",
    prompt_md_parameters: "PARAMETERS",

    // Welcome
    welcome_slide1_title: "PasteProtect",
    welcome_slide1_desc: "Your sensitive data is automatically pseudonymized when you paste into ChatGPT, Claude and 4 other AI sites.",
    welcome_slide2_title: "Improved Prompt Builder",
    welcome_slide2_desc: "6 guided sections, automatic adaptation to each AI, real-time quality score.",
    welcome_slide3_title: "Compliance Dashboard",
    welcome_slide3_desc: "Encrypted journal, statistics by site, export for your GDPR audits. 100% local.",
    welcome_skip: "Skip",
    welcome_next: "Next",

    // v2.1 — Tab bar
    tab_home: "Home",
    tab_library: "Library",
    tab_result: "Result",
    tab_settings: "Settings",

    // v2.1 — Home view
    home_status_active: "Protection active",
    home_status_inactive: "Inactive",
    home_stat_protected: "protected",
    home_stat_month: "this month",
    home_stat_today: "today",
    home_create_prompt: "Create a prompt",
    home_quick_recent: "Last prompt",
    home_quick_empty: "None recent",
    home_quick_template: "Quick template",
    home_pp_active: "Active on this site",
    home_pp_inactive: "Inactive on this site",

    // v2.1 — Library
    library_search: "Search templates...",
    filter_all: "All",
    filter_hr: "HR",
    filter_legal: "Legal",
    filter_finance: "Finance",
    filter_writing: "Writing",
    filter_tech: "Technical",

    // v2.1 — Result
    result_new: "New",

    // v2.1 — Settings extras
    settings_language: "Language",
    settings_appearance: "Appearance",
    settings_dark_mode: "Dark mode",
    settings_plan: "Plan",
    settings_plan_free_desc: "20 protections/day, 3 sites + 2 custom",
    settings_upgrade: "Upgrade",
    settings_custom_sites: "Protected sites",
    settings_included_sites: "Included sites",
    settings_custom_sites_label: "Custom sites",
    settings_custom_site_placeholder: "e.g. mistral.ai",
    settings_custom_site_add: "Add",
    settings_custom_sites_count: "custom sites",
    settings_custom_sites_count_pro: "sites (unlimited with Pro)",
    settings_ai_default: "Default AI",
    settings_ai_label: "AI Model",
    settings_data_title: "Data",
    settings_about: "About",
    dash_total: "Total pseudonymizations",
    dash_export_json: "Export JSON",
    dash_export_csv: "Export CSV"
  },
  de: {
    app_title: "DataMask - AI Data Privacy",
    app_subtitle: "Prompt-Erstellung & KI",
    app_description: "Produktivitaetstool fuer die Erstellung effektiver Prompts",
    start_button: "Starten",
    library_button: "Bibliothek",
    library: "Bibliothek",
    library_subtitle: "Vorlagen und Prompt-Beispiele",
    step1: "Schritt 1: Ziel definieren",
    step2: "Schritt 2: Strukturieren",
    step3: "Schritt 3: Personalisieren",
    library_title: "Bibliothek",
    result_title: "Generierter Prompt",

    objective_label: "Hauptziel",
    objective_placeholder: "Beschreiben Sie genau, was Sie von der KI erwarten...",
    audience_label: "Zielgruppe",
    audience_help: "Halten Sie Strg/Cmd gedrueckt, um mehrere Optionen auszuwaehlen",

    context_label: "Kontext",
    context_placeholder: "Bsp: Unternehmen: LeadGenPro, Sektor: B2B Software, Publikum: Investoren...",
    instructions_label: "Sequentielle Anweisungen (optional)",
    instructions_placeholder: "1. Eine Analyse durchfuehren...\n2. Strategien vorschlagen...\n3. KPIs identifizieren...",
    success_criteria_label: "Erfolgskriterien",
    success_criteria_placeholder: "Bsp: Vollstaendige, kohaerente, nutzbare Antwort mit 3-5 Punkten pro Abschnitt...",

    role_label: "Rolle und Persoenlichkeit",
    role_placeholder: "Rolle waehlen...",
    role_custom_placeholder: "Beschreiben Sie die benutzerdefinierte Rolle...",
    skills_label: "Kernkompetenzen",
    skills_placeholder: "Bsp: Strategische Analyse, Optimierung, Fuehrung...",
    examples_label: "Input/Output-Beispiele (multishot)",
    examples_placeholder: "Beispiel 1:\nInput: [Ihr Beispiel]\nOutput: [erwartete Antwort]\n\nBeispiel 2:\n...",
    prefill_label: "Antwort-Vorlage (optional)",
    prefill_placeholder: 'Bsp: {"Strengths": [, "Weaknesses": [',
    response_length_label: "Antwortlaenge",
    creativity_level_label: "Kreativitaetsniveau",
    output_format_label: "Ausgabeformat",
    reasoning_label: "Argumentation (Chain-of-thought)",
    advanced_ai_label: "Erweiterte KI-Parameter",
    autonomy_label: "Autonomie (Eagerness)",
    analysis_depth_label: "Analysetiefe",
    verbosity_label: "Ausfuehrlichkeit",
    advanced_options_label: "Erweiterte Optionen",

    "suggestions.write_report": "Einen Bericht schreiben",
    "suggestions.analyze_data": "Daten analysieren",
    "suggestions.create_strategy": "Eine Strategie erstellen",
    "suggestions.solve_problem": "Ein Problem loesen",
    "suggestions.optimize_process": "Einen Prozess optimieren",
    "suggestions.evaluate_options": "Optionen bewerten",
    "suggestions.plan_project": "Ein Projekt planen",
    "suggestions.present_results": "Ergebnisse praesentieren",

    "suggestions.strategic_analysis": "Strategische Analyse",
    "suggestions.critical_thinking": "Kritisches Denken",
    "suggestions.communication": "Kommunikation",
    "suggestions.creativity": "Kreativitaet",
    "suggestions.leadership": "Fuehrung",
    "suggestions.innovation": "Innovation",
    "suggestions.problem_solving": "Problemloesung",
    "suggestions.project_management": "Projektmanagement",
    "suggestions.data_analysis": "Datenanalyse",
    "suggestions.business_vision": "Geschaeftsvision",

    "roles.senior_consultant": "Senior Strategieberater",
    "roles.data_analyst": "Datenanalyst",
    "roles.marketing_expert": "Marketing-Experte",
    "roles.senior_developer": "Senior Entwickler",
    "roles.technical_writer": "Technischer Redakteur",
    "roles.custom": "Benutzerdefinierte Rolle...",
    "roles.expert": "Experte im Bereich",
    not_specified: "Nicht spezifiziert",

    copy_button: "Kopieren",
    back_button: "Zurueck",
    next_button: "Weiter",
    generate_button: "Generieren",
    footer: "\u00A9 2026 DataMask (By LetoD)",
    "features.fast": "Schnell",
    "features.structured": "Strukturiert",
    "features.efficient": "Effizient",
    "audiences.beginner": "Anfaenger",
    "audiences.intermediate": "Fortgeschritten",
    "audiences.expert": "Experte",
    "audiences.management": "Fuehrungsteam",
    "audiences.general_public": "Allgemeine Oeffentlichkeit",
    "audiences.technical": "Technisches Publikum",

    examples_help: "Geben Sie 2-5 Beispiele im Input -> Output Format an",
    prefill_help: "Ausgabeformat, das die KI zu fuellen beginnen soll",
    allow_unknown: "\"Ich weiss nicht\" erlauben",
    require_sources: "Quellen erforderlich",
    use_xml: "Erweiterte XML-Struktur verwenden",

    "lengths.short": "Kurz (100-300 Woerter)",
    "lengths.medium": "Mittel (300-600 Woerter)",
    "lengths.detailed": "Detailliert (600+ Woerter)",

    "formats.text": "Freier Text",
    "formats.report": "Strukturierter Bericht",
    "formats.list": "Aufzaehlung",
    "formats.json": "JSON-Format",
    "formats.table": "Tabelle",

    "creativity.factual": "Sachlich (0% Kreativitaet)",
    "creativity.moderate": "Moderat (30% Kreativitaet)",
    "creativity.creative": "Kreativ (70% Kreativitaet)",

    "reasoning_types.none": "Keine spezifische Argumentation",
    "reasoning_types.step_by_step": "Schritt-fuer-Schritt Argumentation",
    "reasoning_types.justification": "Entscheidungen begruenden",

    "autonomy_levels.low": "Niedrig - KI stellt Fragen",
    "autonomy_levels.medium": "Mittel - Ausgewogen",
    "autonomy_levels.high": "Hoch - KI ist proaktiv",

    "analysis_depths.low": "Oberflaechliche Analyse",
    "analysis_depths.medium": "Standard-Analyse",
    "analysis_depths.high": "Tiefgehende Analyse",

    "verbosity_levels.concise": "Praegnant",
    "verbosity_levels.balanced": "Ausgewogen",
    "verbosity_levels.detailed": "Ausfuehrlich",

    builder_title: "Prompt-Ersteller",
    section_identity: "Identitaet & Rolle",
    section_task: "Aufgabe & Ziel",
    section_context: "Kontext",
    section_constraints: "Einschraenkungen",
    section_output: "Ausgabeformat",
    section_parameters: "KI-Parameter",
    live_preview_title: "Live-Vorschau",
    tone_label: "Ton & Persoenlichkeit",
    tone_default: "Standard",
    tone_professional: "Professionell",
    tone_friendly: "Freundlich",
    tone_academic: "Akademisch",
    tone_direct: "Direkt",
    data_label: "Relevante Daten",
    data_placeholder: "Fuegen Sie hier relevante Daten, Zahlen oder Informationen ein...",
    constraints_label: "Einschraenkungen (positiv formuliert)",
    constraints_placeholder: "Bsp: Nur ueberpruefbare Quellen verwenden, In unter 500 Woertern antworten...",
    uncertainty_label: "Umgang mit Unsicherheit",
    uncertainty_none: "Keine Anweisung",
    uncertainty_say_so: "\"Ich bin nicht sicher\" sagen",
    uncertainty_ask: "Eine Frage stellen",
    uncertainty_confidence: "Konfidenzniveau angeben",

    ai_selector_choose: "KI waehlen",
    ai_selector_custom: "Anpassen...",
    custom_ai_title: "KI anpassen",
    custom_ai_name_label: "KI-Name",
    custom_ai_name_placeholder: "Z.B.: Meine benutzerdefinierte KI",
    custom_ai_url_label: "KI-URL",
    custom_ai_url_placeholder: "https://meineKI.com/chat",
    custom_ai_url_help: "URL zur Weiterleitung (z.B.: https://chat.openai.com/)",
    custom_ai_cancel: "Abbrechen",
    custom_ai_save: "Speichern",

    // PasteProtect
    paste_protect_label: "PasteProtect",
    paste_protect_detected: "{count} sensible Daten pseudonymisiert",
    paste_protect_art9: "{count} sensible Art.9-DSGVO-Daten erkannt",
    paste_protect_error: "PasteProtect: Fehler, Einfuegen blockiert",
    pp_correspondences: "Zuordnungen",
    pp_pseudonym: "Pseudonym",
    pp_category: "Kategorie",
    pp_rgpd: "DSGVO",
    pp_reset: "Zuruecksetzen",

    // Score
    score_quality: "Prompt-Qualitaet",
    score_words: "Woerter",
    score_tip_role: "+ Rolle hinzufuegen",
    score_tip_competences: "+ Kompetenzen angeben",
    score_tip_objective: "+ Ziel definieren",
    score_tip_objective_detail: "+ Ziel detaillieren",
    score_tip_context: "+ Kontext hinzufuegen",
    score_tip_context_detail: "+ Kontext bereichern",
    score_tip_constraints: "+ Einschraenkungen hinzufuegen",
    score_tip_format: "+ Format waehlen",

    // Dashboard
    dash_title: "Dashboard",
    dash_subtitle: "Konformitaetsjournal und Statistiken",
    dash_protected: "Geschuetzt",
    dash_blocked: "Blockiert",
    dash_last7days: "Letzte 7 Tage",
    dash_by_site: "Nach KI-Seite",
    dash_by_category: "Nach Kategorie",
    dash_journal: "Journal",
    dash_date: "Datum",
    dash_no_data: "Keine Daten",
    dash_purge: "Loeschen",
    dash_purge_confirm: "Gesamtes Journal und Statistiken loeschen?",

    // Settings
    settings_title: "Einstellungen",
    settings_subtitle: "Anonymisierung und PasteProtect konfigurieren",
    settings_pp_title: "PasteProtect",
    settings_pp_enabled: "PasteProtect aktivieren",
    settings_pp_enabled_desc: "Pseudonymisiert Daten beim Einfuegen",
    settings_categories_title: "Erkennungskategorien",
    settings_cat_contact: "Kontakt",
    settings_cat_contact_desc: "E-Mails, Telefonnummern, soziale Netzwerke",
    settings_cat_financial: "Finanzen",
    settings_cat_financial_desc: "IBAN, Kreditkarten, USt-IdNr",
    settings_cat_identity: "Identitaet",
    settings_cat_identity_desc: "Namen, Sozialversicherung, Geburtsdaten",
    settings_cat_technical: "Technik",
    settings_cat_technical_desc: "IP-Adressen, API-Schluessel, GPS",
    settings_blacklist_title: "Blockierung (Blacklist)",
    settings_blacklist_desc: "Diese Kategorien blockieren das Einfuegen vollstaendig",
    settings_bl_secu: "Sozialversicherung",
    settings_bl_card: "Kreditkarten",
    settings_bl_apikey: "API-Schluessel",
    settings_bl_iban: "IBAN",
    settings_bl_privatekey: "Private Schluessel",
    settings_confidence_title: "Erkennungsempfindlichkeit",
    settings_confidence_label: "Konfidenzschwelle",
    settings_confidence_low: "Niedrig (mehr Erkennungen)",
    settings_confidence_medium: "Mittel (empfohlen)",
    settings_confidence_high: "Hoch (weniger Fehlalarme)",
    settings_retention_title: "Journal-Aufbewahrung",
    settings_retention_label: "Aufbewahrungsdauer",

    // Button titles
    btn_back: "Zurueck",
    btn_generate: "Prompt generieren",
    btn_edit: "Prompt bearbeiten",
    btn_copy: "Prompt kopieren",
    btn_send_ai: "An KI senden",
    send_ai_copied: "Kopiert! Mit Strg+V einfuegen",

    // Validation messages
    valid_objective: "Mindestens 20 Zeichen fuer Ihr Ziel",
    valid_context: "Mindestens 10 Zeichen fuer den Kontext",
    valid_min5: "Mindestens 5 Zeichen",
    valid_criteria: "Beschreiben Sie Ihre Erfolgskriterien (min. 10 Zeichen)",
    valid_role: "Beschreiben Sie die Rolle (min. 10 Zeichen)",
    valid_skills: "Mindestens 5 Zeichen fuer Kompetenzen",
    valid_examples: "Fuegen Sie Beispiele hinzu (min. 20 Zeichen)",
    valid_chars: "Zeichen",

    // Prompt labels
    prompt_you_are: "Du bist",
    prompt_with_expertise: "mit Expertise in",
    prompt_tone: "Ton",
    prompt_instructions: "Anweisungen",
    prompt_audience: "Zielgruppe",
    prompt_data: "Daten",
    prompt_uncertainty: "Unsicherheit",
    prompt_sources_required: "Quellen: erforderlich",
    prompt_criteria: "Kriterien",
    prompt_format: "Format",
    prompt_length: "Laenge",
    prompt_prefill: "Vorlage",
    prompt_creativity: "Kreativitaet",
    prompt_reasoning: "Argumentation",
    prompt_depth: "Tiefe",
    prompt_autonomy: "Autonomie",
    prompt_verbosity: "Ausfuehrlichkeit",
    prompt_md_task: "AUFGABE",
    prompt_md_context: "KONTEXT",
    prompt_md_examples: "BEISPIELE",
    prompt_md_constraints: "EINSCHRAENKUNGEN",
    prompt_md_output: "AUSGABEFORMAT",
    prompt_md_parameters: "PARAMETER",

    // Welcome
    welcome_slide1_title: "PasteProtect",
    welcome_slide1_desc: "Ihre sensiblen Daten werden automatisch pseudonymisiert, wenn Sie in ChatGPT, Claude und 4 weiteren KI-Seiten einfuegen.",
    welcome_slide2_title: "Verbesserter Prompt Builder",
    welcome_slide2_desc: "6 gefuehrte Abschnitte, automatische Anpassung an jede KI, Echtzeit-Qualitaetsbewertung.",
    welcome_slide3_title: "Konformitaets-Dashboard",
    welcome_slide3_desc: "Verschluesseltes Journal, Statistiken nach Seite, Export fuer Ihre DSGVO-Audits. 100% lokal.",
    welcome_skip: "Ueberspringen",
    welcome_next: "Weiter",

    // v2.1 — Tab bar
    tab_home: "Startseite",
    tab_library: "Bibliothek",
    tab_result: "Ergebnis",
    tab_settings: "Einstellungen",

    // v2.1 — Home view
    home_status_active: "Schutz aktiv",
    home_status_inactive: "Inaktiv",
    home_stat_protected: "geschuetzt",
    home_stat_month: "diesen Monat",
    home_stat_today: "heute",
    home_create_prompt: "Prompt erstellen",
    home_quick_recent: "Letzter Prompt",
    home_quick_empty: "Keine aktuellen",
    home_quick_template: "Schnellvorlage",
    home_pp_active: "Aktiv auf dieser Seite",
    home_pp_inactive: "Inaktiv auf dieser Seite",

    // v2.1 — Library
    library_search: "Vorlagen suchen...",
    filter_all: "Alle",
    filter_hr: "HR",
    filter_legal: "Recht",
    filter_finance: "Finanzen",
    filter_writing: "Redaktion",
    filter_tech: "Technik",

    // v2.1 — Result
    result_new: "Neu",

    // v2.1 — Settings extras
    settings_language: "Sprache",
    settings_appearance: "Erscheinungsbild",
    settings_dark_mode: "Dunkelmodus",
    settings_plan: "Plan",
    settings_plan_free_desc: "20 Schuetze/Tag, 3 Seiten + 2 eigene",
    settings_upgrade: "Upgrade",
    settings_custom_sites: "Geschuetzte Seiten",
    settings_included_sites: "Enthaltene Seiten",
    settings_custom_sites_label: "Eigene Seiten",
    settings_custom_site_placeholder: "z.B. mistral.ai",
    settings_custom_site_add: "Hinzufuegen",
    settings_custom_sites_count: "eigene Seiten",
    settings_custom_sites_count_pro: "Seiten (unbegrenzt mit Pro)",
    settings_ai_default: "Standard-KI",
    settings_ai_label: "KI-Modell",
    settings_data_title: "Daten",
    settings_about: "Ueber",
    dash_total: "Pseudonymisierungen gesamt",
    dash_export_json: "Export JSON",
    dash_export_csv: "Export CSV"
  }
};

class I18n {
  constructor() {
    this.currentLanguage = this.loadLanguage();
  }

  loadLanguage() {
    return localStorage.getItem('grid-language') || 'fr';
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('grid-language', lang);
    this.updateDOM();
  }

  t(key, fallback = null) {
    return translations[this.currentLanguage]?.[key] || fallback || key;
  }

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        if (element.closest('button') && element.closest('button').querySelector('svg')) {
          return;
        }
        element.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (key) {
        element.placeholder = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-option]').forEach(option => {
      const key = option.getAttribute('data-i18n-option');
      if (key) {
        option.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      if (key) {
        element.title = this.t(key);
      }
    });

    this.updateSuggestions();
  }

  updateSuggestions() {
    document.querySelectorAll('.suggestion-tag[data-suggestion="objectif"]').forEach((tag, index) => {
      const suggestions = [
        'suggestions.write_report', 'suggestions.analyze_data',
        'suggestions.create_strategy', 'suggestions.solve_problem',
        'suggestions.optimize_process', 'suggestions.evaluate_options',
        'suggestions.plan_project', 'suggestions.present_results'
      ];
      if (suggestions[index]) {
        tag.textContent = this.t(suggestions[index]);
      }
    });

    document.querySelectorAll('.suggestion-tag[data-suggestion="competence"]').forEach((tag, index) => {
      const suggestions = [
        'suggestions.strategic_analysis', 'suggestions.critical_thinking',
        'suggestions.communication', 'suggestions.creativity',
        'suggestions.leadership', 'suggestions.innovation',
        'suggestions.problem_solving', 'suggestions.project_management',
        'suggestions.data_analysis', 'suggestions.business_vision'
      ];
      if (suggestions[index]) {
        tag.textContent = this.t(suggestions[index]);
      }
    });
  }
}

export const i18n = new I18n();
export const t = (key, fallback = null) => i18n.t(key, fallback);

export function updateTranslations() {
  i18n.updateDOM();
}
