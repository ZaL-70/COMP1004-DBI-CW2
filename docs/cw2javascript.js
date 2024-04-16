// After install the supabase-js module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create a single supabase client for interacting with your database
const supabase = createClient("https://digqlsccmsppgbanysko.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Fsc2NjbXNwcGdiYW55c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTA5MzcsImV4cCI6MjAyODQyNjkzN30.JFGokF0fDv9XndLlUIEwSu6b3U02gzY3dd0qhyr6Znw");

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", fetchPeopleData());    // Add listener to button

// async function updateResults() {
//      const driverNameElement = document.getElementById("driverName"); // Get user input
//      let driverName = driverNameElement.value;
     
//      const { data: arrNames, error: nameSelError } = await supabase.from("People").select("Name"); // Get name data
     
//      for (const person in arrNames) {    // Check if the input is a substring of any name
//           if (person.Name.includes(driverName)) {
//                driverName = person.Name;     // Set variable to full name (to be used for select condition)
//                break;
//           }
//      }
//      // Get output data for specified name

//      console.log(driverName)

//      const { data: output, error: allSelError } = await supabase.from("People").select().eq("Name", driverName);
//      const results = document.getElementById("results");
//      if (output.length > 0) {
//           // Format the output before displaying
//           results.value = JSON.stringify(output); // Just an example, format as per your requirement
//       } else {
//           results.value = "No results found";
//       }
// }

// let licenseNum = document.getElementById("licenseNum");

const results = document.getElementById("results");

async function fetchPeopleData() {
     const { data: arrPeople, error } = await supabase
     .from("People")
     .select("Name")
     results.value = JSON.stringify(arrPeople);
}
