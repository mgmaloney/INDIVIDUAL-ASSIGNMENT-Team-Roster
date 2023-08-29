import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export default function UpcomingAppointments({ apts }) {
  const [upcomingApts, setUpcomingApts] = useState([]);

  const sortAndShowUpcoming = () => {
    const aptsArr = [...apts];
    aptsArr.sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
    const nextFiveApts = aptsArr.slice(0, 5);
    setUpcomingApts(nextFiveApts);
  };

  useEffect(() => {
    sortAndShowUpcoming();
  }, [apts]);

  return (
    <>
      <div className="upcoming-apts">
        <p className="upcoming-apts-label">Upcoming Appointments: </p>
        {upcomingApts.length > 0 &&
          upcomingApts?.map((apt) => (
            <p className="upcoming-apt client-nav-link">
              {format(new Date(apt.start), 'MM/dd/yyyy H:mm a')}
            </p>
          ))}
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
