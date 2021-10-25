SoftwareMachineMenuViewModel = function (softwareId) {

    var self = new MenuViewModel();
    self.softwareId = ko.observable(softwareId);
    self.availableLicenseList = null;
    
    self.selectedItem.subscribe(function (newValue) {
        if (newValue == null) {
            self.onCreateLicenseRequestClickEnabled(false);
            self.onLinkToLicenseClickEnabled(false);
            self.onUnLinkFromLicenseClickEnabled(false);
        } else {
            self.onCreateLicenseRequestClickEnabled(newValue.userId() != null);
            self.onLinkToLicenseClickEnabled(!newValue.hasLicense());
            self.onUnLinkFromLicenseClickEnabled(newValue.hasLicense());
        }
    });

    self.createLicenseRequestItemBinded = false;
    self.createLicenseRequestItem = ko.observable(null);
    
    self.onLinkToLicenseClickEnabled = ko.observable(false);
    self.onUnLinkFromLicenseClickEnabled = ko.observable(false);
    self.onCreateLicenseRequestClickEnabled = ko.observable(false);
    
    self.onCreateLicenseRequestClick = function () {
        var onClick = function () {
            var machineId = self.selectedItem().machineId();
            axios.get(`${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}/newlicense?machineId=${machineId}&softwareId=${self.softwareId()}`)
                .then(function (resp) {
                    var model = resp.data;
                    if (model.success == true) {
                        var licenseRequest = new LicenseRequestViewModel();
                        licenseRequest.softwareId(softwareId);
                        licenseRequest.machineId(self.machineId);
                        ko.mapping.fromJS(model.model, {}, licenseRequest);
                        self.createLicenseRequestItem(licenseRequest);
                        if (self.createLicenseRequestItemBinded == false) {
                            ko.applyBindings(self.createLicenseRequestItem, document.getElementById('licenseRequest'));
                            self.createLicenseRequestItemBinded = true;
                        }
                        resetValidator('licenseRequest');
                    } else {
                        //todo отображать ошибки
                    }
                });

        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onUnLinkFromLicenseClick = function (data, event) {
        var onOpenDialog = function () {
            $('#unLink').find('#machineId').val(self.selectedItem().machineId());
            $('#unLink').find('#softwareId').val(self.softwareId());
            resetValidator('unLink');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onOpenDialog);
    };

    self.onLinkToLicenseClick = function (data, event) {
        var onOpenDialog = function () {
            if (self.availableLicenseList == null) {
                self.availableLicenseList = new ShortLicensesListViewModel();
                ko.applyBindings(self.availableLicenseList, document.getElementById("licenseContent"));
            }
            self.availableLicenseList.softwareId(self.softwareId());
            self.availableLicenseList.machineId(self.selectedItem().machineId());
            self.availableLicenseList.loadFromServer();
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onOpenDialog);
    };
    
    return self;
};