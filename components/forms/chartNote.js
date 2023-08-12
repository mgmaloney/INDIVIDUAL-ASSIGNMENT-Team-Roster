import { useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { createNote } from '../../utils/databaseCalls/noteData';
import TherapistContext from '../../utils/context/therapistContext';

export default function ChartNoteForm({ clientObj }) {
  const [formInput, setFormInput] = useState({ noteText: '' });
  const { therapist } = useContext(TherapistContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: 'Chart Note',
      type: 'chart',
      clientId: clientObj.clientId,
      therapistId: therapist.therapistId,
      content: formInput.noteText,
    };
    await createNote(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="textbox"
          className="chart-note-form"
          name="noteText"
          placeholder="Add Chart Note: include notes from a call with a client or copy & paste the contents of a document or email."
        />
        <button type="submit" className="add-note-btn">
          + Add Note
        </button>
      </form>
    </>
  );
}

ChartNoteForm.propTypes = {
  clientObj: PropTypes.shape({
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    sex: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
};
