ManagementPageViewModel = function () {

    var self = new PageViewModel();

    self.licenseRequestCount = ko.observable();
    self.getNewLicenseRequestCount = function () {

        axios.get(`${self.baseApiAddress}${MANAGEMENT_LICENSEREQUEST_ENDPOINT}/newcount`).then(function (response) {
            if (response.data === 0) {
                self.licenseRequestCount();
            } else {
                self.licenseRequestCount(response.data);
            }
        });
    };

    return self;
};