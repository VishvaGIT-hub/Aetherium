import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../../../shared/themes/theme-system';

export function useTheme() {
  const colorScheme = useColorScheme();
  // In production, this would read from settings
  // For now, just follow system theme
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
