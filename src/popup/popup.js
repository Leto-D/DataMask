// GRID Extension - Popup Script
console.log('GRID Extension popup script loaded');

// Exemples de prompts intégrés
const promptExamples = [
  {
    id: 'swot-analysis',
    title: 'Analyse SWOT d\'entreprise',
    category: 'business',
    description: 'Analyse stratégique complète au format JSON',
    tags: ['stratégie', 'analyse', 'swot', 'business'],
    data: {
      objectif: 'produire une analyse SWOT complète en JSON',
      audience: ['équipe-direction', 'expert'],
      contexte: 'Entreprise fictive : "LeadGenPro"\nSecteur : Logiciels B2B pour la génération de leads industriels\nPublic cible : investisseurs et direction commerciale',
      instructions: '1. Fournis la sortie uniquement au format JSON.\n2. Chaque partie SWOT (forces, faiblesses, opportunités, menaces) doit contenir 3 à 5 points clairs.\n3. Utilise des phrases concises et orientées business.\n4. Pas d\'introduction, uniquement le JSON.',
      criteres: 'Réponse complète, cohérente, utilisable, format JSON strict',
      role: 'consultant-senior',
      competences: 'analyse stratégique, analyse SWOT',
      exemples: 'Input: Analyser les forces internes\nOutput: "Large base de clients fidèles", "Technologie propriétaire innovante"\n\nInput: Identifier une faiblesse\nOutput: "Dépendance à un seul canal de distribution"\n\nInput: Opportunité de marché\nOutput: "Expansion vers l\'Europe de l\'Est"',
      prefill: '{"Strengths": ["Large base de clients fidèles", "Technologie propriétaire innovante"], "Weaknesses": ["Dépendance à un seul canal de distribution"], "Opportunities": ["Expansion vers l\'Europe de l\'Est"], "Threats": ["Nouvelle réglementation sur la data"]}',
      longueur: 'moyenne',
      creativite: 'factuelle',
      format: 'json',
      reasoning: 'justification',
      eagerness: 'medium',
      reasoningEffort: 'medium',
      verbosity: 'concise',
      allowUnknown: false,
      requireSources: false,
      useXml: true
    }
  },
  
  {
    id: 'logistics-kpis',
    title: 'KPIs Logistique',
    category: 'business',
    description: 'Définition d\'indicateurs de performance logistique',
    tags: ['kpi', 'logistique', 'performance', 'distribution'],
    data: {
      objectif: 'définir 5 indicateurs clés de performance (KPIs) pour une chaîne logistique de distribution',
      audience: ['expert', 'technique'],
      contexte: 'Entreprise fictive : "DistribPro"\nSecteur : Distribution de produits électroniques\nPublic cible : responsable logistique et direction opérationnelle\nObjectif : Optimiser les coûts et les délais de livraison',
      instructions: '1. Fournis la sortie au format JSON.\n2. Définis 5 KPIs répartis dans les catégories : Approvisionnement, Transport, Stockage, Stocks.\n3. Pour chaque KPI, précise : nom, définition, formule de calcul, unité, et objectif cible.\n4. Inclut une brève justification du choix de chaque KPI.',
      criteres: 'KPIs mesurables, pertinents, réalistes, avec formules de calcul précises',
      role: 'consultant-senior',
      competences: 'logistique, gestion de la performance',
      exemples: 'Input: KPI de livraison\nOutput: {\n  "name": "Taux de livraison à temps",\n  "definition": "Pourcentage de commandes livrées à la date promise",\n  "formula": "(Nombre de commandes livrées à temps / Nombre total de commandes) * 100",\n  "unit": "%",\n  "target": "≥ 95%",\n  "justification": "Indicateur clé de la satisfaction client et de l\'efficacité du transport"\n}',
      prefill: '{"KPIs": [{"name": "Taux de livraison à temps", "definition": "Pourcentage de commandes livrées à la date promise", "formula": "(Nombre de commandes livrées à temps / Nombre total de commandes) * 100", "unit": "%", "target": "≥ 95%", "justification": "Indicateur clé de la satisfaction client et de l\'efficacité du transport"}]}',
      longueur: 'détaillée',
      creativite: 'factuelle',
      format: 'json',
      reasoning: 'justification',
      eagerness: 'medium',
      reasoningEffort: 'high',
      verbosity: 'balanced',
      allowUnknown: false,
      requireSources: false,
      useXml: true
    }
  },

  {
    id: 'dmaic-lean-six-sigma',
    title: 'Méthodologie DMAIC',
    category: 'business',
    description: 'Application de la méthodologie Lean Six Sigma DMAIC',
    tags: ['lean', 'six-sigma', 'dmaic', 'qualité', 'amélioration'],
    data: {
      objectif: 'appliquer la méthodologie DMAIC pour résoudre un problème de qualité dans une ligne de production',
      audience: ['expert', 'technique'],
      contexte: 'Entreprise fictive : "IndusPro"\nSecteur : Fabrication de composants automobiles\nProblème : Taux de défauts élevé sur l\'assemblage des circuits imprimés\nPublic cible : responsable qualité et ingénieurs de production',
      instructions: '1. Fournis la sortie au format JSON.\n2. Structure ta réponse selon les 5 phases DMAIC (Define, Measure, Analyze, Improve, Control).\n3. Pour chaque phase, décris les actions clés et les outils utilisés.\n4. Inclut un exemple de résultat attendu pour la phase "Improve".',
      criteres: 'Structure DMAIC complète, outils appropriés, actions concrètes',
      role: 'consultant-senior',
      competences: 'Lean Six Sigma, amélioration des processus industriels',
      exemples: 'Input: Phase Define\nOutput: {\n  "Define": {\n    "actions": ["Définir le problème", "Identifier les CTQs", "Cartographier le processus"],\n    "tools": ["SIPOC", "Diagramme de Pareto"]\n  }\n}\n\nInput: Phase Measure\nOutput: {\n  "Measure": {\n    "actions": ["Mesurer la performance actuelle", "Collecter des données"],\n    "tools": ["Capabilité processus", "Gage R&R"]\n  }\n}',
      prefill: '{"DMAIC": {"Define": {"actions": ["Définir le problème", "Identifier les CTQs", "Cartographier le processus"], "tools": ["SIPOC", "Diagramme de Pareto"]}, "Measure": {"actions": ["Mesurer la performance actuelle", "Collecter des données"], "tools": ["Capabilité processus", "Gage R&R"]}}}',
      longueur: 'détaillée',
      creativite: 'factuelle',
      format: 'json',
      reasoning: 'step-by-step',
      eagerness: 'high',
      reasoningEffort: 'high',
      verbosity: 'detailed',
      allowUnknown: false,
      requireSources: true,
      useXml: true
    }
  },

  {
    id: 'swot-quiz',
    title: 'Quiz SWOT',
    category: 'education',
    description: 'Quiz de formation sur l\'analyse SWOT',
    tags: ['quiz', 'formation', 'swot', 'éducation'],
    data: {
      objectif: 'créer un quiz de 5 questions à choix multiples sur l\'analyse SWOT',
      audience: ['intermédiaire'],
      contexte: 'Public cible : étudiants en gestion d\'entreprise\nNiveau : intermédiaire\nObjectif : Évaluer la compréhension des concepts clés de l\'analyse SWOT',
      instructions: '1. Fournis la sortie au format JSON.\n2. Chaque question doit avoir 4 options (A, B, C, D) avec une seule bonne réponse.\n3. Inclut une explication pour chaque bonne réponse.\n4. Les questions doivent couvrir : définition, facteurs internes/externes, interprétation de la matrice.',
      criteres: 'Questions pertinentes, niveau approprié, explications claires',
      role: 'expert-marketing',
      competences: 'stratégie d\'entreprise, analyse SWOT, formation',
      exemples: 'Input: Question sur définition SWOT\nOutput: {\n  "question": "Que signifie le \'S\' dans SWOT ?",\n  "options": {\n    "A": "Strategy",\n    "B": "Strengths", \n    "C": "System",\n    "D": "Sales"\n  },\n  "correct_answer": "B",\n  "explanation": "Le \'S\' dans SWOT signifie \'Strengths\' (Forces), qui représentent les avantages internes de l\'entreprise."\n}',
      prefill: '{"questions": [{"question": "Que signifie le \'S\' dans SWOT ?", "options": {"A": "Strategy", "B": "Strengths", "C": "System", "D": "Sales"}, "correct_answer": "B", "explanation": "Le \'S\' dans SWOT signifie \'Strengths\' (Forces), qui représentent les avantages internes de l\'entreprise."}]}',
      longueur: 'moyenne',
      creativite: 'modérée',
      format: 'json',
      reasoning: 'justification',
      eagerness: 'medium',
      reasoningEffort: 'medium',
      verbosity: 'balanced',
      allowUnknown: false,
      requireSources: false,
      useXml: true
    }
  },

  {
    id: 'social-media-kpis',
    title: 'KPIs Réseaux Sociaux',
    category: 'marketing',
    description: 'KPIs pour campagne marketing digitale',
    tags: ['marketing', 'réseaux-sociaux', 'kpi', 'digital'],
    data: {
      objectif: 'recommander des KPIs pertinents pour mesurer l\'efficacité d\'une campagne marketing sur les réseaux sociaux',
      audience: ['expert', 'technique'],
      contexte: 'Entreprise fictive : "BrandBoost"\nSecteur : Agence de communication digitale\nCampagne : Lancement d\'un nouveau produit cosmétique sur Instagram et TikTok\nPublic cible : responsable marketing et chef de projet\nObjectif : Maximiser l\'engagement et les conversions',
      instructions: '1. Fournis la sortie au format JSON.\n2. Recommande 5 KPIs avec leur définition, formule, et objectif cible.\n3. Classe les KPIs par catégorie : Awareness, Engagement, Conversion.\n4. Justifie le choix de chaque KPI en lien avec les objectifs de la campagne.',
      criteres: 'KPIs mesurables, pertinents pour réseaux sociaux, objectifs réalistes',
      role: 'expert-marketing',
      competences: 'marketing digital, analyse de données',
      exemples: 'Input: KPI d\'engagement\nOutput: {\n  "name": "Taux d\'engagement",\n  "category": "Engagement", \n  "definition": "Pourcentage d\'interactions par rapport à la portée",\n  "formula": "(Likes + Commentaires + Partages) / Portée * 100",\n  "target": "≥ 3%",\n  "justification": "Mesure la pertinence du contenu pour l\'audience cible"\n}',
      prefill: '{"KPIs": [{"name": "Taux d\'engagement", "category": "Engagement", "definition": "Pourcentage d\'interactions par rapport à la portée", "formula": "(Likes + Commentaires + Partages) / Portée * 100", "target": "≥ 3%", "justification": "Mesure la pertinence du contenu pour l\'audience cible"}]}',
      longueur: 'détaillée',
      creativite: 'modérée',
      format: 'json',
      reasoning: 'justification',
      eagerness: 'medium',
      reasoningEffort: 'medium',
      verbosity: 'balanced',
      allowUnknown: false,
      requireSources: false,
      useXml: true
    }
  },

  {
    id: 'lean-six-sigma-deployment',
    title: 'Déploiement Lean Six Sigma',
    category: 'business',
    description: 'Plan de déploiement d\'une démarche Lean Six Sigma',
    tags: ['lean', 'six-sigma', 'transformation', 'déploiement'],
    data: {
      objectif: 'élaborer un plan de déploiement d\'une démarche Lean Six Sigma dans une entreprise de services',
      audience: ['équipe-direction', 'expert'],
      contexte: 'Entreprise fictive : "ServicePro"\nSecteur : Services financiers (banque en ligne)\nPublic cible : direction générale et responsables opérationnels\nObjectif : Réduire les délais de traitement des demandes de prêt de 30%',
      instructions: '1. Fournis la sortie au format JSON.\n2. Structure ton plan en 3 phases : Préparation, Déploiement, Pérennisation.\n3. Pour chaque phase, décris les actions clés, les acteurs impliqués, et les livrables attendus.\n4. Inclut un calendrier prévisionnel sur 12 mois.',
      criteres: 'Plan structuré, phases logiques, calendrier réaliste, acteurs identifiés',
      role: 'consultant-senior',
      competences: 'Lean Six Sigma, transformation organisationnelle',
      exemples: 'Input: Phase de préparation\nOutput: {\n  "Préparation": {\n    "actions": ["Diagnostic initial", "Formation des Yellow Belts", "Sélection des projets pilotes"],\n    "actors": ["Direction", "Consultant externe", "Responsables opérationnels"],\n    "deliverables": ["Rapport de diagnostic", "Plan de formation", "Cahier des charges projets pilotes"],\n    "timeline": "Mois 1-3"\n  }\n}',
      prefill: '{"plan": {"Préparation": {"actions": ["Diagnostic initial", "Formation des Yellow Belts", "Sélection des projets pilotes"], "actors": ["Direction", "Consultant externe", "Responsables opérationnels"], "deliverables": ["Rapport de diagnostic", "Plan de formation", "Cahier des charges projets pilotes"], "timeline": "Mois 1-3"}}}',
      longueur: 'détaillée',
      creativite: 'factuelle',
      format: 'json',
      reasoning: 'step-by-step',
      eagerness: 'high',
      reasoningEffort: 'high',
      verbosity: 'detailed',
      allowUnknown: false,
      requireSources: true,
      useXml: true
    }
  }
];

