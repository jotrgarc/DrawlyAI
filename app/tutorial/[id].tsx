import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  PanResponder,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Layers, Eye, X } from 'lucide-react-native';
import Svg, { Circle, Rect, Path, Line, Polyline } from 'react-native-svg';
import { useTutorials } from '@/hooks/tutorial-context';

const { width, height } = Dimensions.get('window');

export default function TutorialScreen() {
  const { id } = useLocalSearchParams();
  const { tutorials } = useTutorials();
  const tutorial = tutorials.find(t => t.id === id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [drawingPaths, setDrawingPaths] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setIsDrawing(true);
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
        if (currentPath.length > 0) {
          setDrawingPaths(prev => [...prev, currentPath]);
          setCurrentPath([]);
        }
      },
    })
  ).current;

  if (!tutorial) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Tutorial not found</Text>
      </SafeAreaView>
    );
  }

  const step = tutorial.steps[currentStep];

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setDrawingPaths([]);
    }
  };

  const handleNext = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setDrawingPaths([]);
    }
  };

  const renderShape = (shape: any, index: number) => {
    switch (shape.type) {
      case 'circle':
        return (
          <Circle
            key={index}
            cx={shape.x}
            cy={shape.y}
            r={shape.radius}
            fill="none"
            stroke="#4A90E2"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      case 'rectangle':
        return (
          <Rect
            key={index}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill="none"
            stroke="#9333EA"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      case 'triangle':
        const points = shape.points.map((p: any) => `${p.x},${p.y}`).join(' ');
        return (
          <Polyline
            key={index}
            points={points}
            fill="none"
            stroke="#EC4899"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      case 'line':
        return (
          <Line
            key={index}
            x1={shape.x1}
            y1={shape.y1}
            x2={shape.x2}
            y2={shape.y2}
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      default:
        return null;
    }
  };

  const renderPath = (path: any[], index: number) => {
    if (path.length < 2) return null;
    const d = path.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
    return (
      <Path
        key={index}
        d={d}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <X color="#1A1A1A" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step {currentStep + 1} of {tutorial.steps.length}</Text>
        <TouchableOpacity
          style={styles.overlayButton}
          onPress={() => setShowOverlay(!showOverlay)}
        >
          {showOverlay ? (
            <Eye color="#4A90E2" size={24} />
          ) : (
            <Layers color="#1A1A1A" size={24} />
          )}
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.canvas} {...panResponder.panHandlers}>
        {showOverlay && (
          <Image
            source={{ uri: tutorial.originalImage }}
            style={styles.overlayImage}
          />
        )}
        
        <Svg style={StyleSheet.absoluteFillObject}>
          {step.shapes.map((shape, index) => renderShape(shape, index))}
          {drawingPaths.map((path, index) => renderPath(path, index))}
          {currentPath.length > 0 && renderPath(currentPath, drawingPaths.length)}
        </Svg>
      </View>

      <View style={styles.info}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft color={currentStep === 0 ? '#D1D5DB' : '#4A90E2'} size={20} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.progress}>
            {tutorial.steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.navButton, currentStep === tutorial.steps.length - 1 && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={currentStep === tutorial.steps.length - 1}
          >
            <Text style={[styles.navButtonText, currentStep === tutorial.steps.length - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <ChevronRight color={currentStep === tutorial.steps.length - 1 ? '#D1D5DB' : '#4A90E2'} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setDrawingPaths([])}
        >
          <Text style={styles.clearButtonText}>Clear Drawing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  overlayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: 20,
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
  overlayImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    resizeMode: 'contain',
  },
  info: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#4A90E2',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#D1D5DB',
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
    width: 20,
  },
  progressDotCompleted: {
    backgroundColor: '#10B981',
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
});
