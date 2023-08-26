/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import AddClient from '../components/forms/createClient';
import { getAppointmentsByTherapistId } from '../utils/databaseCalls/calendarData';
import TherapistContext from '../utils/context/therapistContext';

function Home({ openClientModal, setOpenClientModal }) {
  const { therapist } = useContext(TherapistContext);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState({});

  useEffect(() => {
    getAppointmentsByTherapistId(therapist.therapistId).then(setAppointments);
  }, [therapist]);

  const onAptUpdate = () => {
    getAppointmentsByTherapistId(therapist.therapistId).then(setAppointments);
  };

  // const { isNewUser } = useContext(IsNewUserContext);

  // part of the newUser check, which will be implemented later
  // useEffect(() => {
  //   if (!isNewUser) {
  //     // getTherapistByUid(user.uid).then(setTherapist);
  //   }
  // }, []);
  //
  // if (isNewUser) {
  //   return (
  //     <>
  //       <CreateTherapistUser />
  //     </>
  //   );
  // }
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AddAppointment
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedCalDate={selectedCalDate}
          setSelectedCalDate={setSelectedCalDate}
          selectedApt={selectedApt}
          setSelectedApt={setSelectedApt}
          onAptUpdate={onAptUpdate}
        />
      </LocalizationProvider>
      <AddClient
        openClientModal={openClientModal}
        setOpenClientModal={setOpenClientModal}
      />
      <CalendarComp
        appointments={appointments}
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedCalDate={selectedCalDate}
        setSelectedCalDate={setSelectedCalDate}
        selectedApt={selectedApt}
        setSelectedApt={setSelectedApt}
      />
    </>
  );
}

Home.propTypes = {
  openClientModal: PropTypes.bool.isRequired,
  setOpenClientModal: PropTypes.func.isRequired,
};

export default Home;
