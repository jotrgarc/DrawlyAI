import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Drawly',
    subtitle: 'Learn to draw anything with AI-powered tutorials',
    description: 'Transform photos into step-by-step drawing guides using the Loomis method',
    color: ['#4A90E2', '#5BA3F5'] as const,
  },
  {
    title: 'The Loomis Method',
    subtitle: 'See the world in simple shapes',
    description: 'Break down complex forms into basic geometric shapes - circles, rectangles, and triangles',
    color: ['#9333EA', '#A855F7'] as const,
  },
  {
    title: 'Step-by-Step Learning',
    subtitle: 'Progress at your own pace',
    description: 'Follow guided tutorials that build from simple shapes to detailed drawings',
    color: ['#EC4899', '#F472B6'] as const,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      router.replace('/');
    }
  };

  const renderIllustration = () => {
    if (currentSlide === 0) {
      return (
        <Svg width={width * 0.8} height={200} viewBox="0 0 300 200">
          <Circle cx="150" cy="100" r="60" fill="#FFF" opacity="0.3" />
          <Rect x="120" y="70" width="60" height="60" fill="#FFF" opacity="0.5" />
          <Path
            d="M 150 40 L 180 100 L 120 100 Z"
            fill="#FFF"
            opacity="0.7"
          />
        </Svg>
      );
    } else if (currentSlide === 1) {
      return (
        <Svg width={width * 0.8} height={200} viewBox="0 0 300 200">
          <Circle cx="100" cy="100" r="40" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.8" />
          <Rect x="160" y="60" width="80" height="80" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.8" />
          <Path
            d="M 50 150 L 100 150 L 75 110 Z"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            opacity="0.8"
          />
          <Path
            d="M 200 150 L 250 150 L 225 110 Z"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            opacity="0.8"
          />
        </Svg>
      );
    } else {
      return (
        <Svg width={width * 0.8} height={200} viewBox="0 0 300 200">
          <Path
            d="M 50 100 L 100 100"
            stroke="#FFF"
            strokeWidth="3"
            opacity="0.3"
          />
          <Path
            d="M 120 100 L 170 100"
            stroke="#FFF"
            strokeWidth="3"
            opacity="0.5"
          />
          <Path
            d="M 190 100 L 240 100"
            stroke="#FFF"
            strokeWidth="3"
            opacity="0.7"
          />
          <Circle cx="260" cy="100" r="8" fill="#FFF" />
        </Svg>
      );
    }
  };

  return (
    <LinearGradient
      colors={slides[currentSlide].color}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.illustrationContainer}>
            {renderIllustration()}
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{slides[currentSlide].title}</Text>
            <Text style={styles.subtitle}>{slides[currentSlide].subtitle}</Text>
            <Text style={styles.description}>
              {slides[currentSlide].description}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentSlide && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.9}
            >
              <Text style={styles.nextButtonText}>
                {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
              <ChevronRight color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500' as const,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFF',
    opacity: 0.95,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    opacity: 0.3,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    opacity: 1,
    width: 24,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600' as const,
    marginRight: 8,
  },
});
