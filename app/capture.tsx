import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTutorials } from '@/hooks/tutorial-context';

export default function CaptureScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addTutorial } = useTutorials();

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          `Please grant ${useCamera ? 'camera' : 'photo library'} access to continue.`
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    router.push('/processing');

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate tutorial steps (simulated)
      const tutorialId = Date.now().toString();
      const tutorial = {
        id: tutorialId,
        title: `Tutorial ${new Date().toLocaleDateString()}`,
        originalImage: selectedImage,
        createdAt: new Date().toISOString(),
        steps: [
          {
            id: '1',
            title: 'Basic Shapes',
            description: 'Start with the main circular and rectangular forms',
            shapes: [
              { type: 'circle' as const, x: 150, y: 100, radius: 50 },
              { type: 'rectangle' as const, x: 100, y: 150, width: 100, height: 80 },
            ],
          },
          {
            id: '2',
            title: 'Secondary Forms',
            description: 'Add supporting geometric structures',
            shapes: [
              { type: 'circle' as const, x: 150, y: 100, radius: 50 },
              { type: 'rectangle' as const, x: 100, y: 150, width: 100, height: 80 },
              { type: 'triangle' as const, points: [{ x: 150, y: 50 }, { x: 120, y: 100 }, { x: 180, y: 100 }] },
            ],
          },
          {
            id: '3',
            title: 'Connecting Lines',
            description: 'Draw construction lines to connect the forms',
            shapes: [
              { type: 'circle' as const, x: 150, y: 100, radius: 50 },
              { type: 'rectangle' as const, x: 100, y: 150, width: 100, height: 80 },
              { type: 'triangle' as const, points: [{ x: 150, y: 50 }, { x: 120, y: 100 }, { x: 180, y: 100 }] },
              { type: 'line' as const, x1: 150, y1: 100, x2: 150, y2: 230 },
            ],
          },
          {
            id: '4',
            title: 'Refine Details',
            description: 'Add smaller shapes for details',
            shapes: [
              { type: 'circle' as const, x: 150, y: 100, radius: 50 },
              { type: 'rectangle' as const, x: 100, y: 150, width: 100, height: 80 },
              { type: 'triangle' as const, points: [{ x: 150, y: 50 }, { x: 120, y: 100 }, { x: 180, y: 100 }] },
              { type: 'line' as const, x1: 150, y1: 100, x2: 150, y2: 230 },
              { type: 'circle' as const, x: 130, y: 90, radius: 10 },
              { type: 'circle' as const, x: 170, y: 90, radius: 10 },
            ],
          },
          {
            id: '5',
            title: 'Final Outline',
            description: 'Complete the drawing with final contours',
            shapes: [
              { type: 'circle' as const, x: 150, y: 100, radius: 50 },
              { type: 'rectangle' as const, x: 100, y: 150, width: 100, height: 80 },
              { type: 'triangle' as const, points: [{ x: 150, y: 50 }, { x: 120, y: 100 }, { x: 180, y: 100 }] },
              { type: 'line' as const, x1: 150, y1: 100, x2: 150, y2: 230 },
              { type: 'circle' as const, x: 130, y: 90, radius: 10 },
              { type: 'circle' as const, x: 170, y: 90, radius: 10 },
              { type: 'curve' as const, points: [{ x: 120, y: 110 }, { x: 150, y: 120 }, { x: 180, y: 110 }] },
            ],
          },
        ],
      };

      await addTutorial(tutorial);
      
      router.replace(`/tutorial/${tutorialId}`);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      router.back();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X color="#1A1A1A" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {selectedImage ? (
          <>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.secondaryButtonText}>Choose Different</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={processImage}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Generate Tutorial</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.placeholder}>
              <ImageIcon color="#9CA3AF" size={64} />
              <Text style={styles.placeholderText}>
                Select a photo to transform into a drawing tutorial
              </Text>
            </View>
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => pickImage(true)}
              >
                <Camera color="#4A90E2" size={32} />
                <Text style={styles.optionTitle}>Take Photo</Text>
                <Text style={styles.optionDescription}>
                  Use your camera to capture
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => pickImage(false)}
              >
                <ImageIcon color="#9333EA" size={32} />
                <Text style={styles.optionTitle}>Choose from Gallery</Text>
                <Text style={styles.optionDescription}>
                  Select an existing photo
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 40,
  },
  options: {
    gap: 16,
    paddingBottom: 20,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
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
  optionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
