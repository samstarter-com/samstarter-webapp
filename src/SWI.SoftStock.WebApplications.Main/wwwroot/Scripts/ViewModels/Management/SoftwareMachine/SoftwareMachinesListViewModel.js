function SoftwareMachinesListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.softwareId = ko.observable();
    self.softwareName = ko.observable();
    self.softwareUrl = ko.observable();
    
    self.aftermapfromJS = function (result) {
        self.softwareId(result.softwareId);
        self.softwareName(result.softwareName);
        self.softwareUrl(`/${MANAGEMENT_SOFTWARES_PAGE}?id=${self.softwareId()}`);
        self.tableFilter.haslicense(result.filterType);
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

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_SOFTWARESMACHINES_ENDPOINT}?softwareId=${self.softwareId()}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };

    self.getReportUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_SOFTWARESMACHINES_ENDPOINT}/report?softwareId=${self.softwareId()}&${self.urlSortParams()}${self.tableFilter.params()}`;
    };
    
    self.tableFilter = new SoftwareMachinesListFilterViewModel();
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
        var changedHref = setGetParameter(window.location.href, "filterType", self.tableFilter._haslicense);
        window.history.pushState(self.tableFilter._haslicense, 'software machine', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.softwareId(externalParams.id);
        self.tableFilter.setCustomProperties(externalParams);
    }


    return self;
};

