import { useFavoritesStorage } from "./useFavoritesStorage";

export function useFavorites() {
    const { favorites, updateFavorites, ...storage } = useFavoritesStorage();

    function isFavorite(id: string): boolean {
        return favorites?.includes(id) ?? false;
    }

    function toggle(id: string) {
        updateFavorites((previous) => previous.includes(id)
            ? previous.filter((favorite) => favorite !== id)
            : [...previous, id]);
    }

    return { ...storage, isFavorite, toggle };
}
