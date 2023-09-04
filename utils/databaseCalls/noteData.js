import axios from 'axios';
import { clientCredentials } from '../client';

const dbURL = clientCredentials.databaseURL;

const getAppointmentNoteByNoteId = async (noteId) => {
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

const getAllClientAppointmentNotes = async (clientId) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/notes.json?orderBy="clientId"&equalTo="${clientId}"`,
    );
    const notes = Object.values(data);
    const appointmentNotes = [];
    notes.forEach((note) => {
      if (note.type === 'appointment') {
        appointmentNotes.push(note);
      }
    });
    return appointmentNotes;
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
    const notes = Object.values(data);
    if (notes.length > 0) {
      return notes;
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const getNoteByAptId = async (appointmentId) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/notes.json?orderBy="appointmentId"&equalTo="${appointmentId}"`,
    );
    const dataArr = Object.values(data);
    return dataArr[0];
  } catch (e) {
    return 'call failed';
  }
};

const getUnsignedAppointmentNotesTherapist = async () => {
  try {
    const { data } = await axios.get(
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

const getUnsignedAppointmentNotesSuperVisor = async (supervisorId) => {
  const unsignedNotes = [];
  try {
    const { data } = await axios.get(
      `${dbURL}/notes.json?orderBy="signedByTherapist"&equalTo=true`,
    );
    const signedByTherapistNotes = Object.values(data);
    signedByTherapistNotes.forEach((note) => {
      if (
        note.supervisorId === supervisorId &&
        note.sharedWithSupervisor &&
        !note.signedBySupervisor
      ) {
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

const deleteNote = async (noteId) => {
  try {
    const response = await axios.delete(`${dbURL}/notes/${noteId}.json`);
    return response;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};


export {
  getAppointmentNoteByNoteId,
  getAllClientNotes,
  getNoteByAptId,
  getUnsignedAppointmentNotesTherapist,
  getUnsignedAppointmentNotesSuperVisor,
  getAllClientAppointmentNotes,
  updateNote,
  createNote,
  deleteNote,
};
