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
     let dNameEntered = false;
     let lNumEntered = false;
     let driverName = "";
     let licenseNum = "";
     // Remove all existing search results
     const existingResults = document.querySelectorAll("#searchResults");
     existingResults.forEach(result => {
          result.remove();
     });

     // Declare result variables to append to DOM
     const resultSect = document.querySelector("#results");
     const messageSect = document.querySelector("#message");
     // Get input query for name
     const driverNameElement = document.getElementById("name"); // Get user input
     driverName = driverNameElement.value.trim().toLowerCase();
     if(driverName !== "") { // Check if input field is entered
          dNameEntered = true;
     }
     // Get input query for license number
     const licenseNumElement = document.getElementById("license"); // Get user input
     licenseNum = licenseNumElement.value.trim().toLowerCase();
     if(licenseNum !== "") { // Check if input field is entered
          lNumEntered = true;
     }

     if(lNumEntered === dNameEntered) {
          messageSect.textContent = "Error";
          return;
     }
 
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
               const results = document.createElement("div");
               results.id = "searchResults";
               
               for (const person of arrPeople) {
                    // Create <li> elements for each field and populate them with the field value
                    const fields = ["PersonID", "Name", "Address", "DOB", "LicenseNumber", "ExpiryDate"];
                    fields.forEach(field => {
                         const li = document.createElement("li");
                         li.textContent = `${field}: ${person[field]}`; // Populate <li> with field value
                         results.appendChild(li); // Append <li> to <div>
                    });
               }
               resultSect.appendChild(results); // Append search result <div> to main section
          }
     }

     if(found === true) {
          messageSect.textContent = "Search successful";
     } else if (found === false) {
          messageSect.textContent = "No result found";
     } 
 }

async function updateVehicleResults() {
     let found = false;
     let regNum = "";
     // Remove all existing search results
     const existingResults = document.querySelectorAll("#searchResults");
     existingResults.forEach(result => {
          result.remove();
     });

     // Declare result variables to append to DOM
     const resultSect = document.querySelector("#results");
     const messageSect = document.querySelector("#message");
     // Get input query for registration number
     const regNumElement = document.getElementById("rego"); // Get user input
     regNum = regNumElement.value.trim().toLowerCase();

     if(regNum === "") { // Error if input is empty
          messageSect.textContent = "Error";
          return; 
     }
 
     const { data: arrVQuery, error: numSelErr } = await supabase
          .from("Vehicles")
          .select(); // Get name/license number data
     // Check if the input is a substring of any name
     for (const vQuery of arrVQuery) {
          let vRegNum = vQuery.VehicleID.toLowerCase();
          if (vRegNum.includes(regNum) && regNum !== "") {
               found = true;
               const { data: arrVehicles, error: allSelError } = await supabase.from("Vehicles").select().eq("VehicleID", vQuery.VehicleID);
               const results = document.createElement("div");
               results.id = "searchResults";
               
               for (const vehicle of arrVehicles) {
                    // Create <li> elements for each field and populate them with the field value
                    const fields = ["VehicleID", "Make", "Model", "Colour", "OwnerID"];
                    fields.forEach(field => {
                         const li = document.createElement("li");
                         li.textContent = `${field}: ${vehicle[field]}`; // Populate <li> with field value
                         results.appendChild(li); // Append <li> to <div>
                    });
               }
               resultSect.appendChild(results); // Append search result <div> to main section
          }
     }

     if (found == true) {
          messageSect.textContent = "Search successful";
     } else if (found === false) {
          messageSect.textContent = "No result found";
     } 
 }

