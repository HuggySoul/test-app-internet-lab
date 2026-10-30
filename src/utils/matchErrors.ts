export function getMatchesErrorMessage(error: unknown, timedOut: boolean): string {
    if (timedOut) {
        return "Сервер не ответил вовремя. Попробуйте ещё раз.";
    }

    if (error instanceof SyntaxError) {
        return "Сервер вернул некорректный JSON.";
    }

    if (error instanceof TypeError) {
        return "Не удалось связаться с сервером. Проверьте подключение к интернету.";
    }

    return error instanceof Error ? error.message : "Не удалось загрузить матчи.";
}
