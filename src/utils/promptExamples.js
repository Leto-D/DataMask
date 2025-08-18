// GRID Extension - Exemples de Prompts
// Collection d'exemples de prompts structurés

export const promptExamples = [
  {
    id: 'swot-analysis',
    title: 'Analyse SWOT d\'entreprise',
    category: 'business',
    description: 'Analyse stratégique complète au format Texte',
    tags: ['stratégie', 'analyse', 'swot', 'business'],
    data: {
      objectif: 'produire une analyse SWOT complète en Texte',
      audience: ['équipe-direction', 'expert'],
      contexte: 'Entreprise fictive : "LeadGenPro"\nSecteur : Logiciels B2B pour la génération de leads industriels\nPublic cible : investisseurs et direction commerciale',
      instructions: '1. Fournis la sortie uniquement au format Texte.\n2. Chaque partie SWOT (forces, faiblesses, opportunités, menaces) doit contenir 3 à 5 points clairs.\n3. Utilise des phrases concises et orientées business.\n4. Pas d\'introduction, uniquement le Texte.',
      criteres: 'Réponse complète, cohérente, utilisable, format Texte strict',
      role: 'consultant-senior',
      competences: 'analyse stratégique, analyse SWOT',
      exemples: `Input: Analyser les forces internes
Output: "Large base de clients fidèles", "Technologie propriétaire innovante"

Input: Identifier une faiblesse
Output: "Dépendance à un seul canal de distribution"

Input: Opportunité de marché
Output: "Expansion vers l'Europe de l'Est"`,
      prefill: '{"Strengths": ["Large base de clients fidèles", "Technologie propriétaire innovante"], "Weaknesses": ["Dépendance à un seul canal de distribution"], "Opportunities": ["Expansion vers l\'Europe de l\'Est"], "Threats": ["Nouvelle réglementation sur la data"]}',
      longueur: 'moyenne',
      creativite: 'factuelle',
      format: 'Texte',
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
      instructions: '1. Fournis la sortie au format Texte.\n2. Définis 5 KPIs répartis dans les catégories : Approvisionnement, Transport, Stockage, Stocks.\n3. Pour chaque KPI, précise : nom, définition, formule de calcul, unité, et objectif cible.\n4. Inclut une brève justification du choix de chaque KPI.',
      criteres: 'KPIs mesurables, pertinents, réalistes, avec formules de calcul précises',
      role: 'consultant-senior',
      competences: 'logistique, gestion de la performance',
      exemples: `Input: KPI de livraison
Output: {
  "name": "Taux de livraison à temps",
  "definition": "Pourcentage de commandes livrées à la date promise",
  "formula": "(Nombre de commandes livrées à temps / Nombre total de commandes) * 100",
  "unit": "%",
  "target": "≥ 95%",
  "justification": "Indicateur clé de la satisfaction client et de l'efficacité du transport"
}`,
      prefill: '{"KPIs": [{"name": "Taux de livraison à temps", "definition": "Pourcentage de commandes livrées à la date promise", "formula": "(Nombre de commandes livrées à temps / Nombre total de commandes) * 100", "unit": "%", "target": "≥ 95%", "justification": "Indicateur clé de la satisfaction client et de l\'efficacité du transport"}]}',
      longueur: 'détaillée',
      creativite: 'factuelle',
      format: 'Texte',
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
      instructions: '1. Fournis la sortie au format Texte.\n2. Structure ta réponse selon les 5 phases DMAIC (Define, Measure, Analyze, Improve, Control).\n3. Pour chaque phase, décris les actions clés et les outils utilisés.\n4. Inclut un exemple de résultat attendu pour la phase "Improve".',
      criteres: 'Structure DMAIC complète, outils appropriés, actions concrètes',
      role: 'consultant-senior',
      competences: 'Lean Six Sigma, amélioration des processus industriels',
      exemples: `Input: Phase Define
Output: {
  "Define": {
    "actions": ["Définir le problème", "Identifier les CTQs", "Cartographier le processus"],
    "tools": ["SIPOC", "Diagramme de Pareto"]
  }
}

Input: Phase Measure
Output: {
  "Measure": {
    "actions": ["Mesurer la performance actuelle", "Collecter des données"],
    "tools": ["Capabilité processus", "Gage R&R"]
  }
}`,
      prefill: '{"DMAIC": {"Define": {"actions": ["Définir le problème", "Identifier les CTQs", "Cartographier le processus"], "tools": ["SIPOC", "Diagramme de Pareto"]}, "Measure": {"actions": ["Mesurer la performance actuelle", "Collecter des données"], "tools": ["Capabilité processus", "Gage R&R"]}}}',
      longueur: 'détaillée',
      creativite: 'factuelle',
      format: 'Texte',
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
      instructions: '1. Fournis la sortie au format Texte.\n2. Chaque question doit avoir 4 options (A, B, C, D) avec une seule bonne réponse.\n3. Inclut une explication pour chaque bonne réponse.\n4. Les questions doivent couvrir : définition, facteurs internes/externes, interprétation de la matrice.',
      criteres: 'Questions pertinentes, niveau approprié, explications claires',
      role: 'expert-marketing',
      competences: 'stratégie d\'entreprise, analyse SWOT, formation',
      exemples: `Input: Question sur définition SWOT
Output: {
  "question": "Que signifie le 'S' dans SWOT ?",
  "options": {
    "A": "Strategy",
    "B": "Strengths", 
    "C": "System",
    "D": "Sales"
  },
  "correct_answer": "B",
  "explanation": "Le 'S' dans SWOT signifie 'Strengths' (Forces), qui représentent les avantages internes de l'entreprise."
}`,
      prefill: '{"questions": [{"question": "Que signifie le \'S\' dans SWOT ?", "options": {"A": "Strategy", "B": "Strengths", "C": "System", "D": "Sales"}, "correct_answer": "B", "explanation": "Le \'S\' dans SWOT signifie \'Strengths\' (Forces), qui représentent les avantages internes de l\'entreprise."}]}',
      longueur: 'moyenne',
      creativite: 'modérée',
      format: 'Texte',
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
      instructions: '1. Fournis la sortie au format Texte.\n2. Recommande 5 KPIs avec leur définition, formule, et objectif cible.\n3. Classe les KPIs par catégorie : Awareness, Engagement, Conversion.\n4. Justifie le choix de chaque KPI en lien avec les objectifs de la campagne.',
      criteres: 'KPIs mesurables, pertinents pour réseaux sociaux, objectifs réalistes',
      role: 'expert-marketing',
      competences: 'marketing digital, analyse de données',
      exemples: `Input: KPI d'engagement
Output: {
  "name": "Taux d'engagement",
  "category": "Engagement", 
  "definition": "Pourcentage d'interactions par rapport à la portée",
  "formula": "(Likes + Commentaires + Partages) / Portée * 100",
  "target": "≥ 3%",
  "justification": "Mesure la pertinence du contenu pour l'audience cible"
}`,
      prefill: '{"KPIs": [{"name": "Taux d\'engagement", "category": "Engagement", "definition": "Pourcentage d\'interactions par rapport à la portée", "formula": "(Likes + Commentaires + Partages) / Portée * 100", "target": "≥ 3%", "justification": "Mesure la pertinence du contenu pour l\'audience cible"}]}',
      longueur: 'détaillée',
      creativite: 'modérée',
      format: 'Texte',
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
      instructions: '1. Fournis la sortie au format Texte.\n2. Structure ton plan en 3 phases : Préparation, Déploiement, Pérennisation.\n3. Pour chaque phase, décris les actions clés, les acteurs impliqués, et les livrables attendus.\n4. Inclut un calendrier prévisionnel sur 12 mois.',
      criteres: 'Plan structuré, phases logiques, calendrier réaliste, acteurs identifiés',
      role: 'consultant-senior',
      competences: 'Lean Six Sigma, transformation organisationnelle',
      exemples: `Input: Phase de préparation
Output: {
  "Préparation": {
    "actions": ["Diagnostic initial", "Formation des Yellow Belts", "Sélection des projets pilotes"],
    "actors": ["Direction", "Consultant externe", "Responsables opérationnels"],
    "deliverables": ["Rapport de diagnostic", "Plan de formation", "Cahier des charges projets pilotes"],
    "timeline": "Mois 1-3"
  }
}`,
      prefill: '{"plan": {"Préparation": {"actions": ["Diagnostic initial", "Formation des Yellow Belts", "Sélection des projets pilotes"], "actors": ["Direction", "Consultant externe", "Responsables opérationnels"], "deliverables": ["Rapport de diagnostic", "Plan de formation", "Cahier des charges projets pilotes"], "timeline": "Mois 1-3"}}}',
      longueur: 'détaillée',
      creativite: 'factuelle',
      format: 'Texte',
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

// Fonction pour obtenir les exemples par catégorie
export function getExamplesByCategory(category) {
  return promptExamples.filter(example => example.category === category);
}

// Fonction pour obtenir un exemple par ID
export function getExampleById(id) {
  return promptExamples.find(example => example.id === id);
}

// Fonction pour obtenir toutes les catégories
export function getCategories() {
  const categories = [...new Set(promptExamples.map(example => example.category))];
  return categories.sort();
}

// Fonction pour rechercher des exemples par tags
export function searchExamplesByTags(searchTags) {
  return promptExamples.filter(example => 
    example.tags.some(tag => 
      searchTags.some(searchTag => 
        tag.toLowerCase().includes(searchTag.toLowerCase())
      )
    )
  );
}

// Fonction pour obtenir tous les tags disponibles
export function getAllTags() {
  const allTags = promptExamples.flatMap(example => example.tags);
  return [...new Set(allTags)].sort();
}
