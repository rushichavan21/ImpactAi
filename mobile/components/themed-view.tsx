import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  // Force dark mode background as per design system
  const backgroundColor = '#09090b';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
