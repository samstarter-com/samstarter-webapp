$(function () {

    axios.interceptors.request.use(async function (config) {
        $('#ajax-loader').fadeIn();
        var token = localStorage.getItem('accessToken');
        if (token != null) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        }
        return config;
        },
        function (error) {
            $('#ajax-loader').fadeOut();
            return Promise.reject(error);
        });

    axios.interceptors.response.use((response) => {
            $('#ajax-loader').fadeOut();
            return response;
        },
        (error) => {
            $('#ajax-loader').fadeOut();
            var account = new AccountViewModel();
            if (error &&
                error.response &&
                error.response.status === 401 &&
                !account.isLogged() &&
                !error.response.request.responseURL.toLowerCase().endsWith(ACCOUNT_LOGIN_ENDPOINT)) {
                window.location.href = '/';
            }
            if (error && error.response && error.response.status === 401 && account.isLogged()
            ) { 
                account.refresh();
            }
            return Promise.reject(error);
        });
    
    // http://johnculviner.com/clearreset-mvc-3-form-and-unobtrusive-jquery-client-validation/
    (function ($) {

        //re-set all client validation given a jQuery selected form or child
        $.fn.resetValidation = function () {

            var $form = this.closest('form');

            //reset jQuery Validate's internals
            $form.validate().resetForm();

            //reset unobtrusive validation summary, if it exists
            $form.find("[data-valmsg-summary=true]")
                .removeClass("validation-summary-errors")
                .addClass("validation-summary-valid")
                .find("ul").empty();

            //reset unobtrusive field level, if it exists
            $form.find("[data-valmsg-replace]")
                .removeClass("field-validation-error")
                .addClass("field-validation-valid")
                .empty();

            return $form;
        };

        //reset a form given a jQuery selected form or a child
        //by default validation is also reset
        $.fn.formReset = function (resetValidation) {
            var $form = this.closest('form');

            $form[0].reset();

            if (resetValidation == undefined || resetValidation) {
                $form.resetValidation();
            }

            return $form;
        };
    })(jQuery);
    
    //http://stackoverflow.com/questions/6399078/knockoutjs-databind-with-jquery-ui-datepicker
    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            
            var attr = allBindingsAccessor().attr;
            if (attr != undefined && attr.id != undefined) {
                ko.applyBindingsToNode(element, { attr: attr }, viewModel);
            }

            var $el = $(element);

            //initialize datepicker with some optional options
            var options = allBindingsAccessor().datepickerOptions || {};
            options.onClose = function () {
                var $form = $(element).closest('form');
                if ($form.length != 0) {
                    $(element).closest('form').validate().element("#" + element.id);
                }
            };
            $el.datepicker(options);

            //handle the field changing
            ko.utils.registerEventHandler(element, "change", function () {
                var observable = valueAccessor();
                observable($el.datepicker("getDate"));
            });

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $el.datepicker("destroy");
            });

        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var $form = $('[id="' + element.id + '"]').closest('form');
            var $el = $form.length == 0 ? $('[id="' + element.id + '"]') :
                $form.filter(':visible').find('[id="' + element.id + '"]');
            var current = $el.datepicker("getDate");

            if (value - current !== 0) {
                $el.datepicker("setDate", value);
            }
        }
    };
    
    ko.bindingHandlers.autocomplete = {
        init: function (element, params) {
            
            //http://stackoverflow.com/questions/15706455/the-field-date-must-be-a-date-in-mvc-in-chrome
            jQuery.validator.methods.date = function (value) {
                if (value) {
                    try {
                        $.datepicker.parseDate('dd.mm.yy', value);
                    } catch (ex) {
                        return false;
                    }
                }
                return true;
            };

            var autocomplete = $(element).autocomplete(params());
	        if (params().renderItem != undefined) {
	        	$(autocomplete).autocomplete().data("uiAutocomplete")._renderItem = params().renderItem;
	        }
	        if (params().renderHeader != undefined) {
	        	$(autocomplete).autocomplete().data("uiAutocomplete")._renderMenu = function (ul, items) {
	        		var that = this;
			        params().renderHeader(ul, items);
	        		$.each(items, function (index, item) {
	        			that._renderItemData(ul, item);
	        		});
	        	};
	        }
        },
        update: function (element, params) {
            
            //http://stackoverflow.com/questions/15706455/the-field-date-must-be-a-date-in-mvc-in-chrome
            jQuery.validator.methods.date = function (value) {
                if (value) {
                    try {
                        $.datepicker.parseDate('dd.mm.yy', value);
                    } catch (ex) {
                        return false;
                    }
                }
                return true;
            };
            
            var autocomplete = $(element).autocomplete("option", "source", params().source);
        }
    };
    
    ko.bindingHandlers.bootstrapWizard = {
        init: function (element, params) {
         
                $(element).bootstrapWizard(params());
                $(element).closest('form').removeData('validator');
                $(element).closest('form').removeData('unobtrusiveValidation');
                $.validator.unobtrusive.parse($(element));
        },
        update: function (element, params) {
            $(element).closest('form').removeData('validator');
            $(element).closest('form').removeData('unobtrusiveValidation');
            $.validator.unobtrusive.parse($(element));
        }
    };
    
    ko.bindingHandlers.hidden = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                $el = $('[id="' + element.id + '"]').closest(':visible').find('#' + element.id + '');
            $el.val(value);
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                $el = $('[id="' + element.id + '"]').closest(':visible').find('#' + element.id + ''),
                current = $el.val();
            if (value != current) {
                $el.val(value);
                $el.closest('form').validate().element("#" + element.id);
            }
        }
    };
    
    ko.bindingHandlers.timeEntry = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize timeEntry with some optional options
            var options = allBindingsAccessor().timeEntryOptions || {};
            $(element).timeEntry(options);

            //handle the field changing
            ko.utils.registerEventHandler(element, "change", function () {
                var observable = valueAccessor();
                observable($(element).timeEntry("getTime"));
            });


            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).timeEntry("disable");
            });

        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                current = $(element).timeEntry("getTime");

            if (value - current !== 0) {
                $(element).timeEntry("setTime", value);
            }
        }
    };
    
    // для сворачивания текста
    ko.bindingHandlers.readmore = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize readmore with some optional options
            var options = allBindingsAccessor().readmoreOptions || {};
           

            //handle the field changing
            ko.utils.registerEventHandler(element, "change", function () {
                var observable = valueAccessor();
                observable(element.innerTex);
            });
            
            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).readmore("destroy");
            });

        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                current = element.innerTex;

            if (value - current !== 0) {
                element.innerText = value;
            }
            
            $(element).readmore({
                speed: 75,
                maxHeight: 10
            });
        }
    };
    
    https://stackoverflow.com/questions/29152175/updating-a-jstree-using-knockout-custom-binding
    ko.bindingHandlers.jstree = {
        buildTree: function (element, treeData, onTreeChange) {
            $(element).jstree('destroy');
            $(element).jstree({
                'core': {
                    "initially_open": ["1"],
                    'data': treeData
                },
                "plugins": ["core", "ui", "wholerow"]
            }).bind(
                "select_node.jstree", function(evt, data) {
                    onTreeChange(data);
                }
            );
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var treeData = ko.unwrap(valueAccessor());
            ko.bindingHandlers.jstree.buildTree(element, treeData.data(), treeData.onTreeChange);
        }
    };
    
    //First make KO able to disable clicks on Anchors
    var orgClickInit = ko.bindingHandlers.click.init;
    ko.bindingHandlers.click.init = function (element, valueAccessor, allBindingsAccessor, viewModel) {
        if ((element.tagName === "DIV" || element.tagName === "LI" || element.tagName === "A") && allBindingsAccessor().enable != null) {
            var disabled = ko.computed({
                read: function () {
                    return ko.utils.unwrapObservable(allBindingsAccessor().enable) === false;
                },
                disposeWhenNodeIsRemoved: element
            });
            ko.applyBindingsToNode(element, { css: { disabled: disabled } });
            var handler = valueAccessor();
            valueAccessor = function () {
                return function() {
                    if (ko.utils.unwrapObservable(allBindingsAccessor().enable)) {
                        handler.apply(this, arguments);
                    }
                };
            };
        }
        orgClickInit.apply(this, arguments);
    };

});

