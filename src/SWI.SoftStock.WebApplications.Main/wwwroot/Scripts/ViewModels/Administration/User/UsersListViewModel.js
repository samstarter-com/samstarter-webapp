function UsersListViewModel(url, menu) {
    var self = new ListViewModel();
    self.menu = menu;
    self.TemplateUrl = url;

    self.structureUnitId = null;
    self.includeSubItems = false;

    self.aftermapfromJS = function (result) {
        self.setCustomProperties(result);
        result.items.forEach(function (element) {
            var item = new UserViewModel();
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
        return `${self.baseApiAddress}${USER_ENDPOINT}?cid=${self.structureUnitId}&includeSubItems=${self.includeSubItems}&${self.paging.urlParams()}&${self.urlSortParams()}`;
    };

    self.setCustomProperties = function (externalParams) {
        self.structureUnitId = externalParams.structureUnitId;
        self.includeSubItems = externalParams.includeSubItems;
    }

    return self;
};
