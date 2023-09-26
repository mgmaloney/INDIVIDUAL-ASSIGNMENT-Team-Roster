/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import OpenAptModalContext from '../utils/context/selectedAptContext';

export default function UpcomingAppointments({ apts }) {
  const [upcomingApts, setUpcomingApts] = useState([]);
  const { setOpenModal, setSelectedApt } = useContext(OpenAptModalContext);

  const sortAndShowUpcoming = () => {
    const filterAppointments = [...apts];
    const upcomingAppointments = filterAppointments.filter(
      (apt) => Date.now() < Date.parse(apt.start),
    );
    upcomingAppointments.sort(
      (a, b) => Date.parse(b.start) - Date.parse(a.start),
    );
    const nextFiveApts = upcomingAppointments.slice(0, 5);
    setUpcomingApts(nextFiveApts);
  };

  useEffect(() => {
    sortAndShowUpcoming();
  }, [apts]);

  return (
    <>
      <div className="upcoming-apts">
        <p className="side-component-label">Upcoming Appointments: </p>
        {upcomingApts.length > 0 &&
          upcomingApts?.map((apt) => (
            <p
              className="client-nav-link upcoming-apt-link"
              onClick={() => {
                setOpenModal(true);
                setSelectedApt(apt);
              }}
            >
              {format(new Date(apt.start), 'MM/dd/yyyy H:mm a')}
            </p>
          ))}
        {upcomingApts.length === 0 ? (
          <>
            <p className="upcoming-apt">No Upcoming Appointments</p>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

UpcomingAppointments.propTypes = {
  apts: PropTypes.arrayOf(
    PropTypes.shape({
      appointmentId: PropTypes.string,
      title: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
      length: PropTypes.number,
      therapistId: PropTypes.string,
      clientId: PropTypes.string,
      type: PropTypes.string,
    }),
  ).isRequired,
};
