# GRID - AI Prompt Builder v1.1.2 

**Date de publication :** 21 Août 2025  
**Type de mise à jour :** Nouvelle fonctionnalité majeure + Améliorations

## 🚀 Nouvelles fonctionnalités

### ✨ Sélecteur d'IA intégré
- **Nouveau sélecteur d'IA** sur la page d'accueil à côté du sélecteur de langue
- **6 IA pré-configurées** : ChatGPT, Claude, Gemini, Copilot, Perplexity, Mistral
- **Sauvegarde automatique** du choix d'IA pour les sessions suivantes
- **Bouton "Vers IA"** dans la page de résultat à côté du bouton "Copier"

### 🎯 Redirection intelligente vers l'IA
- **Copie automatique** du prompt dans le presse-papiers
- **Ouverture directe** de l'IA sélectionnée dans un nouvel onglet
- **Pré-remplissage automatique** pour ChatGPT et Perplexity
- **Instructions claires** pour les autres IA (paste le prompt avec Ctrl+V)

### 🛠️ IA personnalisées
- **Option "Personnaliser..."** pour ajouter ses propres IA
- **Modal intuitive** avec champs Nom et URL
- **Support illimité** d'IA personnalisées
- **Intégration parfaite** avec le système de redirection

### 🌍 Support multilingue amélioré
- **Traductions complètes** du sélecteur d'IA (FR/EN/DE)
- **Modal de personnalisation** entièrement traduite
- **Mise à jour automatique** lors du changement de langue

## 🔧 Améliorations techniques

### Performance
- **Sauvegarde optimisée** des préférences utilisateur
- **Gestion d'erreurs** robuste pour la copie du presse-papiers
- **Méthodes de fallback** pour une compatibilité maximale

### Interface utilisateur
- **Design cohérent** avec le style existant de l'application
- **Feedback visuel** lors des actions (boutons verts, animations)
- **Navigation fluide** entre les différentes IA

### Sécurité
- **Validation des URL** pour les IA personnalisées
- **Permissions minimales** (uniquement "tabs" pour l'ouverture d'onglets)
- **Stockage local sécurisé** des paramètres

## 🎯 Workflow utilisateur optimisé

### Première utilisation
1. Sélectionner une IA dans le menu déroulant (sauvegardé automatiquement)
2. Créer son prompt normalement avec l'assistant GRID
3. Cliquer "Vers IA" pour redirection + copie automatique

### Utilisations suivantes
- L'IA reste sélectionnée automatiquement
- Workflow simplifié : Créer → Envoyer → Coller

### IA personnalisées
- Ajouter facilement ses IA préférées via "Personnaliser..."
- Support de tous types d'interfaces de chat IA

## 📊 Compatibilité

### IA officiellement supportées
- ✅ **ChatGPT** - Pré-remplissage automatique
- ✅ **Claude** - Redirection + copie
- ✅ **Gemini** - Redirection + copie  
- ✅ **Copilot** - Redirection + copie
- ✅ **Perplexity** - Pré-remplissage automatique
- ✅ **Mistral** - Redirection + copie
- ✅ **IA personnalisées** - Support complet

### Langues supportées
- 🇫🇷 **Français** - Complet
- 🇺🇸 **Anglais** - Complet  
- 🇩🇪 **Allemand** - Complet

## 🔄 Migration depuis v1.0.3

- **Aucune action requise** - La mise à jour est transparente
- **Paramètres préservés** - Langue et préférences conservées
- **Nouveau sélecteur** - Apparaît automatiquement sur la page d'accueil

## 📋 Fichiers modifiés

### Principaux changements
- `manifest.json` - Version 1.1.2 + permission "tabs"
- `src/popup/index.html` - Sélecteur d'IA + modal personnalisation
- `src/popup/popup.js` - Logique IA + redirection + traductions
- `src/utils/i18n.js` - Nouvelles traductions

### Nouveaux fichiers
- `RELEASE_NOTES_v1.1.2.md` - Ces notes de version

## 🎉 Conclusion

La version 1.1.2 transforme GRID en un véritable hub de création de prompts avec redirection automatique vers l'IA de votre choix. Cette mise à jour majeure améliore significativement l'expérience utilisateur en simplifiant le workflow de création et d'utilisation des prompts.

**Prêt pour publication sur Chrome Web Store** ✅

---
*GRID - AI Prompt Builder v1.1.2 by LetoD*