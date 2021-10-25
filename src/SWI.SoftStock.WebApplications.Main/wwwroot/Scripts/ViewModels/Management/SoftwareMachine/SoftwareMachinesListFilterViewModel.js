function SoftwareMachinesListFilterViewModel() {
    var self = this;
    self._haslicense = 1;
    self.isHasLicense = ko.observable(false);
    self.isNotHasLicense = ko.observable(false);
    self.haslicense = function (mt) {
        if (mt & 1) {
            self.isHasLicense(true);
        } else {
            self.isHasLicense(false);
        }
        if (mt & 2) {
            self.isNotHasLicense(true);
        } else {
            self.isNotHasLicense(false);
        }
    };

    self.isHasLicense.subscribe(function (newValue) {
        if (newValue) {
            self._haslicense = self._haslicense | 1;
        } else {
            self._haslicense = self._haslicense & ~1;
        }
    });
    
    self.isNotHasLicense.subscribe(function (newValue) {
        if (newValue) {
            self._haslicense = self._haslicense | 2;
        } else {
            self._haslicense = self._haslicense & ~2;
        }
    });
    
    self.onApplyFilter = function() {
    };
    
    self.onApplyClick = function (data, event) {
        self.onApplyFilter();
    };
    
    self.params = function () {
        return 'filterType=' + self._haslicense;
    };

    self.setCustomProperties = function (externalParams) {
        if (externalParams && externalParams.filterType) {
            self._haslicense = externalParams.filterType;
            self.haslicense(self._haslicense);
        }
    }
    
    return self;
};