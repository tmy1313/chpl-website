import { ChplApiKeyConfirm, ChplApiKeyRegistration } from './api-key';
import { ChplConfirmDeveloper, ChplConfirmListings } from './listing/confirm';
import { ChplEllipsis } from './util';
import { ChplFuzzyType } from './fuzzy-type';
import { ChplUploadListings, ChplUploadMeaningfulUse, ChplUploadSurveillance } from './upload';
import { ChplUsers, ChplUserEdit, ChplUserInvite, ChplUserView } from './user';
import { reactToAngularComponent } from '../services/angular-react-helper';

angular
  .module('chpl.components', [
    'angularMoment',
    'angulartics',
    'chpl.services',
    'feature-flags',
    'ngAvatar',
    'ngCytoscape',
    'ngFileUpload',
    'ngIdle',
    'ngResource',
    'ngStorage',
    'smart-table',
    'toaster',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplApiKeyConfirmBridge', reactToAngularComponent(ChplApiKeyConfirm))
  .component('chplApiKeyRegistrationBridge', reactToAngularComponent(ChplApiKeyRegistration))
  .component('chplConfirmDeveloperBridge', reactToAngularComponent(ChplConfirmDeveloper))
  .component('chplConfirmListingsBridge', reactToAngularComponent(ChplConfirmListings))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplFuzzyTypeBridge', reactToAngularComponent(ChplFuzzyType))
  .component('chplUploadListingsBridge', reactToAngularComponent(ChplUploadListings))
  .component('chplUploadMeaningfulUseBridge', reactToAngularComponent(ChplUploadMeaningfulUse))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsers))
  .component('chplUserEditBridge', reactToAngularComponent(ChplUserEdit))
  .component('chplUserInviteBridge', reactToAngularComponent(ChplUserInvite))
  .component('chplUserViewBridge', reactToAngularComponent(ChplUserView))
  .component('chplUploadSurveillanceBridge', reactToAngularComponent(ChplUploadSurveillance));
