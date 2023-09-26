import Link from 'next/link';
import { useContext } from 'react';
import TherapistContext from '../utils/context/therapistContext';
import UnsignedNotesContext from '../utils/context/unsignedNotesContext';

export default function SideBar() {
  const { therapist } = useContext(TherapistContext);
  const { unsignedNotes } = useContext(UnsignedNotesContext);

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
        {therapist?.admin ? (
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
        <div className="unsigned-notes">
          <Link passHref href="/unsignednotes">
            Unsigned Notes
          </Link>
          <div className="badge-div">
            <p className="badge">{unsignedNotes.length}</p>
          </div>
        </div>
        {/* <Link passHref href="/reminders">
          Reminders
        </Link>
        <Link passHref href="/settings">
          Settings
        </Link> */}
      </div>
    </>
  );
}
