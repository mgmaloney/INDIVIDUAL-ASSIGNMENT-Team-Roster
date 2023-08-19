/* eslint-disable import/no-extraneous-dependencies */
import { styled, Box } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Autocomplete, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addMinutes } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import TherapistClientsContext from '../utils/context/therapistClientsContext';

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

export default function AddAppointment({
  openModal,
  setOpenModal,
  selectedCalDate,
}) {
  const { therapistClients } = useContext(TherapistClientsContext);
  const [startDate, setStartDate] = useState();
  const [setEndDate] = useState();
  const [aptRadio, setAptRadio] = useState('client');
  const [selectedClientObj, setSelectedClientObj] = useState({});
  const [setSelectedClientId] = useState();
  const [setAptName] = useState('');
  const [length, setLength] = useState();
  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    setStartDate(selectedCalDate);
  }, [selectedCalDate]);

  useEffect(() => {
    setEndDate(addMinutes(startDate, length));
  }, [startDate, length]);

  useEffect(() => {
    const { lastName } = selectedClientObj;
    const lastNameLetter = lastName?.charAt();
    const aptNam = `${selectedClientObj.firstName} ${lastNameLetter}.`;
    setAptName(aptNam);
  }, [selectedClientObj]);

  // const handleSubmit = () => {
  //   const payload = {};
  // };

  return (
    <>
      <StyledModal
        open={openModal}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <>
          <Box sx={style}>
            <h2 id="unstyled-modal-title">New Appointment</h2>
            <form className="add-appointment-modal">
              <label>
                Client Appointment
                <input
                  type="radio"
                  className="apt-radio"
                  id="apt-type-client"
                  name="apt-type-radio"
                  value="client"
                  onChange={(e) => setAptRadio(e.target.value)}
                  defaultChecked
                />
              </label>
              <label>
                Other
                <input
                  type="radio"
                  className="apt-radio"
                  id="apt-type-other"
                  name="apt-type-radio"
                  value="other"
                  onChange={(e) => setAptRadio(e.target.value)}
                />
              </label>
              {aptRadio === 'client' ? (
                <Autocomplete
                  id="client-autocomplete"
                  options={therapistClients}
                  // sx={{ width: 50 }}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Add Client" size="small" />
                  )}
                  onChange={(event, newValue) => {
                    setSelectedClientObj(newValue);
                    setSelectedClientId(newValue.clientId);
                  }}
                />
              ) : (
                <input type="text" placeholder="Add title" />
              )}
              <>
                <div className="datepick-and-mins">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                  <label>
                    <input
                      type="text"
                      value={length}
                      onChange={(newValue) => setLength(newValue)}
                    />
                    min
                  </label>
                </div>
              </>
              <button
                className="cancel-btn"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button className="dont-btn" type="submit">
                Done
              </button>
            </form>
          </Box>
        </>
      </StyledModal>
    </>
  );
}

AddAppointment.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  selectedCalDate: PropTypes.string.isRequired,
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
