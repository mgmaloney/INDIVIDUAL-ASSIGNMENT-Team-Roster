import { useState } from 'react';
import PropTypes from 'prop-types';

export default function NoteCard({ noteObj, type, page }) {
  const [showMore, setShowMore] = useState(false);

  const showMoreToggle = () => {
    if (!showMore) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  };

  const renderTextByType = () => {
    if (type === 'DAP') {
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
    if (type === 'chart') {
      return (
        <>
          <h4 className="note-title">Chart Note</h4>
          <p className="chart-note-content">{noteObj.content.chartNote}</p>
        </>
      );
    }
    return '';
  };

  return (
    <>
      <h4 className="note-title">{noteObj.title}</h4>
      {renderTextByType}
      {page === 'client' ? (
        <button onClick={showMoreToggle} type="button">
          Show More
        </button>
      ) : (
        ''
      )}
    </>
  );
}

NoteCard.propTypes = {
  noteObj: PropTypes.shape({
    noteId: PropTypes.string,
    title: PropTypes.string,
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
  }).isRequired,
  type: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
};
