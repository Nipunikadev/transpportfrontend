import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "./SideBar";


function AddVehicleForm({ isOpen, onClose, addVehicle, vehicleId}) {

    const [vehicleType, setVehicleType] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [Ownership, setOwnership] = useState('');
    const [RegistrationImage, setRegistrationImage] = useState([]);
    const [fuelType, setFuelType] = useState('');
    const [LeasedLiability, setLeasedLiability] = useState('');
    const [licenseImage, setLicenseImage] = useState([]);
    const [cylinderCapacity, setCylinderCapacity] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insuranceCardImage, setInsuranceCardImage] = useState([]);
    const [taxReceipts, setTaxReceipts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('Yes'); 
    const [dragging, setDragging] = useState(false);
   

    const onSelect = ({target: {value} }) => {
      setSelectedOption(value);
  }

  const isChecked = (value) => value === selectedOption;

  // Function to handle file drop
  const handleDrop = (e, imageType) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageChange({ target: { files } }, imageType);
  };

  // Function to handle file drag over
  const handleDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
  };

  // Function to handle file drag leave
  const handleDragLeave = () => {
      setDragging(false);
  };
    
    const handleImageChange = (e, imageType) => {
      const files = Array.from(e.target.files);
      if (imageType === 'license') {
        setLicenseImage(files);
      } else if (imageType === 'registrationImage') {
        setRegistrationImage(files);
      } else if (imageType === 'insuranceCard') {
        setInsuranceCardImage(files);
      } else if (imageType === 'taxReceipts') {
        setTaxReceipts(files);
      }
    };
  
    const handleUpload = (e) => {
      e.preventDefault(); 
      const formData = new FormData();
      formData.append('vehicleno', vehicleNumber);
      formData.append('vehicletype', vehicleType);
      formData.append('ownership', Ownership);
      formData.append('fuelType', fuelType);
      formData.append('leasedliability', LeasedLiability);
      formData.append('cylinderCapacity', cylinderCapacity);
      formData.append('insuranceCompany', insuranceCompany);
      formData.append('taxPayer', selectedOption === 'Yes' ? 1 : 0);
      licenseImage.forEach(file => formData.append('license', file));
      RegistrationImage.forEach(file => formData.append('registrationImage', file));
      insuranceCardImage.forEach(file => formData.append('insuranceCard', file));
      taxReceipts.forEach(file => formData.append('taxReceipts', file));
    
      axios.post('http://localhost:8081/vehicles/vehicleDetails/add-vehicle', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.success) {
          const newVehicle = res.data.vehicle;
          if (newVehicle && newVehicle.vehicleno) {
            console.log('Vehicle Details uploaded successfully');
            alert('Successfully Added Vehicle Details');
            addVehicle(newVehicle);
            onClose();
            reset();
          } else {
            console.error('Failed to add the vehicle: Vehicle details are missing');
            alert('Failed to add the vehicle: Vehicle details are missing');
          }
        } else {
          console.error('Failed to add the vehicle:', res.data.error);
          alert(res.data.error);
        }
      })
      .catch((error) => {
        console.error('Failed to upload Vehicle Details', error);
        alert('Failed to upload Vehicle Details. Please try again.'); 
      });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const newVehicle = {
          vehicleno: vehicleNumber,
          vehicletype: vehicleType,
          ownership: Ownership,
          fuelType: fuelType,
          leasedliability: LeasedLiability,
          cylinderCapacity: cylinderCapacity,
          insuranceCompany: insuranceCompany,
          taxPayer: selectedOption,
        };

        addVehicle(newVehicle);

        setVehicleNumber('');
        setVehicleType('');
        setOwnership('');
        setFuelType('');
        setLeasedLiability('');
        setCylinderCapacity('');
        setInsuranceCompany('');
        setSelectedOption('');
        onClose();
    };

    const reset =  () => {
      setVehicleNumber('');
      setVehicleType('');
      setOwnership('');
      setRegistrationImage([]);
      setFuelType('');
      setLeasedLiability('');
      setCylinderCapacity('');
      setInsuranceCompany('');
      setLicenseImage([]);
      setInsuranceCardImage([]);
      setTaxReceipts([]);
      setSelectedOption('Yes');
    }
  
    const renderFileNames = (files) => {
      return Array.isArray(files) && files.length > 0
        ? files.map((file, index) => <div key={index}>{file.name}</div>)
        : <p>Drop files here or click to upload</p>;
    };

    return (
        <form className="hidden-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={`add-vehicle-form ${isOpen ? 'open' : 'closed'}`}>
        <h2>Add Vehicle</h2>
        <fieldset className="fieldSet">
        <div className="label">
          <label htmlFor="vehicleno">Vehicle Number:
            <input id="vehicleno" name="vehicleno" type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required="required"/>
          </label>
          </div>
        <div className="label">
          <label htmlFor="vehicleType">Vehicle Type:
            <input id="vehicleType" name="vehicleType" type="text" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required="required"/>
          </label>
          </div>
          <div className="label">
          <label htmlFor="license">Revenue License:
          <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDrop={(e) => handleDrop(e, 'license')} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                {renderFileNames(licenseImage)}
                <input id="license" name="license" type="file" onChange={(e) => handleImageChange(e, 'license')} multiple />
              </div>
          </label>
          </div>
          <div className="label">
          <label htmlFor="ownership">Ownership of Vehicle:
            <input
              type="text"
              id="ownership"
              name="ownership"
              value={Ownership}
              onChange={(e) => setOwnership(e.target.value)}/>
          </label>
          </div>
          <div className="label">
            <label htmlFor="registrationImage">Registration Image:
              <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDrop={(e) => handleDrop(e, 'registrationImage')} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                {renderFileNames(RegistrationImage)}
                <input id="registrationImage" name="registrationImage" type="file" onChange={(e) => handleImageChange(e, 'registrationImage')} multiple />
              </div>
            </label>
          </div>
          <div className="fuel-dropdown">
            <label htmlFor="fuelType">Fuel Type:
              <select id="fuelType" value={fuelType} onChange={(event) => setFuelType(event.target.value)}>
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </label>
          </div>
          <div className="label">
          <label htmlFor="lease">Leased Company
            (If no please mension 'No')
            <input id="lease" name="lease" type="text" value={LeasedLiability} onChange={(e) => setLeasedLiability(e.target.value)}/>
          </label>
          </div>
          <div className="label">
          <label htmlFor="capacity">Cylinder Capacity of Vehicle:
            <input id="capacity" name="capacity" type="text" value={cylinderCapacity} onChange={(e) => setCylinderCapacity(e.target.value)}/>
          </label>
          </div>
          <div className="label">
          <label htmlFor="company">Insurance Comapany:
            <input id="company" name="company" type="text" value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)}/>
          </label>
          </div>
          <div className="label">
            <label htmlFor="insuranceCard">Insurance card:
              <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDrop={(e) => handleDrop(e, 'insuranceCard')} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                {renderFileNames(insuranceCardImage)}
                <input id="insuranceCard" name="insuranceCard" type="file" onChange={(e) => handleImageChange(e, 'insuranceCard')} multiple />
              </div>
            </label>
          </div>
          <div className="label">
          <label><span className="chekmark">Tax Payer?</span>
          <div className="form-radio">
            <input id="taxPayerYes" name="selectedOption" value="Yes" type="radio" checked={isChecked("Yes")} onChange={onSelect} className="hidden-radio"/>
            <label htmlFor="taxPayerYes" className="Yes">Yes: </label>

            <input id="taxPayerNo" name="selectedOption" value="No" type="radio" checked={isChecked("No")} onChange={onSelect} className="hidden-radio"/>
            <label htmlFor="taxPayerNo" className="No">No: </label>
          </div>
          </label>
          </div>
          {
            selectedOption === 'Yes' && (
          <div className="label">
          <label htmlFor="taxReceipt">
            Tax Receipts (if any):
              <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDrop={(e) => handleDrop(e, 'taxReceipts')} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                {renderFileNames(taxReceipts)}
                <input id="taxReceipt" name="taxReceipt" type="file" onChange={(e) => handleImageChange(e, 'taxReceipts')} multiple />
              </div>
          </label>
          </div>
           )}
          </fieldset>
          <button className="button-submit" type="submit" onClick={handleUpload}>Add Vehicle</button>

          <button type="button" className="button-reset" onClick={reset}>RESET</button>
        
        <button type="button" className="button-close" onClick={onClose}>Close</button>
        </div>
        </form>
    );
}


