// library.js - Templates, exemples de prompts, bibliotheque
// Templates adaptes au nouveau builder 6 sections (XML plat)

import { i18n } from './i18n.js';
import { fallbackCopy } from './state.js';

const promptExamples = {
  'strategy': [
    {
      id: 'business-strategy',
      title_fr: 'Strategie Business',
      title_en: 'Business Strategy',
      title_de: 'Geschaeftsstrategie',
      description_fr: 'Analyser et developper des strategies business',
      description_en: 'Analyze and develop business strategies',
      description_de: 'Geschaeftsstrategien analysieren und entwickeln',
      prompt: `<role>
Tu es Consultant Senior en Strategie avec une expertise en Analyse strategique, Vision business, Planification. Ton : professionnel.
</role>

<task>
Developper une strategie business complete pour [ENTREPRISE] dans le secteur [SECTEUR].

Instructions :
1. Analyser la position actuelle (SWOT)
2. Identifier les opportunites de croissance
3. Proposer un plan d'action a 12 mois
4. Definir les KPIs de suivi
</task>

<context>
Entreprise : [ENTREPRISE]
Secteur : [SECTEUR]
Taille : [TAILLE]
Objectifs : [OBJECTIFS]
</context>

<constraints>
Recommandations actionnables et chiffrees. Prioriser par impact et faisabilite.
</constraints>

<output>
Format : rapport | Longueur : detaillee
</output>

<parameters>
Creativite : moderee | Profondeur : approfondie | Autonomie : moyenne | Verbosite : equilibree
</parameters>`
    },
    {
      id: 'market-analysis',
      title_fr: 'Analyse de Marche',
      title_en: 'Market Analysis',
      title_de: 'Marktanalyse',
      description_fr: 'Analyser un marche et ses opportunites',
      description_en: 'Analyze a market and its opportunities',
      description_de: 'Markt und Chancen analysieren',
      prompt: `<role>
Tu es Analyste de Marche avec une expertise en Recherche, Analyse de donnees, Veille concurrentielle. Ton : professionnel.
</role>

<task>
Effectuer une analyse complete du marche [MARCHE] pour identifier les opportunites, menaces et tendances emergentes.
</task>

<context>
Marche cible : [MARCHE]
Zone geographique : [ZONE]
Periode : [ANNEE]
</context>

<constraints>
Inclure des donnees chiffrees. Citer les sources si possible.
</constraints>

<output>
Format : rapport | Longueur : detaillee
</output>

<parameters>
Creativite : factuelle | Profondeur : approfondie | Verbosite : detaillee
</parameters>`
    }
  ],
  'content': [
    {
      id: 'technical-writing',
      title_fr: 'Redaction Technique',
      title_en: 'Technical Writing',
      title_de: 'Technisches Schreiben',
      description_fr: 'Creer de la documentation technique claire',
      description_en: 'Create clear technical documentation',
      description_de: 'Klare technische Dokumentation erstellen',
      prompt: `<role>
Tu es Redacteur Technique avec une expertise en Documentation, Communication technique, Vulgarisation. Ton : professionnel.
</role>

<task>
Rediger une documentation technique pour [PRODUIT/SERVICE] destinee a [AUDIENCE_CIBLE].

Instructions :
1. Introduction et vue d'ensemble
2. Guide de demarrage rapide
3. Reference detaillee des fonctionnalites
4. FAQ et depannage
</task>

<context>
Produit : [PRODUIT/SERVICE]
Audience : [AUDIENCE_CIBLE]
Niveau technique : [DEBUTANT/INTERMEDIAIRE/EXPERT]
</context>

<constraints>
Langage clair et accessible. Exemples concrets pour chaque section.
</constraints>

<output>
Format : rapport | Longueur : detaillee
</output>

<parameters>
Creativite : factuelle | Profondeur : standard | Verbosite : equilibree
</parameters>`
    },
    {
      id: 'marketing-copy',
      title_fr: 'Copy Marketing',
      title_en: 'Marketing Copy',
      title_de: 'Marketing-Text',
      description_fr: 'Creer du contenu marketing persuasif',
      description_en: 'Create persuasive marketing content',
      description_de: 'Ueberzeugenden Marketing-Content erstellen',
      prompt: `<role>
Tu es Expert Marketing avec une expertise en Copywriting, Persuasion, Communication. Ton : direct.
</role>

<task>
Creer un copy marketing pour [PRODUIT] ciblant [AUDIENCE] avec l'objectif de [OBJECTIF_MARKETING].
</task>

<context>
Produit : [PRODUIT]
Audience cible : [AUDIENCE]
Canal : [EMAIL/SITE WEB/RESEAUX SOCIAUX]
</context>

<constraints>
Ton persuasif mais authentique. Inclure un appel a l'action clair.
</constraints>

<output>
Format : texte | Longueur : moyenne
</output>

<parameters>
Creativite : creative | Autonomie : elevee | Verbosite : concise
</parameters>`
    }
  ],
  'analysis': [
    {
      id: 'data-analysis',
      title_fr: 'Analyse de Donnees',
      title_en: 'Data Analysis',
      title_de: 'Datenanalyse',
      description_fr: 'Analyser et interpreter des donnees',
      description_en: 'Analyze and interpret data',
      description_de: 'Daten analysieren und interpretieren',
      prompt: `<role>
Tu es Analyste de Donnees avec une expertise en Statistiques, Visualisation, Insights business. Ton : professionnel.
</role>

<task>
Analyser les donnees [TYPE_DONNEES] pour identifier les tendances, anomalies et recommandations actionnables.
</task>

<context>
Type de donnees : [TYPE_DONNEES]
Volume : [VOLUME]
Periode : [PERIODE]
Donnees : [COLLER VOS DONNEES ICI]
</context>

<constraints>
Distinguer correlation et causalite. Indiquer le niveau de confiance des conclusions.
Incertitude : indiquer le niveau de confiance
</constraints>

<output>
Format : rapport | Longueur : detaillee
</output>

<parameters>
Creativite : factuelle | Profondeur : approfondie | Verbosite : detaillee
</parameters>`
    },
    {
      id: 'legal-review',
      title_fr: 'Analyse Juridique',
      title_en: 'Legal Review',
      title_de: 'Rechtliche Analyse',
      description_fr: 'Analyser un document ou une situation juridique',
      description_en: 'Analyze a legal document or situation',
      description_de: 'Rechtliches Dokument oder Situation analysieren',
      prompt: `<role>
Tu es Juriste Senior avec une expertise en Droit des affaires, Conformite, Analyse contractuelle. Ton : professionnel.
</role>

<task>
Analyser [DOCUMENT/SITUATION] et identifier les risques juridiques, obligations et recommandations.

Instructions :
1. Resume des points cles
2. Identification des risques
3. Obligations des parties
4. Recommandations
</task>

<context>
Document : [TYPE DE DOCUMENT]
Juridiction : [PAYS/REGION]
Secteur : [SECTEUR]
</context>

<constraints>
Ne pas constituer un avis juridique formel. Identifier les zones d'incertitude.
Incertitude : dire "je ne suis pas sur"
Sources : requises
</constraints>

<output>
Format : rapport | Longueur : detaillee
</output>

<parameters>
Creativite : factuelle | Profondeur : approfondie | Verbosite : detaillee
</parameters>`
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

function copyTemplateToClipboard(text) {
  try {
    navigator.clipboard.writeText(text).then(() => {
    }).catch(() => {
      fallbackCopy(text);
    });
  } catch (err) {
    fallbackCopy(text);
  }
}

function attachTemplateListeners() {
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', function () {
      const templateId = this.getAttribute('data-template-id');
      const template = getExampleById(templateId);
      if (template) {
        // Copy to clipboard as immediate action
        copyTemplateToClipboard(template.prompt);
        // Visual feedback on the card
        this.style.borderColor = 'var(--amber-600)';
        const titleEl = this.querySelector('.tc-title');
        if (titleEl) {
          const orig = titleEl.textContent;
          titleEl.textContent = '✓ ' + orig;
          setTimeout(() => {
            titleEl.textContent = orig;
            card.style.borderColor = '';
          }, 1200);
        }
      }
    });
  });
}

