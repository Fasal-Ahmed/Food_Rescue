import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function DonorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donors</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: '700', color: colors.primary },
  sub: { color: colors.muted, marginTop: 4 },
});
