import React, { useContext } from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';
import { func } from 'prop-types';
import Moment from 'react-moment';

import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest as changeRequestProp } from '../../shared/prop-types';
import { ChplAvatar } from '../util';
import { UserContext } from '../../shared/contexts';

import theme from '../../../app/themes/theme';
import ChplChangeRequestHistory from './change-request-history';
import ChplChangeRequestAttestationView from './types/attestation-view';
import ChplChangeRequestDetailsView from './types/details-view';
import ChplChangeRequestWebsiteView from './types/website-view';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  productCard: {
    paddingBottom: '8px',
  },
  productCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 11fr',
    padding: '16px',
    gap: '16px',
    alignItems: 'end',
    backgroundColor: '#f5f9fd',
  },
  subProductCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  versionProductCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    alignItems: 'start',
    padding: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
  widgetProductContainer: {
    alignContent: 'space-between',
    display: 'grid',
    gap: '8px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',

  },
  subContent: {
    display: 'grid',
    gap: '8px',
  },
  developerAvatar: {
    color: '#fff',
    backgroundColor: '#bbb',
  },
  activeStatus: {
    color: '#66926d',
    marginLeft: '4px',
  },
  cardContentContainer: {
    padding: '16px',
  },
  cardContentChangeRequest: {
    gridTemplateColumns: '1fr',
    display: 'grid',
    gap: '8px',
    paddingBottom: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr .5fr',
    },
  },
  cardHeader: {
    fontWeight: '600',
  },
});

const getChangeRequestDetails = (cr) => {
  switch (cr.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return (
        <ChplChangeRequestAttestationView
          changeRequest={cr}
        />
      );
    case 'Developer Details Change Request':
      return (
        <ChplChangeRequestDetailsView
          changeRequest={cr}
        />
      );
    case 'Website Change Request':
      return (
        <ChplChangeRequestWebsiteView
          changeRequest={cr}
        />
      );
    default:
      return (
        <>
          No details found
        </>
      );
  }
};

function ChplChangeRequestView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole } = useContext(UserContext);
  const { changeRequest } = props;
  const classes = useStyles();

  const canEdit = () => {
    if (hasAnyRole(['ROLE_DEVELOPER'])) {
      return changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester';
    }
    return changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Pending Developer Action';
  };

  return (
    <ThemeProvider>
      <div>
        <Card className={classes.productCard}>
          <div className={classes.productCardHeaderContainer}>
            <ChplAvatar
              className={classes.developerAvatar}
              text={changeRequest.developer.name}
            />
            <div className={classes.subProductCardHeaderContainer}>
              <Typography gutterBottom className={classes.cardHeader} variant='h4'>{changeRequest.changeRequestType.name}</Typography>
            </div>
          </div>
          <div className={classes.versionProductCardHeaderContainer}>
            <div>
              <Typography gutterBottom variant="subtitle2">Developer:</Typography>
              <Typography variant="body1">{changeRequest.developer.name}</Typography>
              </div>
            <div>
              <Typography gutterBottom variant="subtitle2">Creation Date:</Typography>
              <Typography variant="body1">{DateUtil.getDisplayDateFormat(changeRequest.submittedDate)}</Typography>
              </div>
            <div>
              <Typography gutterBottom variant="subtitle2">Request Status:</Typography>
              <Typography variant="body1">{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>
              </div>
            <div>
              <Typography gutterBottom variant="subtitle2">Time Since Last Status Change:</Typography>
              <Typography variant="body1"><Moment fromNow>{changeRequest.currentStatus.statusChangeDate}</Moment>
              </Typography>
              </div>
          </div>
          <Divider />
          <CardContent className={classes.cardContentContainer}>
            <div className={classes.cardContentChangeRequest}>
              <div>
                {getChangeRequestDetails(changeRequest)}
              </div>
              <div className={classes.widgetProductContainer}>
                <div>
                  {canEdit()
                    && (
                      <Button
                        fullWidth
                        color="secondary"
                        variant="contained"
                        onClick={() => props.dispatch('edit')}
                      >
                        Edit Change Request<EditOutlinedIcon className={classes.iconSpacing}></EditOutlinedIcon>
                      </Button>
                    )}
                </div>
                <div>
                  <Button

                    fullWidth
                    color="default"
                    variant="contained"
                    onClick={() => props.dispatch('close')}
                  >
                    Close<CloseOutlinedIcon className={classes.iconSpacing}></CloseOutlinedIcon>
                  </Button>
                </div>
              </div>
            </div>
            <ChplChangeRequestHistory
              changeRequest={changeRequest}
            />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default ChplChangeRequestView;

ChplChangeRequestView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
