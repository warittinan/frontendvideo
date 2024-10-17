import React, { useContext, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../Context';
import VideoPlayer from './VideoPlayer';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (callAccepted) {
      navigate('/videocall');
    }
  }, [callAccepted, navigate]); // Add callAccepted to dependency array

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
          <VideoPlayer />
        </div>
        
      )}
    </>
  );
};

export default Notifications;