// Fonctions utilitaires
function getExamplesByCategory(category) {
  return promptExamples.filter(function(example) { 
    return example.category === category; 
  });
}

function getExampleById(id) {
  return promptExamples.find(function(example) { 
    return example.id === id; 
  });
}

function getCategories() {
  var categories = promptExamples.map(function(example) { 
    return example.category; 
  });
  return categories.filter(function(value, index, self) { 
    return self.indexOf(value) === index; 
  }).sort();
}

// État de l'application
const appState = {
  currentStep: 'home',
  data: {},
  currentCategory: 'all',
  searchTerm: ''
};

// === NAVIGATION ===
function showView(viewId) {
  document.querySelectorAll('[id$="-view"]').forEach(view => {
    view.classList.add('hidden');
  });
  document.getElementById(viewId).classList.remove('hidden');
  appState.currentStep = viewId.replace('-view', '');
}

function goHome() { 
  showView('home-view'); 
}

function startBuilder() { 
  showView('step1-view'); 
}

function goToStep1() { 
  showView('step1-view'); 
}

function goToStep2() { 
  collectStep1Data(); 
  showView('step2-view'); 
}

function goToStep3() { 
  collectStep2Data(); 
  showView('step3-view'); 
}

// === COLLECTE DES DONNÉES ===
function collectStep1Data() {
  appState.data.objectif = document.getElementById('objectif').value;
  appState.data.audience = Array.from(document.getElementById('audience').selectedOptions).map(opt => opt.value);
  appState.data.contexte = document.getElementById('contexte').value;
  appState.data.instructions = document.getElementById('instructions').value;
  appState.data.criteres = document.getElementById('criteres').value;
}

