function MachineSoftwaresListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.machineId = ko.observable();
    self.machineName = ko.observable();
    self.machineUrl = ko.observable();
    self.softwareId = ko.observable();
    
    self.aftermapfromJS = function (result) {

        self.machineId(result.machineId);
        self.menu.machineId(result.machineId);
        self.menu.userId = result.userId;
        
        self.machineName(result.machineName);
        self.machineUrl(`/${MANAGEMENT_MACHINES_PAGE}?id=${self.machineId()}`);
        self.tableFilter.haslicense(result.filterType);
        self.tableFilter.name(result.filterName);
        self.tableFilter.publisherName(result.filterPublisherName);
        self.tableFilter.version(result.filterVersion);
        self.tableFilter.licenseName(result.filterLicenseName);
        self.softwareId(result.softwareId);
        
        result.items.forEach(function (element) {
            var item = new SoftwareViewModel();
            item.menu(self.menu);
            item.structureUnitId(result.structureUnitId);
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
        return `${self.baseApiAddress}${MANAGEMENT_MACHINESSOFTWARES_ENDPOINT}?machineId=${self.machineId()}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params('')}`;
    };
    
    self.getReportUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_MACHINESSOFTWARES_ENDPOINT}/report?machineId=${self.machineId()}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params('')}`;
    };
    
    self.tableFilter = new MachineSoftwaresListFilterViewModel();
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

        var changedHref = self.tableFilter.params(window.location.href);
        window.history.pushState(self.tableFilter._haslicense, 'machine software', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.machineId(externalParams.id);
        self.tableFilter.setCustomProperties(externalParams);
    }
    
    return self;
};
