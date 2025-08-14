import { ConfigContext, ExpoConfig } from '@expo/config';

// Only load dotenv locally (EAS doesn't need it and won't have .env files)
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch {
    console.warn('dotenv not installed — skipping local env load');
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "native",
  slug: "native",
  extra: {
    EXPO_PUBLIC_APPWRITE_ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    EXPO_PUBLIC_APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    EXPO_PUBLIC_APPWRITE_PLATFORM: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    EXPO_PUBLIC_DB_ID: process.env.EXPO_PUBLIC_DB_ID,
    EXPO_PUBLIC_HABITS_COLLECTION_ID: process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID,
    EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID: process.env.EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID,
    eas: {
      projectId: "96bef653-4a06-4bd5-bf33-420b6f255ade",
    },
  },
});
