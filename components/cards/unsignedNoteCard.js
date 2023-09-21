/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { getClientByClientId } from '../../utils/databaseCalls/clientData';
import TherapistContext from '../../utils/context/therapistContext';
import { getTherapistByTherapistId } from '../../utils/databaseCalls/therapistData';

export default function UnsignedNoteCard({ noteObj }) {
  const { therapist } = useContext(TherapistContext);
  const router = useRouter();
  const [client, setClient] = useState({});
  const [clinician, setClinician] = useState({});
  const [supervisor, setSupervisor] = useState({});

  useEffect(() => {
    getClientByClientId(noteObj.clientId).then(setClient);
  }, [noteObj.clientId]);

  useEffect(() => {
    if (therapist.admin) {
      getTherapistByTherapistId(noteObj.therapistId).then(setClinician);
      getTherapistByTherapistId(noteObj.supervisorId).then(setSupervisor);
    }
  }, [therapist.admin, noteObj]);

  const handleClick = () => {
    router.push(`/client/progressnote/edit/${noteObj.noteId}`);
  };

  return (
    <>
      <div className="unsigned-note-card">
        <p className="unsigned-note-details" onClick={handleClick}>
          <strong>
            {client.firstName} {client.lastName}
          </strong>{' '}
          <span className="unsigned-date">
            {format(new Date(noteObj.dateTime), 'MM/dd/yyyy H:mm a')}
          </span>
        </p>

        <div className="unsigned-providers">
          <div className="unsigned-status">
            {therapist.admin ? (
              <div className="prov-sig">
                <p>
                  <strong>Clinician:</strong> {clinician.firstName}{' '}
                  {clinician.lastName}{' '}
                </p>
                <div className="sig">
                  {noteObj.signedByTherapist ? (
                    <p>
                      <strong>Signed</strong>
                    </p>
                  ) : (
                    <p>
                      <em>Signature Needed</em>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="unsigned-status-supervisor">
            {therapist.admin ? (
              <div className="prov-sig">
                <p>
                  <strong>Supervisor:</strong> {supervisor.firstName}{' '}
                  {supervisor.lastName}{' '}
                </p>

                {noteObj.signedByTherapist ? (
                  ''
                ) : (
                  <div className="sig">
                    <p>
                      <em>Waiting on Therapist Signature.</em>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
}

UnsignedNoteCard.propTypes = {
  noteObj: PropTypes.shape({
    noteId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    appointmentId: PropTypes.string,
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    supervisorId: PropTypes.string,
    signedByTherapist: PropTypes.bool,
    signedBySupervisor: PropTypes.bool,
    sharedWithSupervisor: PropTypes.bool,
    content: PropTypes.shape({
      D: PropTypes.string,
      A: PropTypes.string,
      P: PropTypes.string,
      chartNote: PropTypes.string,
    }),
    dateTime: PropTypes.string,
  }).isRequired,
};
