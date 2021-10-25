function MachinesListFilterViewModel() {
    var self = this;
    self._machineType = 1;
    self.isEnabled = ko.observable(false);
    self.isDisabled = ko.observable(false);
    self.machineType = function (mt) {
        if (mt & 1) {
            self.isEnabled(true);
        } else {
            self.isEnabled(false);
            self.isEnabled.valueHasMutated();
        }
        if (mt & 2) {
            self.isDisabled(true);
        } else {
            self.isDisabled(false);
            self.isDisabled.valueHasMutated();
        }
    };

    self.isEnabled.subscribe(function (newValue) {
        if (newValue) {
            self._machineType = self._machineType | 1;
        } else {
            self._machineType = self._machineType & ~1;
        }
    });
    
    self.isDisabled.subscribe(function (newValue) {
        if (newValue) {
            self._machineType = self._machineType | 2;
        } else {
            self._machineType = self._machineType & ~2;
        }
    });
    
    self.onApplyFilter = function() {
    };
    
    self.onApplyClick = function (data, event) {
        self.onApplyFilter();
    };
    
    self.params = function () {
        return `machineType=${self._machineType}`;
    };

    self.setCustomProperties = function (externalParams) {
        if (externalParams && externalParams.machineType) {
            self._machineType = externalParams.machineType;
            self.machineType(self._machineType);
        }
    }

    return self;
};