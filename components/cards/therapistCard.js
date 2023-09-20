import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OpenTherapistModalContext from '../../utils/context/openTherapistModalContext';
import { getSingleSupervisor } from '../../utils/databaseCalls/supervisorData';
import { updateTherapist } from '../../utils/databaseCalls/therapistData';
import TherapistContext from '../../utils/context/therapistContext';

export default function TherapistCard({ therapistObj, onTherapistUpdate }) {
  const { therapist } = useContext(TherapistContext);
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

  const handleActive = async (e) => {
    if (therapistObj.active && e.target.value === 'inactive') {
      if (
        window.confirm(
          `Make ${therapistObj.firstName} ${therapistObj.lastName} inactive?`,
        )
      ) {
        await updateTherapist({
          therapistId: therapistObj.therapistId,
          active: false,
        });
        onTherapistUpdate();
      }
    } else if (!therapistObj.active && e.target.value === 'active') {
      if (
        window.confirm(
          `Make ${therapistObj.firstName} ${therapistObj.lastName} inactive?`,
        )
      ) {
        await updateTherapist({
          therapistId: therapistObj.therapistId,
          active: true,
        });
        onTherapistUpdate();
      }
    }
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
            <a href={`mailto:${therapistObj.email}`} className="email">
              {therapistObj.email}
            </a>
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
        {therapist.admin && (
          <div className="active-select-container">
            <select onChange={handleActive} className="active-select">
              <option value="active" selected={therapistObj.active}>
                {therapistObj.active ? 'Active' : 'Mark Active'}
              </option>
              <option value="inactive" selected={!therapistObj.active}>
                {therapistObj.active ? 'Mark Inactive' : 'Inactive'}
              </option>
            </select>
          </div>
        )}
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
    active: PropTypes.bool,
  }).isRequired,
  onTherapistUpdate: PropTypes.func.isRequired,
};
