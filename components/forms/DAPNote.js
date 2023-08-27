import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { updateNote } from '../../utils/databaseCalls/noteData';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';

const initialState = {
  D: '',
  A: '',
  P: '',
};

export default function DAPForm({ noteObj }) {
  const router = useRouter();
  const [formInput, setFormInput] = useState(initialState);
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
    updateNote(payload);
  };

  const handleDisable = (noteObj) => {
    if (noteObj.signedByTherapist) {
      return 'disabled';
    }
  };

  return (
    <>
      <div className="main-note">
        <h1>Progress Note</h1>
        {client && (
          <Link passHref href={`/client/${noteObj.clientId}`}>
            <a>
              {client.firstName} {client.lastName}
            </a>
          </Link>
        )}
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
