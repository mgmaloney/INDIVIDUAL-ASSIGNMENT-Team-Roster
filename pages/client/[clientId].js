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

  return (
    <>
      <ClientContext.Provider value={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AddAppointment openModal={openModal} setOpenModal={setOpenModal} />
        </LocalizationProvider>
        <div className="client-page-header">
          <h2>{client.firstName}</h2>
          <div className="client-nav">
            <p className="client-nav-item">{client.birthDate}</p>
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
