import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { ObjectiveStep } from './Step1_Objective';
import { StructureStep } from './Step2_Structure';
import { CustomizeStep } from './Step3_Customize';
import { PromptPreview } from './PromptPreview';
import { PromptConfig } from '@/types';

interface PromptBuilderProps {
  onBack: () => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<Partial<PromptConfig>>({});

  const totalSteps = 3;

  const updateConfig = (stepData: Partial<PromptConfig>) => {
    setConfig(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.objective?.title && config.objective?.description;
      case 2:
        return config.structure?.role;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ObjectiveStep
            data={config.objective}
            onChange={(objective) => updateConfig({ objective })}
          />
        );
      case 2:
        return (
          <StructureStep
            data={config.structure}
            onChange={(structure) => updateConfig({ structure })}
          />
        );
      case 3:
        return (
          <CustomizeStep
            data={config.customize}
            onChange={(customize) => updateConfig({ customize })}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Définir l\'objectif',
    'Structurer le prompt',
    'Personnaliser'
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button
          onClick={handlePrevious}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {currentStep === 1 ? 'Retour' : 'Précédent'}
        </Button>
        
        <div className="text-center">
          <h2 className="text-sm font-medium text-gray-900">
            Étape {currentStep} : {stepTitles[currentStep - 1]}
          </h2>
          <div className="flex space-x-1 mt-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          size="sm"
        >
          {currentStep === totalSteps ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Générer
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {renderStep()}
        </motion.div>
      </div>

      {config.objective && config.structure && (
        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <PromptPreview config={config as PromptConfig} compact />
        </div>
      )}
    </div>
  );
};