// GRID Extension - Popup Script (Version simplifiée qui marche)
console.log('🚀 GRID Extension popup script loaded');

// === SYSTÈME DE SAUVEGARDE AUTOMATIQUE ===
class AutoSave {
  constructor() {
    this.saveInterval = 30000; // 30 secondes
    this.storageKey = 'grid_autosave_draft';
    this.lastSaveTime = 0;
    this.isDirty = false;
  }
  
  // Collecter toutes les données du formulaire
  collectFormData() {
    const formData = {};
    
    // Collecter tous les inputs et textareas
    document.querySelectorAll('input, textarea, select').forEach(element => {
      if (element.id && (element.value || element.checked)) {
        formData[element.id] = element.type === 'checkbox' ? element.checked : element.value;
      }
    });
    
    return {
      data: formData,
      timestamp: Date.now(),
      version: '1.0.3'
    };
  }
  
  // Sauvegarder les données
  saveToStorage() {
    if (!this.isDirty) return;
    
    try {
      const formData = this.collectFormData();
      localStorage.setItem(this.storageKey, JSON.stringify(formData));
      this.lastSaveTime = Date.now();
      this.isDirty = false;
      console.log('💾 Auto-save: données sauvegardées');
    } catch (error) {
      console.error('❌ Erreur auto-save:', error);
    }
  }
  
  // Récupérer les données sauvegardées
  restoreFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;
      
      const parsedData = JSON.parse(saved);
      const timeDiff = Date.now() - parsedData.timestamp;
      
      // Ignorer les sauvegardes de plus de 24h
      if (timeDiff > 24 * 60 * 60 * 1000) {
        this.clearSave();
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('❌ Erreur restore auto-save:', error);
      this.clearSave();
      return null;
    }
  }
  
  // Restaurer les champs du formulaire
  restoreFormFields() {
    const savedData = this.restoreFromStorage();
    if (!savedData || !savedData.data) return false;
    
    let restored = 0;
    Object.entries(savedData.data).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
        restored++;
      }
    });
    
    if (restored > 0) {
      console.log(`🔄 Auto-save: ${restored} champs restaurés`);
      return true;
    }
    return false;
  }
  
  // Nettoyer la sauvegarde
  clearSave() {
    localStorage.removeItem(this.storageKey);
    console.log('🧹 Auto-save: sauvegarde nettoyée');
  }
  
  // Marquer comme modifié
  markDirty() {
    this.isDirty = true;
  }
  
  // Initialiser le système
  init() {
    // Démarrer l'intervalle de sauvegarde
    setInterval(() => {
      this.saveToStorage();
    }, this.saveInterval);
    
    // Écouter les changements sur tous les champs
    document.addEventListener('input', () => {
      this.markDirty();
    });
    
    document.addEventListener('change', () => {
      this.markDirty();
    });
    
    console.log('💾 Auto-save system initialized');
  }
}

// Créer l'instance globale
const autoSave = new AutoSave();

// === SYSTÈME DE VALIDATION TEMPS RÉEL ===
class RealTimeValidator {
  constructor() {
    this.rules = {
      'objective': { 
        minLength: 20, 
        required: true,
        message: 'Minimum 20 caractères pour décrire précisément votre objectif'
      },
      'context': { 
        minLength: 10, 
        required: false,
        message: 'Minimum 10 caractères pour le contexte'
      },
      'instructions': { 
        minLength: 5, 
        required: false,
        message: 'Minimum 5 caractères'
      },
      'success-criteria': { 
        minLength: 10, 
        required: false,
        message: 'Décrivez vos critères de succès (min. 10 caractères)'
      },
      'role-custom': { 
        minLength: 10, 
        required: false,
        message: 'Décrivez le rôle personnalisé (min. 10 caractères)'
      },
      'skills': { 
        minLength: 5, 
        required: false,
        message: 'Minimum 5 caractères pour les compétences'
      },
      'examples': { 
        minLength: 20, 
        required: false,
        message: 'Ajoutez des exemples détaillés (min. 20 caractères)'
      }
    };
  }
  
  // Valider un champ selon ses règles
  validateField(fieldId, value) {
    const rule = this.rules[fieldId];
    if (!rule) return { isValid: true };
    
    const isValid = this.checkRule(rule, value);
    const message = isValid ? '' : rule.message;
    
    return { isValid, message, rule };
  }
  
  // Vérifier une règle
  checkRule(rule, value) {
    if (rule.required && !value.trim()) return false;
    if (rule.minLength && value.trim().length < rule.minLength) return false;
    return true;
  }
  
  // Afficher le feedback visuel
  showFeedback(fieldId, validation) {
    const field = document.getElementById(fieldId);
    const container = field?.closest('.form-group');
    if (!field || !container) return;
    
    // Nettoyer les anciens feedbacks
    this.clearFieldFeedback(container);
    
    // Appliquer les styles
    if (validation.isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
      
      // Ajouter le message d'erreur
      this.showErrorMessage(container, validation.message);
    }
    
    // Ajouter un compteur de caractères si pertinent
    if (validation.rule && validation.rule.minLength) {
      this.showCharacterCount(container, field.value.length, validation.rule.minLength);
    }
  }
  
  // Nettoyer le feedback d'un champ
  clearFieldFeedback(container) {
    const existingError = container.querySelector('.validation-error');
    const existingCounter = container.querySelector('.char-counter');
    if (existingError) existingError.remove();
    if (existingCounter) existingCounter.remove();
  }
  
  // Afficher un message d'erreur
  showErrorMessage(container, message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'validation-error';
    errorEl.textContent = message;
    container.appendChild(errorEl);
  }
  
  // Afficher un compteur de caractères
  showCharacterCount(container, currentLength, minLength) {
    const counterEl = document.createElement('div');
    counterEl.className = 'char-counter';
    const isValid = currentLength >= minLength;
    counterEl.textContent = `${currentLength}/${minLength} caractères`;
    counterEl.classList.toggle('valid', isValid);
    container.appendChild(counterEl);
  }
  
  // Valider tous les champs visibles
  validateAllFields() {
    let isFormValid = true;
    
    Object.keys(this.rules).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && field.offsetParent !== null) { // Champ visible
        const validation = this.validateField(fieldId, field.value || '');
        this.showFeedback(fieldId, validation);
        if (!validation.isValid && this.rules[fieldId].required) {
          isFormValid = false;
        }
      }
    });
    
    return isFormValid;
  }
  
  // Initialiser la validation
  init() {
    // Écouter les changements sur tous les champs avec validation
    Object.keys(this.rules).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        // Validation au fur et à mesure de la saisie (debounced)
        let timeout;
        field.addEventListener('input', () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            const validation = this.validateField(fieldId, field.value);
            this.showFeedback(fieldId, validation);
          }, 500); // 500ms de délai
        });
        
        // Validation immédiate à la perte de focus
        field.addEventListener('blur', () => {
          const validation = this.validateField(fieldId, field.value);
          this.showFeedback(fieldId, validation);
        });
      }
    });
    
    console.log('✅ Real-time validation initialized');
  }
}

// Créer l'instance globale
const validator = new RealTimeValidator();

// === SUPPORT CLAVIER BASIQUE ===
class KeyboardSupport {
  constructor() {
    this.focusableSelectors = [
      'input:not([disabled]):not([type="hidden"])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'button:not([disabled])',
      '[data-action]:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])'
    ];
  }
  
  // Obtenir tous les éléments focusables visibles
  getFocusableElements() {
    const selector = this.focusableSelectors.join(',');
    const elements = Array.from(document.querySelectorAll(selector));
    
    // Filtrer les éléments visibles
    return elements.filter(el => {
      return el.offsetParent !== null && 
             !el.hasAttribute('hidden') && 
             getComputedStyle(el).visibility !== 'hidden';
    });
  }
  
  // Définir l'ordre de tabulation logique
  setTabOrder() {
    const elements = this.getFocusableElements();
    
    elements.forEach((el, index) => {
      // Ordre logique basé sur la position dans le DOM et la vue actuelle
      if (!el.hasAttribute('tabindex') || el.getAttribute('tabindex') === '0') {
        el.setAttribute('tabindex', (index + 1).toString());
      }
    });
  }
  
  // Navigation au clavier
  handleKeyNavigation(event) {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    
    switch(key) {
      case 'Escape':
        this.handleEscape(event);
        break;
        
      case 'Enter':
        this.handleEnter(event);
        break;
        
      case 'Tab':
        this.handleTab(event);
        break;
        
      case 'F1':
        this.showKeyboardHelp(event);
        break;
    }
    
    // Raccourcis avec Ctrl/Cmd
    if (ctrlKey || metaKey) {
      switch(key) {
        case 's':
          event.preventDefault();
          this.saveCurrentStep();
          break;
          
        case 'Enter':
          event.preventDefault();
          this.triggerPrimaryAction();
          break;
      }
    }
  }
  
  // Gérer la touche Escape
  handleEscape(event) {
    const activeModal = document.querySelector('.modal-overlay');
    if (activeModal) {
      // Fermer la modal
      activeModal.style.display = 'none';
      return;
    }
    
    // Aller à la vue précédente ou accueil
    const currentView = document.querySelector('.view:not(.hidden)');
    if (currentView) {
      const viewId = currentView.id;
      
      switch(viewId) {
        case 'step1-view':
        case 'step2-view':
        case 'step3-view':
        case 'library-view':
          goHome();
          break;
        case 'result-view':
          // Retour à l'étape précédente
          goToStep3();
          break;
      }
    }
  }
  
