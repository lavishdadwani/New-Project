const { google } = require("googleapis");
const fs = require("fs")
const credentials = require("../stock-management-471511-891e7af6825b.json")


const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [process.env.spreadSheetScope]
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env.sheetID; // sheetID
const range = process.env.sheetRange; // 10 columns (A to J)

// 1️⃣ Add new record
const addRecord = async (payload) => {
  const values = [payload];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values }
  });
  return 'Row added'
  console.log("✅ Row added!");
};

// 2️⃣ Read all data
const readData = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  // console.log("📌 Current Stock Data:", res.data.values);
  return res.data.values
};

// 3️⃣ Update/Edit
const updateCell = async () => {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!H2", // Row 2, Col H → Qty Produced
    valueInputOption: "RAW",
    requestBody: { values: [[550]] }
  });

  console.log("✅ Cell updated!");
};

module.exports = {
  addRecord,
  updateCell,
  readData
};
