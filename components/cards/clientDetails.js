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
        <div className="contact-and-clinician">
          {page !== 'clients' ? (
            <>
              <div className="client-info-div">
                <h4 className="client-info">CLIENT INFO</h4>
                <button type="button" className="edit-client-info">
                  Edit
                </button>
              </div>
              <p className="c-and-c-item">Sex: {clientObj.sex}</p>
              <p className="c-and-c-item"> Gender: {clientObj.gender}</p>
            </>
          ) : (
            <Link
              passHref
              href={`/client/${clientObj.clientId}`}
              className="client-card-name"
            >
              <p className="client-card-name">
                {clientObj.firstName} {clientObj.lastName}
              </p>
            </Link>
          )}
          <p className="c-and-c-item">Phone: {clientObj.phone}</p>
          <p href={`mailTo:${clientObj.email}`} className="c-and-c-item">
            Email: {clientObj.email}
          </p>
          {page !== 'clients' ? (
            <>
              <p className="c-and-c-item">Address: {clientObj.address}</p>
              <div className="address">
                <p>
                  {clientObj.city}, {clientObj.state}, {clientObj.zipcode}
                </p>
              </div>
            </>
          ) : (
            ''
          )}
          {clientTherapist && (
            <p className="c-and-c-item">
              Clinician: {clientTherapist.firstName} {clientTherapist.lastName}
            </p>
          )}
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
    city: PropTypes.string,
    state: PropTypes.string,
    zipcode: PropTypes.string,
    sex: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  page: PropTypes.string.isRequired,
};
