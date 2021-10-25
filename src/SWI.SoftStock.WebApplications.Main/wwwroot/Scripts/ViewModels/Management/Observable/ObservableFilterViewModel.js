function ObservableFilterViewModel() {
    var self = new BaseViewModel();
    self.softwareFilterId = ko.observable();
    self.processName = ko.observable();
    self.softwareName = ko.observable();
    self.onApplyFilter = function () {
    };

    self.softwareFilterAutocompleteSource = function (request, response) {
        var element = $(this);
        self.softwareName(request.term);

        axios.get(`${self.baseApiAddress}${MANAGEMENT_SOFTWARES_ENDPOINT}/autocomplete?request=${request.term}`).then(function (resp) {
            element.removeClass('ui-autocomplete-loading'); // hide loading image

            response($.map(resp.data.softwares, function (item) {
                return {
                    label: item.name,
                    value: item
                };
            }));

        }).catch(function (error) {
            element.removeClass('ui-autocomplete-loading');
            console.log(error.response.status);
        });
    };

    self.softwareFilterAutocompleteSelect = function (event, ui) {
        self.softwareFilterId(ui.item.value.softwareId);
        self.softwareName(ui.item.label);
        $(this).val(ui.item.label);
        ui.item.value = ui.item.label;
    };
    self.softwareFilterAutocompleteChange = function (event, ui) {
        if (ui.item == null && self.softwareFilterId() != null) {
            self.softwareFilterId(null);
        }
    };

    self.onApplyClick = function (data, event) {
        self.onApplyFilter(self.processName(), self.softwareFilterId());
    };
    
    return self;

};