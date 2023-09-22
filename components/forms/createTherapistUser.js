/* eslint-disable import/no-extraneous-dependencies */
import { Box, styled } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllSupervisors } from '../../utils/databaseCalls/supervisorData';
import {
  createTherapist,
  updateTherapist,
} from '../../utils/databaseCalls/therapistData';
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
  padding: '0px 20px 24px 20px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  color: '#267ccb',
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
    practice: therapist?.practiceId,
    supervisor: false,
    admin: false,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    getAllSupervisors().then(setSuperVisors);
  }, []);

  useEffect(() => {
    if (editingTherapist?.therapistId) {
      setFormData(editingTherapist);
    }
    if (editingTherapist.supervisor) {
      setIsSupervisor(true);
    }
  }, [editingTherapist]);

  const handleClose = () => {
    setOpenTherapistModal(false);
    setFormData(initialState);
    setEditingTherapist({});
    setIsSupervisor(false);
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
    if (!editingTherapist.therapistId) {
      await createTherapist({
        ...formData,
        supervisor: isSupervisor,
        active: true,
      });
    } else {
      await updateTherapist({ ...formData, supervisor: isSupervisor });
    }
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
          <form className="form-modal" onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                className="form-text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                className="form-text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                className="form-text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Is this {editingTherapist ? '' : 'new'} therapist a supervisor?
              <input
                className="form-text modal-check"
                type="checkbox"
                aria-label="Supervisor?"
                name="isSupervisor"
                onChange={handleSupervisor}
                value={isSupervisor}
                checked={isSupervisor}
              />
            </label>
            {!isSupervisor ? (
              <label>
                Choose Supervisor:
                <select
                  className="form-text"
                  aria-label="Supervisor"
                  name="supervisorId"
                  onChange={handleChange}
                  value={formData.supervisorId}
                  required
                >
                  <option value="">Select a Supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option
                      key={supervisor.therapistId}
                      value={supervisor.therapistId}
                    >
                      {`${supervisor.firstName} ${supervisor.lastName}`}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              ''
            )}
            <button className="done-btn" type="submit">
              Submit
            </button>
          </form>
        </Box>
      </StyledModal>
    </>
  );
}

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
