import { useState, useContext, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toDate } from 'date-fns';
import { createNote } from '../../utils/databaseCalls/noteData';
import TherapistContext from '../../utils/context/therapistContext';

const initialState = {
  noteId: '',
  clientId: '',
  therapistId: '',
  title: '',
  type: '',
  content: { chartNote: '' },
  dateTime: 0,
};

export default function ChartNoteForm({ noteObj, clientObj, onNotesUpdate }) {
  const initialDate = toDate(Date.now());
  const [formInput, setFormInput] = useState({ noteText: '' });
  const [dateInput, setDateInput] = useState(initialDate);

  const { therapist } = useContext(TherapistContext);

  useEffect(() => {
    if (noteObj?.noteId) {
      setFormInput({ noteText: noteObj.content.chartNote });
    }
  }, [noteObj]);

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
      dateTime: dateInput,
    };
    await createNote(payload);
    onNotesUpdate(clientObj.clientId);
    setFormInput({ noteText: '' });
    setDateInput(initialDate);
  };

  return (
    <>
      <div className="chart-note-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={formInput.noteText}
            onChange={handleChange}
            type="textarea"
            className="chart-note-textarea "
            name="noteText"
            placeholder="Add Chart Note: include notes from a call with a client or copy & paste the contents of a document or email."
            required
          />
          <div className="chartnote-date-btn">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                className="datetime-chart"
                name="dateTime"
                views={['year', 'month', 'day', 'hours', 'minutes']}
                value={dateInput}
                onChange={(newValue) => setDateInput(newValue)}
                required
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
  noteObj: PropTypes.shape({
    noteId: PropTypes.string,
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      chartNote: PropTypes.string,
    }),
    dateTime: PropTypes.number,
  }),
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
  onNotesUpdate: PropTypes.func.isRequired,
};

ChartNoteForm.defaultProps = {
  noteObj: initialState,
};
