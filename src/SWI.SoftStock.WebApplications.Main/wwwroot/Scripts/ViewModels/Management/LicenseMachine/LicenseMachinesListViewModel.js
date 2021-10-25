function LicenseMachinesListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.licenseId = ko.observable();
    self.licenseName = ko.observable();
    self.licenseUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
        }
    );
    self.aftermapfromJS = function (result) {
        self.licenseId(result.licenseId);
        self.licenseName(result.licenseName);
        self.menu.licenseName = result.licenseName;
        self.itemMenu.licenseName = result.licenseName;
        
        self.tableFilter.status(result.status);
        result.items.forEach(function (element) {
            var item = new MachineViewModel();
            item.licenseId(result.licenseId);
            item.menu(self.itemMenu);
            item.beforeClick = function () {
                self.items().forEach(function (u) {
                    u.isSelected(false);
                });
            };
            item.afterClick = function (u) {
                self.selectedItem(u);
            };
            item.mapfromJS(element);
            item.machineName = ko.observable();
            item.licenseName = ko.observable();
            item.machineName(item.name());
            item.licenseName(result.licenseName);
            self.items.push(item);
        });
    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseId()}/machines?${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params()}`;
    };

    self.setCustomProperties = function (externalParams) {
        self.licenseId(externalParams.licenseId);
        self.tableFilter.setCustomProperties(externalParams);
    }
    
    self.tableFilter = new LicenseMachinesListFilterViewModel();
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
        window.history.pushState(self.tableFilter._status, 'license machines', changedHref);
    };


    self.licenseMachines = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.licenseId()}/licensemachines`,
            {}).then(function (response) {
            if (response.data.success) {
                location.reload();
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.unLicenseMachines = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.licenseId()}/unlicensemachines`,
            {}).then(function (response) {
            if (response.data.success) {
                location.reload();
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }
        }).catch(function (error) {
            self.showError(error);
        });
    };


    return self;
};