function collectStep2Data() {
  appState.data.role = document.getElementById('role').value;
  appState.data.roleCustom = document.getElementById('role-custom').value;
  appState.data.competences = document.getElementById('competences').value;
  appState.data.exemples = document.getElementById('exemples').value;
  appState.data.prefill = document.getElementById('prefill').value;
}

function collectStep3Data() {
  appState.data.longueur = document.getElementById('longueur').value;
  appState.data.creativite = document.getElementById('creativite').value;
  appState.data.format = document.getElementById('format').value;
  appState.data.reasoning = document.getElementById('reasoning').value;
  appState.data.eagerness = document.getElementById('eagerness').value;
  appState.data.reasoningEffort = document.getElementById('reasoning-effort').value;
  appState.data.verbosity = document.getElementById('verbosity').value;
  appState.data.allowUnknown = document.getElementById('allow-unknown').checked;
  appState.data.requireSources = document.getElementById('require-sources').checked;
  appState.data.useXml = document.getElementById('use-xml').checked;
}

// === HELPERS POUR LES SUGGESTIONS ===
function fillObjectif(text) {
  document.getElementById('objectif').value = text + ' ';
  document.getElementById('objectif').focus();
}

function addCompetence(competence) {
  const input = document.getElementById('competences');
  const current = input.value;
  input.value = current ? current + ', ' + competence : competence;
}

