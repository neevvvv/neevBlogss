// src/conf/conf.js

const getEnv = (key, fallback = "") => {
  const v = import.meta.env[key];
  if (typeof v === "string" && v.length) return v;
  console.warn(`[conf] Missing env ${key}, using fallback "${fallback}"`);
  return fallback;
};

const conf = {
  appwriteUrl: getEnv("VITE_APPWRITE_URL", ""),
  appwriteProjectId: getEnv("VITE_APPWRITE_PROJECT_ID", ""),
  appwriteDatabaseId: getEnv("VITE_APPWRITE_DATABASE_ID", ""),
  appwriteCollectionId: getEnv("VITE_APPWRITE_COLLECTION_ID", ""),
  appwriteBucketId: getEnv("VITE_APPWRITE_BUCKET_ID", ""),

  // YOU WERE MISSING THESE TWO ⬇⬇⬇
  appwriteLikesCollectionId: getEnv("VITE_APPWRITE_LIKES_COLLECTION_ID", ""),
  appwriteCommentsCollectionId: getEnv("VITE_APPWRITE_COMMENTS_COLLECTION_ID", ""),

  tinymceApiKey: getEnv("VITE_TINYMCE_API_KEY", "")
};

export default conf;
