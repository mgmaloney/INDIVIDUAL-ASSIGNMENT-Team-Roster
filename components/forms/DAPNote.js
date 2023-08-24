import { useState } from 'react';

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
    console.warn(payload, 'payload');
  };

  return (
    <>
      <form className="DAP-form" onSubmit={handleSubmit}>
        <textarea
          onChange={handleChange}
          className="DAP-text"
          type="textarea"
          name="D"
          value={formInput.D}
        />
        <textarea
          onChange={handleChange}
          className="DAP-text"
          type="textarea"
          name="A"
          value={formInput.A}
        />
        <textarea
          onChange={handleChange}
          className="DAP-text"
          type="textarea"
          name="P"
          value={formInput.P}
        />
      </form>
    </>
  );
}