// === GÉNÉRATION DU PROMPT ===
function generatePrompt() {
  collectStep3Data();
  
  const data = appState.data;
  const roleText = data.role === 'personnalisé' ? data.roleCustom : getRoleText(data.role);
  
  let prompt;
  
  if (data.useXml) {
    // Structure XML avancée
    prompt = generateAdvancedXmlPrompt(data, roleText);
  } else {
    // Structure XML simple
    prompt = generateSimpleXmlPrompt(data, roleText);
  }

  document.getElementById('generated-prompt').textContent = prompt;
  showView('result-view');
}

function generateAdvancedXmlPrompt(data, roleText) {
  let prompt = `<instructions>
Tu es ${roleText}${data.competences ? ` avec les compétences suivantes : ${data.competences}` : ''}.
Ta tâche est de ${data.objectif || 'répondre à la demande de l\'utilisateur'}.
</instructions>

${data.contexte ? `<context>
${data.contexte}
</context>

` : ''}${data.instructions ? `<requirements>
${data.instructions.split('\n').map(line => line.trim()).filter(line => line).map((line, i) => `${i + 1}. ${line}`).join('\n')}
${data.criteres ? `\nCritères de succès : ${data.criteres}` : ''}
${generateReasoningInstructions(data.reasoning)}
${generateFormatRequirements(data)}
</requirements>

` : ''}${data.exemples ? `<example>
${data.exemples}
</example>

` : ''}${data.prefill ? `<formatting>
${generateFormattingInstructions(data)}
${data.prefill ? `Sortie attendue (à compléter) : ${data.prefill}` : ''}
</formatting>` : `<formatting>
${generateFormattingInstructions(data)}
</formatting>`}`;

  return prompt;
}

