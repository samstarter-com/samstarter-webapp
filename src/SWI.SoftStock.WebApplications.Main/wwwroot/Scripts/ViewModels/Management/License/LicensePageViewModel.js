LicensePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {

    var self = new PageViewModel(contentElement);
    var urlParams = new URLSearchParams(window.location.search);
    self.menu = new LicenseMenuViewModel();
    self.defaultDataVm = null;
    self.filterVM = new TreeFilterViewModel();
    self.filterVM.filterDataUrl = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`;
    self.filterVM.id = urlParams.get("cid") || "";
    self.filterVM.includeSubItems((urlParams.get("includeSubItems") || "0") === "1");

    self.filterVM.onApplyFilter = function (data) {
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
           //self.dataVM.externalParams = self.params();
            self.reload();
        } else {
            self.dataVM.paging.clear();
            self.dataVM.setCustomProperties(
                {
                    structureUnitId: data.id,
                    includeSubItems: data.includeSubItems
                });
            self.dataVM.loadFromServer(self.params())
                .then(resp => self.dataVM.mapData(resp))
                .catch(function(error) {
                    console.log(error);
                });
        }

        if (self.dataVM._name === "list") {
            self.menu.structureUnitId(data.id);
        }
    };

    self.filterVM.initialize(contentElement);
    self.filterVM.applyBindings(filterElement);
    
    self.afterApplyBindings = function() {
        ko.applyBindings(self.menu, document.getElementById("licenseMenu"));
    };

    self.params = function () {
        return `cid=${self.filterVM.id}&includeSubItems=${self.filterVM.includeSubItems() ? 1 : 0}`;
    };

    return self;
};