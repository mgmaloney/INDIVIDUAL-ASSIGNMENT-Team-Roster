/* eslint-disable import/no-extraneous-dependencies */
import { styled, Box } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import React, { useState } from 'react';
import statesAndAbbrevs from '../../utils/statesAndAbbrevs';

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

const initialState = {};

export default function AddClient({
  openClientModal,
  setOpenClientModal,
  clientObj,
}) {
  const [formInput, setFormInput] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => setFormInput({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {};

  const handleClose = () => {
    setOpenClientModal(false);
  };

  return (
    <>
      <StyledModal
        open={openClientModal}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Box sx={style}>
          <h2 id="unstyled-modal-title">New Client</h2>
          <form
            className="client-form"
            onChange={handleChange}
            onSubmit={handleSubmit}
          >
            <label>
              First Name
              <input type="text" name="firstName" />
            </label>
            <label>
              Last Name
              <input type="text" name="lastName" />
            </label>
            <label>
              Phone Number
              <input type="tel" name="phone" />
            </label>
            <label>
              Email
              <input type="email" name="email" />
            </label>
            <label>
              Address Line 1
              <input type="text" name="address1" className="addressLine" />
            </label>
            <label>
              Address Line 2
              <input type="text" name="address2" className="addressLine" />
            </label>
            <label>
              State
              <select name="state" className="stateSelect">
                {statesAndAbbrevs.map((state) => (
                  <option value={state.abbreviation}>{state.name}</option>
                ))}
              </select>
            </label>
            <label>
              Zipcode
              <input name="zipcode" type="text" pattern="[0-9]*" />
            </label>
            <label>
              Birthdate
              <input type="date" name="birthdate" />
            </label>
            <label>
              Sex
              <select>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <label>
              Gender
              <select name="gender">
                <option value="she/her">she/her</option>
                <option value="he/him">he/him</option>
                <option value="they/them">they/them</option>
                <option value="other">Other</option>
                <option value="Prefer not to answer">
                  Perfer not to Answer
                </option>
              </select>
            </label>
            <button className="done-btn" type="submit">
              Done
            </button>
          </form>
        </Box>
      </StyledModal>
    </>
  );
}

AddClient.propTypes = {
  openClientModal: PropTypes.bool.isRequired,
  setOpenClientModal: PropTypes.func.isRequired,
};

AddClient.defaultProps = {};

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
