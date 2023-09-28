import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const updateAptSeries = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/aptSeries/${payload.aptSeriesId}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const createAptSeries = async (payload) => {
  try {
    const { data } = await axios.post(`${dbURL}/aptSeries.json`, payload);
    const aptSeriesId = data.name;
    updateAptSeries({ aptSeriesId });
    return aptSeriesId
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};
const deleteAptSeries = async (aptSeriesId) => {
  try {
    const response = await axios.delete(
      `${dbURL}/aptSeries/${aptSeriesId}.json`,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export { updateAptSeries, createAptSeries, deleteAptSeries };
