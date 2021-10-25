function LicenseMachinesListFilterViewModel() {
    var self = this;
    
    self._status = 1;
    
    self.status_1 = ko.observable(false);
    self.status_2 = ko.observable(false);
    self.status_4 = ko.observable(false);


    self.status = function (s) {
            self.status_1(s & 1);
            self.status_2(s & 2);
            self.status_4(s & 4);
    };
    
    self.status_1.subscribe(function (newValue) {
        if (newValue) {
            self._status = self._status | 1;
        } else {
            self._status = self._status & ~1;
        }
    });
    
    self.status_2.subscribe(function (newValue) {
        if (newValue) {
            self._status = self._status | 2;
        } else {
            self._status = self._status & ~2;
        }
    });
    
    self.status_4.subscribe(function (newValue) {
        if (newValue) {
            self._status = self._status | 4;
        } else {
            self._status = self._status & ~4;
        }
    });
    
    self.onApplyFilter = function() {
    };
    
    self.onApplyClick = function (data, event) {
        self.onApplyFilter();
    };
    
    self.params = function () {
        return 'status=' + self._status;
    };

    self.setCustomProperties = function (externalParams) {
        if (externalParams && externalParams.status) {
            self._status = externalParams.status;
            self.status(self._status);
        }
    }
    
    return self;
};