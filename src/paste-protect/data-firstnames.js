// data-firstnames.js - Set de prenoms FR/BE/NL pour boost confiance detection noms
// Utilise par patterns-identity.js pour distinguer "Pierre Martin" (prenom+nom) de "Pierre Angulaire" (faux positif)

export const FIRSTNAMES = new Set([
  // Prenoms masculins francais courants
  'adam', 'adrien', 'alain', 'alexandre', 'alexis', 'antoine', 'arnaud', 'arthur',
  'baptiste', 'benjamin', 'benoit', 'bernard', 'bruno',
  'camille', 'cedric', 'charles', 'christophe', 'claude', 'clement', 'cyril',
  'damien', 'daniel', 'david', 'denis', 'didier', 'dominique',
  'edouard', 'emile', 'emmanuel', 'eric', 'etienne',
  'fabien', 'fabrice', 'florian', 'francis', 'franck', 'francois', 'frederic',
  'gabriel', 'gauthier', 'gerard', 'gilles', 'guillaume', 'gustave', 'guy',
  'henri', 'herve', 'hugo', 'hugues',
  'jacques', 'jean', 'jerome', 'joel', 'jonathan', 'joseph', 'julien', 'justin',
  'kevin',
  'laurent', 'leon', 'lionel', 'louis', 'luc', 'lucas', 'ludovic',
  'marc', 'marcel', 'martin', 'mathieu', 'matthieu', 'maurice', 'maxime', 'michel', 'morgan',
  'nathan', 'nicolas', 'noel',
  'olivier', 'oscar',
  'pascal', 'patrick', 'paul', 'philippe', 'pierre',
  'quentin',
  'raphael', 'raymond', 'remi', 'renaud', 'rene', 'richard', 'robert', 'robin', 'romain', 'roger',
  'samuel', 'sebastien', 'serge', 'simon', 'stephane', 'sylvain',
  'theo', 'thibault', 'thierry', 'thomas', 'tristan',
  'valentin', 'victor', 'vincent',
  'xavier', 'yann', 'yves',

  // Prenoms feminins francais courants
  'agnes', 'alice', 'amelie', 'anaelle', 'andrea', 'anne', 'annette', 'audrey', 'aurelie',
  'beatrice', 'bernadette', 'brigitte',
  'camille', 'caroline', 'catherine', 'cecile', 'celine', 'charlotte', 'christine', 'claire', 'clara', 'clemence', 'colette', 'corinne',
  'delphine', 'denise', 'diane', 'dominique',
  'elena', 'elise', 'elodie', 'emilie', 'emma', 'estelle', 'eva', 'evelyne',
  'fabienne', 'florence', 'francoise',
  'gabrielle', 'genevieve', 'geraldine',
  'helene', 'henriette',
  'ines', 'isabelle',
  'jacqueline', 'jeanne', 'josephine', 'julie', 'juliette', 'justine',
  'karine',
  'laetitia', 'laura', 'laure', 'laurence', 'lea', 'liliane', 'louise', 'lucie', 'lydie',
  'madeleine', 'manon', 'marguerite', 'marie', 'marina', 'marine', 'martine', 'mathilde', 'melanie', 'michele', 'monique', 'muriel', 'myriam',
  'nadia', 'nadine', 'nathalie', 'nicole', 'nina',
  'odette', 'odile', 'olivia',
  'patricia', 'pauline',
  'rachel', 'renee', 'rosa', 'rosalie', 'rose',
  'sabine', 'sandrine', 'sarah', 'simone', 'solange', 'sophie', 'stephanie', 'suzanne', 'sylvie',
  'therese',
  'valerie', 'vanessa', 'veronique', 'virginie', 'viviane',

  // Prenoms belges/neerlandais courants
  'anke', 'anouk', 'bas', 'bram', 'daan', 'dieter', 'els', 'femke', 'geert', 'griet',
  'hanne', 'jan', 'jef', 'jeroen', 'joris', 'jurgen', 'kaat', 'koen', 'lien', 'lotte',
  'maarten', 'mieke', 'nele', 'pieter', 'rik', 'ruben', 'sander', 'senne', 'stef',
  'tine', 'tom', 'wim', 'wouter'
]);
