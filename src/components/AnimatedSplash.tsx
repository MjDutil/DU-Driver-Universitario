import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '../theme/tokens';

const LOGO_SIZE = 120;
const useNativeDriver = Platform.OS !== 'web';

type AnimatedSplashProps = {
  onFinish: () => void;
};

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const pulse = Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver,
      }),
    ]);

    const exit = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.quad),
        useNativeDriver,
      }),
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 350,
        easing: Easing.in(Easing.quad),
        useNativeDriver,
      }),
    ]);

    const animation = Animated.sequence([pulse, Animated.delay(400)]);
    animation.start(() => {
      setLeaving(true);
      exit.start(() => onFinish());
    });

    return () => {
      animation.stop();
      exit.stop();
    };
  }, []);

  return (
    <Animated.View
      pointerEvents={leaving ? 'none' : 'auto'}
      style={[styles.container, { opacity }]}
    >
      <StatusBar style="light" />
      <Animated.Image
        source={require('../../assets/DU.png')}
        style={[styles.logo, { transform: [{ scale }] }]}
      />
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        caronas entre universitários
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  tagline: {
    position: 'absolute',
    bottom: spacing.xxl * 3,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.white,
  },
});
