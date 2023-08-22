import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getAppointments = async () => {
  try {
    const response = await fetch(`${dbURL}/appointments.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const appointmentsJSON = await response.json();
    const appointmentsArr = Object.values(appointmentsJSON);
    if (appointmentsArr) {
      return appointmentsArr;
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getAppointmentsByTherapistId = async (therapistId) => {
  try {
    const response = await fetch(
      `${dbURL}/appointments.json?orderBy="therapistId"&equalTo="${therapistId}"`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const appointmentsJSON = await response.json();
    const appointmentsArr = Object.values(appointmentsJSON);
    return appointmentsArr;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const updateAppointment = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/appointments/${payload.appointmentId}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const createAppointment = async (payload) => {
  try {
    const response = await axios.post(`${dbURL}/appointments.json`, payload);
    const appointmentId = await response.data.name;
    await updateAppointment({ appointmentId });
    return 'success';
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const deleteAppointment = async (appointmentId) => {
  try {
    const response = await axios.delete(
      `${dbURL}/appointments/${appointmentId}.json`,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export {
  getAppointments,
  getAppointmentsByTherapistId,
  updateAppointment,
  createAppointment,
  deleteAppointment,
};
