function StructureUnitViewModel(id, url, menu) {

    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.uniqueId = ko.observable(id);
    self.parentUniqueId = null;
    self.name = ko.observable();
    self.shortName = ko.observable();
    self.structureUnits = ko.observableArray();

    self.id = ko.computed(
        function () {
            return self.uniqueId();
        });

    self.usersRoles = new StructureUnitRoleListViewModelReadOnly();
    self.usersRoles.menu = new UserRoleMenuViewModel();
    self.usersRoles.onItemSelected = function (newValue) {
        self.usersRoles.menu.selectedItem(newValue);
    };

    self.mapData = function (response) {
        if (response !== null) {
            ko.mapping.fromJS(response.data.details, {}, self);
            self.usersRoles.mapfromJS(response.data);
        }
    };
    
    self.getUrl = function () {
        return `${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}/${self.uniqueId()}`;
    };

    self.addStrucutreUnit = function(data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var structureUnit = {
            ParentUniqueId: self.parentUniqueId,
            Name: self.name(),
            ShortName: self.shortName()
        };

        axios.put(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`, structureUnit)
            .then(function(response) {
                window.location.href = `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${response.data.id}`;
            }).catch(function(error) {
                self.showError(error);
            });
    };

    self.updateStructureUnit = function(data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var structureUnit = {
            ParentUniqueId: self.parentUniqueId,
            UniqueId: self.uniqueId(),
            Name: self.name(),
            ShortName: self.shortName()
        };


        axios.post(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}`, structureUnit)
            .then(function(response) {
                window.location.href = `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${response.data.id}`;
            }).catch(function(error) {
                self.showError(error);
            });
    };

    self.deleteStructureUnit = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.delete(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}/${self.uniqueId()}`)
            .then(function(response) {
                window.location.href = `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${response.data.id}`;
            }).catch(function(error) {
                self.showError(error);
            });

    };

    return self;
};

