import { useEffect, useRef, useState } from "react";
import { loadFavorites, saveFavorites } from "../storage/favoritesStorage";

type FavoritesState =
    | { status: "loading" }
    | { status: "error"; error: string }
    | { status: "ready"; favorites: string[]; warning?: string };

/** Управляет внешним хранилищем */
export function useFavoritesStorage() {
    const [state, setState] = useState<FavoritesState>({ status: "loading" });
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [saveAttempt, setSaveAttempt] = useState(0);
    const [saveError, setSaveError] = useState<string>();

    const saved = useRef<string[]>([]);

    const favorites = state.status === "ready" ? state.favorites : undefined;

    useEffect(() => {
        let disposed = false;

        loadFavorites()
            .then(({ ids, warning }) => {
                if (disposed) return;

                saved.current = ids;
                setState({ status: "ready", favorites: ids, warning });
            })
            .catch(() => {
                if (disposed) return;

                setState({
                    status: "error",
                    error: "Не удалось прочитать избранное.",
                });
            });

        return () => {
            disposed = true;
        };
    }, [loadAttempt]);

    useEffect(() => {
        if (favorites === undefined || favorites === saved.current) return;

        let disposed = false;

        saveFavorites(favorites)
            .then(() => {
                if (disposed) return;

                saved.current = favorites;
                setSaveError(undefined);
            })
            .catch(() => {
                if (disposed) return;

                setSaveError(
                    "Не удалось сохранить избранное. Изменения пока только в памяти.",
                );
            });

        return () => {
            disposed = true;
        };
    }, [favorites, saveAttempt]);

    function updateFavorites(update: (favorites: string[]) => string[]) {
        setState((previous) => {
            if (previous.status !== "ready") return previous;

            return { status: "ready", favorites: update(previous.favorites) };
        });
    }

    function retry() {
        if (state.status === "ready") {
            setSaveAttempt((value) => value + 1);

            return;
        }

        setState({ status: "loading" });
        setLoadAttempt((value) => value + 1);
    }

    return {
        favorites,
        isReady: state.status === "ready",
        isLoading: state.status === "loading",
        error: state.status === "error" ? state.error : saveError,
        warning: state.status === "ready" ? state.warning : undefined,
        updateFavorites,
        retry,
    };
}
