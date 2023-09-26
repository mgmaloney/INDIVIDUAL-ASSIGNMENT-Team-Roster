/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { deleteNote } from '../../utils/databaseCalls/noteData';
import ChartNoteForm from '../forms/chartNote';

export default function NoteCard({
  noteObj,
  page,
  onNotesUpdate,
  clientObj,
  numberOfApt,
}) {
  const router = useRouter();
  const [editingChartNote, setEditingChartNote] = useState(false);
  const [isShowingMore, setIsShowMore] = useState(false);

  const handleProgressNoteClick = () => {
    if (noteObj.type === 'appointment') {
      router.push(`/client/progressnote/edit/${noteObj.noteId}`);
    }
  };

  const handleShowMoreClick = () => {
    if (isShowingMore) {
      setIsShowMore(false);
    } else {
      setIsShowMore(true);
    }
  };

  const handleEdit = () => {
    if (editingChartNote) {
      setEditingChartNote(false);
    } else {
      setEditingChartNote(true);
    }
  };

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
          className="add-progress-note-btn"
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
          <div className={isShowingMore ? 'DAP-div-show-more' : 'DAP-div'}>
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
          {!editingChartNote ? (
            <>
              <p className="chart-note-content">{noteObj.content.chartNote}</p>
              <button className="done-btn" type="button" onClick={handleDelete}>
                Delete
              </button>
            </>
          ) : (
            <ChartNoteForm
              clientObj={clientObj}
              noteObj={noteObj}
              onNotesUpdate={onNotesUpdate}
              editingChartNote={editingChartNote}
              setEditingChartNote={setEditingChartNote}
            />
          )}
        </>
      );
    }
    return '';
  };

  const renderLinksByType = () => {
    if (
      page === 'clientOverview' &&
      noteObj.type === 'appointment' &&
      noteObj.sharedWithSupervisor
    ) {
      return (
        <p
          className="client-nav-link"
          type="button"
          onClick={() => router.push(`/client/progressnote/${noteObj.noteId}`)}
        >
          View Note
        </p>
      );
    }
    if (
      page === 'clientOverview' &&
      noteObj.type === 'appointment' &&
      !noteObj.sharedWithSupervisor &&
      noteObj.content.D
    ) {
      return (
        <p
          type="button"
          onClick={() =>
            router.push(`/client/progressnote/edit/${noteObj.noteId}`)
          }
        >
          Edit
        </p>
      );
    }
    if (
      page === 'clientOverview' &&
      noteObj.type === 'chart' &&
      !editingChartNote
    ) {
      return (
        <button onClick={handleEdit} className="done-btn" type="button">
          Edit
        </button>
      );
    }
    return '';
  };

  return (
    <div className={isShowingMore ? 'note-card-showing-more' : 'note-card'}>
      <h4
        className={
          noteObj.type === 'appointment'
            ? 'note-title note-title-progress'
            : 'note-title'
        }
        onClick={handleProgressNoteClick}
      >
        {noteObj.title}{' '}
        {noteObj.type === 'appointment' ? `#${numberOfApt}` : ''}
      </h4>
      <h6 className="note-date">
        {!editingChartNote ? dateToStringConverter(noteObj.dateTime) : ''}
      </h6>
      {renderTextByType()}
      {page === 'clientOverview' ? (
        <>
          {noteObj.type === 'chart' && editingChartNote ? (
            ''
          ) : (
            <button
              className="show-more-btn"
              type="button"
              onClick={handleShowMoreClick}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        ''
      )}
      {renderLinksByType()}
    </div>
  );
}

NoteCard.propTypes = {
  numberOfApt: PropTypes.number.isRequired,
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
    sharedWithSupervisor: PropTypes.bool,
    content: PropTypes.shape({
      D: PropTypes.string,
      A: PropTypes.string,
      P: PropTypes.string,
      chartNote: PropTypes.string,
    }),
    dateTime: PropTypes.string,
  }).isRequired,
  page: PropTypes.string.isRequired,
  onNotesUpdate: PropTypes.func.isRequired,
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
