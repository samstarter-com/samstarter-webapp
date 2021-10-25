function DetailViewModel() {
    var self = new BaseViewModel();
    self._name = "details";
    self.menu = ko.observable();
    self.isSelected = ko.observable();
    
    self.beforeClick = function () {
    };
    self.afterClick = function () {
    };

    self.onDetailRowClick = function () {
        self.beforeClick();
        self.isSelected(true);
        self.afterClick(self);
        return true;
    };

    self.mapping = {};

    self.mapfromJS = function (result) {
        ko.mapping.fromJS(result, self.mapping, self);
    };

    self.init = function () { };

    self.afterApplyBindings = function () { };

    self.getUrl = function () { };

    self.loadFromServer = async function() {
        self.errors.removeAll();
        var url = self.getUrl();
        return await axios.get(url);
    };

    return self;
};