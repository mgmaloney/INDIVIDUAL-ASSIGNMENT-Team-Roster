/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import OpenClientModalContext from '../utils/context/openClientModalContext';
import OpenTherapistModalContext from '../utils/context/openTherapistModalContext';
import TherapistContext from '../utils/context/therapistContext';

export default function NavBar() {
  const { setOpenClientModal } = useContext(OpenClientModalContext);
  const { setOpenTherapistModal } = useContext(OpenTherapistModalContext);
  const { therapist } = useContext(TherapistContext);

  const handleClientModalOpen = () => {
    setOpenClientModal(true);
  };
  const handleTherapistModalOpen = () => {
    setOpenTherapistModal(true);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>PHIEL</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link passHref href="/">
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Button variant="danger" onClick={signOut}>
              Sign Out
            </Button>
            <Button variant="danger" onClick={handleClientModalOpen}>
              Add Client
            </Button>
            {therapist.admin ? (
              <Button variant="danger" onClick={handleTherapistModalOpen}>
                Add Therapist
              </Button>
            ) : (
              ''
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
