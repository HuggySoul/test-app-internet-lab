import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, type MatchFilter } from '../models/matches';

const filters: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

export function MatchesScreen() {
  const { state, refresh } = useMatches();
  const favorites = useFavorites();
  const [filter, setFilter] = useState<MatchFilter>('all');

  const busy =
    state.status === 'loading' ||
    (state.status === 'ready' && state.refreshing);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          Матчи тура
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: busy }}
          disabled={busy}
          onPress={refresh}
          style={[styles.button, busy && styles.disabled]}
        >
          <Text style={styles.buttonText}>
            {busy
              ? 'Загрузка…'
              : state.status === 'error'
                ? 'Повторить'
                : 'Обновить'}
          </Text>
        </Pressable>
      </View>

      {state.status === 'ready' && (
        <View style={styles.metadata}>
          <Text style={styles.secondary}>Тур {state.data.round}</Text>
          <UpdatedAgo since={state.updatedAt} />
        </View>
      )}

      <View style={styles.filters}>
        {filters.map(({ value, label }) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === value }}
            onPress={() => setFilter(value)}
            style={[styles.filter, filter === value && styles.selectedFilter]}
          >
            <Text
              style={[
                styles.filterText,
                filter === value && styles.selectedText,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {favorites.isLoading && (
        <Text style={styles.secondary}>Восстанавливаем избранное…</Text>
      )}

      {favorites.warning && (
        <Text accessibilityRole="alert" style={styles.error}>
          {favorites.warning}
        </Text>
      )}

      {favorites.error && (
        <View style={styles.notice}>
          <Text accessibilityRole="alert" style={styles.error}>
            {favorites.error}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={favorites.retry}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {favorites.isReady ? 'Повторить сохранение' : 'Повторить чтение'}
            </Text>
          </Pressable>
        </View>
      )}

      {state.status !== 'loading' && state.error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {state.error}
        </Text>
      )}

      {state.status === 'loading' && (
        <View style={styles.empty}>
          <ActivityIndicator
            accessibilityLabel="Загрузка матчей"
            size="large"
            color="#2563eb"
          />
          <Text style={styles.secondary}>Загружаем матчи…</Text>
        </View>
      )}

      {state.status === 'ready' && (
        <FlatList
          data={filterMatches(state.data.matches, filter)}
          keyExtractor={(match) => match.id}
          extraData={favorites}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              favorite={favorites.isFavorite(item.id)}
              favoritesReady={favorites.isReady}
              onToggleFavorite={() => favorites.toggle(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.secondary}>
                {state.data.matches.length === 0
                  ? 'Матчей пока нет.'
                  : 'В этом фильтре пока нет матчей.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 16,
    gap: 12,
  },
  heading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#111827' },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  secondary: { fontSize: 14, color: '#6b7280' },
  button: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  disabled: { opacity: 0.55 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  selectedFilter: { backgroundColor: '#1f2937' },
  filterText: { fontSize: 14, color: '#374151' },
  selectedText: { color: '#fff' },
  list: { gap: 12, paddingBottom: 16, flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  error: { fontSize: 14, color: '#b91c1c' },
  notice: { gap: 8, alignItems: 'flex-start' },
});
