MachineAllLicenseMenuViewModel = function () {
	var self = new MenuViewModel();

	self.licenseSoftwareByAllLicensesItemBinded = false;
	self.licenseSoftwareByAllLicensesItem = ko.observable(null);

	self.unLicenseSoftwareOnMachineFromAllLicensesItemBinded = false;
	self.unLicenseSoftwareOnMachineFromAllLicensesItem = ko.observable(null);

	self.onLicenseSoftwareOnMachineByAllLicensesLinkClick = function (data, event) {
		var onClick = function () {
			self.licenseSoftwareByAllLicensesItem(self.selectedItem());
			if (self.licenseSoftwareByAllLicensesItemBinded == false) {
				ko.applyBindings(self.licenseSoftwareByAllLicensesItem, document.getElementById('licenseSoftwareOnMachineByAllLicenses'));
				self.licenseSoftwareByAllLicensesItemBinded = true;
			}
			resetValidator('licenseSoftwareOnAllMachine');
		};
		var link = $(event.target), url = link.attr('href');
		self.showDialog(event.target.id, link, url, onClick);
	};

	self.onLicenseSoftwareOnMachineByAllLicensesUnLinkClick = function (data, event) {
		var onClick = function () {
			self.unLicenseSoftwareOnMachineFromAllLicensesItem(self.selectedItem());
			if (self.unLicenseSoftwareOnMachineFromAllLicensesItemBinded == false) {
				ko.applyBindings(self.unLicenseSoftwareOnMachineFromAllLicensesItem, document.getElementById('unLicenseSoftwareOnMachineFromAllLicenses'));
				self.unLicenseSoftwareOnMachineFromAllLicensesItemBinded = true;
			}
			resetValidator('unlicenseSoftwareOnAllMachine');
		};
		var link = $(event.target), url = link.attr('href');
		self.showDialog(event.target.id, link, url, onClick);
	};

	return self;
};