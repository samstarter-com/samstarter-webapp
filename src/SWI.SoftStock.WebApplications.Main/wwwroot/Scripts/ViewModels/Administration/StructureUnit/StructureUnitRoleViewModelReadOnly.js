function StructureUnitRoleViewModelReadOnly() {
    var self = new DetailViewModel();

    self.userId = ko.observable();
    self.roleId = ko.observable();
    self.structureUnitId = ko.observable();

    self.id = function () {
        return `${self.roleId()}_${self.userId()}`;
    };


    self.url = function () {
        return `/${ADMINISTRATION_USER_PAGE}?id=${self.userId()}`;
    };


    self.structureUnitUrl = function () {
        return `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?cid=${self.structureUnitId()}`;
    };


    self.removeRole = function (data, event) {

        self.errors.removeAll();

        var url = `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}/${self.structureUnitId()}/role`;
        axios.delete(url,
            {
                data: {
                    userId: self.userId(),
                    roleId: self.roleId()
                }
            })
            .then(function (response) {
                if (!response.data.success) {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
                var account = new AccountViewModel();
                account.refresh();
            });
    };
    return self;
};