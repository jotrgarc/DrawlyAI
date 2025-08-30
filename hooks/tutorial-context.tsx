import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface Shape {
  type: 'circle' | 'rectangle' | 'triangle' | 'line' | 'curve';
  x?: number;
  y?: number;
  radius?: number;
  width?: number;
  height?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  points?: { x: number; y: number }[];
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  shapes: Shape[];
}

export interface Tutorial {
  id: string;
  title: string;
  originalImage: string;
  createdAt: string;
  steps: TutorialStep[];
}

const STORAGE_KEY = 'drawly_tutorials';
const MAX_TUTORIALS = 10; // Limit to prevent storage overflow
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB max per image

export const [TutorialProvider, useTutorials] = createContextHook(() => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTutorials();
  }, []);

  const loadTutorials = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTutorials(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const compressImage = (base64Image: string): string => {
    // If image is too large, return a placeholder or truncate
    if (base64Image.length > MAX_IMAGE_SIZE) {
      console.warn('Image too large, using placeholder');
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    }
    return base64Image;
  };

  const saveTutorials = useCallback(async (updatedTutorials: Tutorial[]) => {
    try {
      // Limit number of tutorials and compress images
      const limitedTutorials = updatedTutorials
        .slice(0, MAX_TUTORIALS)
        .map(tutorial => ({
          ...tutorial,
          originalImage: compressImage(tutorial.originalImage)
        }));

      const dataToStore = JSON.stringify(limitedTutorials);
      
      // Check if data size is reasonable (5MB limit)
      if (dataToStore.length > 5 * 1024 * 1024) {
        throw new Error('Data too large for storage');
      }

      await AsyncStorage.setItem(STORAGE_KEY, dataToStore);
      setTutorials(limitedTutorials);
    } catch (error: any) {
      console.error('Error saving tutorials:', error);
      
      if (error.name === 'QuotaExceededError' || error.message?.includes('quota') || error.message?.includes('Data too large')) {
        // Storage is full, remove oldest tutorials and try again
        try {
          const reducedTutorials = updatedTutorials
            .slice(0, Math.max(1, MAX_TUTORIALS - 2))
            .map(tutorial => ({
              ...tutorial,
              originalImage: compressImage(tutorial.originalImage)
            }));
          
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reducedTutorials));
          setTutorials(reducedTutorials);
          
          Alert.alert(
            'Storage Full',
            'Some older tutorials were removed to make space for new ones.',
            [{ text: 'OK' }]
          );
        } catch (retryError) {
          console.error('Failed to save even after cleanup:', retryError);
          Alert.alert(
            'Storage Error',
            'Unable to save tutorial. Please try clearing some tutorials from your library.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Save Error',
          'Failed to save tutorial. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  }, []);

  const addTutorial = useCallback(async (tutorial: Tutorial) => {
    // Compress the image before adding
    const compressedTutorial = {
      ...tutorial,
      originalImage: compressImage(tutorial.originalImage)
    };
    
    const updated = [compressedTutorial, ...tutorials];
    await saveTutorials(updated);
  }, [tutorials, saveTutorials]);

  const removeTutorial = useCallback(async (id: string) => {
    const updated = tutorials.filter(t => t.id !== id);
    await saveTutorials(updated);
  }, [tutorials, saveTutorials]);

  const updateTutorial = useCallback(async (id: string, updates: Partial<Tutorial>) => {
    const updated = tutorials.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    await saveTutorials(updated);
  }, [tutorials, saveTutorials]);

  const clearAllTutorials = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setTutorials([]);
    } catch (error) {
      console.error('Error clearing tutorials:', error);
    }
  }, []);

  const getStorageInfo = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const sizeInBytes = stored ? stored.length : 0;
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      return {
        tutorialCount: tutorials.length,
        storageSizeMB: sizeInMB,
        maxTutorials: MAX_TUTORIALS
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }, [tutorials]);

  return useMemo(() => ({
    tutorials,
    isLoading,
    addTutorial,
    removeTutorial,
    updateTutorial,
    clearAllTutorials,
    getStorageInfo,
  }), [tutorials, isLoading, addTutorial, removeTutorial, updateTutorial, clearAllTutorials, getStorageInfo]);
});
