function ShortLicenseViewModel() {
    var self = new DetailViewModel();
    self.licenseId = ko.observable(0);
    self.id = ko.computed(
    function () {
        return self.licenseId();
    }
);
    self.name = ko.observable();
    self.url = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
        }
    );
    return self;
};
