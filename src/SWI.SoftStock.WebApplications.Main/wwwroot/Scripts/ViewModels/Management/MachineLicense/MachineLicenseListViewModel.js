function MachineLicenseListViewModel(url, menu) {
	var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

	self.machineId = ko.observable();
	self.machineName = ko.observable();
	self.machineUrl = ko.observable();

    self.aftermapfromJS = function (result) {
		self.machineId(result.machineId);
		self.machineName(result.machineName);
        self.machineUrl(`/${MANAGEMENT_MACHINES_PAGE}?id=${self.machineId()}`);

		self.tableFilter.status(result.status);

		result.items.forEach(function (element) {
			var item = new LicenseViewModel();
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

			item.machineId = ko.observable();
			item.machineName = ko.observable();
			item.licenseName = ko.observable();

			item.machineId(self.machineId());
			item.machineName(result.machineName);
			item.licenseName(item.name());
			self.items.push(item);
		});
	};

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.machineId()}/licenses?${self.paging.urlParams()}&${self.urlSortParams()}&${self.tableFilter.params('')}`;
    };

	self.tableFilter = new MachineLicenseListFilterViewModel();
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

    self.setCustomProperties = function (externalParams) {
        self.machineId(externalParams.id);
        self.tableFilter.setCustomProperties(externalParams);
    }
    
    self.licenseLicenses = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.machineId()}/licenseLicenses`,
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

    self.unLicenseLicenses = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.machineId()}/unLicenseLicenses`,
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
