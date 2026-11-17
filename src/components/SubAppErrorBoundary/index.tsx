import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import locale from '../../i18n/locale';
import { defaultTheme } from '../../themes';

interface Props {
  onRetry: () => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render/lazy-load errors of a sub-app so they never take the whole
// app down. Shows a retry screen instead.
class SubAppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{locale.t('SubAppErrorBoundary:Title')}</Text>
        <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
          <Text style={styles.buttonText}>
            {locale.t('SubAppErrorBoundary:Retry')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: defaultTheme.colors.background,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: defaultTheme.colors.text,
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: defaultTheme.colors.accent,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SubAppErrorBoundary;
