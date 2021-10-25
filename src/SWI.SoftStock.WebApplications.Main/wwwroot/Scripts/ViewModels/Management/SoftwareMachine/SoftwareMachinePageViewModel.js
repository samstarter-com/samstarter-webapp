SoftwareMachinePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement, softwareId) {
    var self = new PageViewModel(contentElement);
    self.menu = new SoftwareMachineMenuViewModel(softwareId);
   return self;
};