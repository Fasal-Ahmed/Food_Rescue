import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useFood } from '../context/FoodContext';
import { categories } from '../data/foods';
import FoodCard from '../components/FoodCard';

export default function HomeScreen({ navigation }) {
  const { foods, donors, stats, loading, getDonor } = useFood();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  const available = foods.filter((f) => f.quantity > 0);
  const expiring = [...available].filter((f) => f.hoursLeft <= 6).sort((a, b) => a.hoursLeft - b.hoursLeft);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Rescue food. Feed people. 🌱</Text>
        <Text style={styles.bannerSub}>Claim surplus food from local donors before it goes to waste.</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statNum}>{available.length}</Text><Text style={styles.statLabel}>Listings</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{donors.length}</Text><Text style={styles.statLabel}>Donors</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{stats.items}</Text><Text style={styles.statLabel}>You rescued</Text></View>
        </View>
      </View>

      <Text style={styles.section}>⏰ Expiring Soon</Text>
      {expiring.length === 0 && <Text style={styles.empty}>Nothing urgent right now.</Text>}
      {expiring.slice(0, 4).map((f) => (
        <FoodCard key={f.id} food={f} donor={getDonor(f.donorId)} onPress={() => navigation.navigate('Details', { foodId: f.id })} />
      ))}

      <Text style={styles.section}>Browse by Category</Text>
      <View style={styles.grid}>
        {categories.map((c) => (
          <TouchableOpacity key={c} style={styles.catBtn} onPress={() => navigation.navigate('Browse', { category: c })}>
            <Text style={styles.catText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.donorBtn} onPress={() => navigation.navigate('Donors')}>
        <Text style={styles.donorBtnText}>View Our Donors →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  banner: { backgroundColor: colors.primary, borderRadius: 18, padding: 18, marginBottom: 18 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  bannerSub: { color: '#DCEFDD', marginTop: 6 },
  statsRow: { flexDirection: 'row', marginTop: 16 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginHorizontal: 3 },
  statNum: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#DCEFDD', fontSize: 11 },
  section: { fontSize: 17, fontWeight: '700', color: colors.text, marginVertical: 10 },
  empty: { color: colors.muted, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  catBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  catText: { color: colors.primary, fontWeight: '600' },
  donorBtn: { marginTop: 14, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  donorBtnText: { color: colors.primary, fontWeight: '700' },
});
