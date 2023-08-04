import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getNoteByNoteId = async (noteId) => {
  try {
    const { data } = await axios.get(`${dbURL}/notes/${noteId}.json`);
    if (data) {
      return data;
    }
    return null;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getAllClientNotes = async (clientId) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/notes.json?orderBy="clientId"&equalTo="${clientId}"`,
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

const getUnsignedNotesTherapist = () => {
  try {
    const { data } = axios.get(
      `${dbURL}/notes.json?orderBy="signedByTherapist"&equalTo=false`,
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

const getUnsignedNotesSuperVisor = async (supervisorId) => {
  const unsignedNotes = [];
  try {
    const { data } = await axios.get(
      `${dbURL}/notes.json?orderBy="signedByTherapist"&equalTo=true`,
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

const updateNote = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/notes/${payload.noteId}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const createNote = async (payload) => {
  try {
    const response = await axios.post(`${dbURL}/notes.json`, payload);
    const noteId = await response.data.name;
    await updateNote({ noteId });
    return 'success';
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const deleteNote = async (payload) => {
  try {
    const response = await axios.delete(`${dbURL}/notes/${payload.noteId}`);
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export {
  getNoteByNoteId,
  getUnsignedNotesTherapist,
  getUnsignedNotesSuperVisor,
  getAllClientNotes,
  updateNote,
  createNote,
  deleteNote,
};
