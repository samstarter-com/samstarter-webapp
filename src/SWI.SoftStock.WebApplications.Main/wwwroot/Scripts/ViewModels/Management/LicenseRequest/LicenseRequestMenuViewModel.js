LicenseRequestMenuViewModel = function () {
    var self = new MenuViewModel();
   
    self.isItemSelected.subscribe(function (newValue) {
        self.onArchiveLinkClickEnabled(newValue);
    });
    
    self.selectedItem.subscribe(function (newValue) {
        self.onUpdateLinkClickEnabled(newValue && ((Number(newValue.permission()) & 16) == 16));
        self.onSendLinkClickEnabled(newValue && ((Number(newValue.permission()) & 16) == 16));
        self.onCreateLicenseLinkClickEnabled(newValue && ((Number(newValue.permission()) & 4) == 4));
    });
    
    self.updateItemBinded = false;
    self.updateItem = ko.observable(null);
    
    self.sendItemBinded = false;
    self.sendItem = ko.observable(null);
    
    self.createLicenseLinkItemBinded = false;
    self.createLicenseLinkItem = ko.observable(null);
    
    self.archieveItemBinded = false;
    self.archieveItem = ko.observable(null);
    
    self.onUpdateLinkClick = function (data, event) {
        var onClick = function() {
            var viewmodel = new LicenseRequestViewModel(self.selectedItem().id());

            viewmodel.loadFromServer().then(function(resp) {
                    if (resp.data.success === true) {
                        viewmodel.mapData(resp);
                        self.updateItem(viewmodel);
                        if (self.updateItemBinded == false) {
                            ko.applyBindings(self.updateItem, document.getElementById('licenseRequest'));
                            self.updateItemBinded = true;
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
    
    self.onSendLinkClick = function (data, event) {
        var onClick = function () {
            self.sendItem(self.selectedItem());
            if (self.sendItemBinded == false) {
                ko.applyBindings(self.selectedItem(), document.getElementById('send'));
                self.sendItemBinded = true;
            }
            resetValidator('send');
            self.selectedItem().onReceived();
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onCreateLicenseLinkClick = function (data, event) {
        var onClick = function () {
            self.createLicenseLinkItem(self.selectedItem());
            if (self.createLicenseLinkItemBinded == false) {
                ko.applyBindings(self.createLicenseLinkItem, document.getElementById('createLicense'));
                self.createLicenseLinkItemBinded = true;
            }
            
            resetValidator('createLicense');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onArchiveLinkClick = function (data, event) {
        var onClick = function () {
            self.archieveItem(self.selectedItem());
            if (self.archieveItemBinded == false) {
                ko.applyBindings(self.archieveItem, document.getElementById('archive'));
                self.archieveItemBinded = true;
            }
            resetValidator('archive');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onUpdateLinkClickEnabled = ko.observable(false);
    self.onSendLinkClickEnabled = ko.observable(false);
    self.onCreateLicenseLinkClickEnabled = ko.observable(false);
    self.onArchiveLinkClickEnabled = ko.observable(false);

    return self;
};