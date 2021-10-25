UserRoleMenuViewModel = function () {

    var self = new MenuViewModel();

    self.selectedItem.subscribe(function(newValue) {
        if (newValue == null) {
            self.onRemoveRoleClickEnabled(false);
        } else {
            self.onRemoveRoleClickEnabled(!newValue.isInherited());
        }
    });
    
    self.removeRoleItemBinded = false;
    self.removeRoleItem = ko.observable(null);
   
    self.onRemoveRoleClickEnabled = ko.observable(false);
    
    self.onRemoveRoleClick = function (data, event) {
        var onClick = function () {
            self.removeRoleItem(self.selectedItem());
            if (self.removeRoleItemBinded == false) {
                ko.applyBindings(self.removeRoleItem, document.getElementById('removeRole'));
                self.removeRoleItemBinded = true;
            }
            resetValidator('removeRoleItem');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };
    
    return self;
};