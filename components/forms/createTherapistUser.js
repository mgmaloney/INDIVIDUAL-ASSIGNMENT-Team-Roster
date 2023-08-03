import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../utils/context/authContext';

export default function CreateTherapistUser() {
  const { user } = useAuth();
  //   const [supervisors, setSuperVisors] = useState([]);

  //   useEffect(() => {
  //     getAllSuperVisors().then(setSuperVisors);
  //   }, []);

  const [formData, setFormData] = useState({
    therapist_id: user.uid,
    firstName: '',
    lastName: '',
    email: user.email,
    supervisor_id: '',
    clients: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* FIRST NAME FIELD */}
      <Form.Group className="mb-3" controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <Form.Text className="text-muted" />
      </Form.Group>

      {/* LAST NAME FIELD */}
      <Form.Group className="mb-3" controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
        <Form.Text className="text-muted" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="supervisor_id">
        <Form.Label>Supervisor</Form.Label>
        <Form.Select
          aria-label="Supervisor"
          name="supervisor_id"
          onChange={handleChange}
          value={formData.supervisor_id} // FIXME: modify code to remove error
          required
        >
          {/* <option value="">Select a Supervisor</option>
          {supervisors.map((supervisor) => (
            <option
              key={supervisor.supervisor_id}
              value={supervisor.supervisor_id}
            >
              {`${supervisor.firstName} ${supervisor.lastName}`}
            </option>
          ))} */}
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

CreateTherapistUser.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    fbUser: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }),
  }).isRequired,
  //   updateUser: PropTypes.func.isRequired,
};
