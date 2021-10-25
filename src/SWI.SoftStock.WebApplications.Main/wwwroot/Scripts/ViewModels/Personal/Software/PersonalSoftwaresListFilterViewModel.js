function PersonalSoftwaresListFilterViewModel() {
    var self = this;
    self._haslicense = 0;
    self.isHasLicense = ko.observable(false);
    self.hasExpiredLicense = ko.observable(false);
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
      if (mt & 4) {
        self.hasExpiredLicense(true);
      } else {
        self.hasExpiredLicense(false);
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

    self.hasExpiredLicense.subscribe(function (newValue) {
      if (newValue) {
        self._haslicense = self._haslicense | 4;
      } else {
        self._haslicense = self._haslicense & ~4;
      }
    });
    
    self.onApplyFilter = function() {
    };
    
    self.onApplyClick = function () {
        self.onApplyFilter();
    };
    
    self.params = function () {
        var result = setGetParameter('', 'filterType', self._haslicense);
        return (result.length && result[0] === '?') ? result.substring(1) : result;
    };

    self.setCustomProperties = function (externalParams) {
        if (externalParams && externalParams.filterType) {
            self._haslicense = externalParams.filterType;
            self.haslicense(self._haslicense);
        }
    }
    return self;
};