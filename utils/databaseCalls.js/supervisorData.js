import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getAllSupervisors = async () => {
  try {
    const { data } = await axios.get(`${dbURL}/supervisors.json`);
    const supervisors = Object.values(data);

    console.warn('supervisors', supervisors);
    return supervisors;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getSingleSupervisor = async (id) => {
  try {
    const { data } = await axios.get(`${dbURL}/supervisors/${id}.json`);
    return data;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export { getAllSupervisors, getSingleSupervisor };
