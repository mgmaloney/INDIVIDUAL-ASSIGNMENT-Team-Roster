import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loading() {
  return (
    <div className="text-center mt-5">
      <Spinner
        animation="grow"
        style={{
          marginTop: '200px',
          color: '#267ccb',
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
}