  // Gérer la touche Entrée
  handleEnter(event) {
    const target = event.target;
    
    // Si c'est un bouton, le déclencher
    if (target.tagName === 'BUTTON' || target.hasAttribute('data-action')) {
      event.preventDefault();
      target.click();
      return;
    }
    
    // Si c'est dans un textarea, comportement normal
    if (target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Dans un input, aller au champ suivant ou déclencher l'action principale
    if (target.tagName === 'INPUT') {
      event.preventDefault();
      this.focusNextElement() || this.triggerPrimaryAction();
    }
  }
  
  // Gérer la navigation Tab personnalisée
  handleTab(event) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (event.shiftKey) {
      // Shift+Tab : élément précédent
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    } else {
      // Tab : élément suivant
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    }
    
    event.preventDefault();
    focusableElements[nextIndex].focus();
  }
  
  // Passer au prochain élément focusable
  focusNextElement() {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
      focusableElements[currentIndex + 1].focus();
      return true;
    }
    return false;
  }
  
  // Déclencher l'action principale de la vue courante
  triggerPrimaryAction() {
    const currentView = document.querySelector('.view:not(.hidden)');
    if (!currentView) return;
    
    const viewId = currentView.id;
    
    // Trouver le bouton principal de la vue
    let primaryButton;
    switch(viewId) {
      case 'home-view':
        primaryButton = document.querySelector('[data-action="start-builder"]');
        break;
      case 'step1-view':
        primaryButton = document.querySelector('[data-action="go-step2"]');
        break;
      case 'step2-view':
        primaryButton = document.querySelector('[data-action="go-step3"]');
        break;
      case 'step3-view':
        primaryButton = document.querySelector('[data-action="generate-prompt"]');
        break;
      case 'result-view':
        primaryButton = document.querySelector('[data-action="copy-prompt"]');
        break;
    }
    
    if (primaryButton) {
      primaryButton.click();
    }
  }
  
  // Sauvegarder l'étape courante
  saveCurrentStep() {
    autoSave.saveToStorage();
    console.log('💾 Sauvegarde manuelle (Ctrl+S)');
  }
  
  // Afficher l'aide clavier
  showKeyboardHelp(event) {
    event.preventDefault();
    
    const helpText = `
🎹 RACCOURCIS CLAVIER GRID:

Navigation:
• Tab / Shift+Tab : Navigation entre champs
• Enter : Action principale / Champ suivant
• Escape : Retour / Fermer modal

Actions:
• Ctrl+Enter : Action principale de la vue
• Ctrl+S : Sauvegarde manuelle
• F1 : Cette aide

Vous êtes dans l'étape courante. Utilisez Tab pour naviguer!
    `;
    
    alert(helpText.trim());
  }
  
  // Améliorer l'indicateur de focus
  enhanceFocusVisibility() {
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid var(--color-accent) !important;
        outline-offset: 2px !important;
      }
      
      .nav-btn:focus {
        outline: 2px solid white !important;
        outline-offset: 2px !important;
      }
      
      .nav-btn.validate:focus {
        outline: 2px solid var(--color-success-dark) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialiser le support clavier
  init() {
    // Écouter les événements clavier globaux
    document.addEventListener('keydown', (event) => {
      this.handleKeyNavigation(event);
    });
    
    // Améliorer la visibilité du focus
    this.enhanceFocusVisibility();
    
    // Mettre à jour l'ordre de tabulation quand la vue change
    const observer = new MutationObserver(() => {
      setTimeout(() => this.setTabOrder(), 100);
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'hidden'],
      subtree: true
    });
    
    console.log('⌨️ Keyboard support initialized');
    console.log('  • Tab/Shift+Tab: Navigation');
    console.log('  • Enter: Action principale');
    console.log('  • Escape: Retour');
    console.log('  • Ctrl+Enter: Action rapide');
    console.log('  • Ctrl+S: Sauvegarde');
    console.log('  • F1: Aide');
  }
}

// Créer l'instance globale
const keyboardSupport = new KeyboardSupport();

