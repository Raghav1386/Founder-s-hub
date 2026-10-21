import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Landmark,
  Cloud,
  History,
  FileText,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  isOpen,
  onClose,
  viewMode,
  onGoDashboard,
  onStartWizard,
  onOpenHistoryModal,
  onScrollToSection
}) {
  const { user, mongoUser, logout, savedHistory } = useAuth();

  const displayName = user?.displayName || mongoUser?.name || 'Startup Founder';
  const displayEmail = user?.email || mongoUser?.email || '';
  const avatarUrl = user?.photoURL || mongoUser?.avatar || '';

  const navItems = [
    {
      id: 'dashboard',
      num: '01',
      label: 'Console Overview',
      icon: LayoutDashboard,
      active: viewMode === 'dashboard',
      onClick: () => {
        onGoDashboard();
        if (onClose) onClose();
      }
    },
    {
      id: 'wizard',
      num: '02',
      label: 'New Assessment',
      icon: Sparkles,
      active: viewMode === 'wizard',
      onClick: () => {
        onStartWizard();
        if (onClose) onClose();
      }
    },
    {
      id: 'schemes',
      num: '03',
      label: 'Flagship Schemes',
      icon: Landmark,
      active: false,
      onClick: () => {
        if (viewMode !== 'dashboard') onGoDashboard();
        setTimeout(() => {
          if (onScrollToSection) onScrollToSection('flagship-schemes');
        }, 100);
        if (onClose) onClose();
      }
    },
    {
      id: 'cloud',
      num: '04',
      label: 'Cloud & Tech Credits',
      icon: Cloud,
      active: false,
      onClick: () => {
        if (viewMode !== 'dashboard') onGoDashboard();
        setTimeout(() => {
          if (onScrollToSection) onScrollToSection('cloud-credits');
        }, 100);
        if (onClose) onClose();
      }
    },
    {
      id: 'history',
      num: '05',
      label: 'Saved History',
      icon: History,
      badge: savedHistory?.length > 0 ? savedHistory.length : null,
      active: false,
      onClick: () => {
        onOpenHistoryModal();
        if (onClose) onClose();
      }
    },
    {
      id: 'compliance',
      num: '06',
      label: 'Statutory & Tax',
      icon: FileText,
      active: false,
      onClick: () => {
        if (viewMode !== 'dashboard') onGoDashboard();
        setTimeout(() => {
          if (onScrollToSection) onScrollToSection('compliance-section');
        }, 100);
        if (onClose) onClose();
      }
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[var(--color-surface-1)] border-r border-[var(--color-line)] select-none">
      
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-[var(--color-line)] shrink-0">
        <button
          type="button"
          onClick={() => {
            onGoDashboard();
            if (onClose) onClose();
          }}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          {/* Favicon Asset */}
          <div className="w-7 h-7 rounded-[3px] overflow-hidden border border-[var(--color-line)] shrink-0 bg-[var(--color-surface-2)] flex items-center justify-center">
            <img src="/favicon.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-tight text-[var(--color-text-primary)]">
                Founder's Hub
              </span>
            </div>
            <p className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider">
              Console &bull; Discovery
            </p>
          </div>
        </button>

        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-[3px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] border border-[var(--color-line)] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
          <span>Navigation</span>
          <span>Index</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] text-xs font-medium transition-colors cursor-pointer ${
                item.active
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-signal)]/40 font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] text-[var(--color-text-dim)] w-4">
                  {item.num}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${item.active ? 'text-[var(--color-signal)]' : 'text-[var(--color-text-dim)]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded-[2px] bg-[var(--color-surface-2)] text-[var(--color-signal)] border border-[var(--color-line)]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile & Sign Out Footer */}
      <div className="p-3 border-t border-[var(--color-line)] bg-[var(--color-surface-1)] shrink-0">
        <div className="p-2.5 rounded-[3px] bg-[var(--color-surface-2)] border border-[var(--color-line)] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-[2px] object-cover shrink-0 border border-[var(--color-line)]"
              />
            ) : (
              <div className="w-7 h-7 rounded-[2px] bg-[var(--color-surface-1)] text-[var(--color-signal)] font-mono font-semibold text-xs flex items-center justify-center shrink-0 border border-[var(--color-line)]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate leading-snug">{displayName}</p>
              <p className="font-mono text-[10px] text-[var(--color-text-dim)] truncate leading-snug">{displayEmail || 'Verified Founder'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-[2px] text-[var(--color-text-dim)] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
