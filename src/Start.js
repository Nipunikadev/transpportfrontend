import React from "react";
import { useNavigate } from "react-router-dom";

function Start(){

    const Navigate = useNavigate();

    return(
        <form className='welcome-form'>
            <div className="form-inner">
                <div className="welcome">
                    <h2>Transport Management System</h2>
                    <button type="button" className="button-admin" onClick={() => {Navigate('/admin')}}>ADMIN</button>
                    <button type="button" className="button-user" onClick={() => {Navigate('/user')}}>USER</button>
                    <button type="button" className="button-driver" onClick={() => {Navigate('/driver')}}>DRIVER</button>
                </div>
            </div>
        </form>
    )

}

export default Start;