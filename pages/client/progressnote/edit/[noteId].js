import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAppointmentNoteByNoteId } from '../../../../utils/databaseCalls/noteData';
import DAPForm from '../../../../components/forms/DAPNote';
import AppointmentDetails from '../../../../components/cards/appointmentDetails';

export default function EditDAPNote() {
  const router = useRouter();
  const { noteId } = router.query;
  const [note, setNote] = useState({});

  useEffect(() => {
    getAppointmentNoteByNoteId(noteId).then(setNote);
  }, [noteId]);

  return (
    <>
      <div className="view-edit-note">
        <div className="DAPForm-container">
          <DAPForm noteObj={note} />
        </div>
        <AppointmentDetails noteObj={note} />
      </div>
    </>
  );
}
