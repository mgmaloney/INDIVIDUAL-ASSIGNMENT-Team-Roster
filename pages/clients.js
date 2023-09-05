import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ClientDetailsCard from '../components/cards/clientDetails';
import TherapistClientsContext from '../utils/context/therapistClientsContext';

export default function ClientsPage({ viewTherapistClients }) {
  const { therapistClients } = useContext(TherapistClientsContext);
  const [pageSpecificClients, setPageSpecificClients] = useState([]);
  const [showingClients, setShowingClients] = useState([]);

  useEffect(() => {
    const initialShowingClients = [];
    pageSpecificClients.forEach((client) => {
      if (client.active) {
        initialShowingClients.push(client);
      }
    });
    setShowingClients(initialShowingClients);
  }, [pageSpecificClients]);

  useEffect(() => {
    if (viewTherapistClients) {
      setPageSpecificClients(viewTherapistClients);
    } else {
      setPageSpecificClients(therapistClients);
    }
  }, []);

  const handleActiveSort = (e) => {
    const updatedShowingClients = [];
    if (e.target.value === 'active') {
      pageSpecificClients.forEach((client) => {
        if (client.active) {
          updatedShowingClients.push(client);
        }
      });
      setShowingClients(updatedShowingClients);
    } else if (e.target.value === 'inactive') {
      pageSpecificClients.forEach((client) => {
        if (client.active === false) {
          updatedShowingClients.push(client);
        }
      });
      setShowingClients(updatedShowingClients);
    } else if (e.target.value === 'all') {
      setShowingClients(pageSpecificClients);
    }
  };

  const handleSearch = (e) => {
    const filteredClients = [];
    pageSpecificClients.forEach((client) => {
      if (
        client.firstName.toLowerCase().includes(e.target.value) ||
        client.lastName.toLowerCase().includes(e.target.value)
      ) {
        filteredClients.push(client);
      }
    });
    setShowingClients(filteredClients);
  };

  return (
    <>
      <div className="header-search">
        <h3 className="list-header">
          {viewTherapistClients ? 'Assigned Clients: ' : 'Your Clients: '}
        </h3>
        <div className="search-sort">
          <select className="active-sort" onChange={handleActiveSort}>
            <option value="active" defaultValue="active">
              Active Clients
            </option>
            <option value="inactive">Inactive Clients</option>
            <option value="all">All Clients</option>
          </select>
          <input
            type="search"
            placeholder="Search..."
            className="search-clients"
            onChange={handleSearch}
          />
        </div>
      </div>
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

ClientsPage.propTypes = {
  viewTherapistClients: PropTypes.arrayOf(
    PropTypes.shape(
      PropTypes.shape({
        clientId: PropTypes.string,
        therapistId: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        address1: PropTypes.string,
        address2: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zipcode: PropTypes.string,
        sex: PropTypes.string,
        gender: PropTypes.string,
        active: PropTypes.bool,
      }),
    ),
  ),
};

ClientsPage.defaultProps = {
  viewTherapistClients: null,
};
