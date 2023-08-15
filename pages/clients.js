import { useContext, useEffect, useState } from 'react';
import TherapistContext from '../utils/context/therapistContext';
import { getClientsByTherapistId } from '../utils/databaseCalls/clientData';
import ClientDetailsCard from '../components/cards/clientDetails';

export default function ClientsPage() {
  const [therapistClients, setTherapistClients] = useState([]);
  const { therapist } = useContext(TherapistContext);

  useEffect(() => {
    console.warn('therapist', therapist);
    getClientsByTherapistId(therapist.therapistId).then(setTherapistClients);
  }, [therapist]);

  return (
    <>
      {therapistClients.length > 0 &&
        therapistClients?.map((client) => (
          <ClientDetailsCard
            key={client.clientId}
            page="clients"
            clientObj={client}
          />
        ))}
    </>
  );
}