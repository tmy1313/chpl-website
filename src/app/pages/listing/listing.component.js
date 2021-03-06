export const ListingComponent = {
    templateUrl: 'chpl.listing/listing.html',
    bindings: { },
    controller: class ListingComponent {
        constructor ($localStorage, $log, $q, $state, $stateParams, $uibModal, DateUtil, authService, featureFlags, networkService, utilService) {
            'ngInject';
            this.$localStorage = $localStorage;
            this.$log = $log;
            this.$q = $q;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$uibModal = $uibModal;
            this.DateUtil = DateUtil;
            this.authService = authService;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
            this.utilService = utilService;
            this.certificationStatus = utilService.certificationStatus;
            this.hasAnyRole = authService.hasAnyRole;
            this.resources = {};
            this.editCallbacks = {};
            this.isSaving = false;
            this.workType = 'edit';
        }

        $onInit () {
            this.loading = true;
            this.listingId = this.$stateParams.id;
            this.initialPanel = this.$stateParams.initialPanel || 'cert';
            if (this.$localStorage.previouslyViewed) {
                this.previouslyViewed = this.$localStorage.previouslyViewed;

                if (this.previouslyViewed.indexOf((this.listingId + '')) === -1) {
                    this.previouslyViewed.push((this.listingId + ''));
                    if (this.previouslyViewed.length > 20) {
                        this.previouslyViewed.shift();
                    }
                    this.$localStorage.previouslyViewed = this.previouslyViewed;
                }
            } else {
                this.$localStorage.previouslyViewed = [this.listingId + ''];
            }
            this.loadListing();
            this.loadResources();
        }

        can (action) {
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; } // can do everything
            if (action === 'merge') { return false; } // if not above roles, can't merge
            return this.listing.developer.status.status === 'Active' && this.hasAnyRole(['ROLE_ACB']); // must be active
        }

        canEdit () {
            if (this.listing.certificationEdition.name === '2014') {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            } else {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']);
            }
        }

        canViewRwtDates () {
            if (this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                return true;
            } else if (this.authService.hasAnyRole(['ROLE_ACB'])) {
                let currentUser = this.authService.getCurrentUser();
                return currentUser.organizations
                    .filter(o => o.id === this.listing.certifyingBody.id)
                    .length > 0;
            } else if (this.authService.hasAnyRole(['ROLE_DEVELOPER'])) {
                let currentUser = this.authService.getCurrentUser();
                return currentUser.organizations
                    .filter(d => d.id === this.listing.developer.developerId)
                    .length > 0;
            }
            return false;
        }

        cancel () {
            this.listing = angular.copy(this.backupListing);
            this.isEditing = false;
        }

        loadListing () {
            let that = this;
            this.networkService.getListing(this.listingId)
                .then(data => {
                    that.loading = false;
                    that.listing = data;
                    that.backupListing = angular.copy(that.listing);
                    that.loadDirectReviews();
                }, () => {
                    that.loading = false;
                });
        }

        loadDirectReviews () {
            let that = this;
            this.networkService.getDirectReviews(this.listing.developer.developerId)
                .then(data => that.directReviews = {
                    status: 200,
                    drs: data,
                }, error => that.directReviews = {
                    status: error,
                    drs: [],
                });
        }

        loadResources () {
            let that = this;
            this.$q.all([
                this.networkService.getSearchOptions()
                    .then(response => {
                        that.resources.bodies = response.acbs;
                        that.resources.classifications = response.productClassifications;
                        that.resources.editions = response.editions;
                        that.resources.practices = response.practiceTypes;
                        that.resources.statuses = response.certificationStatuses;
                    }),
                this.networkService.getAccessibilityStandards().then(response => that.resources.accessibilityStandards = response),
                this.networkService.getAtls(false).then(response => that.resources.testingLabs = response.atls),
                this.networkService.getQmsStandards().then(response => that.resources.qmsStandards = response),
                this.networkService.getTargetedUsers().then(response => that.resources.targetedUsers = response),
                this.networkService.getTestData().then(response => that.resources.testData = response),
                this.networkService.getTestFunctionality().then(response => that.resources.testFunctionalities = response),
                this.networkService.getTestProcedures().then(response => that.resources.testProcedures = response),
                this.networkService.getTestStandards().then(response => that.resources.testStandards = response),
                this.networkService.getTestTools().then(response => that.resources.testTools = response),
                this.networkService.getUcdProcesses().then(response => that.resources.ucdProcesses = response),
            ]).then(() => {
                angular.noop;
            });
        }

        saveEdit (listing, reason, acknowledgeWarnings) {
            let that = this;
            this.isSaving = true;
            this.networkService.updateCP({
                listing: listing,
                reason: reason,
                acknowledgeWarnings: acknowledgeWarnings,
            }).then(response => {
                if (!response.status || response.status === 200) {
                    that.isEditing = false;
                    that.isSaving = false;
                    that.listing = response;
                } else {
                    that.saveErrors = { errors: [response.error]};
                    that.isSaving = false;
                }
            }, error => {
                that.saveErrors = {
                    errors: [],
                    warnings: [],
                };
                if (error.data) {
                    if (error.data.error && error.data.error.length > 0) {
                        that.saveErrors.errors.push(error.data.error);
                    }
                    if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                        that.saveErrors.errors = that.saveErrors.errors.concat(error.data.errorMessages);
                    }
                    if (error.data.warningMessages && error.data.warningMessages.length > 0) {
                        that.saveErrors.warnings = that.saveErrors.warnings.concat(error.data.warningMessages);
                    }
                }
                that.isSaving = false;
            });
        }

        takeDeveloperAction (action, developerId) {
            this.$state.go('organizations.developers.developer', {
                developerId: developerId,
            });
        }

        viewListingHistory () {
            let that = this;
            this.$uibModal.open({
                component: 'chplListingHistory',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    listing: () => that.listing,
                },
            });
        }
    },
};

angular
    .module('chpl.listing')
    .component('chplListing', ListingComponent);
