/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  getAppointmentNoteByNoteId,
  updateNote,
} from '../../utils/databaseCalls/noteData';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';

export default function DAPForm({ noteObj }) {
  const router = useRouter();
  const [note, setNote] = useState(noteObj);
  const [saved, setSaved] = useState(false);
  const [formInput, setFormInput] = useState({});
  const [client, setClient] = useState();

  useEffect(() => {
    setFormInput({
      D: noteObj.content?.D,
      A: noteObj.content?.A,
      P: noteObj.content?.P,
    });
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

  const handleSign = async () => {
    const payload = {
      ...noteObj,
      content: { ...formInput },
      signedByTherapist: true,
      sharedWithSupervisor: true,
    };
    await updateNote(payload);
    const updatedNote = await getAppointmentNoteByNoteId(noteObj.noteId);
    setNote(updatedNote);
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
        <h2>Progress Note</h2>
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
                disabled={noteObj.signedByTherapist || saved}
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
                disabled={noteObj.signedByTherapist || saved}
                required
              />
            </label>
            <label className="DAP-label">
              Plan
              <textarea
                onChange={handleChange}
                className="DAP-text"
                type="textarea"
                name="P"
                value={formInput.P}
                disabled={noteObj.signedByTherapist || saved}
                required
              />
            </label>
            {!noteObj.sharedWithSupervisor ? (
              <div className="DAP-form-btns">
                <button type="button" className="done-btn" onClick={handleSave}>
                  {!saved ? 'Save' : 'Edit'}
                </button>
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
              <p className="signed-n-shared">Signed and Shared</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
