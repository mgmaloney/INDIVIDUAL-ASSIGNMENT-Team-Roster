/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useContext } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import TherapistContext from '../utils/context/therapistContext';

function Home() {
  const { therapist } = useContext(TherapistContext);
  const [selectedCalDate, setSelectedCalDate] = useState('');

  return (
    <>
      {therapist && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AddAppointment
              selectedCalDate={selectedCalDate}
              setSelectedCalDate={setSelectedCalDate}
            />
          </LocalizationProvider>
          <CalendarComp
            selectedCalDate={selectedCalDate}
            setSelectedCalDate={setSelectedCalDate}
          />
        </>
      )}
    </>
  );
}

export default Home;
