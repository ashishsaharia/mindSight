/* eslint-disable react/prop-types */
import { useState } from "react";
import { useRef } from 'react';
import axios from "axios";

export default function Outer() {
    const [obj, setObj] = useState({});
    const [answer,setAnswer] = useState("");
    let ans = "";
    for (let x in obj) {
        ans += " " +obj[x];
    }


    function Submit({ans}){
        async function onSubmit(ans) {
            try {
                const response = await axios.post("http://localhost:3000/predict", {
                    text: ans
                });
                setAnswer(response.data);
            } catch (err) {
                console.log(`the error is ${err}`);
            }
        }

        return(
            <>
            <button style={{ backgroundImage: "linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)",
                    margin: "10px",
                    padding: "15px 30px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    transition: "0.5s",
                    backgroundSize: "200% auto",
                    color: "white",
                    borderRadius: "10px",}} onClick={()=>{
                onSubmit(ans)
            }}>Submit</button>
            </>
        )
    }

    return (
        <>
            <div style={{
                display:"flex",
                justifyContent:"center",
                fontFamily:"monospace",
                color:"white",
                fontSize:"50px"

            }}>
            <div> AI ML Website to detect depression</div>
            </div>
            <OuterBox obj={obj} setObj={setObj}></OuterBox>
            <div style={{
                display:"flex",
                justifyContent:"center",
            }}>
            <Submit ans ={ans}></Submit>
            </div>
            <div style={{
                display:"flex",
                justifyContent:"center",
                color:"white",
                fontSize:"40px"
            }}>
            <div >{answer}</div>
            </div>
        </>
    );
}

function OuterBox({ obj, setObj }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "8px",
            margin: "8px",
            border: "solid 2px black",
            borderRadius: "5px",
            background: "rgba(0, 210, 255, 0.5)"
        }}>

            <TextBox question=" How have you been feeling lately?" textBoxKey="one" setObj={setObj} obj={obj}></TextBox>
            <TextBox question="Have you noticed any changes in your sleep patterns or appetite?" textBoxKey="two" setObj={setObj} obj={obj}></TextBox>
            <TextBox question="Do you often feel hopeless or helpless?" textBoxKey="three" setObj={setObj} obj={obj}></TextBox>
            <TextBox question="Have you lost interest in activities you used to enjoy?" textBoxKey="four" setObj={setObj} obj={obj}></TextBox>
            <TextBox question="Do you find it challenging to concentrate or make decisions?" textBoxKey="five" setObj={setObj} obj={obj}></TextBox>


        </div>
    )
}

function TextBox({ question, textBoxKey, setObj, obj }) {

    const [answer, setAnswer] = useState("");

    return (
        <div
            style={{
                margin: "20px",
                width: "80%",
                alignSelf: "center",
                padding: "8px",
                border: "solid black 1px",
                borderRadius: "3px",
                background: "rgba(0, 200, 240, 0.8)"
            }}>
            <div
                style={{
                    color: "white"
                }}>
                <div style={{
                    padding: "5px"
                }}>
                    <h2> Q: {question}</h2>
                </div>
                <div>
                    <textarea style={{
                        background: "rgba(150, 220, 240, 0.8)",
                        width: "100%",
                        height: "50%",
                        color: "white"
                    }} placeholder="press the record button to enter you response" value={answer} onChange={(e) => {
                        let val = e.target.value;
                        setAnswer(val);
                    }}></textarea>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: 'center'
                    }}>
                        <RecordButton setAnswer={setAnswer} />
                        <SaveResponseButton textBoxKey={textBoxKey} answer={answer} setObj={setObj} obj={obj} />
                    </div>
                </div>
            </div>
            <div>
                <h2 style={{
                    color: "white"
                }}>Respone</h2>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "20px", color: "white" }}>{answer}</p>
        </div>
    )
}

function SaveResponseButton({ textBoxKey, answer, setObj, obj }) {
    function save() {
        // Create a new object by copying the existing obj
        const newObj = { ...obj };
        // If the key already exists in the obj, append the new answer to the existing one
       newObj[textBoxKey] = answer
        // Set the state with the new object
        setObj(newObj);
    }

    return (
        <span>
            <button
                style={{
                    backgroundImage: "linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)",
                    margin: "10px",
                    padding: "15px 30px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    transition: "0.5s",
                    backgroundSize: "200% auto",
                    color: "white",
                    borderRadius: "10px",
                    display: "block"
                }}
                onClick={save}
            >
                Save Response
            </button>
        </span>
    );
}

function RecordButton({ setAnswer }) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
    const interimTranscriptRef = useRef('');

    const toggleRecording = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition is not supported by your browser");
        } else {
            if (isRecording) {
                recognitionRef.current.stop();
            } else {
                recognitionRef.current = new window.webkitSpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onstart = () => {
                    setIsRecording(true);
                };

                recognitionRef.current.onend = () => {
                    setIsRecording(false);
                };

                let finalTranscript = '';
                recognitionRef.current.onresult = (event) => {
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript + ' ';
                        } else {
                            interimTranscript += event.results[i][0].transcript + ' ';
                        }
                    }
                    setAnswer(finalTranscript.trim());
                    interimTranscriptRef.current += interimTranscript.trim();
                };

                recognitionRef.current.start();
            }
        }
    };

    return (
        <span>
            <button
                style={{
                    backgroundImage: "linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)",
                    margin: "10px",
                    padding: "15px 30px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    transition: "0.5s",
                    backgroundSize: "200% auto",
                    color: "white",
                    borderRadius: "10px",
                    display: "block"
                }}
                onClick={toggleRecording}
            >
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
        </span>
    );
}
