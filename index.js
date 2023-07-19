const express= require("express");
const { google }= require("googleapis");
const app= express();
app.get("/",async (req,res)=>{
    const auth= new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId= "1GVNrTXV811R3W4vHe9oM6C0syRAA8hL4";
    const metaData= await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });
    res.send(metaData);


    

});
async function googleauth() {
    const auth= new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId= "1UnRFcpuOamGUhIq7d_M1q0OVPOmoehZpFaR1l11_CYo";
    const metaData= await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });
    console.log(metaData);
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "entrackr!A:K",
      });
    console.log(getRows.data);
    

    
}

app.listen(8000,(req,res)=>{
    console.log("listening on port 8000")
})

googleauth();
