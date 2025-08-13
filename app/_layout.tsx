import { AuthProvider } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuth = false;

  useEffect(() => {
    // Prevent loop if we're already on /auth
    const inAuthGroup = segments[0] === "auth";

    // Only navigate when router is ready (segments is non-empty)
    if (segments.length > 0 && !isAuth && !inAuthGroup) {
      router.replace("/auth");
    }
  }, [segments, isAuth]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RouteGuard>
    </AuthProvider>
  );
}
