import axiosInstance from './axiosConfig.js';
import Information from '../models/Information.js';

export const informationApi = {
  // CREATE
  createInformation: (data) => axiosInstance.post('/information', data),
  
  // READ
  getAllInformation: () => 
    axiosInstance.get('/information')
      .then(response => {
        console.log('[DEBUG] Full API Response:', {
          status: response.status,
          headers: response.headers,
          data: response.data
        });
        
        const { status, message, data } = response.data;
        
        console.log('[DEBUG] Extracted Fields:', { status, message });
        
        if (status !== 'SUCCESS') {
          console.error('[DEBUG] API Error:', message);
          throw new Error(message || 'Failed to fetch information');
        }
        
        console.log('[DEBUG] Raw Data Before Mapping:', JSON.stringify(data, null, 2));
        
        const mappedData = data.map(item => {
          const info = Information.fromDTO(item);
          console.log(`[DEBUG] Mapped Item ${item.idInfo}:`, info);
          return info;
        });

        console.log('[RESULT] Final Data to Return:', mappedData);
        return mappedData;
      })
      .catch(error => {
        console.error('[API ERROR]', error);
        throw error;
      }),
  getInformationById: (idInfo) => axiosInstance.get(`/information/${idInfo}`),
  
  // UPDATE
  updateInformation: (idInfo, data) => axiosInstance.put(`/information/${idInfo}`, data),
  
  // DELETE
  deleteInformation: (idInfo) => 
    axiosInstance.delete(`/information/${idInfo}`)
      .then(response => {
        const { status, message, data } = response.data;
        console.log('[DEBUG] Delete Response:', { status, message, data });
        
        if (status !== 'SUCCESS') {
          throw new Error(message || 'Failed to delete information');
        }
        return { message, data }; // Return both message and data
      })
      .catch(error => {
        console.error('[API ERROR] Delete failed:', error);
        throw error;
      }),
  
  // OTHER
  getAccountsByInformationId: (idInfo) => axiosInstance.get(`/information/${idInfo}/account`)
};