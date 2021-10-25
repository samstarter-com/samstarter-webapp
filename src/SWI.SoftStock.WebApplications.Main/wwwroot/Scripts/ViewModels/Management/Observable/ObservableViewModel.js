function ObservableViewModel(id, url, menu) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.observableId = ko.observable(id);
    self.processName = ko.observable();
    self.id = ko.computed(
        function () {
            return self.observableId();
        }
    );
    self.softwareId = ko.observable();
    self.url = ko.computed(
        function () {
            return `/${MANAGEMENT_OBSERVABLES_PAGE}?id=${self.observableId()}`;
        }
    );

    self.softwareUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_SOFTWARES_PAGE}?id=${self.softwareId()}`;
        }
    );
    self.structureUnitId = ko.observable();
    self.appendedUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_OBSERVABLES_PAGE}/Machine?id=${self.observableId()}`;
        }
    );

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };

    self.loadFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}/${self.observableId()}`);
    };


    self.softwareAutocompleteSource = function (request, response) {
        var element = $(this);
        axios.get(`${self.baseApiAddress}${MANAGEMENT_SOFTWARES_ENDPOINT}/autocomplete?cid=${self.structureUnitId()}&request=${request.term}`).then(
                function (resp) {
                    element.removeClass('ui-autocomplete-loading'); // hide loading image

                    response($.map(resp.data.softwares, function (item) {
                        return {
                            label: item.name,
                            value: item
                        };
                    }));
                }
            );
    };

    self.softwareAutocompleteSelect = function (event, ui) {
        self.softwareId(ui.item.value.softwareId);
        $(this).val(ui.item.label);
        ui.item.value = ui.item.label;
    };

    self.softwareAutocompleteChange = function (event, ui) {
        if (ui.item == null && self.softwareId() != null) {
            self.softwareId(null);
        }
    };

    self.append = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}/${self.observableId()}/machine/${self.machineId()}`,
            {}).then(function (response) {
                if (response.data.success) {
                    window.location.href = `/${MANAGEMENT_OBSERVABLES_PAGE}?id=${self.observableId()}`;
                }
                else {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
            }).catch(function (error) {
                self.showError(error);
            });
    };

    self.addObservable = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;
        var observable = {
            ProcessName: self.processName(),
            SoftwareId: self.softwareId()
        };
        axios.put(`${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}`, observable).then(function (response) {
            if (response.data.success) {
                window.location.href = `/${MANAGEMENT_OBSERVABLES_PAGE}?id=${response.data.id}`;
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.deleteObservable = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.delete(`${self.baseApiAddress}${MANAGEMENT_OBSERVABLES_ENDPOINT}/${self.observableId()}`)
            .then(function (response) {
                location.reload();
            }).catch(function (error) {
                self.showError(error);
            });
    };

    return self;
};
