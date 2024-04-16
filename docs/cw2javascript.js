// After install the supabase-js module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create a single supabase client for interacting with your database
const supabase = createClient("https://digqlsccmsppgbanysko.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Fsc2NjbXNwcGdiYW55c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTA5MzcsImV4cCI6MjAyODQyNjkzN30.JFGokF0fDv9XndLlUIEwSu6b3U02gzY3dd0qhyr6Znw");

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", updateResults);    // Add listener to button

//const results = document.getElementById("results"); // Results output textbox

async function updateResults() {
     let driverName = ""
     let foundPerson = null; // Initialize foundPerson variable outside the loop
     const driverNameElement = document.getElementById("driverName"); // Get user input
     driverName = driverNameElement.value;
 
     const { data: arrNames, error: nameSelError } = await supabase.from("People").select("Name"); // Get name data
 
     for (const person of arrNames) { // Check if the input is a substring of any name
         if (person.Name.includes(driverName) && driverName !== "") {
             foundPerson = person; // Set variable to full name (to be used for select condition)
             break;
         }
     }
 
     console.log(foundPerson);
 
     if (foundPerson !== null) { // Check if a person was found
         const { data: output, error: allSelError } = await supabase.from("People").select().eq("Name", foundPerson.Name);
         const sect = document.querySelector("main");
         const results = document.createElement("p");
         results.textContent = JSON.stringify(output)
         sect.appendChild(results);
         //results.value = JSON.stringify(output);
     } else {
          const sect = document.querySelector("main");
         const results = document.createElement("p");
         results.textContent = "No matches found";
         sect.appendChild(results);
         //results.value = "No matches";
     }
 }
