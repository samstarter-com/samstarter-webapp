function AccountViewModel() {
    var self = new BaseViewModel();
    self.startPage = "";
    self.dummyObservable = ko.observable();
    self.isLogged = ko.computed(function () {
        self.dummyObservable(); //retrieve and ignore the value
        var token = localStorage.getItem(self.tokenKey);
        return token !== null;
    });
       
    self.userName = ko.observable();
    self.loginPassword = ko.observable();
    self.errors = ko.observableArray([]);
    
    self.login = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var loginData = {
            username: self.userName(),
            password: self.loginPassword(),
            rememberMe: false
        };

        axios.post(`${self.baseApiAddress}${ACCOUNT_LOGIN_ENDPOINT}`,
            loginData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(function(response) {
            self.userName(response.data.userName);

            localStorage.setItem(self.tokenKey, response.data.accessToken);
            localStorage.setItem(self.refreshTokenKey, response.data.refreshToken);
            localStorage.setItem(self.userKey, response.data.userName);
            self.dummyObservable.notifySubscribers(); //fake a change notification
            if (self.isLogged()) {
                window.location.href = `/${PERSONAL_MACHINES_PAGE}`;
            }
        }).catch(function(error) {
            self.showError(error);
        });
    };

    self.refresh = function(data, event) {
        var loginData = {
            accessToken: localStorage.getItem(self.tokenKey),
            refreshToken: localStorage.getItem(self.refreshTokenKey)
        };

        axios.post(`${self.baseApiAddress}${ACCOUNT_REFRESH_ENDPOINT}`,
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(function(response) {
                localStorage.setItem(self.tokenKey, response.data.accessToken);
                localStorage.setItem(self.refreshTokenKey, response.data.refreshToken);
                location.reload();
            })
            .catch(function (error)  {
                localStorage.removeItem(self.tokenKey);
                localStorage.removeItem(self.userKey);
                localStorage.removeItem(self.refreshTokenKey);
                self.dummyObservable.notifySubscribers(); //fake a change notification
                location.reload();
            });
    };

    self.checkIsLogged = function(data, event) {
        var token = localStorage.getItem(self.tokenKey);
        var isLogged = token != null;
        if (isLogged) {
            window.location.href = `/${PERSONAL_MACHINES_PAGE}`;
        }
        else {
            axios.get(self.startPage).then(function (response) {
                $('.main-content').html(response.data);
            }).catch(function (error) {
                alert(error.response.status);
            });
        }
    };

    return self;
}