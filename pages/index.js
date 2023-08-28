/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import { getAppointmentsByTherapistId } from '../utils/databaseCalls/calendarData';
import TherapistContext from '../utils/context/therapistContext';
import OpenClientModalContext from '../utils/context/openClientModalContext';

function Home() {
  const { therapist } = useContext(TherapistContext);
  const { openClientModal, setOpenClientModal } = useContext(
    OpenClientModalContext,
  );
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

export default Home;
