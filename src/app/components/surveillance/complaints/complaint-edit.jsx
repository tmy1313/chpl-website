import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  func,
} from 'prop-types';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  Switch,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { getAngularService } from '../../../services/angular-react-helper';
import { ChplTextField } from '../../util';
import theme from '../../../themes/theme';
import {
  criterion as criterionPropType,
  complaint as complaintPropType,
  complainantType,
  listing as listingPropType,
} from '../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const validationSchema = yup.object({
  receivedDate: yup.date()
    .required('Received Date is required'),
  acbComplaintId: yup.string()
    .required('ONC-ACB Complaint ID is required'),
  complainantType: yup.object()
    .required('Complainant Type is required'),
  complainantTypeOther: yup.string()
    .test('conditionallyRequired',
          'Complainant Type - Other Description is required',
          (value, context) => (!!value || context.parent.complainantType.name !== 'Other - [Please Describe]')
         ),
  summary: yup.string()
    .required('Complaint Summary is required'),
});

function ChplComplaintEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [complaint, setComplaint] = useState(props.complaint);
  const [complainantTypes] = useState(
    props.complainantTypes
      .sort((a, b) => (a.name < b.name ? -1 : 1))
  );
  const [criteria] = useState(
    props.criteria
      .sort(getAngularService('utilService').sortCert)
  );
  const [criterionEdition, setCriterionEdition] = useState('2015');
  const [criterionToAdd, setCriterionToAdd] = useState('');
  const [listings] = useState(
    props.listings
      .filter((listing) => (listing.acb === complaint.certificationBody.name))
      .sort(((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1)))
  );
  const [listingToAdd, setListingToAdd] = useState(null);
  const [listingValueToAdd, setListingValueToAdd] = useState('');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let initialComplainantType;
  complainantTypes.forEach((type) => {
    if (type.id === complaint.complainantType.id) {
      initialComplainantType = type;
    }
  });

  let formik;

  const addAssociatedCriteria = (event) => {
    const updated = {
      ...complaint,
      criteria: [
        ...complaint.criteria,
        event.target.value,
      ],
    }
    setComplaint(updated);
    setCriterionToAdd('');
  };

  const removeAssociatedCriterion = (criterion) => {
    const updated = {
      ...complaint,
      criteria: complaint.criteria.filter((crit) => crit.id !== criterion.id),
    }
    setComplaint(updated);
  };

  const addAssociatedListing = (event, newValue) => {
    if (!newValue || !newValue.id) { return null; }
    const updated = {
      ...complaint,
      listings: [
        ...complaint.listings,
        newValue,
      ],
    }
    setComplaint(updated);
    setListingToAdd(null);
    setListingValueToAdd('');
  };

  const removeAssociatedListing = (listing) => {
    const updated = {
      ...complaint,
      listings: complaint.listings.filter((item) => item.id !== listing.id),
    }
    setComplaint(updated);
  };

  const handleAction = (action, payload) => {
    props.dispatch(action, payload);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        handleAction('cancel');
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const handleEditionFilterChange = (event) => {
    setCriterionEdition(event.target.value);
  };

  const save = () => {
    const updatedComplaint = {
      ...complaint,
      acbComplaintId: formik.values.acbComplaintId,
    };
    handleAction('save', updatedComplaint);
  };

  formik = useFormik({
    initialValues: {
      receivedDate: complaint.receivedDate,
      closedDate: complaint.closedDate || '',
      acbComplaintId: complaint.acbComplaintId,
      oncComplaintId: complaint.oncComplaintId || '',
      complainantType: initialComplainantType,
      complainantTypeOther: complaint.complainantTypeOther || '',
      summary: complaint.summary,
      actions: complaint.actions || '',
      complainantContacted: complaint.complainantContacted,
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader
          title="Edit User"
        />
        <CardContent className={classes.content}>
          <Typography>
            ONC-ACB:
            <br />
            {complaint.certificationBody?.name}
          </Typography>
          <ChplTextField
            type="date"
            id="received-date"
            name="receivedDate"
            label="Received Date"
            required
            value={formik.values.receivedDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.receivedDate && !!formik.errors.receivedDate}
            helperText={formik.touched.receivedDate && formik.errors.receivedDate}
          />
          <ChplTextField
            type="date"
            id="closed-date"
            name="closedDate"
            label="Closed Date"
            value={formik.values.closedDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.closedDate && !!formik.errors.closedDate}
            helperText={formik.touched.closedDate && formik.errors.closedDate}
          />
          <ChplTextField
            id="acb-complaint-id"
            name="acbComplaintId"
            label="ONC-ACB Complaint ID"
            required
            value={formik.values.acbComplaintId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.acbComplaintId && !!formik.errors.acbComplaintId}
            helperText={formik.touched.acbComplaintId && formik.errors.acbComplaintId}
          />
          <ChplTextField
            id="onc-complaint-id"
            name="oncComplaintId"
            label="ONC Complaint ID"
            value={formik.values.oncComplaintId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.oncComplaintId && !!formik.errors.oncComplaintId}
            helperText={formik.touched.oncComplaintId && formik.errors.oncComplaintId}
          />
          <ChplTextField
            select
            id="complainant-type"
            name="complainantType"
            label="Complainant Type"
            required
            value={formik.values.complainantType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.complainantType && !!formik.errors.complainantType}
            helperText={formik.touched.complainantType && formik.errors.complainantType}
          >
            { complainantTypes.map((item) => (
              <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
            ))}
          </ChplTextField>
          { formik.values.complainantType.name === 'Other - [Please Describe]'
            &&
            <ChplTextField
              id="complainant-type-other"
              name="complainantTypeOther"
              label="Complainant Type - Other Description"
              required
              value={formik.values.complainantTypeOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.complainantTypeOther && !!formik.errors.complainantTypeOther}
              helperText={formik.touched.complainantTypeOther && formik.errors.complainantTypeOther}
            />
          }
          <ChplTextField
            id="summary"
            name="summary"
            label="Complaint Summary"
            required
            multiline
            value={formik.values.summary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.summary && !!formik.errors.summary}
            helperText={formik.touched.summary && formik.errors.summary}
          />
          {complaint.criteria.length > 0
           &&
           <>
             <Typography>Associated Criteria</Typography>
             <ul className={classes.chips}>
               {complaint.criteria
                .map((criterion) => (
                  <li key={criterion.id}>
                    <Chip
                      label={(criterion.removed ? 'Removed | ' : '') + criterion.number + ': ' + criterion.title}
                      onDelete={() => removeAssociatedCriterion(criterion)}
                      className={classes.chip}
                    />
                  </li>
                ))}
             </ul>
           </>
          }
          <ChplTextField
            select
            id="criteria"
            name="criteria"
            label="Add Associated Criterion"
            value={criterionToAdd}
            onChange={addAssociatedCriteria}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Select
                    aria-label="Select Edition of Certification Criteria"
                    value={criterionEdition}
                    onChange={handleEditionFilterChange}
                  >
                    <MenuItem value={'2015'}>2015</MenuItem>
                    <MenuItem value={'2014'}>2014</MenuItem>
                    <MenuItem value={'2011'}>2011</MenuItem>
                  </Select>
                </InputAdornment>
              )
            }}
          >
            {criteria
             .filter((criterion) => (criterion.certificationEdition === criterionEdition))
             .map((item) => (
               <MenuItem value={item} key={item.id}>{(item.removed ? 'Removed | ' : '') + item.number + ': ' + item.title}</MenuItem>
             ))}
          </ChplTextField>
          <ChplTextField
            id="actions"
            name="actions"
            label="Actions/Response"
            required
            multiline
            value={formik.values.actions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.actions && !!formik.errors.actions}
            helperText={formik.touched.actions && formik.errors.actions}
          />
          {complaint.listings.length > 0
           &&
           <>
             <Typography>Associated Listings</Typography>
             <ul className={classes.chips}>
               {complaint.listings
                .map((listing) => (
                  <li key={listing.id}>
                    <Chip
                      label={listing.chplProductNumber}
                      onDelete={() => removeAssociatedListing(listing)}
                      className={classes.chip}
                    />
                  </li>
                ))}
             </ul>
           </>
          }
          <Autocomplete
            id="listings"
            name="listings"
            options={listings}
            value={listingToAdd}
            onChange={addAssociatedListing}
            inputValue={listingValueToAdd}
            onInputChange={(event, newValue) => {
              setListingValueToAdd(newValue);
            }}
            getOptionLabel={(item) => (`${item.chplProductNumber} (${item.developer} - ${item.product})`)}
            renderInput={(params) => <ChplTextField {...params} label="Add Associated Listing" />}
          />
          <FormControlLabel
            control={(
              <Switch
                id="complainant-contacted"
                name="complainantContacted"
                color="primary"
                checked={formik.values.complainantContacted}
                onChange={formik.handleChange}
              />
            )}
            label="Complainant Contacted"
          />
        </CardContent>
        <CardActions>
          <ButtonGroup>
            <Button
              onClick={() => handleDispatch('save')}
            >
              Save
            </Button>
            <Button
              onClick={() => handleDispatch('cancel')}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default ChplComplaintEdit;

ChplComplaintEdit.propTypes = {
  complaint: complaintPropType.isRequired,
  complainantTypes: arrayOf(complainantType).isRequired,
  criteria: arrayOf(criterionPropType).isRequired,
  listings: arrayOf(listingPropType).isRequired,
  dispatch: func.isRequired,
};
