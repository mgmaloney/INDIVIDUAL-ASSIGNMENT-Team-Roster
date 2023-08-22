import { useEffect } from 'react';
import { getAppointmentsByClientId } from '../../utils/databaseCalls/calendarData';
import { useRouter } from 'next/router';

const initialState = {
  noteId: '',
  clientId: '',
  therapistId: '',
  title: '',
  type: '',
  content: { D: '', A: '', P: '' },
  dateTime: 0,
};

export default function DAPForm({ noteObj, clientObj }) {
  const [formInput, setFormInput] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <form className="DAP-form">
        <textarea
          onChange={handleChange}
          className="DAP-text"
          type="textarea"
          name="D"
        />
        <textarea
          onChange={handleChange}
          className="DAP-text"
          type="textarea"
          name="A"
        />
        <textarea
          onChange={handleChange}
          className="DAP-text"
          type="textarea"
          name="P"
        />
      </form>
    </>
  );
}
