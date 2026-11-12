import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useFood } from '../context/FoodContext';
import { categories } from '../data/foods';
import { confirmDialog, notify } from '../utils/dialog';

export default function ImpactScreen() {
  const { stats, claims, loading, resetData } = useFood();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  const max = Math.max(1, ...Object.values(stats.byCategory));

  const confirmReset = () =>
  confirmDialog('Reset all data?', 'This clears your rescues and restores the original listings.', 'Reset', resetData, true);

  const Card = ({ emoji, value, label }) => (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Your Impact</Text>
      <View style={styles.grid}>
        <Card emoji="🍽️" value={stats.items} label="Items rescued" />
        <Card emoji="⚖️" value={`${stats.kg.toFixed(1)} kg`} label="Food saved" />
        <Card emoji="🌍" value={`${stats.co2.toFixed(1)} kg`} label="CO₂ avoided" />
        <Card emoji="✅" value={`${stats.collected}/${claims.length}`} label="Collected" />
      </View>

      <Text style={styles.section}>Rescued by Category</Text>
      <View style={styles.chart}>
        {categories.map((c) => {
          const v = stats.byCategory[c] || 0;
          return (
            <View key={c} style={styles.barRow}>
              <Text style={styles.barLabel}>{c}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(v / max) * 100}%` }]} />
              </View>
              <Text style={styles.barValue}>{v}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.tip}>
        <Text style={styles.tipText}>💡 About one third of all food produced is wasted. Every rescue helps.</Text>
      </View>

      <TouchableOpacity style={styles.reset} onPress={confirmReset}>
        <Text style={styles.resetText}>Reset App Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: colors.card, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  statEmoji: { fontSize: 26 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.primary, marginTop: 6 },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2 },
  section: { fontSize: 17, fontWeight: '700', color: colors.text, marginVertical: 10 },
  chart: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  barRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  barLabel: { width: 90, fontSize: 12, color: colors.text },
  barTrack: { flex: 1, height: 10, backgroundColor: colors.primaryLight, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: colors.primary, borderRadius: 5 },
  barValue: { width: 30, textAlign: 'right', color: colors.muted, fontSize: 12 },
  tip: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14, marginTop: 16 },
  tipText: { color: colors.primary },
  reset: { marginTop: 20, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.danger, alignItems: 'center' },
  resetText: { color: colors.danger, fontWeight: '700' },
});
