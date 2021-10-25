MenuViewModel = function () {
    var self = new BaseViewModel();
    var dialogs = {};

    self.submitted = false;
    self.useAjaxFormHandler = false;
    self.selectedItem = ko.observable(); // ViewModel
    self.isItemSelected = ko.computed(function() {
        return (typeof self.selectedItem() != 'undefined') && (self.selectedItem() != null);
    });

    var loadAndShowDialog = function (id, link, url, onOpenDialog) {
        // Save an empty jQuery in our cache for now.
        dialogs[id] = $();
        $.get(url)
            .done(function (content) {
		        if (content.success === false) {
			        var items = $.map(content.errors, function(error) {
				        return error + ';';
			        }).join('');
			        alert(items);
		        } else {
			        dialogs[id] = $('<div class="modal-popup">' + content + '</div>')
				        .hide() // Hide the dialog for now so we prevent flicker
				        .appendTo('body')
				        .filter('div') // Filter for the div tag only, script tags could surface
				        .dialog({
// Create the jQuery UI dialog
					        title: link.data('dialog-title'),
					        modal: true,
					        resizable: true,
					        draggable: true,
					        width: link.data('dialog-width') || 600,
					        open: onOpenDialog(),
					        beforeClose: function() {
						        resetForm($(this).find('form'));
					        }
				        })
				        //.find('form') // Attach logic on forms
				        //.submit(self.useAjaxFormHandler ? ajaxFormSubmitHandler : formSubmitHandler)
				        .end();
		        }
	        });
    };
    self.showDialog = function (id, link, url, onOpenDialog) {
        if (!dialogs[id]) {
            loadAndShowDialog(id, link, url, onOpenDialog);
        } else {
            dialogs[id].dialog('open');
            onOpenDialog();
        };
    };
    self.closeDialog = function (id) {
        dialogs[id].dialog('close');
    };

    self.displayErrors = function (form, errors) {
        var errorSummary = getValidationSummaryErrors(form)
            .removeClass('validation-summary-valid')
            .addClass('validation-summary-errors');

        var items = $.map(errors, function (error) {
            return '<li>' + error + '</li>';
        }).join('');

        var ul = errorSummary
            .find('ul')
            .empty()
            .append(items);
    };

    var getValidationSummaryErrors = function ($form) {
        // We verify if we created it beforehand
        var errorSummary = $form.find('.validation-summary-errors, .validation-summary-valid');
        if (!errorSummary.length) {
            errorSummary = $('<div class="validation-summary-errors"><span>Please correct the errors and try again.</span><ul></ul></div>')
                .prependTo($form);
        }

        return errorSummary;
    };

    var resetForm = function ($form) {
        // We reset the form so we make sure unobtrusive errors get cleared out.
        $form[0].reset();

        getValidationSummaryErrors($form)
            .removeClass('validation-summary-errors')
            .addClass('validation-summary-valid');
    };
    return self;
};