LicenseMenuViewModel = function () {
    var self = new MenuViewModel();
    self.useAjaxFormHandler = true;
    self.structureUnitId = ko.observable();
    
    self.structureUnitId.subscribe(function (newValue) {
        self.onAddLinkClickEnabled((typeof newValue != 'undefined') && (newValue != null));
    });
    
    self.isItemSelected.subscribe(function (newValue) {
        self.onUpdateLinkClickEnabled(newValue);
        self.onDeleteLinkClickEnabled(newValue);
        self.onLinkToStructureUnitClickEnabled(newValue);
    });

    self.selectedLinkToStructureUnitItemBinded = false;
    self.selectedLinkToStructureUnitItem = ko.observable(null);

    self.addItemBinded = false;
    self.addItem = ko.observable(null);

    self.updateItemBinded = false;
    self.updateItem = ko.observable(null);
    
    self.deleteItemBinded = false;
    self.deleteItem = ko.observable(null);
    
    self.onAddLinkClick = function (data, event) {
        var onClick = function () {
            var license = new LicenseViewModel();
            license.setLicensetypes();
            license.structureUnitId(self.structureUnitId());
            self.addItem(license);
            if (self.addItemBinded === false) {
                ko.applyBindings(self.addItem, document.getElementById('add'));
                self.addItemBinded = true;
            }
            resetValidator('add');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onUpdateLinkClick = function (data, event) {
        var onClick = function () {
            var lu = new LicenseViewModel(self.selectedItem().id());
            lu.loadDetailFromServer().then(async function(resp) {
                ko.mapping.fromJS(resp.data.details, lu.mapping, lu);
                lu.setLicensetypes();
                lu.isNew(false);
                ko.utils.arrayForEach(lu.alerts(), function (alert) {
                    lu.alertAdded(alert);
                    alert.init(lu.form);
                });

                self.updateItem(lu);
                if (self.updateItemBinded === false) {
                    ko.applyBindings(self.updateItem, document.getElementById('update'));
                    self.updateItemBinded = true;
                }
                resetValidator('update');
            });
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onDeleteLinkClick = function(data, event) {
        var onClick = function () {
            self.deleteItem(self.selectedItem());
            if (self.deleteItemBinded === false) {
                ko.applyBindings(self.deleteItem, document.getElementById('delete'));
                self.deleteItemBinded = true;
            }
            resetValidator('delete');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onLinkToStructureUnitClick = function (data, event) {
        var onClick = function () {

            var viewmodel = new LicenseViewModel(self.selectedItem().id());
            viewmodel.loadFromServer().then(function (resp) {
                ko.mapping.fromJS(resp.data.details, viewmodel.mapping, viewmodel);

                axios.get(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}?id=${viewmodel.structureUnitId()}`)
                    .then(function (resp) {
                        viewmodel.structureUnits(resp.data);
                        self.selectedLinkToStructureUnitItem(viewmodel);
                        if (!self.selectedLinkUsersListItemBinded) {
                            ko.applyBindings(self.selectedLinkToStructureUnitItem,
                                document.getElementById('linkStructureUnit'));
                            self.selectedLinkUsersListItemBinded = true;
                        };
                        resetValidator('linkStructureUnit');
                    });
            });
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onUpdateLinkClickEnabled = ko.observable(false);
    self.onDeleteLinkClickEnabled = ko.observable(false);
    self.onLinkToStructureUnitClickEnabled = ko.observable(false);

    self.onAddLinkClickEnabled = ko.observable(false);

    return self;
};