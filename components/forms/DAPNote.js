import { useState } from 'react';

const initialState = {
  noteId: '',
  clientId: '',
  therapistId: '',
  title: '',
  type: '',
  content: { D: '', A: '', P: '' },
  dateTime: 0,
};

export default function DAPForm() {
  const [ setFormInput] = useState(initialState);

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
