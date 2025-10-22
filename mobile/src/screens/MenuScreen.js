import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../hooks/useTheme';

const menuSections = [
  {
    title: 'QUICK TOOLS',
    items: [
      { id: 'bookmarks', icon: 'bookmark', label: 'Bookmarks', badge: '12' },
      { id: 'history', icon: 'clock', label: 'History', badge: null },
      { id: 'downloads', icon: 'download', label: 'Downloads', badge: '3' },
      { id: 'reading', icon: 'book-open', label: 'Reading List', badge: '5' }
    ]
  },
  {
    title: 'PRIVACY',
    items: [
      { id: 'vpn', icon: 'shield', label: 'VPN', toggle: true },
      { id: 'adblock', icon: 'x-circle', label: 'Ad Blocker', toggle: true },
      { id: 'private', icon: 'eye-off', label: 'Private Mode', toggle: false }
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { id: 'appearance', icon: 'sun', label: 'Appearance', chevron: true },
      { id: 'privacy', icon: 'lock', label: 'Privacy & Security', chevron: true },
      { id: 'advanced', icon: 'sliders', label: 'Advanced', chevron: true }
    ]
  }
];

export default function MenuScreen() {
  const theme = useTheme();
  const [toggles, setToggles] = useState({
    vpn: false,
    adblock: true,
    private: false
  });

  const handleToggle = (id) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logo, {
            background: `linear-gradient(135deg, ${theme.colors.accentBlue}, ${theme.colors.accentPurple})`
          }]}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Aetherium
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Ethereal Simplicity, Essential Power
          </Text>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>
              {section.title}
            </Text>

            <View style={[styles.sectionContent, {
              backgroundColor: theme.colors.bgSecondary,
              borderColor: theme.colors.divider
            }]}>
              {section.items.map((item, itemIdx) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => item.toggle && handleToggle(item.id)}
                  >
                    <Icon name={item.icon} size={20} color={theme.colors.textPrimary} />
                    <Text style={[styles.menuLabel, { color: theme.colors.textPrimary }]}>
                      {item.label}
                    </Text>

                    {item.badge && (
                      <View style={[styles.badge, { backgroundColor: theme.colors.accentBlue }]}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}

                    {item.toggle !== undefined && (
                      <Switch
                        value={toggles[item.id]}
                        onValueChange={() => handleToggle(item.id)}
                        trackColor={{ 
                          false: theme.colors.bgTertiary,
                          true: theme.colors.accentGreen
                        }}
                        thumbColor="#FFFFFF"
                      />
                    )}

                    {item.chevron && (
                      <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
                    )}
                  </TouchableOpacity>

                  {itemIdx < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Version */}
        <Text style={[styles.version, { color: theme.colors.textTertiary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12
  },
  menuLabel: {
    flex: 1,
    fontSize: 16
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  divider: {
    height: 1,
    marginLeft: 48
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 24
  }
});
