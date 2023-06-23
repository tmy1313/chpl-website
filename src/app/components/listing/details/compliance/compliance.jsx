import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';

import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';

function ChplCompliance({ directReviews, directReviewsAvailable, surveillance: initialSurveillance }) {
  const [surveillance, setSurveillance] = useState([]);
  const [icsSurveillance, setIcsSurveillance] = useState([]);

  useEffect(() => {
    setSurveillance(initialSurveillance.filter((surv) => surv.requirements.some((req) => req.type.name !== 'Inherited Certified Status')));
    setIcsSurveillance(initialSurveillance.filter((surv) => surv.requirements.every((req) => req.type.name === 'Inherited Certified Status')));
  }, [initialSurveillance]);

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1">
          Compliance Activities
        </Typography>
        <ChplSurveillance surveillance={icsSurveillance} ics />
        <ChplSurveillance surveillance={surveillance} />
        <ChplDirectReviews directReviews={directReviews} directReviewsAvailable={directReviewsAvailable} />
      </CardContent>
    </Card>
  );
}

export default ChplCompliance;

ChplCompliance.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
  surveillance: arrayOf(surveillancePropType).isRequired,
};
