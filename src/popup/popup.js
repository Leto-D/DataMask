// GRID Extension - Popup Script
console.log('GRID Extension popup script loaded');

// Import des exemples de prompts et utilitaires depuis le module externe
import { 
  promptExamples, 
  getExamplesByCategory, 
  getExampleById, 
  getCategories 
} from '../utils/promptExamples.js';

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
  const input = document.getElementById('objectif');
  const currentValue = input.value;
  if (currentValue.trim() === '') {
    input.value = text + ' ';
  } else {
    // Insérer au début si pas vide
    input.value = text + ' ' + currentValue;
  }
  input.focus();
  // Positionner le curseur après le texte ajouté
  const pos = text.length + 1;
  input.setSelectionRange(pos, pos);
}

function addCompetence(competence) {
  const input = document.getElementById('competences');
  const current = input.value.trim();
  // Ne pas ajouter si la compétence existe déjà
  if (current && current.toLowerCase().includes(competence.toLowerCase())) {
    return;
  }
  input.value = current ? current + ', ' + competence : competence;
  input.focus();
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
  const sections = [];
  
  // Instructions principales
  sections.push(`<instructions>
Tu es ${roleText}${data.competences ? ` avec les compétences suivantes : ${data.competences}` : ''}.
Ta tâche est de ${data.objectif || 'répondre à la demande de l\'utilisateur'}.
</instructions>`);

  // Contexte si fourni
  if (data.contexte) {
    sections.push(`<context>
${data.contexte}
</context>`);
  }

  // Exigences si fournies
  if (data.instructions) {
    const formattedInstructions = data.instructions
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map((line, i) => `${i + 1}. ${line}`)
      .join('\n');
    
    const requirements = [
      formattedInstructions,
      data.criteres ? `\nCritères de succès : ${data.criteres}` : '',
      generateReasoningInstructions(data.reasoning),
      generateFormatRequirements(data)
    ].filter(Boolean).join('');

    sections.push(`<requirements>${requirements}
</requirements>`);
  }

  // Exemples si fournis
  if (data.exemples) {
    sections.push(`<example>
${data.exemples}
</example>`);
  }

  // Formatage
  const formattingContent = [
    generateFormattingInstructions(data),
    data.prefill ? `Sortie attendue (à compléter) : ${data.prefill}` : ''
  ].filter(Boolean).join('\n');

  sections.push(`<formatting>
${formattingContent}
</formatting>`);

  return sections.join('\n\n');
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
  
  return reasoningType !== 'none' && instructions[reasoningType] 
    ? `\n${instructions[reasoningType]}` 
    : '';
}

function generateFormatRequirements(data) {
  const requirements = [];
  
  // Format de sortie
  const formatMap = {
    'json': 'Fournis la sortie uniquement au format JSON.',
    'rapport': 'Structure ta réponse comme un rapport professionnel.',
    'liste': 'Présente ta réponse sous forme de liste organisée.'
  };
  
  if (formatMap[data.format]) {
    requirements.push(formatMap[data.format]);
  }
  
  // Longueur
  const lengthMap = {
    'courte': 'Réponse concise (100-300 mots maximum).',
    'détaillée': 'Réponse détaillée et exhaustive (600+ mots).'
  };
  
  if (lengthMap[data.longueur]) {
    requirements.push(lengthMap[data.longueur]);
  }
  
  // Options avancées
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