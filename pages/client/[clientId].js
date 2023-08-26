/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Link from 'next/link';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import {
  getAllClientNotes,
  getAllClientAppointmentNotes,
  createNote,
} from '../../utils/databaseCalls/noteData';
import NoteCard from '../../components/cards/noteCard';
import ClientContext from '../../utils/context/clientContext';
import AddAppointment from '../../components/addAppointment';
import ClientDetailsCard from '../../components/cards/clientDetails';
import ChartNoteForm from '../../components/forms/chartNote';
import TherapistContext from '../../utils/context/therapistContext';
import { getAppointmentsByClientId } from '../../utils/databaseCalls/calendarData';

export default function ClientOverView() {
  const router = useRouter();
  const { clientId } = router.query;
  const { therapist } = useContext(TherapistContext);
  const [client, setClient] = useState({});
  const [clientNotes, setClientNotes] = useState([]);
  const [aptNotes, setAptNotes] = useState([]);
  const [sortedNotes, setSortedNotes] = useState([]);
  const [clientApts, setClientApts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const changeModalState = () => {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  };

  const getAndSetClientAptsAndAptNotes = async () => {
    const allClientNotes = await getAllClientNotes(clientId);
    const clientAptNotes = await getAllClientAppointmentNotes(clientId);
    const clientAppointments = await getAppointmentsByClientId(clientId);
    setClientNotes(allClientNotes);
    setAptNotes(clientAptNotes);
    setClientApts(clientAppointments);
  };

  useEffect(() => {
    getClientByClientId(clientId).then(setClient);
  }, [clientId]);

  useEffect(() => {
    getAndSetClientAptsAndAptNotes();
  }, []);

  useEffect(() => {
    setSortedNotes(
      [...clientNotes].sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      ),
    );
  }, [clientNotes]);

  const onNotesUpdate = (clientKey) => {
    getAllClientNotes(clientKey).then(setClientNotes);
  };

  const createNoteAfterAptStart = async () => {
    const now = Date.now();
    clientApts.forEach(async (appointment) => {
      const aptTime = new Date(appointment.start);
      let numberOfPastClientApts = aptNotes.length;
      if (now >= aptTime) {
        numberOfPastClientApts += 1;
        if (
          aptNotes.some(
            (note) => note.appointmentId === appointment.appointmentId,
          ) === false
        ) {
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
            sharedWithSupervisor: false,
            signedBySupervisor: false,
            dateTime: appointment.start,
          };
          console.warn(
            `creating note for ${appointment.title}'s ${appointment.start} appointment`,
          );
          await createNote(newNotePayload);
          const updatedClientNotes = await getAllClientAppointmentNotes(
            clientId,
          );
          const updateClientApts = await getAllClientAppointmentNotes(clientId);
          setAptNotes(updatedClientNotes);
          setClientApts(updateClientApts);
          onNotesUpdate(clientId);
        }
      }
    });
  };

  useEffect(() => {
    createNoteAfterAptStart();
  }, [clientApts]);

  function calculateAge(birthday) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return (
    <>
      <ClientContext.Provider value={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AddAppointment openModal={openModal} setOpenModal={setOpenModal} />
        </LocalizationProvider>
        <div className="main-client-overview">
          <div className="ov-header-note">
            <div className="client-page-header">
              <div className="overview-name">
                <h2>{client.firstName}</h2>
                <h2>{client.lastName}</h2>
              </div>
              <div className="client-nav">
                <div className="birth-age">
                  <h6 className="birthdate">{client.birthDate}</h6>
                  <h6 className="age">
                    ({calculateAge(Date.parse(client.birthDate))})
                  </h6>
                </div>
                <p onClick={changeModalState} className="client-nav-link">
                  Schedule Now
                </p>
                <Link passHref href={`/edit/${clientId}`}>
                  <p className="client-nav-link">Edit</p>
                </Link>
              </div>
            </div>
            <ChartNoteForm clientObj={client} onNotesUpdate={onNotesUpdate} />
            <div className="notes-info">
              {sortedNotes.length && (
                <div className="client-notes">
                  {sortedNotes.map((note) => (
                    <NoteCard
                      key={note.noteId}
                      clientId={clientId}
                      noteObj={note}
                      page="clientOverview"
                      onNotesUpdate={onNotesUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="client-info-overview">
            <ClientDetailsCard clientObj={client} page="client-overview" />
          </div>
        </div>
      </ClientContext.Provider>
    </>
  );
}
