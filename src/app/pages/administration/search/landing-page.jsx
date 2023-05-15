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
import CodeIcon from '@material-ui/icons/Code';
import DescriptionIcon from '@material-ui/icons/Description';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import ImageIcon from '@material-ui/icons/Image';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import Image from '../../../../assets/images/CHPL_Logo-01.png';

import {
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
    '& a': {
      fontSize: 'large',
    },
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
  complianceCard: {
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      flexDirection: 'row',
    },
  },
  complianceCardContent: {
    width: '100%',
    '& a': {
      fontSize: 'large',
    },
  },
  complianceCardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    padding: '0 16px',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
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
    '& a': {
      fontSize: 'large',
    },
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
              <ChplFilterQuickFilters />
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
                              text="API Information"
                              external={false}
                              router={{ sref: 'collections.api-documentation' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'API Info for 2015 Ed. Products' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            This list includes all 2015 Edition, including Cures update, health IT products that have been certified to at least one API Criteria
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
                            Charts are a dynamic display of the data currently on the CHPL
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
                        <TrendingUpIcon color="primary" />
                        <Box mt={-1}>
                          <Typography>
                            <ChplLink
                              href="#/collections/svap"
                              text="SVAP Information"
                              external={false}
                              router={{ sref: 'collections.svap' }}
                              analytics={{ event: 'Use Shortcut Button', category: 'Navigation', label: 'SVAP' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            Standards Version Advancement Process (SVAP) This list includes Health IT Module(s) utilizing advanced interoperability standards through the SVAP process, promoting streamlined adoption and improved communication
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
                              text="CHPL Overview"
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
              <Box pt={4} pb={4}>
                <Typography className={classes.subHeaders} align="left" variant="h2">
                  Check our compliance pages
                </Typography>
              </Box>
              <Box className={classes.complianceCardsContainer}>
                <Box className={classes.complianceCard}>
                  <Card className={classes.complianceCardContent}>
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
                <Box className={classes.complianceCard}>
                  <Card className={classes.complianceCardContent}>
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
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default ChplLandingPage;