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
            <>
              <Link
                passHref
                href={`/client/${clientObj.clientId}`}
                className="client-name"
              >
                <p className="client-name">
                  {clientObj.firstName} {clientObj.lastName}
                </p>
              </Link>
              <Link passHref href={`/client/edit/${clientObj.clientId}`}>
                Edit
              </Link>
            </>
          )}
          <p className="c-and-c-item">Phone: {clientObj.phone}</p>
          <p href={`mailTo:${clientObj.email}`} className="c-and-c-item">
            Email: {clientObj.email}
          </p>
          {page !== 'clients' ? (
            <>
              <div className="address">
                <p className="address-item">Address: {clientObj.address1} </p>
                {clientObj.address2 ? (
                  <p className="address-item address2">{clientObj.address2} </p>
                ) : (
                  ''
                )}
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
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipcode: PropTypes.string,
    sex: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  page: PropTypes.string.isRequired,
};
