import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {
  useDeleteUserFromAcb,
  useFetchAcbs,
  useFetchUsersAtAcb,
} from 'api/acbs';
import ChplOncOrganization from 'components/onc-organization/onc-organization';
import ChplUsers from 'components/user/users';
import { BreadcrumbContext, UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
});

const sortAcbs = (a, b) => {
  if (a.retired && !b.retired) { return 1; }
  if (!a.retired && b.retired) { return -1; }
  return a.name < b.name ? -1 : 1;
};

function ChplOncOrganizations() {
  const { hasAnyRole } = useContext(UserContext);
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [acbs, setAcbs] = useState([]);
  const [active, setActive] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState('');
  const [users, setUsers] = useState([]);
  const { mutate: remove } = useDeleteUserFromAcb();
  const { data, isLoading, isSuccess } = useFetchAcbs(true);
  const userQuery = useFetchUsersAtAcb(active);
  const roles = ['ROLE_ACB'];
  const classes = useStyles();
  let navigate;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setAcbs(data.acbs.sort(sortAcbs));
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUsers(userQuery.data.users);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess]);

  useEffect(() => {
    if (isCreating) {
      display('onc-organizations');
      hide('onc-organizations.disabled');
    } else {
      display('onc-organizations.disabled');
      hide('onc-organizations');
    }
  }, [isCreating]);

  useEffect(() => {
    append(
      <Button
        key="onc-organizations.disabled"
        depth={0}
        variant="text"
        disabled
      >
        ONC Organizations
      </Button>,
    );
    append(
      <Button
        key="onc-organizations"
        depth={0}
        variant="text"
        onClick={() => navigate({})}
      >
        ONC Organizations
      </Button>,
    );
    display('onc-organizations.disabled');
  }, []);

  navigate = (target) => {
    acbs.forEach((acb) => hide(`${acb.name}.viewall.disabled`));
    setActive(target);
    setIsCreating(false);
    setIsEditing('');
    setUsers([]);
    if (target) {
      display('onc-organizations');
      hide('onc-organizations.disabled');
    } else {
      display('onc-organizations.disabled');
      hide('onc-organizations');
    }
  };

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        setIsCreating(false);
        setIsEditing('');
        break;
      case 'delete':
        remove({ id: active.id, userId: payload }, {
          onSuccess: () => {
            setIsEditing('');
          },
          onError: (error) => {
            console.log({ error });
          },
        });
        break;
      case 'edit':
        setIsEditing(payload);
        break;
      case 'invite':
        console.error('todo: set up invitation');
        setIsEditing('');
        break;
      case 'refresh':
        setIsCreating(false);
        setIsEditing('');
        break;
      default:
        console.log({ action, payload });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <Card>
          { acbs.map((acb) => (
            <Button
              key={acb.name}
              onClick={() => navigate(acb)}
              disabled={active.name === acb.name}
              id={`onc-organizations-navigation-${acb.name}`}
              fullWidth
              variant="text"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              className={classes.menuItems}
            >
              { acb.name }
              { acb.retired ? ' | Retired' : '' }
            </Button>
          ))}
        </Card>
      </div>
      <div>
        { active.id
          && (
            <>
              { isEditing !== 'user'
                && (
                  <ChplOncOrganization dispatch={handleDispatch} organization={active} />
                )}
              { isEditing !== 'acb'
                && (
                  <ChplUsers users={users} roles={roles} dispatch={handleDispatch} />
                )}
            </>
          )}
        { !active.id && !isCreating
         && (
         <Card>
           <CardContent>
             <Typography>
               ONC Organization maintenance
             </Typography>
             <Button
               onClick={() => setIsCreating(true)}
             >
               Create
             </Button>
           </CardContent>
         </Card>
         )}
        { isCreating && hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
          && (
            <ChplOncOrganization dispatch={handleDispatch} organization={{}} isCreating />
          )}
      </div>
    </div>
  );
}

export default ChplOncOrganizations;

ChplOncOrganizations.propTypes = {
};
