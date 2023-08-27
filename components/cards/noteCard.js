/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { deleteNote } from '../../utils/databaseCalls/noteData';

export default function NoteCard({ noteObj, page, onNotesUpdate, clientId }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm(`Delete this Chart Note?`)) {
      await deleteNote(noteObj.noteId);
      onNotesUpdate(noteObj.clientId);
    }
  };

  const dateToStringConverter = (unparsedDate) => {
    const date = new Date(unparsedDate);
    return date.toLocaleString('en-US');
  };

  const renderTextByType = () => {
    if (noteObj.type !== 'chart' && !noteObj.content.D) {
      return (
        <p
          type="button"
          onClick={() =>
            router.push(`/client/progressnote/edit/${noteObj.noteId}`)
          }
        >
          Add Progress Note +
        </p>
      );
    }
    if (noteObj.type === 'appointment') {
      return (
        <>
          <div className="DAP-div">
            <h5 className="DAP-head">Data: </h5>
            <p className="DAP-text">{noteObj.content.D}</p>
            <h5 className="DAP-head">Assessment and Response: </h5>
            <p className="DAP-text">{noteObj.content.A}</p>
            <h5 className="DAP-head">Plan: </h5>
            <p className="DAP-text">{noteObj.content.P}</p>
          </div>
        </>
      );
    }
    if (noteObj.type === 'chart') {
      return (
        <>
          <p className="chart-note-content">{noteObj.content.chartNote}</p>
          <button
            className="delete-note-btn"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      );
    }
    return '';
  };

  const renderLinksByType = () => {
    if (
      page === 'clientOverview' &&
      noteObj.type === 'appointment' &&
      noteObj.sharedWithSuperviors
    ) {
      return (
        <Link passHref href={`/client/progessnote/${noteObj.noteId}`}>
          View Note
        </Link>
      );
    }
    if (
      page === 'clientOverview' &&
      noteObj.type === 'appointment' &&
      !noteObj.sharedWithSuperviors
    ) {
      return (
        <Link passHref href={`/client/progressnote/edit/${noteObj.noteId}`}>
          Edit
        </Link>
      );
    }
    if (page === 'clientOverview' && noteObj.type === 'chart') {
      return <button type="button">Edit</button>;
    }
    return '';
  };

  return (
    <div className="note-card">
      <h4 className="note-title">{noteObj.title}</h4>
      <h6 className="note-date">{dateToStringConverter(noteObj.dateTime)}</h6>
      {renderTextByType()}
      {page === 'clientOverview' ? (
        <button className="show-more-btn" type="button">
          Show More
        </button>
      ) : (
        ''
      )}
      {renderLinksByType()}
    </div>
  );
}

NoteCard.propTypes = {
  noteObj: PropTypes.shape({
    noteId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    appointmentId: PropTypes.string,
    clientId: PropTypes.string,
    therapistId: PropTypes.string,
    supervisorId: PropTypes.string,
    signedByTherapist: PropTypes.bool,
    signedBySupervisor: PropTypes.bool,
    content: PropTypes.shape({
      D: PropTypes.string,
      A: PropTypes.string,
      P: PropTypes.string,
      chartNote: PropTypes.string,
    }),
    dateTime: PropTypes.number,
  }).isRequired,
  page: PropTypes.string.isRequired,
  onNotesUpdate: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
};
