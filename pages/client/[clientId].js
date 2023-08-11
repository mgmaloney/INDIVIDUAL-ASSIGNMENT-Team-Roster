import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import { getAllClientNotes } from '../../utils/databaseCalls/noteData';
import NoteCard from '../../components/cards/noteCard';

export default function ClientOverView() {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState({});
  const [clientNotes, setClientNotes] = useState([]);

  useEffect(() => {
    getClientByClientId(clientId).then(setClient);
  }, [clientId]);

  useEffect(() => {
    getAllClientNotes(clientId).then(setClientNotes);
  }, [clientId]);

  return (
    <>
      <h2>{client.firstName}</h2>
      {clientNotes.length && (
        <div className="client-notes">
          {clientNotes.map((note) => (
            <NoteCard key={note.noteId} noteObj={note} page="clientOverview" />
          ))}
        </div>
      )}
    </>
  );
}
