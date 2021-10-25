PersonalSoftwarePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {

    var self = new PageViewModel(contentElement);
    var urlParams = new URLSearchParams(window.location.search);
    self.defaultDataVm = null;

    self.filterVM = new PlainFilterViewModel();
    self.filterVM.selectedValue(urlParams.get("machineid") || "");
    self.filterVM.filterDataUrl = self.baseApiAddress + PERSONAL_MACHINES_ENDPOINT;
    self.filterVM.onApplyFilter = function (id) {
        self.changeUrl({ machineid: id });
        if (self.defaultDataVm === null) {
            self.defaultDataVm = defaultDataVmCnstr();
        };
        if (self.dataVM === null || self.dataVM.TemplateUrl !== self.defaultDataVm.TemplateUrl) {
            var datavm = defaultDataVmCnstr();

            dataVM.structureUnitId = data.id;
            dataVM.includeSubItems = data.includeSubItems;

            self.setDataVM(datavm);
            self.reload();
        } else {
            self.dataVM.paging.clear();

            self.dataVM.machineId = id;

            self.dataVM.loadFromServer()
                .then(resp => self.dataVM.mapData(resp))
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    self.filterVM.initialize(contentElement);
    self.filterVM.applyBindings(filterElement);
    return self;
};