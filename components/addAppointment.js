/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
import { styled, Box } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Autocomplete, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { addMinutes, addWeeks, isEqual } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import TherapistClientsContext from '../utils/context/therapistClientsContext';
import TherapistContext from '../utils/context/therapistContext';
import OpenAptModalContext from '../utils/context/selectedAptContext';
import {
  createAppointment,
  deleteAllAptsInSeriesAndSeries,
  deleteAppointment,
  getAllAppointmentsInSeries,
  updateAppointment,
} from '../utils/databaseCalls/calendarData';
import { getClientByClientId } from '../utils/databaseCalls/clientData';
import { getNoteByAptId, deleteNote } from '../utils/databaseCalls/noteData';
import {
  getAllTherapists,
  getTherapistByTherapistId,
} from '../utils/databaseCalls/therapistData';
import AppointmentsContext from '../utils/context/appointmentsContext';
import {
  createAptSeries,
  getAptSeries,
  updateAptSeries,
} from '../utils/databaseCalls/aptSeriesData';

const selectedAptDefaultState = {
  appointmentId: '',
  title: '',
  start: '',
  end: '',
  length: 50,
  clientId: '',
  therapistId: '',
  type: '',
};

const Backdrop = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  return <div className={clsx({}, className)} ref={ref} {...other} />;
});

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme) => ({
  width: 425,
  borderRadius: '12px',
  padding: '0px 20px 24px 20px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  color: '#267ccb',
  boxShadow: `0px 2px 24px ${
    theme.palette.mode === 'dark' ? '#000' : '#383838'
  }`,
});

