// GRID Extension - Popup Script
console.log('GRID Extension popup script loaded');

// État de l'application
const appState = {
  currentStep: 'home',
  data: {}
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
    btn.textContent = '✅ Copié !';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 2000);
  });
}

function showLibrary() {
  alert('Bibliothèque - En développement');
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
  
  console.log('GRID extension initialized successfully');
});