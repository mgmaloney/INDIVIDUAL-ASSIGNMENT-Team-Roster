import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getSessionNoteByNoteId = async (noteId) => {
  try {
    const { data } = await axios.get(`${dbURL}/sessionNotes/${noteId}.json`);
    if (data) {
      return data;
    }
    return null;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getAllClientSessionNotes = async (clientId) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/sessionNotes.json?orderBy="clientId"&equalTo="${clientId}"`,
    );
    if (data.length() > 0) {
      return Object.values(data);
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getUnsignedSessionNotesTherapist = () => {
  try {
    const { data } = axios.get(
      `${dbURL}/sessionNotes.json?orderBy="signedByTherapist"&equalTo=false`,
    );
    if (data.length() > 0) {
      return Object.values(data);
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getUnsignedSessionNotesSuperVisor = async (supervisorId) => {
  const unsignedNotes = [];
  try {
    const { data } = await axios.get(
      `${dbURL}/sessionNotes.json?orderBy="signedByTherapist"&equalTo=true`,
    );
    const signedByTherapistNotes = Object.values(data);
    signedByTherapistNotes.forEach((note) => {
      if (note.supervisorId === supervisorId && !note.signedBySupervisor) {
        unsignedNotes.push(note);
      }
    });
    return unsignedNotes;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const updateSessionNote = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/sessionNotes/${payload.noteId}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const createSessionNote = async (payload) => {
  try {
    const response = await axios.post(`${dbURL}/sessionNotes.json`, payload);
    const noteId = await response.data.name;
    await updateSessionNote({ noteId });
    return 'success';
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const deleteSessionNote = async (payload) => {
  try {
    const response = await axios.delete(
      `${dbURL}/sessionNotes/${payload.noteId}`,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export {
  getSessionNoteByNoteId,
  getUnsignedSessionNotesTherapist,
  getUnsignedSessionNotesSuperVisor,
  getAllClientSessionNotes,
  updateSessionNote,
  createSessionNote,
  deleteSessionNote,
};
