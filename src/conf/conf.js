// src/conf/conf.js
const getEnv = (key, fallback = "") => {
  const val = import.meta.env[key];
  if (typeof val === "string" && val.length) return val;
  console.warn(`[conf] missing env ${key} — using fallback "${fallback}"`);
  return fallback;
};

const conf = {
  appwriteUrl: getEnv("VITE_APPWRITE_URL", ""),
  appwriteProjectId: getEnv("VITE_APPWRITE_PROJECT_ID", ""),
  appwriteDatabaseId: getEnv("VITE_APPWRITE_DATABASE_ID", ""),
  appwriteCollectionId: getEnv("VITE_APPWRITE_COLLECTION_ID", ""),
  appwriteBucketId: getEnv("VITE_APPWRITE_BUCKET_ID", ""),
};

export default conf;
