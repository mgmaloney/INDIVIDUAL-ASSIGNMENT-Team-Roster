/* eslint-disable global-require */
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import OpenAptModalContext from '../utils/context/selectedAptContext';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarComp({ setSelectedCalDate, appointments }) {
  const { setOpenModal, setSelectedApt } = useContext(OpenAptModalContext);
  const [formattedDateApts, setFormattedDateApts] = useState([]);

  useEffect(() => {
    const formattedApts = appointments.map((appointment) => ({
      ...appointment,
      start: new Date(appointment.start),
      end: new Date(appointment.start),
    }));
    setFormattedDateApts(formattedApts);
  }, [appointments]);

  return (
    <>
      <div className="calendar">
        <Calendar
          localizer={localizer}
          events={formattedDateApts.length > 0 ? formattedDateApts : []}
          startAccessor={(event) => new Date(event.start)}
          endAccessor="end"
          style={{ height: 500, margin: '50px' }}
          selectable
          onSelectSlot={(slotInfo) => {
            setSelectedCalDate(slotInfo.slots[0]);
            setOpenModal(true);
          }}
          onSelectEvent={(appointment) => {
            setSelectedApt(appointment);
            setOpenModal(true);
          }}
        />
      </div>
    </>
  );
}

CalendarComp.propTypes = {
  setSelectedCalDate: PropTypes.func.isRequired,
  appointments: PropTypes.shape([]).isRequired,
};
