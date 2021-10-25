function PersonalLicenseRequestsListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;
    
    self.aftermapfromJS = function (result) {
        self.tableFilter.status(result.status);
        $('#statusFilter_1').trigger('change');
        result.items.forEach(function (element) {
            var item = new PersonalLicenseRequestViewModel(element.licenseRequestId);
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
        return `${self.baseApiAddress}${PERSONAL_LICENSEREQUEST_ENDPOINT}?${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };
   

    self.tableFilter = new PersonalLicenseRequestsListFilterViewModel();
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
        self.tableFilter.setCustomProperties(externalParams);
    }
    
    return self;
};
