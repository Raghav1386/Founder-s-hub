import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  User,
  LogOut,
  History,
  ChevronDown,
  Menu,
  LayoutDashboard,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  viewMode,
  onGoHome,
  onGoDashboard,
  onStartWizard,
  onOpenAuthModal,
  onOpenHistoryModal,
  onToggleMobileSidebar
}) {
  const { user, mongoUser, logout, isAuthenticated, savedHistory } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Theme State: 'dark' (Ink) | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fh_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fh_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.displayName || mongoUser?.name || 'Founder';
  const displayEmail = user?.email || mongoUser?.email || '';
  const avatarUrl = user?.photoURL || mongoUser?.avatar || '';

  const isShellMode = isAuthenticated && viewMode !== 'landing';

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-ink)] border-b border-[var(--color-line)] transition-colors duration-150">
      <div className={`${isShellMode ? 'px-4 sm:px-6 lg:px-8' : 'max-w-7xl mx-auto px-4 sm:px-6'} h-16 flex items-center justify-between gap-4`}>
        
        {/* Left: Brand Identity (Public) OR Mobile Menu + Breadcrumb (Shell) */}
        <div className="flex items-center gap-4">
          {isShellMode ? (
            <>
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 rounded-[3px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-1)] border border-[var(--color-line)] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]">
                <button
                  type="button"
                  onClick={onGoDashboard}
                  className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal)]" />
                  <span className="text-[var(--color-text-primary)] font-semibold">
                    {viewMode === 'dashboard' ? 'Console' : 'Assessment'}
                  </span>
                </button>
                <span>/</span>
                <span className="text-[var(--color-text-muted)]">
                  {viewMode === 'dashboard' ? '01 Overview' : '02 Evaluation Wizard'}
                </span>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={isAuthenticated ? onGoDashboard : onGoHome}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              {/* Existing Favicon Brand Asset */}
              <div className="w-7 h-7 rounded-[3px] overflow-hidden border border-[var(--color-line)] shrink-0 bg-[var(--color-surface-1)] flex items-center justify-center">
                <img src="/favicon.jpg" alt="Founder's Hub" className="w-full h-full object-cover" />
              </div>

              {/* Clean Typography Wordmark */}
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[var(--color-text-primary)]">
                  Founder's Hub
                </span>
                <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] px-1.5 py-0.5 border border-[var(--color-line)] rounded-[2px]">
                  v2.0
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Center: Monospaced Section Anchors (Public Landing only) */}
        {!isShellMode && (
          <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
            <a
              href="#how-it-works"
              className="hover:text-[var(--color-signal)] transition-colors py-1 flex items-center gap-1"
            >
              <span className="text-[var(--color-text-dim)]">01</span>
              <span>Trajectory</span>
            </a>
            <a
              href="#matrix"
              className="hover:text-[var(--color-signal)] transition-colors py-1 flex items-center gap-1"
            >
              <span className="text-[var(--color-text-dim)]">02</span>
              <span>Coverage</span>
            </a>
            <a
              href="#grounded-qa"
              className="hover:text-[var(--color-signal)] transition-colors py-1 flex items-center gap-1"
            >
              <span className="text-[var(--color-text-dim)]">03</span>
              <span>Grounded Q&amp;A</span>
            </a>
          </nav>
        )}

        {/* Right Section: Theme Toggle & Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Studio Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-[3px] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] bg-transparent hover:bg-[var(--color-surface-1)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] flex items-center justify-center transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="studio-btn-secondary"
                data-cursor="Sign In"
              >
                <User className="w-3.5 h-3.5 mr-1" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={onOpenAuthModal}
                className="studio-btn-primary"
                data-cursor="Start"
              >
                <span>Find Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 hidden xs:inline" />
              </button>
            </>
          ) : viewMode === 'wizard' ? (
            <button
              type="button"
              onClick={onGoDashboard}
              className="studio-btn-secondary"
              data-cursor="Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
              <span>Console</span>
            </button>
          ) : viewMode === 'dashboard' ? (
            <button
              type="button"
              onClick={onStartWizard}
              className="studio-btn-primary"
              data-cursor="Launch"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>New Analysis</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoDashboard}
              className="studio-btn-primary"
              data-cursor="Open"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
              <span>Go to Console</span>
            </button>
          )}

          {/* User Profile Dropdown Menu */}
          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-[3px] hover:bg-[var(--color-surface-1)] border border-[var(--color-line)] transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-label="User account menu"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-[2px] object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-[2px] bg-[var(--color-surface-2)] text-[var(--color-signal)] font-mono text-[10px] font-semibold flex items-center justify-center">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-[var(--color-text-primary)] hidden sm:inline-block max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--color-text-dim)]" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[4px] p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-[var(--color-line)]">
                    <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{displayName}</p>
                    <p className="font-mono text-[10px] text-[var(--color-text-dim)] truncate mt-0.5">{displayEmail}</p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (onGoDashboard) onGoDashboard();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[var(--color-signal)]" />
                      <span>Founder Console</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (onOpenHistoryModal) onOpenHistoryModal();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-[2px] transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-[var(--color-text-dim)]" />
                        <span>Saved Analyses</span>
                      </div>
                      {savedHistory?.length > 0 && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[var(--color-surface-2)] text-[var(--color-signal)] border border-[var(--color-line)] rounded-[2px]">
                          {savedHistory.length}
                        </span>
                      )}
                    </button>

                    <div className="border-t border-[var(--color-line)] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
