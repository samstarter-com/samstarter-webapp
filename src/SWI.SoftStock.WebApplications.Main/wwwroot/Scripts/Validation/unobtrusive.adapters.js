// hfguidlinked adapter
$.validator.unobtrusive.adapters.add('hfguidlinked', ['dependentcontrol'], function (options) {
    var value = {
        dependentcontrol: {
            control: options.params.dependentcontrol
        },
        dependentpropertyhasvalue:  "1",
        propertyhasvalue: options.params.propertyhasvalue === "1"
        
    };

    options.rules['hfguidlinked'] = value;
    if (options.message) {
        options.messages['hfguidlinked'] = options.message;
    }
});

// requiredif adapter
$.validator.unobtrusive.adapters.add('requiredif', ['dependentcontrol', 'dependentpropertyhasvalue', 'propertyhasvalue', 'dependentcontrolvalues'], function (options) {
    var value = {
        dependentcontrol: {
            control: options.params.dependentcontrol,
            values: options.params.dependentcontrolvalues,
            valuesdelimitter: '|'
        },
        dependentpropertyhasvalue: options.params.dependentpropertyhasvalue === "1",
        propertyhasvalue: options.params.propertyhasvalue === "1"
        
    };

    options.rules['requiredif'] = value;
    if (options.message) {
        options.messages['requiredif'] = options.message;
    }
});

// boolean adapter
$.validator.unobtrusive.adapters.add('boolean', ['val'], function (options) {
    var value = {
        elementselector: "#" + options.element.id,
        val: options.params.val === "1"
    };

    options.rules['boolean'] = value;
    if (options.message) {
        options.messages['boolean'] = options.message;
    }
});

// regexif adapter
$.validator.unobtrusive.adapters.add('regexif', ['pattern', 'patternif'], function (options) {
    var value = {
        pattern: options.params.pattern || ".*",
        patternif: options.params.patternif || ".*"
    };

    options.rules['regexif'] = value;
    if (options.message) {
        options.messages['regexif'] = options.message;
    }
});

// formatdate adapter
$.validator.unobtrusive.adapters.add('formatdate', ['day', 'month', 'year', 'montherror', 'max', 'maxerror', 'min', 'minerror',
                                                    'type', 'typeerror', 'today', 'todaytype', 'futuretype', 'pasttype'], function (options) {
    var value = {
        selectors: {
            day: options.params.day,
            month: options.params.month,
            year: options.params.year
        },
        errors: {
            commonerror: options.message || 'Введите дату',
            montherror: options.params.montherror || 'В году 12 месяцев'
        },
        range: {
            max: {
                value: options.params.max,
                message: options.params.maxerror
            },
            min: {
                value: options.params.min,
                message: options.params.minerror
            },
            type: {
                value: parseInt(options.params.type),
                message: options.params.typeerror
            }
        },
        today: options.params.today,
        datetypes: {
            today: parseInt(options.params.todaytype) || (1 << 0),
            past: parseInt(options.params.pasttype) || (1 << 1),
            future: parseInt(options.params.futuretype) || (1 << 2)
        }
    };

    options.rules['formatdate'] = value;
});

// complexlength adapter
$.validator.unobtrusive.adapters.add('complexlength', ['dependentcontrols', 'max', 'min'], function (options) {
    var value = {
        dependentcontrols: options.params.dependentcontrols,
        max: options.params.max,
        min: options.params.min,
        controlsdelimitter: '|'
    };

    options.rules['complexlength'] = value;
    if (options.message) {
        options.messages['complexlength'] = options.message;
    }
});

// custom adapter
$.validator.unobtrusive.customvalidators = {
    commonclass: {
        dummyfunc: function (value, element) {
            return true;
        }
    }
};

// Функция addcustomvalidator должна использоваться внешним кодом
$.validator.unobtrusive.addcustomvalidator = function (classname, funcname, func) {
    if (!($.validator.unobtrusive.customvalidators)) {
        return;
    }

    if (!($.validator.unobtrusive.customvalidators[classname])) {
        $.validator.unobtrusive.customvalidators[classname] = {};
    }

    $.validator.unobtrusive.customvalidators[classname][funcname] = func;
};

$.validator.unobtrusive.adapters.add('custom', [], function (options) {

    if (options.message !== "true") {
        return;
    }

    var dataValCustomAttrs = $.grep(options.element.attributes, function (at) { return /^data-val-custom-/.test(at.name); });

    $.each(dataValCustomAttrs, function () {

        var classAndFuncNames = this.name.replace('data-val-custom-', '');
        classAndFuncNames = classAndFuncNames.split('-', 2);

        var ruleoptions = options.rules['custom'];
        if (!ruleoptions) {
            ruleoptions = {
                customvalidators: [],
                lasterrormessage: ''
            };
        }
        ruleoptions.customvalidators.push({
            classname: classAndFuncNames[0] || 'commonclass',
            funcname: classAndFuncNames[1] || 'dummyfunc',
            errormessage: this.value || ''
        });

        options.rules['custom'] = ruleoptions;
    });
});