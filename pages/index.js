/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import CreateTherapistUser from '../components/forms/createTherapistUser';
import { useAuth } from '../utils/context/authContext';
import { getAllSupervisors } from '../utils/databaseCalls.js/supervisorData';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState('');
  const {user} = useAuth()

  if (user.metadata.creationTime === user.metadata.lastSignInTime && !userCreated) {
    return (
      <>
        <CreateTherapistUser setUserCreated={setUserCreated} />
      </>
    );
  }
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AddAppointment openModal={openModal} setOpenModal={setOpenModal} />
      </LocalizationProvider>
      <CalendarComp
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedCalDate={selectedCalDate}
        setSelectedCalDate={setSelectedCalDate}
      />
    </>
  );
}

export default Home;
