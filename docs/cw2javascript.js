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

// Helper function to remove page search results
function removeAllResults() {
     const existingResults = document.querySelectorAll("#searchResults");
     existingResults.forEach(result => {
          result.remove();
     });
}

// Helper function to return array of all people records
async function fetchAllPeopleData() {
     const { data: arrPAll, error: nameSelErr } = await supabase
     .from("People")
     .select();

     return arrPAll;
}

// Helper function to return array of all vehicle records
async function fetchAllVehicleData() {
     const { data: arrVAll, error: numSelErr } = await supabase
     .from("Vehicles")
     .select();

     return arrVAll;
}

// Helper function to check a specified owner exists based on id. Returns existence status
async function checkOwnerExists(id) {
     let exists = false;
     const arrOwners = await fetchAllPeopleData(); // Select all people data

     for (const owner of arrOwners) {
          if (String(owner.PersonID) === String(id)) {
               exists = true;
               break;
          }
     }

     return exists;
}

// Function for getting people search results based on driver name/license number query
async function updatePeopleResults() {
     let found = false;
     let dNameEntered = false;
     let lNumEntered = false;
     let driverName = "";
     let licenseNum = "";

     removeAllResults(); // Remove all existing search results

     // Get relevant DOM sections to use later
     const resultSect = document.querySelector("#results");
     const messageSect = document.querySelector("#message");
     // Get input query for name
     const driverNameElement = document.getElementById("name");
     driverName = driverNameElement.value.trim().toLowerCase();
     if(driverName !== "") { // Check if input field is entered
          dNameEntered = true;
     }

     // Get input query for license number
     const licenseNumElement = document.getElementById("license"); 
     licenseNum = licenseNumElement.value.trim().toLowerCase();
     if(licenseNum !== "") { // Check if input field is entered
          lNumEntered = true;
     }

     if(lNumEntered === dNameEntered) { // Return error if both are empty/entered
          messageSect.textContent = "Error";
          return;
     }
 
     const arrPAll = await fetchAllPeopleData(); // Get all people data

     for (const pQuery of arrPAll) { // Loop through each person record
          let pNameLower = pQuery.Name.toLowerCase();
          let pLicenseNumLower = pQuery.LicenseNumber.toLowerCase();
          // Check if the inputs are a substring of any driver name/license number
          if ((pNameLower.includes(driverName) && driverName !== "") || (pLicenseNumLower.includes(licenseNum) && licenseNum !== "")) {
               found = true;
               // Select all matching person data to use as the results array
               const { data: arrPeople, error: allSelErr } = await supabase.from("People").select().eq("Name", pQuery.Name || "LicenseNumber", pQuery.LicenseNumber);
               const results = document.createElement("div");
               results.id = "searchResults";
               
               for (const person of arrPeople) { // Loop through each person record in results array
                    const ul = document.createElement("ul");
                    const fields = ["PersonID", "Name", "Address", "DOB", "LicenseNumber", "ExpiryDate"];
                    // Create <li> elements for each field and populate them with the field value
                    fields.forEach(field => {
                         const li = document.createElement("li");
                         li.textContent = `${field}: ${person[field]}`; // Populate <li> with field value
                         ul.appendChild(li); // Append <li> to <ul>
                    });
                    results.appendChild(ul); // Append <ul> to <div>
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

// Function for getting vehicle search results based on registration number query
async function updateVehicleResults() {
     let found = false;
     let regNum = "";

     removeAllResults(); // Remove all existing search results

     // Get relevant DOM sections to use later
     const resultSect = document.querySelector("#results");
     const messageSect = document.querySelector("#message");

     // Get input query for registration number
     const regNumElement = document.getElementById("rego"); // Get user input
     regNum = regNumElement.value.trim().toLowerCase();

     if(regNum === "") { // Return error if both are empty/entered
          messageSect.textContent = "Error";
          return; 
     }
 
     const arrVAll = await fetchAllVehicleData(); // Get all vehicle data
     
     for (const vQuery of arrVAll) { // Loop through each vehicle record
          let vRegNum = vQuery.VehicleID.toLowerCase();
          // Check if the input is a substring of any name
          if (vRegNum.includes(regNum) && regNum !== "") {
               found = true;
               // Select all matching vehicle data to use as the results array
               const { data: arrVehicles, error: allSelError } = await supabase.from("Vehicles").select().eq("VehicleID", vQuery.VehicleID);
               const results = document.createElement("div");
               results.id = "searchResults";
               
               for (const vehicle of arrVehicles) { // Loop through each vehicle record in results array
                    const ul = document.createElement("ul");
                    const fields = ["VehicleID", "Make", "Model", "Colour", "OwnerID"];
                    fields.forEach(field => {
                         // Create <li> elements for each field and populate them with the field value
                         const li = document.createElement("li");
                         li.textContent = `${field}: ${vehicle[field]}`; // Populate <li> with field value
                         ul.appendChild(li); // Append <li> to <ul>
                    });
                    results.appendChild(ul); // Append <ul> to <div>
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

// Function for adding specified vehicle data based on the input form data
async function addVehicleData() {
     let exists = false;
     let vID = null;
     let vMake = null;
     let vModel = null;
     let vColour = null;
     let vOwnerID = null;
     const messageSect = document.querySelector("#message");

     // Get all input queries from form
     const vIDEl = document.getElementById("rego");
     const vMakeEl = document.getElementById("make");
     const vModelEl = document.getElementById("model");
     const vColourEl = document.getElementById("colour");
     const vOwnerIDEl = document.getElementById("owner");
     
     // Assign query inputs to variables
     vID = vIDEl.value.trim();
     vMake = vMakeEl.value.trim();
     vModel = vModelEl.value.trim();
     vColour = vColourEl.value.trim();
     vOwnerID = vOwnerIDEl.value.trim();

     // Set empty values to null
     if (!vMake) vMake = null;
     if (!vModel) vModel = null;
     if (!vColour) vColour = null;
     if (!vOwnerID) vOwnerID = null;

     // Check every field is entered, return error if not
     if (!vID || !vMake || !vModel || !vColour || ! vOwnerID) {
          alert("All fields are mandatory.");
          messageSect.textContent = "Error";
          return;
     }

     // Check if the owner ID exists in any owner record
     exists = await checkOwnerExists(vOwnerID);

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
     let exists = false;
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

     // Assign query inputs to variables
     pID = pIDEl.value.trim();
     pName = pNameEl.value.trim();
     pAddress = pAddressEl.value.trim();
     pDOB = pDOBEl.value.trim();
     pLicenseNum = pLicenseNumEl.value.trim();
     pExpiryDate = pExpiryDateEl.value.trim();

     // Check every field is entered, return error if not
     if (!pID || !pName || !pAddress || !pDOB || !pLicenseNum || !pExpiryDate) {
          alert("Please enter all fields.");
          messageSect.textContent = "Error";
          return;
     }
              
     // Check if the person ID exists in any person record
     exists = await checkOwnerExists(pID);

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