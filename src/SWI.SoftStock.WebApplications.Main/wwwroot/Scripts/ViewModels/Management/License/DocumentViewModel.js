function DocumentViewModel() {
    var self = new BaseDocumentViewModel();
    self.isNew = ko.observable(true);
    self.uploadId = ko.observable();
    self.isAddded = false;
    self.hcLocation = ko.observable();
    self.name = ko.observable();
    self.downloadUrl = ko.computed(
      function () {
          return `${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.id()}/download`;
      }
    );

    self.uploadDocument = function (file) {
      var fd = new FormData();
      fd.append("userfile", file); // Append the file

      axios.post(`${self.baseApiAddress}${DOCUMENT_UPLOAD_ENDPOINT}`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
        self.isAddded = true;
        self.uploadId(response.data);
        self.name(file.name);
        self.status = "added";
        //self.index = self.getHighestDocumentIndex() + 1;
        //self.onRemoveDocumentClick = function () {
        //  self.documents.remove(this);
        //};
        //self.documents.push(document);
      }).catch(function (error) {
        self.showError(error);
      });
    };

    self.onRemoveDocumentClick = function () {
    };

    this.mapping = {
        'ignore': ["content"]
    };

    return self;
};