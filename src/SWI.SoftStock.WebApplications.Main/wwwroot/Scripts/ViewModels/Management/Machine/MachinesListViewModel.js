function MachinesListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;
    self.includeSubItems = 0;
    self.selectedMachineId = ko.computed(function () {
        if (self.isItemSelected()) {
            return self.selectedItem().machineId();
        } else {
            return null;
        }
    });

    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);
        self.tableFilter.machineType(result.machineType);
        result.items.forEach(function (element) {
            var item = new MachineViewModel();
            item.menu(self.menu);
            item.beforeClick = function () {
                self.items().forEach(function (u) {
                    u.isSelected(false);
                });
            };
            item.afterClick = function (u) {
                self.selectedItem(u);
            };
            item.mapfromJS(element);
            self.items.push(item);
        });
    };

    self.getUrl = function() {
        return `${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };

    self.getReportUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/report?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };
    
    self.tableFilter = new MachinesListFilterViewModel();
    self.tableFilter.onApplyFilter = function () {
        self.paging.clear();
        self.onChanging(self.paging.urlParamsArray(), []);
     
        self.loadFromServer()
            .then(function (resp) {
                    self.mapData(resp);
                }
            ).catch(function (error) {
                console.log(error);
            });


        var changedHref = setGetParameter(window.location.href, "machineType", self.tableFilter._machineType);
        window.history.pushState(self.tableFilter._machineType, 'software on machine', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.structureUnitId = externalParams.structureUnitId;
        self.includeSubItems = externalParams.includeSubItems;
        self.tableFilter.setCustomProperties(externalParams);
    }

    return self;
};
