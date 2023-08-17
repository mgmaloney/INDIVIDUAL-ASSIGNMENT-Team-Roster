import { useContext } from 'react';
import ClientDetailsCard from '../components/cards/clientDetails';
import TherapistClientsContext from '../utils/context/therapistClientsContext';

export default function ClientsPage() {
  const { therapistClients } = useContext(TherapistClientsContext);

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
