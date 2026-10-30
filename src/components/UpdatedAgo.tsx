import { useEffect, useState } from "react";
import { AppState, StyleSheet, Text } from "react-native";

type Props = { since: Date };

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
    const [now, setNow] = useState(Date.now);

    const timestamp = since.getTime();

    useEffect(() => {
        const update = () => setNow(Date.now());

        update();

        const interval = setInterval(update, 1000);
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") update();
        });

        return () => {
            clearInterval(interval);
            subscription.remove();
        };
    }, [timestamp]);

    const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));

    return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
    text: { fontSize: 13, color: "#6b7280" },
});
