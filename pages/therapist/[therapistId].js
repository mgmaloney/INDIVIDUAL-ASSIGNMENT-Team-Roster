import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  getSupervisees,
  getTherapistByTherapistId,
} from '../../utils/databaseCalls/therapistData';
import { getClientsByTherapistId } from '../../utils/databaseCalls/clientData';
import ClientsPage from '../clients';
import { getSingleSupervisor } from '../../utils/databaseCalls/supervisorData';

export default function ViewTherapist() {
  const router = useRouter();
  const { therapistId } = router.query;
  const [therapist, setTherapist] = useState();
  const [viewClients, setViewClients] = useState([]);
  const [supervisees, setSupervisees] = useState([]);
  const [therapistSupervisor, setTherapistSupervisor] = useState({});

  useEffect(() => {
    getTherapistByTherapistId(therapistId).then(setTherapist);
  }, [therapistId]);

  useEffect(() => {
    getClientsByTherapistId(therapistId).then(setViewClients);
  }, [therapistId]);

  useEffect(() => {
    if (!therapist?.supervisor) {
      getSingleSupervisor(therapist?.supervisorId).then(setTherapistSupervisor);
    }
  }, [therapist?.supervisorId]);

  useEffect(() => {
    if (therapist?.supervisor) {
      getSupervisees(therapist.therapistId).then(setSupervisees);
    }
  }, [therapist]);

  const renderAssignedClients = () => {
    if (viewClients.length > 0) {
      return <ClientsPage page="viewTherapist" viewClients={viewClients} />;
    }
    return <h2 className="list-header">No clients assigned</h2>;
  };

  return (
    <>
      <div className="view-therapist">
        <div className="main-therapist-overview">
          <div className="view-therapist-header">
            <div className="view-therapist-name-email">
              <h1>
                {therapist?.firstName} {therapist?.lastName}
              </h1>
              <p className="view-therapist-email">
                <a href={`mailto: ${therapist?.email}`}>{therapist?.email}</a>
              </p>
            </div>
            {therapist?.supervisor ? (
              <>
                <div className="is-supervisor-view-therapist">
                  <p>
                    <b>
                      <i>Supervisor</i>
                    </b>
                  </p>
                </div>
              </>
            ) : (
              <p>
                Supervisor: {therapistSupervisor?.firstName}{' '}
                {therapistSupervisor?.lastName}
              </p>
            )}
          </div>
          <div className="therapist-clients">{renderAssignedClients()}</div>
        </div>
        <div className="side-components">
          {therapist?.supervisor ? (
            <div className="side-component">
              <p className="side-component-label">Supervisees: </p>
              <div className="supervisees">
                {supervisees &&
                  supervisees.map((supervisee) => (
                    <div className="side-component-link">
                      <Link
                        passHref
                        href={`/therapist/${supervisee.therapistId}`}
                      >{`${supervisee.firstName} ${supervisee.lastName}`}</Link>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
}
