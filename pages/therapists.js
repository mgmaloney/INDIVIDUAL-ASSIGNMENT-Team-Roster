import { useEffect, useState } from 'react';
import { getAllTherapists } from '../utils/databaseCalls/therapistData';
import TherapistCard from '../components/cards/therapistCard';

export default function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [showingTherapists, setShowingTherapists] = useState([]);
  const [sortState, setSortState] = useState('active');

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  useEffect(() => {
    const updatedShowingTherapists = [];
    if (sortState === 'active') {
      therapists.forEach((client) => {
        if (client.active) {
          updatedShowingTherapists.push(client);
        }
      });
      setShowingTherapists(updatedShowingTherapists);
    } else if (sortState === 'inactive') {
      therapists.forEach((client) => {
        if (client.active === false) {
          updatedShowingTherapists.push(client);
        }
      });
      setShowingTherapists(updatedShowingTherapists);
    } else if (sortState === 'all') {
      setShowingTherapists(therapists);
    }
  }, [therapists, sortState]);

  const onTherapistUpdate = () => {
    getAllTherapists().then(setTherapists);
  };

  const handleActiveSort = (e) => {
    setSortState(e.target.value);
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
      <div className="header-search">
        <div className="list-header-div">
          <h1 className="list-header">Therapists: </h1>
        </div>
        <div className="search-sort">
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
        </div>
      </div>
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
