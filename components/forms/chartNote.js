import { useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createNote } from '../../utils/databaseCalls/noteData';
import TherapistContext from '../../utils/context/therapistContext';

export default function ChartNoteForm({ clientObj, onChartNoteSubmit }) {
  const [formInput, setFormInput] = useState({ noteText: '' });
  const [dateInput, setDateInput] = useState(Date.now());
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
      content: { chartNote: formInput.noteText },
      dateTime: Date.parse(dateInput),
    };
    await createNote(payload);
    onChartNoteSubmit();
  };

  return (
    <>
      <div className="chart-note-form">
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="textarea"
            className="chart-note-textarea"
            name="noteText"
            placeholder="Add Chart Note: include notes from a call with a client or copy & paste the contents of a document or email."
          />
          <div className="chartnote-date-btn">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                className="datetime-chart"
                name="dateTime"
                views={['year', 'month', 'day', 'hours', 'minutes']}
                value={dateInput}
                onChange={(newValue) => setDateInput(newValue)}
              />
            </LocalizationProvider>
            <button type="submit" className="add-note-btn">
              + Add Note
            </button>
          </div>
        </form>
      </div>
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
  onChartNoteSubmit: PropTypes.func.isRequired,
};
