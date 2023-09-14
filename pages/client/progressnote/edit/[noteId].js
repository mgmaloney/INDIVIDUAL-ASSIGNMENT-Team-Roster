import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getAppointmentNoteByNoteId,
  getPsychotherapyNoteByAppointmentId,
} from '../../../../utils/databaseCalls/noteData';
import DAPForm from '../../../../components/forms/DAPNote';
import AppointmentDetails from '../../../../components/cards/appointmentDetails';
import PsychotherapyNoteForm from '../../../../components/forms/psychotherapyNote';

export default function EditDAPNote() {
  const router = useRouter();
  const { noteId } = router.query;
  const [note, setNote] = useState({});
  const [psychNote, setPsychNote] = useState({});

  useEffect(() => {
    getAppointmentNoteByNoteId(noteId).then(setNote);
  }, [noteId]);

  useEffect(() => {
    getPsychotherapyNoteByAppointmentId(noteId.appointmentId).then(
      (response) => {
        if (response !== 'call failed') {
          setPsychNote(response);
        }
      },
    );
  }, [noteId]);

  return (
    <>
      <div className="view-edit-note">
        <div className="DAPForm-container">
          <DAPForm noteObj={note} />
        </div>
        <div className="psychnote-container">
          <PsychotherapyNoteForm
            psychoNoteObj={psychNote}
            clientId={note.clientId}
            appointmentId={note.appointmentId}
          />
        </div>
        <AppointmentDetails noteObj={note} />
      </div>
    </>
  );
}
