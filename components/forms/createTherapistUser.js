import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getAllSupervisors } from '../../utils/databaseCalls/supervisorData';
import { createTherapist } from '../../utils/databaseCalls/therapistData';
import { useAuth } from '../../utils/context/authContext';

export default function CreateTherapistUser() {
  const [supervisors, setSuperVisors] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getAllSupervisors().then(setSuperVisors);
  }, []);

  const [formData, setFormData] = useState({
    therapistId: '',
    firstName: '',
    lastName: '',
    email: '',
    supervisorId: '',
    clients: [],
    uid: user.uid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTherapist(formData);
    router.reload();
  };

  return (
    <>
      <h2 className="page-header">Create Therapist Account</h2>
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

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email: </Form.Label>
          <Form.Control
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="supervisorId">
          <Form.Label>Supervisor</Form.Label>
          <Form.Select
            aria-label="Supervisor"
            name="supervisorId"
            onChange={handleChange}
            value={formData.supervisorId} // FIXME: modify code to remove error
            required
          >
            <option value="">Select a Supervisor</option>
            {supervisors.map((supervisor) => (
              <option
                key={supervisor.supervisorId}
                value={supervisor.supervisorId}
              >
                {`${supervisor.firstName} ${supervisor.lastName}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
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
