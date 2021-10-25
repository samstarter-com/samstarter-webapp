function LicensesListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;
  

    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);
        result.items.forEach(function (element) {
            var item = new LicenseViewModel();
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
        return `${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.paging.urlParams()}&${self.urlSortParams()}`;
    };

    self.getReportUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/report?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.urlSortParams()}`;
    };

    self.setCustomProperties = function (externalParams) {
        self.structureUnitId = externalParams.structureUnitId;
        self.includeSubItems = externalParams.includeSubItems;
    }

    return self;
};
