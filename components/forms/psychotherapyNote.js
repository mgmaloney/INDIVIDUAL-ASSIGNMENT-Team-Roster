import { useContext, useState } from 'react';
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
  const [formInput, setFormInput] = useState({});
  const [editing, setEditing] = useState(true);

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

  const handleSubmit = async () => {
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
      <div className="psychnote">
        <form onSubmit={handleSubmit}>
          <label className="psychnote-label">
            Psychotherapy Note:
            <textarea
              name="noteContent"
              onChange={handleChange}
              className="psychnote"
              disabled={!editing}
            />
          </label>
          {editing ? (
            <button onClick={handleEditing} className="done-btn" type="submit">
              Save
            </button>
          ) : (
            <button onClick={handleEditing} className="done-btn" type="button">
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
  psychNoteObj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    clientId: PropTypes.string,
    appointmentId: PropTypes.string,
    therapistId: PropTypes.string,
    noteContent: PropTypes.string,
  }),
};
