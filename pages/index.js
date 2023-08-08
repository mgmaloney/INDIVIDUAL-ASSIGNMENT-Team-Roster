/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import { useAuth } from '../utils/context/authContext';
import CreateTherapistUser from '../components/forms/createTherapistUser';
import { getTherapistByUid } from '../utils/databaseCalls/therapistData';
import TherapistContext from '../utils/context/therapistContext';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState('');
  const [therapist, setTherapist] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    getTherapistByUid(user.uid).then((response) => setTherapist(response[0]));
  }, [user.uid]);

  // this will need to be refactored for when the admin user is added
  const [isNewUser, setIsNewUser] = useState(false);
  const isNewUserCheck = async () => {
    if (therapist.length === 0) {
      setIsNewUser(true);
      console.warn('user', user);
    }
  };

  useEffect(() => {
    isNewUserCheck();
  }, [isNewUser]);

  if (isNewUser) {
    return (
      <>
        <CreateTherapistUser />
      </>
    );
  }
  return (
    <>
      <TherapistContext.Provider value={{ therapist }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AddAppointment openModal={openModal} setOpenModal={setOpenModal} />
        </LocalizationProvider>
        <CalendarComp
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedCalDate={selectedCalDate}
          setSelectedCalDate={setSelectedCalDate}
        />
      </TherapistContext.Provider>
    </>
  );
}

export default Home;
