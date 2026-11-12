import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useFood } from '../context/FoodContext';
import SearchBar from '../components/SearchBar';

export default function DonorsScreen({ navigation }) {
  const { donors, foods } = useFood();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const data = donors.filter((d) => !q || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q));

  const renderItem = ({ item }) => {
    const items = foods.filter((f) => f.donorId === item.id && f.quantity > 0);
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.emoji} {item.name}</Text>
        <Text style={styles.small}>{item.type} · ⭐ {item.rating}</Text>
        <Text style={styles.small}>📍 {item.address}</Text>
        <Text style={styles.small}>📞 {item.phone}</Text>
        <Text style={styles.listTitle}>{items.length} active listing(s)</Text>
        {items.map((f) => (
          <TouchableOpacity key={f.id} onPress={() => navigation.navigate('Details', { foodId: f.id })}>
            <Text style={styles.link}>{f.emoji} {f.name} ({f.quantity} {f.unit})</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search donors..." />
      <FlatList
        style={{ marginTop: 12 }}
        data={data}
        keyExtractor={(d) => d.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No donors found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  small: { color: colors.muted, marginTop: 3 },
  listTitle: { marginTop: 10, fontWeight: '700', color: colors.primary },
  link: { color: colors.text, marginTop: 6 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 30 },
});
