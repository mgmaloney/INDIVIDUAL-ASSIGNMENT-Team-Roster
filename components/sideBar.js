import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import TherapistContext from '../utils/context/therapistContext';
import {
  getAllUnsignedAppointmentNotes,
  getUnsignedAppointmentNotesSuperVisor,
  getUnsignedAppointmentNotesTherapist,
} from '../utils/databaseCalls/noteData';

export default function SideBar() {
  const { therapist } = useContext(TherapistContext);
  const [unsignedNotes, setUnsignedNotes] = useState([]);

  useEffect(() => {
    if (therapist.admin) {
      getAllUnsignedAppointmentNotes().then(setUnsignedNotes);
    }
    if (therapist.supervisor) {
      getUnsignedAppointmentNotesSuperVisor(therapist.therapistId).then(
        setUnsignedNotes,
      );
    } else {
      getUnsignedAppointmentNotesTherapist(therapist.therapistId).then(
        setUnsignedNotes,
      );
    }
  }, [therapist.admin, therapist.supervisor]);

  return (
    <>
      <div className="sidebar-main">
        <Link passHref href="/">
          Calendar
        </Link>
        <Link passHref href="/clients">
          Clients
        </Link>
        {therapist.admin ? (
          <Link passHref href="/supervisors">
            Supervisors
          </Link>
        ) : (
          ''
        )}
        {therapist?.admin || therapist.supervisor ? (
          <Link passHref href="/therapists">
            Therapists
          </Link>
        ) : (
          ''
        )}
        {therapist?.supervisor ? (
          <Link passHref href="/supervisees">
            Supervisees
          </Link>
        ) : (
          ''
        )}
        <div>
          <Link passHref href="/unsignednotes">
            Unsigned Notes
          </Link>
          <p className="badge">{unsignedNotes.length}</p>
        </div>
        <Link passHref href="/reminders">
          Reminders
        </Link>
        <Link passHref href="/settings">
          Settings
        </Link>
      </div>
    </>
  );
}
