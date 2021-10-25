function LicenseRequestViewModel(id, url, menu) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;
    self.sending = ko.observable(false);
    self.licenseRequestId = ko.observable(id);
    self.machineId = ko.observable();
    self.softwareId = ko.observable();
    self.id = ko.computed(
        function () {
            return self.licenseRequestId();
        }
    );
    self.documents = ko.observableArray();
    self.permission = ko.observable(0);
    self.onReceived = function () {
        var url = `${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}/received/${self.licenseRequestId()}`;
        axios.post(url);
    };
    self.url = ko.computed(
        function() {
            return `/${MANAGEMENT_LICENSEREQUESTS_PAGE}?id=${self.licenseRequestId()}`;
        }
    );
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
                var dvm = new LicenseRequestDocumentViewModel();
                ko.mapping.fromJS(options.data, dvm.mapping, dvm);
                return dvm;
            }
        }
    };
  
    self.addLicenseRequest = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var licenserequest = {
            MachineId: self.machineId(),
            SoftwareId: self.softwareId(),
            Text: self.text(),
            Sending: $('input#Sending').val(), // todo change to self.sending 
            UserId: self.userId()
        };

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}`, licenserequest)
            .then(function (response) {
                window.location.href = `/${MANAGEMENT_LICENSEREQUESTS_PAGE}?id=${response.data.id}`;
        }).catch(function (error) {
            self.showError(error);
        });
    };


    self.archivelicenseRequest = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}/archive/${self.licenseRequestId()}`)
            .then(function () {
                location.reload();
            }).catch(function (error) {
                self.showError(error);
            });
    };

    self.sendlicenseRequest = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;
       
        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}/send/${self.licenseRequestId()}`)
            .then(function () {
                location.reload();
            }).catch(function (error) {
                self.showError(error);
            });
    };

    self.createLicense = function(data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.put(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseRequestId()}`)
            .then(function (response) {
                window.location.href = `/${MANAGEMENT_LICENSES_PAGE}?id=${response.data.id}`;
            }).catch(function(error) {
                self.showError(error);
            });
    };


    self.loadFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${MANAGEMENT_LICENSEREQUESTS_ENDPOINT}/${self.licenseRequestId()}`);
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };


    return self;
}