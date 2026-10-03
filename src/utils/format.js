import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export function timeAgo(date) {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNowStrict(d, { addSuffix: false })
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
  } catch {
    return '';
  }
}

export function formatCount(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len).trim() + '…' : str;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