function generateSimpleXmlPrompt(data, roleText) {
  return `<prompt>
  <role>
    <nom>${roleText}</nom>
    ${data.competences ? `<competences>
      ${data.competences.split(',').map(c => `<competence>${c.trim()}</competence>`).join('\n      ')}
    </competences>` : ''}
  </role>
  
  <objectif>
    ${data.objectif || 'Non spécifié'}
  </objectif>
  
  <audience>
    ${data.audience.map(a => `<type>${a}</type>`).join('\n    ')}
  </audience>
  
  ${data.contexte ? `<contexte>
    ${data.contexte}
  </contexte>` : ''}
  
  ${data.instructions ? `<instructions>
    ${data.instructions}
  </instructions>` : ''}
  
  ${data.exemples ? `<exemples>
    ${data.exemples}
  </exemples>` : ''}
  
  ${data.criteres ? `<criteres_succes>
    ${data.criteres}
  </criteres_succes>` : ''}
  
  <options>
    <longueur>${data.longueur}</longueur>
    <creativite>${data.creativite}</creativite>
    <autonomie>${data.eagerness}</autonomie>
    <profondeur_analyse>${data.reasoningEffort}</profondeur_analyse>
    <verbosity>${data.verbosity}</verbosity>
    ${data.reasoning !== 'none' ? `<raisonnement>${data.reasoning}</raisonnement>` : ''}
    ${data.allowUnknown ? '<autoriser_je_ne_sais_pas>true</autoriser_je_ne_sais_pas>' : ''}
    ${data.requireSources ? '<exiger_sources>true</exiger_sources>' : ''}
  </options>
  
  <format_de_sortie>
    <type>${data.format}</type>
    ${data.prefill ? `<prefill>${data.prefill}</prefill>` : ''}
  </format_de_sortie>
</prompt>`;
}

function generateReasoningInstructions(reasoningType) {
  const instructions = {
    'step-by-step': 'Réfléchis étape par étape avant de donner ta réponse finale.',
    'justification': 'Justifie chacun de tes choix et explique ton raisonnement.',
    'auto-reflexion': 'Commence par analyser la demande, réfléchis aux approches possibles, puis donne ta réponse.'
  };
  
  return reasoningType !== 'none' ? `\n${instructions[reasoningType] || ''}` : '';
}

