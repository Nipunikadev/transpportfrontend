import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
//import Modal from 'react-modal';

function ViewVehicles() {
  const Navigate = useNavigate();
  const location = useLocation();
  const vehicleId = location.state?.id;
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [license, setLicense] = useState([]);
  const [Ownership, setOwnership] = useState('');
  const [registrationImage, setRegistrationImage] = useState([]);
  const [FuelType, setFuelType] = useState('');
  const [LeasedLiability, setLeasedLiability] = useState('');
  const [cylinderCapacity, setCylinderCapacity] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [insuranceCard, setInsuranceCard] = useState([]);
  const [taxPayer, setTaxPayer] = useState('');
  const [taxReceipts, setTaxReceipts] = useState([]);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (vehicleId) {
      axios.post("http://localhost:8081/vehicles/vehicleDetails/viewVehicles", {id: vehicleId, types: ['license', 'registrationImage', 'insuranceCard', 'taxReceipts']})
        .then((res) => {
          console.log("Entire server response:", res);
          if (res.data.success) {
            const vehicleData = res.data.vehicle || {};
            console.log("Successfully", vehicleData);

            // Set the state with the received data
            setVehicleType(vehicleData.vehicletype || "");
            setVehicleNumber(vehicleData.vehicleno || "");
            setOwnership(vehicleData.ownership || "");
            // setRegistrationImage(vehicleData.registrationImage || "");
            setFuelType(vehicleData.fuelType || "");
            setLeasedLiability(vehicleData.leasedliability || "");
            setCylinderCapacity(vehicleData.cylinderCapacity || "");
            setInsuranceCompany(vehicleData.insuranceCompany || "");
            setTaxPayer(vehicleData.taxPayer ? "Yes" : "No");

            //const contentType = res.headers['content-type'];

            // License image
            setLicense(vehicleData.license ? vehicleData.license.split(',') : []);

            // Registration image

            setRegistrationImage(vehicleData.registrationImage ? vehicleData.registrationImage.split(',') : []);
            // const registrationImageBuffer = Buffer.from(vehicleData.registrationImage, 'binary').toString('base64');
            // const registrationImage = `data:${contentType};base64,${registrationImageBuffer}`;
            // setRegistrationImage(registrationImage);

            // const insuranceCardImages = Array.isArray(vehicleData.insuranceCard) ? vehicleData.insuranceCard : [vehicleData.insuranceCard];
            // setInsuranceCard(insuranceCardImages);
            setInsuranceCard(vehicleData.insuranceCard ? vehicleData.insuranceCard.split(',') : []);

            // const taxReceiptsImages = Array.isArray(vehicleData.taxReceipts) ? vehicleData.taxReceipts : [vehicleData.taxReceipts];
            // setTaxReceipts(taxReceiptsImages);
            setTaxReceipts(vehicleData.taxReceipts ? vehicleData.taxReceipts.split(',') : []);
            

          } else {
            console.error("Failed to fetch vehicle data:", res.data.error);
          }
        })
        .catch((err) => {
          console.error("Error while fetching vehicle data:", err);
        });
    }
  }, [vehicleId]);

  const renderLicense = () => {
    if (license.length > 0) {
      return license.map((licenseUrl, index) => {
        const imageUrl = `http://localhost:8081/image/license/${licenseUrl}`;
        const fileExtension = licenseUrl.split(".").pop().toLowerCase();
  
        if (fileExtension === "pdf") {
          return (
            <div key={index} className="pdf">
              <a
                href={imageUrl}
                alt={`License ${index + 1}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF {index + 1}
              </a>
            </div>
          );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          // Assuming the license is an image
          return (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`License ${index + 1}`}
                style={{ width: "500px", height: "500px" }}
              />
            </div>
          );
        } else {
          return (
            <p key={index}>Unsupported file format for License {index + 1}</p>
          );
        }
      });
    }
  
    return <p>No license available</p>;
  };

  const renderRegistration = () => {

      if (registrationImage.length > 0) {
        return registrationImage.map((registrationUrl, index) => {
          const imageUrl = `http://localhost:8081/image/registrationImage/${registrationUrl}`;
          const fileExtension = registrationUrl.split(".").pop().toLowerCase();
    
        if (fileExtension === "pdf") {
          return (
            <div key={index} className="pdf">
                <a
                  href={imageUrl}
                  alt={`RegistrationImage ${index + 1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                View PDF {index + 1}
              </a>
            </div>
          );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          return (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`RegistrationImage ${index + 1}`}
                style={{ width: "500px", height: "500px" }}
              />
            </div>
          );
        } else {
          return (
            <p key={index}>Unsupported file format for Registration Certificate {index + 1}</p>
          );
        }
      });
    }
    
    return <p>No Registration Certificate available</p>;
  };
  
  
  const renderInsurance = () => {
    if (insuranceCard.length > 0) {
      return insuranceCard.map((insuranceCardUrl, index) => {
        const imageUrl = `http://localhost:8081/image/insuranceCard/${insuranceCardUrl}`;
        const fileExtension = insuranceCardUrl.split(".").pop().toLowerCase();
  
        if (fileExtension === "pdf") {
          return (
            <div key={index} className="pdf">
              <a
                href={imageUrl}
                alt={`InsuranceCard ${index + 1}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF {index + 1}
              </a>
            </div>
          );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          // Assuming the license is an image
          return (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`InsuranceCard ${index + 1}`}
                style={{ width: "500px", height: "500px" }}
              />
            </div>
          );
        } else {
          return (
            <p key={index}>Unsupported file format for Insurances {index + 1}</p>
          );
        }
      });
    }
  
    return <p>No Insurances available</p>;
  };

  const renderTax = () => {
    if (taxReceipts.length > 0) {
      return taxReceipts.map((taxUrl, index) => {
        const imageUrl = `http://localhost:8081/image/taxReceipts/${taxUrl}`;
        const fileExtension = taxUrl.split(".").pop().toLowerCase();
  
        if (fileExtension === "pdf") {
          return (
            <div key={index} className="pdf">
              <a
                href={imageUrl}
                alt={`TaxReceipts ${index + 1}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF {index + 1}
              </a>
            </div>
          );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          // Assuming the license is an image
          return (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`TaxReceipts ${index + 1}`}
                style={{ width: "500px", height: "500px" }}
              />
            </div>
          );
        } else {
          return (
            <p key={index}>Unsupported file format for Tax Receipts {index + 1}</p>
          );
        }
      });
    }
  
    return <p>No Taxes available</p>;
  };


  return (
    <div>
      <SideBar/>
    <form className="hidden-form">
      <div className="add-vehicle-form">
        <h2>View Vehicle Details</h2>
        <div className="viewVehicles">
        <label>
          Vehicle Number:
          <input type="text" value={vehicleNumber} readOnly />
        </label>
        <label>
          Vehicle Type:
          <input type="text" value={vehicleType} readOnly />
        </label>
        <label className="image">
            <fieldset style={{width: "800px"}}>
              License: {renderLicense()}
            </fieldset>
        </label>
        <label>
          Ownership:
          <input type="text" value={Ownership} readOnly />
        </label>
        <label className="image">
            <fieldset style={{width: "800px"}}>
            Vehicle Registration Certificate: {renderRegistration()}
            </fieldset>
        </label>
        <label>
          Fuel Type Vehicle:
          <input type="text" value={FuelType} readOnly />
        </label>
        <label>
          Place of Leased:
          <input type="text" value={LeasedLiability} readOnly />
        </label>
        <label>
          Cylinder Capasity:
          <input type="text" value={cylinderCapacity} readOnly />
        </label>
        <label>
          Vehicle Insurance Company:
          <input type="text" value={insuranceCompany} readOnly />
        </label>
        <label className="image">
          <fieldset style={{width: "800px"}}>
            Insurance Card: {renderInsurance()}
          </fieldset>
        </label>
        <label>
          Tax Payer?:
          <input type="text" value={taxPayer} readOnly />
        </label>
        <label className="image">
          <fieldset style={{width: "800px"}}>
            Tax Receipts: {renderTax()}
          </fieldset>
        </label>
       

        <br/>
        <button className="button-back" onClick={() => {Navigate("/vehicles/vehicleDetails");}}>
          BACK
        </button>
        </div>
      </div>  

    </form>
    </div>
  );
}

export default ViewVehicles;
