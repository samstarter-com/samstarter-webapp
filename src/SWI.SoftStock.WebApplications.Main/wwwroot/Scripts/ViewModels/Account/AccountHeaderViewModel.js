function AccountHeaderViewModel() {
    var self = new MenuViewModel();   

    self.dummyObservable = ko.observable();

    self.loginItemBinded = false;
    self.loginItem = ko.observable(null);
       
    self.isLogged = ko.computed(function () {
        self.dummyObservable(); //retrieve and ignore the value
        var token = localStorage.getItem(self.tokenKey);
        return token != null;      
    });

    self.userName = ko.computed(function () {
        return localStorage.getItem(self.userKey);
    });

    self.onLoginLinkClick = function (data, event) {
        var onClick = function () {
            var account = new AccountViewModel();
            self.loginItem(account);
            account.isLogged.subscribe(function (newValue) {
                if (newValue)
                    self.closeDialog(event.target.id);
                self.dummyObservable.notifySubscribers(); //fake a change notification
            });

            if (self.loginItemBinded == false) {
                ko.applyBindings(self.loginItem, document.getElementById('loginForm'));
                self.loginItemBinded = true;
            }
            resetValidator('loginForm');

        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onLogoffLinkClick = function (data, event) {
        localStorage.removeItem(self.tokenKey);
        localStorage.removeItem(self.userKey);
        localStorage.removeItem(self.refreshTokenKey);
        self.dummyObservable.notifySubscribers(); //fake a change notification
        window.location.href = '/';
    };

    return self;
};