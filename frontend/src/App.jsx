import React, { useState } from 'react';
import Header from './components/Header';
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
      // fundingRequirement is optional
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
    // If navigating back, allow directly. If navigating forward, validate first.
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navbar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Step Progress Indicator Bar */}
        <ProgressBar
          currentStep={currentStep > 5 ? 5 : currentStep}
          totalSteps={5}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl shadow-indigo-950/20 p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden">
          {/* Top subtle gradient accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" />

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
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-900/40 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {currentStep === 5 ? (
                    <>
                      Review Application
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
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
    </div>
  );
}
