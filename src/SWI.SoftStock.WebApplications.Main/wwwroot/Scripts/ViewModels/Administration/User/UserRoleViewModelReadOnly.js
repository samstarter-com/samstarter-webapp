function UserRoleViewModelReadOnly() {
    var self = this;

    self.structureUnitId = ko.observable();

    self.url = ko.computed(
        function() {
            return `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${self.structureUnitId()}`;
        }
    );
    return self;
};

function UserRoleListViewModelReadOnly() {
    var self = this;
    self.userRoles = ko.observableArray();

    self.mapfromJS = function(result) {
        self.userRoles.removeAll();
        result.forEach(function(element) {
            var role = new UserRoleViewModelReadOnly();
            ko.mapping.fromJS(element, {}, role);
            self.userRoles.push(role);
        });
    };

    return self;
};