// use URLSearchParams
//function getParameterByName(name) {
//    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//        results = regex.exec(location.search);
//    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
//}
//;

var resetValidator = function (id) {
    $.validator.unobtrusive.parse($('#' + id));
};

// todo: use URLSearchParams
function setGetParameter(url, paramName, paramValue) {
    paramValue = encodeURIComponent(paramValue);
    if (url.indexOf(paramName + "=") >= 0) {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    }
    else {
        if (url.indexOf("?") < 0)
            url += "?" + paramName + "=" + paramValue;
        else
            url += "&" + paramName + "=" + paramValue;
    }
    return url;
};

// todo: use URLSearchParams
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length > 0) {
            rtn = rtn + "?" + params_arr.join("&");
        }
    }
    return rtn;
};

var STRUCTUREUNIT_ENDPOINT = 'administration/structureunits';
var USER_ENDPOINT = 'administration/users';
var ADMINISTRATION_SUMMARY_ENDPOINT = 'administration/summary';

var DOCUMENT_UPLOAD_ENDPOINT = 'document/upload';
var CONTACT_FEEDBACK_ENDPOINT = 'contact/feedback';

var ACCOUNT_LOGIN_ENDPOINT= 'account/login';
var ACCOUNT_REFRESH_ENDPOINT = 'account/refresh';
var ACCOUNT_CHANGEPASSWORD_ENDPOINT = 'account/changepassword';
var ACCOUNT_REGISTER_ENDPOINT = 'account/register';
var ACCOUNT_VERIFY_ENDPOINT = 'account/verify';