// === SYSTÈME I18N INTÉGRÉ ===
const translations = {
  fr: {
    app_title: "GRID - AI Prompt Builder",
    app_subtitle: "Création de Prompts & IA",
    app_description: "Outil de productivité pour créer des prompts efficaces",
    start_button: "Commencer",
    library_button: "Bibliothèque",
    library: "Bibliothèque",
    library_subtitle: "Templates et exemples de prompts",
    step1: "Étape 1: Définir l'objectif",
    step2: "Étape 2: Structurer", 
    step3: "Étape 3: Personnaliser",
    library_title: "Bibliothèque",
    result_title: "Prompt généré",
    
    // Étape 1
    objective_label: "Objectif principal",
    objective_placeholder: "Décrivez précisément ce que vous attendez de l'IA...",
    audience_label: "Audience cible",
    audience_help: "Maintenez Ctrl/Cmd pour sélectionner plusieurs options",
    
    // Étape 2
    context_label: "Contexte",
    context_placeholder: "Ex: Entreprise: LeadGenPro, Secteur: Logiciels B2B, Public: investisseurs...",
    instructions_label: "Instructions séquentielles (optionnel)",
    instructions_placeholder: "1. Effectuer une analyse...\n2. Proposer des stratégies...\n3. Identifier les KPIs...",
    success_criteria_label: "Critères de succès",
    success_criteria_placeholder: "Ex: Réponse complète, cohérente, utilisable, avec 3-5 points par section...",
    
    // Étape 3
    role_label: "Rôle et personnalité",
    role_placeholder: "Choisir un rôle...",
    role_custom_placeholder: "Décrivez le rôle personnalisé...",
    skills_label: "Compétences clés",
    skills_placeholder: "Ex: Analyse stratégique, Optimisation, Leadership...",
    examples_label: "Exemples Input/Output (multishot)",
    examples_placeholder: "Exemple 1:\nInput: [votre exemple]\nOutput: [réponse attendue]\n\nExemple 2:\n...",
    prefill_label: "Préremplissage de la réponse (optionnel)",
    prefill_placeholder: 'Ex: {"Strengths": [, "Weaknesses": [',
    response_length_label: "Longueur de réponse",
    creativity_level_label: "Niveau de créativité",
    output_format_label: "Format de sortie",
    reasoning_label: "Raisonnement (Chain-of-thought)",
    advanced_ai_label: "Paramètres IA avancés",
    autonomy_label: "Autonomie (Eagerness)",
    analysis_depth_label: "Profondeur d'analyse",
    verbosity_label: "Verbosité",
    advanced_options_label: "Options avancées",
    
    // Suggestions
    "suggestions.write_report": "Rédiger un rapport",
    "suggestions.analyze_data": "Analyser des données",
    "suggestions.create_strategy": "Créer une stratégie",
    "suggestions.solve_problem": "Résoudre un problème",
    "suggestions.optimize_process": "Optimiser un processus",
    "suggestions.evaluate_options": "Évaluer des options",
    "suggestions.plan_project": "Planifier un projet",
    "suggestions.present_results": "Présenter des résultats",
    
    "suggestions.strategic_analysis": "Analyse stratégique",
    "suggestions.critical_thinking": "Pensée critique",
    "suggestions.communication": "Communication",
    "suggestions.creativity": "Créativité",
    "suggestions.leadership": "Leadership",
    "suggestions.innovation": "Innovation",
    "suggestions.problem_solving": "Résolution de problèmes",
    "suggestions.project_management": "Gestion de projet",
    "suggestions.data_analysis": "Analyse de données",
    "suggestions.business_vision": "Vision business",
    
    // Rôles
    "roles.senior_consultant": "Consultant Senior en Stratégie",
    "roles.data_analyst": "Analyste de Données",
    "roles.marketing_expert": "Expert Marketing",
    "roles.senior_developer": "Développeur Senior",
    "roles.technical_writer": "Rédacteur Technique",
    "roles.custom": "Rôle personnalisé...",
    "roles.expert": "Expert dans le domaine",
    not_specified: "Non spécifié",
    
    copy_button: "Copier",
    back_button: "Retour",
    next_button: "Suivant",
    generate_button: "Générer",
    footer: "© 2025 GRID - AI Prompt Builder (By LetoD)",
    "features.fast": "Rapide",
    "features.structured": "Structuré", 
    "features.efficient": "Efficace",
    "audiences.beginner": "Débutant",
    "audiences.intermediate": "Intermédiaire",
    "audiences.expert": "Expert",
    "audiences.management": "Équipe de direction",
    "audiences.general_public": "Grand public",
    "audiences.technical": "Public technique",
    
    // Aide et descriptions
    examples_help: "Fournissez 2-5 exemples avec format Input → Output",
    prefill_help: "Format de sortie que l'IA doit commencer à remplir",
    require_sources: "Exiger des sources",
    use_xml: "Utiliser structure XML avancée",
    
    // Options des select
    "lengths.short": "Courte (100-300 mots)",
    "lengths.medium": "Moyenne (300-600 mots)",
    "lengths.detailed": "Détaillée (600+ mots)",
    
    "formats.text": "Texte libre",
    "formats.report": "Rapport structuré",
    "formats.list": "Liste à puces",
    "formats.json": "Format JSON",
    "formats.table": "Tableau",
    
    "creativity.factual": "Factuelle (0% créativité)",
    "creativity.moderate": "Modérée (30% créativité)",
    "creativity.creative": "Créative (70% créativité)",
    
    "reasoning_types.none": "Aucun raisonnement spécifique",
    "reasoning_types.step_by_step": "Raisonnement étape par étape",
    "reasoning_types.justification": "Justifier les choix",
    
    "autonomy_levels.low": "Basse - L'IA pose des questions",
    "autonomy_levels.medium": "Moyenne - Équilibrée",
    "autonomy_levels.high": "Haute - L'IA est proactive",
    
    "analysis_depths.low": "Analyse superficielle",
    "analysis_depths.medium": "Analyse standard",
    "analysis_depths.high": "Analyse approfondie",
    
    "verbosity_levels.concise": "Concise",
    "verbosity_levels.balanced": "Équilibrée",
    "verbosity_levels.detailed": "Détaillée"
  },
  en: {
    app_title: "GRID - AI Prompt Builder",
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
    
    // Step 1
    objective_label: "Main objective",
    objective_placeholder: "Describe precisely what you expect from the AI...",
    audience_label: "Target audience",
    audience_help: "Hold Ctrl/Cmd to select multiple options",
    
    // Step 2
    context_label: "Context",
    context_placeholder: "Ex: Company: LeadGenPro, Sector: B2B Software, Audience: investors...",
    instructions_label: "Sequential instructions (optional)",
    instructions_placeholder: "1. Perform an analysis...\n2. Propose strategies...\n3. Identify KPIs...",
    success_criteria_label: "Success criteria",
    success_criteria_placeholder: "Ex: Complete, coherent, usable response, with 3-5 points per section...",
    
    // Step 3
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
    
    // Suggestions
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
    
    // Roles
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
    footer: "© 2025 GRID - AI Prompt Builder (By LetoD)",
    "features.fast": "Fast",
    "features.structured": "Structured", 
    "features.efficient": "Efficient",
    "audiences.beginner": "Beginner",
    "audiences.intermediate": "Intermediate",
    "audiences.expert": "Expert",
    "audiences.management": "Management team",
    "audiences.general_public": "General public",
    "audiences.technical": "Technical audience",
    
    // Help and descriptions
    examples_help: "Provide 2-5 examples with Input → Output format",
    prefill_help: "Output format that AI should start filling",
    require_sources: "Require sources",
    use_xml: "Use advanced XML structure",
    
    // Select options
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
    "verbosity_levels.detailed": "Detailed"
  },
  de: {
    app_title: "GRID - AI Prompt Builder",
    app_subtitle: "Prompt-Erstellung & KI",
    app_description: "Produktivitätstool für die Erstellung effektiver Prompts",
    start_button: "Starten",
    library_button: "Bibliothek",
    library: "Bibliothek",
    library_subtitle: "Vorlagen und Prompt-Beispiele",
    step1: "Schritt 1: Ziel definieren",
    step2: "Schritt 2: Strukturieren",
    step3: "Schritt 3: Personalisieren",
    library_title: "Bibliothek", 
    result_title: "Generierter Prompt",
    
    // Schritt 1
    objective_label: "Hauptziel",
    objective_placeholder: "Beschreiben Sie genau, was Sie von der KI erwarten...",
    audience_label: "Zielgruppe",
    audience_help: "Halten Sie Strg/Cmd gedrückt, um mehrere Optionen auszuwählen",
    
    // Schritt 2
    context_label: "Kontext",
    context_placeholder: "Bsp: Unternehmen: LeadGenPro, Sektor: B2B Software, Publikum: Investoren...",
    instructions_label: "Sequentielle Anweisungen (optional)",
    instructions_placeholder: "1. Eine Analyse durchführen...\n2. Strategien vorschlagen...\n3. KPIs identifizieren...",
    success_criteria_label: "Erfolgskriterien",
    success_criteria_placeholder: "Bsp: Vollständige, kohärente, nutzbare Antwort mit 3-5 Punkten pro Abschnitt...",
    
    // Schritt 3
    role_label: "Rolle und Persönlichkeit",
    role_placeholder: "Rolle wählen...",
    role_custom_placeholder: "Beschreiben Sie die benutzerdefinierte Rolle...",
    skills_label: "Kernkompetenzen",
    skills_placeholder: "Bsp: Strategische Analyse, Optimierung, Führung...",
    examples_label: "Input/Output-Beispiele (multishot)",
    examples_placeholder: "Beispiel 1:\nInput: [Ihr Beispiel]\nOutput: [erwartete Antwort]\n\nBeispiel 2:\n...",
    prefill_label: "Antwort-Vorlage (optional)",
    prefill_placeholder: 'Bsp: {"Strengths": [, "Weaknesses": [',
    response_length_label: "Antwortlänge",
    creativity_level_label: "Kreativitätsniveau",
    output_format_label: "Ausgabeformat",
    reasoning_label: "Argumentation (Chain-of-thought)",
    advanced_ai_label: "Erweiterte KI-Parameter",
    autonomy_label: "Autonomie (Eagerness)",
    analysis_depth_label: "Analysetiefe",
    verbosity_label: "Ausführlichkeit",
    advanced_options_label: "Erweiterte Optionen",
    
    // Vorschläge
    "suggestions.write_report": "Einen Bericht schreiben",
    "suggestions.analyze_data": "Daten analysieren",
    "suggestions.create_strategy": "Eine Strategie erstellen",
    "suggestions.solve_problem": "Ein Problem lösen",
    "suggestions.optimize_process": "Einen Prozess optimieren",
    "suggestions.evaluate_options": "Optionen bewerten",
    "suggestions.plan_project": "Ein Projekt planen",
    "suggestions.present_results": "Ergebnisse präsentieren",
    
    "suggestions.strategic_analysis": "Strategische Analyse",
    "suggestions.critical_thinking": "Kritisches Denken",
    "suggestions.communication": "Kommunikation",
    "suggestions.creativity": "Kreativität",
    "suggestions.leadership": "Führung",
    "suggestions.innovation": "Innovation",
    "suggestions.problem_solving": "Problemlösung",
    "suggestions.project_management": "Projektmanagement",
    "suggestions.data_analysis": "Datenanalyse",
    "suggestions.business_vision": "Geschäftsvision",
    
    // Rollen
    "roles.senior_consultant": "Senior Strategieberater",
    "roles.data_analyst": "Datenanalyst",
    "roles.marketing_expert": "Marketing-Experte",
    "roles.senior_developer": "Senior Entwickler",
    "roles.technical_writer": "Technischer Redakteur",
    "roles.custom": "Benutzerdefinierte Rolle...",
    "roles.expert": "Experte im Bereich",
    not_specified: "Nicht spezifiziert",
    
    copy_button: "Kopieren",
    back_button: "Zurück",
    next_button: "Weiter",
    generate_button: "Generieren",
    footer: "© 2025 GRID - AI Prompt Builder (By LetoD)",
    "features.fast": "Schnell",
    "features.structured": "Strukturiert", 
    "features.efficient": "Effizient",
    "audiences.beginner": "Anfänger",
    "audiences.intermediate": "Fortgeschritten",
    "audiences.expert": "Experte",
    "audiences.management": "Führungsteam",
    "audiences.general_public": "Allgemeine Öffentlichkeit",
    "audiences.technical": "Technisches Publikum",
    
    // Hilfe und Beschreibungen
    examples_help: "Geben Sie 2-5 Beispiele im Input → Output Format an",
    prefill_help: "Ausgabeformat, das die KI zu füllen beginnen soll",
    require_sources: "Quellen erforderlich",
    use_xml: "Erweiterte XML-Struktur verwenden",
    
    // Select-Optionen
    "lengths.short": "Kurz (100-300 Wörter)",
    "lengths.medium": "Mittel (300-600 Wörter)",
    "lengths.detailed": "Detailliert (600+ Wörter)",
    
    "formats.text": "Freier Text",
    "formats.report": "Strukturierter Bericht",
    "formats.list": "Aufzählung",
    "formats.json": "JSON-Format",
    "formats.table": "Tabelle",
    
    "creativity.factual": "Sachlich (0% Kreativität)",
    "creativity.moderate": "Moderat (30% Kreativität)",
    "creativity.creative": "Kreativ (70% Kreativität)",
    
    "reasoning_types.none": "Keine spezifische Argumentation",
    "reasoning_types.step_by_step": "Schritt-für-Schritt Argumentation",
    "reasoning_types.justification": "Entscheidungen begründen",
    
    "autonomy_levels.low": "Niedrig - KI stellt Fragen",
    "autonomy_levels.medium": "Mittel - Ausgewogen",
    "autonomy_levels.high": "Hoch - KI ist proaktiv",
    
    "analysis_depths.low": "Oberflächliche Analyse",
    "analysis_depths.medium": "Standard-Analyse",
    "analysis_depths.high": "Tiefgehende Analyse",
    
    "verbosity_levels.concise": "Prägnant",
    "verbosity_levels.balanced": "Ausgewogen",
    "verbosity_levels.detailed": "Ausführlich"
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
    // Traduction des textes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        // Protection pour les boutons avec SVG
        if (element.closest('button') && element.closest('button').querySelector('svg')) {
          return;
        } else {
          element.textContent = this.t(key);
        }
      }
    });

    // Traduction des placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (key) {
        element.placeholder = this.t(key);
      }
    });

    // Traduction des options de select
    document.querySelectorAll('[data-i18n-option]').forEach(option => {
      const key = option.getAttribute('data-i18n-option');
      if (key) {
        option.textContent = this.t(key);
      }
    });

    // Traduction des suggestions
    this.updateSuggestions();
  }

  updateSuggestions() {
    // Suggestions objectifs
    document.querySelectorAll('.suggestion-tag[data-suggestion="objectif"]').forEach((tag, index) => {
      const suggestions = [
        'suggestions.write_report',
        'suggestions.analyze_data', 
        'suggestions.create_strategy',
        'suggestions.solve_problem',
        'suggestions.optimize_process',
        'suggestions.evaluate_options',
        'suggestions.plan_project',
        'suggestions.present_results'
      ];
      if (suggestions[index]) {
        tag.textContent = this.t(suggestions[index]);
      }
    });

    // Suggestions compétences
    document.querySelectorAll('.suggestion-tag[data-suggestion="competence"]').forEach((tag, index) => {
      const suggestions = [
        'suggestions.strategic_analysis',
        'suggestions.critical_thinking',
        'suggestions.communication',
        'suggestions.creativity',
        'suggestions.leadership',
        'suggestions.innovation',
        'suggestions.problem_solving',
        'suggestions.project_management',
        'suggestions.data_analysis',
        'suggestions.business_vision'
      ];
      if (suggestions[index]) {
        tag.textContent = this.t(suggestions[index]);
      }
    });
  }
}

