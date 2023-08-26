import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAppointmentNoteByNoteId } from '../../../../utils/databaseCalls/noteData';
import DAPForm from '../../../../components/forms/DAPNote';

export default function EditDAPNote() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState({});

  useEffect(() => {
    getAppointmentNoteByNoteId(id).then(setNote);
  }, [id]);

  return <DAPForm noteObj={note} />;
}
