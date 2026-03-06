// data-false-positives.js - Expressions institutionnelles et noms communs a exclure de la detection heuristique
// Evite de pseudonymiser "Union Europeenne", "Code Civil", "Intelligence Artificielle", etc.

export const FALSE_POSITIVES = new Set([
  // Institutions europeennes
  'union europeenne', 'commission europeenne', 'parlement europeen', 'conseil europeen',
  'cour europeenne', 'banque centrale', 'european union', 'european commission',
  'european parliament', 'european council',

  // Institutions francaises
  'assemblee nationale', 'conseil constitutionnel', 'cour cassation', 'conseil etat',
  'tribunal administratif', 'tribunal judiciaire', 'tribunal commerce',
  'cour appel', 'cour comptes', 'haute autorite', 'conseil superieur',
  'securite sociale', 'caisse allocations', 'pole emploi', 'france travail',
  'banque france', 'tresor public',

  // Institutions belges
  'chambre representants', 'conseil ministres', 'cour constitutionnelle',
  'service public', 'region wallonne', 'region bruxelles', 'communaute francaise',

  // Droit et juridique
  'code civil', 'code penal', 'code travail', 'code commerce', 'code procedure',
  'code general', 'code monetaire', 'code propriete', 'code sante',
  'droit commun', 'droit civil', 'droit penal', 'droit travail', 'droit social',
  'convention collective', 'accord collectif', 'contrat travail',
  'article premier', 'premier ministre', 'garde sceaux', 'avocat general',
  'procureur republique', 'juge instruction',

  // RGPD et reglementation
  'donnees personnelles', 'donnees sensibles', 'protection donnees',
  'reglement general', 'responsable traitement', 'delegue protection',
  'autorite controle', 'analyse impact', 'registre traitement',
  'base legale', 'interet legitime', 'consentement explicite',

  // Technologie et IA
  'intelligence artificielle', 'machine learning', 'deep learning', 'artificial intelligence',
  'natural language', 'computer vision', 'neural network', 'open source',
  'big data', 'cloud computing', 'cyber securite',
  'chat gpt', 'open ai', 'google cloud', 'amazon web', 'microsoft azure',

  // Expressions courantes avec majuscules
  'moyen age', 'ancien regime', 'belle epoque', 'grand paris',
  'saint germain', 'saint denis', 'saint etienne', 'saint martin',
  'mont blanc', 'val oise', 'ile france',
  'nouveau monde', 'vieux continent',
  'bonne pratique', 'bonne foi', 'vice president', 'directeur general',
  'ressources humaines', 'chef projet', 'chef service',

  // Mois et jours (eviter "Jean Mars" faux positif)
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
  'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche',

  // Titres et fonctions (eviter "Monsieur Le Directeur" triple detection)
  'monsieur directeur', 'madame directrice', 'monsieur president',
  'madame presidente', 'cher collegue', 'chere collegue',

  // Noms de societes/marques courants
  'societe generale', 'credit agricole', 'credit mutuel', 'banque populaire',
  'la poste', 'france telecom', 'air france', 'total energies',
  'saint gobain', 'louis vuitton', 'christian dior',

  // Geographie courante
  'royaume uni', 'etats unis', 'pays bas', 'nouvelle zelande',
  'costa rica', 'sri lanka', 'hong kong', 'porto rico',
  'buenos aires', 'rio janeiro', 'sao paulo', 'new york', 'los angeles',
  'san francisco', 'las vegas', 'el salvador'
]);
