import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useFood } from '../context/FoodContext';
import { categories, dietaryOptions } from '../data/foods';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import FoodCard from '../components/FoodCard';

export default function BrowseScreen({ navigation, route }) {
  const { foods, loading, getDonor } = useFood();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [diet, setDiet] = useState('Any');
  const [sort, setSort] = useState('expiry'); // 'expiry' | 'quantity'

  // Category passed from the Home screen
  useEffect(() => {
    if (route.params?.category) setCategory(route.params.category);
  }, [route.params?.category]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods
      .filter((f) => f.quantity > 0)
      .filter((f) => category === 'All' || f.category === category)
      .filter((f) => diet === 'Any' || f.tags.includes(diet))
      .filter((f) => {
        if (!q) return true;
        const donor = getDonor(f.donorId);
        return (
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          (donor && donor.name.toLowerCase().includes(q)) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (sort === 'expiry' ? a.hoursLeft - b.hoursLeft : b.quantity - a.quantity));
  }, [foods, query, category, diet, sort]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      <CategoryChips options={['All', ...categories]} selected={category} onSelect={setCategory} />
      <CategoryChips options={['Any', ...dietaryOptions]} selected={diet} onSelect={setDiet} />

      <View style={styles.sortRow}>
        <Text style={styles.count}>{results.length} result(s)</Text>
        <TouchableOpacity onPress={() => setSort(sort === 'expiry' ? 'quantity' : 'expiry')}>
          <Text style={styles.sort}>Sort: {sort === 'expiry' ? 'Expiring first' : 'Most quantity'} ⇅</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodCard food={item} donor={getDonor(item.donorId)} onPress={() => navigation.navigate('Details', { foodId: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No food found. Try another search or filter.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  count: { color: colors.muted },
  sort: { color: colors.primary, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});
