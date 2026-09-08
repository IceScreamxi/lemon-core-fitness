import { getSheetData } from "../src/lib/google-sheets.service";

async function checkSheet() {
  console.log("Checking current Google Sheet data...");
  
  try {
    const data = await getSheetData();
    console.log(`Total rows in sheet: ${data.length}`);
    
    if (data.length === 0) {
      console.log("❌ Sheet is completely empty");
    } else {
      console.log("\nFirst 5 rows:");
      data.slice(0, 5).forEach((row, i) => {
        console.log(`Row ${i + 1}:`, row);
      });
      
      // Check for member rows
      const memberRows = data
        .slice(1)
        .filter((r) => typeof r?.[0] === "string" && r[0].startsWith("GYM-"));
      
      console.log(`\nMember rows found: ${memberRows.length}`);
      if (memberRows.length > 0) {
        console.log("Sample member:", memberRows[0]);
      }
    }
  } catch (error) {
    console.error("❌ Failed to check sheet:", error);
    process.exit(1);
  }
}

checkSheet();
