import React ,{ createContext, useState, useRef, useEffect,useContext }from 'react';
import { useNavigate} from 'react-router-dom';
import Notifications from './Notifications';
import VideoPlayer from './VideoPlayer';
import { SocketContext } from '../Context';
const Home = () => {
    const { callAccepted, myVideo, stream,name,setName,me,setusername } = useContext(SocketContext);
    const navigate = useNavigate();
  // useEffect(() => {
  //   // ทำบางอย่างกับ stream หรือ myVideo
  //   if (stream) {
  //     console.log('Stream is available', stream);
  //   }
  //   if (myVideo.current) {
  //     console.log('myVideo ref is set', myVideo.current);
  //   }
  // }, [stream]);
  const setMyName = () => {
    setusername()
  }
    return (
        <div>
            <h1 >Home</h1>
            <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={()=>setMyName()}>addusername</button>
            <h2>My ID: {me}</h2>
            <Notifications />
            {/* <VideoPlayer /> */}
            <button onClick={()=>navigate('/videocall')}>Call</button>
        </div>
    );
}
export default Home;