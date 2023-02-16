import React, { useEffect, useState } from 'react';

import ChplDecertifiedProductsCollectionView from './decertified-products-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/data';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  decertificationDate,
  derivedCertificationEditions,
} from 'components/filter/filters';

const staticFilters = [
  certificationDate,
  decertificationDate, {
    ...derivedCertificationEditions,
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }, {
    ...certificationStatuses,
    values: [
      { value: 'Active' },
      { value: 'Suspended by ONC' },
      { value: 'Suspended by ONC-ACB' },
      { value: 'Terminated by ONC', default: true },
      { value: 'Withdrawn by Developer Under Surveillance/Review', default: true },
      { value: 'Withdrawn by ONC-ACB', default: true },
      { value: 'Withdrawn by Developer' },
      { value: 'Retired' },
    ],
  }];

function ChplDecertifiedProductsCollectionPage() {
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) {
      return;
    }
    const values = acbQuery.data.acbs
      .map((acb) => ({
        ...acb,
        value: acb.name,
        display: `${acb.retired ? 'Retired | ' : ''}${acb.name}`,
        default: !acb.retired || ((Date.now() - acb.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4)), // approx 4 months
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationBodies')
      .concat({
        ...certificationBodies,
        values,
      }));
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    const values = ccQuery.data.criteria
      .filter((cc) => cc.certificationEditionId === 3)
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.removed ? 'Removed | ' : ''}${cc.number}${cc.title.includes('Cures Update') ? ' (Cures Update)' : ''}`,
        longDisplay: `${cc.removed ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  const analytics = {
    category: 'Decertified Products',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-decertifiedProductsPage"
    >
      <ChplDecertifiedProductsCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplDecertifiedProductsCollectionPage;

ChplDecertifiedProductsCollectionPage.propTypes = {
};