async function addVehicleData() {
     let exists = false;
     let vID = null;
     let vMake = null;
     let vModel = null;
     let vColour = null;
     let vOwnerID = null;
     const messageSect = document.querySelector("#message");

     // // Remove extra fields (add owner related form)
     // const existingForms = document.querySelectorAll("#personForm");
     // existingForms.forEach(form => {
     //      form.remove();
     // });

     // Get all input queries from form
     const vIDEl = document.getElementById("rego");
     const vMakeEl = document.getElementById("make");
     const vModelEl = document.getElementById("model");
     const vColourEl = document.getElementById("colour");
     const vOwnerIDEl = document.getElementById("owner"); // Get user input
     
     vID = vIDEl.value.trim();
     vMake = vMakeEl.value.trim();
     vModel = vModelEl.value.trim();
     vColour = vColourEl.value.trim();
     vOwnerID = vOwnerIDEl.value.trim(); // Assign inputs to variables

     // Set empty values to null
     if (!vMake) vMake = null;
     if (!vModel) vModel = null;
     if (!vColour) vColour = null;
     if (!vOwnerID) vOwnerID = null;

     if (!vID || !vMake || !vModel || !vColour || ! vOwnerID) { // Check vehicle ID is entered
          alert("All fields are mandatory.");
          messageSect.textContent = "Error";
          return;
     }

     // Check if the owner ID exists
     const { data: arrOwners, error: checkErr } = await supabase
          .from("People")
          .select();
          
     for (const owner of arrOwners) {
          if (String(owner.PersonID) === String(vOwnerID)) {
               exists = true;
               break;
          }
     }

     if(exists === true) { // Add vehicle data if its owner exists
          const { error: addDataErr } = await supabase.from("Vehicles")
          .insert({
               VehicleID: vID,
               Make: vMake,
               Model: vModel,
               Colour: vColour,
               OwnerID: vOwnerID
          });
          messageSect.textContent = "Vehicle added successfully";
     } else {  // Redirect to add owner if owner doesn't exist
          alert("The owner does not exist, fill in new details to add");
          window.location.href = "add-person.html";
     }  
     // Reset input fields
     vIDEl.value = "";
     vMakeEl.value = "";
     vModelEl.value = "";
     vColourEl.value = "";
     vOwnerIDEl.value = "";
 }

async function addPersonData() {
     let pID = null;
     let pName = null;
     let pAddress = null;
     let pDOB = null;
     let pLicenseNum = null;
     let pExpiryDate = null;
     const messageSect = document.querySelector("#message");

     // Get all input queries from form
     const pIDEl = document.getElementById("personid");
     const pNameEl = document.getElementById("name");
     const pAddressEl = document.getElementById("address"); // Get user input
     const pDOBEl = document.getElementById("dob"); // Get user input
     const pLicenseNumEl = document.getElementById("license"); // Get user input
     const pExpiryDateEl = document.getElementById("expire"); // Get user input

     pID = pIDEl.value.trim();
     pName = pNameEl.value.trim();
     pAddress = pAddressEl.value.trim();
     pDOB = pDOBEl.value.trim();
     pLicenseNum = pLicenseNumEl.value.trim();
     pExpiryDate = pExpiryDateEl.value.trim(); // Assign inputs to variables

     if (!pID || !pName || !pAddress || !pDOB || !pLicenseNum || !pExpiryDate) { // Check vehicle ID is entered
          alert("Please enter all fields.");
          messageSect.textContent = "Error";
          return;
     }

     // Check if the person ID exists
     const exists = false;
     const { data: arrOwners, error: checkErr } = await supabase
          .from("People")
          .select();
              
     for (const owner of arrOwners) {
          if (String(owner.PersonID) === String(pID)) {
               exists = true;
               break;
          }
     }

     if(exists === false) { // Add person data if its person not added yet
          const { error: addDataErr } = await supabase.from("People")
          .insert({
               PersonID: pID,
               Name: pName,
               Address: pAddress,
               DOB: pDOB,
               LicenseNumber: pLicenseNum,
               ExpiryDate: pExpiryDate
          });
     } else {
          alert("This person already exists!");
          messageSect.textContent = "Error";
          return;
     }

     // Redirect back to vehicle form
     alert("Owner added, returning to add a vehicle form");
     window.location.href = "add-vehicle.html";

     // Reset fields
     pIDEl.value = "";
     pNameEl.value = "";
     pAddressEl.value = "";
     pDOBEl.value = "";
     pLicenseNumEl.value = "";
     pExpiryDateEl.value = "";
}