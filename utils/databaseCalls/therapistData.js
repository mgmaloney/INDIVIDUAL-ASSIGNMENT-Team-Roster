import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getTherapistByUid = async (uid) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/therapists.json?orderBy="uid"&equalTo="${uid}"`,
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

const getAllTherapists = async () => {
  try {
    const { data } = await axios.get(`${dbURL}/therapists.json`);
    return Object.values(data);
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getTherapistByTherapistId = async (therapistId) => {
  try {
    const { data } = await axios.get(`${dbURL}/therapists/${therapistId}.json`);
    if (data) {
      return data;
    }
    return null;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const updateTherapist = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/therapists/${payload.therapistId}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const createTherapist = async (payload) => {
  try {
    const response = await axios.post(`${dbURL}/therapists.json`, payload);
    const therapistId = await response.data.name;
    await updateTherapist({ therapistId });
    return 'success';
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const deleteTherapist = async (therapistId) => {
  try {
    const response = await axios.delete(`${dbURL}/therapists/${therapistId}`);
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export {
  getTherapistByUid,
  getTherapistByTherapistId,
  getAllTherapists,
  updateTherapist,
  createTherapist,
  deleteTherapist,
};
