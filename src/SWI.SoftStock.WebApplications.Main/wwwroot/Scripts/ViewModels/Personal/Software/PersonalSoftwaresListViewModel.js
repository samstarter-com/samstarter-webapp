function PersonalSoftwaresListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.machineId = null;

    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);

        result.items.forEach(function (element) {
            var item = new SoftwareViewModel();
            item.beforeClick = function () {
                self.items().forEach(function (s) {
                    s.isSelected(false);
                });
            };
            item.afterClick = function (s) {
                self.selectedItem(s);
            };

            item.mapfromJS(element);
            self.items.push(item);
        });

    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${PERSONAL_SOFTWARES_ENDPOINT}?machineId=${self.machineId}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };

    self.tableFilter = new PersonalSoftwaresListFilterViewModel();
    self.tableFilter.onApplyFilter = function () {
        self.paging.clear();
        self.loadFromServer()
            .then(resp => self.mapData(resp))
            .catch(function (error) {
                console.log(error);
            });
        var changedHref = setGetParameter(window.location.href, "filterType", self.tableFilter._haslicense);
        window.history.pushState(self.tableFilter._haslicense, 'personal software', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.machineId = externalParams.machineId;
        self.tableFilter.setCustomProperties(externalParams);
    }

    return self;
};

