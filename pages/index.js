/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import CreateTherapistUser from '../components/forms/createTherapistUser';
import { useAuth } from '../utils/context/authContext';
import { getTherapistByUid } from '../utils/databaseCalls/therapistData';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const { user } = useAuth();

  const isNewUserCheck = async () => {
    const therapist = await getTherapistByUid(user.uid);
    if (therapist.length === 0) {
      setIsNewUser(true);
      console.warn('user', user);
    }
  };

  useEffect(() => {
    isNewUserCheck();
  }, []);

  if (isNewUser) {
    return (
      <>
        <CreateTherapistUser />
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
