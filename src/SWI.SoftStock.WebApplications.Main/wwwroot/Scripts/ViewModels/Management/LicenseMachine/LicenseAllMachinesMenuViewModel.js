LicenseAllMachinesMenuViewModel = function () {
    var self = new MenuViewModel();

    self.licenseSoftwareOnAllMachineItemBinded = false;
    self.licenseSoftwareOnAllMachineItem = ko.observable(null);

    self.unLicenseSoftwareOnAllMachineItemBinded = false;
    self.unLicenseSoftwareOnAllMachineItem = ko.observable(null);

    self.onLicenseSoftwareOnAllMachineLinkClick = function (data, event) {
    	var onClick = function () {
    		self.licenseSoftwareOnAllMachineItem(self.selectedItem());
    		if (self.licenseSoftwareOnAllMachineItemBinded == false) {
    			ko.applyBindings(self.licenseSoftwareOnAllMachineItem, document.getElementById('licenseSoftwareOnAllMachine'));
    			self.licenseSoftwareOnAllMachineItemBinded = true;
    		}
    		resetValidator('licenseSoftwareOnAllMachine');
    	};
    	var link = $(event.target), url = link.attr('href');
    	self.showDialog(event.target.id, link, url, onClick);
    };

    self.onLicenseSoftwareOnAllMachineUnLinkClick = function (data, event) {
    	var onClick = function () {
    		self.unLicenseSoftwareOnAllMachineItem(self.selectedItem());
    		if (self.unLicenseSoftwareOnAllMachineItemBinded == false) {
    			ko.applyBindings(self.unLicenseSoftwareOnAllMachineItem, document.getElementById('unLicenseSoftwareOnAllMachine'));
    			self.unLicenseSoftwareOnAllMachineItemBinded = true;
    		}
    		resetValidator('unlicenseSoftwareOnAllMachine');
    	};
    	var link = $(event.target), url = link.attr('href');
    	self.showDialog(event.target.id, link, url, onClick);
    };

    return self;
};