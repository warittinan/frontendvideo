import React ,{ createContext, useState, useRef, useEffect,useContext }from 'react';
import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Sidebar from './components/Sidebar';
import Video from './components/Video';
import Home from './components/Home';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, AppBar } from '@material-ui/core';
import { BrowserRouter,Router,Routes,Route,HashRouter ,useNavigate} from 'react-router-dom';
import { ContextProvider,SocketContext } from './Context';
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

const App = () => {
  const classes = useStyles();

  useEffect(()=>{

  },[])
  return (
    <div className={classes.wrapper} >
      {/* <ContextProvider> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videocall" element={<Video />} />
        </Routes>
      </BrowserRouter>
    {/* </ContextProvider> */}
    </div>
  );
};
export default App;