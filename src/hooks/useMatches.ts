import { useEffect, useRef, useState } from "react";
import { fetchMatches } from "../api/matches";
import type { MatchesResponse } from "../models/matches";
import { getMatchesErrorMessage } from "../utils/matchErrors";

type MatchesState =
    | { status: "loading" }
    | { status: "error"; error: string }
    | {
          status: "ready";
          data: MatchesResponse;
          updatedAt: Date;
          refreshing: boolean;
          error?: string;
      };

export function useMatches() {
    const [state, setState] = useState<MatchesState>({ status: "loading" });
    const [request, setRequest] = useState(0);

    const inFlight = useRef(true);

    useEffect(() => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        let disposed = false;

        inFlight.current = true;

        async function load() {
            try {
                const data = await fetchMatches(controller.signal);

                if (!disposed) {
                    setState({
                        status: "ready",
                        data,
                        updatedAt: new Date(),
                        refreshing: false,
                    });
                }
            } catch (error: unknown) {
                if (disposed) return;

                const message = getMatchesErrorMessage(error, controller.signal.aborted);

                setState((previous) =>
                    previous.status === "ready"
                        ? { ...previous, refreshing: false, error: message }
                        : { status: "error", error: message },
                );
            } finally {
                clearTimeout(timeout);

                if (!disposed) inFlight.current = false;
            }
        }

        void load();

        return () => {
            disposed = true;
            clearTimeout(timeout);
            controller.abort();
        };
    }, [request]);

    function refresh() {
        if (inFlight.current) return;

        inFlight.current = true;

        setState((previous) =>
            previous.status === "ready"
                ? { ...previous, refreshing: true, error: undefined }
                : { status: "loading" },
        );

        setRequest((value) => value + 1);
    }

    return { state, refresh };
}
