import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getAllPractices = async () => {
  try {
    const { data } = await axios.get(`${dbURL}/practices.json`);
    const practices = Object.values(data);
    return practices;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export default getAllPractices;
