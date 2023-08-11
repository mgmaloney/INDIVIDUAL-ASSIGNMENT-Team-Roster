import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAuth } from './context/authContext';
import { getTherapistByUid } from './databaseCalls/therapistData';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import SideBar from '../components/sideBar';
import TherapistContext from './context/therapistContext';

const ViewDirectorBasedOnUserAuthStatus = ({
  component: Component,
  pageProps,
}) => {
  const { user, userLoading } = useAuth();
  const [therapist, setTherapist] = useState({});

  useEffect(() => {
    if (user) {
      getTherapistByUid(user.uid).then((response) => setTherapist(response[0]));
    }
  }, [user]);

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
          {console.warn(user)}
          <NavBar />{' '}
          {/* NavBar only visible if user is logged in and is in every view */}
          <SideBar />
          {/* <IsNewUserContext.Provider value={isNewUser}> */}
          <div className="container">
            <Component {...pageProps} />
          </div>
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
