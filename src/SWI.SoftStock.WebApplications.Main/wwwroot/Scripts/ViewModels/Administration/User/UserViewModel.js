function UserViewModel(url, menu) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.structureUnitId = ko.observable();
    self.userId = ko.observable();
    self.roles = ko.observableArray();
    self.userRoles = ko.observableArray();
    self.structureUnits = ko.observableArray();

  
    self.userName = ko.observable();
    self.firstName = ko.observable();
    self.lastName = ko.observable();
    self.email = ko.observable();
    self.password = ko.observable();
    self.confirmPassword = ko.observable();

    self.filterStructureUnitId = ko.observable();
    self.isLocked = ko.observable(false);
    self.id = ko.computed(
        function () {
            return self.userId();
        }
    );

    self.structureUnitUrl = ko.computed(
        function () {
            return `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${self.structureUnitId()}`;
        }
    );

    self.url = ko.computed(
        function () {
            return `/${ADMINISTRATION_USER_PAGE}?id=${self.userId()}`;
        }
    );

    self.rolesFiltered = ko.computed(function () {
        return ko.utils.arrayFilter(self.roles(), function (r) {
            return r.structureUnitId === self.filterStructureUnitId();
        });
    });

    self.rolesChanged = ko.computed(function () {
        return ko.utils.arrayFilter(self.roles(), function (r) {
            return r.changed() === true;
        });
    });

    self.setUserRole = function (roles) {
        self.roles.removeAll();
        roles.forEach(function (role) {
            var r = new UserRoleViewModel();
            ko.mapping.fromJS(role, {}, r);
            r.mapped = true;
            self.roles.push(r);
        });
    };

    self.isRolesExistForStructureUnit = function (structureUnitId) {
        var result = false;
        for (var i = 0, l = self.roles().length; i < l; i++) {
            if (self.roles()[i].structureUnitId === structureUnitId) {
                result = true;
                break;
            }
        }
        return result;
    };

    var dateformat = 'DD.MM.YYYY, HH:mm';
    self.mapping = {
        'createDate': {
            create: function (options) {
                return moment(options.data).format(dateformat);
            }
        },
        'lastActivityDate': {
            create: function (options) {
                return moment(options.data).format(dateformat);
            }
        }
    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${USER_ENDPOINT}/${self.userId()}`;
    };

    self.loadStructureUnits = function (onSuccess) {
        return axios.get(`${self.baseApiAddress}${STRUCTUREUNIT_ENDPOINT}?id=${self.structureUnitId()}`);
    };

    self.changeUserRole = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;


        var rolesArr = $.map(self.rolesChanged(), function (role) {
            return {
                structureUnitId: role.structureUnitId,
                roleId: role.roleId(),
                isInRole: role.isInRole()
            };
        });

        axios.post(`${self.baseApiAddress}${USER_ENDPOINT}/${self.userId()}/roles`, rolesArr)
            .then(function (response) {
                if (!response.data.success) {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
                var account = new AccountViewModel();
                account.refresh();
            });
    };

    self.updateUser = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var user = {
            userName: self.userName(),
            firstName: self.firstName(),
            lastName: self.lastName(),
            email: self.email(),
            structureUnitId: self.structureUnitId(),
            userId: self.userId()
        };

        axios.post(`${self.baseApiAddress}${USER_ENDPOINT}/${self.userId()}`,
            user
        ).then(function (response) {
            if (response.data.success) {
                window.location.href = `/${ADMINISTRATION_USER_PAGE}?id=${self.userId()}`;
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }
        }).catch(function (error) {
            self.showError(error);
        });
    };


    self.addUser = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;

        var user = {
            userName: self.userName(),
            firstName: self.firstName(),
            lastName: self.lastName(),
            email: self.email(),
            structureUnitId: self.structureUnitId(),
            Password: self.password(),
            ConfirmPassword: self.confirmPassword(),
            BaseAddress: baseUrl
        };


        axios.put(`${self.baseApiAddress}${USER_ENDPOINT}`, user).then(function (response) {
            if (response.data.success) {
                window.location.href = `/${ADMINISTRATION_USER_PAGE}?id=${response.data.id}`;
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }

            self.showError(error);
        });

    };

    self.structureUnitChanging = function (data) {
        self.structureUnitId(data.node.id);
    };

    self.onTreeChange = function (data) {
        self.filterStructureUnitId(data.node.id);
        if (!self.isRolesExistForStructureUnit(data.node.id)) {
            axios.get(`${self.baseApiAddress}${USER_ENDPOINT}/${self.userId()}/roles?structureUnitId=${data.node.id}`)
                .then(res => {
                    self.setUserRole(res.data);
                });
        }
    };

    self.deleteUser = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.delete(`${self.baseApiAddress}${USER_ENDPOINT}/${self.userId()}`).then(function (response) {
            window.location.href = `/${ADMINISTRATION_USER_PAGE}?cid=${self.structureUnitId()}`;
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.unlockUser = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${USER_ENDPOINT}/${self.userId()}/unlock`).then(function (response) {
            window.location.href = `/${ADMINISTRATION_USER_PAGE}?cid=${self.structureUnitId()}`;
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.init = function (externalParams) {
        self.userId(externalParams.id);
    };

    self.mapData = function (response) {
        if (response !== null) {
            ko.mapping.fromJS(response.data.details, self.mapping, self);
            self.userRolesViewModel = new UserRoleListViewModelReadOnly();
            self.userRolesViewModel.mapfromJS(response.data.roles);
            self.userRoles(self.userRolesViewModel.userRoles());
        }
    };

    return self;
};