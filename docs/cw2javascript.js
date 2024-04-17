// After install the supabase-js module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create a single supabase client for interacting with your database
const supabase = createClient("https://digqlsccmsppgbanysko.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Fsc2NjbXNwcGdiYW55c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTA5MzcsImV4cCI6MjAyODQyNjkzN30.JFGokF0fDv9XndLlUIEwSu6b3U02gzY3dd0qhyr6Znw");

const btnPeopleQuery = document.getElementById("btnPeopleQuery");
if (btnPeopleQuery) {
    btnPeopleQuery.addEventListener("click", updatePeopleResults);
}

const btnVehicleQuery = document.getElementById("btnVehicleQuery");
if (btnVehicleQuery) {
    btnVehicleQuery.addEventListener("click", updateVehicleResults);
}

const btnAddVehicle = document.getElementById("btnAddVehicle");
if (btnAddVehicle) {
    btnAddVehicle.addEventListener("click", addVehicleData);
}

const btnAddPerson = document.getElementById("btnAddPerson");
if (btnAddPerson) {
    btnAddPerson.addEventListener("click", addPersonData);
}

async function updatePeopleResults() {
     let found = false;
     let driverName = "";
     let licenseNum = "";
     // Remove all existing search results
     const existingResults = document.querySelectorAll("#searchResultPeople");
     existingResults.forEach(result => {
          result.remove();
     });

     // Declare result variables to append to DOM
     const mainSect = document.querySelector("main");
     // Get input query for name
     const driverNameElement = document.getElementById("txtDriverName"); // Get user input
     driverName = driverNameElement.value.trim().toLowerCase();
     // Get input query for license number
     const licenseNumElement = document.getElementById("txtLicenseNum"); // Get user input
     licenseNum = licenseNumElement.value.trim().toLowerCase();
 
     const { data: arrPQuery, error: nameSelErr } = await supabase
          .from("People")
          .select(); // Get name/license number data
     // Check if the input is a substring of any name
     for (const pQuery of arrPQuery) {
          let pNameLower = pQuery.Name.toLowerCase();
          let pLicenseNumLower = pQuery.LicenseNumber.toLowerCase();
          if ((pNameLower.includes(driverName) && driverName !== "") || (pLicenseNumLower.includes(licenseNum) && licenseNum !== "")) {
               found = true;
               const { data: arrPeople, error: allSelErr } = await supabase.from("People").select().eq("Name", pQuery.Name || "LicenseNumber", pQuery.LicenseNumber);
               const results = document.createElement("ul");
               results.id = "searchResultPeople";
               
               for (const person of arrPeople) {
                    // Create <li> elements for each field and populate them with the field value
                    const fields = ["PersonID", "Name", "Address", "DOB", "LicenseNumber", "ExpiryDate"];
                    fields.forEach(field => {
                         const li = document.createElement("li");
                         li.textContent = `${field}: ${person[field]}`; // Populate <li> with field value
                         results.appendChild(li); // Append <li> to <ul>
                    });
               }
               mainSect.appendChild(results); // Append search result <div> to main section
          }
     }

     if (found === false) {
          const results = document.createElement("p");
          results.id = "searchResultPeople";
          results.textContent = "No matches found";
          mainSect.appendChild(results); // Append corresponding results
     } 
 }

async function updateVehicleResults() {
     let found = false;
     let regNum = "";
     // Remove all existing search results
     const existingResults = document.querySelectorAll("#searchResultVehicle");
     existingResults.forEach(result => {
          result.remove();
     });

     // Declare result variables to append to DOM
     const mainSect = document.querySelector("main");
     // Get input query for registration number
     const regNumElement = document.getElementById("txtRegNum"); // Get user input
     regNum = regNumElement.value.trim().toLowerCase();
 
     const { data: arrVQuery, error: numSelErr } = await supabase
          .from("Vehicles")
          .select(); // Get name/license number data
     // Check if the input is a substring of any name
     for (const vQuery of arrVQuery) {
          let vRegNum = vQuery.VehicleID.toLowerCase();
          if (vRegNum.includes(regNum) && regNum !== "") {
               found = true;
               const { data: arrVehicles, error: allSelError } = await supabase.from("Vehicles").select().eq("VehicleID", vQuery.VehicleID);
               const results = document.createElement("ul");
               results.id = "searchResultVehicle";
               
               for (const vehicle of arrVehicles) {
                    // Create <li> elements for each field and populate them with the field value
                    const fields = ["VehicleID", "Make", "Model", "Colour", "OwnerID"];
                    fields.forEach(field => {
                         const li = document.createElement("li");
                         li.textContent = `${field}: ${vehicle[field]}`; // Populate <li> with field value
                         results.appendChild(li); // Append <li> to <ul>
                    });
               }
               mainSect.appendChild(results); // Append search result <div> to main section
          }
     }

     if (found === false) {
          const results = document.createElement("p");
          results.id = "searchResultVehicle";
          results.textContent = "No matches found";
          mainSect.appendChild(results); // Append corresponding results
     } 
 }

