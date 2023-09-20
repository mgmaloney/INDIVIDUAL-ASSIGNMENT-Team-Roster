import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  createPyschotherapyNote,
  updatePsychotherapyNote,
} from '../../utils/databaseCalls/noteData';
import TherapistContext from '../../utils/context/therapistContext';

export default function PsychotherapyNoteForm({
  appointmentId,
  clientId,
  psychNoteObj,
}) {
  const { therapist } = useContext(TherapistContext);

  const initialState = {
    therapistId: '',
    clientId,
    appointmentId,
    noteContent: '',
  };

  const [formInput, setFormInput] = useState({
    ...initialState,
    therapistId: therapist?.therapistId,
  });
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    if (psychNoteObj.firebaseKey) {
      setFormInput({ ...formInput, noteContent: psychNoteObj.noteContent });
    }
  }, [psychNoteObj.firebaseKey]);

  const handleEditing = () => {
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (psychNoteObj.firebaseKey) {
      await updatePsychotherapyNote({
        firebaseKey: psychNoteObj.firebaseKey,
        ...formInput,
      });
    } else {
      await createPyschotherapyNote({
        ...formInput,
        clientId,
        appointmentId,
        therapistId: therapist.therapistId,
      });
    }
  };

  return (
    <>
      <div>
        <form className="psychnote" onSubmit={handleSubmit}>
          <label className="psychnote-label">
            Psychotherapy Note:
            <textarea
              name="noteContent"
              onChange={handleChange}
              className="psychnote psychnote-text"
              disabled={!editing}
              value={formInput.noteContent}
            />
          </label>
          {editing ? (
            <button onClick={handleEditing} className="done-btn" type="button">
              Save
            </button>
          ) : (
            <button onClick={handleEditing} className="done-btn" type="submit">
              Edit
            </button>
          )}
        </form>
      </div>
    </>
  );
}

PsychotherapyNoteForm.propTypes = {
  appointmentId: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  psychNoteObj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    clientId: PropTypes.string,
    appointmentId: PropTypes.string,
    therapistId: PropTypes.string,
    noteContent: PropTypes.string,
  }),
};

PsychotherapyNoteForm.defaultProps = {
  psychNoteObj: PropTypes.shape({}),
};
