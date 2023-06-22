import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import CriteriaComponent from '../../components/listing/details/criteria/criteria.po';
import LoginComponent from '../../components/login/login.sync.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import ToastComponent from '../../components/toast/toast.po';

let action;
let criteria;
let hooks;
let login;
let page;
let toast;

/* ignore these tests until OCD-4227 is done */
xdescribe('On the 2015 Listing page', () => {
  beforeEach(async () => {
    page = new ListingPage();
    hooks = new Hooks();
    toast = new ToastComponent();
    login = new LoginComponent();
    criteria = new CriteriaComponent();
    action = new ActionBarComponent();
    await hooks.open('#/listing/10599');
  });

  describe('When ONC logged in', () => {
    beforeEach(async () => {
      login.logIn('onc');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
    });

    afterEach(async () => {
      login.logOut();
    });

    it('should able to unattest attested criteria 170.315 (d)(3) cures update', () => {
      /*
       * Disabling code that runs tests against edit screen with UI-Upgrade flag on
       * as the method used to determine if the flag is on is not working correctly
       * and hence giving weird results. I suggest leaving this section disabled until
       * the ui-upgrade flag is turned on (or at least planned to be) and in that case,
       * disabling the code for the old version. Having two versions of these edit steps
       * makes the tests flaky
       */
      /*
        if (criteria.uiUpgradeFlag()) {
        criteria.expandCriteria('174');
        criteria.editCriteria('174');
        criteria.attestToggle.click();
        criteria.accept.click();
        expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
        } else {
      */
      criteria.editCriteriaOldButton('170.315 (d)(3)').scrollIntoView({ block: 'center', inline: 'center' });
      criteria.openAttestedCriteriaOld('170.315 (d)(3)', true);
      criteria.attestCriteriaOld('170.315 (d)(3)');
      criteria.saveCertifiedProductOld.click();
      //      }
      page.reason.addValue('test');
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('CHPL ID Changed' || 'Update processing');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('174', '170.315 (d)(3)', true).isDisplayed()).toBe(false);
    });

    it('should able to attest unattested criteria 170.315 (g)(6) cures update', () => {
      /*
       * Disabling code that runs tests against edit screen with UI-Upgrade flag on
       * as the method used to determine if the flag is on is not working correctly
       * and hence giving weird results. I suggest leaving this section disabled until
       * the ui-upgrade flag is turned on (or at least planned to be) and in that case,
       * disabling the code for the old version. Having two versions of these edit steps
       * makes the tests flaky
       */
      /*
        if (criteria.uiUpgradeFlag()) {
        criteria.expandCriteria('180');
        criteria.editCriteria('180');
        criteria.attestToggle.click();
        hooks.waitForSpinnerToDisappear();
        criteria.addConformanceMethods('ONC Test Procedure', '1.1');
        criteria.addTestTools('Not Applicable', '1.1');
        criteria.addTestTools('Edge Testing Tool', '2.1');
        criteria.accept.click();
        expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
        } else {
      */
      criteria.editCriteriaOldButton('170.315 (g)(6)').scrollIntoView({ block: 'center', inline: 'center' });
      criteria.openUnattestedCriteriaOld('170.315 (g)(6)', true);
      criteria.attestCriteriaOld('170.315 (g)(6)');
      criteria.addConformanceMethodsOld('ONC Test Procedure', '1.1');
      criteria.addTestToolsOld('Edge Testing Tool', '1.1');
      criteria.saveCertifiedProductOld.click();
      //      }
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Update processing');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('180', '170.315 (g)(6)', true).isDisplayed()).toBe(true);
    });
  });
});
