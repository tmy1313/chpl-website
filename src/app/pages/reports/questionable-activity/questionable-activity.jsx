import React, { useEffect, useState } from 'react';

import ChplQuestionableActivityView from './questionable-activity-view';

import { useFetchQuestionableActivityData } from 'api/questionable-activity';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';

const staticFilters = [{
  ...defaultFilter,
  key: 'activityDate',
  display: 'Activity Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '2022-01-01' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'activityDateStart' : 'activityDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}];

function ChplQuestionableActivityPage() {
  const [filters, setFilters] = useState(staticFilters);
  const qaTypeQuery = useFetchQuestionableActivityData();

  useEffect(() => {
    if (qaTypeQuery.isLoading || !qaTypeQuery.isSuccess) {
      return;
    }
    const values = qaTypeQuery.data
      .map((type) => ({
        ...type,
        value: type.id,
        display: `${type.name} (${type.level})`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'triggerIds')
      .concat({
        ...defaultFilter,
        key: 'triggerIds',
        display: 'Questionable Activity Type',
        values,
      }));
  }, [qaTypeQuery.data, qaTypeQuery.isLoading, qaTypeQuery.isSuccess]);

  const analytics = {
    category: 'Questionable Activity',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-questionableActivity"
    >
      <ChplQuestionableActivityView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplQuestionableActivityPage;

ChplQuestionableActivityPage.propTypes = {
};
