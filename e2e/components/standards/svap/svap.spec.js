import ActionBarComponent from '../../action-bar/action-bar.async.po';
import LoginComponent from '../../login/login.po';
import { open } from '../../../utilities/hooks.async';
import SystemMaintenancePage from '../../../pages/administration/system-maintenance/system-maintenance.po';

import SvapComponent from './svap.po';

let login;
let page;
let component;
let action;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  component = new SvapComponent();
  await open('#/resources/overview');
});

describe('the svap component', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('svaps');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add a new svap', async () => {
      const version = `Test - ${Date.now()}`;
      const initialCount = (await component.getSvaps()).length;
      await (await component.addButton).click();
      await (await component.citation).setValue('00-Citation');
      await (await component.version).setValue(version);
      await (await component.criterionSelector).click();
      await browser.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await action.save();
      await browser.waitUntil(async () => (await component.getSvaps()).length > initialCount);
      await expect(await (await component.svapTable).getText()).toContain(version);
    });
  });
});