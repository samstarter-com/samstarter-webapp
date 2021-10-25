function LicenseViewModel(id, url, menu) {
    var self = new BaseLicenseViewModel(id, url, menu);
    self.menu(menu);
    self.TemplateUrl = url;
    self.isNew = ko.observable(true);
    self.structureUnitId = ko.observable();
    self.structureUnitName = ko.observable();
    self.licenseTypes = ko.observableArray();
    self.structureUnits = ko.observableArray();
    self.id = ko.computed(
        function () {
            return self.licenseId();
        }
    );
    self.linkedSoftwares = ko.observableArray();

    self.hasLinkedSoftware = ko.computed(function () {
        return self.linkedSoftwares().length > 0;
    });

    self.structureUnitUrl = ko.computed(
        function () {
            return `/${ADMINISTRATION_STRUCTUREUNIT_PAGE}?id=${self.structureUnitId()}`;
        }
    );

    self.usageUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSES_PAGE}/Usage/?id=${self.licenseId()}`;
        }
    );

    self.machineUrl = ko.computed(
        function () {
            return `/${MANAGEMENT_LICENSE_MACHINES_PAGE}?licenseId=${self.licenseId()}`;
        }
    );

    self.beginDate = ko.observable();
    self.expirationDate = ko.observable();
    self.comments = ko.observable();
    self.count = ko.observable(0);
    self.licenseTypeId = ko.observable();

    self.alerts = ko.observableArray();
    self.selectedAlert = ko.observable();

    self.documents = ko.observableArray();
    self.documentsId = ko.computed(function () {
        return ko.utils.arrayMap(self.documents(), function (d) {
            return d.id();
        }).join(",");
    });


    self.toLinkSoftware = null;

    self.onAddAllLinkedSoftwareClick = function () {
        self.autocompleteSelection.forEach(function (element) {
            self.createToLinkSoftware(element);
            self.onAddLinkedSoftwareClick();
        });
        $("#softwareAutocomplete").autocomplete("close");
    };

    self.onAddLinkedSoftwareClick = function () {
        if ((typeof self.toLinkSoftware != "undefined") && (self.toLinkSoftware != null)) {
            if ($.grep(self.linkedSoftwares(), function (el) { return el.softwareId() === self.toLinkSoftware.softwareId(); }).length === 0) {
                self.linkedSoftwares.push(self.toLinkSoftware);
            }
        }
    };

    self.onRemoveLinkedSoftwareClick = function () {
        var toRemove = ko.utils.arrayFirst(self.linkedSoftwares(), function (software) {
            return software.isSelected() === true;
        });
        self.linkedSoftwares.remove(toRemove);
    };

    self.onAddDocumentClick = function () {
        var document = new DocumentViewModel();
        self.documentAdded(document);
        self.documents.push(document);
    };

    self.documentAdded = function (dvm) {
        dvm.index = self.getHighestDocumentIndex() + 1;
        dvm.onRemoveDocumentClick = function () {
            self.documents.remove(this);
        };
    };

    self.documentTemplate = function (document) {
        return document.isNew() ? "AddDocument" : "EditDocument";
    };

    self.onAddAlertClick = function () {
        var alert = new AlertViewModel();
        self.alertAdded(alert);
        self.alerts.push(alert);
        //alert.init(self.form);
    };

    self.alertAdded = function (avm) {
        avm.index = self.getHighestAlertIndex() + 1;
        avm.structureUnitId = self.structureUnitId();

        avm.onRemoveAlertClick = function () {
            self.alerts.remove(this);
        };
    };

    self.softwareAutocompleteRenderItem = function (ul, item) {
        return $("<li>")
            .append("<a><span><small><i>Name:</i></small></span><span><small><b>" + item.label + "</b></small></span><br><span><small><i>Version:</i></small></span><span><small><b>" + item.value.version + "</b></small></span><br><span><small><i>Publisher:</i></small></span><span><small><b>" + item.value.publisherName + "</b></small></span></a>")
            .appendTo(ul);
    };

    self.softwareAutocompleteRenderHeader = function (ul, items) {
        var result = $("<div>")
            .append("<span style='display:inline;'><small><i>Total found:</i></small></span><span style='display:inline;'><small><b>" + items.length + "</b></small></span><button id='addAllLinkedSoftwareButton' style='display:inline;' data-bind='click: onAddAllLinkedSoftwareClick'>Add all to license</button>")
            .appendTo(ul);

        // todo: remove from ViewModel
        ko.applyBindings(self, $("#addAllLinkedSoftwareButton")[0]);
        return result;
    };

    self.autocompleteSelection = null;



    self.softwareAutocompleteSource = function (request, response) {
        var element = $(this);

        axios.get(`${self.baseApiAddress}${MANAGEMENT_SOFTWARES_ENDPOINT}/autocomplete?cid=${self.structureUnitId()}&request=${request.term}`).then(
            function (resp) {
                element.removeClass("ui-autocomplete-loading"); // hide loading image
                if (self.hasLinkedSoftware() && resp.data.softwares.length > 0) {
                    self.linkedSoftwares().forEach(function (s) {
                        $.each(resp.data.softwares, function (i) {
                            if (resp.data.softwares[i].softwareId === s.softwareId()) {
                                resp.data.softwares.splice(i, 1);
                                return false;
                            }
                        });
                    });
                }
                self.autocompleteSelection = resp.data.softwares;
                response($.map(resp.data.softwares, function (item) {
                    return {
                        label: item.name,
                        value: item
                    };
                })

                );
            }
        );
    };

    self.softwareAutocompleteSelect = function (event, ui) {
        self.createToLinkSoftware(ui.item.value);
        $(this).val(ui.item.label);
        ui.item.value = ui.item.label;
    };

    self.bootstrapWizardOnNext = function (tab, navigation, index) {
        //var currentDiv = self.form.find("div.tab-pane:visible");
        ////var $valid = self.form.valid();
        ////var invalidElements = self.form.validate().invalidElements();
        //var invalidElementIsVisible = false;
        //invalidElements.each(function(ind, element) {
        //	if (currentDiv.find(element).length > 0) {
        //		invalidElementIsVisible = true;
        //		return false;
        //	}
        //});
        //return invalidElementIsVisible ? $valid : true;
    };

    self.bootstrapWizardOnTabClick = function (tab, navigation, index, clickedIndex, clickedTab) {
        //var currentDiv = self.form.find("div.tab-pane:visible");
        ////var $valid = self.form.valid();
        ////var invalidElements = self.form.validate().invalidElements();
        //var invalidElementIsVisible = false;
        //invalidElements.each(function(ind, element) {
        //	if (currentDiv.find(element).length > 0) {
        //		invalidElementIsVisible = true;
        //		return false;
        //	}
        //});
        //return invalidElementIsVisible ? $valid : true;
    };
    self.showSubmitButton = ko.observable(false);
    self.bootstrapWizardOnTabShow = function (tab, navigation, index) {
        var $total = navigation.find("li").length;
        var $current = index + 1;
        var $percent = ($current / $total) * 100;
        ////self.form.find("#rootwizard").find("#bar").css({ width: $percent + "%" });
        if ($current === $total) {
            self.showSubmitButton(true);
        } else {
            self.showSubmitButton(false);
        }
    };

    self.beginDateFormatted = ko.computed(
        function () {
            return self.beginDate() != undefined ? self.beginDate().toLocaleDateString() : self.beginDate();
        }
    );
    self.expirationDateFormatted = ko.computed(
        function () {
            return self.expirationDate() != undefined ? self.expirationDate().toLocaleDateString() : self.expirationDate();
        }
    );

    //self.dateformat = "DD.MM.YYYY";
    self.mapping = {
        'beginDate': {
            create: function (options) {
                return moment(options.data).toDate();
            },
            update: function (options) {
                return moment(options.data).toDate();
            }
        },
        'expirationDate': {
            create: function (options) {
                return moment(options.data).toDate();
            },
            update: function (options) {
                return moment(options.data).toDate();
            }
        },
        'linkedSoftwares': {
            create: function (options) {
                var svm = new SoftwareViewModel();
                ko.mapping.fromJS(options.data, {}, svm);
                return svm;
            }
        },
        'alerts': {
            create: function (options) {
                var avm = new AlertViewModel();
                avm.isNew(false);
                ko.mapping.fromJS(options.data, avm.mapping, avm);
                return avm;
            }
        },
        'documents': {
            create: function (options) {
                var dvm = new DocumentViewModel();
                dvm.isNew(false);
                ko.mapping.fromJS(options.data, dvm.mapping, dvm);
                self.documentAdded(dvm);
                return dvm;
            }
        },
        'ignore': ["hasLinkedSoftware"]
    };

    self.createToLinkSoftware = function (element) {
        self.toLinkSoftware = new SoftwareViewModel();

        self.toLinkSoftware.beforeClick = function () {
            self.linkedSoftwares().forEach(function (s) {
                s.isSelected(false);
            });
        };

        ko.mapping.fromJS(element, {}, self.toLinkSoftware);
    };

    self.getHighestAlertIndex = function () {
        var max = 0;
        for (var i = 0; i < self.alerts().length; i++) {
            if (self.alerts()[i].index > max)
                max = self.alerts()[i].index;
        }
        return max;
    };

    self.onHasLinkedSoftwareChange = function (newValue, element) {
        element.val(newValue === false ? null : newValue);
        if (element.length > 0) {
            element.valid();
        }
    };

    self.getHighestDocumentIndex = function () {
        var max = 0;
        for (var i = 0; i < self.documents().length; i++) {
            if (self.documents()[i].index > max)
                max = self.documents()[i].index;
        }
        return max;
    };

    self.loadFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseId()}`);
    };

    self.loadDetailFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/detail/${self.licenseId()}`);
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };

    self.updateLicense = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var license = {
            LicenseId: self.id(),
            Name: self.name(),
            LicenseTypeId: self.licenseTypeId(),
            Count: self.count(),
            BeginDate: moment(self.beginDate()).format('YYYY-MM-DD HH:mm:ss'),
            ExpirationDate: moment(self.expirationDate())
                .format('YYYY-MM-DD HH:mm:ss'),
            Comments: self.comments(),
            HasLinkedSoftware: self.hasLinkedSoftware(),
            StructureUnitId: self.structureUnitId(),
            LinkedSoftwares: self.linkedSoftwares().map(function (ls) {
                return { SoftwareId: ls.softwareId() }
            }),
            Documents: self.documents().map(function (doc) {
                return {
                    Id: doc.id(),
                    UploadId: doc.uploadId(),
                    Name: doc.name(),
                    HcLocation: doc.hcLocation()
                }
            }),
            Alerts: self.alerts().map(function (alert) {
                return {
                    Id: alert.id(),
                    AlertDateTime: new moment(alert.alertDate()).add(alert.alertTime().getHours(), 'h')
                        .add(alert.alertTime().getMinutes(), 'm').toDate(),
                    AlertText: alert.alertText(),
                    AlertUsersId: alert.alertUsers().map(function (user) {
                        return user.id();
                    })
                }
            })
        };

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}`, license).then(function (response) {
            if (response.data.success) {
                window.location.href = `/${MANAGEMENT_LICENSES_PAGE}?id=${response.data.id}`;
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }

        }).catch(function (error) {
            self.showError(error);
        });

    };

    self.addLicense = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        var license = {
            Name: self.name(),
            LicenseTypeId: self.licenseTypeId(),
            Count: self.count(),
            BeginDate: self.beginDate(),
            ExpirationDate: self.expirationDate(),
            Comments: self.comments(),
            HasLinkedSoftware: self.hasLinkedSoftware(),
            StructureUnitId: self.structureUnitId(),
            LinkedSoftwares: self.linkedSoftwares().map(function (ls) { return { SoftwareId: ls.softwareId() } }),
            // todo: implement mapping Alerts: self.alerts().map(function(alert) {return })}
            // todo: implement mapping Documents: self.documents().map(function (doc) { return { Id: doc.ID(), Name: doc.Name(), HcLocation: doc.HcLocation(), } })
        };

        axios.put(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}`, license).then(function (response) {
            if (response.data.success) {
                window.location.href = `/${MANAGEMENT_LICENSES_PAGE}?id=${response.data.id}`;
            }
            else {
                ko.utils.arrayPushAll(self.errors, response.data.errors);
                return;
            }

        }).catch(function (error) {
            self.showError(error);
        });

    };

    self.setLicensetypes = function () {
        axios.get(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/licensetypes`).then(
            function (resp) {
                self.licenseTypes(resp.data);
            }
        );
    };

    self.linkStructureUnit = function (data) {
        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseId()}/structureunit/${self.structureUnitId()}`,
            {}).then(function (response) {
                if (response.data.success) {
                    window.location.href = self.url();
                }
                else {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
            }).catch(function (error) {
                self.showError(error);
            });
    };

    self.structureUnitChanging = function (data) {
        self.structureUnitId(data.node.id);
    };

    self.deleteLicense = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.delete(`${self.baseApiAddress}${MANAGEMENT_LICENSES_ENDPOINT}/${self.licenseId()}/structureunit/${self.structureUnitId()}`).then(function (response) {
            window.location.href = `/${MANAGEMENT_LICENSES_PAGE}?cid=${self.structureUnitId()}`;
        }).catch(function (error) {
            self.errors.push(error.response.data.errors);
        });
    };

    self.licenseMachine = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.licenseId()}/licensemachine/${self.machineId()}`,
            {}).then(function (response) {
                if (response.data.success) {
                    location.reload();
                }
                else {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
            }).catch(function (error) {
                self.showError(error);
            });
    };

    self.unLicenseMachine = function (data) {

        self.errors.removeAll();
        var $form = $(data);
        if (!$form.valid()) return;

        axios.post(`${self.baseApiAddress}${MANAGEMENT_LICENSING_ENDPOINT}/${self.licenseId()}/unlicensemachine/${self.machineId()}`,
            {}).then(function (response) {
                if (response.data.success) {
                    location.reload();
                }
                else {
                    ko.utils.arrayPushAll(self.errors, response.data.errors);
                    return;
                }
            }).catch(function (error) {
                self.showError(error);
            });
    };

    return self;

};