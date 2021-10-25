function ObservablesListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;
    
    self.aftermapfromJS = function (result) {
        result.items.forEach(function (element) {
            var item = new ObservableViewModel();
            item.structureUnitId(result.structureUnitId);
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
    
    self.filterProcessName = "";
    self.filterSoftwareId = null;
    
    self.getUrl = function () {
        var url = `${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}?${self.paging.urlParams()}&${self.urlSortParams()}`;
        if (self.filterProcessName != null && self.filterProcessName !=="") {
            url = `${url}&prname=${self.filterProcessName}`;
        }
        if (self.filterSoftwareId != null && self.filterSoftwareId !== "") {
            url = `${url}&fsid=${self.filterSoftwareId}`;
        }
        return url;
    };
    
    self.tableFilter = new ObservableFilterViewModel();
    self.tableFilter.onApplyFilter = function(prname, softwareId) {
        var changedHref = window.location.href;
        if (typeof prname === 'undefined' || prname == "") {
            changedHref = removeParam("prname", changedHref);
            self.filterProcessName = null;
        } else {
            changedHref = setGetParameter(changedHref, "prname", prname);
            self.filterProcessName = prname;
        }
        if (typeof softwareId === 'undefined' || softwareId == null) {
            changedHref = removeParam("fsid", changedHref);
            self.filterSoftwareId = null;
        } else {
            changedHref = setGetParameter(changedHref, "fsid", softwareId);
            self.filterSoftwareId = softwareId;
        }
        self.loadFromServer()
            .then(function (resp) {
                    self.mapData(resp);
                }
            ).catch(function (error) {
                console.log(error);
            });
        window.history.pushState(prname, 'observable', changedHref);
    };

    self.setCustomProperties = function (externalParams) {
        self.structureUnitId = externalParams.structureUnitId;
        self.includeSubItems = externalParams.includeSubItems;
    }

    return self;
}

;