export function renderLibrary() {
  const libraryContainer = document.getElementById('library-content');
  if (!libraryContainer) return;

  libraryContainer.innerHTML = '';

  const categories = [
    { id: 'strategy', name_fr: 'Strategie', name_en: 'Strategy', name_de: 'Strategie', tag: 'finance' },
    { id: 'content', name_fr: 'Contenu', name_en: 'Content', name_de: 'Inhalt', tag: 'redaction' },
    { id: 'analysis', name_fr: 'Analyse', name_en: 'Analysis', name_de: 'Analyse', tag: 'technique' }
  ];

  categories.forEach(category => {
    const categoryName = category[`name_${i18n.currentLanguage}`] || category.name_fr;
    const examples = getExamplesByCategory(category.id);
    if (examples.length === 0) return;

    const sectionTitle = document.createElement('div');
    sectionTitle.style.cssText = 'font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 0 4px; margin-top: 8px;';
    sectionTitle.textContent = categoryName;
    libraryContainer.appendChild(sectionTitle);

    examples.forEach(example => {
      const title = example[`title_${i18n.currentLanguage}`] || example.title_fr;
      const description = example[`description_${i18n.currentLanguage}`] || example.description_fr;

      const card = document.createElement('div');
      card.className = 'template-card';
      card.setAttribute('data-template-id', example.id);
      card.setAttribute('data-tags', category.tag);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'tc-content';

      const h4 = document.createElement('div');
      h4.className = 'tc-title';
      h4.textContent = title;

      const p = document.createElement('div');
      p.className = 'tc-desc';
      p.textContent = description;

      contentDiv.appendChild(h4);
      contentDiv.appendChild(p);

      // Arrow icon
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('class', 'tc-arrow');
      arrow.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z');
      arrow.appendChild(path);

      card.appendChild(contentDiv);
      card.appendChild(arrow);
      libraryContainer.appendChild(card);
    });
  });

  attachTemplateListeners();
}

