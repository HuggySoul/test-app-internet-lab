import type { Match, MatchesResponse } from "../models/matches";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isMatch(value: unknown): value is Match {
    if (!isRecord(value)) return false;

    const hasTeams = isRecord(value.home) && typeof value.home.name === "string"
        && isRecord(value.away) && typeof value.away.name === "string";

    const hasStart = value.startsAt === null || (typeof value.startsAt === "string"
        && Number.isFinite(Date.parse(value.startsAt)));

    const hasScore = value.score === null || (isRecord(value.score)
        && typeof value.score.home === "number" && typeof value.score.away === "number");

    return typeof value.id === "string"
        && typeof value.status === "string"
        && ["scheduled", "live", "finished", "postponed"].includes(value.status)
        && hasTeams && hasStart && hasScore
        && (value.minute === undefined || typeof value.minute === "number");
}

export function parseMatches(value: unknown): MatchesResponse {
    if (!isRecord(value) || typeof value.round !== "number"
        || !Array.isArray(value.matches) || !value.matches.every(isMatch)) {
        throw new Error("Сервер вернул некорректные данные матчей.");
    }

    return { round: value.round, matches: value.matches };
}

export function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}
