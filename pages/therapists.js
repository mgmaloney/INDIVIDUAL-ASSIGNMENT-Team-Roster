import { useEffect, useState } from 'react';
import { getAllTherapists } from '../utils/databaseCalls/therapistData';
import TherapistCard from '../components/cards/therapistCard';

export default function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [showingTherapists, setShowingTherapists] = useState([]);

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  useEffect(() => {
    const activeTherapists = [];
    therapists.forEach((therapist) => {
      if (therapist.active) {
        activeTherapists.push(therapist);
      }
    });
    setShowingTherapists(activeTherapists);
  }, [therapists]);

  const onTherapistUpdate = () => {
    getAllTherapists().then(setTherapists);
  };

  const handleActiveSort = (e) => {
    const updatedShowingTherapists = [];
    if (e.target.value === 'active') {
      therapists.forEach((client) => {
        if (client.active) {
          updatedShowingTherapists.push(client);
        }
      });
      setShowingTherapists(updatedShowingTherapists);
    } else if (e.target.value === 'inactive') {
      therapists.forEach((client) => {
        if (client.active === false) {
          updatedShowingTherapists.push(client);
        }
      });
      setShowingTherapists(updatedShowingTherapists);
    } else if (e.target.value === 'all') {
      setShowingTherapists(therapists);
    }
  };

  const handleSearch = (e) => {
    const filteredTherapists = [];
    therapists.forEach((therapist) => {
      if (
        therapist.firstName.toLowerCase().includes(e.target.value) ||
        therapist.lastName.toLowerCase().includes(e.target.value)
      ) {
        filteredTherapists.push(therapist);
      }
    });
    setShowingTherapists(filteredTherapists);
  };

  return (
    <>
      <h1 className="list-header">Therapists: </h1>
      <select className="active-sort" onChange={handleActiveSort}>
        <option value="active" defaultValue="active">
          Active Therapists
        </option>
        <option value="inactive">Inactive Therapists</option>
        <option value="all">All Therapists</option>
      </select>
      <input
        type="search"
        placeholder="Search..."
        className="search-clients"
        onChange={handleSearch}
      />
      <div className="therapists">
        {showingTherapists &&
          showingTherapists.map((therapist) => (
            <TherapistCard
              therapistObj={therapist}
              onTherapistUpdate={onTherapistUpdate}
            />
          ))}
      </div>
    </>
  );
}
