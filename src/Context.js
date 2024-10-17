import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

//  const socket = io('http://localhost:5000');
const socket = io('https://backviedeocall.onrender.com/');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [callname, setCallName] = useState('');
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then((currentStream) => {
    //     setStream(currentStream);

    //     myVideo.current.srcObject = currentStream;
    //   });
    socket.on('me', (id) => {
      setMe(id)
    });

    socket.on("allUsers", (users) => {
      setUsers(users)
    })

    // 

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    socket.on("callEnded", () => {
       setCallEnded(true)

      // Stop the video from the other user
      if (userVideo.current) {
          userVideo.current.srcObject = null
      }

      // Destroy the peer connection
      if (connectionRef.current) {
          connectionRef.current.destroy()
      }
       window.location.reload()
  })
  }, []);
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      console.log('Received user video stream:', currentStream);
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      } else {
        console.error('userVideo is not initialized.');
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      // const newsingal = signal.signal
      // const callerName = signal.name
      setCallName(signal.name)
      // setCall({ isReceivingCall: false, name: callerName, newsingal });
      peer.signal(signal.signal);
      console.log('Call accepted, signaling peer:', signal);
      
    });
    socket.emit("username", name, me)
    connectionRef.current = peer;
  };
  const answerCall = () => {


    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from ,name: name});
    });

    peer.on('stream', (currentStream) => {
      console.log('Received user video stream:', currentStream);
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);
    console.log('Answering call, signaling peer with signal:', call.signal);
    connectionRef.current = peer;
    setCallAccepted(true);
  };

  

  const leaveCall = () => {
    setCallEnded(true)
    
    // Stop the local stream
    // stream.getTracks().forEach(track => track.stop())
    if (userVideo.current) {
      userVideo.current.srcObject = null;  // Remove the remote video stream
  }
    // Destroy the peer connection
    if (connectionRef.current) {
        connectionRef.current.destroy()
    }
    socket.emit("callEnded")
    // Optional: reload the page to reset the UI
     window.location.reload()
}
  const setusername =()=>{
    console.log('====================================');
    console.log(name,me);
    console.log('====================================');
    socket.emit("username", name, me)
  }

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      setStream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      callname,
      setusername
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };