import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAt6GaS5rZNxXLSaNf7QsDzR14akBQKNcU",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      "ganchat-dd078.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      "ganchat-dd078",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      "ganchat-dd078.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      "728824725279",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:728824725279:web:4a49173d576f72e59aba2a",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      "G-TBX6YY8S41",
  },
});
