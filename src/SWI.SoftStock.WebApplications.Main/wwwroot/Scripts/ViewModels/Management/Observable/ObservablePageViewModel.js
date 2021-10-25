ObservablePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement) {

    var self = new PageViewModel(contentElement);
   
    self.menu = new ObservableMenuViewModel();

    self.afterApplyBindings = function () {
        ko.applyBindings(self.menu, document.getElementById("observableMenu"));
    };
    
    return self;
};