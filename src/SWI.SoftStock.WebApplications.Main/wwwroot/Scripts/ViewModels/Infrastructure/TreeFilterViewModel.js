function TreeFilterViewModel() {
    var self = new BaseViewModel();
    self.filterDataUrl = null;
    self.contentElement = null;

    self.data = ko.observableArray();
    self.includeSubItems = ko.observable(false);

    self.onApplyFilter = function () {
    };
    self.id = null;

    self.onIncludeSubItemsClick = function () {
        self.onTreeChange();
        return true;
    };
   
    self.onTreeChange = function (data) {
        if (typeof data != "undefined")
            self.id = data.node.id;
        self.onApplyFilter({ id: self.id, includeSubItems: self.includeSubItems() ? 1 : 0 });
    };
    self.applyBindings = function (filterElement) {
        ko.applyBindings(self, filterElement);
    };
    self.initialize = function (contentElement) {
        self.contentElement = contentElement;
        if (self.id != null) {
            self.filterDataUrl = setGetParameter(self.filterDataUrl, "selectedstructureunitid", self.id);
        } else {
            self.filterDataUrl = removeParam("selectedstructureunitid", self.filterDataUrl);
        }
        axios.get(self.filterDataUrl).then(function (response) {
            self.data(response.data);
        });
    };
    return self;
}
;