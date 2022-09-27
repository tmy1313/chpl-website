import React, { useContext, useEffect, useState } from 'react';

import ChplRealWorldTestingCollectionView from './real-world-testing-view';

import { useFetchCriteria } from 'api/data';
import { FilterProvider, defaultFilter } from 'components/filter';
import { FlagContext } from 'shared/contexts';

const criteriaKeysPreERDPhase2 = [
  16,
  165,
  17,
  166,
  18,
  167,
  21,
  22,
  168,
  23,
  169,
  24,
  170,
  171,
  25,
  26,
  27,
  172,
  40,
  178,
  43,
  44,
  45,
  46,
  47,
  179,
  48,
  49,
  56,
  57,
  58,
  181,
  182,
  59,
  60,
];

const criteriaKeys = [
  165,
  166,
  167,
  21,
  168,
  169,
  170,
  171,
  25,
  26,
  172,
  178,
  43,
  44,
  45,
  46,
  179,
  48,
  49,
  56,
  57,
  181,
  182,
  59,
  60,
];

const staticFilters = [{
  ...defaultFilter,
  key: 'derivedCertificationEditions',
  display: 'Certification Edition',
  required: true,
  values: [
    { value: '2015', default: true },
    { value: '2015 Cures Update', default: true },
  ],
}, {
  ...defaultFilter,
  key: 'certificationStatuses',
  display: 'Certification Status',
  values: [
    { value: 'Active', default: true },
    { value: 'Suspended by ONC', default: true },
    { value: 'Suspended by ONC-ACB', default: true },
    { value: 'Terminated by ONC' },
    { value: 'Withdrawn by Developer Under Surveillance/Review' },
    { value: 'Withdrawn by ONC-ACB' },
    { value: 'Withdrawn by Developer' },
    { value: 'Retired' },
  ],
}];

function ChplRealWorldTestingCollectionPage() {
  const { isOn } = useContext(FlagContext);
  const [erdPhase2IsOn, setErdPhase2IsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const ccQuery = useFetchCriteria();

  useEffect(() => {
    setErdPhase2IsOn(isOn('erd-phase-2'));
  }, [isOn]);

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    // .sort((a, b) => (a.name < b.name ? -1 : 1)) pull in sort from OCD-4038
    const values = ccQuery.data.criteria
      .filter((cc) => cc.certificationEditionId === 3)
      .map((cc) => ({
        value: cc.id,
        display: `${cc.removed ? 'Removed | ' : ''}${cc.number}${cc.title.includes('Cures Update') ? ' (Cures Update)' : ''}`,
        default: erdPhase2IsOn ? criteriaKeys.includes(cc.id) : criteriaKeysPreERDPhase2.includes(cc.id),
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...defaultFilter,
        key: 'certificationCriteriaIds',
        display: 'Certification Criteria',
        operatorKey: 'certificationCriteriaOperator',
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess, erdPhase2IsOn]);

  const analytics = {
    category: 'Real World Testing',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
    >
      <ChplRealWorldTestingCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplRealWorldTestingCollectionPage;

ChplRealWorldTestingCollectionPage.propTypes = {
};