function generateFormatRequirements(data) {
  let requirements = [];
  
  if (data.format === 'json') {
    requirements.push('Fournis la sortie uniquement au format JSON.');
  } else if (data.format === 'rapport') {
    requirements.push('Structure ta réponse comme un rapport professionnel.');
  } else if (data.format === 'liste') {
    requirements.push('Présente ta réponse sous forme de liste organisée.');
  }
  
  if (data.longueur === 'courte') {
    requirements.push('Réponse concise (100-300 mots maximum).');
  } else if (data.longueur === 'détaillée') {
    requirements.push('Réponse détaillée et exhaustive (600+ mots).');
  }
  
  if (data.requireSources) {
    requirements.push('Inclus des sources ou références quand c\'est pertinent.');
  }
  
  if (data.allowUnknown) {
    requirements.push('N\'hésite pas à dire "Je ne sais pas" si tu n\'es pas certain.');
  }
  
  return requirements.length > 0 ? `\n${requirements.join('\n')}` : '';
}

function generateFormattingInstructions(data) {
  let instructions = `Format de sortie requis : ${data.format}`;
  
  if (data.format === 'json') {
    instructions += '\nPas d\'introduction, uniquement le JSON.';
  }
  
  return instructions;
}

function getRoleText(roleId) {
  const roles = {
    'consultant-senior': 'Consultant Senior en Stratégie',
    'analyste-données': 'Analyste de Données Expert',
    'expert-marketing': 'Expert Marketing Digital',
    'développeur-senior': 'Développeur Senior',
    'rédacteur-technique': 'Rédacteur Technique Spécialisé'
  };
  return roles[roleId] || 'Expert dans le domaine';
}

// === COPIE DU PROMPT ===
function copyPrompt() {
  const prompt = document.getElementById('generated-prompt').textContent;
  navigator.clipboard.writeText(prompt).then(() => {
    const btn = document.getElementById('copy-btn');
    const original = btn.textContent;
    btn.textContent = 'Copié !';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 2000);
  });
}

function showLibrary() {
  showView('library-view');
  renderLibrary();
}

function renderLibrary() {
  var libraryContent = document.getElementById('library-content');
  if (!libraryContent) return;

  var categories = getCategories();
  var filteredExamples = filterExamples();

  var html = '<div class="library-header">' +
    '<div class="library-search">' +
      '<input type="text" id="library-search" class="form-input" placeholder="Rechercher des exemples..." value="' + appState.searchTerm + '">' +
    '</div>' +
    '<div class="library-filters">' +
      '<select id="category-filter" class="form-input">' +
        '<option value="all">Toutes les catégories</option>' +
        categories.map(function(cat) { 
          return '<option value="' + cat + '"' + (appState.currentCategory === cat ? ' selected' : '') + '>' + getCategoryDisplayName(cat) + '</option>'; 
        }).join('') +
      '</select>' +
    '</div>' +
  '</div>' +
  '<div class="library-examples">' +
    filteredExamples.map(function(example) {
      return '<div class="example-card" data-example-id="' + example.id + '">' +
        '<h3>' + example.title + '</h3>' +
        '<p class="example-description">' + example.description + '</p>' +
        '<div class="example-tags">' +
          example.tags.map(function(tag) { 
            return '<span class="tag">' + tag + '</span>'; 
          }).join('') +
        '</div>' +
        '<div class="example-actions">' +
          '<button class="btn-secondary" data-action="preview-example" data-example-id="' + example.id + '">Aperçu</button>' +
          '<button class="btn-primary" data-action="use-example" data-example-id="' + example.id + '">Utiliser</button>' +
        '</div>' +
      '</div>';
    }).join('') +
  '</div>';

  libraryContent.innerHTML = html;

  // Event listeners pour la recherche et les filtres
  var searchInput = document.getElementById('library-search');
  var categoryFilter = document.getElementById('category-filter');

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      appState.searchTerm = e.target.value;
      renderLibrary();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', function(e) {
      appState.currentCategory = e.target.value;
      renderLibrary();
    });
  }

  // Event listeners pour les actions des exemples
  document.querySelectorAll('[data-action="preview-example"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var exampleId = e.target.getAttribute('data-example-id');
      previewExample(exampleId);
    });
  });

  document.querySelectorAll('[data-action="use-example"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var exampleId = e.target.getAttribute('data-example-id');
      useExample(exampleId);
    });
  });
}

