/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import { getAppointments } from '../utils/databaseCalls/calendarData';
import TherapistContext from '../utils/context/therapistContext';

function Home() {
  const { therapist } = useContext(TherapistContext);
  const [selectedCalDate, setSelectedCalDate] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments().then(setAppointments);
  }, [therapist]);

  const onAptUpdate = () => {
    getAppointments().then(setAppointments);
  };

  // useEffect(() => {
  //   getAppointmentsByTherapistId(therapist?.therapistId).then(setAppointments);
  // }, [therapist]);

  // const onAptUpdate = () => {
  //   getAppointmentsByTherapistId(therapist?.therapistId).then(setAppointments);
  // };

  return (
    <>
      {therapist && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AddAppointment
              selectedCalDate={selectedCalDate}
              setSelectedCalDate={setSelectedCalDate}
              onAptUpdate={onAptUpdate}
            />
          </LocalizationProvider>
          <CalendarComp
            appointments={appointments}
            selectedCalDate={selectedCalDate}
            setSelectedCalDate={setSelectedCalDate}
          />
        </>
      )}
    </>
  );
}

export default Home;
