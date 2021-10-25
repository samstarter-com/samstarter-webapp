PersonalLicenseRequestPageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {
    var self = new PageViewModel(contentElement);
    self.menu = new PersonalLicenseRequestMenuViewModel();
    return self;
};