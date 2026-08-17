import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProgressBar from './components/ProgressBar';
import Step1GeneralInfo from './components/Step1GeneralInfo';
import Step2LegalStage from './components/Step2LegalStage';
import Step3Metrics from './components/Step3Metrics';
import Step4Needs from './components/Step4Needs';
import Step5Description from './components/Step5Description';
import SubmitResult from './components/SubmitResult';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

const INITIAL_FORM_DATA = {
  startupName: '',
  stateUt: '',
  isIncorporated: '',
  dpiitRecognition: '',
  startupStage: '',
  teamSize: '',
  supportNeeded: [],
  fundingRequirement: '',
  description: ''
};

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'wizard'
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  // Single state update helper
  const updateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));

    // Clear specific field error when user interacts with it
    if (errors[key]) {
      setErrors((prevErrors) => {
        const updated = { ...prevErrors };
        delete updated[key];
        return updated;
      });
    }
  };

  // Step-by-step Validation Logic
  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.startupName.trim()) {
        newErrors.startupName = 'Startup Name is required.';
      }
      if (!formData.stateUt) {
        newErrors.stateUt = 'Please select a State or Union Territory.';
      }
    } else if (stepNumber === 2) {
      if (!formData.isIncorporated) {
        newErrors.isIncorporated = 'Please select your incorporation status.';
      }
      if (!formData.dpiitRecognition) {
        newErrors.dpiitRecognition = 'Please select your DPIIT recognition status.';
      }
    } else if (stepNumber === 3) {
      if (!formData.startupStage) {
        newErrors.startupStage = 'Please select your current startup stage.';
      }
      if (!formData.teamSize) {
        newErrors.teamSize = 'Please select your team size.';
      }
    } else if (stepNumber === 4) {
      if (!Array.isArray(formData.supportNeeded) || formData.supportNeeded.length === 0) {
        newErrors.supportNeeded = 'Please select at least one support service needed.';
      }
    } else if (stepNumber === 5) {
      if (!formData.description.trim()) {
        newErrors.description = 'Startup description is required.';
      } else if (formData.description.trim().length < 15) {
        newErrors.description = 'Please provide a more detailed description (min 15 characters).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next Step Handler
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep((prev) => Math.min(prev + 1, 6)); // Step 6 is Final Review & Submit
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous Step Handler
  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct Step navigation via ProgressBar breadcrumb
  const handleStepClick = (stepId) => {
    if (stepId < currentStep) {
      setErrors({});
      setCurrentStep(stepId);
    } else if (validateStep(currentStep)) {
      setCurrentStep(stepId);
    }
  };

  // Reset entire form
  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setCompletedSteps([]);
    setCurrentStep(1);
  };

  const handleStartWizard = () => {
    setViewMode('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header Navbar */}
      <Header
        viewMode={viewMode}
        onGoHome={handleGoHome}
        onStartWizard={handleStartWizard}
      />

      {/* Render Main Content View */}
      {viewMode === 'landing' ? (
        <LandingPage
          onStartWizard={handleStartWizard}
        />
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
          {/* Step Progress Indicator Bar */}
          <ProgressBar
            currentStep={currentStep > 5 ? 5 : currentStep}
            totalSteps={5}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />

          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl shadow-emerald-950/10 p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden">
            {/* Top subtle gradient accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

            {/* Render Step Content */}
            {currentStep === 1 && (
              <Step1GeneralInfo
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <Step2LegalStage
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <Step3Metrics
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 4 && (
              <Step4Needs
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 5 && (
              <Step5Description
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 6 && (
              <SubmitResult
                formData={formData}
                onEditStep={(stepNum) => setCurrentStep(stepNum)}
                onResetForm={handleResetForm}
              />
            )}

            {/* Navigation Controls (Steps 1 through 5) */}
            {currentStep <= 5 && (
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                    currentStep === 1
                      ? 'opacity-40 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="hidden sm:inline-flex px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-400 items-center gap-1 transition-all"
                    title="Clear all fields"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {currentStep === 5 ? (
                      <>
                        Review Application
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      </>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer info */}
          <footer className="mt-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Founder's Hub &bull; Empowering Indian Startups</p>
          </footer>
        </main>
      )}
    </div>
  );
}
