import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import BlockIcon from '@material-ui/icons/Block';
import CancelIcon from '@material-ui/icons/Cancel';
import CodeIcon from '@material-ui/icons/Code';
import DescriptionIcon from '@material-ui/icons/Description';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ImageIcon from '@material-ui/icons/Image';
import GavelIcon from '@material-ui/icons/Gavel';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import StopIcon from '@material-ui/icons/Stop';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import Image from '../../../../assets/images/CHPL_Logo-01.png';

import {
  ChplFilterPanel,
  ChplFilterQuickFilters,
  ChplFilterSearchTerm,
} from 'components/filter';
import { ChplLink } from 'components/util';
import { palette, theme } from 'themes';

const useStyles = makeStyles(() => ({
  collectionsCard: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width: '48%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '25%',
    },
  },
  collectionsCards: {
    width: '-webkit-fill-available',
  },
  collectionsCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    flexWrap: 'nowrap',
    padding: '0 16px',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '0',
    },
    [theme.breakpoints.up('md')]: {
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      padding: '0',
    },
    [theme.breakpoints.up('lg')]: {
      flexWrap: 'nowrap',
      padding: '0',
    },
  },
  helpCard: {
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      width: '33.3%',
      flexDirection: 'row',
    },
  },
  helpCardContent: {
    width: '100%',
  },
  helpCardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    padding: '0 16px',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      padding: '0',
    },
  },
  landingPageBackground: {
    backgroundPosition: '48vw 40vh',
    backgroundRepeat: 'no-repeat',
    background: `rgba(2,23,60,1) url(${Image})`,
    backgroundBlendMode: 'soft-light',
  },
  subHeaders: {
    color: '#fff',
    padding: '0 16px',
    [theme.breakpoints.up('sm')]: {
      padding: '0',
    },
  },
  searchButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gridGap: '8px',
  },
  searchContainer: {
    backgroundColor: palette.grey,
    position: 'relative',
    top: '-32px',
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    boxShadow: '#00000040 0px 24px 24px 2px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 10fr auto',
    },
  },
}));

function ChplLandingPage() {
  const classes = useStyles();

  return (
    <>
      <Box pt={16} pb={24}>
        <Container maxWidth="md">
          <Typography align="center" variant="h1" gutterBottom>
            Welcome to the Certified Health IT Product List
          </Typography>
          <Typography align="center" variant="body1">
            The Certified Health IT Product List (CHPL) is a comprehensive and authoritative listing of all certified health information technology that have been successfully tested and certified by the ONC Health IT Certification program
          </Typography>
        </Container>
      </Box>
      <Box className={classes.landingPageBackground} pb={16} height="fit-content">
        <Box className={classes.landingPageImageryBackground}>
          <Container maxWidth="md">
            <Box className={classes.searchContainer}>
              <ChplFilterSearchTerm />
              <Box className={classes.searchButtonContainer}>
                <ChplFilterPanel />
                <ChplFilterQuickFilters />
              </Box>
            </Box>
            <Box pb={4}>
              <Typography className={classes.subHeaders} align="left" variant="h2" gutterBottom>
                Use our collections pages to help find a particular category of listings
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gridGap={16}>
              <Box className={classes.collectionsCardContainer}>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <CodeIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/api-documentation"
                              text="API info for 2015 products"
                              external={false}
                              router={{ sref: 'collections.api-documentation' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'API Info for 2015 Ed. Products' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <VerifiedUserIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/sed"
                              text="SED info for 2015 products"
                              external={false}
                              router={{ sref: 'collections.sed' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'SED info for 2015 products' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes all 2015 Edition, including Cures Update, health IT products that have been certified with Safety Enhanced Design (SED)
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <StopIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/inactive-certificates"
                              text="Inactive Certificates"
                              external={false}
                              router={{ sref: 'collections.inactive-certificates' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'Inactive Certificates' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes all health IT products that have had their status changed to an &quot;inactive&quot; status on the CHPL
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <BlockIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/developers"
                              text="Banned Developers"
                              external={false}
                              router={{ sref: 'collections.developers' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'Banned Developers' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
              <Box className={classes.collectionsCardContainer}>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <GavelIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/real-world-testing"
                              text="Real World Testing"
                              external={false}
                              router={{ sref: 'collections.real-world-testing' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'Real World Testing' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes Health IT Module(s) eligible for Real World Testing, which is an annual Condition and Maintenance of Certification requirement
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <ImageIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/charts"
                              text="Charts"
                              external={false}
                              router={{ sref: 'charts' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'Charts' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <ErrorOutlineOutlinedIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/corrective-action"
                              text="Products: Corrective Actions"
                              external={false}
                              router={{ sref: 'collections.corrective-action' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'Products: Corrective Action' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This is a list of all health IT products for which a non-conformity has been recorded. ONC-ACB or ONC determines that the product does not comply with a requirement of certification
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.collectionsCard}>
                  <Card className={classes.collectionsCards}>
                    <CardContent>
                      <Box display="flex" flexDirection="row" gridGap={8}>
                        <CancelIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/decertified-products"
                              text="Decertified Products"
                              external={false}
                              router={{ sref: 'collections.decertified-products' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'Decertified Products' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes all 2015 Edition, including Cures update, health it products that have been certified to at least one API Criteria
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
              <Box pt={4} pb={4}>
                <Typography className={classes.subHeaders} align="left" variant="h2">
                  Need Help? Learn more about CHPL through our documentation
                </Typography>
              </Box>
              <Box className={classes.helpCardsContainer}>
                <Box className={classes.helpCard}>
                  <Card className={classes.helpCardContent}>
                    <CardContent>
                      <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                        <DescriptionIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography align="center">
                            <ChplLink
                              href="#/resources/overview"
                              text="An Overview of the CHPL"
                              external={false}
                              router={{ sref: 'resources.overview' }}
                              analytics={{ event: 'Use Documentation Button', category: 'Navigation', label: 'CHPL Overview' }}
                            />
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.helpCard}>
                  <Card className={classes.helpCardContent}>
                    <CardContent>
                      <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                        <AnnouncementIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography align="center">
                            <ChplLink
                              href="#/resources/api"
                              text="CHPL API"
                              external={false}
                              router={{ sref: 'resources.api' }}
                              analytics={{ event: 'Use Documentation Button', category: 'Navigation', label: 'CHPL API' }}
                            />
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box className={classes.helpCard}>
                  <Card className={classes.helpCardContent}>
                    <CardContent>
                      <Box p={4} display="flex" justifyContent="center" flexDirection="column" alignItems="center" gridGap={8}>
                        <MenuBookIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography align="center">
                            <ChplLink
                              href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
                              text="Training Guide"
                              external={false}
                              analytics={{ event: 'Use Documentation Button', category: 'Navigation', label: 'Training Guide' }}
                            />
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default ChplLandingPage;
