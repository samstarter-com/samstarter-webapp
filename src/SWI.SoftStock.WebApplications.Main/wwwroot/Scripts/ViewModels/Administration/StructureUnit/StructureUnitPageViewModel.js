StructureUnitPageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {

    var self = new PageViewModel(contentElement);
    var urlParams = new URLSearchParams(window.location.search);
    self.filterVM = new TreeFilterViewModel();
    self.menu = new StructureUnitMenuViewModel();   
    self.defaultDataVm = null;
    self.filterVM.id = urlParams.get("cid") || "";
    self.filterVM.filterDataUrl = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`;

    self.filterVM.onApplyFilter = function (data) {
        self.changeUrl({ cid: data.id }, ["id"]);
        if (self.defaultDataVm === null) {
            self.defaultDataVm = defaultDataVmCnstr();
        };
        if (self.dataVM === null || self.dataVM.TemplateUrl !== self.defaultDataVm.TemplateUrl) {
            var datavm = defaultDataVmCnstr();

            self.setDataVM(datavm);
            self.menu.selectedItem(self.dataVM);
            //self.dataVM.externalParams = self.params();
            self.reload();
        } else {
            self.dataVM.uniqueId(self.filterVM.id);
            self.dataVM.loadFromServer()
                .then(resp => {
                    self.dataVM.mapData(resp); 
                    self.menu.selectedItem(self.dataVM);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    self.filterVM.initialize(contentElement);
    self.filterVM.applyBindings(filterElement);

    self.afterApplyBindings = function () {
        ko.applyBindings(self.menu, document.getElementById("suMenu"));
    };
    
    return self;
};