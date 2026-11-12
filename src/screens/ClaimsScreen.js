import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useFood } from '../context/FoodContext';
import CategoryChips from '../components/CategoryChips';
import { confirmDialog, notify } from '../utils/dialog';

export default function ClaimsScreen({ navigation }) {
  const { claims, loading, getFood, getDonor, collectClaim, cancelClaim } = useFood();
  const [filter, setFilter] = useState('All');

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  const data = claims.filter((c) => filter === 'All' || c.status === filter);

  const confirmCancel = (id) =>
  confirmDialog('Cancel reservation?', 'The food will be returned to the listings.', 'Cancel it', () => cancelClaim(id), true);

  const renderItem = ({ item }) => {
    const food = getFood(item.foodId);
    if (!food) return null;
    const donor = getDonor(food.donorId);
    const reserved = item.status === 'Reserved';
    return (
      <View style={styles.card}>
        <View style={styles.top}>
          <Text style={styles.emoji}>{food.emoji}</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{food.name}</Text>
            <Text style={styles.small}>{item.qty} {food.unit} · {donor ? donor.name : ''}</Text>
            <Text style={styles.small}>🕒 {food.pickupWindow}</Text>
          </View>
          <View style={[styles.status, { backgroundColor: reserved ? colors.accent : colors.primary }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        {reserved && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.collect]} onPress={() => collectClaim(item.id)}>
              <Text style={styles.collectText}>Mark Collected</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={() => confirmCancel(item.id)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CategoryChips options={['All', 'Reserved', 'Collected']} selected={filter} onSelect={setFilter} />
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.empty}>No rescues yet.</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Browse')}>
              <Text style={styles.browseText}>Find food to rescue</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  top: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 32 },
  name: { fontWeight: '700', fontSize: 15, color: colors.text },
  small: { color: colors.muted, fontSize: 12, marginTop: 2 },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 12 },
  btn: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  collect: { backgroundColor: colors.primary, marginRight: 8 },
  collectText: { color: '#fff', fontWeight: '700' },
  cancel: { borderWidth: 1, borderColor: colors.danger },
  cancelText: { color: colors.danger, fontWeight: '700' },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48 },
  empty: { color: colors.muted, marginTop: 8 },
  browseBtn: { marginTop: 14, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  browseText: { color: '#fff', fontWeight: '700' },
});
