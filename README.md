# DataMask

Extension Chrome. Pseudonymise les donnees sensibles avant envoi aux chatbots IA. Tout tourne dans le navigateur, rien ne sort.

## Le probleme

On colle des noms, des emails, des IBAN dans ChatGPT sans y penser. Les donnees partent sur des serveurs tiers. En 2025, 8 millions de conversations IA ont fuite via une extension VPN.

DataMask intercepte le collage et remplace les donnees personnelles par des pseudonymes avant que le texte n'atteigne l'IA.

```
"Jean Dupont, IBAN FR7630006000011234567890189"
→ "[Nom_1], IBAN [IBAN_1]"
```

L'IA repond avec les pseudonymes. DataMask garde la table de correspondance en local pour retrouver les originaux.

## Ce qui est detecte

Emails, telephones (FR/BE/international), noms (civilite, contexte juridique, heuristique avec prenoms connus), IBAN de 7 pays avec validation mod-97 via BigInt, cartes bancaires avec Luhn, numeros de securite sociale avec verification de cle, cles API (OpenAI, GitHub, GitLab, Slack, AWS), IP publiques, IPv6, GPS, cles PEM, adresses MAC.

Les donnees Art.9 RGPD (sante, biometrie) declenchent un avertissement specifique.

## Sites proteges

ChatGPT, Claude, Gemini, DeepSeek, Copilot, Perplexity. Sites custom configurables.

## Prompt Builder

Un builder de prompts en Side Panel. 6 sections (role, tache, contexte, exemples, contraintes, sortie), score de qualite 0-100 en temps reel, adaptation automatique au modele cible : XML pour Claude, Markdown pour ChatGPT, version compressee pour Gemini et Perplexity.

Bibliotheque de templates par categorie. Parametres avances : creativite, raisonnement, profondeur, verbosity.

## 100% local

Pas de serveur. Pas de compte. Pas de telemetrie. Le journal de conformite RGPD est chiffre en AES-256-GCM avec cle derivee par PBKDF2 (100k iterations). Stockage IndexedDB local. Nettoyage automatique selon la retention configuree.

Si le quota est depasse ou si quelque chose plante, le texte passe en clair. Jamais de blocage.

## Stack

Vanilla JS, CSS, HTML. Chrome Manifest V3. Vite 7 avec build 3 passes (popup + side panel en HTML entries, content script en IIFE, service worker en IIFE). Polices locales Inter + JetBrains Mono en WOFF2.

162 tests unitaires via Vitest couvrant detection, pseudonymisation, validateurs mathematiques, scoring de prompts et i18n.

## Structure

```
src/
  paste-protect/     detection + pseudonymisation (7 fichiers de patterns, moteur, processeur)
  popup/             4 vues (home, library, result, settings) + 8 modules
  side-panel/        builder de prompts avec apercu sticky et score
  content/           content script IIFE + 5 adapters (ProseMirror, Textarea, Quill, Generic, Contenteditable)
  background/        service worker (journal chiffre, stats, messages)
tests/               162 tests (Vitest)
store/               assets Chrome Web Store
```

## Langues

Francais, English, Deutsch. ~1100 cles de traduction.

## Installer

```
npm install
npm run build
```

Charger `dist/` comme extension non empaquetee dans `chrome://extensions` (mode developpeur).

## Tests

```
npm test
```

## Licence

MIT