function filterExamples() {
  var examples = promptExamples;

  // Filtrer par catégorie
  if (appState.currentCategory !== 'all') {
    examples = getExamplesByCategory(appState.currentCategory);
  }

  // Filtrer par terme de recherche
  if (appState.searchTerm.trim()) {
    var searchTerms = appState.searchTerm.toLowerCase().split(' ');
    examples = examples.filter(function(example) {
      return searchTerms.some(function(term) {
        return example.title.toLowerCase().includes(term) ||
               example.description.toLowerCase().includes(term) ||
               example.tags.some(function(tag) { 
                 return tag.toLowerCase().includes(term); 
               });
      });
    });
  }

  return examples;
}

function getCategoryDisplayName(category) {
  const categoryNames = {
    'business': 'Business',
    'marketing': 'Marketing',
    'education': 'Éducation',
    'technical': 'Technique',
    'creative': 'Créatif'
  };
  return categoryNames[category] || category;
}

function previewExample(exampleId) {
  var example = getExampleById(exampleId);
  if (!example) return;

  // Générer le prompt pour l'aperçu
  var data = example.data;
  var roleText = data.role === 'personnalisé' ? data.roleCustom : getRoleText(data.role);
  
  var prompt = data.useXml ? 
    generateAdvancedXmlPrompt(data, roleText) :
    generateSimpleXmlPrompt(data, roleText);

  // Afficher dans une modal ou une nouvelle vue
  showPreviewModal(example.title, prompt);
}

function showPreviewModal(title, prompt) {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = 
    '<div class="modal-content">' +
      '<div class="modal-header">' +
        '<h2>' + title + '</h2>' +
        '<button class="modal-close" data-action="close-modal">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<pre class="prompt-preview">' + prompt + '</pre>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn-secondary" data-action="close-modal">Fermer</button>' +
        '<button class="btn-primary" data-action="copy-preview">Copier</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);

  // Event listeners pour la modal
  modal.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') || e.target.getAttribute('data-action') === 'close-modal') {
      document.body.removeChild(modal);
    }
  });

  modal.querySelector('[data-action="copy-preview"]').addEventListener('click', function() {
    navigator.clipboard.writeText(prompt).then(function() {
      var btn = modal.querySelector('[data-action="copy-preview"]');
      var original = btn.textContent;
      btn.textContent = 'Copié !';
      setTimeout(function() {
        btn.textContent = original;
      }, 2000);
    });
  });
}

function useExample(exampleId) {
  var example = getExampleById(exampleId);
  if (!example) return;

  // Charger les données de l'exemple dans l'état de l'app
  appState.data = Object.assign({}, example.data);

  // Remplir les champs du formulaire et aller à l'étape 1
  fillFormWithExampleData(example.data);
  showView('step1-view');
}

