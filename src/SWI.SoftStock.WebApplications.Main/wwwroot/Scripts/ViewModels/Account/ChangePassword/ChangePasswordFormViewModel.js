function ChangePasswordFormViewModel() {
    var self = new BaseViewModel();

    self.oldPassword = ko.observable();
    self.newPassword = ko.observable();
    self.confirmPassword = ko.observable();


    self.changepassword = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;

        var data1 = {
            OldPassword: self.oldPassword(),
            NewPassword: self.newPassword(),
            ConfirmPassword: self.confirmPassword()
        };

        axios.post(`${self.baseApiAddress}${ACCOUNT_CHANGEPASSWORD_ENDPOINT}`, data1).
            then(function (response) {
                window.location.href = '/';
            }).catch(function (error) {
                self.showError(error)
            });

    };
    return self;
}