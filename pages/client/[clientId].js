/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Link from 'next/link';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import { getAllClientNotes } from '../../utils/databaseCalls/noteData';
import NoteCard from '../../components/cards/noteCard';
import ClientContext from '../../utils/context/clientContext';
import AddAppointment from '../../components/addAppointment';

export default function ClientOverView() {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState({});
  const [clientNotes, setClientNotes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const changeModalState = () => {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  };

  useEffect(() => {
    getClientByClientId(clientId).then(setClient);
  }, [clientId]);

  useEffect(() => {
    getAllClientNotes(clientId).then(setClientNotes);
  }, [clientId]);

  function calculateAge(birthday) {
    // birthday is a date
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return (
    <>
      <ClientContext.Provider value={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AddAppointment openModal={openModal} setOpenModal={setOpenModal} />
        </LocalizationProvider>
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

        {clientNotes.length && (
          <div className="client-notes">
            {clientNotes.map((note) => (
              <NoteCard
                key={note.noteId}
                noteObj={note}
                page="clientOverview"
              />
            ))}
          </div>
        )}
      </ClientContext.Provider>
    </>
  );
}
