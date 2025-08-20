// GRID Extension - Popup Script DEBUG (Sans imports)
console.log('🔧 GRID Extension popup script DEBUG loaded');

// === NAVIGATION DE BASE SANS IMPORTS ===

// État de l'application
const appState = {
  currentStep: 'home',
  data: {}
};

// === NAVIGATION ===
function showView(viewId) {
  console.log('📍 showView appelée avec:', viewId);
  
  try {
    // Cacher toutes les vues
    document.querySelectorAll('[id$="-view"]').forEach(view => {
      view.classList.add('hidden');
      console.log('  - Masqué:', view.id);
    });
    
    // Afficher la vue cible
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.remove('hidden');
      appState.currentStep = viewId.replace('-view', '');
      console.log('  ✅ Vue affichée:', viewId);
    } else {
      console.error('  ❌ Vue non trouvée:', viewId);
    }
  } catch (error) {
    console.error('❌ Erreur dans showView:', error);
  }
}

function goHome() { 
  console.log('🏠 goHome appelée');
  showView('home-view'); 
}

function startBuilder() { 
  console.log('🚀 startBuilder appelée');
  showView('step1-view'); 
}

function goToStep1() { 
  console.log('1️⃣ goToStep1 appelée');
  showView('step1-view'); 
}

function goToStep2() { 
  console.log('2️⃣ goToStep2 appelée');
  // collectStep1Data(); // Temporairement désactivé
  showView('step2-view'); 
}

function goToStep3() { 
  console.log('3️⃣ goToStep3 appelée');
  // collectStep2Data(); // Temporairement désactivé
  showView('step3-view'); 
}

function showLibrary() {
  console.log('📚 showLibrary appelée');
  showView('library-view');
  // renderLibrary(); // Temporairement désactivé
}

function generatePrompt() {
  console.log('✨ generatePrompt appelée');
  showView('result-view');
}

function copyPrompt() {
  console.log('📋 copyPrompt appelée');
  // Fonction simplifiée pour test
  alert('Fonctionnalité copie - TEST');
}

// === INITIALISATION SIMPLIFIÉE ===
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM loaded, initializing GRID extension DEBUG...');
  
  try {
    // Vérifications de base
    console.log('🔍 Vérifications de base:');
    console.log('  - Vues trouvées:', document.querySelectorAll('[id$="-view"]').length);
    console.log('  - Boutons avec data-action:', document.querySelectorAll('[data-action]').length);
    
    // === EVENT LISTENERS POUR LA NAVIGATION ===
    
    // Page d'accueil
    const newPromptCard = document.querySelector('[data-action="start-builder"]');
    const libraryCard = document.querySelector('[data-action="show-library"]');
    
    console.log('🔍 Boutons page d\'accueil:');
    console.log('  - start-builder trouvé:', !!newPromptCard);
    console.log('  - show-library trouvé:', !!libraryCard);
    
    if (newPromptCard) {
      newPromptCard.addEventListener('click', function(e) {
        console.log('🎯 CLICK détecté sur start-builder');
        startBuilder();
      });
      console.log('  ✅ Event listener attaché: start-builder');
    }
    
    if (libraryCard) {
      libraryCard.addEventListener('click', function(e) {
        console.log('🎯 CLICK détecté sur show-library');
        showLibrary();
      });
      console.log('  ✅ Event listener attaché: show-library');
    }
    
    // Boutons de navigation
    const navigationActions = [
      { action: 'go-home', func: goHome },
      { action: 'go-step1', func: goToStep1 },
      { action: 'go-step2', func: goToStep2 },
      { action: 'go-step3', func: goToStep3 },
      { action: 'generate-prompt', func: generatePrompt },
      { action: 'copy-prompt', func: copyPrompt }
    ];
    
    navigationActions.forEach(({action, func}) => {
      const buttons = document.querySelectorAll(`[data-action="${action}"]`);
      console.log(`🔍 Boutons ${action} trouvés:`, buttons.length);
      
      buttons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
          console.log(`🎯 CLICK détecté sur ${action} (bouton ${index + 1})`);
          func();
        });
      });
      
      if (buttons.length > 0) {
        console.log(`  ✅ Event listeners attachés: ${action} (${buttons.length} boutons)`);
      }
    });
    
    console.log('✅ GRID extension DEBUG initialized successfully');
    
    // Test automatique après 3 secondes
    setTimeout(() => {
      console.log('🧪 Test automatique de navigation...');
      console.log('Test 1: startBuilder()');
      startBuilder();
      
      setTimeout(() => {
        console.log('Test 2: goToStep2()');
        goToStep2();
      }, 1000);
      
      setTimeout(() => {
        console.log('Test 3: goHome()');
        goHome();
      }, 2000);
    }, 3000);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
});

// Fonctions globales pour debug manuel
window.debugGrid = {
  showView,
  goHome,
  startBuilder,
  goToStep1,
  goToStep2,
  goToStep3,
  showLibrary,
  generatePrompt,
  test: () => {
    console.log('🧪 Test manuel lancé');
    startBuilder();
  }
};