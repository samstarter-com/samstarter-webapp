$(document).ready(function() {
    $.validator.prototype.getControlValue = function(control, controlvalue) {
        control = $(control);
        var returnvalue = control.val();
        var controltype = control.attr('type');
        if (controltype === 'radio' || controltype === 'checkbox') {
            if (controlvalue && returnvalue != controlvalue) {
                var selector = "input[type='" + controltype + "'][value='" + controlvalue + "']";
                control = $(selector);
                returnvalue = control.val();
            }
            returnvalue = control.is(":checked") ? returnvalue : "";
        }
        return returnvalue;
    };

    $.validator.addMethod('hfguidlinked', function(value, element, param) {

        var dependentcontrol = $('#' + param.dependentcontrol.control);
        if (!dependentcontrol.length) {
            dependentcontrol = $('.' + param.dependentcontrol.control);
        }

        var dependentValue = $.trim(this.getControlValue(dependentcontrol));
        var dependentValueIsOk = dependentValue.length > 0;

        var valueExists = $.trim(this.getControlValue(element, value)).length > 0;

        if (valueExists) {
            return dependentValueIsOk;
        }

        return true;
    });

    $.validator.addMethod('requiredif', function(value, element, param) {

        var dependentcontrol = $('#' + param.dependentcontrol.control);
        if (!dependentcontrol.length) {
            dependentcontrol = $('.' + param.dependentcontrol.control);
        }

        var dependentValue = $.trim(this.getControlValue(dependentcontrol));
        var dependentValueIsOk = dependentValue.length > 0;
        if (dependentValueIsOk && param.dependentcontrol.values) {
            dependentValueIsOk = false;
            $.each(param.dependentcontrol.values.split(param.dependentcontrol.valuesdelimitter), function(index, value) {
                if (dependentValue == value) {
                    dependentValueIsOk = true;
                    return false;
                }
            });
        }

        var valueExists = $.trim(this.getControlValue(element, value)).length > 0;

        if (param.dependentpropertyhasvalue && !param.propertyhasvalue) {
            if (!valueExists && dependentValueIsOk)
                return false;
        }
        if (param.dependentpropertyhasvalue && param.propertyhasvalue) {
            if (valueExists && dependentValueIsOk)
                return false;
        }
        if (!param.dependentpropertyhasvalue && !param.propertyhasvalue) {
            if (!valueExists && !dependentValueIsOk)
                return false;
        }
        if (!param.dependentpropertyhasvalue && param.propertyhasvalue) {
            if (valueExists && !dependentValueIsOk)
                return false;
        }

        return true;
    });

    $.validator.addMethod('boolean', function(value, element, param) {
     
        var controltype = $(element).attr('type');

        // Ищем контрол на который наложено правило boolean
        var targetelement = $(param.elementselector);
        // Если не найден, то используем первый в группе контролов с одинаковым name
        if (!targetelement) targetelement = $(element);

        if (controltype !== 'radio' && controltype !== 'checkbox') {
            return targetelement.val() == "true";
        }
        
        var checked = targetelement.is(':checked');
        if (checked != param.val) {
            return false;
        }

        return true;
    });

    $.validator.addMethod('regexif', function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }

        var checkmatch = function(p, v) {
            var match = new RegExp(p).exec(v);
            return (match && (match.index === 0) && (match[0].length === value.length));
        };

        var result = checkmatch(param.patternif, value);
        result = result ? checkmatch(param.pattern, value) : true;
        return result;
    });

    $.validator.addMethod('formatdate', function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }

        // restore default value for error message
        this.settings.messages[element.name].formatdate = param.errors.commonerror;

        var parseDate = function(value, selectors) {
            try {
                var daypart = value.match(selectors.day)[1];
                var monthpart = value.match(selectors.month)[1];
                var yearpart = value.match(selectors.year)[1];
                var dateobj = new Date(yearpart, monthpart - 1, daypart);
            } catch(e) {
                return null;
            }
            var dateinfo = {
                day: daypart,
                month: monthpart,
                year: yearpart,
                date: dateobj
            };
            if (!dateinfo.date || /Invalid|NaN/.test(dateinfo.date)) {
                return null;
            }
            return dateinfo;
        };

        // check format
        var dateinfo = parseDate(value, param.selectors);
        if (!dateinfo) return false;

        // check month
        if (dateinfo.month > 12 || dateinfo.month < 1) {
            this.settings.messages[element.name].formatdate = param.errors.montherror;
            return false;
        }

        // check day
        if (dateinfo.date.getDate() != dateinfo.day) {
            var monthes = ["январе", "феврале", "марте", "апреле", "мае", "июне", "июле", "августе", "сентябре", "октябре", "ноябре", "декабре"];
            var days = new Date(dateinfo.year, dateinfo.month, -1).getDate() + 1;
            this.settings.messages[element.name].formatdate = "В " + monthes[dateinfo.month - 1] + " " + days + decline(days, " день", " дней");
            return false;
        }

        // check date type
        if (param.range.type) {
            var today = parseDate(param.today, param.selectors);
            var checkResult = true;
            switch (param.range.type.value) {
            case param.datetypes.future:
                checkResult = dateinfo.date > today.date;
                break;
            case param.datetypes.past:
                checkResult = dateinfo.date < today.date;
                break;
            case param.datetypes.future | param.datetypes.today:
                checkResult = dateinfo.date >= today.date;
                break;
            case param.datetypes.past | param.datetypes.today:
                checkResult = dateinfo.date <= today.date;
                break;
            case param.datetypes.today:
                checkResult = dateinfo.date == today.date;
                break;
            default:
                throw "Неизвестный тип даты: " + param.range.type;
            }
            if (!checkResult) {
                this.settings.messages[element.name].formatdate = param.range.type.message;
                return false;
            }
        }

        // Check max value
        if (param.range.max) {
            var maxdateinfo = parseDate(param.range.max.value, param.selectors);
            if (maxdateinfo && dateinfo.date > maxdateinfo.date) {
                this.settings.messages[element.name].formatdate = param.range.max.message;
                return false;
            }
        }

        // Check min value
        if (param.range.min) {
            var mindateinfo = parseDate(param.range.min.value, param.selectors);
            if (mindateinfo && dateinfo.date < mindateinfo.date) {
                this.settings.messages[element.name].formatdate = param.range.min.message;
                return false;
            }
        }

        return true;
    });

    $.validator.addMethod('complexlength', function(value, element, param) {
        var allElementsIsOptional = this.optional(element);
        var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);

        if (param.dependentcontrols) {
            var validator = this;
            $.each(param.dependentcontrols.split(param.controlsdelimitter), function(index, value) {
                var dependentcontrol = $('#' + value);
                if (!dependentcontrol.length) {
                    dependentcontrol = $('.' + value);
                }
                allElementsIsOptional = allElementsIsOptional && validator.optional(dependentcontrol[0]);
                length += validator.getLength($.trim(validator.getControlValue(dependentcontrol)), dependentcontrol[0]);
            });
        }

        if (allElementsIsOptional) {
            return true;
        }

        var result = (length <= param.max && length >= param.min);
        return result;
    });

    $.validator.addMethod('custom', function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }

        var result = true;
        $.each(param.customvalidators, function() {
            var validationclass = $.validator.unobtrusive.customvalidators[this.classname];

            if (!validationclass) {
                return true;
            }

            var validationfunc = validationclass[this.funcname];
            if (!validationfunc) {
                return true;
            }

            result = validationfunc(value, element, this.context);
            if (!result) {
                param.lasterrormessage = this.errormessage;
            }
            return result;
        });

        return result;
    }, function(params, element) {
        return params.lasterrormessage;
    });
});
