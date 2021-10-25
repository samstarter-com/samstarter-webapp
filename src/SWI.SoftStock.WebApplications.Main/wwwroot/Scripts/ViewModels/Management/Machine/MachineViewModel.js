function MachineViewModel(id, url, menu) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;
  
    self.machineId = ko.observable(id);
    self.structureUnits = ko.observableArray();
    self.id = ko.computed(
        function () {
            return self.machineId();
        }
    );
    self.userId = ko.observable();
    self.structureUnitId = ko.observable();
    self.enabled = ko.observable(false);
    self.url = ko.computed(
        function () {
            return `/${MANAGEMENT_MACHINES_PAGE}?id=${self.machineId()}`;
        }
    );

    self.licenseId = ko.observable();
    self.licenseUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
        }
    );

    self.structureUnitUrl = ko.computed(
        function () {
            return `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${self.structureUnitId()}`;
        }
    );

    self.userUrl = ko.computed(
        function () {
            return `/${ADMINISTRATION_USER_PAGE}?id=${self.userId()}`;
        }
    );

    self.availableLicenseUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_MACHINE_LICENSES_PAGE}?machineId=${self.machineId()}`;
        }
    );

    var datetimeformat = 'DD.MM.YYYY, HH:mm';
    var dateformat = 'DD.MM.YYYY';
    self.mapping = {
        'createdOn': {
            create: function (options) {
                var date = moment(options.data);
                return date.subtract(date.zone(), 'minutes').format(datetimeformat);
            }
        },
        'modifiedOn': {
            create: function (options) {
                var date = moment(options.data);
                return date.subtract(date.zone(), 'minutes').format(datetimeformat);
            }
        },
        'lastActivity': {
            create: function (options) {
                var date = moment(options.data);
                return date.subtract(date.zone(), 'minutes').format(datetimeformat);
            }
        },
        'observableProcesses': {
            create: function (options) {
                var ovm = new ObservableViewModel();
                ko.mapping.fromJS(options.data, {}, ovm);
                return ovm;
            }
        },
        'installDate': {
            create: function (options) {
                if (options.data != null) {
                    var jsDate = moment(options.data, "YYYYMMDD");
                    var result = moment(jsDate).format(dateformat);
                    if (result == "Invalid date") {
                        jsDate = moment(options.data, "MM/DD/YYYY");
                        result = moment(jsDate).format(dateformat);
                    }
                    return result;
                }
                return null;
            }
        },
        'discoveryDate': {
            create: function (options) {
                var date = moment(options.data);
                return date.subtract(date.zone(), 'minutes').format(dateformat);
            }
        }
    };

    self.loadFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.machineId()}`);
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };

    self.structureUnitChanging = function (data) {
        self.structureUnitId(data.node.id);
    };

    self.linkStructureUnit = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.machineId()}/structureunit/${self.structureUnitId()}`,
            {}).then(function (response) {
            if (response.data.success) {
                window.location.href = `/${MANAGEMENT_MACHINES_PAGE}?id=${self.machineId()}`;
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.deleteMachine = function(data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.delete(`${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.machineId()}`).then(function (response) {
            window.location.href = `/${MANAGEMENT_MACHINES_PAGE}?cid=${self.structureUnitId()}`;
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.disableMachine = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.machineId()}/disable`, 
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


    self.licenseMachine = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.licenseId()}/licensemachine/${self.machineId()}`,
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

    self.unLicenseMachine = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.licenseId()}/unlicensemachine/${self.machineId()}`,
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

    self.enableMachine = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_MACHINES_ENDPOINT}/${self.machineId()}/enable`, {}).then(function (response) {
            location.reload();
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.removeObservable = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}/${self.observableId}/remove/${self.machineId()}`, {}).then(function (response) {
            location.reload();
        }).catch(function (error) {
            self.showError(error);
        });
    };

    
    return self;
};
