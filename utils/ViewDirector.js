import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from './context/authContext';
import { signOut } from './auth';
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
import TherapistClientsContext from './context/therapistClientsContext';
import OpenClientModalContext from './context/openClientModalContext';
import OpenTherapistModalContext from './context/openTherapistModalContext';
import CreateTherapistUser from '../components/forms/createTherapistUser';
import TherapistCheckForm from '../components/forms/therapistCheck';
import OpenAptModalContext from './context/selectedAptContext';

const ViewDirectorBasedOnUserAuthStatus = ({
  component: Component,
  pageProps,
}) => {
  const { user, userLoading } = useAuth();
  const [therapist, setTherapist] = useState(null);
  const [therapistClients, setTherapistClients] = useState([]);
  const [editingClient, setEditingClient] = useState({});
  const [openClientModal, setOpenClientModal] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState({});
  const [openTherapistModal, setOpenTherapistModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [therapistLoading, setTherapistLoading] = useState(null);

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
    if (therapist === null) {
      setTherapistLoading(true);
    } else {
      setTherapistLoading(false);
    }
  }, [therapist]);

  useEffect(() => {
    if (therapist?.admin) {
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
  if (userLoading || therapistLoading) {
    return <Loading />;
  }

  if (user && isNewUser) {
    return <TherapistCheckForm />;
  }

  // what the user should see if they are logged in
  if (user && !isNewUser && therapist && therapist.active) {
    return (
      <>
        <TherapistContext.Provider value={{ therapist }}>
          <TherapistClientsContext.Provider
            value={{ therapistClients, setTherapistClients }}
          >
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
                  {!isNewUser ? (
                    <>
                      <NavBar />
                      <CreateTherapistUser />
                      <AddClient />
                      <div className="main-wrapper">
                        <SideBar />
                        <div className="container">
                          <Component {...pageProps} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </OpenAptModalContext.Provider>
              </OpenTherapistModalContext.Provider>
            </OpenClientModalContext.Provider>
          </TherapistClientsContext.Provider>
        </TherapistContext.Provider>
      </>
    );
  }
  if (user && !isNewUser && therapist && !therapist.active) {
    return (
      <>
        <h1 className="inactive-user">
          Your account has been deactivated. Please contact your administrator
        </h1>
        <Button variant="danger" onClick={signOut}>
          Leave this page.
        </Button>
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
