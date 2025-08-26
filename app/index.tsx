import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, BookOpen, Sparkles, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTutorials } from '@/hooks/tutorial-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const { tutorials } = useTutorials();
  const recentTutorials = tutorials.slice(0, 3);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(seen === 'true');
      if (seen !== 'true') {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setHasSeenOnboarding(false);
    }
  };

  if (hasSeenOnboarding === null) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#5BA3F5']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.title}>Drawly</Text>
            </View>
            <View style={styles.sparklesContainer}>
              <Sparkles color="#FFF" size={32} />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={() => router.push('/capture')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#6B46C1', '#9333EA']}
            style={styles.primaryCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Camera color="#FFF" size={40} />
            <View style={styles.primaryCardText}>
              <Text style={styles.primaryCardTitle}>Create New Tutorial</Text>
              <Text style={styles.primaryCardSubtitle}>
                Transform any photo into a step-by-step drawing guide
              </Text>
            </View>
            <ChevronRight color="#FFF" size={24} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Tutorials</Text>
            {tutorials.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/library')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentTutorials.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tutorialList}
            >
              {recentTutorials.map((tutorial) => (
                <TouchableOpacity
                  key={tutorial.id}
                  style={styles.tutorialCard}
                  onPress={() => router.push(`/tutorial/${tutorial.id}`)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: tutorial.originalImage }}
                    style={styles.tutorialImage}
                  />
                  <View style={styles.tutorialInfo}>
                    <Text style={styles.tutorialTitle} numberOfLines={1}>
                      {tutorial.title}
                    </Text>
                    <Text style={styles.tutorialSteps}>
                      {tutorial.steps.length} steps
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <BookOpen color="#9CA3AF" size={48} />
              <Text style={styles.emptyStateText}>
                No tutorials yet. Create your first one!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipEmoji}>✏️</Text>
              </View>
              <Text style={styles.tipTitle}>Start Simple</Text>
              <Text style={styles.tipText}>
                Begin with basic shapes before adding details
              </Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipEmoji}>👁️</Text>
              </View>
              <Text style={styles.tipTitle}>Observe Forms</Text>
              <Text style={styles.tipText}>
                Look for underlying geometric structures
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.libraryButton}
          onPress={() => router.push('/library')}
          activeOpacity={0.9}
        >
          <BookOpen color="#4A90E2" size={24} />
          <Text style={styles.libraryButtonText}>View Tutorial Library</Text>
          <ChevronRight color="#4A90E2" size={20} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#FFF',
    marginTop: 4,
  },
  sparklesContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  primaryCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  primaryCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  primaryCardText: {
    flex: 1,
    marginHorizontal: 20,
  },
  primaryCardTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  primaryCardSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500' as const,
  },
  tutorialList: {
    paddingHorizontal: 20,
  },
  tutorialCard: {
    width: width * 0.4,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tutorialImage: {
    width: '100%',
    height: width * 0.4,
    backgroundColor: '#F0F0F0',
  },
  tutorialInfo: {
    padding: 12,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tutorialSteps: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  tipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  tipCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  libraryButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#4A90E2',
    marginLeft: 12,
  },
});
