import { useState, useEffect, useContext } from 'react';
import { getSupervisees } from '../utils/databaseCalls/therapistData';
import TherapistContext from '../utils/context/therapistContext';
import TherapistCard from '../components/cards/therapistCard';

export default function Supervisees() {
  const { therapist } = useContext(TherapistContext);
  const [supervisees, setSuperVisees] = useState([]);
  const [showingSupervisees, setShowingSupervisees] = useState([]);

  useEffect(() => {
    getSupervisees(therapist.therapistId).then(setSuperVisees);
  }, [therapist.therapistId]);

  useEffect(() => {
    const activeSupervisees = [];
    supervisees.forEach((supervisee) => {
      if (supervisee.active) {
        activeSupervisees.push(supervisee);
      }
    });
    setShowingSupervisees(activeSupervisees);
  }, [supervisees]);

  const onSuperviseeUpdate = () => {
    getSupervisees(therapist.therapistId).then(setSuperVisees);
  };

  const handleActiveSort = (e) => {
    const updatedShowingSupervisees = [];
    if (e.target.value === 'active') {
      supervisees.forEach((supervisee) => {
        if (supervisee.active) {
          updatedShowingSupervisees.push(supervisee);
        }
      });
      setShowingSupervisees(updatedShowingSupervisees);
    } else if (e.target.value === 'inactive') {
      supervisees.forEach((supervisee) => {
        if (supervisee.active === false) {
          updatedShowingSupervisees.push(supervisee);
        }
      });
      setShowingSupervisees(updatedShowingSupervisees);
    } else if (e.target.value === 'all') {
      setShowingSupervisees(supervisees);
    }
  };

  const handleSearch = (e) => {
    const filteredSupervisees = [];
    supervisees.forEach((supervisee) => {
      if (
        supervisee.firstName.toLowerCase().includes(e.target.value) ||
        supervisee.lastName.toLowerCase().includes(e.target.value)
      ) {
        filteredSupervisees.push(supervisee);
      }
    });
    setShowingSupervisees(filteredSupervisees);
  };

  return (
    <>
      <div className="header-search">
        <div className="list-header-div">
          <h1 className="list-header">Supervisees: </h1>
        </div>
        <div className="search-sort">
          <select className="active-sort" onChange={handleActiveSort}>
            <option value="active" defaultValue="active">
              Active Supervisees
            </option>
            <option value="inactive">Inactive Supervisees</option>
            <option value="all">All Supervisees</option>
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
        {showingSupervisees &&
          showingSupervisees.map((supervisee) => (
            <TherapistCard
              therapistObj={supervisee}
              onTherapistUpdate={onSuperviseeUpdate}
            />
          ))}
      </div>
    </>
  );
}
