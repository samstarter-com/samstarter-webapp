function UsageViewModel(id, url, menu) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.licenseName = ko.observable();
    self.licenseId = ko.observable(id);
    self.licenseUrl = ko.computed(
       function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
       }
   );
    self.actionName = 'GetUsage';
    self.params = function() {
        return '';
    };

    self.plot1 = null;

    self.clear = function () {
        self.plot1.redraw();
    };
    self.init = function (externalParams) {

        self.setCustomProperties(externalParams);
        
       
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data, self.mapping, self);

        self.plot1 = $.jqplot('usageChart', [self.total(), self.usage()], {
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                rendererOptions: { fillToZero: true }
            },
            series: [
                { label: self.totalLegendText() },
                { label: self.usageLegendText() }
            ],
            legend: {
                show: true,
                placement: 'outsideGrid'
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: self.ticks()
                },
                yaxis: {
                    max: self.maxTick(),
                    tickOptions: { formatString: '%d' }
                }
            }
        });
    };

    self.setCustomProperties = function (externalParams) {
        self.licenseName(externalParams.licenseName);
        self.licenseId(externalParams.licenseId);
        self.includeSubItems = externalParams.includeSubItems;
        self.range = externalParams.range;
        self.from = externalParams.from;
        self.to = externalParams.to;
        self.viewType = externalParams.viewType;
    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseId()}/usage/?includeSubItems=${self.includeSubItems}&range=${self.range}&from=${self.from}&to=${self.to}&viewType=${self.viewType}`;
    };

    return self;
}
;
