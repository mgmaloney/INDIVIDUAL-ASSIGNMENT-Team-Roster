import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getAllTherapists,
  updateTherapist,
} from '../../utils/databaseCalls/therapistData';
import getAllPractices from '../../utils/databaseCalls/practiceData';
import { useAuth } from '../../utils/context/authContext';

export default function TherapistCheckForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [passCheck, setPassCheck] = useState();
  const [therapists, setTherapists] = useState([]);
  const [therapist, setTherapist] = useState({});

  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    practiceName: '',
    regPassword: '',
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    getAllTherapists().then(setTherapists);
  }, []);

  const practiceCheckSet = async () => {
    const practices = await getAllPractices();
    const practiceConfirmed = practices.find(
      (practiceCheck) =>
        formData.practiceName === practiceCheck.name &&
        formData.regPassword === practiceCheck.regPassword,
    );
    if (practiceConfirmed) {
      return true;
    }
    return false;
  };

  const checkTherapistExists = () => {
    const therapistConfirmed = therapists.find(
      (therapistChecking) =>
        therapistChecking.firstName === formData.firstName &&
        therapistChecking.lastName === formData.lastName &&
        therapistChecking.email === formData.email,
    );
    if (therapistConfirmed) {
      setTherapist(therapistConfirmed);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if ((await practiceCheckSet()) && checkTherapistExists()) {
      setPassCheck(true);
      await updateTherapist({
        therapistId: therapist.therapistId,
        uid: user.uid,
      });
    } else {
      setPassCheck(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!submitted) {
    return (
      <>
        <h1>Please enter your information: </h1>
        <form className="therapist-check-form" onSubmit={handleSubmit}>
          <label>
            First Name
            <input type="text" name="firstName" onChange={handleChange} />
          </label>
          <label>
            Last Name
            <input type="text" name="lastName" onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" onChange={handleChange} />
          </label>
          <label>
            Practice Name
            <input type="text" name="practiceName" onChange={handleChange} />
          </label>
          <label>
            Practice Registration Password
            <input type="password" name="regPassword" onChange={handleChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
  if (submitted && !passCheck) {
    return (
      <h1 className="not-found">
        User not found. Please Contact Your Administator.
      </h1>
    );
  }
  if (submitted && passCheck) {
    return (
      <>
        <h1>Confirmed. Redirecting...</h1>
        {setTimeout(() => {
          router.push(`/`);
        }, 5000)}
      </>
    );
  }
}
