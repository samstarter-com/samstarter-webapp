function LicenseRequestDocumentViewModel() {
    var self = new BaseDocumentViewModel();
   
    self.downloadUrl = ko.computed(
        function () {
            return `${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}/${self.id()}/download`;
        }
    );

    this.mapping = {
        'ignore': ["content"]
    };

    return self;
};