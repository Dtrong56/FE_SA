import { informationApi } from '../api/informationApi.js';

const testAPI = async () => {
  try {
    console.log('[TEST] Starting API call using informationApi');
    const data = await informationApi.getAllInformation();
    console.log('[TEST] Processed Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('[TEST] Error:', {
      message: error.message,
      stack: error.stack
    });
  }
};

testAPI();