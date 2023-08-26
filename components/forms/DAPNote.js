import { useState } from 'react';
import { updateNote } from '../../utils/databaseCalls/noteData';

const initialState = {
  D: '',
  A: '',
  P: '',
};

export default function DAPForm({ noteObj }) {
  const [formInput, setFormInput] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    const payload = {
      ...noteObj,
      content: { ...formInput },
    };
    updateNote(noteObj.noteId);
  };

  const handleSign = async () => {
    const payload = {
      ...noteObj,
      content: { ...formInput },
      [signedByTherapist]: true,
      [sharedWithSupervisor]: true,
    };
    updateNote(noteObj.noteId);
  };

  return (
    <>
      <h1>Progress Note</h1>
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
              required
            />
          </label>
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
      </form>
    </>
  );
}
