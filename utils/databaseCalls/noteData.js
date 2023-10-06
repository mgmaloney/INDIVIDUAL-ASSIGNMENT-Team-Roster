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

const getAllUnsignedAppointmentNotes = async () => {
  try {
    const { data } = await axios.get(
      `${dbURL}/notes.json?orderBy="signedByTherapist"&equalTo=false`,
    );
    const notesArr = Object.values(data);
    if (notesArr.length > 0) {
      return notesArr;
    }
    return [];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};
const getUnsignedAppointmentNotesTherapist = async (therapistId) => {
  const allUnsignedNotes = await getAllUnsignedAppointmentNotes();
  const unsignedTherapistNotes = [];
  allUnsignedNotes.forEach((note) => {
    if (note.therapistId === therapistId) {
      unsignedTherapistNotes.push(note);
    }
  });
  return unsignedTherapistNotes;
};

const getUnsignedAppointmentNotesSuperVisor = async (supervisorId) => {
  const unsignedNotes = [];
  try {
    // for when incorporating the therapist user's unsigned notes
    // const therapistUserUnsigned = await getUnsignedAppointmentNotesTherapist(
    //   supervisorId,
    // );
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
    // return [...unsignedNotes, ...therapistUserUnsigned];
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

const getPsychotherapyNoteByAppointmentId = async (appointmentId) => {
  try {
    const { data } = await axios.get(
      `${dbURL}/psychotherapynotes.json?orderBy="appointmentId"&equalTo="${appointmentId}"`,
    );
    const dataArr = Object.values(data);
    return dataArr[0];
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

const updatePsychotherapyNote = async (payload) => {
  try {
    const response = await axios.patch(
      `${dbURL}/psychotherapynotes/${payload.firebaseKey}.json`,
      payload,
    );
    return response;
  } catch (e) {
    console.warn(e);
    return 'patch failed';
  }
};

const createPyschotherapyNote = async (payload) => {
  try {
    const { data } = await axios.post(
      `${dbURL}/psychotherapynotes.json`,
      payload,
    );
    const firebaseKey = await data.name;
    await updatePsychotherapyNote({ firebaseKey });
    return firebaseKey;
  } catch (e) {
    console.warn(e);
    return 'call failed';
  }
};

export {
  getAppointmentNoteByNoteId,
  getAllClientNotes,
  getNoteByAptId,
  getAllUnsignedAppointmentNotes,
  getUnsignedAppointmentNotesTherapist,
  getUnsignedAppointmentNotesSuperVisor,
  getAllClientAppointmentNotes,
  updateNote,
  createNote,
  deleteNote,
  getPsychotherapyNoteByAppointmentId,
  createPyschotherapyNote,
  updatePsychotherapyNote,
};