export function attachSuggestionListeners() {
  document.querySelectorAll('.suggestion-tag[data-suggestion="objectif"]').forEach(suggestion => {
    suggestion.addEventListener('click', function () {
      const objectiveInput = document.getElementById('objective');
      if (objectiveInput) {
        const currentValue = objectiveInput.value;
        const suggestionText = this.textContent;
        if (currentValue.includes(suggestionText)) return;
        if (!currentValue.trim()) {
          objectiveInput.value = suggestionText;
        } else {
          objectiveInput.value = currentValue + (currentValue.endsWith(',') || currentValue.endsWith(', ') ? ' ' : ', ') + suggestionText;
        }
        objectiveInput.focus();
      }
    });
  });

  document.querySelectorAll('.suggestion-tag[data-suggestion="competence"]').forEach(suggestion => {
    suggestion.addEventListener('click', function () {
      const competencesInput = document.getElementById('competences');
      if (competencesInput) {
        const currentValue = competencesInput.value;
        const suggestionText = this.textContent;
        if (currentValue.includes(suggestionText)) return;
        if (!currentValue.trim()) {
          competencesInput.value = suggestionText;
        } else {
          competencesInput.value = currentValue + (currentValue.endsWith(',') || currentValue.endsWith(', ') ? ' ' : ', ') + suggestionText;
        }
        competencesInput.focus();
      }
    });
  });
}

export function initLibrary() {
  attachSuggestionListeners();
}
