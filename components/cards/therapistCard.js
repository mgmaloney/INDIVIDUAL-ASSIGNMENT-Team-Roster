import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTherapistByTherapistId } from '../../utils/databaseCalls/therapistData';
import OpenClientModalContext from '../../utils/context/openClientModalContext';
import {
  getClientsByTherapistId,
  updateClient,
} from '../../utils/databaseCalls/clientData';
import TherapistClientsContext from '../../utils/context/therapistClientsContext';

export default function TherapistCard({ therapistObj }) {
  return <>
    <div></div>
  </>;
}

TherapistCard.propTypes = {
  clientObj: PropTypes.shape({
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipcode: PropTypes.string,
    sex: PropTypes.string,
    gender: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
};
