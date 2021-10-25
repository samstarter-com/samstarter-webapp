function StructureUnitRoleListViewModelReadOnly() {
    var self = new ListViewModel();
    
    self.aftermapfromJS = function (result) {
        result.usersRoles.forEach(function (element) {
            var item = new StructureUnitRoleViewModelReadOnly();
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

    self.mapfromJS = function (result) {
        self.items.removeAll();
        self.selectedItem(null);
        self.aftermapfromJS(result);
    }

    return self;
};
