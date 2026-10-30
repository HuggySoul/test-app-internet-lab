import { MATCHES_URL } from "../config";
import type { MatchesResponse } from "../models/matches";
import { parseMatches } from "../utils/validation";

export async function fetchMatches(signal: AbortSignal): Promise<MatchesResponse> {
    const response = await fetch(MATCHES_URL, { signal, cache: "no-store" });

    if (!response.ok)
        throw new Error(`Не удалось загрузить матчи (HTTP ${response.status}).`);

    const data: unknown = await response.json();

    return parseMatches(data);
}
