import Link from 'next/link';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTherapistByTherapistId } from '../../utils/databaseCalls/therapistData';

export default function ClientDetailsCard({ clientObj, page }) {
  const [clientTherapist, setClientTherapist] = useState({});

  useEffect(() => {
    getTherapistByTherapistId(clientObj.therapistId).then(setClientTherapist);
  }, [clientObj]);

  return (
    <>
      <div
        className={
          page === 'clients' ? 'client-card-clients' : 'client-card-client'
        }
      >
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
          {page !== 'clients' ? (
            <>
              <div className="client-inf-div">
                <h4 className="client-info">CLIENT INFO</h4>
                <button type="button" className="edit-client-info">
                  Edit
                </button>
              </div>
              <p className="c-and-c-item">{clientObj.sex}</p>
              <p className="c-and-c-item">{clientObj.gender}</p>
            </>
          ) : (
            ''
          )}
          <p className="c-and-c-item">{clientObj.phone}</p>
          <p href={`mailTo:${clientObj.email}`} className="c-and-c-item">
            {clientObj.email}
          </p>
          {page !== 'clients' ? (
            <p className="c-and-c-item">{clientObj.address}</p>
          ) : (
            ''
          )}
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
    sex: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  page: PropTypes.string.isRequired,
};
