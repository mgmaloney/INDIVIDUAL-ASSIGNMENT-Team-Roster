import Link from 'next/link';
import { useContext } from 'react';
import TherapistContext from '../utils/context/therapistContext';

export default function SideBar() {
  const { therapist } = useContext(TherapistContext);

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
        {therapist.admin || therapist.supervisor ? (
          <Link passHref href="/therapists">
            Therapists
          </Link>
        ) : (
          ''
        )}
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
