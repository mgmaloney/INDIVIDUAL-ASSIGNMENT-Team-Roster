import { useEffect, useState } from 'react';
import { getAllTherapists } from '../utils/databaseCalls/therapistData';
import TherapistCard from '../components/cards/therapistCard';

export default function Therapists() {
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  return (
    <>
      <h1 className="list-header">Therapists: </h1>
      <div className="therapists">
        {therapists &&
          therapists.map((therapist) => (
            <TherapistCard therapistObj={therapist} />
          ))}
      </div>
    </>
  );
}
