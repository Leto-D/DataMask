import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Library, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { PromptBuilder } from '@/components/PromptBuilder/PromptBuilder';
import { TemplateLibrary } from '@/components/Library/TemplateLibrary';

type View = 'home' | 'builder' | 'library' | 'settings';

export const Popup: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} />;
      case 'builder':
        return <PromptBuilder onBack={() => setCurrentView('home')} />;
      case 'library':
        return <TemplateLibrary onBack={() => setCurrentView('home')} />;
      case 'settings':
        return <SettingsView onBack={() => setCurrentView('home')} />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface HomeViewProps {
  onNavigate: (view: View) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">GRID</h1>
        <p className="text-gray-600 text-sm">
          Créez des prompts efficaces pour vos IA
        </p>
      </div>

      <div className="space-y-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onNavigate('builder')}
            className="w-full justify-start h-14 text-left"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium">Nouveau Prompt</div>
                <div className="text-sm text-gray-500">Créer un prompt guidé</div>
              </div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onNavigate('library')}
            variant="outline"
            className="w-full justify-start h-14 text-left"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Library className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Bibliothèque</div>
                <div className="text-sm text-gray-500">Templates et historique</div>
              </div>
            </div>
          </Button>
        </motion.div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button
          onClick={() => onNavigate('settings')}
          variant="ghost"
          className="w-full justify-start"
        >
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </Button>
      </div>
    </div>
  );
};

interface BackViewProps {
  onBack: () => void;
  title: string;
  children: React.ReactNode;
}

const BackView: React.FC<BackViewProps> = ({ onBack, title, children }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const SettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <BackView onBack={onBack} title="Paramètres">
      <div className="p-4">
        <p className="text-gray-600 text-center mt-8">
          Paramètres à venir...
        </p>
      </div>
    </BackView>
  );
};