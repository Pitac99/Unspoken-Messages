import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1E1E1E" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1E1E1E' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="pin-setup" />
        <Stack.Screen name="pin-auth" />
        <Stack.Screen name="home" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="terms" />
      </Stack>
    </>
  );
}