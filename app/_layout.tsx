import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

import { SafeAreaProvider } from "react-native-safe-area-context";



const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'transparent', // or your existing background
    surface: 'transparent',
    primary: '#6200ee', // keep your brand colors
  },
};



function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  
  const {user  , isLoadingUser} = useAuth();


  useEffect(() => {
    const inAuthGroup = segments[0] ==="auth"

    if(!user &&!inAuthGroup && !isLoadingUser){
      router.replace("/auth")
    }
    else if(user && inAuthGroup &&!isLoadingUser){
      router.replace("/")
    }
    

  }, [user,segments, ]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
 <AuthProvider>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
  );
}
