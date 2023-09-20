import { useEffect, useState } from 'react';
import { getAllSupervisors } from '../utils/databaseCalls/supervisorData';
import TherapistCard from '../components/cards/therapistCard';

export default function Supervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [showingSupervisors, setShowingSupervisors] = useState([]);

  useEffect(() => {
    getAllSupervisors().then(setSupervisors);
  }, []);

  useEffect(() => {
    const activeSupervisors = [];
    supervisors.forEach((supervisor) => {
      if (supervisor.active) {
        activeSupervisors.push(supervisor);
      }
    });
    setShowingSupervisors(activeSupervisors);
  }, [supervisors]);

  const onSupervisorUpdate = () => {
    getAllSupervisors().then(setSupervisors);
  };

  const handleActiveSort = (e) => {
    const updatedShowingSupervisors = [];
    if (e.target.value === 'active') {
      supervisors.forEach((client) => {
        if (client.active) {
          updatedShowingSupervisors.push(client);
        }
      });
      setShowingSupervisors(updatedShowingSupervisors);
    } else if (e.target.value === 'inactive') {
      supervisors.forEach((client) => {
        if (client.active === false) {
          updatedShowingSupervisors.push(client);
        }
      });
      setShowingSupervisors(updatedShowingSupervisors);
    } else if (e.target.value === 'all') {
      setShowingSupervisors(supervisors);
    }
  };

  const handleSearch = (e) => {
    const filteredSupervisors = [];
    supervisors.forEach((supervisor) => {
      if (
        supervisor.firstName.toLowerCase().includes(e.target.value) ||
        supervisor.lastName.toLowerCase().includes(e.target.value)
      ) {
        filteredSupervisors.push(supervisor);
      }
    });
    setShowingSupervisors(filteredSupervisors);
  };

  return (
    <>
      <div className="header-search">
        <div className="list-header-div">
          <h3 className="list-header">Supervisors: </h3>
        </div>
        <div className="search-sort">
          <select className="active-sort" onChange={handleActiveSort}>
            <option value="active" defaultValue="active">
              Active Supervisors
            </option>
            <option value="inactive">Inactive Supervisors</option>
            <option value="all">All Supervisors</option>
          </select>
          <input
            type="search"
            placeholder="Search..."
            className="search-clients"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="therapists">
        {showingSupervisors &&
          showingSupervisors.map((supervisor) => (
            <TherapistCard
              therapistObj={supervisor}
              onTherapistUpdate={onSupervisorUpdate}
            />
          ))}
      </div>
    </>
  );
}
