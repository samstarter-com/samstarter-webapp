function MachinesWithObservableListViewModel(url, menu) {
    var self = new ListViewModel();

    self.menu = menu;
    self.TemplateUrl = url;

    self.aftermapfromJS = function (result) {
        self.menu.observableId(result.observableId);
        result.items.forEach(function (element) {
            var item = new MachineViewModel();
            item.observableId = result.observableId;
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
        self.observableId = externalParams.observableId;
    }

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}/${self.observableId}/Machines?${self.paging.urlParams()}&${self.urlSortParams()}`;
     
    };

    return self;
};

