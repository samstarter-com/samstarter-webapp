LicenseMachinePageViewModel = function (defaultDataVmCnstr, contentElement, filterElement)  {

    var self = new PageViewModel(contentElement);
	self.itemMenu = new LicenseMachinesMenuViewModel();
	self.menu     = new LicenseAllMachinesMenuViewModel();
   
    self.setDataVM = function (dVm) {
        self.dataVM = dVm;
        self.dataVM.onChanging = self.changeUrl;
        if (self.dataVM._name == "list") {
        	self.dataVM.menu = self.menu;
        	self.dataVM.menu.selectedItem(self.dataVM);
        	self.dataVM.itemMenu = self.itemMenu;
        	if (self.dataVM.itemMenu != null) {
                self.dataVM.onItemSelected = function (newValue) {
                	self.dataVM.itemMenu.selectedItem(newValue);
                };
            }
        }
        if (self.dataVM._name == "details") {
            self.menu.selectedItem(self.dataVM);
            self.dataVM.menu(self.menu);
        }
    };

    self.applyBindings = function () {
    	if (self.dataVM._name == "list") {
    		self.dataVM.applySortStyle();
    		ko.applyBindings(self.dataVM, document.getElementById("list"));
    		ko.applyBindings(self.menu, document.getElementById("licenseAllMachineMenu"));
    	}
    	if (self.dataVM._name == "details") {
    		ko.applyBindings(self.dataVM, document.getElementById("details"));
    	}
    };
    
    return self;
};