const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// Get the absolute path to the prj2Backend.py script
const pythonScriptPath = path.join(__dirname, 'prj2Backend.py');

app.post('/predict', (req, res) => {
    // Extract the text data from the request body
    const text = req.body.text;
    console.log('Received text:', text);

    // Call the Python script
    const pythonProcess = spawn('C:/Users/Ashish/anaconda3/python.exe', [pythonScriptPath, text]);

    // Buffer to store the Python script output
    let pythonOutput = '';

    // Handle Python script output
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString(); // Accumulate Python script output
    });

    // Handle Python script errors
    pythonProcess.stderr.on('data', (data) => {
        console.error('Error from Python script:', data.toString());
    });

    // Handle Python script completion
    pythonProcess.on('close', (code) => {
        console.log('Python script execution completed with code:', code);

        // Respond with the output received from the Python script
        res.send(pythonOutput);
    });

    // Handle any errors that occur during execution
    pythonProcess.on('error', (err) => {
        console.error('Error executing Python script:', err);
        res.status(500).send('Error executing Python script');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
