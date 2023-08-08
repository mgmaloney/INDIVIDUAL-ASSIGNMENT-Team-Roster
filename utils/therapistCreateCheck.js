// this file's goals is to develop a function that checks 
// if a therapist object matches the details of a user object
// with the intent to know if the admin has created that therapist
// if so, on first login it will let them in
// if not, it will tell the user to contact their administrator
//
// import { useEffect, useState } from 'react';
// import { getAllTherapists } from './databaseCalls/therapistData';

// const therapistCreatedCheck = () => {
//   const [therapists, setTherapists] = useState([]);
//   const { user } = useAuth();
//   const compareUserObj = {};
//   const therapistSetter = async () => {
//     const therapists = await getAllTherapists();
//     setTherapists(therapists);
//   };

//   useEffect(() => {
//     therapistSetter();
//   });
// };
