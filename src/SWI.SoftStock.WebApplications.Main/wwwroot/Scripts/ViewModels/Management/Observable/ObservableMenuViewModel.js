ObservableMenuViewModel = function () {
    var self = new MenuViewModel();
    
    self.isItemSelected.subscribe(function (newValue) {
        self.onAppendLinkClickEnabled(newValue);
        self.onDeleteLinkClickEnabled(newValue);
    });
    
    self.addItemBinded = false;
    self.addItem = ko.observable(null);
    
    self.appendItemBinded = false;
    self.appendItem = ko.observable(null);
    
    self.deleteItemBinded = false;
    self.deleteItem = ko.observable(null);

    self.selectedLinkMachinesListItemBinded = false;
    self.selectedLinkMachinesListItem = ko.observable(null);

    self.onAddLinkClick = function (data, event) {
        var onClick = function () {
            var observable = new ObservableViewModel();
            observable.softwareId.subscribe(function (newValue) {
                var element = $('#add').find('#SoftwareId');
                element.val(newValue);
                if (self.submitted) {
                    element.valid();
                }
            });
            self.addItem(observable);
            if (self.addItemBinded == false) {
                ko.applyBindings(self.addItem, document.getElementById('add'));
                self.addItemBinded = true;
            }
            resetValidator('add');

        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onAppendLinkClick = function (data, event) {
        var onClick = function () {
            var structureUnitId = self.selectedItem().structureUnitId();

            var linkToMachineViewModel = new BaseViewModel();
            linkToMachineViewModel.append = function(data) {
                linkToMachineViewModel.errors.removeAll();
                var $form = $(data);
                if (!$form.valid()) return;

                axios.post(`${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}/${self.selectedItem().id()}/machine/${self.selectedLinkMachinesListItem().selectedItem().id()}`,
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
            linkToMachineViewModel.filterVM = new TreeFilterViewModel();
            linkToMachineViewModel.filterVM.filterDataUrl = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`;
            linkToMachineViewModel.filterVM.id = structureUnitId;

            linkToMachineViewModel.filterVM.onApplyFilter = function (data) {
                var selectedLinkMachinesList = new MachinesListViewModel();
                selectedLinkMachinesList.paging.clear();
                selectedLinkMachinesList.structureUnitId = data.id;

                selectedLinkMachinesList.loadFromServer()
                    .then(resp => selectedLinkMachinesList.mapData(resp))
                    .catch(function (error) {
                        console.log(error);
                    });

                self.selectedLinkMachinesListItem(selectedLinkMachinesList);
                if (self.selectedLinkMachinesListItemBinded === false) {
                    ko.applyBindings(self.selectedLinkMachinesListItem, document.getElementById('machineContent'));
                    self.selectedLinkMachinesListItemBinded = true;
                }
            };

            linkToMachineViewModel.filterVM.initialize($('#machineContent'));
            linkToMachineViewModel.filterVM.applyBindings(document.getElementById('obsevable_m'));

            ko.applyBindings(linkToMachineViewModel, document.getElementById('appendMachine'));
          
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onDeleteLinkClick = function (data, event) {
            var onClick = function () {
                self.deleteItem(self.selectedItem());
                if (self.deleteItemBinded == false) {
                    ko.applyBindings(self.deleteItem, document.getElementById('delete'));
                    self.deleteItemBinded = true;
                }
                resetValidator('delete');
            };
            var link = $(event.target), url = link.attr('href');
            self.showDialog(event.target.id, link, url, onClick);
        };
    
    self.onAppendLinkClickEnabled = ko.observable(true);
    self.onDeleteLinkClickEnabled = ko.observable(true);

    return self;
};