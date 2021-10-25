function AlertViewModel() {
    var self = new DetailViewModel();
    self.isNew = ko.observable(true);
    self.index = 0;
    self.id = ko.observable();
    self.structureUnitId = null;
    self.alertUsers = ko.observableArray();
    self.alertDate = ko.observable();
    self.alertTime = ko.observable();
    self.alertText = ko.observable();
    self.toLinkUser = null;

    self.alertDateTimeFormatted = ko.computed(
      function () {
            return self.alertDateTime != undefined ? self.alertDateTime.toDate().toLocaleString() : self.alertDateTime;
      }
    );

    self.alertUsersId = ko.computed(function () {
        return ko.utils.arrayMap(self.alertUsers(), function (u) {
            return u.userId();
        }).join(',');
    });

    self.onAddAlertUserClick = function () {
        if ((typeof self.toLinkUser != 'undefined') && (self.toLinkUser != null)) {
            if ($.grep(self.alertUsers(), function (el) { return el.userId() == self.toLinkUser.userId(); }).length === 0) {
                self.alertUsers.push(self.toLinkUser);
            }
        }
    };

    self.onRemoveAlertUserClick = function () {
        var toRemove = ko.utils.arrayFirst(self.alertUsers(), function (user) {
            return user.isSelected() === true;
        });
        self.alertUsers.remove(toRemove);
    };

    self.onRemoveAlertClick = function () {
    };

    self.userAutocompleteSource = function (request, response) {
        var element = $(this);
        axios.get(`${self.baseApiAddress}${MANAGEMENT_USER_ENDPOINT}/autocomplete?cid=${self.structureUnitId}&request=${request.term}`).then(
            function (resp) {
                element.removeClass('ui-autocomplete-loading'); // hide loading image

                response($.map(resp.data.users, function (item) {
                    return {
                        label: item.userName,
                        value: item
                    };
                }));
            }
            //,
            //error: function(data) {
            //    element.removeClass('ui-autocomplete-loading');
            //}
            //  }
        );
    };

    self.userAutocompleteSelect = function (event, ui) {
        self.createToLinkUser(ui.item.value);
        $(this).val(ui.item.label);
        ui.item.value = ui.item.label;
    };

    self.init = function (form) {
        //form.removeData('validator');
        //form.removeData('unobtrusiveValidation');
        //$.validator.unobtrusive.parse(form);
    };

    // var datetimeformat = 'DD.MM.YYYY, HH:mm';
    // var dateformat = 'DD.MM.YYYY';
    var timeformat = 'HH:mm';
    self.mapping = {
        'alertDateTime': {
            create: function (options) {
                var ad = moment.utc(options.data).local().toDate();
                ad.setHours(0);
                ad.setMinutes(0);
                ad.setSeconds(0);
                self.alertDate(ad);
                self.alertTime(moment.utc(options.data).local().format(timeformat));
                return moment.utc(options.data).local();
            }
        },
        'alertUsers': {
            create: function (options) {
                var uvm = new UserViewModel();
                ko.mapping.fromJS(options.data, uvm.mapping, uvm);
                return uvm;
            }
        },
        'ignore': ["alertUsersId"]
    };

    self.createToLinkUser = function (element) {
        self.toLinkUser = new UserViewModel();

        self.toLinkUser.beforeClick = function () {
            self.alertUsers().forEach(function (u) {
                u.isSelected(false);
            });
        };

        ko.mapping.fromJS(element, {}, self.toLinkUser);
    };



    return self;
};
