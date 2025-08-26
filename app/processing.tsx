import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ProcessingScreen() {
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#4A90E2', '#9333EA']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.animationContainer,
            {
              transform: [{ rotate: spin }, { scale: scaleAnim }],
            },
          ]}
        >
          <Svg width={150} height={150} viewBox="0 0 150 150">
            <Circle
              cx="75"
              cy="75"
              r="60"
              fill="none"
              stroke="#FFF"
              strokeWidth="2"
              opacity="0.3"
            />
            <Rect
              x="45"
              y="45"
              width="60"
              height="60"
              fill="none"
              stroke="#FFF"
              strokeWidth="2"
              opacity="0.5"
            />
            <Path
              d="M 75 30 L 105 90 L 45 90 Z"
              fill="none"
              stroke="#FFF"
              strokeWidth="2"
              opacity="0.7"
            />
          </Svg>
        </Animated.View>

        <Text style={styles.title}>Analyzing Image</Text>
        <Text style={styles.subtitle}>
          Breaking down forms into simple shapes...
        </Text>

        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepDot} />
            <Text style={styles.stepText}>Detecting main structures</Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <Text style={styles.stepText}>Identifying geometric forms</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepDot} />
            <Text style={styles.stepText}>Creating tutorial sequence</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  animationContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 40,
  },
  steps: {
    width: width * 0.7,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    opacity: 0.3,
    marginRight: 12,
  },
  stepDotActive: {
    opacity: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
});
