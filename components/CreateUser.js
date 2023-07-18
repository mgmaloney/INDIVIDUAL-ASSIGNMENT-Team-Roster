import React, { useState } from 'react';
import 'firebase/auth';
import { Button } from 'react-bootstrap';
import { firebase } from '../utils/client';

function CreateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createUser = (e) => {
    e.preventDefault();
    const auth = firebase.auth();
    firebase
      .createUserWithEmailAndPassword(auth, email, password)
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
      <form onSubmit={createUser}>
        <h1 id="login-header">Add an Account to Practice</h1>
        <label htmlFor="email">Email:</label>
        <input name="email" type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password: </label>
        <input name="password" type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" size="lg" className="copy-btn">
          Add Account
        </Button>
      </form>
    </div>
  );
}

export default CreateUser;
