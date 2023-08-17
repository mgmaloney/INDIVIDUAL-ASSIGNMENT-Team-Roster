/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState('');
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
        />
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
