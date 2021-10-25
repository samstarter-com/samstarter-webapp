function ValidationBehaviorCustomizer(params) {
    "use strict";

    params = params || {};

    var defaultParams = {
        selectors: {
            row: '.row',
            field: '.fieldtext',
            errorcontainer: '[data-valmsg-for]'
        },
        atrnames: {
            msgfor: "data-valmsg-for",
            hidevalidation: "hideValidation"
        },
        classes: {
            novalidate: 'novalidate'
        }
    };

    init();

    return {
        customize: customize
    };

    function init() {
        params = $.extend({}, defaultParams, params);
    }

    function customize(selector) {

        var context = $(selector);

        var forms = context
                .parents("form")
                .addBack()
                .add(context.find("form"))
                .filter("form");

        forms.each(function () {

            var validator = $(this).validate();

            var validationBehavior = new ValidationBehavior(
                $.extend({ context: context, validator: validator }, params)
            );

            validationBehavior.init();

        });
    }

    function ValidationBehavior(params) {

        var validatorOptions = {
            ignore: ":not(:visible)",
            onfocusin: onfocusin,
            onfocusout: onfocusout,
            onkeyup: onkeyup,
            showErrors: showErrorsHandler
        };

        function init() {

            $.extend(params.validator.settings, validatorOptions);

            $('input, select, textarea', params.context).on("change", onchange);

            $(params.validator.currentForm).on("invalid-form.validate", onErrors);
        }

        return {
            init: init
        };

        // this - validator
        function showErrorsHandler(errorMap, errorList) {
            
           
            var i, elements;

           
            var elementsToHide = $([]);

            for (i = 0; errorList[i]; i++) {
                var error = errorList[i];
                if (!needShowError(error.element)) {
                    continue;
                }

                if (this.settings.highlight) {
                    this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                }
                this.showLabel(error.element, error.message);

              
                var element = $(error.element);
                if (isElementInGroup(element)) {
                    var row = element.closest(params.selectors.row);
                    var errorContainer = getErrorContainerFor(element, row);
                    var validator = this;
                  
                    getElementsInGroup(getElementGroup(element), row).not(element).each(function () {
                      
                        if (validator.settings.unhighlight) {
                            validator.settings.unhighlight.call(validator, this,
                                    validator.settings.errorClass, validator.settings.validClass);
                        }

                       
                        var container = getErrorContainerFor(this, row);
                       
                        if (!errorContainer.is(container)) {
                           
                            elementsToHide = elementsToHide.add(container.children());
                        }
                    });
                }
            }
            if (this.errorList.length) {
                this.toShow = this.toShow.add(this.containers);
            }
            if (this.settings.success) {
                for (i = 0; this.successList[i]; i++) {
                    this.showLabel(this.successList[i]);
                }
            }

            if (this.settings.unhighlight) {
                for (i = 0, elements = this.validElements(); elements[i]; i++) {
                    this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                }
            }

            this.toHide = this.toHide.not(this.toShow);
            this.hideErrors();
            this.addWrapper(this.toShow).show();

           
            this.addWrapper(elementsToHide).hide();
        }

        // this - validator
        function onkeyup(element, event) {

            if (!needValidation(element)) {
                return;
            }

            element = $(element);

            var e = window.event || event;
            var keyUnicode = event.charCode || event.keyCode;

            if (e && keyUnicode) {
                switch (keyUnicode) {
                    case 9: return; // Tab
                    case 16: return; // Shift
                    case 17: return; // Ctrl
                    case 18: return; // Alt
                    case 27: return; // Esc: clear entry
                    case 35: return; // End
                    case 36: return; // Home
                    case 37: if (!element.is("select")) { return; } else { break; } // cursor left
                    case 38: if (!element.is("select")) { return; } else { break; } // cursor up
                    case 39: if (!element.is("select")) { return; } else { break; } // cursor right
                    case 40: if (!element.is("select")) { return; } else { break; } // cursor down
                    default: break;
                }
            }

            doValidation(element, getValidationElementWithGroup(element));
        }

        // this - validator
        function onfocusin(element, event) {

            if (!needValidation(element)) {
                return;
            }

            var element = $(element);
            var validationElement = getValidationElementWithGroup(element);

          
            if (isInvalid(element) || isInvalid(validationElement)) {
                doValidation(element, validationElement);
            }
        }

        // this - validator
        function onfocusout(element, event) {

            var element = $(element);

            setTimeout(function () {
                if (!isFocusOuted(element)) {
                    if (element.val()) {
                        setFocusOuted(element);
                    } else {
                        return;
                    }
                }

                if (!needValidation(element)) {
                    return;
                }

                doValidation(element, getValidationElementWithGroup(element));

            }, 0);
        }

        // this - element
        function onchange(event) {

            var element = $(this);

        
            if (params.validator.checkable(this) && !isFocusOuted(element)) {
              
                if (isElementInGroup(element)) {
                   
                    getElementsInGroup(getElementGroup(element), element.closest(params.selectors.row)).each(function () {
                        setFocusOuted($(this));
                    });
                } else {
                    setFocusOuted(element);
                }
            }

            if (!needValidation(element)) {
                return;
            }

            doValidation(element, getValidationElementWithGroup(element));
        }

        function doValidation(element, dependentElement) {
            dependentElement.each(function () { params.validator.element(this); });
            if (!dependentElement.is(element)) {
                params.validator.element(element);
            }
        }

        function onErrors(event, validator) {
            $("input:visible, select:visible, textarea:visible", $(event.target)).each(function () { setFocusOuted(this); });
        }

        function needShowError(element) {

            if (!needValidation(element)) {
                return false;
            }

            element = $(element);

            if (element.attr(params.atrnames.hidevalidation)) {
                return false;
            }

            return true;
        }

        function isInvalid(element) {
            return $(element).parent().addBack().hasClass(params.validator.settings.errorClass);
        }

        function needValidation(element) {
            element = $(element);

           
            if (element.is('.' + params.classes.novalidate)) {
                return false;
            }

            if (!isFocusOuted(element)) {
                return false;
            }
           
            if (isElementInGroup(element)) {
              
                var vgroups = getElementsInGroup(getElementGroup(element), element.closest(params.selectors.row));
              
                for (var i = 0; i < vgroups.length; i++) {
                    if (!isFocusOuted(vgroups[i])) {
                        return false;
                    }
                }
            }
            return true;
        }

       

        function isFocusOuted(element) {
            return Boolean($(element).attr("focusOuted"));
        }

        function setFocusOuted(element) {
            $(element).attr("focusOuted", "1");
        }

        function getElementGroup(element) {
            return $(element).attr("vgroup") ? $(element).attr("vgroup") : $(element).parent().attr("vgroup");
        }

        function getElementsInGroup(group, context) {
            return $("[vgroup=" + group + "]", context).children().addBack().filter("input, select, textarea");
        }

        function isElementInGroup(element, group) {
            if (!group) {
                return Boolean(getElementGroup(element));
            }
            return (getElementGroup(element) == group);
        }

        function getValidationElementWithGroup(element) {
            var validationElement = getValidationElement(element);
            if (isElementInGroup(element)) {
                getElementsInGroup(getElementGroup(element), element.closest(params.selectors.row)).each(function () {
                    validationElement = validationElement.add(getValidationElement($(this)));
                });
            }
            return validationElement;
        }

        function getValidationElement(element) {
            if (element.attr("validationElement")) {
                return $(element.attr("validationElement"));
            }
            else if (element.parent().attr("validationElement")) {
                return $(element.parent().attr("validationElement"));
            }
            return $();
        }

        function getErrorContainerFor(element, context) {
            var container = $(params.selectors.errorcontainer, context).filter("[" + params.atrnames.msgfor + "='" + $(element).attr('name') + "']");
            return container;
        }
    }
}