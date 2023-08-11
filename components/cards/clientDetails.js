import Link from 'next/link';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTherapistByTherapistId } from '../../utils/databaseCalls/therapistData';

export default function ClientDetailsCard({ clientObj }) {
  const [clientTherapist, setClientTherapist] = useState({});

  useEffect(() => {
    getTherapistByTherapistId(clientObj.therapistId).then(setClientTherapist);
  }, [clientObj]);

  return (
    <>
      <div className="client-card">
        <Link
          passHref
          href={`/client/${clientObj.clientId}`}
          className="client-card-name"
        >
          <p className="client-card-name">
            {clientObj.firstName} {clientObj.lastName}
          </p>
        </Link>
        <div className="contact-and-clinician">
          <p className="c-and-c-item">{clientObj.phone}</p>
          <p className="c-and-c-item">{clientObj.email}</p>
          <p className="c-and-c-item">
            Clinician: {clientTherapist.firstName} {clientTherapist.lastName}
          </p>
        </div>
      </div>
    </>
  );
}

ClientDetailsCard.propTypes = {
  clientObj: PropTypes.shape({
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
};
