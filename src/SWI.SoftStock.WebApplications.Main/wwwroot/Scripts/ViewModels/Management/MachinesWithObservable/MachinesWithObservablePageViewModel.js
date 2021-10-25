MachinesWithObservablePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {

    var self = new PageViewModel(contentElement);
    
    self.menu = new MachinesWithObservableMenuViewModel();
    return self;
};