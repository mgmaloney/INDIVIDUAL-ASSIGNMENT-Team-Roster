import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getAllSupervisors = async () => {
  try {
    const { data } = await axios.get(`${dbURL}/therapists.json`);
    const therapists = Object.values(data);
    const supervisors = [];
    therapists.forEach((therapist) => {
      if (therapist.supervisor) {
        supervisors.push(therapist);
      }
    });
    return supervisors;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getSingleSupervisor = async (id) => {
  try {
    const { data } = await axios.get(`${dbURL}/therapists/${id}.json`);
    return data;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export { getAllSupervisors, getSingleSupervisor };
