/**
 * Design Token System & Standard Studio Classes
 * Founder's Hub Studio Aesthetic: Flat, Precision, 2-4px radius, 1px Hairlines
 */

export const THEME = {
  colors: {
    ink: '#0E1119',
    surface1: '#151926',
    surface2: '#1C2132',
    line: 'rgba(255, 255, 255, 0.08)',
    lineStrong: 'rgba(255, 255, 255, 0.16)',
    textPrimary: '#EDEEF5',
    textMuted: '#8B91A7',
    textDim: '#545B73',
    signal: '#7C83FF',
    signalHover: '#969CFF',
    spark: '#F06BAA',
    accentText: '#0E1119',

    // Status colors
    statusSuccess: '#34D399',
    statusWarning: '#FBBF24',
    statusDanger: '#F87171'
  },
  classes: {
    // Studio Cards (Flat, 1px hairline, 3-4px radius, no shadows)
    card: 'bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[4px] transition-colors duration-150',
    cardInteractive: 'bg-[var(--color-surface-1)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] rounded-[4px] transition-colors duration-150',
    cardSubtle: 'bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[3px]',

    // Studio Buttons
    btnPrimary: 'inline-flex items-center justify-center font-medium text-xs sm:text-sm px-4 py-2 rounded-[3px] bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-[var(--color-accent-text)] transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border border-[var(--color-signal)] focus-visible:outline-2 focus-visible:outline-[var(--color-signal)] focus-visible:outline-offset-2',
    btnSecondary: 'inline-flex items-center justify-center font-medium text-xs sm:text-sm px-4 py-2 rounded-[3px] bg-transparent hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-signal)] focus-visible:outline-offset-2',
    btnGhost: 'inline-flex items-center justify-center font-medium text-xs sm:text-sm px-3 py-1.5 rounded-[3px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    btnDanger: 'inline-flex items-center justify-center font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-[3px] bg-red-950/40 text-red-400 border border-red-800/60 hover:bg-red-900/50 transition-colors duration-150 cursor-pointer',

    // Form Inputs
    input: 'w-full h-10 px-3 text-xs sm:text-sm bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[3px] text-[var(--color-text-primary)] placeholder:[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-signal)] transition-colors duration-150',
    select: 'w-full h-10 px-3 text-xs sm:text-sm bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[3px] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-signal)] transition-colors duration-150',
    textarea: 'w-full px-3 py-2.5 text-xs sm:text-sm bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[3px] text-[var(--color-text-primary)] placeholder:[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-signal)] transition-colors duration-150',
    label: 'block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5',
    helperText: 'text-xs text-[var(--color-text-muted)] mt-1',

    // Technical Tags / Metadata Badges (Flat, 2px radius, Mono)
    badgeSuccess: 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[11px] font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/60',
    badgeWarning: 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[11px] font-medium bg-amber-950/50 text-amber-400 border border-amber-800/60',
    badgeSignal: 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[11px] font-medium bg-[var(--color-surface-2)] text-[var(--color-signal)] border border-[var(--color-signal)]/30',
    badgeSpark: 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[11px] font-medium bg-[var(--color-spark)]/10 text-[var(--color-spark)] border border-[var(--color-spark)]/30',
    badgeNeutral: 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[11px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-line)]',

    // Containers
    pageContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
    sectionHeader: 'text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]',
    sectionSubheader: 'text-xs sm:text-sm text-[var(--color-text-muted)] mt-1'
  }
};

export default THEME;
