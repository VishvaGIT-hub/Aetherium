import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function TabsScreen() {
  const theme = useTheme();
  const [tabs, setTabs] = useState([
    { id: 1, title: 'Google', url: 'https://www.google.com', active: true },
    { id: 2, title: 'GitHub', url: 'https://github.com', active: false },
    { id: 3, title: 'Stack Overflow', url: 'https://stackoverflow.com', active: false }
  ]);

  const handleCloseTab = (id) => {
    setTabs(tabs.filter(tab => tab.id !== id));
  };

  const handleNewTab = () => {
    const newTab = {
      id: Date.now(),
      title: 'New Tab',
      url: 'aetherium://newtab',
      active: false
    };
    setTabs([...tabs, newTab]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary }]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: theme.colors.bgSecondary,
        borderBottomColor: theme.colors.divider
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Tabs ({tabs.length})
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={[styles.privateText, { color: theme.colors.accentPurple }]}>
              Private
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleNewTab}
          >
            <Icon name="plus" size={24} color={theme.colors.accentBlue} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Grid */}
      <ScrollView
        contentContainerStyle={styles.tabsContainer}
        showsVerticalScrollIndicator={false}
      >
        {tabs.map(tab => (
          <View
            key={tab.id}
            style={[styles.tabCard, {
              width: CARD_WIDTH,
              backgroundColor: theme.colors.bgSecondary,
              borderColor: tab.active ? theme.colors.accentBlue : theme.colors.divider
            }]}
          >
            {/* Tab Preview */}
            <View style={[styles.tabPreview, { backgroundColor: theme.colors.bgTertiary }]}>
              <Icon name="globe" size={32} color={theme.colors.textTertiary} />
            </View>

            {/* Tab Info */}
            <View style={styles.tabInfo}>
              <Text
                style={[styles.tabTitle, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
              >
                {tab.title}
              </Text>
              <Text
                style={[styles.tabUrl, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {tab.url}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.bgTertiary }]}
              onPress={() => handleCloseTab(tab.id)}
            >
              <Icon name="x" size={16} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* New Tab Card */}
        <TouchableOpacity
          style={[styles.newTabCard, {
            width: CARD_WIDTH,
            backgroundColor: theme.colors.bgSecondary,
            borderColor: theme.colors.divider,
            borderStyle: 'dashed'
          }]}
          onPress={handleNewTab}
        >
          <Icon name="plus" size={32} color={theme.colors.accentBlue} />
          <Text style={[styles.newTabText, { color: theme.colors.textSecondary }]}>
            New Tab
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, {
        backgroundColor: theme.colors.bgSecondary,
        borderTopColor: theme.colors.divider
      }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={[styles.actionText, { color: theme.colors.accentRed }]}>
            Close All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={[styles.actionText, { color: theme.colors.accentBlue }]}>
            New Private Tab
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16
  },
  headerButton: {
    padding: 4
  },
  privateText: {
    fontSize: 16,
    fontWeight: '500'
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16
  },
  tabCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 0
  },
  tabPreview: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabInfo: {
    padding: 12
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4
  },
  tabUrl: {
    fontSize: 12
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newTabCard: {
    borderRadius: 12,
    borderWidth: 2,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  newTabText: {
    fontSize: 15,
    fontWeight: '500'
  },
  bottomActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600'
  }
});
