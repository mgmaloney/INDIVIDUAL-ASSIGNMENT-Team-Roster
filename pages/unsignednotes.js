import { useContext, useEffect, useState } from 'react';
import TherapistContext from '../utils/context/therapistContext';
import {
  getAllUnsignedAppointmentNotes,
  getUnsignedAppointmentNotesSuperVisor,
  getUnsignedAppointmentNotesTherapist,
} from '../utils/databaseCalls/noteData';
import UnsignedNoteCard from '../components/cards/unsignedNoteCard';

export default function UnsignedNotes() {
  const { therapist } = useContext(TherapistContext);
  const [unsignedNotes, setUnsignedNotes] = useState([]);

  useEffect(() => {
    if (therapist.supervisor) {
      getUnsignedAppointmentNotesSuperVisor(therapist.therapistId).then(
        setUnsignedNotes,
      );
    }
    if (therapist.admin) {
      getAllUnsignedAppointmentNotes().then(setUnsignedNotes);
    } else {
      getUnsignedAppointmentNotesTherapist(therapist.therapistId).then(
        setUnsignedNotes,
      );
    }
  }, [therapist.admin, therapist.supervisor]);

  

  return (
    <>
      <h2>Unsigned Notes: </h2>
      {unsignedNotes &&
        unsignedNotes.map((unsignedNote) => (
          <UnsignedNoteCard noteObj={unsignedNote} />
        ))}
    </>
  );
}
