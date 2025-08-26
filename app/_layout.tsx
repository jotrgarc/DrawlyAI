import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TutorialProvider } from "@/hooks/tutorial-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerTintColor: '#1A1A1A',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="capture" options={{ 
        title: "Select Photo",
        presentation: 'modal',
        headerLeft: () => null,
      }} />
      <Stack.Screen name="processing" options={{ 
        headerShown: false,
        presentation: 'modal',
        gestureEnabled: false,
      }} />
      <Stack.Screen name="tutorial/[id]" options={{ 
        title: "Tutorial",
        headerShown: false,
      }} />
      <Stack.Screen name="library" options={{ 
        title: "My Tutorials",
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TutorialProvider>
          <RootLayoutNav />
        </TutorialProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
