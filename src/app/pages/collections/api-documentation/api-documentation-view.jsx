import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Moment from 'react-moment';
import { shape, string } from 'prop-types';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ExportToCsv } from 'export-to-csv';

import theme from 'themes/theme';
import {
  useFetchApiDocumentationCollection,
  useFetchApiDocumentationData,
} from 'api/collections';
import {
  ChplLink,
  ChplPagination,
  ChplSortableHeaders,
} from 'components/util';
import {
  ChplFilterChips,
  ChplFilterPanel,
  ChplFilterSearchTerm,
  useFilterContext,
} from 'components/filter';
import { getAngularService } from 'services/angular-react-helper';

const csvOptions = {
  filename: 'api-documentation',
  showLabels: true,
  headers: [
    { headerName: 'CHPL ID', objectKey: 'chplProductNumber' },
    { headerName: 'Certification Edition', objectKey: 'fullEdition' },
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Product', objectKey: 'productName' },
    { headerName: 'Version', objectKey: 'versionName' },
    { headerName: 'Certification Status', objectKey: 'certificationStatusName' },
    { headerName: 'API Documentation - 170.315 (g)(7)', objectKey: 'apiDocumentation56' },
    { headerName: 'API Documentation - 170.315 (g)(8)', objectKey: 'apiDocumentation57' },
    { headerName: 'API Documentation - 170.315 (g)(9)', objectKey: 'apiDocumentation58' },
    { headerName: 'API Documentation - 170.315 (g)(9) (Cures Update)', objectKey: 'apiDocumentation181' },
    { headerName: 'API Documentation - 170.315 (g)(10)', objectKey: 'apiDocumentation182' },
    { headerName: 'Service Base URL List', objectKey: 'serviceBaseUrlList' },
    { headerName: 'Mandatory Disclosures URL', objectKey: 'mandatoryDisclosures' },
  ],
};

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  linkWrap: {
    overflowWrap: 'anywhere',
  },
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: ' 1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  searchContainer: {
    backgroundColor: '#c6d5e5',
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 10fr auto',
    },
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '275px',
    },
  },
  tableContainer: {
    overflowWrap: 'normal',
    border: '.5px solid #c2c6ca',
    margin: '0px 32px',
    width: 'auto',
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

const criteriaLookup = {
  56: { display: '170.315 (g)(7)', sort: 0 },
  57: { display: '170.315 (g)(8)', sort: 1 },
  58: { display: '170.315 (g)(9)', sort: 2 },
  181: { display: '170.315 (g)(9) (Cures Update)', sort: 3 },
  182: { display: '170.315 (g)(10)', sort: 4 },
};

const parseApiDocumentation = ({ apiDocumentation }, analytics) => {
  if (apiDocumentation.length === 0) { return 'N/A'; }
  const items = Object.entries(apiDocumentation
    .map((item) => ({
      id: item.criterion.id,
      url: item.value,
    }))
    .reduce((map, { id, url }) => ({
      ...map,
      [url]: (map[url] || []).concat(id),
    }), {}))
    .map(([url, ids]) => ({
      url,
      criteria: ids
        .sort((a, b) => criteriaLookup[a].sort - criteriaLookup[b].sort)
        .map((id) => criteriaLookup[id].display)
        .join(', '),
    }));
  return (
    <dl>
      {items.map(({ url, criteria }) => (
        <React.Fragment key={url}>
          <dt>{ criteria }</dt>
          <dd>
            <ChplLink
              key={url}
              href={url}
              analytics={{ event: 'Go to API Documentation Website', category: analytics.category, label: url }}
            />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

const getApiDocumentationForCsv = ({ apiDocumentation }, id) => apiDocumentation?.find((item) => item.criterion.id === id)?.value || '';

const parseServiceBaseUrlList = ({ serviceBaseUrlList }) => serviceBaseUrlList?.value || '';

function ChplApiDocumentationCollectionView(props) {
  const $analytics = getAngularService('$analytics');
  const API = getAngularService('API');
  const authService = getAngularService('authService');
  const {
    analytics,
  } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const [documentationDate, setDocumentationDate] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useState('developer');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortDescending, setSortDescending] = useState(false);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { isLoading, data } = useFetchApiDocumentationCollection({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });
  const { data: documentation } = useFetchApiDocumentationData();

  useEffect(() => {
    if (isLoading || !data.results) { return; }
    setListings(data.results.map((listing) => ({
      ...listing,
      fullEdition: `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}`,
      apiDocumentation: parseApiDocumentation(listing, analytics),
      apiDocumentation56: getApiDocumentationForCsv(listing, 56),
      apiDocumentation57: getApiDocumentationForCsv(listing, 57),
      apiDocumentation58: getApiDocumentationForCsv(listing, 58),
      apiDocumentation181: getApiDocumentationForCsv(listing, 181),
      apiDocumentation182: getApiDocumentationForCsv(listing, 182),
      serviceBaseUrlList: parseServiceBaseUrlList(listing),
      developerName: listing.developer.name,
      productName: listing.product.name,
      versionName: listing.version.name,
      certificationStatusName: listing.certificationStatus.name,
    })));
  }, [isLoading, data?.results, analytics]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    setDownloadLink(`${API}/files/api_documentation?api_key=${authService.getApiKey()}`);
  }, [API, authService]);

  useEffect(() => {
    if (!documentation?.associatedDate) { return; }
    setDocumentationDate(documentation.associatedDate);
  }, [documentation?.associatedDate]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'chpl_id', text: 'CHPL ID', sortable: true },
    { text: 'Certification Edition' },
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'product', text: 'Product', sortable: true },
    { property: 'version', text: 'Version', sortable: true },
    { text: 'Certification Status' },
    { text: 'API Documentation' },
    { text: 'Service Base URL List' },
    { text: 'Mandatory Disclosures URL' },
  ];

  const downloadApiDocumentation = () => {
    $analytics.eventTrack('Download Results', { category: analytics.category, label: listings.length });
    csvExporter.generateCsv(listings);
  };

  const handleTableSort = (event, property) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    if (orderBy === property) {
      setSortDescending(!sortDescending);
    } else {
      setOrderBy(property);
    }
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, data?.recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">API Information for 2015 Edition Products</Typography>
      </div>
      <div className={classes.pageBody}>
        <div>
          <Typography variant="body1" gutterBottom>
            This list includes all 2015 Edition, including Cures Update, health IT products that have been certified to at least one of the following API Criteria:
          </Typography>
          <ul>
            <li>&sect;170.315 (g)(7): Application Access - Patient Selection</li>
            <li>&sect;170.315 (g)(8): Application Access - Data Category</li>
            <li>&sect;170.315 (g)(9): Application Access - All Data Request</li>
            <li>&sect;170.315 (g)(9): Application Access - All Data Request (Cures Update)</li>
            <li>&sect;170.315 (g)(10): Standardized API for Patient and Population Services</li>
          </ul>
          <Typography variant="body1" gutterBottom>
            The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer&apos;s official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer&apos;s certified health IT.
          </Typography>
          <Typography variant="body1">
            Please note that by default, only listings that are active or suspended are shown in the search results.
          </Typography>
        </div>
        <div>
          <h2>API Documentation Dataset</h2>
          <Typography variant="body1" gutterBottom>
            The API Documentation Dataset is derived from a manual review by ONC of developer API documentation and details the API syntax and authorization standard used for products certified to the API criteria.
          </Typography>
          <ChplLink
            href={downloadLink}
            text="Download API Documentation Dataset"
            id="download-api-documentation"
            analytics={{ event: 'Download API Documentation data', category: analytics.category }}
            external={false}
          />
          { documentationDate
            && (
              <Typography variant="body2">
                Last updated
                {' '}
                <Moment
                  fromNow
                  withTitle
                  titleFormat="DD MMM yyyy"
                >
                  {documentationDate}
                </Moment>
              </Typography>
            )}
        </div>
      </div>
      <div className={classes.searchContainer} component={Paper}>
        <ChplFilterSearchTerm />
        <ChplFilterPanel />
      </div>
      <div>
        <ChplFilterChips />
      </div>
      { isLoading
        && (
          <>Loading</>
        )}
      { !isLoading && listings.length === 0
        && (
          <Typography className={classes.noResultsContainer}>
            No results found
          </Typography>
        )}
      { !isLoading && listings.length > 0
       && (
       <>
         <div className={classes.tableResultsHeaderContainer}>
           <div className={`${classes.resultsContainer} ${classes.wrap}`}>
             <Typography variant="subtitle2">Search Results:</Typography>
             <Typography variant="body2">
               {`(${pageStart}-${pageEnd} of ${data?.recordCount} Results)`}
             </Typography>
           </div>
           <ButtonGroup size="small" className={classes.wrap}>
             <Button
               color="secondary"
               variant="contained"
               fullWidth
               id="download-filtered-listings"
               onClick={downloadApiDocumentation}
             >
               Download
               {' '}
               { listings.length }
               {' '}
               Result
               { listings.length !== 1 ? 's' : '' }
               <GetAppIcon className={classes.iconSpacing} />
             </Button>
           </ButtonGroup>
         </div>
         <TableContainer className={classes.tableContainer} component={Paper}>
           <Table
             stickyHeader
             aria-label="API Documentation Collections table"
           >
             <ChplSortableHeaders
               headers={headers}
               onTableSort={handleTableSort}
               orderBy={orderBy}
               order={sortDescending ? 'desc' : 'asc'}
               stickyHeader
             />
             <TableBody>
               { listings
                 .map((item) => (
                   <TableRow key={item.id}>
                     <TableCell className={classes.stickyColumn}>
                       <strong>
                         <ChplLink
                           href={`#/listing/${item.id}`}
                           text={item.chplProductNumber}
                           analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.chplProductNumber }}
                           external={false}
                           router={{ sref: 'listing', options: { id: item.id } }}
                         />
                       </strong>
                     </TableCell>
                     <TableCell>
                       {item.edition.name}
                       {' '}
                       {item.curesUpdate ? 'Cures Update' : '' }
                     </TableCell>
                     <TableCell>
                       <ChplLink
                         href={`#/organizations/developers/${item.developer.id}`}
                         text={item.developer.name}
                         analytics={{ event: 'Go to Developer Page', category: analytics.category, label: item.developer.name }}
                         external={false}
                         router={{ sref: 'organizations.developers.developer', options: { developerId: item.developer.id } }}
                       />
                     </TableCell>
                     <TableCell>{item.product.name}</TableCell>
                     <TableCell>{item.version.name}</TableCell>
                     <TableCell>{item.certificationStatus.name}</TableCell>
                     <TableCell className={classes.linkWrap}>
                       { item.apiDocumentation }
                     </TableCell>
                     <TableCell className={classes.linkWrap}>
                       { item.serviceBaseUrlList
                         ? (
                           <dl>
                             <dt>170.315 (g)(10)</dt>
                             <dd>
                               <ChplLink
                                 href={item.serviceBaseUrlList}
                                 analytics={{ event: 'Go to Service Base URL List website', category: analytics.category, label: item.serviceBaseUrlList }}
                               />
                             </dd>
                           </dl>
                         ) : (
                           <>N/A</>
                         )}
                     </TableCell>
                     <TableCell className={classes.linkWrap}>
                       { item.mandatoryDisclosures
                         ? (
                           <ChplLink
                             href={item.mandatoryDisclosures}
                             analytics={{ event: 'Go to Mandatory Disclosures Website', category: analytics.category, label: item.mandatoryDisclosures }}
                           />
                         ) : (
                           <>N/A</>
                         )}
                     </TableCell>
                   </TableRow>
                 ))}
             </TableBody>
           </Table>
         </TableContainer>
         <ChplPagination
           count={data.recordCount}
           page={pageNumber}
           rowsPerPage={pageSize}
           rowsPerPageOptions={[25, 50, 100]}
           setPage={setPageNumber}
           setRowsPerPage={setPageSize}
           analytics={analytics}
         />
       </>
       )}
    </>
  );
}

export default ChplApiDocumentationCollectionView;

ChplApiDocumentationCollectionView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};