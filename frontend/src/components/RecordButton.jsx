import { useState } from "react";

function RecordButton() {
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        setIsRecording(prevState => !prevState);
    };

    return (
        <span >
            <button style={{
    backgroundImage: "linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)",
    margin: "10px",
    padding: "15px 30px",
    textAlign: "center",
    textTransform: "uppercase",
    transition: "0.5s",
    backgroundSize: "200% auto",
    color: "white",            
    boxShadow: "0 0 20px #eee",
    borderRadius: "10px",
    display: "block"
}} 
onClick={toggleRecording}>
    {isRecording ? 'Stop Recording' : 'Start Recording'}
</button>

        </span>
    );
}

         

 
