/* eslint-disable import/no-extraneous-dependencies */
import { styled, Box } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { addMinutes } from 'date-fns';
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
  // const [endDate, setEndDate] = useState();
  // const [formInput, setFormInput] = useState();
  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    setStartDate(selectedCalDate);
  }, [selectedCalDate]);

  // useEffect(() => {
  //   setEndDate(addMinutes(startDate), )
  // }, [startDate])

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
                />
              </label>
              <select id="client-select" value="">
                {therapistClients.map((client) => (
                  <option
                    key={client.clientId}
                    id={client.clientId}
                    value={client.clientId}
                  >
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
              </LocalizationProvider>
              <label>
                <input type="text" value="50" />
              </label>
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
