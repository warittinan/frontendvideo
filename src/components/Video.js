import React, { createContext, useState, useRef, useEffect,useContext } from 'react';
import VideoPlayer from './VideoPlayer';
// import Notifications from './components/Notifications';
import Sidebar from './Sidebar';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../Context';
const useStyles = makeStyles((theme) => ({
    appBar: {
      borderRadius: 15,
      margin: '30px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      border: '2px solid black',
  
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },
    image: {
      marginLeft: '15px',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }));


const Video =()=>{
    const classes = useStyles();
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call ,callname,setStream} = useContext(SocketContext);
    // useEffect(() => {
    //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then((currentStream) => {
    //     setStream(currentStream);

    //     myVideo.current.srcObject = currentStream;
    //   });
    // },[])
    return(
        <div>
            <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h2" align="center">Video Chat</Typography>
      </AppBar>
      <VideoPlayer />
      <Sidebar>
        
      </Sidebar>
        </div>
    )
}
export default Video;