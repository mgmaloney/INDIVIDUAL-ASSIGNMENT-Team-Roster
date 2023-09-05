import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OpenTherapistModalContext from '../../utils/context/openTherapistModalContext';
import { getSingleSupervisor } from '../../utils/databaseCalls/supervisorData';

export default function TherapistCard({ therapistObj }) {
  const { setEditingTherapist, setOpenTherapistModal } = useContext(
    OpenTherapistModalContext,
  );
  const [therapistSupervisor, setTherapistSupervisor] = useState({});

  useEffect(() => {
    getSingleSupervisor(therapistObj.supervisorId).then(setTherapistSupervisor);
  }, [therapistObj.supervisorId]);

  const handleEdit = () => {
    setEditingTherapist(therapistObj);
    setOpenTherapistModal(true);
  };

  return (
    <>
      <div className="therapist-card">
        <div className="name-edit">
          <Link
            passHref
            href={`/therapist/${therapistObj.therapistId}`}
            className="therapist-name"
          >
            <p className="therapist-name">
              {therapistObj.firstName} {therapistObj.lastName}
            </p>
          </Link>
          <button
            type="button"
            className="therapist-nav-link edit-therapists-page"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
        <div className="therapist-email">
          <p>
            <a href={`mailto: ${therapistObj.email}`}>{therapistObj.email}</a>
          </p>
          {therapistObj.supervisorId && (
            <Link
              passHref
              href={`supervisors/${therapistSupervisor?.supervisorId}`}
            >
              {`Supervisor: ${therapistSupervisor?.firstName} ${therapistSupervisor?.lastName}`}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

TherapistCard.propTypes = {
  therapistObj: PropTypes.shape({
    therapistId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    supervisorId: PropTypes.string,
  }).isRequired,
};
