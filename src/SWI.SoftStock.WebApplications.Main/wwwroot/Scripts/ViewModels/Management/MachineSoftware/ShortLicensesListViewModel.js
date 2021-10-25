function ShortLicensesListViewModel() {
    var self = new ListViewModel();
   
    self.softwareId = ko.observable();
    self.machineId = ko.observable();

    self.aftermapfromJS = function (result) {
        result.items.forEach(function (element) {
            var item = new ShortLicenseViewModel();
            item.menu(self.menu);
            item.beforeClick = function () {
                self.items().forEach(function (u) {
                    u.isSelected(false);
                });
            };
            item.afterClick = function (u) {
                self.selectedItem(u);
            };
            item.mapfromJS(element);
            self.items.push(item);
        });
    };

    self.getUrl = function () {
        return '/Management/License/AvailableLicense?softwareid=' + self.softwareId() + '&' + self.paging.urlParams();
    };
    return self;
    
}
;
