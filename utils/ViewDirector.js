import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAuth } from './context/authContext';
import {
  getAllTherapists,
  getTherapistByUid,
} from './databaseCalls/therapistData';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import SideBar from '../components/sideBar';
import AddClient from '../components/forms/createClient';
import TherapistContext from './context/therapistContext';
import {
  getAllClients,
  getClientsByTherapistId,
} from './databaseCalls/clientData';
import { getAppointments } from './databaseCalls/calendarData';
import {
  getAllUnsignedAppointmentNotes,
  getUnsignedAppointmentNotesSuperVisor,
  getUnsignedAppointmentNotesTherapist,
} from './databaseCalls/noteData';
import TherapistClientsContext from './context/therapistClientsContext';
import OpenClientModalContext from './context/openClientModalContext';
import OpenTherapistModalContext from './context/openTherapistModalContext';
import CreateTherapistUser from '../components/forms/createTherapistUser';
import TherapistCheckForm from '../components/forms/therapistCheck';
import OpenAptModalContext from './context/selectedAptContext';
import AppointmentsContext from './context/appointmentsContext';
import UnsignedNotesContext from './context/unsignedNotesContext';

const ViewDirectorBasedOnUserAuthStatus = ({
  component: Component,
  pageProps,
}) => {
  const { user, userLoading } = useAuth();
  const [therapist, setTherapist] = useState({});
  const [therapistClients, setTherapistClients] = useState([]);
  const [editingClient, setEditingClient] = useState({});
  const [openClientModal, setOpenClientModal] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState({});
  const [openTherapistModal, setOpenTherapistModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [unsignedNotes, setUnsignedNotes] = useState([]);

  useEffect(() => {
    getAppointments().then(setAppointments);
  }, [therapist]);

  const onAptUpdate = () => {
    getAppointments().then(setAppointments);
  };

  const onSignedUpdate = () => {
    if (therapist.admin) {
      getAllUnsignedAppointmentNotes().then(setUnsignedNotes);
    }
    if (therapist.supervisor) {
      getUnsignedAppointmentNotesSuperVisor(therapist.therapistId).then(
        setUnsignedNotes,
      );
    } else {
      getUnsignedAppointmentNotesTherapist(therapist.therapistId).then(
        setUnsignedNotes,
      );
    }
  };

  useEffect(() => {
    if (therapist.admin) {
      getAllUnsignedAppointmentNotes().then(setUnsignedNotes);
    }
    if (therapist.supervisor) {
      getUnsignedAppointmentNotesSuperVisor(therapist.therapistId).then(
        setUnsignedNotes,
      );
    } else {
      getUnsignedAppointmentNotesTherapist(therapist.therapistId).then(
        setUnsignedNotes,
      );
    }
  }, [therapist.admin, therapist.supervisor, therapist.therapistId]);

  useEffect(() => {
    if (user) {
      getTherapistByUid(user.uid).then((response) => {
        if (response[0]) {
          setTherapist(response[0]);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (therapist.admin) {
      getAllClients().then(setTherapistClients);
    } else {
      getClientsByTherapistId(therapist?.therapistId).then(setTherapistClients);
    }
  }, [therapist]);

  const [isNewUser, setIsNewUser] = useState();

  const isNewUserCheck = async () => {
    const therapists = await getAllTherapists();
    const matchingTherapist = therapists.find(
      (therapistChecking) => therapistChecking.uid === user?.uid,
    );
    if (matchingTherapist) {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  };

  useEffect(() => {
    isNewUserCheck();
  }, [user]);

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  if (user && isNewUser) {
    return <TherapistCheckForm />;
  }

  // what the user should see if they are logged in
  if (user && !isNewUser && therapist) {
    return (
      <>
        <TherapistContext.Provider value={{ therapist }}>
          <TherapistClientsContext.Provider
            value={{ therapistClients, setTherapistClients }}
          >
            <AppointmentsContext.Provider value={{ appointments, onAptUpdate }}>
              <OpenClientModalContext.Provider
                value={{
                  openClientModal,
                  setOpenClientModal,
                  editingClient,
                  setEditingClient,
                }}
              >
                <OpenTherapistModalContext.Provider
                  value={{
                    openTherapistModal,
                    setOpenTherapistModal,
                    editingTherapist,
                    setEditingTherapist,
                  }}
                >
                  <OpenAptModalContext.Provider
                    value={{
                      openModal,
                      setOpenModal,
                      selectedApt,
                      setSelectedApt,
                    }}
                  >
                    <UnsignedNotesContext.Provider
                      value={{ unsignedNotes, onSignedUpdate }}
                    >
                      {!isNewUser ? (
                        <>
                          <NavBar />
                          <CreateTherapistUser />
                          <AddClient />
                          <div className="main-wrapper">
                            <SideBar />
                            <div className="main-container">
                              <Component {...pageProps} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </UnsignedNotesContext.Provider>
                  </OpenAptModalContext.Provider>
                </OpenTherapistModalContext.Provider>
              </OpenClientModalContext.Provider>
            </AppointmentsContext.Provider>
          </TherapistClientsContext.Provider>
        </TherapistContext.Provider>
      </>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
