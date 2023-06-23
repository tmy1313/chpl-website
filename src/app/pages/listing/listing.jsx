import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { number, string } from 'prop-types';

import ChplListingHistory from './history';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserViewedWidget from 'components/browser/browser-viewed-widget';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import ChplCompliance from 'components/listing/details/compliance/compliance';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplG1G2 from 'components/listing/details/g1g2/g1g2';
import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import ChplSed from 'components/listing/details/sed/sed';
import ChplSubscribe from 'components/subscriptions/subscribe';
import { ChplLink, InternalScrollButton } from 'components/util';
import { UserContext, FlagContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '100px',
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
  content: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
  },
  pageHeader: {
    padding: '32px',
  },
});

function ChplListingPage({ id, panel }) {
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const { hasAnyRole } = useContext(UserContext);
  const { isOn } = useContext(FlagContext);
  const [listing, setListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const [subscriptionsIsOn, setSubscriptionsIsOn] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    setSubscriptionsIsOn(isOn('subscriptions'));
  }, [isOn]);

  useEffect(() => {
    if (!panel || !listing) { return; }
    const target = document.getElementById(panel);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [listing, panel]);

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  return (
    <>
      <ChplBrowserViewedWidget
        listing={listing}
      />
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
        >
          { listing.product.name}
        </Typography>
      </div>
      <div className={classes.container} id="main-content" tabIndex="-1">
        <div className={classes.navigation}>
          <Card>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="listingInformation"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Listing Information' }}
              >
                Listing Information
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="certificationCriteria"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Certification Criteria' }}
              >
                Certification Criteria
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="clinicalQualityMeasures"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Clinical Quality Measures' }}
              >
                Clinical Quality Measures
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            { listing.certificationEdition.name !== '2011'
              && (
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="sed"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Safety Enhanced Design' }}
                  >
                    Safety Enhanced Design (SED)
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
              )}
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="g1g2Measures"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'G1/G2 Measures' }}
              >
                G1/G2 Measures
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="compliance"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Compliance Activities' }}
              >
                Compliance Activities
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="additional"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Additional Information' }}
              >
                Additional Information
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            { subscriptionsIsOn
              && (
                <ChplSubscribe
                  subscribedObjectId={listing.id}
                  subscribedObjectTypeId={1}
                />
              )}
          </Card>
        </div>
        <div className={classes.content}>
          <Card>
            <ChplListingHistory
              listing={listing}
              canSeeHistory={hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])}
            />
            { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']) && listing.certificationEdition.name === '2015'
              && (
                <ChplLink
                  href={`#/listing/${listing.id}/view/edit`}
                  text="Edit Listing"
                  external={false}
                  router={{ sref: 'listing.view.edit', options: { id: listing.id } }}
                />
              )}
            { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) && listing.certificationEdition.name !== '2015'
              && (
                <ChplLink
                  href={`#/listing/${listing.id}/view/edit`}
                  text="Edit Listing"
                  external={false}
                  router={{ sref: 'listing.view.edit', options: { id: listing.id } }}
                />
              )}
            { hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])
              && (
                <ChplLink
                  href="#/surveillance/manage"
                  text="Manage Surveillance Activity"
                  external={false}
                  router={{ sref: 'surveillance.manage', options: { listingId: listing.id, chplProductNumber: listing.chplProductNumber } }}
                />
              )}
            <ChplActionButton
              listing={listing}
            />
          </Card>
          <Card>
            <span className="anchor-element">
              <span id="listingInformation" className="page-anchor" />
            </span>
            <CardContent>
              Listing Information
              <ChplListingInformation
                listing={listing}
              />
            </CardContent>
          </Card>
          <Card>
            <span className="anchor-element">
              <span id="certificationCriteria" className="page-anchor" />
            </span>
            <CardContent>
              Certification Criteria
              <FormControlLabel
                control={(
                  <Switch
                    id="see-all-criteria"
                    name="seeAllCriteria"
                    checked={seeAllCriteria}
                    onChange={() => setSeeAllCriteria(!seeAllCriteria)}
                  />
                )}
                label="See all Certification Criteria"
              />
              (
              { listing.certificationResults.filter((cr) => cr.success).length }
              {' '}
              found)
              <ChplCriteria
                certificationResults={listing.certificationResults}
                viewAll={seeAllCriteria}
              />
            </CardContent>
          </Card>
          <Card>
            <span className="anchor-element">
              <span id="clinicalQualityMeasures" className="page-anchor" />
            </span>
            <CardContent>
              Clinical Quality Measures
              <FormControlLabel
                control={(
                  <Switch
                    id="see-all-cqms"
                    name="seeAllCqms"
                    checked={seeAllCqms}
                    onChange={() => setSeeAllCqms(!seeAllCqms)}
                  />
                )}
                label="See all CQMs"
              />
              (
              { listing.cqmResults.filter((cqm) => cqm.success).length }
              {' '}
              found)
              <ChplCqms
                cqms={listing.cqmResults}
                edition={listing.certificationEdition}
                viewAll={seeAllCqms}
              />
            </CardContent>
          </Card>
          { listing.certificationEdition.name !== '2011'
            && (
              <Card>
                <span className="anchor-element">
                  <span id="sed" className="page-anchor" />
                </span>
                <CardContent>
                  Safety Enhanced Design (SED)
                  <ChplSed
                    listing={listing}
                  />
                </CardContent>
              </Card>
            )}
          <Card>
            <span className="anchor-element">
              <span id="g1g2Measures" className="page-anchor" />
            </span>
            <CardContent>
              G1/G2 Measures
              <ChplG1G2
                measures={listing.measures}
              />
            </CardContent>
          </Card>
          <Card>
            <span className="anchor-element">
              <span id="compliance" className="page-anchor" />
            </span>
            <CardContent>
              Compliance Activities
              <ChplCompliance
                directReviews={listing.directReviews}
                directReviewsAvailable={listing.directReviewsAvailable}
                surveillance={listing.surveillance}
              />
            </CardContent>
          </Card>
          <Card>
            <span className="anchor-element">
              <span id="additional" className="page-anchor" />
            </span>
            <CardContent>
              Additional Information
              <ChplAdditionalInformation
                listing={listing}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ChplListingPage;

ChplListingPage.propTypes = {
  id: number.isRequired,
  panel: string,
};

ChplListingPage.defaultProps = {
  panel: undefined,
};
