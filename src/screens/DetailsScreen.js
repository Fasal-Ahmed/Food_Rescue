import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { colors, urgency, timeLeft } from '../theme';
import { useFood } from '../context/FoodContext';
import { confirmDialog, notify } from '../utils/dialog';

export default function DetailsScreen({ route, navigation }) {
  const { getFood, getDonor, claimFood } = useFood();
  const food = getFood(route.params.foodId);
  const [qty, setQty] = useState(1);

  if (!food) return <Text style={styles.missing}>Food item not found.</Text>;

  const donor = getDonor(food.donorId);
  const u = urgency(food.hoursLeft);
  const soldOut = food.quantity < 1;

  const handleClaim = () => {
  confirmDialog('Confirm Claim', `Reserve ${qty} ${food.unit} of ${food.name}?`, 'Reserve', async () => {
    const ok = await claimFood(food.id, qty);
    if (ok) {
      notify('Reserved! 🎉', 'Collect it during the pickup window.');
      navigation.navigate('Main', { screen: 'My Rescues' });
    } else {
      notify('Sorry', 'That quantity is no longer available.');
    }
  });
};

  const Row = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>{food.emoji}</Text>
        <Text style={styles.name}>{food.name}</Text>
        <View style={[styles.badge, { backgroundColor: u.color }]}>
          <Text style={styles.badgeText}>{u.label} · {timeLeft(food.hoursLeft)}</Text>
        </View>
      </View>

      <Text style={styles.desc}>{food.description}</Text>

      <View style={styles.card}>
        <Row label="Category" value={food.category} />
        <Row label="Available" value={`${food.quantity} ${food.unit}`} />
        <Row label="Pickup window" value={food.pickupWindow} />
        <Row label="Dietary" value={food.tags.join(', ')} />
      </View>

      {donor && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{donor.emoji} {donor.name}</Text>
          <Text style={styles.small}>{donor.type} · ⭐ {donor.rating}</Text>
          <Text style={styles.small}>📍 {donor.address}</Text>
          <Text style={styles.small}>📞 {donor.phone}</Text>
        </View>
      )}

      {!soldOut && (
        <View style={styles.claimBox}>
          <Text style={styles.cardTitle}>How many do you need?</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={() => setQty(Math.min(food.quantity, qty + 1))}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={[styles.claimBtn, soldOut && { backgroundColor: colors.muted }]} disabled={soldOut} onPress={handleClaim}>
        <Text style={styles.claimText}>{soldOut ? 'Fully Claimed' : 'Claim This Food'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  missing: { textAlign: 'center', marginTop: 40, color: colors.muted },
  hero: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, padding: 20 },
  emoji: { fontSize: 64 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 10 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  desc: { color: colors.muted, marginVertical: 14, lineHeight: 20 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontWeight: '700', fontSize: 15, color: colors.text, marginBottom: 6 },
  small: { color: colors.muted, marginTop: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: colors.muted },
  value: { color: colors.text, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  claimBox: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  stepBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 22, color: colors.primary, fontWeight: '700' },
  qty: { fontSize: 22, fontWeight: '800', marginHorizontal: 28, color: colors.text },
  claimBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  claimText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
