import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
// import { parseISO } from 'date-fns';
//import Modal from 'react-modal';

function EditVehicles() {
  const Navigate = useNavigate();
  const location1 = useLocation();
  const { username } = location1.state || { username: undefined };
  const location = useLocation();
  const vehicleId = location.state?.id;

  const [vehicleData, setVehicleData] = useState({
    vehicletype: '',
    vehicleno: '',
    license: [],
    ownership: '',
    registrationImage: [],
    fuelType: '',
    leasedliability: '',
    cylinderCapacity: '',
    insuranceCompany: '',
    insuranceCard: [],
    taxReceipts: [],
  });
  
  const [updatedVehicleNumber, setUpdatedVehicleNumber] = useState('');
  const [updatedVehicleType, setUpdatedVehicleType] = useState('');
  const [updatedOwnership, setUpdatedOwnership] = useState('');
  const [newRegistrationImage, setNewRegistrationImage] = useState([]);
  const [updatedFuelType, setUpdatedFuelType] = useState('');
  const [updatedLeased, setUpdatedLeased] = useState('');
  const [updatedCylinderCapacity, setUpdatedCylinderCapacity] = useState('');
  const [updatedInsuranceCompany, setUpdatedInsuranceCompany] = useState('');
  const [newLicense, setNewLicense] = useState([]);
  const [newInsurance, setNewInsurance] = useState([]);
  const [newTaxReceipts, setNewTaxReceipts] = useState([]);
  const [newtaxPayer, setNewTaxPayer] = useState('');
  //const formattedDate = updatedRegistrationDate ? format(updatedRegistrationDate, 'yyyy-MM-dd') : null;
  const [removedFiles, setRemovedFiles] = useState({
    license: [],
    registrationImage: [],
    insuranceCard: [],
    taxReceipts: [],
  });

  useEffect(() => {
    // Check if the user is logged in, if not, redirect to the login page
    if (!username) {
        Navigate('/admin');
    }
}, [username, Navigate]);
  
  useEffect(() => {
    if (vehicleId) {
      axios.post("http://localhost:8081/vehicles/vehicleDetails/viewVehicles", { id: vehicleId })
        .then((res) => {
          if (res.data.success) {
            const fetchedData = res.data.vehicle || {};
            setVehicleData({
              vehicletype: fetchedData.vehicletype || "",
              vehicleno: fetchedData.vehicleno || "",
              license: fetchedData.license ? fetchedData.license.split(',') : [],
              ownership: fetchedData.ownership || "",
              registrationImage: fetchedData.registrationImage ? fetchedData.registrationImage.split(',') : [],
              fuelType: fetchedData.fuelType || "",
              leasedliability: fetchedData.leasedliability || "",
              cylinderCapacity: fetchedData.cylinderCapacity || "",
              insuranceCompany: fetchedData.insuranceCompany || "",
              insuranceCard: fetchedData.insuranceCard ? fetchedData.insuranceCard.split(',') : [],
              taxPayer: fetchedData.taxPayer || "",
              taxReceipts: fetchedData.taxReceipts ? fetchedData.taxReceipts.split(',') : [],
            });
            setUpdatedVehicleType(fetchedData.vehicletype || "");
            setUpdatedVehicleNumber(fetchedData.vehicleno || "");
            setUpdatedOwnership(fetchedData.ownership || "");
            setNewRegistrationImage(fetchedData.registrationImage ? fetchedData.registrationImage.split(',') : [])
            setUpdatedFuelType(fetchedData.fuelType || "");
            setUpdatedLeased(fetchedData.leasedliability || "");
            setUpdatedCylinderCapacity(fetchedData.cylinderCapacity || "");
            setUpdatedInsuranceCompany(fetchedData.insuranceCompany || "");
            setNewLicense(fetchedData.license ? fetchedData.license.split(',') : []);
            setNewInsurance(fetchedData.insuranceCard ? fetchedData.insuranceCard.split(',') : []);
            setNewTaxPayer(fetchedData.taxPayer ? "Yes" : "No");
            setNewTaxReceipts(fetchedData.taxReceipts ? fetchedData.taxReceipts.split(',') : [])
          } else {
            console.error("Failed to fetch vehicle data:", res.data.error);
          }
        })
        .catch((err) => {
          console.error("Error while fetching vehicle data:", err);
        });
    }
  }, [vehicleId]);

  const handleFileChange = (type, e) => {
    const files = Array.from(e.target.files);
    console.log(`New ${type} Changed:`, files);

    switch(type) {
      case 'license':
        setNewLicense(prev => [...prev, ...files]);
        break;
      case 'registrationImage':
        setNewRegistrationImage(prev => [...prev, ...files]);
        break;
      case 'insuranceCard':
        setNewInsurance(prev => [...prev, ...files]);
        break;
      case 'taxReceipts':
        setNewTaxReceipts(prev => [...prev, ...files]);
        break;
      default:
        // Handle other types if necessary
    }
  };

  const handleRemoveFile = (type, index) => {
    // Update the corresponding state based on file type

    let removedItem;
    switch (type) {
      case 'license':
        removedItem = newLicense[index]; // Capture the removed item
        setNewLicense(prev => prev.filter((_, i) => i !== index));
        setRemovedFiles(prev => ({
          ...prev,
          license: [...prev.license, removedItem], // Add the removed item
        }));
        break;
      case 'registrationImage':
        removedItem = newRegistrationImage[index]; // Capture the removed item
        setNewRegistrationImage(prev => prev.filter((_, i) => i !== index));
        setRemovedFiles(prev => ({
          ...prev,
          registrationImage: [...prev.license, removedItem], // Add the removed item
        }));
        break;
      case 'insuranceCard':
        removedItem = newInsurance[index]; // Capture the removed item
        setNewInsurance(prev => prev.filter((_, i) => i !== index));
        setRemovedFiles(prev => ({
          ...prev,
          insuranceCard: [...prev.insuranceCard, removedItem], // Add the removed item
        }));
        break;
      case 'taxReceipts':
        removedItem = newTaxReceipts[index]; // Capture the removed item
        setNewTaxReceipts(prev => prev.filter((_, i) => i !== index));
        setRemovedFiles(prev => ({
          ...prev,
          taxReceipts: [...prev.taxReceipts, removedItem], // Add the removed item
        }));
        break;
      default:
        // Handle other types if necessary
    }
  };

  // const handleRegistrationFileChange = (registrationImage, e) => {
  //   if (registrationImage === 'registrationImage') {
  //     setNewRegistrationImage(e.target.files[0]);
  //   } 

  // }

  const handleEditVehicle = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('vehicletype', updatedVehicleType);
    formData.append('vehicleno', updatedVehicleNumber);
    newLicense.forEach(file => {
      formData.append('license', file);
    });
    formData.append('ownership', updatedOwnership);
    newRegistrationImage.forEach(file => {
      formData.append('registrationImage', file);
    });
    // if (newRegistrationImage) {
    //   formData.append('registrationImage', newRegistrationImage);
    // }
    formData.append('fuelType', updatedFuelType);
    formData.append('leasedliability', updatedLeased);
    formData.append('cylinderCapacity', updatedCylinderCapacity);
    formData.append('insuranceCompany', updatedInsuranceCompany);
    newInsurance.forEach(file => {
      formData.append('insuranceCard', file);
    });
    formData.append('taxPayer', newtaxPayer);
    newTaxReceipts.forEach(file => {
      formData.append('taxReceipts', file);
    });

    Object.keys(removedFiles).forEach((fileType) => {
      removedFiles[fileType].forEach((fileName) => {
        formData.append(`removedFiles[${fileType}][]`, fileName);
      });
    });

    //formData.append('registrationDate', updatedRegistrationDate ? updatedRegistrationDate.toISOString().split('T')[0] : '');
    
    axios.post(`http://localhost:8081/vehicles/vehicleDetails/editVehicles/${vehicleId}`, formData)
      .then((res) => {
        console.log('Response from editVehicles:', res.data);
        if (res.data.success) {
          Navigate("/vehicles/vehicleDetails", { state: { username } }); // Redirect to the vehicle maintenance page
          alert('Vehicle Details Updated successfully');
        } else {
          console.error('Failed to edit the vehicle:', res.data.error);
        }
      })
      .catch((error) => {
        console.error('Failed to edit Vehicle Details', error);
      });
  };

  const renderFile = (type) => {
    const existingFiles = vehicleData[type].filter(file => 
      !removedFiles[type].includes(file) // Exclude files marked for removal
    );
  
    return (
      <div>
        {Array.isArray(existingFiles) && existingFiles.length > 0 && existingFiles.map((file, index) => {
          // Logic to render existing files
          const fileExtension = file.split(".").pop().toLowerCase();
          if (fileExtension === "pdf") {
            return (
              <div key={index}>
                <a href={`http://localhost:8081/image/${type}/${file}`} target="_blank" rel="noopener noreferrer">View PDF {index + 1}</a>
                <button type="button" className="button-remove" onClick={() => handleRemoveFile(type, index)}>Remove</button>
              </div>
            );
          } else {
            return (
              <div key={index}>
                <img src={`http://localhost:8081/image/${type}/${file}`} alt={`${type} ${index + 1}`} style={{ width: "500px", height: "500px" }} />
                <button type="button" className="button-remove" onClick={() => handleRemoveFile(type, index)}>Remove</button>
              </div>
            );
          }
        })}
      <br/>
        <div>
        {/* Input for adding new files */}
          <input type="file" onChange={(e) => handleFileChange(type, e)} multiple />
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <SideBar username={username} />
    <form className="hidden-form" onSubmit={handleEditVehicle}>
      <div className="edit-vehicle-form">
        <h2>Edit Vehicle Details</h2>
        <div className="editVehicles">
        <label htmlFor="vehicletype">
          Vehicle Type:
          <input
            type="text"
            id="vehicletype"
            name="vehicletype"
            value={updatedVehicleType}
            onChange={(e) => setUpdatedVehicleType(e.target.value)} readOnly/>
        </label>
        <label htmlFor="vehicleno">
          Vehicle Number:
          <input
            type="text"
            id="vehicleno"
            name="vehicleno"
            value={updatedVehicleNumber}
            onChange={(e) => setUpdatedVehicleNumber(e.target.value)} readOnly/>
        </label>
        <label>
        <fieldset style={{width: "800px"}}>
          License:
          {renderFile('license')}
        </fieldset>
        </label>
        <label htmlFor="ownership">
          Vehicle Ownership:
          <input
            type="text"
            id="ownership"
            name="ownership"
            value={updatedOwnership}
            onChange={(e) => setUpdatedOwnership(e.target.value)}
            />
        </label>
        {/* <label>
          <fieldset style={{width: "800px"}}>
          Registration Certificate:
          {renderRegistrationImage('registrationImage')}
          </fieldset>
        </label> */}
        <label>
        <fieldset style={{width: "800px"}}>
          Registration Certificate:
          {renderFile('registrationImage')}
        </fieldset>
        </label>
        <label htmlFor="fueltype">
          Vehicle Fuel Type:
          <input
            type="text"
            id="fueltype"
            name="fueltype"
            value={updatedFuelType}
            onChange={(e) => setUpdatedFuelType(e.target.value)}
            />
        </label>
        <label htmlFor="company">
          Vehicle Leasing Company:
          <input
            type="text"
            id="company"
            name="company"
            value={updatedLeased}
            onChange={(e) => setUpdatedLeased(e.target.value)}
            />
        </label>
        <label htmlFor="capacity">
          Vehicle Cylinder Capacity:
          <input
            type="text"
            id="capacity"
            name="capacity"
            value={updatedCylinderCapacity}
            onChange={(e) => setUpdatedCylinderCapacity(e.target.value)}
            />
        </label>
        <label htmlFor="insurancecompany">
          Vehicle Insurance Company:
          <input
            type="text"
            id="insurancecompany"
            name="insurancecompany"
            value={updatedInsuranceCompany}
            onChange={(e) => setUpdatedInsuranceCompany(e.target.value)}
            />
        </label>
        <label>
          <fieldset style={{width: "800px"}}>
          Insurance card:
          {renderFile('insuranceCard')}
          </fieldset>
        </label>
        <label htmlFor="taxPayer">
          Tax Payer:
          <input
            type="text"
            id="taxPayer"
            name="taxPayer"
            value={newtaxPayer}
            onChange={(e) => setNewTaxPayer(e.target.value)} readOnly/>
        </label>
        {newtaxPayer === 'Yes' && (
        <label>
        <fieldset style={{width: "800px"}}>
          Tax Receipts:
          {renderFile('taxReceipts')}
          </fieldset>
        </label>
         )}
        <button type="submit" className="button-submit">UPDATE VEHICLE DETAILS</button>
        <button type="button" className="button-back" onClick={() => {Navigate("/vehicles/vehicleDetails", { state: { username } })}}>
          BACK
        </button>
        </div>
      </div>  

    </form>
    </div>
  );
}

export default EditVehicles;
