/* eslint-disable import/no-extraneous-dependencies */
import { Box, styled } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getAllSupervisors } from '../../utils/databaseCalls/supervisorData';
import { createTherapist } from '../../utils/databaseCalls/therapistData';
import TherapistContext from '../../utils/context/therapistContext';
import OpenTherapistModalContext from '../../utils/context/openTherapistModalContext';

const Backdrop = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  return <div className={clsx({}, className)} ref={ref} {...other} />;
});

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme) => ({
  width: 400,
  borderRadius: '12px',
  padding: '16px 32px 24px 32px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  boxShadow: `0px 2px 24px ${
    theme.palette.mode === 'dark' ? '#000' : '#383838'
  }`,
});

export default function CreateTherapistUser() {
  const router = useRouter();
  const { therapist } = useContext(TherapistContext);
  const {
    openTherapistModal,
    setOpenTherapistModal,
    editingTherapist,
    setEditingTherapist,
  } = useContext(OpenTherapistModalContext);
  const [supervisors, setSuperVisors] = useState([]);
  const [isSupervisor, setIsSupervisor] = useState(false);

  const initialState = {
    therapistId: '',
    firstName: '',
    lastName: '',
    email: '',
    supervisorId: '',
    practice: therapist.practiceId,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    getAllSupervisors().then(setSuperVisors);
  }, []);

  useEffect(() => {
    if (editingTherapist?.therapistId) {
      setFormData({});
    }
  }, [editingTherapist]);

  const handleClose = () => {
    setOpenTherapistModal(false);
    setFormData(initialState);
    setEditingTherapist({});
  };

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

  const handleSupervisor = () => {
    if (isSupervisor) {
      setIsSupervisor(false);
    } else {
      setIsSupervisor(true);
    }
  };

  return (
    <>
      <StyledModal
        open={openTherapistModal}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Box sx={style}>
          <h2 className="page-header">Create New Therapist Account</h2>
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
              <Form.Label>Is this new therapist a supervisor?</Form.Label>
              <Form.Check
                aria-label="Supervisor?"
                name="isSupervisor"
                type="switch"
                onChange={handleSupervisor}
                value={isSupervisor} // FIXME: modify code to remove error
                required
              />
            </Form.Group>
            {!isSupervisor ? (
              <Form.Group className="mb-3" controlId="supervisorId">
                <Form.Label>Choose Supervisor</Form.Label>
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
            ) : (
              ''
            )}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Box>
      </StyledModal>
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

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
