import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { useTutorials } from '@/hooks/tutorial-context';

export default function LibraryScreen() {
  const { tutorials, removeTutorial } = useTutorials();

  const renderTutorial = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.tutorialCard}
      onPress={() => router.push(`/tutorial/${item.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.originalImage }} style={styles.thumbnail} />
      <View style={styles.tutorialInfo}>
        <Text style={styles.tutorialTitle}>{item.title}</Text>
        <Text style={styles.tutorialMeta}>
          {item.steps.length} steps • {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeTutorial(item.id)}
      >
        <Trash2 color="#EF4444" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (tutorials.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No tutorials yet</Text>
        <Text style={styles.emptyText}>
          Create your first tutorial to start learning
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/capture')}
        >
          <Text style={styles.createButtonText}>Create Tutorial</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tutorials}
        renderItem={renderTutorial}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  list: {
    padding: 20,
  },
  tutorialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
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
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  tutorialInfo: {
    flex: 1,
    marginLeft: 16,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tutorialMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
