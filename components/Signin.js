import React from 'react';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div
      className="login-wrapper"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <div className="login-container">
        <h1 className="login-logo">PHIEL</h1>

        <button type="button" className="done-btn" onClick={signIn}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Signin;
