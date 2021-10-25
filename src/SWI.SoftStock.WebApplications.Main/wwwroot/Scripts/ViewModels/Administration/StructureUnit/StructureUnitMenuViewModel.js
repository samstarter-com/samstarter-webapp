StructureUnitMenuViewModel = function () {
    var self = new MenuViewModel();

    self.addItemBinded = false;
    self.addItem = ko.observable(null);

    self.updateItemBinded = false;
    self.updateItem = ko.observable(null);

    self.deleteItemBinded = false;
    self.deleteItem = ko.observable(null);

    self.grantRoleItemBinded = false;
    self.grantRoleItem = ko.observable(null);

    self.isItemSelected.subscribe(function (newValue) {
        self.onDeleteLinkClickEnabled(newValue);
        self.onAddLinkClickEnabled(newValue);
        self.onUpdateLinkClickEnabled(newValue);
        self.onGrantUserRoleLinkClickEnabled(newValue);
    });

    self.onDeleteLinkClick = function (data, event) {
        var onClick = function () {
            var viewmodel = new StructureUnitViewModel(self.selectedItem().id());
            viewmodel.loadFromServer().then(function (resp) {
                viewmodel.mapData(resp);
                self.deleteItem(viewmodel);
                if (self.deleteItemBinded === false) {
                    ko.applyBindings(self.deleteItem, document.getElementById('delete'));
                    self.deleteItemBinded = true;
                }
            });
            resetValidator('delete');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onAddLinkClick = function (data, event) {
        var onClick = function () {
            var structureUnit = new StructureUnitViewModel();
            structureUnit.parentUniqueId = self.selectedItem().id();
            self.addItem(structureUnit);
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
            var viewmodel = new StructureUnitViewModel(self.selectedItem().id());
            viewmodel.loadFromServer().then(function(resp) {
                    viewmodel.mapData(resp);

                axios.get(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}?id=${viewmodel.id()}`)
                    .then(function (resp) {
                        viewmodel.structureUnits(resp.data);
                        viewmodel.onTreeChange = function (data) {
                            self.updateItem().parentUniqueId = data.node.id;
                        };
                        self.updateItem(viewmodel);
                        if (self.updateItemBinded === false) {
                            ko.applyBindings(self.updateItem, document.getElementById('update'));
                            self.updateItemBinded = true;
                        }
                    });
            });

        };

        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onGrantUserRoleLinkClick = function (data, event) {
        var onClick = function () {
            var grantRoleViewModel = new GrantRoleViewModel();
            grantRoleViewModel.selectedStructureUnitId = self.selectedItem().uniqueId();
            grantRoleViewModel.loadFromServer();
            self.grantRoleItem(grantRoleViewModel);
            if (self.grantRoleItemBinded === false) {
                ko.applyBindings(self.grantRoleItem, document.getElementById('grantRole'));
                self.grantRoleItemBinded = true;
            }
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onDeleteLinkClickEnabled = ko.observable(false);
    self.onAddLinkClickEnabled = ko.observable(false);
    self.onUpdateLinkClickEnabled = ko.observable(false);
    self.onGrantUserRoleLinkClickEnabled = ko.observable(false);

    return self;
};