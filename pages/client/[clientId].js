/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import {
  getAllClientNotes,
  getAllClientAppointmentNotes,
  createNote,
} from '../../utils/databaseCalls/noteData';
import NoteCard from '../../components/cards/noteCard';
import AddAppointment from '../../components/addAppointment';
import ClientDetailsCard from '../../components/cards/clientDetails';
import ChartNoteForm from '../../components/forms/chartNote';
import TherapistContext from '../../utils/context/therapistContext';
import { getAppointmentsByClientId } from '../../utils/databaseCalls/calendarData';
import OpenClientModalContext from '../../utils/context/openClientModalContext';
import UpcomingAppointments from '../../components/upcomingAppointments';

export default function ClientOverView() {
  const router = useRouter();
  const { clientId } = router.query;
  const { therapist } = useContext(TherapistContext);
  const { setOpenClientModal, setEditingClient } = useContext(
    OpenClientModalContext,
  );
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

  const handleEdit = () => {
    setEditingClient(client);
    setOpenClientModal(true);
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
          await createNote(newNotePayload);
          const updatedClientNotes = await getAllClientAppointmentNotes(
            clientId,
          );
          const updateClientApts = await getAppointmentsByClientId(clientId);
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

  const formatBirthday = () => {
    if (client.birthDate) {
      const birthdayFormatted = format(
        new Date(client.birthDate),
        'MM/dd/yyyy',
      );
      return birthdayFormatted;
    }
    return '';
  };

  const calculateAge = (birthday) => {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <>
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
                <h6 className="birthdate">{formatBirthday()}</h6>
                <h6 className="age">
                  ({calculateAge(Date.parse(client.birthDate))})
                </h6>
              </div>
              <p onClick={changeModalState} className="client-nav-link">
                Schedule Now
              </p>
              <button
                type="button"
                onClick={handleEdit}
                className="client-nav-link edit-clients-page"
              >
                Edit
              </button>
            </div>
          </div>
          <ChartNoteForm clientObj={client} onNotesUpdate={onNotesUpdate} />
          <div className="notes-info">
            {sortedNotes.length > 0 && (
              <div className="client-notes">
                {sortedNotes.map((note) => (
                  <NoteCard
                    key={note.noteId}
                    clientId={clientId}
                    clientObj={client}
                    noteObj={note}
                    page="clientOverview"
                    onNotesUpdate={onNotesUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="client-overview-sidebar">
          <div className="client-info-overview">
            <ClientDetailsCard clientObj={client} page="client-overview" />
          </div>
          <UpcomingAppointments apts={clientApts} />
        </div>
      </div>
    </>
  );
}