const i18n = new I18n();
const t = (key, fallback = null) => i18n.t(key, fallback);

// === EXEMPLES DE PROMPTS ===
const promptExamples = {
  'strategy': [
    {
      id: 'business-strategy',
      title_fr: 'Stratégie Business',
      title_en: 'Business Strategy',
      title_de: 'Geschäftsstrategie',
      description_fr: 'Analyser et développer des stratégies business',
      description_en: 'Analyze and develop business strategies',
      description_de: 'Geschäftsstrategien analysieren und entwickeln',
      prompt: `<prompt>
  <role>
    <nom>Consultant Senior en Stratégie</nom>
    <competences>Analyse stratégique, Vision business, Planification</competences>
  </role>
  
  <objectif>
    Développer une stratégie business complète pour [ENTREPRISE] dans le secteur [SECTEUR]
  </objectif>
  
  <audience>
    <type>expert</type>
    <type>équipe-direction</type>
  </audience>
  
  <contexte>
    Entreprise: [ENTREPRISE]
    Secteur: [SECTEUR]
    Taille: [TAILLE]
    Objectifs: [OBJECTIFS]
  </contexte>
  
  <options>
    <longueur>détaillée</longueur>
    <creativite>modérée</creativite>
    <autonomie>medium</autonomie>
    <profondeur_analyse>high</profondeur_analyse>
    <verbosity>balanced</verbosity>
  </options>
  
  <format_de_sortie>
    <type>rapport</type>
  </format_de_sortie>
</prompt>`
    },
    {
      id: 'market-analysis',
      title_fr: 'Analyse de Marché',
      title_en: 'Market Analysis',
      title_de: 'Marktanalyse',
      description_fr: 'Analyser un marché et ses opportunités',
      description_en: 'Analyze a market and its opportunities',
      description_de: 'Markt und Chancen analysieren',
      prompt: `<prompt>
  <role>
    <nom>Analyste de Marché</nom>
    <competences>Recherche, Analyse de données, Veille concurrentielle</competences>
  </role>
  
  <objectif>
    Effectuer une analyse complète du marché [MARCHE] pour identifier les opportunités et menaces
  </objectif>
  
  <audience>
    <type>expert</type>
    <type>équipe-direction</type>
  </audience>
  
  <options>
    <longueur>détaillée</longueur>
    <creativite>factuelle</creativite>
    <autonomie>medium</autonomie>
    <profondeur_analyse>high</profondeur_analyse>
    <verbosity>detailed</verbosity>
  </options>
  
  <format_de_sortie>
    <type>rapport</type>
  </format_de_sortie>
</prompt>`
    }
  ],
  'content': [
    {
      id: 'technical-writing',
      title_fr: 'Rédaction Technique',
      title_en: 'Technical Writing',
      title_de: 'Technisches Schreiben',
      description_fr: 'Créer de la documentation technique claire',
      description_en: 'Create clear technical documentation',
      description_de: 'Klare technische Dokumentation erstellen',
      prompt: `<prompt>
  <role>
    <nom>Rédacteur Technique</nom>
    <competences>Documentation, Communication technique, Vulgarisation</competences>
  </role>
  
  <objectif>
    Rédiger une documentation technique pour [PRODUIT/SERVICE] destinée à [AUDIENCE_CIBLE]
  </objectif>
  
  <audience>
    <type>technique</type>
    <type>débutant</type>
  </audience>
  
  <options>
    <longueur>détaillée</longueur>
    <creativite>factuelle</creativite>
    <autonomie>medium</autonomie>
    <profondeur_analyse>medium</profondeur_analyse>
    <verbosity>balanced</verbosity>
  </options>
  
  <format_de_sortie>
    <type>rapport</type>
  </format_de_sortie>
</prompt>`
    },
    {
      id: 'marketing-copy',
      title_fr: 'Copy Marketing',
      title_en: 'Marketing Copy',
      title_de: 'Marketing-Text',
      description_fr: 'Créer du contenu marketing persuasif',
      description_en: 'Create persuasive marketing content',
      description_de: 'Überzeugenden Marketing-Content erstellen',
      prompt: `<prompt>
  <role>
    <nom>Expert Marketing</nom>
    <competences>Copywriting, Persuasion, Communication</competences>
  </role>
  
  <objectif>
    Créer un copy marketing pour [PRODUIT] ciblant [AUDIENCE] avec l'objectif de [OBJECTIF_MARKETING]
  </objectif>
  
  <audience>
    <type>grand-public</type>
  </audience>
  
  <options>
    <longueur>moyenne</longueur>
    <creativite>créative</creativite>
    <autonomie>high</autonomie>
    <profondeur_analyse>medium</profondeur_analyse>
    <verbosity>concise</verbosity>
  </options>
  
  <format_de_sortie>
    <type>texte</type>
  </format_de_sortie>
</prompt>`
    }
  ],
  'analysis': [
    {
      id: 'data-analysis',
      title_fr: 'Analyse de Données',
      title_en: 'Data Analysis',
      title_de: 'Datenanalyse',
      description_fr: 'Analyser et interpréter des données',
      description_en: 'Analyze and interpret data',
      description_de: 'Daten analysieren und interpretieren',
      prompt: `<prompt>
  <role>
    <nom>Analyste de Données</nom>
    <competences>Statistiques, Visualisation, Insights business</competences>
  </role>
  
  <objectif>
    Analyser les données [TYPE_DONNEES] pour identifier les tendances et recommandations
  </objectif>
  
  <audience>
    <type>expert</type>
    <type>équipe-direction</type>
  </audience>
  
  <options>
    <longueur>détaillée</longueur>
    <creativite>factuelle</creativite>
    <autonomie>medium</autonomie>
    <profondeur_analyse>high</profondeur_analyse>
    <verbosity>detailed</verbosity>
  </options>
  
  <format_de_sortie>
    <type>rapport</type>
  </format_de_sortie>
</prompt>`
    }
  ]
};

function getExamplesByCategory(category) {
  return promptExamples[category] || [];
}

function getExampleById(id) {
  for (const category in promptExamples) {
    const example = promptExamples[category].find(ex => ex.id === id);
    if (example) return example;
  }
  return null;
}

function getCategories() {
  return Object.keys(promptExamples);
}

// === ÉTAT DE L'APPLICATION ===
const appState = {
  currentStep: 'home',
  data: {},
  selectedAI: null
};

// === NAVIGATION ===
function showView(viewId) {
  console.log('📍 showView appelée avec:', viewId);
  
  try {
    // Cacher toutes les vues
    document.querySelectorAll('[id$="-view"]').forEach(view => {
      view.classList.add('hidden');
      console.log('  - Masqué:', view.id);
    });
    
    // Afficher la vue cible
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.remove('hidden');
      appState.currentStep = viewId.replace('-view', '');
      console.log('  ✅ Vue affichée:', viewId);
    } else {
      console.error('  ❌ Vue non trouvée:', viewId);
    }
  } catch (error) {
    console.error('❌ Erreur dans showView:', error);
  }
}

function goHome() { 
  console.log('🏠 goHome appelée');
  showView('home-view'); 
}

function startBuilder() { 
  console.log('🚀 startBuilder appelée');
  showView('step1-view'); 
}

function goToStep1() { 
  console.log('1️⃣ goToStep1 appelée');
  showView('step1-view'); 
}

function goToStep2() { 
  console.log('2️⃣ goToStep2 appelée');
  collectStep1Data();
  showView('step2-view'); 
}

function goToStep3() { 
  console.log('3️⃣ goToStep3 appelée');
  collectStep2Data();
  showView('step3-view'); 
}

function showLibrary() {
  console.log('📚 showLibrary appelée');
  renderLibrary();
  showView('library-view');
}

function generatePrompt() {
  console.log('✨ generatePrompt appelée');
  collectStep3Data();
  
  // Générer le prompt basé sur les données collectées
  const generatedPrompt = buildPrompt();
  
  // Afficher le prompt dans la zone de résultat
  const promptDisplay = document.getElementById('generated-prompt');
  if (promptDisplay) {
    promptDisplay.textContent = generatedPrompt;
  }
  
  // Nettoyer l'auto-save car le prompt a été généré avec succès
  autoSave.clearSave();
  
  showView('result-view');
}

function copyPrompt() {
  console.log('📋 copyPrompt appelée');
  
  const promptDisplay = document.getElementById('generated-prompt');
  if (promptDisplay && promptDisplay.textContent) {
    try {
      navigator.clipboard.writeText(promptDisplay.textContent).then(() => {
        console.log('✅ Prompt copié avec succès');
        // Feedback visuel
        const btn = document.querySelector('[data-action="copy-prompt"]');
        if (btn) {
          const originalBg = btn.style.background;
          btn.style.background = 'var(--color-success)';
          setTimeout(() => {
            btn.style.background = originalBg;
          }, 1000);
        }
      }).catch(err => {
        console.error('❌ Erreur lors de la copie:', err);
        fallbackCopy(promptDisplay.textContent);
      });
    } catch (err) {
      console.error('❌ Clipboard API non supportée:', err);
      fallbackCopy(promptDisplay.textContent);
    }
  } else {
    console.warn('⚠️ Aucun prompt à copier');
  }
}

