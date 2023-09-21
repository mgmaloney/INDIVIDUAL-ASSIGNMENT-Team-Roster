/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import {
  getAppointmentByAppointmentId,
  getAppointmentsByClientId,
} from '../../utils/databaseCalls/calendarData';
import { getNoteByAptId } from '../../utils/databaseCalls/noteData';

export default function AppointmentDetails({ noteObj }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState({});
  const [clientAppointments, setClientAppointments] = useState([]);
  const [prevApt, setPrevApt] = useState({});
  const [nextApt, setNextApt] = useState({});
  const [sortedApts, setSortedApts] = useState([]);

  useEffect(() => {
    getAppointmentByAppointmentId(noteObj.appointmentId).then(setAppointment);
  }, [noteObj.appointmentId]);

  useEffect(() => {
    getAppointmentsByClientId(noteObj.clientId).then(setClientAppointments);
  }, [noteObj.clientId]);

  useEffect(() => {
    setSortedApts(
      [...clientAppointments].sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
      ),
    );
  }, [clientAppointments]);

  const setPrevNextApt = () => {
    const currentAptIndex = sortedApts.findIndex(
      (aptToIndex) => aptToIndex.appointmentId === noteObj.appointmentId,
    );
    setPrevApt(sortedApts[currentAptIndex + 1]);
    setNextApt(sortedApts[currentAptIndex - 1]);
  };

  useEffect(() => {
    setPrevNextApt();
  }, [sortedApts, prevApt, nextApt, appointment]);

  const handlePrevClick = () => {
    getNoteByAptId(prevApt?.appointmentId).then((note) =>
      router.push(`/client/progressnote/edit/${note?.noteId}`),
    );
  };

  const handleNextClick = () => {
    getNoteByAptId(nextApt?.appointmentId).then((note) =>
      router.push(`/client/progressnote/edit/${note?.noteId}`),
    );
  };

  return (
    <>
      <div className="apt-details">
        <div className="current-apt-info">
          <h6 className="apt-info-header">Appointment Info</h6>
          <p>
            {appointment?.start &&
              format(new Date(appointment?.start), 'MMM d, yyyy')}
            <span className="apt-info-span">
              {appointment?.start &&
                format(new Date(appointment?.start), 'hh:mm a')}
            </span>{' '}
            -{' '}
            <span>
              {appointment?.start &&
                format(new Date(appointment?.end), 'hh:mm a')}
            </span>
          </p>
          <p>{appointment?.length} Min</p>
        </div>
        {nextApt && (
          <>
            <p className="next-prev-head">NEXT APPOINTMENT</p>
            <div className="next-apt" onClick={handleNextClick}>
              <div className="next-apt-info">
                <p>
                  {nextApt?.start &&
                    format(new Date(nextApt?.start), 'MMM d, yyyy')}
                  ,
                </p>
                <p>
                  {nextApt?.start &&
                    format(new Date(nextApt?.start), 'hh:mm a')}{' '}
                  -{nextApt?.start && format(new Date(nextApt?.end), 'hh:mm a')}
                </p>{' '}
              </div>
              <p className="apt-arrow">{`>`}</p>
            </div>
          </>
        )}
        {prevApt && (
          <>
            <p className="next-prev-head">PREVIOUS APPOINTMENT</p>
            <div className="prev-apt" onClick={handlePrevClick}>
              <div className="prev-apt-info">
                <p>
                  {prevApt?.start &&
                    format(new Date(prevApt?.start), 'MMM d, yyyy')}
                  ,
                </p>
                <p>
                  {prevApt?.start &&
                    format(new Date(prevApt?.start), 'hh:mm a')}{' '}
                  -{prevApt?.start && format(new Date(prevApt?.end), 'hh:mm a')}
                </p>{' '}
              </div>
              <p className="apt-arrow">{`>`}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

AppointmentDetails.propTypes = {
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
    content: PropTypes.shape({
      D: PropTypes.string,
      A: PropTypes.string,
      P: PropTypes.string,
      chartNote: PropTypes.string,
    }),
    dateTime: PropTypes.string,
  }).isRequired,
};
