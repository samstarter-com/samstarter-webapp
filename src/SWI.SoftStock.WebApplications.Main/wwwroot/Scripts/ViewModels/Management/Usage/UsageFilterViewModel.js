function UsageFilterViewModel() {
    var self = new BaseViewModel();
   
    self.from = ko.observable();
    self.to = ko.observable();
    self.range = ko.observable();
    self.viewType = ko.observable();
    self.viewType.subscribe(function (previousValue) {
        self.previousViewType = previousValue;
    }, this, "beforeChange");

    self.previousViewType = null;
    
    var dateformatQuery = 'DD-MM-YYYY';
    self.mapping = {
        'from': {
            create: function (options) {
                var parsedDate = new Date(parseInt(options.data.substr(6)));
                var jsDate = new Date(parsedDate);
                return jsDate;
            },
            update: function (options) {
                var parsedDate = new Date(parseInt(options.data.substr(6)));
                var jsDate = new Date(parsedDate);
                return jsDate;
            }
        },
        'to': {
            create: function (options) {
                var parsedDate = new Date(parseInt(options.data.substr(6)));
                var jsDate = new Date(parsedDate);
                return jsDate;
            },
            update: function (options) {
                var parsedDate = new Date(parseInt(options.data.substr(6)));
                var jsDate = new Date(parsedDate);
                return jsDate;
            }
        }
    };
    self.onInit = function () {
        self.previousViewType = self.viewType();
    };

    self.onApplyFilter = function () {
    };
    
    self.onApplyClick = function (data) {
        self.onApplyFilter(data);
    };
    
    self.params = function () {
        var result = '';
        if (self.from() != null && (typeof self.from() != 'undefined')) {
            var fromparam = moment(self.from()).format(dateformatQuery);
            result = setGetParameter(result, 'from', fromparam);
        }
        if (self.to() != null && (typeof self.to() != 'undefined')) {
            var toparam = moment(self.to()).format(dateformatQuery);
            result = setGetParameter(result, 'to', toparam);
        }
        if (self.range() != null && (typeof self.range() != 'undefined')) {
            result = setGetParameter(result, 'range', self.range());
        }
        if (self.viewType() != null && (typeof self.viewType() != 'undefined')) {
            result = setGetParameter(result, 'viewType', self.viewType());
        }
        return (result.length && result[0] == '?') ? result.substring(1) : result;
    };
    
    self.initialize = function (filterElement) {
        axios.get(self.filterTemplateUrl).then(function (response) {
            filterElement.innerHTML = response.data;
            self.applyBindings(filterElement);
            self.onInit(filterElement);
        });
    };

    self.applyBindings = function (filterElement) {
        ko.applyBindings(self, filterElement);
    };

    return self;
}
;