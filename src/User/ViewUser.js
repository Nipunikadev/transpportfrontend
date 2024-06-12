import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function ViewUser(){

    const Navigate = useNavigate(); 
    const [user, setUser] = useState([]);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    
    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);
  
    useEffect(() => {
        axios.post('http://localhost:8081/admin/home/register/user/viewUser', {})
        .then(res => {
            if (res.data.success) {
                console.log("Sucessfully", res.data.user);
                setUser(res.data.user);
              } else {
                console.error("Failed to fetch User data:", res.data.error);
              }
        })
        .catch(err => {
            console.log(err);
        });                
    }, []);

    
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const deleteuser = (deleteUser) => {
          axios.post('http://localhost:8081/admin/home/register/user/deleteUser', deleteUser)
          .then((res) => {
            console.log('Server response:', res.data);
            if (res.data.success) {
                console.log("Sucessfully Deleted", res.data.user);
                setUser(res.data.user);
              } else {
                console.error("Failed to delete User data:", res.data.error);
              }
          })
          .catch((error) => {
            console.log(error);
          })
      };
    
      const handleDeleteClick = (id) => {
        const deleteUser = { id };
        console.log('Deleting User:', deleteUser);
        const isConfirmed = window.confirm('Are you sure you want to delete this User?');
      
        if (isConfirmed) {
          deleteuser(deleteUser);
        }
      };

  
    return(
        <div>
        <form className='admin-form' onSubmit={handleSubmit}>
            <div className='form-adminView'>
            <h2>User Details</h2>
            <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact</th>
                        <th>Email Address</th>
                        <th>User Name</th>
                    </tr>
                </thead>
                <tbody>
                {user.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.contact}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>
                    <button type="button" className="button-delete" onClick={() => handleDeleteClick(user.id, username)}>DELETE</button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>

            <button type="button" className="button-back" onClick={() => {Navigate('/admin/home/register', { state: { username } })}}>BACK</button>  

            <button type="button" className="button-logout" onClick={() => {Navigate('/admin')}}>LOGOUT</button>
            </div>
            
        </form>
        </div>

    )
}
export default ViewUser;