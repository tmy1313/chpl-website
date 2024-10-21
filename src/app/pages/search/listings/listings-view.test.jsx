import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplListingsView from './listings-view';

import * as angularReactHelper from 'services/angular-react-helper';

const angularMock = {
  eventTrack: jest.fn(),
  getApiKey: () => 'fake api key',
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(angularMock);
when(angularReactHelper.getAngularService).calledWith('API').mockReturnValue('fakeMock');
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(angularMock);

const mockContext = {
  dispatch: jest.fn(() => 'dispatch'),
  hasSearched: true,
  queryString: jest.fn(() => 'queryString'),
};

const mockApi = {
  isLoading: true,
  data: {},
};

/* eslint-disable react/display-name */
jest.mock('components/filter', () => ({
  __esModule: true,
  ChplFilterChips: () => <div>Chips</div>,
  ChplFilterQuickFilters: () => <div>Quick Filters</div>,
  ChplFilterSearchBar: () => <div>Search Bar</div>,
  useFilterContext: () => mockContext,
}));
/* eslint-enable react/display-name */

jest.mock('api/search', () => ({
  __esModule: true,
  useFetchSearchData: () => mockApi,
  useFetchListings: () => mockApi,
}));

describe('the ChplListingsView component', () => {
  afterEach(() => {
    cleanup();
  });

  it('has a title', async () => {
    render(
      <ChplListingsView analytics={{ category: 'test' }} />,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CHPL Listings');
    });
  });
});