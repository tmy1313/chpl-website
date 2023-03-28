import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { number } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useFetchDevelopers, usePutJoinDevelopers } from 'api/developer';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  pageContainer: {
    padding: '32px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gridGap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  cardContainer: {
    width: 'auto',
    height: '700px',
    overflowY: 'scroll',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
      height: 'auto',
      overflowY: 'hidden',
    },
  },
  stickyCardContainer: {
    width: '100%',
    position: 'sticky',
    top: '100px',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
    },
  },
  errorColor: {
    border: '1px solid #c44f65',
    color: palette.error,
  },
});

function ChplJoinDevelopers({ id }) {
  const $state = getAngularService('$state');
  const { data, isLoading } = useFetchDevelopers();
  const { mutate } = usePutJoinDevelopers();
  const { enqueueSnackbar } = useSnackbar();
  const [activeDeveloper, setActiveDeveloper] = useState(undefined);
  const [developers, setDevelopers] = useState([]);
  const [developersToJoin, setDevelopersToJoin] = useState([]);
  const [developerValueToLoad, setDeveloperValueToLoad] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading) { return; }
    setActiveDeveloper(data.find((dev) => dev.id === id));
    setDevelopers(data
      .filter((dev) => dev.id !== id)
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [data, id, isLoading]);

  const addDeveloper = (_, developer) => {
    if (developer) {
      setDevelopersToJoin((prev) => prev.concat(developer));
    }
  };

  const canAdd = (developer) => !developersToJoin.find((dev) => dev.id === developer.id);

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        $state.go('^');
        break;
      case 'save':
        setIsProcessing(true);
        mutate({
          developer: activeDeveloper,
          developerIds: developersToJoin.map((dev) => dev.id),
        }, {
          onSuccess: () => {
            setIsProcessing(false);
            $state.go('^');
          },
          onError: () => {
            setIsProcessing(false);
            const message = 'An error has occurred';
            enqueueSnackbar(message, {
              variant: 'error',
            });
          },
        });
        break;
        // no default
    }
  };

  const removeDeveloper = (developer) => {
    setDevelopersToJoin((prev) => prev.filter((dev) => dev.id !== developer.id));
  };

  if (isLoading || !activeDeveloper) { return <CircularProgress />; }

  return (
    <>
      <Box p={8} bgcolor={palette.white}>
        <Typography variant="h1">
          Join Developers
        </Typography>
      </Box>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <Card className={classes.stickyCardContainer}>
            <CardHeader title={`Developers joining ${activeDeveloper.name}`} />
            <CardContent>
              {developersToJoin.length === 0 && 'None selected'}
              {developersToJoin.length > 0
                && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell><span className="sr-only">Action</span></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {developersToJoin.map((developer) => (
                          <TableRow key={developer.id}>
                            <TableCell>{developer.developerCode}</TableCell>
                            <TableCell>{developer.name}</TableCell>
                            <TableCell>{developer.status.status}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => removeDeveloper(developer)}
                                variant="outlined"
                                className={classes.errorColor}
                                endIcon={<ClearIcon fontSize="small" />}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
            </CardContent>
          </Card>
          <Card className={classes.cardContainer}>
            <CardHeader title={`Select Developers joining ${activeDeveloper.name}`} />
            <CardContent>
              <Box display="flex" flexDirection="column" gridGap={16}>
                { /* eslint-disable react/jsx-props-no-spreading */}
                <Autocomplete
                  id="developers"
                  name="developers"
                  options={developers}
                  onChange={addDeveloper}
                  inputValue={developerValueToLoad}
                  onInputChange={(event, newValue) => {
                    setDeveloperValueToLoad(newValue);
                  }}
                  getOptionLabel={(item) => `${item.name} (${item.developerCode})`}
                  renderInput={(params) => <ChplTextField {...params} label={`Select Developers joining ${activeDeveloper.name}`} />}
                />
                { /* eslint-enable react/jsx-props-no-spreading */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell><span className="sr-only">Action</span></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {developers.map((developer) => (
                        <TableRow key={developer.id}>
                          <TableCell>{developer.developerCode}</TableCell>
                          <TableCell>{developer.name}</TableCell>
                          <TableCell>{developer.status.status}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => addDeveloper(undefined, developer)}
                              disabled={!canAdd(developer)}
                              color="secondary"
                              variant="contained"
                              endIcon={<AddIcon fontSize="small" />}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={developersToJoin.length === 0}
        isProcessing={isProcessing}
      />
    </>
  );
}

export default ChplJoinDevelopers;

ChplJoinDevelopers.propTypes = {
  id: number.isRequired,
};
