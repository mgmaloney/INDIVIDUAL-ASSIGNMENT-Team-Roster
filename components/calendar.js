/* eslint-disable global-require */
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OpenAptModalContext from '../utils/context/selectedAptContext';
import {
  getAllTherapists,
  getSupervisees,
} from '../utils/databaseCalls/therapistData';
import TherapistContext from '../utils/context/therapistContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const { therapist } = useContext(TherapistContext);
  const { setOpenModal, setSelectedApt } = useContext(OpenAptModalContext);
  const [formattedApts, setFormattedApts] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapistIds, setSelectedTherapistsIds] = useState([]);
  const [supervisees, setSuperVisees] = useState([]);

  useEffect(() => {
    if (therapist.supervisor) {
      getSupervisees(therapist.therapistId).then(setSuperVisees);
    }
  }, [therapist.therapistId, therapist.supervisor]);

  useEffect(() => {
    const dateFormattedApts = appointments.map((appointment) => ({
      ...appointment,
      start: new Date(appointment.start),
      end: new Date(appointment.start),
    }));
    const selectedTherapistApts = [];
    dateFormattedApts.forEach((appointment) => {
      selectedTherapistIds.forEach((therapistId) => {
        if (appointment.therapistId === therapistId) {
          selectedTherapistApts.push(appointment);
        }
      });
    });
    const privacyScreened = [];
    if (therapist.admin) {
      setFormattedApts(selectedTherapistApts);
    } else if (!therapist.admin && therapist.supervisor) {
      selectedTherapistApts.forEach((appointment) => {
        const isSuperviseeApt = supervisees.find(
          (searchingSupervisee) =>
            appointment.therapistId === searchingSupervisee.therapistId,
        );
        if (
          isSuperviseeApt ||
          appointment.therapistId === therapist.therapistId
        ) {
          privacyScreened.push(appointment);
        } else {
          const nonSuperviseeOrSupervisor = therapists.find(
            (searchedTherapist) =>
              searchedTherapist.therapistId === appointment.therapistId,
          );
          if (nonSuperviseeOrSupervisor) {
            privacyScreened.push({
              ...appointment,
              title: `${nonSuperviseeOrSupervisor.firstName[0]}${nonSuperviseeOrSupervisor.lastName[0]}: Session`,
            });
          }
        }
      });
      setFormattedApts(privacyScreened);
    } else {
      selectedTherapistApts.forEach((appointment) => {
        if (appointment.therapistId === therapist.therapistId) {
          privacyScreened.push(appointment);
        }
        const nonSuperviseeOrSupervisor = therapists.find(
          (searchedTherapist) =>
            searchedTherapist.therapistId === appointment.therapistId,
        );
        privacyScreened.push({
          ...appointment,
          title: `${nonSuperviseeOrSupervisor.firstName[0]}${nonSuperviseeOrSupervisor.lastName[0]}: Session`,
        });
      });
      setFormattedApts(privacyScreened);
    }
  }, [appointments, selectedTherapistIds, therapists, therapist, supervisees]);

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  const [therapistName, setTherapistName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTherapistName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    const therapistIds = [];
    therapistName.forEach((name) => {
      therapists.forEach((therapistObj) => {
        if (`${therapistObj.firstName} ${therapistObj.lastName}` === name) {
          therapistIds.push(therapistObj.therapistId);
        }
      });
    });
    setSelectedTherapistsIds(therapistIds);
  }, [therapistName, therapists]);

  return (
    <>
      <div className="calendar">
        <div className="provider-filters">
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              Provider:{' '}
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={therapistName}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {therapists.map((therapistItem) => (
                <MenuItem
                  key={therapistItem.therapistId}
                  id={therapistItem.therapistId}
                  value={`${therapistItem.firstName} ${therapistItem.lastName}`}
                >
                  <Checkbox
                    checked={
                      therapistName.indexOf(
                        `${therapistItem.firstName} ${therapistItem.lastName}`,
                      ) > -1
                    }
                  />
                  <ListItemText
                    primary={`${therapistItem.firstName} ${therapistItem.lastName}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Calendar
          localizer={localizer}
          events={formattedApts.length > 0 ? formattedApts : []}
          startAccessor={(event) => new Date(event?.start)}
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
