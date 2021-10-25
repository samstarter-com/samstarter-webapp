function PlainFilterViewModel() {
    var self = new BaseViewModel();
   
    self.filterDataUrl = null;
    self.contentElement = null;

    self.data = ko.observableArray();
    
    self.onApplyFilter = function (id) {
    };
    self.selectedValue = ko.observable();

    self.selectedValue.subscribe(function (value) {
        self.onApplyFilter(value);
    });
    
    self.applyBindings = function (filterElement) {
        ko.applyBindings(self, filterElement);
    };

    self.initialize = function (contentElement) {
        self.contentElement = contentElement;
        axios.get(self.filterDataUrl).then(function (response) {
            self.data(response.data.items);
        });
    };

    return self;
};