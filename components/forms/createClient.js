/* eslint-disable import/no-extraneous-dependencies */
import { styled, Box } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import statesAndAbbrevs from '../../utils/statesAndAbbrevs';
import TherapistContext from '../../utils/context/therapistContext';
import {
  createClient,
  getClientsByTherapistId,
  updateClient,
} from '../../utils/databaseCalls/clientData';
import TherapistClientsContext from '../../utils/context/therapistClientsContext';
import OpenClientModalContext from '../../utils/context/openClientModalContext';
import { getAllTherapists } from '../../utils/databaseCalls/therapistData';

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

const initialState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipcode: '',
  birthDate: '',
  therapistId: '',
  sex: '',
  gender: '',
};
export default function AddClient() {
  const router = useRouter();

  const { therapist } = useContext(TherapistContext);

  const { setTherapistClients } = useContext(TherapistClientsContext);
  const {
    openClientModal,
    setOpenClientModal,
    editingClient,
    setEditingClient,
  } = useContext(OpenClientModalContext);
  const [therapists, setTherapists] = useState([]);

  const [formInput, setFormInput] = useState({
    ...initialState,
  });

  useEffect(() => {
    setFormInput({ ...formInput, therapistId: therapist.therapistId });
  }, [therapist.therapistId]);

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  useEffect(() => {
    if (editingClient.clientId) {
      const birthdayFormatted = format(
        new Date(editingClient.birthDate),
        'yyyy-MM-dd',
      );
      setFormInput({ ...editingClient, birthDate: birthdayFormatted });
    }
  }, [editingClient]);

  const onClientsUpdate = () => {
    getClientsByTherapistId(therapist.therapistId).then(setTherapistClients);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => setFormInput({ ...prevState, [name]: value }));
  };

  const handleClose = () => {
    setOpenClientModal(false);
    setFormInput(initialState);
    setEditingClient({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formInput,
      active: true,
    };
    if (formInput.clientId) {
      updateClient(payload);
    } else {
      await createClient(payload);
    }
    handleClose();
    onClientsUpdate();
    router.reload();
  };

  return (
    <>
      <StyledModal
        open={openClientModal}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Box sx={style}>
          <h2 id="unstyled-modal-title" className="modal-title">
            Add New Client
          </h2>
          <form className="client-form" onSubmit={handleSubmit}>
            <label>
              First Name
              <input
                className="add-client-text"
                type="text"
                name="firstName"
                value={formInput?.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last Name
              <input
                className="add-client-text"
                type="text"
                name="lastName"
                value={formInput?.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone Number
              <input
                className="add-client-text"
                type="tel"
                name="phone"
                value={formInput?.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formInput?.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Address Line 1
              <input
                type="text"
                name="address1"
                className="addressLine"
                value={formInput?.address1}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Address Line 2
              <input
                type="text"
                name="address2"
                className="addressLine"
                value={formInput?.address2}
                onChange={handleChange}
              />
            </label>
            <label>
              City
              <input
                type="text"
                name="city"
                className="addressLine"
                value={formInput?.city}
                onChange={handleChange}
              />
            </label>
            <label>
              State
              <select
                name="state"
                className="stateSelect"
                value={formInput?.state}
                onChange={handleChange}
                required
              >
                <option selected disabled value="">
                  Select an option
                </option>
                {statesAndAbbrevs.map((state) => (
                  <option key={state.name + 1} value={state.abbreviation}>
                    {state.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Zipcode
              <input
                className="add-client-text"
                name="zipcode"
                type="text"
                pattern="[0-9]*"
                value={formInput?.zipcode}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Birthdate
              <input
                type="date"
                name="birthDate"
                value={formInput?.birthDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Sex
              <select name="sex" onChange={handleChange} required>
                <option disabled selected={!formInput?.sex}>
                  Select an option
                </option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <label>
              Gender
              <select name="gender" onChange={handleChange} required>
                <option disabled selected={!formInput?.gender}>
                  Select an option
                </option>
                <option value="she/her">she/her</option>
                <option value="he/him">he/him</option>
                <option value="they/them">they/them</option>
                <option value="other">Other</option>
                <option value="prefer not to answer">
                  Prefer not to Answer
                </option>
              </select>
            </label>
            <div className="select-therapist">
              {therapist.admin ? (
                <label>
                  Assign Therapist:
                  <select
                    id="therapist-select-add-client"
                    name="therapistId"
                    onChange={handleChange}
                  >
                    {therapists &&
                      therapists.map((therapistOption) => (
                        <option
                          value={therapistOption.therapistId}
                          key={therapistOption.therapistId}
                        >
                          {therapistOption.firstName} {therapistOption.lastName}
                        </option>
                      ))}
                  </select>
                </label>
              ) : (
                ''
              )}
            </div>
            <button className="done-btn" type="submit">
              Submit
            </button>
          </form>
        </Box>
      </StyledModal>
    </>
  );
}

AddClient.propTypes = {
  clientObj: PropTypes.shape({
    clientId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipcode: PropTypes.string,
    birthDate: PropTypes.string,
    therapistId: PropTypes.string,
    sex: PropTypes.string,
    gender: PropTypes.string,
  }),
};

AddClient.defaultProps = {
  clientObj: { ...initialState, clientId: '', therapistId: '' },
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
