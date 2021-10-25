UserMenuViewModel = function () {
    var self = new MenuViewModel();

    self.structureUnitId = ko.observable();
    self.structureUnitId.subscribe(function (newValue) {
        self.onAddLinkClickEnabled((typeof newValue !== 'undefined') && (newValue !== null));
    });

    self.isItemSelected.subscribe(function (newValue) {
        self.onChangeRoleLinkClickEnabled(newValue);
        self.onUpdateLinkClickEnabled(newValue);
        self.onDeleteLinkClickEnabled(newValue);
    });

    self.selectedItem.subscribe(function (newValue) {
        if (newValue === null) {
            self.onUnLockLinkClickEnabled(false);
        } else {
            self.onUnLockLinkClickEnabled(newValue.isLocked());
        }
    });

    self.addItemBinded = false;
    self.addItem = ko.observable(null);

    self.updateItemBinded = false;
    self.updateItem = ko.observable(null);

    self.deleteItemBinded = false;
    self.deleteItem = ko.observable(null);

    self.changeRoleItemBinded = false;
    self.changeRoleItem = ko.observable(null);

    self.unLockItemBinded = false;
    self.unLockItem = ko.observable(null);

    self.onAddLinkClick = function (data, event) {
        var onClick = function () {
            var user = new UserViewModel();
            user.structureUnitId(self.structureUnitId());
            self.addItem(user);
            if (self.addItemBinded === false) {
                ko.applyBindings(self.addItem, document.getElementById('add'));
                self.addItemBinded = true;
            }
            resetValidator('add');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onDeleteLinkClick = function (data, event) {
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

    self.onUpdateLinkClick = function (data, event) {
        var onClick = function () {
            var viewmodel = new UserViewModel();
            self.updateItem(viewmodel);
            self.updateItem().userId(self.selectedItem().id());
            let promises = Promise.all([self.updateItem().loadFromServer(), self.updateItem().loadStructureUnits()]);

            promises.then(
                    function (resp) {
                        self.updateItem().mapData(resp[0]);
                        return resp;
                    })
                .then(function (resp) {
                        if (resp[1]) {
                            self.updateItem().structureUnits(resp[1].data);
                            if (self.updateItemBinded === false) {
                                ko.applyBindings(self.updateItem, document.getElementById('update'));
                                self.updateItemBinded = true;
                            }
                        }
                      
                    }
            ).catch(self.showError);

            //viewmodel.loadFromServer().then(resp => {
            //    viewmodel.mapData(resp);
            //    self.updateItem(viewmodel);
            //    if (self.updateItemBinded === false) {
            //        ko.applyBindings(self.updateItem, document.getElementById('update'));
            //        self.updateItemBinded = true;
            //    }
            //});
          
            resetValidator('update');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onChangeRoleLinkClick = function (data, event) {
        var onClick = function () {
            var changeRoleViewModel = new UserViewModel();
            changeRoleViewModel.userId(self.selectedItem().id());

            changeRoleViewModel.loadFromServer().then(resp => {
                changeRoleViewModel.mapData(resp);
                self.changeRoleItem(changeRoleViewModel);
                if (self.changeRoleItemBinded === false) {
                    ko.applyBindings(self.changeRoleItem, document.getElementById('changeRole'));
                    self.changeRoleItemBinded = true;
                }
            });

            changeRoleViewModel.filterVM = new TreeFilterViewModel();
            changeRoleViewModel.filterVM.filterDataUrl = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`;
            changeRoleViewModel.filterVM.onApplyFilter = function(data) {
                changeRoleViewModel.onTreeChange({ node: { id: data.id } });
            };

            changeRoleViewModel.filterVM.initialize($('#userroles'));
            changeRoleViewModel.filterVM.applyBindings(document.getElementById('cr_compFilter'));
            
            resetValidator('changeRole');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onUnLockLinkClick = function (data, event) {
        var onClick = function () {
            self.unLockItem(self.selectedItem());
            if (self.unLockItemBinded === false) {
                ko.applyBindings(self.unLockItem, document.getElementById('unLock'));
                self.unLockItemBinded = true;
            }
            resetValidator('unLock');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onAddLinkClickEnabled = ko.observable(false);
    self.onChangeRoleLinkClickEnabled = ko.observable(false);
    self.onUpdateLinkClickEnabled = ko.observable(false);
    self.onDeleteLinkClickEnabled = ko.observable(false);
    self.onUnLockLinkClickEnabled = ko.observable(false);

    return self;
};