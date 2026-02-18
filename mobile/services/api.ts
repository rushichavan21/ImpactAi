import Constants from 'expo-constants';

// Helper to get local server IP
const getBaseUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    const localhost = 'http://localhost:3000';
    
    if (!hostUri) return localhost;

    // Use the same IP as the Expo bundler
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000`;
};

const BASE_URL = getBaseUrl();

export const uploadAudio = async (uri: string, userId: string = 'test-user') => {
  try {
    const formData = new FormData();
    
    // Append audio file
    // basic file object for React Native FormData
    const file = {
      uri,
      name: 'recording.m4a',
      type: 'audio/m4a', 
    } as any; 

    formData.append('audio', file);
    formData.append('user_id', userId);

    console.log(`[API] Uploading to ${BASE_URL}/api/v1/plan-day`);

    const response = await fetch(`${BASE_URL}/api/v1/plan-day`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('[API] Error uploading audio:', error);
    throw error;
  }
};
