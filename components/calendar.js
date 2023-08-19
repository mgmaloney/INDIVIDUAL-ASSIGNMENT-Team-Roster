/* eslint-disable global-require */
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React from 'react';
import PropTypes, { number } from 'prop-types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

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

export default function CalendarComp({
  openModal,
  setOpenModal,
  selectedCalDate,
  setSelectedCalDate,
  appointments,
}) {
  return (
    <>
      {appointments.length && (
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '50px' }}
            selectable
            onSelectSlot={(slotInfo) => {
              setSelectedCalDate(slotInfo.slots[0]);
              setOpenModal(true);
            }}
          />
          {console.warn(openModal, selectedCalDate)}
        </div>
      )}
    </>
  );
}

CalendarComp.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  selectedCalDate: PropTypes.string.isRequired,
  setSelectedCalDate: PropTypes.func.isRequired,
  appointments: PropTypes.shape({
    length: number,
  }).isRequired,
};
