MachinesWithObservableMenuViewModel = function() {

    var self = new MenuViewModel();
    self.useAjaxFormHandler = true;
    self.observableId = ko.observable();

    self.removeItemBinded = false;
    self.removeItem = ko.observable(null);

    self.onRemoveObservableLinkClick = function(data, event) {
        var onClick = function () {
            self.removeItem(self.selectedItem());
            if (self.removeItemBinded === false) {
                ko.applyBindings(self.removeItem, document.getElementById('remove'));
                self.removeItemBinded = true;
            }
            resetValidator('remove');
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    return self;
};