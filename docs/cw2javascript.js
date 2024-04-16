// After install the supabase-js module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create a single supabase client for interacting with your database
const supabase = createClient("https://digqlsccmsppgbanysko.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Fsc2NjbXNwcGdiYW55c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTA5MzcsImV4cCI6MjAyODQyNjkzN30.JFGokF0fDv9XndLlUIEwSu6b3U02gzY3dd0qhyr6Znw");

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", updateResults); // Add listener to button

async function updateResults() {
     let found = false;
     let driverName = "";
     // Remove all existing search results
     const existingResults = document.querySelectorAll("#searchResults");
     existingResults.forEach(result => {
          result.remove();
     });

     // Declare result variables to append to DOM
     const mainSect = document.querySelector("main");
     // Create variable for users query (for person name)
     const driverNameElement = document.getElementById("driverName"); // Get user input
     driverName = driverNameElement.value.trim();
 
     const { data: arrNames, error: nameSelError } = await supabase
          .from("People")
          .select("Name"); // Get name data
     // Check if the input is a substring of any name
     for (const person of arrNames) {
         if (person.Name.includes(driverName) && driverName !== "") {
             found = true;
             console.log(person.Name);
             const { data: output, error: allSelError } = await supabase.from("People").select().eq("Name", person.Name);
             const results = document.createElement("p");
             results.id = "searchResults";
             results.textContent = JSON.stringify(output);
             mainSect.appendChild(results); // Append corresponding results
         }
     }

     if (found === false) {
          const results = document.createElement("p");
          results.id = "searchResults";
          results.textContent = "No matches found";
          mainSect.appendChild(results); // Append corresponding results
     }
     
 }
