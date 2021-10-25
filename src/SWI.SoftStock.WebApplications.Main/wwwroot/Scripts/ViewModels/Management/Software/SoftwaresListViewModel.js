function SoftwaresListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);
        result.items.forEach(function (element) {
            var item = new SoftwareViewModel();
            item.menu(self.menu);
            item.structureUnitId(self.structureUnitId);
            item.includeSubItems(self.includeSubItems);
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
        return `${self.baseApiAddress}${MANAGEMENT_SOFTWARES_ENDPOINT}?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };

    self.getReportUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_SOFTWARES_ENDPOINT}/report?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.paging.urlParams()}&${self.urlSortParams()}${self.tableFilter.params()}`;
    };
    
    self.tableFilter = new SoftwaresListFilterViewModel();
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

        var changedHref = setGetParameter(window.location.href, "filterName", self.tableFilter.name() ===null? "": self.tableFilter.name());
        changedHref = setGetParameter(changedHref, "filterPublisherName", self.tableFilter.publisherName() === null ? "" :self.tableFilter.publisherName());
        changedHref = setGetParameter(changedHref, "filterVersion", self.tableFilter.version() === null ? "" :self.tableFilter.version());
        window.history.pushState(self.tableFilter.name(), 'software', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.structureUnitId = externalParams.structureUnitId;
        self.includeSubItems = externalParams.includeSubItems;
        self.tableFilter.setCustomProperties(externalParams);
    }

    return self;
};

