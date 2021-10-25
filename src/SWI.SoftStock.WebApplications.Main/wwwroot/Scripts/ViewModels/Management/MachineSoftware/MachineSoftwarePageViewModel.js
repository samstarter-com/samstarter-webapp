MachineSoftwarePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement, machineId) {
    var self = new PageViewModel(contentElement);
    self.menu = new MachineSoftwareMenuViewModel(machineId);
    return self;
};