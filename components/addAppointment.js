/* eslint-disable import/no-extraneous-dependencies */
import { styled, Box } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from '@mui/base/Modal';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Autocomplete, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { addMinutes } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import TherapistClientsContext from '../utils/context/therapistClientsContext';
import TherapistContext from '../utils/context/therapistContext';
import OpenAptModalContext from '../utils/context/selectedAptContext';
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from '../utils/databaseCalls/calendarData';
import { getClientByClientId } from '../utils/databaseCalls/clientData';
import { getNoteByAptId, deleteNote } from '../utils/databaseCalls/noteData';
import {
  getAllTherapists,
  getTherapistByTherapistId,
} from '../utils/databaseCalls/therapistData';

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
  width: 400,
  borderRadius: '12px',
  padding: '0px 20px 24px 20px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  color: '#267ccb',
  boxShadow: `0px 2px 24px ${
    theme.palette.mode === 'dark' ? '#000' : '#383838'
  }`,
});

export default function AddAppointment({ selectedCalDate, onAptUpdate }) {
  const { therapist } = useContext(TherapistContext);
  const { therapistClients } = useContext(TherapistClientsContext);
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
  const [aptNote, setAptNote] = useState({});

  const handleClose = () => {
    setOpenModal(false);
    if (setSelectedApt) {
      setSelectedApt(selectedAptDefaultState);
      setSelectedClientObj({});
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
  }, [selectedApt.appointmentId]);

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
      await updateAppointment(payload);
      handleClose();
      onAptUpdate();
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
      await updateAppointment(payload);
      handleClose();
      onAptUpdate();
    } else if (!therapist.admin) {
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
    } else if (therapist.admin) {
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
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete this appointment?`)) {
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
            <h2 id="unstyled-modal-title">New Appointment</h2>
            <form className="add-appointment-modal" onSubmit={handleSubmit}>
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
                      selectedClientObj.clientId ? { ...selectedClientObj } : ''
                    }
                  />
                </div>
              ) : (
                <div className="other-apt-title">
                  <input type="text" placeholder="Add title" required />
                </div>
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
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  selectedCalDate: PropTypes.string.isRequired,
  onAptUpdate: PropTypes.func.isRequired,
  selectedApt: PropTypes.shape({
    appointmentId: PropTypes.string,
    title: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    length: PropTypes.number,
    therapistId: PropTypes.string,
    clientId: PropTypes.string,
    type: PropTypes.string,
  }),
  setSelectedApt: PropTypes.func.isRequired,
};

AddAppointment.defaultProps = {
  selectedApt: selectedAptDefaultState,
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
