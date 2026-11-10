export const colors = {
  primary: '#2E7D32',
  primaryLight: '#E8F5E9',
  accent: '#FF8F00',
  danger: '#D32F2F',
  bg: '#F6F8F5',
  card: '#FFFFFF',
  text: '#1B1B1B',
  muted: '#6B7280',
  border: '#E5E7EB',
};

// Urgency badge based on hours left before the food expires
export const urgency = (hours) => {
  if (hours <= 6) return { label: 'Urgent', color: colors.danger };
  if (hours <= 24) return { label: 'Today', color: colors.accent };
  return { label: 'Fresh', color: colors.primary };
};

export const timeLeft = (hours) =>
  hours < 24 ? `${hours}h left` : `${Math.floor(hours / 24)}d left`;