function fallbackCopy(text) {
  // Méthode de fallback pour les navigateurs plus anciens
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    console.log('✅ Prompt copié avec la méthode fallback');
  } catch (err) {
    console.error('❌ Erreur avec la méthode fallback:', err);
  }
  document.body.removeChild(textArea);
}

// === GESTION DES IA PERSONNALISÉES ===
function loadCustomAIs() {
  try {
    const saved = localStorage.getItem('grid-custom-ais');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des IA personnalisées:', error);
  }
  return {};
}

function saveCustomAIs(customAIs) {
  try {
    localStorage.setItem('grid-custom-ais', JSON.stringify(customAIs));
    console.log('💾 IA personnalisées sauvegardées:', customAIs);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des IA personnalisées:', error);
  }
}

function updateAISelector() {
  const aiSelector = document.getElementById('ai-selector');
  if (!aiSelector) return;
  
  // Garder les options par défaut avec traductions
  const defaultOptions = [
    { value: "", key: "ai_selector_choose" },
    { value: "chatgpt", text: "ChatGPT" },
    { value: "claude", text: "Claude" },
    { value: "gemini", text: "Gemini" },
    { value: "copilot", text: "Copilot" },
    { value: "perplexity", text: "Perplexity" },
    { value: "mistral", text: "Mistral" }
  ];
  
  // Obtenir les traductions actuelles
  const translations = {
    "ai_selector_choose": {
      fr: "Choisir IA",
      en: "Choose AI", 
      de: "KI wählen"
    },
    "ai_selector_custom": {
      fr: "Personnaliser...",
      en: "Customize...",
      de: "Anpassen..."
    }
  };
  
  const currentLang = i18n.currentLanguage;
  
  // Charger les IA personnalisées
  const customAIs = loadCustomAIs();
  
  // Sauvegarder la valeur actuelle
  const currentValue = aiSelector.value;
  
  // Vider le sélecteur
  aiSelector.innerHTML = '';
  
  // Ajouter les options par défaut
  defaultOptions.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    if (option.key && translations[option.key]) {
      optionEl.setAttribute('data-i18n-option', option.key);
      optionEl.textContent = translations[option.key][currentLang] || option.text || option.key;
    } else {
      optionEl.textContent = option.text;
    }
    aiSelector.appendChild(optionEl);
  });
  
  // Ajouter les IA personnalisées
  Object.keys(customAIs).forEach(id => {
    const ai = customAIs[id];
    const optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.textContent = ai.name;
    aiSelector.appendChild(optionEl);
  });
  
  // Ajouter l'option de personnalisation
  const customOptionEl = document.createElement('option');
  customOptionEl.value = 'custom';
  customOptionEl.setAttribute('data-i18n-option', 'ai_selector_custom');
  customOptionEl.textContent = translations["ai_selector_custom"][currentLang] || "Personnaliser...";
  aiSelector.appendChild(customOptionEl);
  
  // Restaurer la valeur
  aiSelector.value = currentValue;
}

// === GESTION DU SÉLECTEUR D'IA ===
function loadSelectedAI() {
  try {
    const saved = localStorage.getItem('grid-selected-ai');
    if (saved) {
      appState.selectedAI = saved;
      const aiSelector = document.getElementById('ai-selector');
      if (aiSelector) {
        aiSelector.value = saved;
      }
      console.log('🤖 IA restaurée:', saved);
      return saved;
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'IA:', error);
  }
  return null;
}

function saveSelectedAI(aiValue) {
  try {
    localStorage.setItem('grid-selected-ai', aiValue);
    appState.selectedAI = aiValue;
    console.log('💾 IA sauvegardée:', aiValue);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de l\'IA:', error);
  }
}

function getAIUrls() {
  return {
    'chatgpt': 'https://chatgpt.com/',
    'claude': 'https://claude.ai/chat',
    'gemini': 'https://gemini.google.com/app',
    'copilot': 'https://copilot.microsoft.com/',
    'perplexity': 'https://www.perplexity.ai/',
    'mistral': 'https://chat.mistral.ai/chat'
  };
}

function getAIName(aiValue) {
  const names = {
    'chatgpt': 'ChatGPT',
    'claude': 'Claude',
    'gemini': 'Gemini', 
    'copilot': 'Copilot',
    'perplexity': 'Perplexity',
    'mistral': 'Mistral'
  };
  
  // Vérifier si c'est une IA personnalisée
  if (!names[aiValue]) {
    const customAIs = loadCustomAIs();
    if (customAIs[aiValue]) {
      return customAIs[aiValue].name;
    }
  }
  
  return names[aiValue] || 'IA sélectionnée';
}

function updateSendToAIButton() {
  const btn = document.querySelector('[data-action="send-to-ai"]');
  if (btn && appState.selectedAI) {
    const aiName = getAIName(appState.selectedAI);
    btn.title = `Vers ${aiName}`;
    console.log('🔄 Bouton "Vers IA" mis à jour:', aiName);
  }
}

function getAIUrlWithPrompt(aiValue, prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  
  switch(aiValue) {
    case 'chatgpt':
      // ChatGPT supporte le paramètre q pour pré-remplir
      return `https://chatgpt.com/?q=${encodedPrompt}`;
    
    case 'claude':
      // Claude ne supporte pas le pré-remplissage par URL, utiliser l'URL normale
      return 'https://claude.ai/chat';
    
    case 'gemini':
      // Gemini ne supporte pas le pré-remplissage par URL
      return 'https://gemini.google.com/app';
    
    case 'copilot':
      // Copilot ne supporte pas le pré-remplissage par URL
      return 'https://copilot.microsoft.com/';
    
    case 'perplexity':
      // Perplexity supporte le paramètre q
      return `https://www.perplexity.ai/?q=${encodedPrompt}`;
    
    case 'mistral':
      // Mistral ne supporte pas le pré-remplissage par URL
      return 'https://chat.mistral.ai/chat';
    
    default:
      // Vérifier si c'est une IA personnalisée
      const customAIs = loadCustomAIs();
      if (customAIs[aiValue]) {
        return customAIs[aiValue].url;
      }
      return getAIUrls()[aiValue];
  }
}

function sendToAI() {
  console.log('🚀 sendToAI appelée');
  
  if (!appState.selectedAI) {
    alert('Veuillez d\'abord sélectionner une IA dans le menu déroulant de la page d\'accueil.');
    return;
  }
  
  const promptDisplay = document.getElementById('generated-prompt');
  if (!promptDisplay || !promptDisplay.textContent) {
    console.warn('⚠️ Aucun prompt à envoyer');
    return;
  }
  
  const prompt = promptDisplay.textContent;
  const aiName = getAIName(appState.selectedAI);
  
  // Toujours copier dans le presse-papiers d'abord
  const copyAndRedirect = (url) => {
    console.log('✅ Prompt copié dans le presse-papiers pour', aiName);
    
    // Feedback visuel
    const btn = document.querySelector('[data-action="send-to-ai"]');
    if (btn) {
      const originalBg = btn.style.background;
      btn.style.background = 'var(--color-success)';
      setTimeout(() => {
        btn.style.background = originalBg;
      }, 1500);
    }
    
    // Message informatif pour les IA qui ne supportent pas le pré-remplissage
    if (!['chatgpt', 'perplexity'].includes(appState.selectedAI)) {
      console.log('ℹ️ Le prompt a été copié - vous pouvez le coller dans', aiName);
    }
    
    // Rediriger vers l'IA
    setTimeout(() => {
      chrome.tabs.create({ url: url });
    }, 500);
  };
  
  try {
    // Générer l'URL avec ou sans pré-remplissage
    const targetUrl = getAIUrlWithPrompt(appState.selectedAI, prompt);
    
    // Copier le prompt dans le presse-papiers
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prompt).then(() => {
        copyAndRedirect(targetUrl);
      }).catch(err => {
        console.error('❌ Erreur lors de la copie (clipboard API):', err);
        // Utiliser la méthode fallback
        fallbackCopyAndRedirect(prompt, targetUrl);
      });
    } else {
      // Utiliser la méthode fallback si clipboard API n'est pas disponible
      fallbackCopyAndRedirect(prompt, targetUrl);
    }
    
  } catch (err) {
    console.error('❌ Erreur générale:', err);
    // En cas d'erreur, au moins ouvrir l'IA
    chrome.tabs.create({ url: getAIUrls()[appState.selectedAI] });
  }
}

function fallbackCopyAndRedirect(text, url) {
  // Méthode de fallback pour copier
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    console.log('✅ Prompt copié avec la méthode fallback');
    
    // Feedback visuel
    const btn = document.querySelector('[data-action="send-to-ai"]');
    if (btn) {
      const originalBg = btn.style.background;
      btn.style.background = 'var(--color-success)';
      setTimeout(() => {
        btn.style.background = originalBg;
      }, 1500);
    }
    
  } catch (err) {
    console.error('❌ Erreur avec la méthode fallback:', err);
  }
  
  document.body.removeChild(textArea);
  
  // Rediriger vers l'IA
  setTimeout(() => {
    chrome.tabs.create({ url: url });
  }, 500);
}

