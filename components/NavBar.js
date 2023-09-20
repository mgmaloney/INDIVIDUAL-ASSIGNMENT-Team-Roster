/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { signOut } from '../utils/auth';
import OpenClientModalContext from '../utils/context/openClientModalContext';
import OpenTherapistModalContext from '../utils/context/openTherapistModalContext';
import TherapistContext from '../utils/context/therapistContext';

export default function NavBar() {
  const { setOpenClientModal } = useContext(OpenClientModalContext);
  const { setOpenTherapistModal } = useContext(OpenTherapistModalContext);
  const { therapist } = useContext(TherapistContext);
  const router = useRouter();
  const handleClientModalOpen = () => {
    setOpenClientModal(true);
  };
  const handleTherapistModalOpen = () => {
    setOpenTherapistModal(true);
  };

  const handleSignOut = () => {
    router.push('/');
    signOut();
  };

  return (
    <>
      <nav className="navbar">
        <Link passHref href="/">
          Phiel
        </Link>
        <ul className="nav-list">
          <div className="nav-btns">
            <li>
              <button type="button" className="nav-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-btn"
                onClick={handleClientModalOpen}
              >
                Add Client
              </button>
            </li>
            {therapist?.admin ? (
              <li>
                <button
                  type="button"
                  className="nav-btn"
                  onClick={handleTherapistModalOpen}
                >
                  Add Therapist
                </button>
              </li>
            ) : (
              ''
            )}
          </div>
        </ul>
      </nav>
    </>
  );
}
