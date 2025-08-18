# GRID - AI Prompt Builder

🚀 **Extension Chrome d'aide à la création de prompts efficaces pour LLM**

GRID est une extension Chrome moderne qui guide les utilisateurs dans la création de prompts structurés et efficaces pour les IA comme ChatGPT, Claude, etc.

## Fonctionnalités

### Interface guidée en 3 étapes
- **Étape 1** : Définir l'objectif (titre, description, audience cible)
- **Étape 2** : Structurer le prompt (rôle, compétences, exemples)
- **Étape 3** : Personnaliser (format de sortie, longueur, créativité)

### Bibliothèque de templates
- Templates prédéfinis par catégorie (business, technique, créatif)
- Sauvegarde de prompts personnalisés
- Système de notation et d'utilisation

### ⚡ Fonctionnalités avancées
- Aperçu en temps réel du prompt généré
- Support du formatage XML pour plus de structure
- Stockage local des données utilisateur
- Interface responsive et moderne

## 🛠 Stack Technique

- **Frontend** : React 19.1.1 + TypeScript 5.9
- **Build** : Vite 7.0
- **Styling** : Tailwind CSS 3.4
- **Extensions** : Chrome Manifest V3
- **Animations** : Framer Motion (prévu)

## 🚀 Installation

### Pour les développeurs

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Leto-D/Grid.git
   cd Grid
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Build de l'extension**
   ```bash
   npm run build
   ```

4. **Charger dans Chrome**
   - Ouvrir `chrome://extensions/`
   - Activer le "Mode développeur"
   - "Charger l'extension non empaquetée"
   - Sélectionner le dossier du projet

### Pour les utilisateurs

L'extension sera bientôt disponible sur le Chrome Web Store.

## 📦 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run lint` - Vérification ESLint
- `npm run type-check` - Vérification TypeScript

## 🏗 Architecture

```
src/
├── components/
│   ├── ui/              # Composants réutilisables
│   ├── PromptBuilder/   # Logique de création de prompts
│   └── Library/         # Bibliothèque de templates
├── hooks/               # Custom React hooks
├── utils/               # Utilitaires (générateur de prompts)
├── types/               # Types TypeScript
├── background/          # Service Worker (Manifest V3)
├── content/             # Content scripts
└── popup/               # Interface popup principale
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le project
2. Créer une feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branch (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Conçu pour simplifier la création de prompts IA
- Interface inspirée des meilleures pratiques UX modernes
- Développé avec ❤️ pour la communauté IA

---

**GRID** - *Transformez vos idées en prompts parfaits*