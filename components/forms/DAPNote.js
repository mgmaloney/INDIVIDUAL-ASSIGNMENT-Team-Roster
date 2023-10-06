/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  getAppointmentNoteByNoteId,
  updateNote,
} from '../../utils/databaseCalls/noteData';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import UnsignedNotesContext from '../../utils/context/unsignedNotesContext';
import TherapistContext from '../../utils/context/therapistContext';

export default function DAPForm({ noteObj }) {
  const { therapist } = useContext(TherapistContext);
  const [note, setNote] = useState(noteObj);
  const [saved, setSaved] = useState(false);
  const [formInput, setFormInput] = useState({});
  const [client, setClient] = useState();
  const { onSignedUpdate } = useContext(UnsignedNotesContext);

  useEffect(() => {
    setFormInput({
      D: noteObj.content?.D,
      A: noteObj.content?.A,
      P: noteObj.content?.P,
    });
  }, [noteObj]);

  useEffect(() => {
    getAppointmentNoteByNoteId(noteObj.noteId).then(setNote);
  }, [noteObj]);

  useEffect(() => {
    getClientByClientId(noteObj.clientId).then(setClient);
  }, [noteObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...noteObj,
      content: { ...formInput },
    };
    await updateNote(payload);
    const updatedNote = await getAppointmentNoteByNoteId(noteObj.noteId);
    setNote(updatedNote);
    setSaved(true);
    alert('Note saved!');
  };

  const handleEdit = () => {
    setSaved(false);
  };

  const handleSign = async () => {
    const payload = {
      ...noteObj,
      content: { ...formInput },
      signedByTherapist: true,
      sharedWithSupervisor: true,
    };
    await updateNote(payload);
    alert('Note signed and shared!');
    const updatedNote = await getAppointmentNoteByNoteId(noteObj.noteId);
    setNote(updatedNote);
    await onSignedUpdate();
  };

  const handleSupervisorSign = async () => {
    const payload = {
      ...noteObj,
      signedBySupervisor: true,
    };
    await updateNote(payload);
    alert('Note approved and signed!');
    const updatedNote = await getAppointmentNoteByNoteId(noteObj.noteId);
    setNote(updatedNote);
    await onSignedUpdate();
  };

  return (
    <>
      <div className="note-header">
        {client && (
          <Link passHref href={`/client/${noteObj.clientId}`}>
            <a className="client-name name-head">
              {client.firstName} {client.lastName}
            </a>
          </Link>
        )}
        <h2 className="progress-note">Progress Note</h2>
      </div>
      <div className="main-note">
        <form className="DAP-form">
          <div className="DAP-container">
            <label className="DAP-label">
              Data:
              <textarea
                onChange={handleChange}
                className="DAP-text"
                type="textarea"
                name="D"
                value={formInput.D}
                disabled={noteObj?.signedByTherapist || saved}
                required
              />
            </label>
            <label className="DAP-label">
              Assessment and Response:
              <textarea
                onChange={handleChange}
                className="DAP-text"
                type="textarea"
                name="A"
                value={formInput.A}
                disabled={noteObj?.signedByTherapist || saved}
                required
              />
            </label>
            <label className="DAP-label">
              Plan:
              <textarea
                onChange={handleChange}
                className="DAP-text"
                type="textarea"
                name="P"
                value={formInput.P}
                disabled={noteObj?.signedByTherapist || saved}
                required
              />
            </label>
            {!note?.sharedWithSupervisor ? (
              <div className="DAP-form-btns">
                {!saved ? (
                  <button
                    type="button"
                    className="done-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="done-btn"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
                {saved ? (
                  <button
                    type="button"
                    onClick={handleSign}
                    className="done-btn sign-n-share"
                  >
                    Sign & Share
                  </button>
                ) : (
                  ''
                )}
              </div>
            ) : (
              <>
                <div>
                  {!note.signedBySupervisor &&
                  therapist.supervisor &&
                  note.supervisorId === therapist.therapistId ? (
                    <div className="sign-supervisor-wrapper">
                      <button
                        type="button"
                        className="done-btn"
                        onClick={handleSupervisorSign}
                      >
                        Approve and Sign
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <>
                  {note.signedBySupervisor && therapist.supervisor ? (
                    <p className="signed-n-shared">Approved and Signed</p>
                  ) : (
                    ''
                  )}
                </>
                <>
                  {note.signedBySupervisor && therapist.admin ? (
                    <p className="signed-n-shared">Approved and Signed</p>
                  ) : (
                    ''
                  )}
                </>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

DAPForm.propTypes = {
  noteObj: PropTypes.shape({
    noteId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    appointmentId: PropTypes.string,
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    supervisorId: PropTypes.string,
    signedByTherapist: PropTypes.bool,
    signedBySupervisor: PropTypes.bool,
    content: PropTypes.shape({
      D: PropTypes.string,
      A: PropTypes.string,
      P: PropTypes.string,
      chartNote: PropTypes.string,
    }),
    dateTime: PropTypes.string,
  }).isRequired,
};
