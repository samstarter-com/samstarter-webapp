function PersonalMachinesListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.aftermapfromJS = function (result) {
        result.items.forEach(function (element) {
            var item = new PersonalMachineViewModel();
            item.mapfromJS(element);
            self.items.push(item);
        });
    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${PERSONAL_MACHINES_ENDPOINT}?${self.paging.urlParams()}&${self.urlSortParams()}`;
    };

    return self;
};

