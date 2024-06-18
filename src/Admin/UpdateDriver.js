import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function UpdateDriver() {

  const Navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const [driverData, setDriverData] = useState({
      firstname: '',
      lastname: '',
      nic: '',
      contact: '',
      drivingLicense: [],
    });

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newNic, setNewNIC] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newDrivingLicense, setNewDrivingLicense] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [usernameList, setUserNameList] = useState([])
  const [error, setError] = useState('');
  const [removedFiles, setRemovedFiles] = useState({ drivingLicense: [] });

  useEffect(() => {
    // Check if the user is logged in, if not, redirect to the login page
    if (!username) {
        Navigate('/admin');
    }
}, [username, Navigate]);

  const handleVehicleChange = (event) => {
    const value = event.target.value;
    setSelectedUserName(value);
      // Clear the text field value if a different option is selected
  };

    useEffect(() => {
      axios.post('http://localhost:8081/admin/home/register/driver/updateDriver/dropdown')
        .then((response) => {
            if (response.data.success) {
                setUserNameList(response.data.drivers);
                if (username && response.data.drivers.includes(username)) {
                  setSelectedUserName(username);
                }
            }
        })
        .catch(err => {
            console.log("Error Add DropDown Details", err);
        });
    }, [username]);

      useEffect(() => {
        if (!selectedUserName) return;
        axios.post("http://localhost:8081/admin/home/register/driver/updateDriver", { username: selectedUserName })
          .then((res) => {
            if (res.data.success) {
              const fetchedData = res.data.driver || {};
              setDriverData({
                firstname: fetchedData.firstname || "",
                lastname: fetchedData.lastname || "",
                nic: fetchedData.nic || "",
                contact: fetchedData.contact || "",
                drivingLicense: fetchedData.drivingLicense ? fetchedData.drivingLicense.split(',') : [],
              });
              setNewFirstName(fetchedData.firstname || "");
              setNewLastName(fetchedData.lastname || "");
              setNewNIC(fetchedData.nic || "");
              setNewContact(fetchedData.contact || "");
              setNewDrivingLicense(fetchedData.drivingLicense ? fetchedData.drivingLicense.split(',') : [])
            } else {
              console.error("Failed to fetch driver data:", res.data.error);
            }
          })
          .catch((err) => {
            console.error("Error while fetching driver data:", err);
          });
    }, [selectedUserName]);

    const handleDrivingLicenseChange = (e) => {
      const file = e.target.files[0];
    if (file) {
        setNewDrivingLicense(prev => [...prev, file]);
    }
    }

  const handleRemoveDrivingLicense = (index) => {
    const fileToRemove = newDrivingLicense[index];
    setRemovedFiles(prev => ({
        ...prev,
        drivingLicense: [...prev.drivingLicense, fileToRemove]
    }));
    setNewDrivingLicense(prev => prev.filter((_, i) => i !== index));
  };

    const handleEditDriver = (e) => {
      e.preventDefault();
       console.log("handleEditDriver is called"); 
      const formData = new FormData();
      formData.append('firstname', newFirstName);
      formData.append('lastname', newLastName);
      formData.append('nic', newNic);
      formData.append('contact', newContact);
      newDrivingLicense.forEach(file => {
        if (typeof file === 'string') {
            formData.append('drivingLicense', file);
        } else {
            formData.append('drivingLicense', file, file.name);
        }
    });

    removedFiles.drivingLicense.forEach(file => {
      formData.append('removedFiles[drivingLicense]', file);
  });
  
      //formData.append('registrationDate', updatedRegistrationDate ? updatedRegistrationDate.toISOString().split('T')[0] : '');
      
      axios.post(`http://localhost:8081/admin/home/register/driver/updateDriver/editDriverRecords/${selectedUserName}`, formData)
        .then((res) => {
          console.log('Response from edit Driver:', res.data);
          if (res.data.success) {
            Navigate("/admin/home/register", { state: { username } }); // Redirect to the vehicle maintenance page
            alert('Driver Details Updated successfully');
          } else {
            console.error('Failed to edit the driver:', res.data.error);
          }
        })
        .catch((error) => {
          console.error('Failed to edit Driver Details', error);
          setError('Failed to update driver details. Please try again.');
        });
    };


    const renderFile = () => {

      const drivingLicenses = Array.isArray(driverData.drivingLicense)
      ? driverData.drivingLicense
      : [driverData.drivingLicense];

      // const drivingLicenses = Array.isArray(driverData.drivingLicense) ?
      // driverData.drivingLicense.filter(file => !removedFiles.drivingLicense.includes(file)) : [];


        return (
          <div>
            {Array.isArray(drivingLicenses) && drivingLicenses.length > 0 && drivingLicenses.map((license, index) => {
            const fileExtension = license?.split(".").pop().toLowerCase();
            if (fileExtension === "pdf") {
              return (
              <div key={index}>
              <a href={`http://localhost:8081/image/drivingLicense/${license}`} target="_blank" rel="noopener noreferrer">View PDF {index + 1}</a>
              <button type="button" className="button-remove" onClick={() => handleRemoveDrivingLicense(index)}>Remove</button>
            </div>
            );
          } else {
            return (
            <div key={index}>
              <img src={`http://localhost:8081/image/drivingLicense/${license}`} alt="Driving License" style={{ width: "500px", height: "500px" }} />
              <button type="button" className="button-remove" onClick={() => handleRemoveDrivingLicense(index)}>Remove</button>
            </div>
           );
          }
        })}
        <br/>
        <div>
          <input type="file" id="file" name="file" onChange={handleDrivingLicenseChange} />
        </div>
      </div>
      );
    };


    const reset =  (e) => {
      e.preventDefault();
      setSelectedUserName('');
      setDriverData({
        firstname: '',
        lastname: '',
        nic: '',
        contact: '',
        drivingLicense: [],
      });
      setNewFirstName('');
      setNewLastName('');
      setNewNIC('');
      setNewContact('');
      setNewDrivingLicense([]);
      setRemovedFiles({ drivingLicense: [] });
    };

    return (
      <form className="hidden-form" onSubmit={handleEditDriver} >
          <div className="edit-driver-form">
              <h2>Edit Driver Details</h2>
              <div className="driver-dropdown">
                    <label htmlFor="username">User Name: </label>
                        <select id="username" value={selectedUserName} onChange={handleVehicleChange}>
                        <option value="">Choose Driver User Name</option>
                        {usernameList.length > 0 &&(
                            usernameList.map(number => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))
                        )}
                        </select>
                </div>
                  <div className="label">
                      <label htmlFor="firstname">
                      First Name:
                      <input
                          type="text"
                          id="firstname"
                          name="firstname"
                          value={newFirstName}
                          onChange={(e) => setNewFirstName(e.target.value)} />
                      </label>
                  </div>
                  <div className="label">
                      <label htmlFor="lastname">
                      Last Name:
                      <input
                          type="text"
                          id="lastname"
                          name="lastname"
                          value={newLastName}
                          onChange={(e) => setNewLastName(e.target.value)} />
                      </label>
                  </div>
                  <div className="label">
                      <label htmlFor="nic">
                          NIC Number:
                      <input
                          type="text"
                          id="nic"
                          name="nic"
                          value={newNic}
                          onChange={(e) => setNewNIC(e.target.value)} />
                      </label>
                  </div>
                  <div className="label">
                      <label htmlFor="contact">
                          Contact Number:
                      <input
                          type="text"
                          id="contact"
                          name="contact"
                          value={newContact}
                          onChange={(e) => setNewContact(e.target.value)} />
                      </label>
                  </div>
                  <div className="label">
                      <label htmlFor="file">
                          <fieldset style={{width: "800px"}}>
                          Driving License:
                          {renderFile('drivingLicense')}
                          </fieldset>
                      </label>
                  </div>
                  {error && <p className="error-message">{error}</p>}
              <button type="submit" className="button-submit">Updated Driver Records</button>

              <button type="button" className="button-reset" onClick={reset}>RESET</button>
              
              <button type="button" className="button-cancel" onClick={() => {Navigate("/admin/home/register", { state: { username } })}}>Cancel</button>
          </div>
      </form>
  );

}
export default UpdateDriver;