async function addVehicleData() {
     let vID = null;
     let vMake = null;
     let vModel = null;
     let vColour = null;
     let vOwnerID = null;

     // Get all input queries from form
     const vIDEl = document.getElementById("txtVehicleID");
     const vMakeEl = document.getElementById("txtVehicleMake");
     const vModelEl = document.getElementById("txtVehicleModel"); // Get user input
     const vColourEl = document.getElementById("txtVehicleColour"); // Get user input
     const vOwnerIDEl = document.getElementById("txtVOwnerID"); // Get user input
     
     vID = vIDEl.value.trim();
     vMake = vMakeEl.value.trim();
     vModel = vModelEl.value.trim();
     vColour = vColourEl.value.trim();
     vOwnerID = vOwnerIDEl.value.trim(); // Assign inputs to variables

     if (!vID) { // Check vehicle ID is entered
          return;
     }

     // Check if the owner ID exists
     const exists = false;
     const { data: arrOwners, error: checkErr } = await supabase
          .from("People")
          .select();
          
     for (const owner of arrOwners) {
          console.log("arr id is " + owner.PersonID);
          if (owner.PersonID === vOwnerID) {
               console.log("returns true");
               exists = true;
          }
     }

     if(exists === true) { // Add vehicle data if its owner exists
          insertVehicle(vID, vMake, vModel, vColour, vOwnerID);
          console.log("vowner id existed");
     } else {  // Redirect to add owner if owner doesn't exist
          alert("The owner does not exist, redirecting to add owner information");
          //insertVehicle(vID, vMake, vModel, vColour, vOwnerID);
          console.log("vowner id didnt existed");
          window.location.href = "add-person.html";
     }  
     document.getElementById("vehicleForm").reset();
 }

async function insertVehicle(vehicleID, vehicleMake, vehicleModel, vehicleColour, vehicleOID) {
     const { error: addDataErr } = await supabase.from("Vehicles")
     .insert({
          VehicleID: vehicleID,
          Make: vehicleMake,
          Model: vehicleModel,
          Colour: vehicleColour,
          OwnerID: vehicleOID
     });
}

async function addPersonData() {
     let pID = null;
     let pName = null;
     let pAddress = null;
     let pDOB = null;
     let pLicenseNum = null;
     let pExpiryDate = null;

     // Get all input queries from form
     const pIDEl = document.getElementById("txtPersonID");
     const pNameEl = document.getElementById("txtPersonName");
     const pAddressEl = document.getElementById("txtPersonAddress"); // Get user input
     const pDOBEl = document.getElementById("txtPersonDOB"); // Get user input
     const pLicenseNumEl = document.getElementById("txtPersonLicenseNum"); // Get user input
     const pExpiryDateEl = document.getElementById("txtPersonExpiryDate"); // Get user input

     pID = pIDEl.value.trim();
     pName = pNameEl.value.trim();
     pAddress = pAddressEl.value.trim();
     pDOB = pDOBEl.value.trim();
     pLicenseNum = pLicenseNumEl.value.trim();
     pExpiryDate = pExpiryDateEl.value.trim(); // Assign inputs to variables

     if (!pID || !pName || !pAddress || !pDOB || !pLicenseNum || !pExpiryDate) { // Check vehicle ID is entered
          return;
     }

     // Check if the person ID exists
     const exists = false;
     const { data: arrOwners, error: checkErr } = await supabase
          .from("People")
          .select();
              
     for (const owner of arrOwners) {
          console.log("arr id is " + owner.PersonID);
          if (owner.PersonID === vOwnerID) {
               console.log("returns true");
               exists = true;
          }
     }

     if(exists === false) { // Add vehicle data if its owner exists
          insertPerson(pID, pName, pAddress, pDOB, pLicenseNum, pExpiryDate);
          console.log("Person id didnt existed");
     } else {
          console.log("Person id existed");
          alert("This person already exists!");
          document.getElementById("personForm").reset();
          return;
     }
     document.getElementById("personForm").reset();
}

async function insertPerson(personID, personName, personAddress, personDOB, personLicenseNum, personExpiryDate) {
     const { error: addDataErr } = await supabase.from("People")
     .insert({
          PersonID: personID,
          Name: personName,
          Address: personAddress,
          DOB: personDOB,
          LicenseNumber: personLicenseNum,
          pExpiryDate: personExpiryDate
     });
}

// async function checkPersonExists(personID) {
//      console.log("input to func id is " + personID);
//      const { data: arrOwners, error: checkErr } = await supabase
//           .from("People")
//           .select()
          
//      for (const owner of arrOwners) {
//           console.log("arr id is " + owner.PersonID);
//           if (String(owner.PersonID) === String(personID)) {
//                console.log("returns true");
//                return true;
//           }
//      }

//      console.log("returns false");
//      return false;
//  }