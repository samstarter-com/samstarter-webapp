function PersonalLicenseRequestViewModel(id, url, menu) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.licenseRequestId = ko.observable(id);
    self.permission = ko.observable(0);
    self.id = ko.computed(
        function () {
            return self.licenseRequestId();
        }
    );
    self.documents = ko.observableArray();
    self.url = ko.computed(
        function () {
            return '/personal/licenserequests?id=' + self.licenseRequestId();
        }
    );
    self.onReceived = function () {
        axios.post(`${self.baseApiAddress}${PERSONAL_LICENSEREQUEST_ENDPOINT}/${self.licenseRequestId()}/received`, null).then(function (response) {
        });
    };

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
                var document = new PersonalLicenseRequestDocumentViewModel();
                document.isAddded = true;
                document.uploadId(response.data);
                document.name(file.name);
                document.status = "added";
                document.onRemoveDocumentClick = function () {
                    self.documents.remove(this);
                };
                self.documents.push(document);
            }).catch(function (error) {
                self.showError(error);
            });
    };

    self.answer = function (data, event) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var answerData = {
            answerText: self.answerText(),
            licenseRequestId: self.licenseRequestId(),
            documents: ko.utils.arrayMap(self.documents(), function (s) {
                return { uploadId: s.uploadId(), isAddded: s.isAddded, Id: s.id() };
            })
        };

        axios.post(`${self.baseApiAddress}${PERSONAL_LICENSEREQUEST_ENDPOINT}/${self.licenseRequestId()}/answer`,
            answerData).then(function (response) {
                window.location.href = `/${PERSONAL_LICENSEREQUESTS_PAGE}?id=${self.licenseRequestId()}`;
            }).catch(function (error) {
                self.showError(error);
            });
    };

    var dateformat = 'DD.MM.YYYY, HH:mm';
    self.mapping = {
        'createdOn': {
            create: function (options) {
                return moment(options.data).format(dateformat);
            }
        },
        'modifiedOn': {
            create: function (options) {
                return moment(options.data).format(dateformat);
            }
        },
        'documents': {
            create: function (options) {
                var dvm = new PersonalLicenseRequestDocumentViewModel();
                dvm.onRemoveDocumentClick = function () {
                    self.documents.remove(this);
                };
                ko.mapping.fromJS(options.data, dvm.mapping, dvm);
                return dvm;
            }
        }
    };

    self.getUrl = function () {
        return `${self.baseApiAddress}${PERSONAL_LICENSEREQUEST_ENDPOINT}/${self.licenseRequestId()}`;
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };

    return self;
}