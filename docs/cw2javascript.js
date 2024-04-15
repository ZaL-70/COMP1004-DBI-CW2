// After install the supabase-js module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Create a single supabase client for interacting with your database
const supabase = createClient("https://digqlsccmsppgbanysko.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Fsc2NjbXNwcGdiYW55c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTA5MzcsImV4cCI6MjAyODQyNjkzN30.JFGokF0fDv9XndLlUIEwSu6b3U02gzY3dd0qhyr6Znw");

// // Fetch data from the table
// async function fetchData() {
//     const { data, error } = await supabase.from('Vehicles').select();
//     console.log('Fetched data:', data);
// }
// // Call the fetchData function to retrieve data
// fetchData();
    

const button = document.querySelector("button");
button.addEventListener("click", updateParagraph);

const paragraph = document.getElementById("output");

async function updateParagraph() {
     const { data, error } = await supabase.from('Vehicles').select();
     paragraph.textContent = data
}