// === GESTION DE LA MODAL PERSONNALISATION IA ===
function showCustomAIModal() {
  const modal = document.getElementById('custom-ai-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // Focus sur le champ nom
    const nameInput = document.getElementById('custom-ai-name');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 100);
    }
  }
}

function hideCustomAIModal() {
  const modal = document.getElementById('custom-ai-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    
    // Nettoyer les champs
    const nameInput = document.getElementById('custom-ai-name');
    const urlInput = document.getElementById('custom-ai-url');
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
  }
}

function saveCustomAI() {
  const nameInput = document.getElementById('custom-ai-name');
  const urlInput = document.getElementById('custom-ai-url');
  
  if (!nameInput || !urlInput) {
    console.error('❌ Champs de la modal non trouvés');
    return;
  }
  
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  
  if (!name || !url) {
    alert('Veuillez remplir tous les champs');
    return;
  }
  
  // Valider l'URL
  try {
    new URL(url);
  } catch (e) {
    alert('Veuillez entrer une URL valide (ex: https://example.com)');
    return;
  }
  
  // Générer un ID unique
  const id = 'custom_' + Date.now();
  
  // Charger les IA existantes
  const customAIs = loadCustomAIs();
  
  // Ajouter la nouvelle IA
  customAIs[id] = { name, url };
  
  // Sauvegarder
  saveCustomAIs(customAIs);
  
  // Mettre à jour le sélecteur
  updateAISelector();
  
  // Sélectionner automatiquement la nouvelle IA
  const aiSelector = document.getElementById('ai-selector');
  if (aiSelector) {
    aiSelector.value = id;
    saveSelectedAI(id);
    updateSendToAIButton();
  }
  
  // Fermer la modal
  hideCustomAIModal();
  
  console.log('✅ IA personnalisée ajoutée:', name, url);
}

// === COLLECTE DE DONNÉES DES ÉTAPES ===
function collectStep1Data() {
  console.log('📊 Collecte des données étape 1');
  
  const objectiveInput = document.getElementById('objective');
  const audienceSelect = document.getElementById('audience');
  
  if (objectiveInput) {
    appState.data.objective = objectiveInput.value;
    console.log('  - Objectif:', appState.data.objective);
  }
  
  if (audienceSelect) {
    const selectedOptions = Array.from(audienceSelect.selectedOptions).map(opt => opt.value);
    appState.data.audience = selectedOptions;
    console.log('  - Audience:', appState.data.audience);
  }
}

function collectStep2Data() {
  console.log('📊 Collecte des données étape 2');
  
  const contextInput = document.getElementById('context');
  const instructionsInput = document.getElementById('instructions');
  const criteresInput = document.getElementById('criteres');
  
  if (contextInput) {
    appState.data.context = contextInput.value;
    console.log('  - Contexte:', appState.data.context);
  }
  
  if (instructionsInput) {
    appState.data.instructions = instructionsInput.value;
    console.log('  - Instructions:', appState.data.instructions);
  }
  
  if (criteresInput) {
    appState.data.criteres = criteresInput.value;
    console.log('  - Critères:', appState.data.criteres);
  }
}

function collectStep3Data() {
  console.log('📊 Collecte des données étape 3');
  
  const roleSelect = document.getElementById('role');
  const roleCustomInput = document.getElementById('role-custom');
  const competencesInput = document.getElementById('competences');
  const exemplesInput = document.getElementById('exemples');
  const prefillInput = document.getElementById('prefill');
  const longueurSelect = document.getElementById('longueur');
  const creativiteSelect = document.getElementById('creativite');
  const formatSelect = document.getElementById('format');
  const reasoningSelect = document.getElementById('reasoning');
  const autonomieSelect = document.getElementById('autonomie');
  const profondeurSelect = document.getElementById('profondeur_analyse');
  const verbositySelect = document.getElementById('verbosity');
  
  if (roleSelect) {
    appState.data.role = roleSelect.value;
    console.log('  - Rôle:', appState.data.role);
  }
  
  if (roleCustomInput && roleCustomInput.value) {
    appState.data.roleCustom = roleCustomInput.value;
    console.log('  - Rôle personnalisé:', appState.data.roleCustom);
  }
  
  if (competencesInput) {
    appState.data.competences = competencesInput.value;
    console.log('  - Compétences:', appState.data.competences);
  }
  
  if (exemplesInput) {
    appState.data.exemples = exemplesInput.value;
    console.log('  - Exemples:', appState.data.exemples);
  }
  
  if (prefillInput) {
    appState.data.prefill = prefillInput.value;
    console.log('  - Prefill:', appState.data.prefill);
  }
  
  if (longueurSelect) {
    appState.data.longueur = longueurSelect.value;
    console.log('  - Longueur:', appState.data.longueur);
  }
  
  if (creativiteSelect) {
    appState.data.creativite = creativiteSelect.value;
    console.log('  - Créativité:', appState.data.creativite);
  }
  
  if (formatSelect) {
    appState.data.format = formatSelect.value;
    console.log('  - Format:', appState.data.format);
  }
  
  if (reasoningSelect) {
    appState.data.reasoning = reasoningSelect.value;
    console.log('  - Reasoning:', appState.data.reasoning);
  }
  
  if (autonomieSelect) {
    appState.data.autonomie = autonomieSelect.value;
    console.log('  - Autonomie:', appState.data.autonomie);
  }
  
  if (profondeurSelect) {
    appState.data.profondeur = profondeurSelect.value;
    console.log('  - Profondeur:', appState.data.profondeur);
  }
  
  if (verbositySelect) {
    appState.data.verbosity = verbositySelect.value;
    console.log('  - Verbosity:', appState.data.verbosity);
  }
}

// === TRADUCTION DES VALEURS DE SELECT ===
function translateSelectValue(category, value) {
  const translations = {
    longueur: {
      'courte': { fr: 'courte', en: 'short', de: 'kurz' },
      'moyenne': { fr: 'moyenne', en: 'medium', de: 'mittel' },
      'détaillée': { fr: 'détaillée', en: 'detailed', de: 'detailliert' }
    },
    creativite: {
      'factuelle': { fr: 'factuelle', en: 'factual', de: 'sachlich' },
      'modérée': { fr: 'modérée', en: 'moderate', de: 'moderat' },
      'créative': { fr: 'créative', en: 'creative', de: 'kreativ' }
    },
    format: {
      'texte': { fr: 'texte', en: 'text', de: 'text' },
      'rapport': { fr: 'rapport', en: 'report', de: 'bericht' },
      'liste': { fr: 'liste', en: 'list', de: 'liste' },
      'json': { fr: 'json', en: 'json', de: 'json' },
      'tableau': { fr: 'tableau', en: 'table', de: 'tabelle' }
    },
    reasoning: {
      'none': { fr: 'aucun', en: 'none', de: 'keine' },
      'step-by-step': { fr: 'étape par étape', en: 'step-by-step', de: 'schritt für schritt' },
      'justification': { fr: 'justification', en: 'justification', de: 'begründung' }
    },
    autonomie: {
      'low': { fr: 'faible', en: 'low', de: 'niedrig' },
      'medium': { fr: 'moyenne', en: 'medium', de: 'mittel' },
      'high': { fr: 'élevée', en: 'high', de: 'hoch' }
    },
    profondeur: {
      'low': { fr: 'superficielle', en: 'superficial', de: 'oberflächlich' },
      'medium': { fr: 'standard', en: 'standard', de: 'standard' },
      'high': { fr: 'approfondie', en: 'deep', de: 'tiefgehend' }
    },
    verbosity: {
      'concise': { fr: 'concise', en: 'concise', de: 'prägnant' },
      'balanced': { fr: 'équilibrée', en: 'balanced', de: 'ausgewogen' },
      'detailed': { fr: 'détaillée', en: 'detailed', de: 'ausführlich' }
    }
  };
  
  const categoryTranslations = translations[category];
  if (categoryTranslations && categoryTranslations[value]) {
    return categoryTranslations[value][i18n.currentLanguage] || value;
  }
  return value;
}

// === TRADUCTION DES BALISES XML ===
function getXMLTags() {
  const tags = {
    fr: {
      role: 'role',
      nom: 'nom',
      competences: 'competences',
      objectif: 'objectif',
      audience: 'audience',
      type: 'type',
      contexte: 'contexte',
      instructions_sequentielles: 'instructions_sequentielles',
      criteres_succes: 'criteres_succes',
      exemples: 'exemples',
      options: 'options',
      longueur: 'longueur',
      creativite: 'creativite',
      autonomie: 'autonomie',
      profondeur_analyse: 'profondeur_analyse',
      verbosity: 'verbosity',
      reasoning: 'reasoning',
      format_de_sortie: 'format_de_sortie',
      prefill: 'prefill'
    },
    en: {
      role: 'role',
      nom: 'name',
      competences: 'skills',
      objectif: 'objective',
      audience: 'audience',
      type: 'type',
      contexte: 'context',
      instructions_sequentielles: 'sequential_instructions',
      criteres_succes: 'success_criteria',
      exemples: 'examples',
      options: 'options',
      longueur: 'length',
      creativite: 'creativity',
      autonomie: 'autonomy',
      profondeur_analyse: 'analysis_depth',
      verbosity: 'verbosity',
      reasoning: 'reasoning',
      format_de_sortie: 'output_format',
      prefill: 'prefill'
    },
    de: {
      role: 'rolle',
      nom: 'name',
      competences: 'kompetenzen',
      objectif: 'ziel',
      audience: 'zielgruppe',
      type: 'typ',
      contexte: 'kontext',
      instructions_sequentielles: 'sequentielle_anweisungen',
      criteres_succes: 'erfolgskriterien',
      exemples: 'beispiele',
      options: 'optionen',
      longueur: 'laenge',
      creativite: 'kreativitaet',
      autonomie: 'autonomie',
      profondeur_analyse: 'analysetiefe',
      verbosity: 'ausfuehrlichkeit',
      reasoning: 'argumentation',
      format_de_sortie: 'ausgabeformat',
      prefill: 'vorausfuellung'
    }
  };
  
  return tags[i18n.currentLanguage] || tags.fr;
}

