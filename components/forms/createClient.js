/* eslint-disable react-hooks/exhaustive-deps */
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
  width: 800,
  borderRadius: '12px',
  padding: '0px 20px 24px 20px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  color: '#267ccb',
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
          <form className="form-modal" onSubmit={handleSubmit}>
            <div className="modal-wrapper">
              <div className="modal-collection">
                <label className="add-client-label">
                  First Name:{'    '}
                  <input
                    className="form-text"
                    type="text"
                    name="firstName"
                    value={formInput?.firstName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="add-client-label">
                  Last Name:{'    '}
                  <input
                    className="form-text"
                    type="text"
                    name="lastName"
                    value={formInput?.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="modal-collection">
                <label className="add-client-label">
                  Phone Number:{'    '}
                  <input
                    className="form-text"
                    type="tel"
                    name="phone"
                    value={formInput?.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="add-client-label">
                  Email:{'    '}
                  <input
                    type="email"
                    name="email"
                    className="form-text"
                    value={formInput?.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="modal-collection">
                <label className="add-client-label">
                  Address Line 1:{'    '}
                  <input
                    type="text"
                    name="address1"
                    className="addressLine form-text"
                    value={formInput?.address1}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="add-client-label">
                  Address Line 2:{'    '}
                  <input
                    type="text"
                    name="address2"
                    className="addressLine form-text"
                    value={formInput?.address2}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="modal-collection">
                <label className="add-client-label">
                  City:{'    '}
                  <input
                    type="text"
                    name="city"
                    className="addressLine form-text"
                    value={formInput?.city}
                    onChange={handleChange}
                  />
                </label>
                <label className="add-client-label">
                  State:{'    '}
                  <select
                    name="state"
                    className="stateSelect form-text"
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
              </div>
              <div className="modal-collection">
                <label className="add-client-label">
                  Zipcode:{'    '}
                  <input
                    className="form-text"
                    name="zipcode"
                    type="text"
                    pattern="[0-9]*"
                    value={formInput?.zipcode}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="add-client-label">
                  Birthdate:{'    '}
                  <input
                    type="date"
                    name="birthDate"
                    className="form-text birthdate"
                    value={formInput?.birthDate}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="modal-collection">
                <label className="add-client-label">
                  Sex:{'    '}
                  <select
                    className="form-text"
                    name="sex"
                    onChange={handleChange}
                    required
                  >
                    <option disabled selected={!formInput?.sex}>
                      Select an option
                    </option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </label>
                <label className="add-client-label">
                  Gender:{'    '}
                  <select
                    className="form-text"
                    name="gender"
                    onChange={handleChange}
                    required
                  >
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
              </div>
              <div className="select-therapist">
                {therapist.admin ? (
                  <label className="add-client-label">
                    Assign Therapist:
                    <select
                      id="therapist-select-add-client"
                      className="form-text"
                      name="therapistId"
                      onChange={handleChange}
                    >
                      {therapists &&
                        therapists.map((therapistOption) => (
                          <option
                            value={therapistOption.therapistId}
                            key={therapistOption.therapistId}
                          >
                            {therapistOption.firstName}{' '}
                            {therapistOption.lastName}
                          </option>
                        ))}
                    </select>
                  </label>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="submit">
              <button className="done-btn submit" type="submit">
                Submit
              </button>{' '}
            </div>{' '}
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
