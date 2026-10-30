import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    active: boolean;
    onPress: () => void;
    disabled?: boolean;
};

// Звёздочка «в избранное».
export function FavoriteButton({ active, onPress, disabled = false }: Props) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={styles.button}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            accessibilityLabel={active ? "Убрать из избранного" : "Добавить в избранное"}
        >
            <Text style={[styles.star, active && styles.active]}>
                {active ? "★" : "☆"}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minWidth: 44,
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    star: {
        fontSize: 22,
        color: "#9ca3af",
    },
    active: {
        color: "#ef3124",
    },
});
