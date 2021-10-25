function MainMenuViewModel() {
    var self = new BaseViewModel();

    self.isAdmin = ko.observable(false);
    self.isManager = ko.observable(false);
    self.isUser = ko.observable(false);

    self.getRoles = function () {
        var account = new AccountViewModel();
        if (account.isLogged()) {
            axios.get(`${self.baseApiAddress}${PERSONAL_ROLES_ENDPOINT}`)
                .then(function(response) {
                    self.isAdmin(response.data.indexOf("Admin") > -1);
                    self.isManager(response.data.indexOf("Manager") > -1);
                    self.isUser(response.data.indexOf("User") > -1);
                }).catch(function(error) {
                    if (error.response && error.response.status === 401) {
                        self.isAdmin(false);
                        self.isManager(false);
                        self.isUser(false);
                    }
                });
        } else {
            self.isAdmin(false);
            self.isManager(false);
            self.isUser(false);
        }
    };

    return self;
}