var PERSONAL_ROLES_ENDPOINT = 'personal/roles';
var PERSONAL_MACHINES_ENDPOINT = 'personal/machines';
var PERSONAL_SOFTWARES_ENDPOINT = 'personal/softwares';
var PERSONAL_LICENSEREQUEST_ENDPOINT = 'personal/licenserequests';
var PERSONAL_EVERYROLES_ENDPOINT = 'personal/everyroles';


var MANAGEMENT_USER_ENDPOINT = 'management/users';
var MANAGEMENT_MACHINES_ENDPOINT = 'management/machines';
var MANAGEMENT_MACHINESSOFTWARES_ENDPOINT = 'management/machines/softwares';

var MANAGEMENT_SOFTWARES_ENDPOINT = 'management/softwares';
var MANAGEMENT_SOFTWARESMACHINES_ENDPOINT = 'management/softwares/machines';

var MANAGEMENT_LICENSES_ENDPOINT = 'management/licenses';
var MANAGEMENT_LICENSING_ENDPOINT = 'management/licensing';

var MANAGEMENT_LICENSEREQUESTS_ENDPOINT = 'management/licenserequests';
var MANAGEMENT_LICENSEREQUEST_ENDPOINT = 'management/licenserequest';
var MANAGEMENT_OBSERVABLES_ENDPOINT = 'management/observables';


var ACCOUNT_FINISHREGISTER_PAGE = 'account/finishregister';
var ACCOUNT_FINISHVERIFICATION_PAGE = 'account/finishverification';

var HOME_THANKYOUPAGE_PAGE = 'home/thankyoupage';

var PERSONAL_MACHINES_PAGE = 'personal/machines';
var PERSONAL_LICENSEREQUESTS_PAGE = 'personal/licenserequests';

var ADMINISTRATION_USER_PAGE = 'administration/users';
var ADMINISTRATION_STRUCTUREUNIT_PAGE = 'administration/structureunits';
var ADMINISTRATION_SUMMARY_PAGE = 'administration/summary';

var MANAGEMENT_MACHINES_PAGE = 'management/machines';
var MANAGEMENT_SOFTWARES_PAGE = 'management/softwares';
var MANAGEMENT_LICENSES_PAGE = 'management/licenses';
var MANAGEMENT_LICENSEREQUESTS_PAGE = 'management/licenserequests';
var MANAGEMENT_OBSERVABLES_PAGE = 'management/observables';
var MANAGEMENT_LICENSE_MACHINES_PAGE = 'management/license/machines';
var MANAGEMENT_MACHINE_LICENSES_PAGE = 'management/machine/licenses';
var MANAGEMENT_MACHINE_SOFTWARES_PAGE = 'management/machine/softwares';
var MANAGEMENT_SOFTWARE_MACHINES_PAGE = 'management/software/machines';
