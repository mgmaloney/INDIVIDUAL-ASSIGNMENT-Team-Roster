import { useContext, useEffect, useState } from 'react';
import ClientDetailsCard from '../components/cards/clientDetails';
import TherapistClientsContext from '../utils/context/therapistClientsContext';

export default function ClientsPage() {
  const { therapistClients } = useContext(TherapistClientsContext);
  const [showingClients, setShowingClients] = useState([]);

  useEffect(() => {
    const initialShowingClients = [];
    therapistClients.forEach((client) => {
      if (client.active) {
        initialShowingClients.push(client);
      }
    });
    setShowingClients(initialShowingClients);
  }, [therapistClients]);

  const handleActiveSort = (e) => {
    const updatedShowingClients = [];
    if (e.target.value === 'active') {
      therapistClients.forEach((client) => {
        if (client.active) {
          updatedShowingClients.push(client);
        }
      });
      setShowingClients(updatedShowingClients);
    } else if (e.target.value === 'inactive') {
      therapistClients.forEach((client) => {
        if (client.active === false) {
          updatedShowingClients.push(client);
        }
      });
      setShowingClients(updatedShowingClients);
    } else if (e.target.value === 'all') {
      setShowingClients(therapistClients);
    }
  };

  return (
    <>
      <h1 className="clients-header">Your Clients: </h1>
      <select className="active-sort" onChange={handleActiveSort}>
        <option value="active" defaultValue="active">
          Active Clients
        </option>
        <option value="inactive">Inactive Clients</option>
        <option value="all">All Clients</option>
      </select>
      {showingClients.length > 0 &&
        showingClients?.map((client) => (
          <ClientDetailsCard
            key={client.clientId}
            page="clients"
            clientObj={client}
          />
        ))}
    </>
  );
}
