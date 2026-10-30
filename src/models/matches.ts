export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';
export type MatchFilter = 'all' | 'upcoming' | 'finished';

export interface Team {
  name: string;
}

export interface Match {
  id: string;
  startsAt: string | null;
  status: MatchStatus;
  home: Team;
  away: Team;
  score: { home: number; away: number } | null;
  minute?: number;
}

export interface MatchesResponse {
  round: number;
  matches: Match[];
}

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') return matches;

  return matches.filter((match) =>
    filter === 'finished'
      ? match.status === 'finished'
      : match.status === 'scheduled' || match.status === 'postponed',
  );
}

const statusLabels: Record<MatchStatus, string> = {
  scheduled: 'Предстоит',
  live: 'Идёт матч',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

export function formatStatus(match: Match): string {
  return match.status === 'live' && match.minute !== undefined
    ? `${statusLabels.live} · ${match.minute}-я минута`
    : statusLabels[match.status];
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatStart(startsAt: string | null): string {
  return startsAt === null
    ? 'Дата уточняется'
    : dateFormatter.format(new Date(startsAt));
}
