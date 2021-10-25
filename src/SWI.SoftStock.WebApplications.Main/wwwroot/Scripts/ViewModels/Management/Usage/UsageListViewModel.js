function UsageListViewModel(id, url) {
    var self = new ListViewModel();
    self.TemplateUrl = url;

    self.licenseName = ko.observable();
    self.licenseId = ko.observable(id);
    self.licenseUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
        }
    );

    self.params = function () {
        return self.paging.urlParams() + '&' + self.urlSortParams();
    };

    self.selectedMachineId = ko.computed(function () {
        if (self.isItemSelected()) {
            return self.selectedItem().machineId();
        } else {
            return null;
        }
    });

    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);
        result.items.forEach(function (element) {
            var item = new UsageMachineViewModel();
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

    self.setCustomProperties = function (externalParams) {
        self.licenseName(externalParams.licenseName);
        self.licenseId(externalParams.licenseId);
        self.includeSubItems = externalParams.includeSubItems;
        self.range = externalParams.range;
        self.from = externalParams.from;
        self.to = externalParams.to;
        self.viewType = externalParams.viewType;
    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseId()}/usage/?includeSubItems=${self.includeSubItems}&viewType=${self.viewType}&range=${self.range}&from=${self.from}&to=${self.to}&${self.paging.urlParams()}&${self.urlSortParams()}`;
    };

    return self;
};
