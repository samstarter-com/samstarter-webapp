LicenseMachinesMenuViewModel = function () {
    var self = new MenuViewModel();
    
    self.isItemSelected.subscribe(function (newValue) {
        self.onLicenseSoftwareOnMachineLinkClickEnabled(newValue);
    });
    
    self.selectedItem.subscribe(function (newValue) {
      
    });
    
    self.licenseSoftwareOnMachineItemBinded = false;
    self.licenseSoftwareOnMachineItem = ko.observable(null);
    
    self.unLicenseSoftwareOnMachineItemBinded = false;
    self.unLicenseSoftwareOnMachineItem = ko.observable(null);

    self.onLicenseSoftwareOnMachineLinkClick = function (data, event) {
        var onClick = function () {
            self.licenseSoftwareOnMachineItem(self.selectedItem());
            if (self.licenseSoftwareOnMachineItemBinded === false) {
                ko.applyBindings(self.licenseSoftwareOnMachineItem, document.getElementById('licenseSoftwareOnMachine'));
                self.licenseSoftwareOnMachineItemBinded = true;
            }
            resetValidator('licenseSoftwareOnMachine');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onLicenseSoftwareOnMachineUnLinkClick = function (data, event) {
    	var onClick = function () {
    		self.unLicenseSoftwareOnMachineItem(self.selectedItem());
    		if (self.unLicenseSoftwareOnMachineItemBinded === false) {
    			ko.applyBindings(self.unLicenseSoftwareOnMachineItem, document.getElementById('unLicenseSoftwareOnMachine'));
    			self.unLicenseSoftwareOnMachineItemBinded = true;
    		}
    		resetValidator('unLicenseSoftwareOnMachine');
    	};
    	var link = $(event.target), url = link.attr('href');
    	self.showDialog(event.target.id, link, url, onClick);
    };
    
    self.onLicenseSoftwareOnMachineLinkClickEnabled = ko.observable(false);
  

    return self;
};