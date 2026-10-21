import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SchemeDetailModal from './components/SchemeDetailModal';
import ProgressBar from './components/ProgressBar';
import Step1GeneralInfo from './components/Step1GeneralInfo';
import Step2LegalStage from './components/Step2LegalStage';
import Step3Metrics from './components/Step3Metrics';
import Step4Needs from './components/Step4Needs';
import Step5Description from './components/Step5Description';
import SubmitResult from './components/SubmitResult';
import AuthModal from './components/AuthModal';
import SavedHistoryModal from './components/SavedHistoryModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import StudioControls from './components/StudioControls';
import { AuthProvider, useAuth } from './context/AuthContext';
import { trackEvent } from './configs/analytics';
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

function MainApp() {
  const { isAuthenticated, loading, fetchUserHistory } = useAuth();
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'dashboard' | 'wizard'
  const [authChecked, setAuthChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [savedAnalysisResult, setSavedAnalysisResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);

  // Initial landing resolution: When user is authenticated, route directly to Dashboard
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (!authChecked) {
          setViewMode('dashboard');
          setAuthChecked(true);
        }
      } else {
        setViewMode('landing');
        setAuthChecked(true);
      }
    }
  }, [loading, isAuthenticated, authChecked]);

  // Strict Real-Time Auth Guard: If unauthenticated, NEVER allow wizard or dashboard
  useEffect(() => {
    if (!loading && !isAuthenticated && viewMode !== 'landing') {
      setViewMode('landing');
      setIsAuthModalOpen(true);
    }
  }, [loading, isAuthenticated, viewMode]);

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
      const nextStep = Math.min(currentStep + 1, 6);
      setCurrentStep(nextStep);
      trackEvent('step_changed', { step: nextStep });
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
    setSavedAnalysisResult(null);
    setErrors({});
    setCompletedSteps([]);
    setCurrentStep(1);
  };

  const handleGoDashboard = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setViewMode('dashboard');
    if (fetchUserHistory) fetchUserHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewAnalysis = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    handleResetForm();
    setViewMode('wizard');
    trackEvent('wizard_started');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler for re-running an analysis with pre-filled inputs
  const handleReRunAnalysis = (item) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const onboarding = item.onboarding || {};
    setFormData({
      startupName: onboarding.startupName || '',
      stateUt: onboarding.state || onboarding.stateUt || '',
      isIncorporated: onboarding.incorporated || onboarding.isIncorporated || '',
      dpiitRecognition: onboarding.dpiit || onboarding.dpiitRecognition || '',
      startupStage: onboarding.stage || onboarding.startupStage || '',
      teamSize: onboarding.teamSize || '',
      supportNeeded: onboarding.supportNeeded || [],
      fundingRequirement: onboarding.fundingRequired || onboarding.fundingRequirement || '',
      description: onboarding.description || ''
    });

    setSavedAnalysisResult(null);
    setCompletedSteps([1, 2, 3, 4, 5]);
    setCurrentStep(1);
    setViewMode('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for opening a saved history item directly in results view
  const handleSelectHistoryItem = (item) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const onboarding = item.onboarding || {};
    setFormData({
      startupName: onboarding.startupName || '',
      stateUt: onboarding.state || onboarding.stateUt || '',
      isIncorporated: onboarding.incorporated || onboarding.isIncorporated || '',
      dpiitRecognition: onboarding.dpiit || onboarding.dpiitRecognition || '',
      startupStage: onboarding.stage || onboarding.startupStage || '',
      teamSize: onboarding.teamSize || '',
      supportNeeded: onboarding.supportNeeded || [],
      fundingRequirement: onboarding.fundingRequired || onboarding.fundingRequirement || '',
      description: onboarding.description || ''
    });

    setSavedAnalysisResult({
      success: true,
      data: {
        profileId: item._id,
        founderProfile: item.founderProfile,
        matchedSchemes: item.matchedSchemes || []
      }
    });

    setCurrentStep(6);
    setViewMode('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isShellMode = isAuthenticated && viewMode !== 'landing';

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-text-primary)] flex font-sans transition-colors duration-150">
      {/* Studio Grid & Cursor Controls */}
      <StudioControls />
      {/* Sidebar for Authenticated Shell */}
      {isShellMode && (
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          viewMode={viewMode}
          onGoDashboard={handleGoDashboard}
          onStartWizard={handleStartNewAnalysis}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onScrollToSection={handleScrollToSection}
        />
      )}

      {/* Main Viewport Container */}
      <div className={`flex-1 flex flex-col min-w-0 ${isShellMode ? 'md:pl-64' : ''}`}>
        {/* Top Header Navbar */}
        <Header
          viewMode={viewMode}
          onGoHome={handleGoHome}
          onGoDashboard={handleGoDashboard}
          onStartWizard={handleStartNewAnalysis}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {viewMode === 'landing' || (!isAuthenticated && !loading) ? (
            <LandingPage
              onStartWizard={() => {
                if (!isAuthenticated) {
                  setIsAuthModalOpen(true);
                } else {
                  handleGoDashboard();
                }
              }}
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            />
          ) : viewMode === 'dashboard' ? (
            <Dashboard
              onStartNewAnalysis={handleStartNewAnalysis}
              onSelectHistoryItem={handleSelectHistoryItem}
              onReRunAnalysis={handleReRunAnalysis}
              onOpenSchemeModal={(scheme) => setSelectedSchemeForModal(scheme)}
            />
          ) : (
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn">
              {/* Step Progress Indicator Bar */}
              <ProgressBar
                currentStep={currentStep > 5 ? 5 : currentStep}
                totalSteps={5}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />

              {/* Form Card Container */}
              <div className="bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[4px] p-5 sm:p-8">
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
                    initialResult={savedAnalysisResult}
                    onEditStep={(stepNum) => setCurrentStep(stepNum)}
                    onResetForm={handleStartNewAnalysis}
                    onGoDashboard={handleGoDashboard}
                  />
                )}

                {/* Navigation Controls (Steps 1 through 5) */}
                {currentStep <= 5 && (
                  <div className="flex items-center justify-between pt-6 mt-8 border-t border-[var(--color-line)] gap-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className={`studio-btn-secondary ${currentStep === 1 ? 'opacity-40 pointer-events-none' : ''}`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="hidden sm:inline-flex px-3 py-1.5 font-mono text-xs text-[var(--color-text-dim)] hover:text-red-400 items-center gap-1 transition-colors cursor-pointer"
                        title="Clear all fields"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="studio-btn-primary"
                        data-cursor="Next"
                      >
                        {currentStep === 5 ? (
                          <>
                            <span>Review Profile</span>
                            <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>Next Step</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer info */}
              <footer className="mt-8 text-center font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider space-y-1">
                <p>&copy; {new Date().getFullYear()} Founder's Hub &bull; Statutory &amp; Grant Discovery Engine</p>
                <p>
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="hover:text-[var(--color-signal)] transition-colors cursor-pointer underline"
                  >
                    Terms &amp; Conditions
                  </button>
                </p>
              </footer>
            </main>
          )}
        </div>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setSavedAnalysisResult(null);
          setViewMode('dashboard');
          if (fetchUserHistory) fetchUserHistory();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <SavedHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectHistoryItem={handleSelectHistoryItem}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Scheme Detail Modal for featured spotlight */}
      {selectedSchemeForModal && (
        <SchemeDetailModal
          schemeMatch={selectedSchemeForModal}
          documentId={selectedSchemeForModal.documentId}
          onClose={() => setSelectedSchemeForModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
