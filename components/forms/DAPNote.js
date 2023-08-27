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
  const [formInput, setFormInput] = useState({
    D: noteObj.content?.D,
    A: noteObj.content?.A,
    P: noteObj.content?.P,
  });
  const [client, setClient] = useState();

  useEffect(() => {
    getClientByClientId(noteObj.clientId).then(setClient);
  }, [noteObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...noteObj,
      content: { ...formInput },
    };
    updateNote(payload);
  };

  const handleSign = async () => {
    const payload = {
      ...noteObj,
      content: { ...formInput },
      signedByTherapist: true,
      sharedWithSupervisor: true,
    };
    await updateNote(payload);
    getAppointmentNoteByNoteId(noteObj.noteId).then(setNote);
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
        <form className="DAP-form" onSubmit={handleSubmit}>
          <div className="DAP-container">
            <label className="DAP-label">
              Data:
              <textarea
                onChange={handleChange}
                className="DAP-text"
                type="textarea"
                name="D"
                value={formInput.D}
                disabled={noteObj.signedByTherapist}
                placeholder={noteObj.content?.D}
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
                disabled={noteObj.signedByTherapist}
                placeholder={noteObj.content?.A}
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
                disabled={noteObj.signedByTherapist}
                placeholder={noteObj.content?.P}
                required
              />
            </label>
            {!noteObj.sharedWithSupervisor ? (
              <div className="DAP-form-btns">
                <button type="submit" className="done-btn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleSign}
                  className="done-btn sign-n-share"
                >
                  Sign & Share
                </button>
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