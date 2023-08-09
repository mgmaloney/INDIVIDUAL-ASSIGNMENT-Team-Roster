import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import NoteCard from '../../components/cards/noteCard';
import { getAllClientNotes } from '../../utils/databaseCalls/sessionNoteData';

export default function ClientOverView() {
  const [client, setClient] = useState({});
  const [clientNotes, setClientNotes] = useState([]);
  const router = useRouter();
  const clientId = router.query;

  useEffect(() => {
    getClientByClientId(clientId).then(setClient);
  }, [clientId]);

  useEffect(() => {
    getAllClientNotes.then(setClientNotes);
  }, []);

  return (
    <>
      <h2>{client.firstName}</h2>
      {clientNotes.length && (
        <div className="client-notes">
          {clientNotes.map((note) => 
            <NoteCard noteObj={note} page="clientOverview" />,
          )}
        </div>
      )}
    </>
  );
}
