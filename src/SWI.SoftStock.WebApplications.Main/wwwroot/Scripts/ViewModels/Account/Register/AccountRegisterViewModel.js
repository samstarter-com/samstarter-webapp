function AccountRegisterViewModel() {
    var self = new BaseViewModel();     

    self.companyName = ko.observable();
    self.registerEmail = ko.observable();
    self.registerPassword = ko.observable();
    self.registerPassword2 = ko.observable();
    self.userName = ko.observable(); 

    self.register = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;

        var data1 = {
            CompanyName: self.companyName(),
            UserName: self.userName(),
            Email: self.registerEmail(),
            Password: self.registerPassword(),
            ConfirmPassword: self.registerPassword2(),
            BaseAddress: baseUrl
        };

        axios.post(`${self.baseApiAddress}${ACCOUNT_REGISTER_ENDPOINT}`,
        data1       
        ).then(function (response) {
            window.location.href = `/${ACCOUNT_FINISHREGISTER_PAGE}`;
        }).catch(function (error) {
            self.showError(error);
        });
    };

    self.verify = function (userId, code) {
        var data = {
            userId: userId,
            code: code
        };
        axios.post(`${self.baseApiAddress}${ACCOUNT_VERIFY_ENDPOINT}`,
       data
       ).then(function (response) {
           window.location.href = `/${ACCOUNT_FINISHVERIFICATION_PAGE}`;
       }).catch(function (error) {
            self.showError(error);
       });
    };

    return self;
}