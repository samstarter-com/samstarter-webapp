MachineMenuViewModel = function () {

    var self = new MenuViewModel();

    self.isItemSelected.subscribe(function (newValue) {
        self.onLinkToStructureUnitClickEnabled(newValue);
        self.onLinkToUserClickEnabled(newValue);
        self.onDeleteClickEnabled(newValue);
    });

    self.selectedItem.subscribe(function (newValue) {
        if (newValue == null) {
            self.onEnableClickEnabled(false);
            self.onDisableClickEnabled(false);
        } else {
            self.onEnableClickEnabled(!newValue.enabled());
            self.onDisableClickEnabled(newValue.enabled());
        }
    });

    self.onLinkToStructureUnitClickEnabled = ko.observable(false);
    self.onLinkToUserClickEnabled = ko.observable(false);
    self.onDeleteClickEnabled = ko.observable(false);
    self.onEnableClickEnabled = ko.observable(false);
    self.onDisableClickEnabled = ko.observable(false);

    self.selectedLinkToStructureUnitItemBinded = false;
    self.selectedLinkToStructureUnitItem = ko.observable(null);

    self.selectedLinkUsersListItemBinded = false;
    self.selectedLinkUsersListItem = ko.observable(null);

    self.deleteItemBinded = false;
    self.deleteItem = ko.observable(null);

    self.deleteItemBinded = false;
    self.deleteItem = ko.observable(null);

    self.disableItemBinded = false;
    self.disableItem = ko.observable(null);

    self.enableItemBinded = false;
    self.enableItem = ko.observable(null);

    self.onLinkToStructureUnitClick = function (data, event) {
        var onClick = function () {

            var viewmodel = new MachineViewModel(self.selectedItem().id());

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

    self.onLinkToUserClick = function (data, event) {
        var onClick = function () {

            var structureUnitId = self.selectedItem().structureUnitId();

            var linkToUserViewModel = new BaseViewModel();
            linkToUserViewModel.linkUser = function (data) {
                linkToUserViewModel.errors.removeAll();
                var $form = $(data);
                if (!$form.valid()) return;

                axios.post(`${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.selectedItem().id()}/user/${self.selectedLinkUsersListItem().selectedItem().id()}`,
                    {}).then(function (response) {
                        if (response.data.success) {
                            location.reload();
                        }
                        else {
                            ko.utils.arrayPushAll(self.errors, response.data.errors);
                            return;
                        }
                    }).catch(function (error) {
                        self.showError(error);
                    });
            };

            linkToUserViewModel.filterVM = new TreeFilterViewModel();
            linkToUserViewModel.filterVM.filterDataUrl = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`;

            linkToUserViewModel.filterVM.id = structureUnitId;

            linkToUserViewModel.filterVM.onApplyFilter = function (data) {
                var selectedLinkUsersList = new UsersListViewModel();
                selectedLinkUsersList.paging.clear();
                data.structureUnitId = data.id;
                selectedLinkUsersList.setCustomProperties(data);

                selectedLinkUsersList.loadFromServer()
                    .then(resp => selectedLinkUsersList.mapData(resp))
                    .catch(function (error) {
                        console.log(error);
                    });

                self.selectedLinkUsersListItem(selectedLinkUsersList);
                if (self.selectedLinkUsersListItemBinded === false) {
                    ko.applyBindings(self.selectedLinkUsersListItem, document.getElementById('userContent'));
                    self.selectedLinkUsersListItemBinded = true;
                }
            };
            linkToUserViewModel.filterVM.initialize($('#userContent'));
            linkToUserViewModel.filterVM.applyBindings(document.getElementById('machine_u'));

            ko.applyBindings(linkToUserViewModel, document.getElementById('linkUser'));
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onDeleteClick = function (data, event) {
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

    self.onDisableClick = function (data, event) {
        var onClick = function () {
            self.disableItem(self.selectedItem());
            if (self.disableItemBinded === false) {
                ko.applyBindings(self.disableItem, document.getElementById('disable'));
                self.disableItemBinded = true;
            }
            resetValidator('disable');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onEnableClick = function (data, event) {
        var onClick = function () {
            self.enableItem(self.selectedItem());
            if (self.enableItemBinded == false) {
                ko.applyBindings(self.enableItem, document.getElementById('enable'));
                self.enableItemBinded = true;
            }
            resetValidator('enable');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    return self;
};