export default function AddAppointment({ selectedCalDate }) {
  const { therapist } = useContext(TherapistContext);
  const { therapistClients } = useContext(TherapistClientsContext);
  const { onAptUpdate } = useContext(AppointmentsContext);
  const { openModal, setOpenModal, selectedApt, setSelectedApt } =
    useContext(OpenAptModalContext);
  const [therapists, setTherapists] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [aptRadio, setAptRadio] = useState('client');
  const [selectedClientObj, setSelectedClientObj] = useState({});
  const [selectedTherapistObj, setSelectedTherapistObj] = useState({});
  const [aptName, setAptName] = useState('');
  const [length, setLength] = useState(50);
  const [isRecurring, setIsRecurring] = useState(false);
  const [aptNote, setAptNote] = useState({});
  const [frequency, setFrequency] = useState(1);
  const [events, setEvents] = useState(1);
  const [aptSeries, setAptSeries] = useState({});

  const handleClose = () => {
    setOpenModal(false);
    if (setSelectedApt) {
      setSelectedApt(selectedAptDefaultState);
      setSelectedClientObj({});
      setEvents(1);
      setFrequency(1);
      setIsRecurring(false);
    }
  };

  useEffect(() => {
    const activeCts = [];
    therapistClients.forEach((client) => {
      if (client.active) {
        activeCts.push(client);
      }
    });
    setActiveClients(activeCts);
  }, [therapistClients]);

  useEffect(() => {
    if (selectedApt.appointmentId) {
      setStartDate(new Date(selectedApt.start));
      setEndDate(new Date(selectedApt.end));
      setAptRadio(selectedApt.type);
      setAptName(selectedApt.title);
      setLength(selectedApt.length);
    }
  }, [
    selectedApt.appointmentId,
    selectedApt.start,
    selectedApt.end,
    selectedApt.type,
    selectedApt.title,
    selectedApt.length,
  ]);

  useEffect(() => {
    if (selectedApt.aptSeriesId) {
      setIsRecurring(true);
    }
  }, [selectedApt.aptSeriesId]);

  useEffect(() => {
    if (selectedApt?.clientId) {
      getClientByClientId(selectedApt.clientId).then(setSelectedClientObj);
    }
  }, [selectedApt?.clientId]);

  useEffect(() => {
    if (selectedApt?.therapistId) {
      getTherapistByTherapistId(selectedApt.therapistId).then(
        setSelectedTherapistObj,
      );
    }
  }, [therapist?.admin, selectedApt?.therapistId]);

  useEffect(() => {
    setStartDate(selectedCalDate);
  }, [selectedCalDate]);

  // sets the endDate by adding minutes to the startDate
  // based on the state of both length and start date
  useEffect(() => {
    setEndDate(addMinutes(startDate, length));
  }, [startDate, length]);

  // creates an appointment name with First name and last initial
  useEffect(() => {
    if (selectedClientObj?.lastName) {
      const { lastName } = selectedClientObj;
      const lastNameLetter = lastName?.charAt();
      const aptNam = `${selectedClientObj.firstName} ${lastNameLetter}.`;
      setAptName(aptNam);
    }
  }, [selectedClientObj]);

  useEffect(() => {
    if (selectedApt?.appointmentId) {
      getNoteByAptId(selectedApt.appointmentId).then(setAptNote);
    }
  }, [selectedApt?.appointmentId]);

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  useEffect(() => {
    if (selectedApt.aptSeriesId) {
      getAptSeries(selectedApt.aptSeriesId).then(setAptSeries);
    }
  }, [selectedApt, selectedApt.appointmentId, selectedApt.aptSeriesId]);

  useEffect(() => {
    setEvents(aptSeries.instances);
    setFrequency(aptSeries.frequency);
  }, [aptSeries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedApt?.appointmentId && therapist.admin) {
      const payload = {
        appointmentId: selectedApt.appointmentId,
        title: aptName,
        start: startDate,
        end: endDate,
        length,
        therapistId: selectedTherapistObj.therapistId,
        clientId: selectedClientObj.clientId,
        type: aptRadio,
      };
      if (isRecurring && !selectedApt.aptSeriesId) {
        const seriesPayload = {
          frequency,
          instances: events,
          startDate,
        };
        const aptSeriesId = await createAptSeries(seriesPayload);
        await updateAppointment({ ...payload, aptSeriesId, seriesInstance: 1 });
        const { appointmentId, ...payloadWithoutAptId } = payload;
        const seriesAptPromises = [];
        for (let i = 1; i <= events; i++) {
          const aptPayload = {
            ...payloadWithoutAptId,
            aptSeriesId,
            seriesInstance: i + 1,
            start: addWeeks(startDate, i * frequency),
            end: addWeeks(endDate, i * frequency),
          };
          const aptPromise = new Promise((resolve, reject) => {
            createAppointment(aptPayload).then(resolve).catch(reject);
          });
          seriesAptPromises.push(aptPromise);
        }
        Promise.all(seriesAptPromises)
          .then((response) => console.warn(response))
          .catch((error) => console.warn(error));
        handleClose();
        onAptUpdate();
      } else if (isRecurring && selectedApt.aptSeriesId) {
        if (
          !isEqual(selectedApt.start, startDate) ||
          selectedApt.length !== length ||
          frequency !== aptSeries.frequency ||
          events !== aptSeries.instances
        ) {
          const updatedSeriesPayload = {
            ...aptSeries,
            frequency,
            instances: events,
          };
          await updateAptSeries(updatedSeriesPayload);
          const seriesAptPromises = [];
          const updatedAptPayload = {
            ...selectedApt,
            start: startDate,
            end: endDate,
            length,
          };
          await updateAppointment(updatedAptPayload);
          const seriesApts = await getAllAppointmentsInSeries(
            selectedApt.aptSeriesId,
          );
          let j = selectedApt.seriesInstance;
          let k = 1;
          seriesApts.forEach(async (apt) => {
            if (aptSeries.instances === events) {
              if (
                apt.seriesInstance > selectedApt.seriesInstance &&
                j <= aptSeries.instances
              ) {
                const aptPayload = {
                  ...apt,
                  start: addWeeks(updatedAptPayload.start, j * frequency),
                  end: addWeeks(updatedAptPayload.end, j * frequency),
                  length,
                };
                const aptPromise = new Promise((resolve, reject) => {
                  updateAppointment(aptPayload).then(resolve).catch(reject);
                });
                seriesAptPromises.push(aptPromise);
                j += 1;
              }
            } else if (
              aptSeries.instances !== events &&
              selectedApt.seriesInstance === 1
            ) {
              console.warn('this is running');
              if (apt.seriesInstance > events) {
                console.warn('deleting');
                await deleteAppointment(apt.appointmentId);
              } else if (
                apt.seriesInstance > selectedApt.seriesInstance &&
                j <= events
              ) {
                const aptPayload = {
                  ...apt,
                  start: addWeeks(updatedAptPayload.start, j * frequency),
                  end: addWeeks(updatedAptPayload.end, j * frequency),
                };
                updateAppointment(aptPayload).then((j += 1));
              }
            } else if (
              aptSeries.instances !== events &&
              selectedApt.seriesInstance > 1
            ) {
              console.warn('this is running');
              if (apt.seriesInstance > events) {
                console.warn('deleting');
                await deleteAppointment(apt.appointmentId);
              } else if (
                apt.seriesInstance > selectedApt.seriesInstance &&
                k <= events
              ) {
                const aptPayload = {
                  ...apt,
                  start: addWeeks(updatedAptPayload.start, k * frequency),
                  end: addWeeks(updatedAptPayload.end, k * frequency),
                };
                updateAppointment(aptPayload).then((k += 1));
              }
            }
          });
          const { appointmentId, ...restOfPayload } = updatedAptPayload;
          if (selectedApt.seriesInstance === 1) {
            while (j < events) {
              const aptPayload = {
                ...restOfPayload,
                start: addWeeks(updatedAptPayload.start, j * frequency),
                end: addWeeks(updatedAptPayload.end, j * frequency),
                seriesInstance: j + 1,
                length,
              };
              const aptPromise = new Promise((resolve, reject) => {
                createAppointment(aptPayload).then(resolve).catch(reject);
              });
              seriesAptPromises.push(aptPromise);
              j += 1;
            }
          } else if (selectedApt.seriesInstance > 1) {
            while (k + 1 < events) {
              const aptPayload = {
                ...restOfPayload,
                start: addWeeks(updatedAptPayload.start, k * frequency),
                end: addWeeks(updatedAptPayload.end, k * frequency),
                seriesInstance: k + 2,
                length,
              };
              const aptPromise = new Promise((resolve, reject) => {
                createAppointment(aptPayload).then(resolve).catch(reject);
              });
              seriesAptPromises.push(aptPromise);
              k += 1;
            }
          }
          Promise.all(seriesAptPromises)
            .then((response) => console.warn(response))
            .catch((error) => console.warn(error));
          handleClose();
          onAptUpdate();
        }
      } else if (!isRecurring) {
        await updateAppointment(payload);
        handleClose();
        onAptUpdate();
      }
    } else if (selectedApt?.appointmentId && !therapist.admin) {
      const payload = {
        appointmentId: selectedApt.appointmentId,
        title: aptName,
        start: startDate,
        end: endDate,
        length,
        therapistId: therapist.therapistId,
        clientId: selectedClientObj.clientId,
        type: aptRadio,
      };
      if (isRecurring && !selectedApt.aptSeriesId) {
        const seriesPayload = {
          frequency,
          instances: events,
          startDate,
        };
        const aptSeriesId = await createAptSeries(seriesPayload);
        await updateAppointment({ ...payload, aptSeriesId, seriesInstance: 1 });
        const { appointmentId, ...payloadWithoutAptId } = payload;
        const seriesAptPromises = [];
        for (let i = 1; i <= events; i++) {
          const aptPayload = {
            ...payloadWithoutAptId,
            aptSeriesId,
            seriesInstance: i + 1,
            start: addWeeks(startDate, i * frequency),
            end: addWeeks(endDate, i * frequency),
          };
          const aptPromise = new Promise((resolve, reject) => {
            createAppointment(aptPayload).then(resolve).catch(reject);
          });
          seriesAptPromises.push(aptPromise);
        }
        Promise.all(seriesAptPromises)
          .then((response) => console.warn(response))
          .catch((error) => console.warn(error));
        handleClose();
        onAptUpdate();
      } else if (isRecurring && selectedApt.aptSeriesId) {
        if (
          !isEqual(selectedApt.start, startDate) ||
          selectedApt.length !== length ||
          frequency !== aptSeries.frequency ||
          events !== aptSeries.instances
        ) {
          const updatedSeriesPayload = {
            ...aptSeries,
            frequency,
            instances: events,
          };
          await updateAptSeries(updatedSeriesPayload);
          const seriesAptPromises = [];
          const updatedAptPayload = {
            ...selectedApt,
            start: startDate,
            end: endDate,
            length,
          };
          await updateAppointment(updatedAptPayload);
          const seriesApts = await getAllAppointmentsInSeries(
            selectedApt.aptSeriesId,
          );
          let j = selectedApt.seriesInstance;
          let k = 1;
          seriesApts.forEach(async (apt) => {
            if (aptSeries.instances === events) {
              if (
                apt.seriesInstance > selectedApt.seriesInstance &&
                j <= aptSeries.instances
              ) {
                const aptPayload = {
                  ...apt,
                  start: addWeeks(updatedAptPayload.start, j * frequency),
                  end: addWeeks(updatedAptPayload.end, j * frequency),
                  length,
                };
                const aptPromise = new Promise((resolve, reject) => {
                  updateAppointment(aptPayload).then(resolve).catch(reject);
                });
                seriesAptPromises.push(aptPromise);
                j += 1;
              }
            } else if (
              aptSeries.instances !== events &&
              selectedApt.seriesInstance === 1
            ) {
              console.warn('this is running');
              if (apt.seriesInstance > events) {
                console.warn('deleting');
                await deleteAppointment(apt.appointmentId);
              } else if (
                apt.seriesInstance > selectedApt.seriesInstance &&
                j <= events
              ) {
                const aptPayload = {
                  ...apt,
                  start: addWeeks(updatedAptPayload.start, j * frequency),
                  end: addWeeks(updatedAptPayload.end, j * frequency),
                };
                updateAppointment(aptPayload).then((j += 1));
              }
            } else if (
              aptSeries.instances !== events &&
              selectedApt.seriesInstance > 1
            ) {
              console.warn('this is running');
              if (apt.seriesInstance > events) {
                console.warn('deleting');
                await deleteAppointment(apt.appointmentId);
              } else if (
                apt.seriesInstance > selectedApt.seriesInstance &&
                k <= events
              ) {
                const aptPayload = {
                  ...apt,
                  start: addWeeks(updatedAptPayload.start, k * frequency),
                  end: addWeeks(updatedAptPayload.end, k * frequency),
                };
                updateAppointment(aptPayload).then((k += 1));
              }
            }
          });
          const { appointmentId, ...restOfPayload } = updatedAptPayload;
          if (selectedApt.seriesInstance === 1) {
            while (j < events) {
              const aptPayload = {
                ...restOfPayload,
                start: addWeeks(updatedAptPayload.start, j * frequency),
                end: addWeeks(updatedAptPayload.end, j * frequency),
                seriesInstance: j + 1,
                length,
              };
              const aptPromise = new Promise((resolve, reject) => {
                createAppointment(aptPayload).then(resolve).catch(reject);
              });
              seriesAptPromises.push(aptPromise);
              j += 1;
            }
          } else if (selectedApt.seriesInstance > 1) {
            while (k + 1 < events) {
              const aptPayload = {
                ...restOfPayload,
                start: addWeeks(updatedAptPayload.start, k * frequency),
                end: addWeeks(updatedAptPayload.end, k * frequency),
                seriesInstance: k + 2,
                length,
              };
              const aptPromise = new Promise((resolve, reject) => {
                createAppointment(aptPayload).then(resolve).catch(reject);
              });
              seriesAptPromises.push(aptPromise);
              k += 1;
            }
          }
          Promise.all(seriesAptPromises)
            .then((response) => console.warn(response))
            .catch((error) => console.warn(error));
          handleClose();
          onAptUpdate();
        }
      } else if (!isRecurring) {
        await updateAppointment(payload);
        handleClose();
        onAptUpdate();
      }
    } else if (!therapist.admin && !isRecurring) {
      const payload = {
        title: aptName,
        start: startDate,
        end: endDate,
        length,
        therapistId: therapist.therapistId,
        clientId: selectedClientObj.clientId,
        type: aptRadio,
      };
      await createAppointment(payload);
      handleClose();
      onAptUpdate();
    } else if (therapist.admin && !isRecurring) {
      const payload = {
        title: aptName,
        start: startDate,
        end: endDate,
        length,
        therapistId: selectedTherapistObj.therapistId,
        clientId: selectedClientObj.clientId,
        type: aptRadio,
      };
      await createAppointment(payload);
      handleClose();
      onAptUpdate();
    } else if (
      !selectedApt.appointmentId &&
      !selectedApt.aptSeriesId &&
      therapist.admin &&
      isRecurring
    ) {
      const payload = {
        title: aptName,
        start: startDate,
        end: endDate,
        length,
        therapistId: selectedTherapistObj.therapistId,
        clientId: selectedClientObj.clientId,
        type: aptRadio,
      };
      const seriesPayload = {
        frequency,
        instances: events,
        startDate,
      };
      const aptSeriesId = await createAptSeries(seriesPayload);
      await createAppointment({ ...payload, aptSeriesId, seriesInstance: 1 });
      const seriesAptPromises = [];
      for (let i = 1; i < events; i++) {
        const aptPayload = {
          ...payload,
          aptSeriesId,
          seriesInstance: i + 1,
          start: addWeeks(startDate, i * frequency),
          end: addWeeks(endDate, i * frequency),
        };
        const aptPromise = new Promise((resolve, reject) => {
          createAppointment(aptPayload).then(resolve).catch(reject);
        });
        seriesAptPromises.push(aptPromise);
      }
      Promise.all(seriesAptPromises)
        .then((response) => console.warn(response))
        .catch((error) => console.warn(error));
      handleClose();
      onAptUpdate();
    } else if (!therapist.admin && isRecurring) {
      const payload = {
        title: aptName,
        start: startDate,
        end: endDate,
        length,
        therapistId: therapist.therapistId,
        clientId: selectedClientObj.clientId,
        type: aptRadio,
      };
      const seriesPayload = {
        frequency,
        instances: events,
        startDate,
      };
      const aptSeriesId = await createAptSeries(seriesPayload);
      await createAppointment({ ...payload, aptSeriesId, seriesInstance: 1 });
      const seriesAptPromises = [];
      for (let i = 1; i < events; i++) {
        const aptPayload = {
          ...payload,
          aptSeriesId,
          seriesInstance: i + 1,
          start: addWeeks(startDate, i * frequency),
          end: addWeeks(endDate, i * frequency),
        };
        const aptPromise = new Promise((resolve, reject) => {
          createAppointment(aptPayload).then(resolve).catch(reject);
        });
        seriesAptPromises.push(aptPromise);
      }
      Promise.all(seriesAptPromises)
        .then((response) => console.warn(response))
        .catch((error) => console.warn(error));
      handleClose();
      onAptUpdate();
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete this appointment?`)) {
      if (selectedApt.aptSeriesId) {
        if (
          window.confirm(
            'This is appointment is part of a series. Deleting it will delete all appointments in the series. Continue?',
          )
        ) {
          await deleteAllAptsInSeriesAndSeries(selectedApt.aptSeriesId);
        }
      }
      if (!aptNote) {
        await deleteAppointment(selectedApt.appointmentId);
        handleClose();
        onAptUpdate();
      } else if (
        aptNote.content.D === '' &&
        aptNote.content.A === '' &&
        aptNote.content.P === ''
      ) {
        await deleteAppointment(selectedApt.appointmentId);
        await deleteNote(aptNote.noteId);
        handleClose();
        onAptUpdate();
      } else if (aptNote.signedByTherapist) {
        alert(
          'Appointments with already signed note cannot be deleted.  If this is an error, please contact your administrator.',
        );
        handleClose();
        onAptUpdate();
      } else if (
        aptNote.content.D !== '' ||
        aptNote.content.A !== '' ||
        aptNote.content.P !== ''
      ) {
        if (
          window.confirm(
            'Assosciated appointment note already has content. If appointment is deleted, the assosciated note will also be deleted. Are you sure you want to delete this appointment?',
          )
        ) {
          await deleteAppointment(selectedApt.appointmentId);
          await deleteNote(aptNote.noteId);
          handleClose();
          onAptUpdate();
        }
      }
    }
  };

  const handleIsRecurring = () => {
    if (isRecurring) {
      setIsRecurring(false);
    } else {
      setIsRecurring(true);
    }
  };

  const handleFrequency = (e) => {
    setFrequency(Number(e.target.value));
  };

  const handleEvents = (e) => {
    setEvents(Number(e.target.value));
  };

  const createInstanceOptions = (num) => {
    const options = [];
    for (let i = 1; i <= num; i++) {
      options.push(i);
    }
    return options;
  };

  // still want to add repeating and full day apt options
  return (
    <>
      <StyledModal
        open={openModal}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <>
          <Box sx={style}>
            {selectedApt.appointmentId ? (
              <Link
                passHref
                className="client-name-apt-modal"
                href={`/client/${selectedClientObj.clientId}`}
              >
                <h2 onClick={handleClose} className="client-name-apt-modal">
                  {selectedClientObj &&
                    `${selectedClientObj.firstName} ${selectedClientObj.lastName}`}
                </h2>
              </Link>
            ) : (
              <h2 id="unstyled-modal-title">New Appointment</h2>
            )}
            <form className="add-appointment-modal" onSubmit={handleSubmit}>
              {selectedApt.appointmentId ? (
                ''
              ) : (
                <>
                  <label>
                    Client Appointment
                    <input
                      type="radio"
                      className="apt-radio"
                      id="apt-type-client"
                      name="apt-type-radio"
                      value="client"
                      onChange={(e) => setAptRadio(e.target.value)}
                      defaultChecked
                    />
                  </label>
                  <label>
                    Other
                    <input
                      type="radio"
                      className="apt-radio"
                      id="apt-type-other"
                      name="apt-type-radio"
                      value="other"
                      onChange={(e) => setAptRadio(e.target.value)}
                    />
                  </label>

                  {aptRadio === 'client' ? (
                    <div className="select-client">
                      <Autocomplete
                        id="client-autocomplete"
                        options={activeClients}
                        // sx={{ width: 50 }}
                        getOptionLabel={(option) => {
                          if (option.firstName) {
                            return `${option.firstName} ${option.lastName}`;
                          }
                          return '';
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Add Client"
                            size="small"
                            required
                          />
                        )}
                        onChange={(event, newValue) => {
                          setSelectedClientObj(newValue);
                        }}
                        value={
                          selectedClientObj.clientId
                            ? { ...selectedClientObj }
                            : ''
                        }
                      />
                    </div>
                  ) : (
                    <div className="other-apt-title">
                      <input type="text" placeholder="Add title" required />
                    </div>
                  )}
                </>
              )}
              {therapist.admin ? (
                <div className="select-therapist">
                  <Autocomplete
                    id="therapists-autocomplete"
                    options={therapists}
                    getOptionLabel={(option) => {
                      if (option.firstName) {
                        return `${option.firstName} ${option.lastName}`;
                      }
                      return '';
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Therapist"
                        size="small"
                        required
                      />
                    )}
                    onChange={(event, newValue) => {
                      setSelectedTherapistObj(newValue);
                    }}
                    value={
                      selectedTherapistObj.therapistId
                        ? { ...selectedTherapistObj }
                        : ''
                    }
                  />
                </div>
              ) : (
                ''
              )}
              <>
                <div className="datepick-mins">
                  <div className="datepick">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                          textField: { size: 'small' },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="mins-container">
                    <label className="mins-label">
                      <input
                        className="mins"
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        required
                      />
                      <span className="min-span">mins</span>
                    </label>
                  </div>
                </div>
                <div className="recurring-apt-select">
                  <div className="recurring-checkbox">
                    <label>
                      Is this appointment recurring?
                      <input
                        type="checkbox"
                        value={isRecurring}
                        checked={isRecurring}
                        onChange={handleIsRecurring}
                        className="modal-check recurring-check"
                      />
                    </label>
                  </div>
                  {isRecurring && (
                    <>
                      <div className="recurring-select-container">
                        <div className="frequency-container">
                          <select
                            className="recurring-select frequency"
                            onChange={handleFrequency}
                            value={frequency}
                          >
                            <option value={1}>Every Week</option>
                            <option value={2}>Every 2 Weeks</option>
                            <option value={3}>Every 3 Weeks</option>
                            <option value={4}>Every 4 Weeks</option>
                          </select>
                        </div>
                        <div className="ends-after-container">
                          <label className="ends-after">
                            Ends After
                            <select
                              className="recurring-select num-events"
                              onChange={handleEvents}
                              value={events}
                            >
                              {createInstanceOptions(50).map((num) => (
                                <option
                                  key={`instanceOption${num}`}
                                  value={num}
                                >
                                  {num}
                                </option>
                              ))}
                            </select>
                            Events
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
              <>
                <div className="btm-apt-btns">
                  {selectedApt?.appointmentId ? (
                    <DeleteOutlineIcon
                      onClick={handleDelete}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    ''
                  )}
                  <div className="cancel-done-btns">
                    <button
                      className="done-btn"
                      type="button"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button className="done-btn" type="submit">
                      Done
                    </button>
                  </div>
                </div>
              </>
            </form>
          </Box>
        </>
      </StyledModal>
    </>
  );
}

AddAppointment.propTypes = {
  selectedCalDate: PropTypes.string.isRequired,
};

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
