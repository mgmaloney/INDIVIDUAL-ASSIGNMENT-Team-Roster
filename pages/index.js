/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarComp from '../components/calendar';
import AddAppointment from '../components/addAppointment';
import {
  getAppointmentsByClientId,
  getAppointmentsByTherapistId,
} from '../utils/databaseCalls/calendarData';
import TherapistContext from '../utils/context/therapistContext';
import { createNote } from '../utils/databaseCalls/noteData';

function Home() {
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

  const createNoteAfterAptStart = async (aptsArr) => {
    const now = Date.now();
    console.warn('now', now);
    aptsArr.forEach(async (appointment) => {
      const aptTime = new Date(appointment.start);
      let numberOfPastClientApts = 0;
      console.warn('apttime', aptTime);
      if (now >= aptTime) {
        const clientApts = await getAppointmentsByClientId(
          appointment.clientId,
        );
        clientApts.forEach((clientAppointment) => {
          const clientAptTime = new Date(clientAppointment.start);
          if (now >= clientAptTime) {
            numberOfPastClientApts += 1;
            console.warn(
              `${clientAppointment.title} is #${numberOfPastClientApts}`,
            );
          }
        });
        const newNotePayload = {
          title: `Appointment #${numberOfPastClientApts}`,
          type: 'appointment',
          appointmentId: appointment.appointmentId,
          clientId: appointment.clientId,
          therapistId: appointment.therapistId,
          supervisorId: therapist.supervisorId,
          content: {
            D: '',
            A: '',
            P: '',
          },
          signedByTherapist: false,
          signedBySupervisor: false,
          dateTime: appointment.dateTime,
        };
        // createNote(newNotePayload)
      }
    });
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
      {/* {createAptAfterAptStart()} */}
    </>
  );
}

export default Home;
