MachinePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {

    var self = new PageViewModel(contentElement);
    var urlParams = new URLSearchParams(window.location.search);
    self.menu = new MachineMenuViewModel();
    self.defaultDataVm = null;
    self.filterVM = new TreeFilterViewModel();
    self.filterVM.filterDataUrl = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`;
    self.filterVM.id = urlParams.get("cid") || "";
    self.filterVM.includeSubItems((urlParams.get("includeSubItems") || "0") === "1");

    self.filterVM.onApplyFilter = function(data) {
        self.changeUrl({ cid: data.id, includeSubItems: data.includeSubItems ? 1 : 0 }, ["id"]);
        if (self.defaultDataVm === null) {
            self.defaultDataVm = defaultDataVmCnstr();
        };
        if (self.dataVM === null || self.dataVM.TemplateUrl !== self.defaultDataVm.TemplateUrl) {
            var datavm = defaultDataVmCnstr();

            datavm.setCustomProperties(
                {
                    structureUnitId: data.id,
                    includeSubItems: data.includeSubItems
                });

            self.setDataVM(datavm);
            self.reload();
        } else {
            self.dataVM.paging.clear();
            self.dataVM.setCustomProperties(
                {
                    structureUnitId: data.id,
                    includeSubItems: data.includeSubItems
                });
            self.dataVM.loadFromServer()
                .then(resp => self.dataVM.mapData(resp))
                .catch(function(error) {
                    console.log(error);
                });
        }
    };
  
    self.afterReload = function() {
        $('#isEnabled').trigger('change'); 
    };

    self.filterVM.initialize(contentElement);

    self.filterVM.applyBindings(filterElement);

    self.params = function () {
        return `cid=${self.filterVM.id}&includeSubItems=${self.filterVM.includeSubItems() ? 1 : 0}`;
    };
  
    return self;
};