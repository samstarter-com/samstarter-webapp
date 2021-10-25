function LicenseRequestsListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;
  
    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);
        self.tableFilter.status(result.status);
        result.items.forEach(function (element) {
            var item = new LicenseRequestViewModel();
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

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };

    self.tableFilter = new LicenseRequestsListFilterViewModel();
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

        var changedHref = setGetParameter(window.location.href, "status", self.tableFilter._status);
        window.history.pushState(self.tableFilter._status, 'license requests', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.structureUnitId = externalParams.structureUnitId;
        self.includeSubItems = externalParams.includeSubItems;
        self.tableFilter.setCustomProperties(externalParams);
    }

    return self;
};
