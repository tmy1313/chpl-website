import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { func } from 'prop-types';

import ChplForceChangePassword from './components/force-change-password';
import ChplForgotPassword from './components/forgot-password';
import ChplLoggedIn from './components/logged-in';
import ChplSignin from './components/signin';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
  },
  loginHeader: {
    backgroundColor: '#ffffff',
    padding: '16px 0px 0px 16px',
  },
});

function ChplCognitoLogin({ dispatch }) {
  const [sessionId, setSessionId] = useState('');
  const [state, setState] = useState('SIGNIN');
  const [userName, setUserName] = useState('');
  const classes = useStyles();

  const cancel = (e) => {
    e.stopPropagation();
    setState('SIGNIN');
  };

  const handleDispatch = ({ action, payload }) => {
    console.log({ action, payload });
    switch (action) {
      case 'forceChangePassword':
        setUserName(payload.userName);
        setSessionId(payload.sessionId);
        dispatch('forceChangePassword');
        setState('FORCECHANGEPASSWORD');
        break;
      case 'forgotPassword':
        setState('FORGOTPASSWORD');
        break;
      case 'isLoggedIn':
        setState('LOGGEDIN');
        break;
      case 'loggedIn':
        dispatch('loggedIn');
        setState('LOGGEDIN');
        break;
      case 'loggedOut':
        setState('SIGNIN');
        break;
      default:
        console.error(`No action found for ${action}`);
    }
  };

  switch (state) {
    case 'FORCECHANGEPASSWORD':
      return (
        <ChplForceChangePassword
          dispatch={handleDispatch}
          userName={userName}
          sessionId={sessionId}
        />
      );
    case 'FORGOTPASSWORD':
      return <ChplForgotPassword dispatch={handleDispatch} />;
    case 'LOGGEDIN':
      return <ChplLoggedIn dispatch={handleDispatch} />;
    case 'SIGNIN':
      return <ChplSignin dispatch={handleDispatch} />;
    default:
      return (
        <Card>
          <CardHeader className={classes.loginHeader} title="Change Password" />
          <CardContent className={classes.grid}>
            {state === 'CHANGEPASSWORD'
             && (
               <>
                 <Typography>To implement later</Typography>
               </>
             )}
            {state === 'CHANGEPASSWORD'
             && (
               <Button
                 fullWidth
                 color="default"
                 variant="contained"
                 onClick={cancel}
                 endIcon={<ClearIcon />}
               >
                 Cancel
               </Button>
             )}
          </CardContent>
        </Card>
      );
  }
}

export default ChplCognitoLogin;

ChplCognitoLogin.propTypes = {
  dispatch: func,
};

ChplCognitoLogin.defaultProps = {
  dispatch: () => {},
};
