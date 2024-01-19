import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getAllTherapists,
  updateTherapist,
} from '../../utils/databaseCalls/therapistData';
import getAllPractices from '../../utils/databaseCalls/practiceData';
import { useAuth } from '../../utils/context/authContext';
import { signOut } from '../../utils/auth';

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
    if (!practiceConfirmed) {
      return false;
    }
  };

  const checkTherapistExists = async () => {
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
    if (!therapistConfirmed) {
      return false;
    }
  };

  const addUid = async () => {
    const payload = {
      ...therapist,
      uid: user.uid,
    };
    await updateTherapist(payload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((await practiceCheckSet()) && (await checkTherapistExists())) {
      setPassCheck(true);
    } else {
      setSubmitted(true);
      setPassCheck(false);
    }
  };

  useEffect(() => {
    if (therapist.therapistId) {
      setSubmitted(true);
    }
  }, [therapist.therapistId]);

  useEffect(() => {
    if (passCheck && submitted && therapist.therapistId) {
      addUid();
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSuccess = () => {
    setTimeout(() => {
      router.reload();
    }, 3500);
  };

  if (!submitted) {
    return (
      <>
        <div className="thera-check-wrapper">
          <form className="therapist-check-form" onSubmit={handleSubmit}>
            <h1 className="thera-check-head">
              Please enter your information:{' '}
            </h1>
            <div className="thera-check-items">
              <label>
                First Name:{' '}
                <input
                  className="form-text"
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                />
              </label>
              <label>
                Last Name:{' '}
                <input
                  className="form-text"
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:{' '}
                <input
                  className="form-text"
                  type="email"
                  name="email"
                  onChange={handleChange}
                />
              </label>
              <label>
                Practice Name:{' '}
                <input
                  type="text"
                  className="form-text"
                  name="practiceName"
                  onChange={handleChange}
                />
              </label>
              <label>
                Practice Registration Password:{' '}
                <input
                  type="password"
                  className="form-text"
                  name="regPassword"
                  onChange={handleChange}
                />
              </label>
              <div className="thera-check-btns">
                <button type="button" className="done-btn" onClick={signOut}>
                  Leave this page.
                </button>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="done-btn"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
  if (submitted && !passCheck) {
    return (
      <>
        <div className="thera-check-result">
          <h1 className="thera-check">
            User not found. Please Contact Your Administator.
          </h1>
          <button type="button" className="done-btn" onClick={signOut}>
            Leave this page
          </button>
        </div>
      </>
    );
  }
  if (submitted && passCheck) {
    return (
      <div className="thera-check-result">
        <h1>Confirmed. Redirecting...</h1>
        {handleSuccess()}
      </div>
    );
  }
}
