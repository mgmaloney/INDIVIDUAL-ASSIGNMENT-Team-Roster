import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
// import { signIn } from '../utils/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import firebase from 'firebase';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (e) => {
    e.preventDefault();
    const fbauth = firebase.auth();
    signInWithEmailAndPassword(fbauth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        // ...
        console.log(userCredential);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode:', errorCode);
        console.log('errorMessage:', errorMessage);
      });
  };
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <form onSubmit={signIn}>
        <h1 id="login-header">Log In</h1>
        <label htmlFor="email">Email:</label>
        <input name="email" type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password: </label>
        <input name="password" type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" size="lg" className="copy-btn">
          Log In
        </Button>
      </form>
    </div>
  );
}

export default Signin;
