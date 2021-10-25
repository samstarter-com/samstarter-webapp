function BaseViewModel() {
    var self = this;
    self.baseApiAddress = BASE_API_ADDRESS;

    self.tokenKey = 'accessToken';
    self.refreshTokenKey = 'refreshTokenKey';
    self.userKey = 'user';
    self.errors = ko.observableArray([]);
    self.showError = function (error) {
        var response = error.response;
        if (response) {
            if (response.data && response.data.errors) {
                self.errors.push(response.data.errors);
                return;
            }
            if (response.data && response.data.error_description) {
                self.errors.push(response.data.error_description);
                return;
            }
            if (response.data.modelState) {
                var modelState = response.data.modelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.errors.length) {
                            for (let i = 0; i < msgArr.errors.length; ++i) self.errors.push(msgArr.errors[i].errorMessage);
                        }
                    }
                }
                return;
            }
            if (response.data) self.errors.push(response.data);
        }
    }

    return self;
}
;