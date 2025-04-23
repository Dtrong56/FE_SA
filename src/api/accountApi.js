import axiosInstance from './axiosConfig.js';
import Account from '../models/Account.js';

export const accountApi = {
  // CREATE
  createAccount: (idInfo, data) => 
    axiosInstance.post(`/account/${idInfo}`, data)
      .then(response => {
        const { status, message, data } = response.data;
        
        if (status !== 'SUCCESS') {
          throw new Error(message || 'Failed to create account');
        }
        
        return data;
      }),
  
  // READ
  getAllAccounts: () => 
    axiosInstance.get('/account')
      .then(response => {
        const { status, message, data } = response.data;
        
        if (status !== 'SUCCESS') {
          throw new Error(message || 'Failed to fetch accounts');
        }
        
        const mappedData = data.map(item => {
          const account = Account.fromDTO({
            idAccount: item.idAccount,  // Changed from idAcc
            accountName: item.accountName,
            password: item.password,
            isLocked: item.isLocked,
            information: item.information  // Added information object
          });
          return account;
        });

        return mappedData;
      })
      .catch(error => {
        console.error('[API ERROR]', error);
        throw error;
      }),

  getAccountById: (idAcc) => 
    axiosInstance.get(`/account/${idAcc}`)
      .then(response => {
        const { status, message, data } = response.data;
        
        if (status !== 'SUCCESS') {
          throw new Error(message || 'Failed to fetch account');
        }
        
        return data ? Account.fromDTO(data) : null;
      }),
  
  // UPDATE
  updateAccount: (idAcc, data) => 
    axiosInstance.put(`/account/${idAcc}`, data)
      .then(response => {
        const { status, message, data } = response.data;
        
        if (status !== 'SUCCESS') {
          throw new Error(message || 'Failed to update account');
        }
        
        return data;
      }),
  
  // DELETE
  deleteAccount: (idAcc) => 
    axiosInstance.delete(`/account/${idAcc}`)
      .then(response => {
        const { status, message, data } = response.data;
        
        if (status !== 'SUCCESS') {
          throw new Error(message || 'Failed to delete account');
        }
        
        return { message, data };
      })
      .catch(error => {
        console.error('[API ERROR] Delete failed:', error);
        throw error;
      })
};