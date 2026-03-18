import type { IconName } from './data';

export function Icon({ name }: { name: IconName }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  switch (name) {
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 3 5 6v6c0 4.2 2.7 7.8 7 9 4.3-1.2 7-4.8 7-9V6l-7-3Z" />
          <path {...common} d="m9 12 2 2 4-5" />
        </svg>
      );
    case 'history':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M3 12a9 9 0 1 0 3-6.7" />
          <path {...common} d="M3 4v5h5" />
          <path {...common} d="M12 7v5l3 2" />
        </svg>
      );
    case 'compare':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M8 4H5a2 2 0 0 0-2 2v3" />
          <path {...common} d="M16 20h3a2 2 0 0 0 2-2v-3" />
          <path {...common} d="M16 4h3a2 2 0 0 1 2 2v3" />
          <path {...common} d="M8 20H5a2 2 0 0 1-2-2v-3" />
          <path {...common} d="M9 8h6" />
          <path {...common} d="M9 12h6" />
          <path {...common} d="M9 16h6" />
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5A1.5 1.5 0 0 0 18.5 18H6.5A2.5 2.5 0 0 0 4 20.5v-14Z" />
          <path {...common} d="M8 8h8" />
          <path {...common} d="M8 12h6" />
        </svg>
      );
    case 'key':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...common} cx="8" cy="15" r="4" />
          <path {...common} d="M12 15h9" />
          <path {...common} d="M18 12v6" />
          <path {...common} d="M21 13.5v3" />
        </svg>
      );
    case 'logout':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M10 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2" />
          <path {...common} d="M15 12H3" />
          <path {...common} d="m6 8-4 4 4 4" />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...common} cx="11" cy="11" r="7" />
          <path {...common} d="m20 20-3.5-3.5" />
        </svg>
      );
    case 'upload':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 16V4" />
          <path {...common} d="m7 9 5-5 5 5" />
          <path {...common} d="M5 19h14" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
          <path {...common} d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
          <path {...common} d="m5 14 .9 2.4L8.3 17l-2.4.9L5 20.3l-.9-2.4L1.7 17l2.4-.6L5 14Z" />
        </svg>
      );
    case 'share':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...common} cx="18" cy="5" r="3" />
          <circle {...common} cx="6" cy="12" r="3" />
          <circle {...common} cx="18" cy="19" r="3" />
          <path {...common} d="m8.6 10.7 6.8-4.4" />
          <path {...common} d="m8.6 13.3 6.8 4.4" />
        </svg>
      );
    case 'wand':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="m14 4 1.2 2.8L18 8l-2.8 1.2L14 12l-1.2-2.8L10 8l2.8-1.2L14 4Z" />
          <path {...common} d="m4 20 11-11" />
          <path {...common} d="m4 15 5 5" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M4 19h16" />
          <path {...common} d="M7 15V9" />
          <path {...common} d="M12 15V5" />
          <path {...common} d="M17 15v-3" />
        </svg>
      );
    case 'document':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path {...common} d="M14 3v5h5" />
          <path {...common} d="M9 13h6" />
          <path {...common} d="M9 17h6" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="M12 8v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}
