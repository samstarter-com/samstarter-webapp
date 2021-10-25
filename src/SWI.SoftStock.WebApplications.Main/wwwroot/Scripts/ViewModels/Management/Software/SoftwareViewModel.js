function SoftwareViewModel(id, url) {
    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.softwareId = ko.observable(id);
    self.structureUnitId = ko.observable();
    self.includeSubItems = ko.observable();
    
    self.id = ko.computed(
        function () {
            return self.softwareId();
        }
    );

    self.url = ko.computed(
        function () {
            return `/${MANAGEMENT_SOFTWARES_PAGE}?id=${self.softwareId()}&cid=${self.structureUnitId()}&includeSubItems=${self.includeSubItems ? '1' : '0'}`;
        }
    );

    self.licenseId = ko.observable();
    self.licenseUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}?id=${self.licenseId()}`;
        }
    );

    var dateformat = 'DD.MM.YYYY';
    self.mapping = {
        'installDate': {
            create: function (options) {
                if (options.data != null) {
                    var jsDate = moment(options.data, "YYYYMMDD");
                    var result = moment(jsDate).format(dateformat);
                    if (result === "Invalid date") {
                        jsDate = moment(options.data, "MM/DD/YYYY");
                        result = moment(jsDate).format(dateformat);
                    }
                    return result;
                }
                return null;
            }
        },
        'discoveryDate': {
            create: function (options) {
                var date = moment(options.data);
                return date.subtract(date.zone(), 'minutes').format(dateformat);
            }
        },
        'observableProcesses': {
            create: function (options) {
                var ovm = new ObservableViewModel();
                ko.mapping.fromJS(options.data, {}, ovm);
                return ovm;
            }
        },
        'licenses': {
          create: function(options) {
            var lvm = new BaseLicenseViewModel();
            lvm.mapfromJS(options.data);
            return lvm;
          }
        }
    };

    self.loadFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${MANAGEMENT_SOFTWARES_ENDPOINT}/${self.softwareId()}`);
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };

    return self;
};