function fillFormWithExampleData(data) {
  // Remplir tous les champs disponibles
  setTimeout(function() {
    if (data.objectif) document.getElementById('objectif').value = data.objectif;
    if (data.contexte) document.getElementById('contexte').value = data.contexte;
    if (data.instructions) document.getElementById('instructions').value = data.instructions;
    if (data.criteres) document.getElementById('criteres').value = data.criteres;
    
    // Audience (multi-select)
    if (data.audience) {
      var audienceSelect = document.getElementById('audience');
      if (audienceSelect) {
        Array.from(audienceSelect.options).forEach(function(option) {
          option.selected = data.audience.indexOf(option.value) !== -1;
        });
      }
    }

    // Données étape 2
    if (data.role) {
      var roleSelect = document.getElementById('role');
      if (roleSelect) {
        roleSelect.value = data.role;
        if (data.role === 'personnalisé' && data.roleCustom) {
          document.getElementById('role-custom').classList.remove('hidden');
          document.getElementById('role-custom').value = data.roleCustom;
        }
      }
    }
    
    if (data.competences) document.getElementById('competences').value = data.competences;
    if (data.exemples) document.getElementById('exemples').value = data.exemples;
    if (data.prefill) document.getElementById('prefill').value = data.prefill;

    // Données étape 3
    if (data.longueur) document.getElementById('longueur').value = data.longueur;
    if (data.creativite) document.getElementById('creativite').value = data.creativite;
    if (data.format) document.getElementById('format').value = data.format;
    if (data.reasoning) document.getElementById('reasoning').value = data.reasoning;
    if (data.eagerness) document.getElementById('eagerness').value = data.eagerness;
    if (data.reasoningEffort) document.getElementById('reasoning-effort').value = data.reasoningEffort;
    if (data.verbosity) document.getElementById('verbosity').value = data.verbosity;
    
    if (typeof data.allowUnknown !== 'undefined') document.getElementById('allow-unknown').checked = data.allowUnknown;
    if (typeof data.requireSources !== 'undefined') document.getElementById('require-sources').checked = data.requireSources;
    if (typeof data.useXml !== 'undefined') document.getElementById('use-xml').checked = data.useXml;
  }, 100);
}

// === INITIALISATION QUAND LE DOM EST CHARGÉ ===
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing GRID extension...');
  
  // === EVENT LISTENERS POUR LA NAVIGATION ===
  
  // Page d'accueil
  const newPromptCard = document.querySelector('[data-action="start-builder"]');
  const libraryCard = document.querySelector('[data-action="show-library"]');
  
  if (newPromptCard) newPromptCard.addEventListener('click', startBuilder);
  if (libraryCard) libraryCard.addEventListener('click', showLibrary);
  
  // Boutons de navigation
  document.querySelectorAll('[data-action="go-home"]').forEach(btn => {
    btn.addEventListener('click', goHome);
  });
  
  document.querySelectorAll('[data-action="go-step1"]').forEach(btn => {
    btn.addEventListener('click', goToStep1);
  });
  
  document.querySelectorAll('[data-action="go-step2"]').forEach(btn => {
    btn.addEventListener('click', goToStep2);
  });
  
  document.querySelectorAll('[data-action="go-step3"]').forEach(btn => {
    btn.addEventListener('click', goToStep3);
  });
  
  document.querySelectorAll('[data-action="generate-prompt"]').forEach(btn => {
    btn.addEventListener('click', generatePrompt);
  });
  
  document.querySelectorAll('[data-action="copy-prompt"]').forEach(btn => {
    btn.addEventListener('click', copyPrompt);
  });
  
  // === EVENT LISTENERS POUR LES SUGGESTIONS ===
  
  // Suggestions d'objectifs
  document.querySelectorAll('[data-suggestion="objectif"]').forEach(tag => {
    tag.addEventListener('click', function() {
      fillObjectif(this.textContent);
    });
  });
  
  // Suggestions de compétences  
  document.querySelectorAll('[data-suggestion="competence"]').forEach(tag => {
    tag.addEventListener('click', function() {
      addCompetence(this.textContent);
    });
  });
  
  // === GESTION DU RÔLE PERSONNALISÉ ===
  const roleSelect = document.getElementById('role');
  const roleCustomInput = document.getElementById('role-custom');
  
  if (roleSelect && roleCustomInput) {
    roleSelect.addEventListener('change', function() {
      if (this.value === 'personnalisé') {
        roleCustomInput.classList.remove('hidden');
        roleCustomInput.focus();
      } else {
        roleCustomInput.classList.add('hidden');
      }
    });
  }

  // === MISE À JOUR DYNAMIQUE DU COMPTEUR DE TEMPLATES ===
  function updateTemplateCount() {
    const templateCountBadge = document.getElementById('template-count-badge');
    if (templateCountBadge && promptExamples) {
      const count = promptExamples.length;
      templateCountBadge.textContent = `${count} TEMPLATE${count > 1 ? 'S' : ''}`;
    }
  }

  // Appeler la fonction pour mettre à jour le compteur
  updateTemplateCount();
  
  console.log('GRID extension initialized successfully');
});