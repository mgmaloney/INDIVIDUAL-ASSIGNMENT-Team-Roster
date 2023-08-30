import { useContext, useState } from "react";

export default function TherapistCheckForm() {
    const [submitted, setSubmitted] = useState(false)
    const [passCheck, setPassCheck] = useState(false)

    return (
        <>
        <h1>Please enter your information: </h1>
        <form className="therapist-check-form">
            <label>
                First Name
                <input type="text" name="firstName" />
            </label>
            <label>
                Last Name
                <input type="text" name="lastName" />
            </label>
            <label>
                Email
                <input type="email" name="email" />
            </label>
            <label>
                Practice Name
                <input type="text" name="practiceName" />
            </label>
            <label>
                Practice Registration Password
                <input type="password" name="practiceName" />
            </label>
        </form>
        </>
    )

}
