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
import TherapistClientsContext from './context/therapistClientsContext';
import OpenClientModalContext from './context/openClientModalContext';
import OpenTherapistModalContext from './context/openTherapistModalContext';
import CreateTherapistUser from '../components/forms/createTherapistUser';
import TherapistCheckForm from '../components/forms/therapistCheck';

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

  useEffect(() => {
    if (user) {
      getTherapistByUid(user.uid).then((response) => setTherapist(response[0]));
    }
  }, [user]);

  useEffect(() => {
    if (therapist.admin) {
      getAllClients().then(setTherapistClients);
    } else {
      getClientsByTherapistId(therapist?.therapistId).then(setTherapistClients);
    }
  }, [therapist]);

  // this will need to be refactored for when the admin user is added
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
  if (user && !isNewUser) {
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
              </OpenTherapistModalContext.Provider>
            </OpenClientModalContext.Provider>
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
