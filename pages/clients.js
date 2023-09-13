import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ClientDetailsCard from '../components/cards/clientDetails';
import TherapistClientsContext from '../utils/context/therapistClientsContext';
import TherapistContext from '../utils/context/therapistContext';
import { getClientsByTherapistId } from '../utils/databaseCalls/clientData';
import {
  getSupervisees,
  getTherapistByTherapistId,
} from '../utils/databaseCalls/therapistData';

export default function ClientsPage({ viewClients, page }) {
  const { therapist } = useContext(TherapistContext);
  const { therapistClients } = useContext(TherapistClientsContext);
  const [pageSpecificClients, setPageSpecificClients] = useState([]);
  const [showingClients, setShowingClients] = useState([]);
  const [adminsClients, setAdminsClients] = useState([]);
  const [supervisees, setSuperVisees] = useState([]);
  const [showingAdminClients, setShowingAdminClients] = useState(false);
  const [showingSuperviseeClients, setShowingSuperviseeClients] =
    useState(false);
  const [supervisee, setSupervisee] = useState({});

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
    if (viewClients) {
      setPageSpecificClients(viewClients);
    } else {
      setPageSpecificClients(therapistClients);
    }
  }, [therapistClients]);

  useEffect(() => {
    if (therapist.admin) {
      getClientsByTherapistId(therapist.therapistId).then(setAdminsClients);
    }
  }, [therapist]);

  useEffect(() => {
    if (therapist.supervisor) {
      getSupervisees(therapist.therapistId).then(setSuperVisees);
    }
  }, [therapist.therapistId, therapist.supervisor]);

  const handleActiveSort = async (e) => {
    const updatedShowingClients = [];
    if (e.target.value === 'active') {
      pageSpecificClients.forEach((client) => {
        if (client.active) {
          updatedShowingClients.push(client);
        }
      });
      setShowingClients(updatedShowingClients);
      setShowingAdminClients(false);
      setShowingSuperviseeClients(false);
    } else if (e.target.value === 'inactive') {
      pageSpecificClients.forEach((client) => {
        if (client.active === false) {
          updatedShowingClients.push(client);
        }
      });
      setShowingClients(updatedShowingClients);
      setShowingAdminClients(false);
      setShowingSuperviseeClients(false);
    } else if (e.target.value === 'all') {
      setShowingClients(pageSpecificClients);
      setShowingAdminClients(false);
      setShowingSuperviseeClients(false);
    } else if (e.target.value === 'your-active-clients') {
      const adminActiveClients = [];
      adminsClients.forEach((client) => {
        if (client.active === false) {
          adminActiveClients.push(client);
        }
      });
      setShowingClients(adminActiveClients);
      setShowingAdminClients(true);
    } else if (e.target.value === 'your-inactive-clients') {
      const adminInactiveClients = [];
      adminsClients.forEach((client) => {
        if (!client.active === false) {
          adminInactiveClients.push(client);
        }
      });
      setShowingClients(adminInactiveClients);
      setShowingAdminClients(true);
    } else if (e.target.value === 'all-your-clients') {
      setShowingClients(adminsClients);
      setShowingAdminClients(true);
    } else if (e.target.value.split('--')[1] === 'supervisee-active') {
      const [superviseeId] = e.target.value.split('--');
      getTherapistByTherapistId(superviseeId).then(setSupervisee);
      const activeSuperviseeClients = [];
      const superviseeCts = await getClientsByTherapistId(superviseeId);
      superviseeCts.forEach((client) => {
        if (client.active) {
          activeSuperviseeClients.push(client);
          setShowingClients([...activeSuperviseeClients]);
        }
      });
      setShowingClients(activeSuperviseeClients);
      setShowingSuperviseeClients(true);
    } else if (e.target.value.split('--')[1] === 'supervisee-inactive') {
      const [superviseeId] = e.target.value.split('--');
      getTherapistByTherapistId(superviseeId).then(setSupervisee);
      const inactiveSuperviseeClients = [];
      const superviseeCts = await getClientsByTherapistId(superviseeId);
      superviseeCts.forEach((client) => {
        if (!client.active) {
          inactiveSuperviseeClients.push(client);
        }
      });
      setShowingClients(inactiveSuperviseeClients);
      setShowingSuperviseeClients(true);
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

  const clientsLabel = () => {
    if (page === 'viewTherapist') {
      return 'Assigned Clients: ';
    }
    if (therapist.admin && !showingAdminClients) {
      return 'Practice Clients: ';
    }
    if (therapist.supervisor && showingSuperviseeClients) {
      return `${supervisee.firstName} ${supervisee.lastName}'s Clients: `;
    }
    return 'Your Clients: ';
  };

  return (
    <>
      <div className="header-search">
        <h3 className="list-header">{clientsLabel()}</h3>
        <div className="search-sort">
          <select className="active-sort" onChange={handleActiveSort}>
            <option value="active" defaultValue="active">
              {therapist?.supervisor ? 'Your' : ''} Active Clients
            </option>
            <option value="inactive">
              {therapist?.supervisor ? 'Your' : ''} Inactive Clients
            </option>
            {therapist?.admin ? (
              <>
                <option value="your-active-clients">Your Active Clients</option>
                <option value="your-inactive-clients">
                  Your Inactive Clients
                </option>
                <option value="all-your-clients">All Your Clients</option>
              </>
            ) : (
              ''
            )}
            {therapist?.supervisor ? (
              <>
                {supervisees &&
                  supervisees.map((superviseeForOption) => (
                    <>
                      <option
                        value={`${superviseeForOption.therapistId}--supervisee-active`}
                        key={superviseeForOption.therapistId}
                      >
                        {`${superviseeForOption.firstName} ${superviseeForOption.lastName}'s Active
                        Clients`}
                      </option>
                      <option
                        value={`${superviseeForOption.therapistId}--supervisee-inactive`}
                        key={superviseeForOption.therapistId + 1}
                      >
                        {`${superviseeForOption.firstName} ${superviseeForOption.lastName}'s Inactive
                        Clients`}
                      </option>
                    </>
                  ))}
              </>
            ) : (
              ''
            )}
            <option value="all">
              All {therapist.supervisor ? 'Your' : ''} Clients
            </option>
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
  viewClients: PropTypes.arrayOf(
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
  page: PropTypes.string,
};

ClientsPage.defaultProps = {
  viewClients: null,
  page: '',
};
