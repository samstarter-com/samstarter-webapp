function GrantRoleViewModel() {

    var self = new DetailViewModel();

    self.availableRoles = ko.observableArray();
    self.selectedRoleId = ko.observable();
    self.structureUnits = ko.observableArray();
    self.selectedStructureUnitId = null;
    var selectedUsersList = new UsersListViewModel();
    self.selectedLinkUsersListItem = ko.observable(selectedUsersList);

    self.grantRoleStrucutreUnit = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var data1 = {
            userId: self.selectedLinkUsersListItem().selectedItem().id(),
            roleId: self.selectedRoleId()
        };

        axios.post(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}/${self.selectedStructureUnitId}/role`,
            data1)
            .then(function (response) {
                if (!response.data.success) {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
                var account = new AccountViewModel();
                account.refresh();
            });
    };

    self.loadFromServer = function () {
        axios.get(`${self.baseApiAddress}${PERSONAL_EVERYROLES_ENDPOINT}`)
            .then(res => {
                self.availableRoles(res.data);
            });
        axios.get(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}?id=${self.selectedStructureUnitId}`)
            .then(res => {
                self.structureUnits(res.data);
            });
    };

    self.onTreeChange = function (data) {
        selectedUsersList.paging.clear();
        selectedUsersList.structureUnitId = data.node.id;
        selectedUsersList.loadFromServer().then(resp => {
                selectedUsersList.mapfromJS(resp.data);
                self.selectedLinkUsersListItem(selectedUsersList);
            }
        );
    };

    return self;
};

