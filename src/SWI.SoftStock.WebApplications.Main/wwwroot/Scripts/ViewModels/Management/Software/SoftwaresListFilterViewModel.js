function SoftwaresListFilterViewModel() {
    var self = this;
  
    self.name = ko.observable(null);
    self.publisherName = ko.observable(null);
    self.version = ko.observable(null);
    self.onApplyFilter = function() {
    };
    
    self.onApplyClick = function (data, event) {
        self.onApplyFilter();
    };

    self.params = function () {
        var result = "";
        if (self.name() != null && (typeof self.name() != "undefined")) {
            result = `filterName=${self.name()}`;
    	}

        if (self.publisherName() != null && (typeof self.publisherName() != "undefined")) {
            result = result + `&filterPublisherName=${self.publisherName()}`;
        }

        if (self.version() != null && (typeof self.version() != "undefined")) {
            result = result + `&filterVersion=${self.version()}`;
        }

        return (result.length && result[0] === "&") ? result.substring(1) : result;
    };

    self.setCustomProperties = function (externalParams) {
        if (externalParams && externalParams.filterName) {
            self.name(externalParams.filterName);
        }
        if (externalParams && externalParams.filterPublisherName) {
            self.publisherName(externalParams.filterPublisherName);
        }
        if (externalParams && externalParams.filterVersion) {
            self.version(externalParams.filterVersion);
        }
    }

	return self;
};