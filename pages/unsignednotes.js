import { useContext, useEffect, useState } from 'react';
import TherapistContext from '../utils/context/therapistContext';
import {
  getAllUnsignedAppointmentNotes,
  getUnsignedAppointmentNotesSuperVisor,
  getUnsignedAppointmentNotesTherapist,
} from '../utils/databaseCalls/noteData';
import UnsignedNoteCard from '../components/cards/unsignedNoteCard';

export default function UnsignedNotes() {
  const { therapist } = useContext(TherapistContext);
  const [unsignedNotes, setUnsignedNotes] = useState([]);
  const [displayingUnsigned, setDisplayingUnsigned] = useState([]);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState();
  const [pageSelects, setPageSelects] = useState([]);

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
  }, [therapist.admin, therapist.supervisor]);

  useEffect(() => {
    const pageCalc = unsignedNotes.length / 20;
    setNumberOfPages(Math.ceil(pageCalc));
  }, [unsignedNotes]);

  useEffect(() => {
    for (let i = 1; i <= numberOfPages; i++) {
      setPageSelects((prevState) => [...prevState, i]);
    }
  }, [numberOfPages]);

  useEffect(() => {
    const allUnsignedNotes = [...unsignedNotes];
    const unsignedNotesToDisplay = allUnsignedNotes.splice(
      page * 20 - 20,
      page * 20 - 1,
    );
    setDisplayingUnsigned(unsignedNotesToDisplay);
  }, [page, unsignedNotes]);

  const handlePageClick = (e) => {
    setPage(e.target.id);
  };

  return (
    <>
      <h2>Unsigned Notes: </h2>
      {displayingUnsigned &&
        displayingUnsigned.map((unsignedNote) => (
          <UnsignedNoteCard noteObj={unsignedNote} />
        ))}
      <div className="page-numbers-container">
        {pageSelects &&
          pageSelects.map((pageNum) => (
            <p onClick={handlePageClick} className="page-number" id={pageNum}>
              {pageNum}
            </p>
          ))}
      </div>
    </>
  );
}
