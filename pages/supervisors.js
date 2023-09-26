import { useEffect, useState } from 'react';
import { getAllSupervisors } from '../utils/databaseCalls/supervisorData';
import TherapistCard from '../components/cards/therapistCard';

export default function Supervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [showingSupervisors, setShowingSupervisors] = useState([]);
  const [sortState, setSortState] = useState('active');

  useEffect(() => {
    getAllSupervisors().then(setSupervisors);
  }, []);

  useEffect(() => {
    const updatedShowingSupervisors = [];
    if (sortState === 'active') {
      supervisors.forEach((client) => {
        if (client.active) {
          updatedShowingSupervisors.push(client);
        }
      });
      setShowingSupervisors(updatedShowingSupervisors);
    } else if (sortState === 'inactive') {
      supervisors.forEach((client) => {
        if (client.active === false) {
          updatedShowingSupervisors.push(client);
        }
      });
      setShowingSupervisors(updatedShowingSupervisors);
    } else if (sortState === 'all') {
      setShowingSupervisors(supervisors);
    }
  }, [supervisors, sortState]);

  const onSupervisorUpdate = () => {
    getAllSupervisors().then(setSupervisors);
  };

  const handleActiveSort = (e) => {
    setSortState(e.target.value);
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
