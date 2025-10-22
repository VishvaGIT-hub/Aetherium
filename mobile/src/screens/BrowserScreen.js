import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../hooks/useTheme';

export default function BrowserScreen() {
  const theme = useTheme();
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  const handleNavigate = () => {
    Keyboard.dismiss();
    let finalUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        finalUrl = `https://${url}`;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    setCurrentUrl(finalUrl);
    webViewRef.current?.injectJavaScript(`window.location.href = "${finalUrl}"`);
  };

  const handleBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary }]}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bgPrimary}
      />

      {/* Top Bar */}
      <View style={[styles.topBar, { 
        backgroundColor: theme.colors.bgSecondary,
        borderBottomColor: theme.colors.divider
      }]}>
        <View style={[styles.addressBar, {
          backgroundColor: theme.colors.inputBg,
          borderColor: theme.colors.inputBorder
        }]}>
          <Icon name="search" size={18} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, {
              color: theme.colors.textPrimary
            }]}
            value={url}
            onChangeText={setUrl}
            onSubmitEditing={handleNavigate}
            placeholder="Search or enter address..."
            placeholderTextColor={theme.colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="web-search"
            returnKeyType="go"
          />
          {loading && (
            <ActivityIndicator size="small" color={theme.colors.accentBlue} />
          )}
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setUrl(navState.url);
        }}
        allowsBackForwardNavigationGestures
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, {
        backgroundColor: theme.colors.bgSecondary,
        borderTopColor: theme.colors.divider
      }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleBack}
          disabled={!canGoBack}
        >
          <Icon 
            name="arrow-left" 
            size={24} 
            color={canGoBack ? theme.colors.textPrimary : theme.colors.textTertiary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleForward}
          disabled={!canGoForward}
        >
          <Icon 
            name="arrow-right" 
            size={24} 
            color={canGoForward ? theme.colors.textPrimary : theme.colors.textTertiary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleRefresh}
        >
          <Icon name="refresh-cw" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Icon name="share-2" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Icon name="more-horizontal" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
  },
  webview: {
    flex: 1
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingHorizontal: 8
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
