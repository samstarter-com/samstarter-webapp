function BaseLicenseViewModel(id, url, menu) {
    var self = new DetailViewModel();

    self.licenseId = ko.observable(id);
    self.name = ko.observable();
    self.url = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
        }
    );

    return self;

};