import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getAllClients = async () => {
  try {
    const { data } = await axios.get(`${dbURL}/clients.json`);
    const dataArr = Object.values(data);
    if (dataArr.length > 0) {
      return dataArr;
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getClientsByTherapistId = async (therapistId) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/clients.json?orderBy="therapistId"&equalTo="${therapistId}"`,
    );
    const dataArr = Object.values(data);
    if (dataArr.length > 0) {
      return dataArr;
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const updateClient = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/clients/${payload.clientId}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const createClient = async (payload) => {
  try {
    const response = await axios.post(`${dbURL}/clients.json`, payload);
    const therapistId = await response.data.name;
    await updateClient({ therapistId });
    return 'success';
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const deleteClient = async (clientId) => {
  try {
    const response = await axios.delete(`${dbURL}/clients/${clientId}`);
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export {
  getAllClients,
  getClientsByTherapistId,
  updateClient,
  createClient,
  deleteClient,
};
