import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";

 const socket = io.connect("http://localhost:5000");

// const socket = io.connect("https://backviedeocall.onrender.com/");
function App() {
    const [me, setMe] = useState("");
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [callerName, setCallerName] = useState("");
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });

        socket.on("me", (id) => {
            setMe(id);
        });

        socket.on("callUser", (data) => {
            console.log("Call received from:", data.from, "with name:", data.name);
            setReceivingCall(true);
            setCaller(data.from);
            setCallerName(data.name);
            setCallerSignal(data.signal);
        });

        socket.on("callEnded", () => {
            console.log("Call ended received");
            // ให้ตั้งค่าสถานะการโทรสิ้นสุดเมื่อมีการส่ง "callEnded"
            setCallEnded(true);
            if (userVideo.current) {
                userVideo.current.srcObject = null;
            }
            if (connectionRef.current) {
                connectionRef.current.destroy();
                connectionRef.current = null;
            }
            window.location.reload();
        });

        // เคลียร์การตั้งค่าทั้งหมดเมื่อคอมโพเนนต์ถูกยกเลิก
        return () => {
            socket.off("me");
            socket.off("callUser");
            socket.off("callEnded");
        };
    }, []);

    const callUser = (id) => {
        if (connectionRef.current) {
            connectionRef.current.destroy();
            userVideo.current.srcObject = null;
            setCallEnded(true);
        }

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name,
            });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        socket.on("callAccepted", (signal) => {
            setCallerName(signal.name);
            setCallAccepted(true);
            peer.signal(signal.signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller, name: name });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        socket.emit("callEnded");
        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
        // connectionRef.current.destroy();
        window.location.reload();
    };

    return (
        <>
            <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream && (
                            <>
                                <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                                <p>{name}</p>
                            </>
                        )}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ? (
                            <>
                                <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                                <p>{callerName}</p>
                            </>
                        ) : null}
                    </div>
                </div>
                <div className="myId">
                    <TextField
                        id="filled-basic"
                        label="Name"
                        variant="filled"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: "20px" }}
                    />
                    <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                        <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
                            Copy ID
                        </Button>
                    </CopyToClipboard>

                    <TextField
                        id="filled-basic"
                        label="ID to call"
                        variant="filled"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />
                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                End Call
                            </Button>
                        ) : (
                            <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                                <PhoneIcon fontSize="large" />
                            </IconButton>
                        )}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1>{callerName} is calling...</h1>
                            <Button variant="contained" color="primary" onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default App;
