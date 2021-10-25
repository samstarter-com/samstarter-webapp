function ContactViewModel() {
    var self = new BaseViewModel();
    self.title = ko.observable();
    self.email = ko.observable();
    self.comment = ko.observable();

    
    self.sendFeedback = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var feedbackData = {
            title: self.title(),
            email: self.email(),
            comment: self.comment()
        };

        axios.post(`${self.baseApiAddress}${CONTACT_FEEDBACK_ENDPOINT}`,
           feedbackData).then(function (data) {
               window.location.href = `/${HOME_THANKYOUPAGE_PAGE}`;
     }).catch(function (error) {
            self.showError(error);
        });

    };   

    return self;
}