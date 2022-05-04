import React, { useState } from "react";
import Context from '../context';

function RegistrationForm({ mode, onRegister }) {

    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const { setMode } = React.useContext(Context);

    function submitHandler(event) {
        event.preventDefault();
        setMode({ "status": "Login", "task": null });
        onRegister(login, password);
    }

    function goToAuthorization() {
        setMode({ "status": "Login", "task": null });
    }

    return (
        <div>
            <div className="block"><h1>Sign up</h1></div>
            {localStorage.getItem("register_error") ?
                <div className="d-flex flex-row justify-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgb(192, 3, 3)" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                    <span className="error_message">{localStorage.getItem("register_error")}</span>
                </div>
                : <div></div>}
            <button className="file-link" onClick={goToAuthorization}>Sign in</button>
            <form id="form" onSubmit={submitHandler}>
                <div className="mb-3">
                    <input placeholder="login" onChange={event => setLogin(event.target.value)} type="text" name="user-login" className="form-control" />
                </div>
                <div className="mb-3">
                    <input placeholder="password" onChange={event => setPassword(event.target.value)} type="password" name="user-password" className="form-control" />
                </div>
                <div className="d-flex flex-row buttons">
                    <button type="submit" className="btn-success" >Sign up</button>
                </div>
            </form>
        </div >

    );
}

export default RegistrationForm;