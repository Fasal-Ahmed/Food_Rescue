import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, urgency, timeLeft } from '../theme';

export default function FoodCard({ food, donor, onPress }) {
  const u = urgency(food.hoursLeft);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.emojiBox}>
        <Text style={styles.emoji}>{food.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{food.name}</Text>
        <Text style={styles.donor} numberOfLines={1}>{donor ? donor.name : ''}</Text>
        <Text style={styles.qty}>{food.quantity} {food.unit} available</Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: u.color }]}>
          <Text style={styles.badgeText}>{u.label}</Text>
        </View>
        <Text style={styles.time}>{timeLeft(food.hoursLeft)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  emojiBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  donor: { color: colors.muted, marginTop: 2, fontSize: 12 },
  qty: { color: colors.primary, marginTop: 4, fontSize: 12, fontWeight: '600' },
  right: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  time: { color: colors.muted, fontSize: 11, marginTop: 6 },
});
