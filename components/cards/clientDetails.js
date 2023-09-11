import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTherapistByTherapistId } from '../../utils/databaseCalls/therapistData';
import OpenClientModalContext from '../../utils/context/openClientModalContext';
import {
  getClientsByTherapistId,
  updateClient,
} from '../../utils/databaseCalls/clientData';
import TherapistClientsContext from '../../utils/context/therapistClientsContext';

export default function ClientDetailsCard({ clientObj, page }) {
  const [clientTherapist, setClientTherapist] = useState({});
  const { setTherapistClients } = useContext(TherapistClientsContext);
  const { setOpenClientModal, setEditingClient } = useContext(
    OpenClientModalContext,
  );

  const handleEdit = () => {
    setEditingClient(clientObj);
    setOpenClientModal(true);
  };

  const handleActive = async (e) => {
    if (clientObj.active && e.target.value === 'inactive') {
      if (
        window.confirm(
          `Make ${clientObj.firstName} ${clientObj.lastName} inactive?`,
        )
      ) {
        await updateClient({ clientId: clientObj.clientId, active: false });
        getClientsByTherapistId(clientObj.therapistId).then(
          setTherapistClients,
        );
      }
    } else if (!clientObj.active && e.target.value === 'active') {
      if (
        window.confirm(
          `Make ${clientObj.firstName} ${clientObj.lastName} inactive?`,
        )
      ) {
        await updateClient({ clientId: clientObj.clientId, active: true });
        getClientsByTherapistId(clientObj.therapistId).then(
          setTherapistClients,
        );
      }
    }
  };

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
        <div
          className={
            page === 'clients'
              ? 'contact-and-clinician-clients'
              : 'contact-and-clinician-client'
          }
        >
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
              <div>
                <Link
                  passHref
                  href={`/client/${clientObj.clientId}`}
                  className="client-name"
                >
                  <p className="client-name">
                    {clientObj.firstName} {clientObj.lastName}
                  </p>
                </Link>
                <button
                  type="button"
                  className="client-nav-link edit-clients-page"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
            </>
          )}
          <div>
            <p className="c-and-c-item">Phone: {clientObj.phone}</p>
            <p href={`mailTo:${clientObj.email}`} className="c-and-c-item">
              Email: {clientObj.email}
            </p>
          </div>
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
          {page === 'clients' ? (
            <select onChange={handleActive} className="active-select">
              <option value="active" defaultValue={`${clientObj.active}`}>
                {clientObj.active ? 'Active' : 'Mark Active'}
              </option>
              <option value="inactive" selected={!clientObj.active}>
                {clientObj.active ? 'Mark Inactive' : 'Inactive'}
              </option>
            </select>
          ) : (
            ''
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
    active: PropTypes.bool,
  }).isRequired,
  page: PropTypes.string.isRequired,
};
