UsagePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement, viewType, range) {
    var self = new PageViewModel(contentElement);

    var urlParams = new URLSearchParams(window.location.search);
    
    var dateformatQuery = 'DD-MM-YYYY';
    var dateformat = 'MM.DD.YYYY';
    self.filterVM = new UsageFilterViewModel();
    self.filterVM.filterTemplateUrl = `/${MANAGEMENT_LICENSES_PAGE}/UsageFilter`;
    if ((urlParams.get("from") || "") !== "") {
        self.filterVM.from(moment(urlParams.get("from")).format(dateformat));
    }
    if ((urlParams.get("to") || "") !== "") {
        self.filterVM.to(moment(urlParams.get("to")).format(dateformat));
    }
    self.filterVM.range(range);
    self.filterVM.viewType(viewType);
    self.filterVM.onApplyFilter = function (data) {

        var changedHref = window.location.href;
        var fromparam;
        var toparam;
        if (self.filterVM.range() != null && (typeof self.filterVM.range() != 'undefined')) {
            changedHref = setGetParameter(changedHref, "range", self.filterVM.range());
        }
        if (self.filterVM.viewType() != null && (typeof self.filterVM.viewType() != 'undefined')) {
            changedHref = setGetParameter(changedHref, "viewType", self.filterVM.viewType());
        }
        if (self.filterVM.from() != null && (typeof self.filterVM.from() != 'undefined')) {
            fromparam = moment(self.filterVM.from()).format(dateformatQuery);
            changedHref = setGetParameter(changedHref, "from", fromparam);
        }
        if (self.filterVM.to() != null && (typeof self.filterVM.to() != 'undefined')) {
            toparam = moment(self.filterVM.to()).format(dateformatQuery);
            changedHref = setGetParameter(changedHref, "to", toparam);
        }
        window.history.pushState(self.filterVM.range(), 'license usage', changedHref);
        if (self.filterVM.viewType() !== self.filterVM.previousViewType) {
            var licenseId = urlParams.get('id') || '';
            var listTemplate = `/${MANAGEMENT_LICENSES_PAGE}/UsageTable`;
            var chartTemplate = `/${MANAGEMENT_LICENSES_PAGE}/UsageChart`;
            var datavm = self.filterVM.viewType() !== "1" ? new UsageListViewModel(licenseId, listTemplate) : new UsageViewModel(licenseId, chartTemplate, self.menu);
            self.setDataVM(datavm);
            datavm.init({
                licenseId: urlParams.get('id') || '',
                includeSubItems: urlParams.get('includeSubItems') || 0,
                range: data.range(),
                from: fromparam,
                to: toparam,
                viewType: data.viewType()
            });
            self.reload();
        } else {
            if (self.dataVM._name === "list") {
                self.dataVM.paging.clear();
            }
            self.dataVM.setCustomProperties(
                {
                    licenseId: self.dataVM.licenseId(),
                    includeSubItems: self.dataVM.includeSubItems,
                    range: data.range(),
                    from: fromparam,
                    to: toparam,
                    viewType: data.viewType()
                });
            self.dataVM.loadFromServer()
                .then(resp => self.dataVM.mapData(resp))
                .catch(function (error) {
                    console.log(error);
                });
        }

    };

    self.filterVM.initialize(filterElement);
    
    return self;
};