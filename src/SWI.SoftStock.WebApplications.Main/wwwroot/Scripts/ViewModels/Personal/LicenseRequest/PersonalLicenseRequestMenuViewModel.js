PersonalLicenseRequestMenuViewModel = function() {
    var self = new MenuViewModel();

    self.useAjaxFormHandler = true;

    self.selectedItem.subscribe(function(newValue) {
        self.onAnswerLinkClickEnabled(newValue && ((Number(newValue.permission()) & 2) == 2));
    });

    self.answerItemBinded = false;
    self.answerItem = ko.observable(null);

    self.onAnswerLinkClick = function(data, event) {
        var onClick = function () {
            
            axios.get(`${self.baseApiAddress}${PERSONAL_LICENSEREQUEST_ENDPOINT}/${self.selectedItem().id()}`).then(function (response) {
             if (response.data.errors) {
                 console.log(response.data.errors);
             }
                 var licenseRequest = new PersonalLicenseRequestViewModel();
                 ko.mapping.fromJS(response.data.details, licenseRequest.mapping, licenseRequest);
                 self.answerItem(licenseRequest);
                 if (self.answerItemBinded == false) {
                     ko.applyBindings(self.answerItem, document.getElementById('licenseRequest'));
                     self.answerItemBinded = true;
                 }
                 resetValidator('licenseRequest');
                 licenseRequest.onReceived();
         });
        };
        var link = $(event.target), url = link.attr('href');
        self.showDialog(event.target.id, link, url, onClick);
    };

    self.onAnswerLinkClickEnabled = ko.observable(false);
    
    return self;
};