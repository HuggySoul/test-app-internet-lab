import { StyleSheet, Text, View } from "react-native";
import { formatStart, formatStatus, type Match } from "../models/matches";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
    match: Match;
    favorite: boolean;
    favoritesReady: boolean;
    onToggleFavorite: () => void;
}

export function MatchCard({ match, favorite, favoritesReady, onToggleFavorite }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={[styles.status, match.status === "live" && styles.live]}>
                    {formatStatus(match)}
                </Text>

                <FavoriteButton
                    active={favorite}
                    disabled={!favoritesReady}
                    onPress={onToggleFavorite}
                />
            </View>

            <View style={styles.teamRow}>
                <Text style={styles.team}>{match.home.name}</Text>
                <Text style={styles.score}>{match.score?.home ?? "—"}</Text>
            </View>

            <View style={styles.teamRow}>
                <Text style={styles.team}>{match.away.name}</Text>
                <Text style={styles.score}>{match.score?.away ?? "—"}</Text>
            </View>

            <Text style={styles.date}>{formatStart(match.startsAt)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#fff",
        gap: 8,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    status: { fontSize: 13, color: "#4b5563", flex: 1 },
    live: { color: "#c5261c", fontWeight: "600" },
    teamRow: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
    team: {
        flex: 1,
        fontSize: 17,
        lineHeight: 25,
        color: "#111827",
        fontWeight: "600",
    },
    score: {
        fontSize: 17,
        lineHeight: 25,
        color: "#111827",
        fontWeight: "700",
        textAlign: "right",
    },
    date: { fontSize: 13, color: "#6b7280" },
});