function VehicleDetails(){

    const Navigate = useNavigate(); 
    const [vehicles, setVehicles] = useState([]);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    
    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);
  
    useEffect(() => {
        axios.post('http://localhost:8081/vehicles/vehicleDetails', {})
        .then(res => {
            if (res.data.success) {
                console.log("Sucessfully", res.data.vehicles);
                setVehicles(res.data.vehicles);
              } else {
                console.error("Failed to fetch vehicle data:", res.data.error);
              }
        })
        .catch(err => {
            console.log(err);
        });                
    }, []);

     const openAddForm = (e) => {
        e.preventDefault();
        setIsAddFormOpen(true);
    };
    
    const closeAddForm = () => {
        setIsAddFormOpen(false);
    };

    const addVehicle = (newVehicle) => {
      setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
    };

  const deletevehicle = (deleteVehicle) => {
    console.log('Deleting vehicle:', deleteVehicle);
      axios.post('http://localhost:8081/vehicles/vehicleDetails/delete-vehicle', deleteVehicle)
      .then((response) => {
        console.log('Server response:', response.data);
        if (response.data.loginStatus) {
          setVehicles((prevVehicles) =>
            prevVehicles.filter((vehicle) => vehicle.id !== deleteVehicle.id)
          );
          Navigate('/vehicles/vehicleDetails/deletedVehicles', {  state: { deletedVehicleDetails: [deleteVehicle] , username} });
        } else {
          console.error('Failed to delete the vehicle. Server response:', response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to Delete the vehicle:", error);
      })
  };

  const handleDeleteClick = (id) => {
    const deleteVehicle = { id };
    console.log('Deleting vehicle:', deleteVehicle);
    const isConfirmed = window.confirm('Are you sure you want to delete this vehicle?');
  
    if (isConfirmed) {
      deletevehicle(deleteVehicle);
    }
  };

  const handleDeletedVehiclesClick = () => {
    console.log("Navigating to deleted vehicles");
    Navigate('/vehicles/vehicleDetails/deletedVehicles', {state: {username}});
  };

  
    return(
        <div>
          <SideBar username={username} />
        <form className='vehicle-form' onSubmit={handleSubmit}>
            <div className={`form-inner ${isAddFormOpen ? 'blur-background' : ''}`}>
            <h2>Vehicle Details</h2>
            <button type="button" className="add" onClick={openAddForm}>ADD +</button>
            <button type="button" className='delete' onClick={handleDeletedVehiclesClick}>DELETED VEHICLES</button>
            <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Vehicle Number</th>
                        <th>Vehicle Type</th>
                    </tr>
                </thead>
                <tbody>
                {vehicles.map((vehicle, index) => (
                  <tr key={vehicle.id}>
                    <td>{index + 1}</td>
                    <td>{vehicle.vehicleno}</td>
                    <td>{vehicle.vehicletype}</td>
                    <td>
                    <button type="button" className="button-edit" onClick={() => {Navigate('/vehicles/vehicleDetails/editVehicles', { state: { id: vehicle.id , username} })}}>EDIT</button>
                    </td>
                    <td>
                    <button type="button" className="button-delete" onClick={() => handleDeleteClick(vehicle.id, username)}>DELETE</button>
                    </td>
                    <td>
                    <button type="button" className="button-view"onClick={() => {Navigate('/vehicles/vehicleDetails/viewVehicles', { state: { id: vehicle.id, username } })}}>VIEW MORE</button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>

            <button type="button" className="button-back" onClick={() => {Navigate('/admin/home', { state: { username } })}}>BACK</button>  

            <button type="button" className="button-logout" onClick={() => {Navigate('/admin')}}>LOGOUT</button>
            </div>
            
        </form>
            {isAddFormOpen && (
            <AddVehicleForm isOpen={isAddFormOpen} onClose={closeAddForm} addVehicle={addVehicle} />
            )}

            {/* {isEditFormOpen && (
            <EditVehicleForm isOpen={isEditFormOpen} onClose={closeEditForm} editVehicle={editVehicle} vehicleId={editVehicleId} />
            )} */}
        </div>

    )
}
export default VehicleDetails;