import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAuth } from './context/authContext';
import { getTherapistByUid } from './databaseCalls/therapistData';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import SideBar from '../components/sideBar';
import AddClient from '../components/forms/createClient';
import TherapistContext from './context/therapistContext';
import { getClientsByTherapistId } from './databaseCalls/clientData';
import TherapistClientsContext from './context/therapistClientsContext';
import OpenClientModalContext from './context/openClientModalContext';

const ViewDirectorBasedOnUserAuthStatus = ({
  component: Component,
  pageProps,
}) => {
  const { user, userLoading } = useAuth();
  const [therapist, setTherapist] = useState({});
  const [therapistClients, setTherapistClients] = useState([]);
  const [editingClient, setEditingClient] = useState({});
  const [openClientModal, setOpenClientModal] = useState(false);

  useEffect(() => {
    if (user) {
      getTherapistByUid(user.uid).then((response) => setTherapist(response[0]));
    }
  }, [user]);

  useEffect(() => {
    getClientsByTherapistId(therapist.therapistId).then(setTherapistClients);
  }, [therapist]);

  // this will need to be refactored for when the admin user is added
  // const [isNewUser, setIsNewUser] = useState(false);
  // const isNewUserCheck = async () => {
  //   if (therapist.length === 0) {
  //     setIsNewUser(true);
  //     console.warn('user', user);
  //   }
  // };

  // useEffect(() => {
  //   isNewUserCheck();
  // }, [isNewUser]);

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in
  if (user) {
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
              <NavBar /> <AddClient />
              {/* NavBar only visible if user is logged in and is in every view */}
              <div className="main-wrapper">
                <SideBar />
                {/* <IsNewUserContext.Provider value={isNewUser}> */}
                <div className="container">
                  <Component {...pageProps} />
                </div>
              </div>
            </OpenClientModalContext.Provider>
          </TherapistClientsContext.Provider>
        </TherapistContext.Provider>
        {/* </IsNewUserContext.Provider> */}
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