// === GÉNÉRATION DU PROMPT XML ===
function buildPrompt() {
  console.log('🏗️ Construction du prompt XML avec les données:', appState.data);
  
  const tags = getXMLTags();
  let prompt = '<prompt>\n';
  
  // Section Rôle
  prompt += `  <${tags.role}>\n`;
  if (appState.data.roleCustom) {
    prompt += `    <${tags.nom}>${appState.data.roleCustom}</${tags.nom}>\n`;
  } else if (appState.data.role && appState.data.role !== '' && appState.data.role !== 'personnalisé') {
    const roleNames = {
      'consultant-senior': i18n.t('roles.senior_consultant'),
      'analyste-données': i18n.t('roles.data_analyst'), 
      'expert-marketing': i18n.t('roles.marketing_expert'),
      'développeur-senior': i18n.t('roles.senior_developer'),
      'rédacteur-technique': i18n.t('roles.technical_writer')
    };
    prompt += `    <${tags.nom}>${roleNames[appState.data.role] || i18n.t('roles.expert', 'Expert dans le domaine')}</${tags.nom}>\n`;
  } else {
    prompt += `    <${tags.nom}>${i18n.t('roles.expert', 'Expert dans le domaine')}</${tags.nom}>\n`;
  }
  
  if (appState.data.competences) {
    // Nettoyer les virgules en fin de chaîne
    const cleanedCompetences = appState.data.competences.trim().replace(/,\s*$/, '');
    prompt += `    <${tags.competences}>${cleanedCompetences}</${tags.competences}>\n`;
  }
  prompt += `  </${tags.role}>\n\n`;
  
  // Section Objectif
  prompt += `  <${tags.objectif}>\n`;
  const cleanedObjective = appState.data.objective ? appState.data.objective.trim().replace(/,\s*$/, '') : i18n.t('not_specified', 'Non spécifié');
  prompt += `    ${cleanedObjective}\n`;
  prompt += `  </${tags.objectif}>\n\n`;
  
  // Section Audience
  prompt += `  <${tags.audience}>\n`;
  if (appState.data.audience && appState.data.audience.length > 0) {
    appState.data.audience.forEach(aud => {
      prompt += `    <${tags.type}>${aud}</${tags.type}>\n`;
    });
  }
  prompt += `  </${tags.audience}>\n\n`;
  
  // Section Contexte
  if (appState.data.context) {
    prompt += `  <${tags.contexte}>\n`;
    prompt += `    ${appState.data.context}\n`;
    prompt += `  </${tags.contexte}>\n\n`;
  }
  
  // Section Instructions
  if (appState.data.instructions) {
    prompt += `  <${tags.instructions_sequentielles}>\n`;
    prompt += `    ${appState.data.instructions}\n`;
    prompt += `  </${tags.instructions_sequentielles}>\n\n`;
  }
  
  // Section Critères de succès
  if (appState.data.criteres) {
    prompt += `  <${tags.criteres_succes}>\n`;
    prompt += `    ${appState.data.criteres}\n`;
    prompt += `  </${tags.criteres_succes}>\n\n`;
  }
  
  // Section Exemples
  if (appState.data.exemples) {
    prompt += `  <${tags.exemples}>\n`;
    prompt += `    ${appState.data.exemples}\n`;
    prompt += `  </${tags.exemples}>\n\n`;
  }
  
  // Section Options avec valeurs traduites
  prompt += `  <${tags.options}>\n`;
  prompt += `    <${tags.longueur}>${translateSelectValue('longueur', appState.data.longueur || 'moyenne')}</${tags.longueur}>\n`;
  prompt += `    <${tags.creativite}>${translateSelectValue('creativite', appState.data.creativite || 'modérée')}</${tags.creativite}>\n`;
  prompt += `    <${tags.autonomie}>${translateSelectValue('autonomie', appState.data.autonomie || 'medium')}</${tags.autonomie}>\n`;
  prompt += `    <${tags.profondeur_analyse}>${translateSelectValue('profondeur', appState.data.profondeur || 'medium')}</${tags.profondeur_analyse}>\n`;
  prompt += `    <${tags.verbosity}>${translateSelectValue('verbosity', appState.data.verbosity || 'balanced')}</${tags.verbosity}>\n`;
  
  if (appState.data.reasoning) {
    prompt += `    <${tags.reasoning}>${translateSelectValue('reasoning', appState.data.reasoning)}</${tags.reasoning}>\n`;
  }
  
  prompt += `  </${tags.options}>\n\n`;
  
  // Section Format de sortie
  prompt += `  <${tags.format_de_sortie}>\n`;
  prompt += `    <${tags.type}>${translateSelectValue('format', appState.data.format || 'rapport')}</${tags.type}>\n`;
  
  if (appState.data.prefill) {
    prompt += `    <${tags.prefill}>${appState.data.prefill}</${tags.prefill}>\n`;
  }
  
  prompt += `  </${tags.format_de_sortie}>\n`;
  prompt += '</prompt>';
  
  return prompt;
}

// === GESTION DES SUGGESTIONS ===
function attachSuggestionListeners() {
  console.log('🔗 Attachement des event listeners pour les suggestions');
  
  // Suggestions pour l'objectif
  document.querySelectorAll('.suggestion-tag[data-suggestion="objectif"]').forEach(suggestion => {
    suggestion.addEventListener('click', function() {
      const objectiveInput = document.getElementById('objective');
      if (objectiveInput) {
        const currentValue = objectiveInput.value;
        const suggestionText = this.textContent;
        
        // Vérifier si la suggestion n'est pas déjà présente
        if (currentValue.includes(suggestionText)) {
          console.log('📝 Suggestion déjà présente:', suggestionText);
          return;
        }
        
        // Si le champ est vide, on met la suggestion
        if (!currentValue.trim()) {
          objectiveInput.value = suggestionText;
        } else {
          // Sinon on l'ajoute séparé par une virgule
          objectiveInput.value = currentValue + (currentValue.endsWith(',') || currentValue.endsWith(', ') ? ' ' : ', ') + suggestionText;
        }
        
        // Focus sur le champ pour que l'utilisateur puisse continuer à écrire
        objectiveInput.focus();
        console.log('📝 Suggestion objectif appliquée:', suggestionText);
      }
    });
  });
  
  // Suggestions pour les compétences
  document.querySelectorAll('.suggestion-tag[data-suggestion="competence"]').forEach(suggestion => {
    suggestion.addEventListener('click', function() {
      const competencesInput = document.getElementById('competences');
      if (competencesInput) {
        const currentValue = competencesInput.value;
        const suggestionText = this.textContent;
        
        // Vérifier si la suggestion n'est pas déjà présente
        if (currentValue.includes(suggestionText)) {
          console.log('🎯 Suggestion déjà présente:', suggestionText);
          return;
        }
        
        // Si le champ est vide, on met la suggestion
        if (!currentValue.trim()) {
          competencesInput.value = suggestionText;
        } else {
          // Sinon on l'ajoute séparé par une virgule
          competencesInput.value = currentValue + (currentValue.endsWith(',') || currentValue.endsWith(', ') ? ' ' : ', ') + suggestionText;
        }
        
        // Focus sur le champ
        competencesInput.focus();
        console.log('🎯 Suggestion compétence appliquée:', suggestionText);
      }
    });
  });
  
  console.log('✅ Event listeners des suggestions attachés');
}

// === RENDU DE LA BIBLIOTHÈQUE ===
function renderLibrary() {
  console.log('📚 Rendu de la bibliothèque');
  
  const libraryContainer = document.querySelector('#library-view .content');
  if (!libraryContainer) {
    console.error('❌ Container de la bibliothèque non trouvé');
    return;
  }
  
  let libraryHTML = '';
  
  // Ajouter les catégories
  const categories = [
    { id: 'strategy', name_fr: 'Stratégie', name_en: 'Strategy', name_de: 'Strategie' },
    { id: 'content', name_fr: 'Contenu', name_en: 'Content', name_de: 'Inhalt' },
    { id: 'analysis', name_fr: 'Analyse', name_en: 'Analysis', name_de: 'Analyse' }
  ];
  
  categories.forEach(category => {
    const categoryName = category[`name_${i18n.currentLanguage}`] || category.name_fr;
    const examples = getExamplesByCategory(category.id);
    
    if (examples.length > 0) {
      libraryHTML += `
        <div class="category-section">
          <h3 style="margin: 24px 0 16px 0; color: var(--color-text-primary); font-size: 18px; font-weight: 600;">${categoryName}</h3>
      `;
      
      examples.forEach(example => {
        const title = example[`title_${i18n.currentLanguage}`] || example.title_fr;
        const description = example[`description_${i18n.currentLanguage}`] || example.description_fr;
        
        libraryHTML += `
          <div class="template-card" data-template-id="${example.id}" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; cursor: pointer; transition: all var(--transition-fast);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h4 style="margin: 0; color: var(--color-text-primary); font-size: 16px; font-weight: 500;">${title}</h4>
              <button class="copy-template-btn" data-template-id="${example.id}" style="background: var(--color-accent); color: var(--color-text-primary); border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                ${i18n.t('copy_button')}
              </button>
            </div>
            <p style="margin: 0; color: var(--color-text-secondary); font-size: 14px; line-height: 1.4;">${description}</p>
          </div>
        `;
      });
      
      libraryHTML += '</div>';
    }
  });
  
  libraryContainer.innerHTML = libraryHTML;
  
  // Attacher les event listeners pour les templates
  attachTemplateListeners();
}

