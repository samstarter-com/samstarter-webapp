function PersonalLicenseRequestDocumentViewModel() {
    var self = new BaseDocumentViewModel();
    self.isNew = ko.observable(true);
    self.uploadId = ko.observable();
    self.isAddded = false;
    self.name = ko.observable();
    self.downloadUrl = ko.computed(
        function () {
            return `${self.baseApiAddress}${PERSONAL_LICENSEREQUEST_ENDPOINT}/${self.id()}/download`;
        }
    );

    self.onRemoveDocumentClick = function () {
       
    };
    
    this.mapping = {
        'ignore': ["content"]
    };
    return self;
};