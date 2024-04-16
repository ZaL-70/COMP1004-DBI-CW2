// After install the supabase-js module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create a single supabase client for interacting with your database
const supabase = createClient("https://digqlsccmsppgbanysko.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Fsc2NjbXNwcGdiYW55c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTA5MzcsImV4cCI6MjAyODQyNjkzN30.JFGokF0fDv9XndLlUIEwSu6b3U02gzY3dd0qhyr6Znw");

const btnPeopleQuery = document.querySelector("btnPeopleQuery");
btnPeopleQuery.addEventListener("click", updatePeopleResults); // Add listener to people query button

const btnVehicleQuery = document.querySelector("btnVehicleQuery");
btnVehicleQuery.addEventListener("click", updateVehicleResults); // Add listener to people vehicle

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
 
     const { data: arrPQuery, error: nameSelError } = await supabase
          .from("People")
          .select(); // Get name/license number data
     // Check if the input is a substring of any name
     for (const pQuery of arrPQuery) {
          let pNameLower = pQuery.Name.toLowerCase();
          let pLicenseNumLower = pQuery.LicenseNumber.toLowerCase();
          if ((pNameLower.includes(driverName) && driverName !== "") || (pLicenseNumLower.includes(licenseNum) && licenseNum !== "")) {
               found = true;
               const { data: arrPeople, error: allSelError } = await supabase.from("People").select().eq("Name", pQuery.Name || "LicenseNumber", pQuery.LicenseNumber);
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
 
     const { data: arrVQuery, error: nameSelError } = await supabase
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