function attachTemplateListeners() {
  console.log('🔗 Attachement des event listeners pour les templates');
  
  // Event listeners pour copier les templates
  document.querySelectorAll('.copy-template-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const templateId = this.getAttribute('data-template-id');
      const template = getExampleById(templateId);
      
      if (template) {
        copyTemplateToClipboard(template.prompt);
        console.log('📋 Template copié:', templateId);
        
        // Feedback visuel
        const originalText = this.textContent;
        this.textContent = '✅';
        this.style.background = 'var(--color-success)';
        setTimeout(() => {
          this.textContent = originalText;
          this.style.background = 'var(--color-accent)';
        }, 1500);
      }
    });
  });
  
  // Event listeners pour les cartes de template (voir les détails)
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', function() {
      const templateId = this.getAttribute('data-template-id');
      const template = getExampleById(templateId);
      
      if (template) {
        showTemplateDetails(template);
      }
    });
  });
}

function copyTemplateToClipboard(text) {
  try {
    navigator.clipboard.writeText(text).then(() => {
      console.log('✅ Template copié avec succès');
    }).catch(err => {
      console.error('❌ Erreur lors de la copie:', err);
      fallbackCopy(text);
    });
  } catch (err) {
    console.error('❌ Clipboard API non supportée:', err);
    fallbackCopy(text);
  }
}

function showTemplateDetails(template) {
  // Pour l'instant, on copie juste le template
  // Plus tard on pourrait ouvrir une modal avec les détails
  copyTemplateToClipboard(template.prompt);
}

// === FONCTION DE TRADUCTION AMÉLIORÉE ===
function updateTranslations() {
  // Définir les traductions localement
  const localTranslations = {
    fr: {
      ai_selector_choose: "Choisir IA",
      ai_selector_custom: "Personnaliser...",
      custom_ai_title: "Personnaliser une IA",
      custom_ai_name_label: "Nom de l'IA",
      custom_ai_name_placeholder: "Ex: Mon IA personnalisée",
      custom_ai_url_label: "URL de l'IA",
      custom_ai_url_placeholder: "https://monai.com/chat",
      custom_ai_url_help: "URL vers laquelle rediriger (ex: https://chat.openai.com/)",
      custom_ai_cancel: "Annuler",
      custom_ai_save: "Sauvegarder"
    },
    en: {
      ai_selector_choose: "Choose AI",
      ai_selector_custom: "Customize...",
      custom_ai_title: "Customize an AI",
      custom_ai_name_label: "AI Name",
      custom_ai_name_placeholder: "Ex: My custom AI",
      custom_ai_url_label: "AI URL",
      custom_ai_url_placeholder: "https://myai.com/chat",
      custom_ai_url_help: "URL to redirect to (ex: https://chat.openai.com/)",
      custom_ai_cancel: "Cancel",
      custom_ai_save: "Save"
    },
    de: {
      ai_selector_choose: "KI wählen",
      ai_selector_custom: "Anpassen...",
      custom_ai_title: "KI anpassen",
      custom_ai_name_label: "KI-Name",
      custom_ai_name_placeholder: "Z.B.: Meine benutzerdefinierte KI",
      custom_ai_url_label: "KI-URL",
      custom_ai_url_placeholder: "https://meineKI.com/chat",
      custom_ai_url_help: "URL zur Weiterleitung (z.B.: https://chat.openai.com/)",
      custom_ai_cancel: "Abbrechen",
      custom_ai_save: "Speichern"
    }
  };
  
  const currentLang = i18n.currentLanguage;
  const currentTranslations = localTranslations[currentLang] || localTranslations.fr;
  
  // Mettre à jour tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    let translation = currentTranslations[key] || i18n.t(key);
    
    if (element.closest('button') && element.closest('button').querySelector('svg')) {
      return; // Ne pas écraser les boutons avec SVG
    }
    element.textContent = translation;
  });

  // Mettre à jour tous les éléments avec data-i18n-option
  document.querySelectorAll('[data-i18n-option]').forEach(element => {
    const key = element.getAttribute('data-i18n-option');
    let translation = currentTranslations[key] || i18n.t(key);
    element.textContent = translation;
  });

  // Mettre à jour tous les placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    let translation = currentTranslations[key] || i18n.t(key);
    element.placeholder = translation;
  });
}

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM loaded, initializing GRID extension...');
  
  try {
    // Vérifications de base
    console.log('🔍 Vérifications de base:');
    console.log('  - Vues trouvées:', document.querySelectorAll('[id$="-view"]').length);
    console.log('  - Boutons avec data-action:', document.querySelectorAll('[data-action]').length);
    
    // === SÉLECTEUR DE LANGUE ===
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
      // Définir la langue actuelle
      languageSelector.value = i18n.currentLanguage;
      
      languageSelector.addEventListener('change', function(e) {
        console.log('🌍 Changement de langue:', e.target.value);
        i18n.setLanguage(e.target.value);
        // Mettre à jour toutes les traductions
        updateTranslations();
        // Mettre à jour le sélecteur d'IA pour les traductions
        updateAISelector();
      });
      console.log('  ✅ Sélecteur de langue configuré');
    }
    
    // === SÉLECTEUR D'IA ===
    const aiSelector = document.getElementById('ai-selector');
    if (aiSelector) {
      // Initialiser le sélecteur avec les IA personnalisées
      updateAISelector();
      
      // Charger l'IA précédemment sélectionnée
      loadSelectedAI();
      
      aiSelector.addEventListener('change', function(e) {
        const selectedAI = e.target.value;
        console.log('🤖 Changement d\'IA:', selectedAI);
        
        if (selectedAI === 'custom') {
          // Ouvrir la modal de personnalisation
          showCustomAIModal();
          // Remettre la valeur précédente
          e.target.value = appState.selectedAI || '';
        } else if (selectedAI) {
          saveSelectedAI(selectedAI);
          // Mettre à jour le titre du bouton "Vers IA"
          updateSendToAIButton();
        }
      });
      console.log('  ✅ Sélecteur d\'IA configuré');
    }
    
    // Appliquer les traductions
    updateTranslations();
    
    // === EVENT LISTENERS POUR LES SUGGESTIONS ===
    attachSuggestionListeners();
    
    // === EVENT LISTENERS POUR LA NAVIGATION ===
    
    // Page d'accueil
    const newPromptCard = document.querySelector('[data-action="start-builder"]');
    const libraryCard = document.querySelector('[data-action="show-library"]');
    
    console.log('🔍 Boutons page d\'accueil:');
    console.log('  - start-builder trouvé:', !!newPromptCard);
    console.log('  - show-library trouvé:', !!libraryCard);
    
    if (newPromptCard) {
      newPromptCard.addEventListener('click', function(e) {
        console.log('🎯 CLICK détecté sur start-builder');
        startBuilder();
      });
      console.log('  ✅ Event listener attaché: start-builder');
    }
    
    if (libraryCard) {
      libraryCard.addEventListener('click', function(e) {
        console.log('🎯 CLICK détecté sur show-library');
        showLibrary();
      });
      console.log('  ✅ Event listener attaché: show-library');
    }
    
    // Boutons de navigation
    const navigationActions = [
      { action: 'go-home', func: goHome },
      { action: 'go-step1', func: goToStep1 },
      { action: 'go-step2', func: goToStep2 },
      { action: 'go-step3', func: goToStep3 },
      { action: 'generate-prompt', func: generatePrompt },
      { action: 'copy-prompt', func: copyPrompt },
      { action: 'send-to-ai', func: sendToAI },
      { action: 'close-custom-ai-modal', func: hideCustomAIModal },
      { action: 'save-custom-ai', func: saveCustomAI }
    ];
    
    navigationActions.forEach(({action, func}) => {
      const buttons = document.querySelectorAll(`[data-action="${action}"]`);
      console.log(`🔍 Boutons ${action} trouvés:`, buttons.length);
      
      buttons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
          console.log(`🎯 CLICK détecté sur ${action} (bouton ${index + 1})`);
          func();
        });
      });
      
      if (buttons.length > 0) {
        console.log(`  ✅ Event listeners attachés: ${action} (${buttons.length} boutons)`);
      }
    });
    
    // Initialiser l'auto-save
    autoSave.init();
    
    // Initialiser la validation temps réel
    validator.init();
    
    // Initialiser le support clavier
    keyboardSupport.init();
    
    // Tenter de restaurer une session précédente
    setTimeout(() => {
      const restored = autoSave.restoreFormFields();
      if (restored) {
        console.log('🔄 Session précédente restaurée');
        // Re-valider les champs restaurés
        validator.validateAllFields();
      }
      // Mettre à jour le bouton "Vers IA" si une IA est déjà sélectionnée
      updateSendToAIButton();
    }, 1000);
    
    console.log('✅ GRID extension initialized successfully');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
});

// Fonctions globales pour debug manuel
window.debugGrid = {
  showView,
  goHome,
  startBuilder,
  goToStep1,
  goToStep2,
  goToStep3,
  showLibrary,
  generatePrompt,
  autoSave,
  validator,
  keyboardSupport,
  test: () => {
    console.log('🧪 Test manuel lancé');
    startBuilder();
  }
};