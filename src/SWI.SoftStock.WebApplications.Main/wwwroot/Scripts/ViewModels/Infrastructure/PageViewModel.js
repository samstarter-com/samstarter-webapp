function PageViewModel(contentElement) {
    var self = new BaseViewModel();
    self.contentElement = contentElement;
    self.filterVM = null;
    self.dataVM = null;
    self.menu = new MenuViewModel();
    self.onApplyFilter = function() {
    };
    self.changeUrl = function (addparams, removeparams) {
        var changedHref = window.location.href;
        var key;
        for (key in removeparams) {
            changedHref = removeParam(removeparams[key], changedHref);
        }
        for (key in addparams) {
            changedHref = setGetParameter(changedHref, key, addparams[key]);
        }
        window.history.pushState(addparams, 'machine', changedHref);
    };
    
    self.initializeAdditionalFilters = function () {
    };
    
    self.applyBindings = function () {
        if (self.dataVM._name === "list") {
            self.dataVM.applySortStyle();
            ko.applyBindings(self.dataVM, document.getElementById("list"));
        }
        if (self.dataVM._name === "details") {
            ko.applyBindings(self.dataVM, document.getElementById("details"));
        }
        self.afterApplyBindings();
    };

    self.afterApplyBindings = function() {};

    self.setDataVM = function (dVm) {
        self.dataVM = dVm;
        self.dataVM.onChanging = self.changeUrl;
        if (self.dataVM._name === "list") {
            self.dataVM.menu = self.menu;
            if (self.dataVM.menu != null) {
                self.dataVM.onItemSelected = function (newValue) {
                    self.dataVM.menu.selectedItem(newValue);
                };
            }
        }
        if (self.dataVM._name === "details") {
            self.menu.selectedItem(self.dataVM);
        }
    };

    self.templates = [];

    self.reload = async function() {
        let promise = Promise.all([self.getDataTemplate(), self.dataVM.loadFromServer().catch(function(err) {
            self.showError(err);
            self.dataVM.showError(err);
        })]);
        promise.then(
                function(resp) {
                    self.setDataTemplate(resp[0]);
                    return resp;
                })
            .then(function(resp) {
                    if (resp[1]) {
                        self.dataVM.mapData(resp[1]);
                    }
                    self.applyBindings();
                    self.afterReload();
                }
            ).catch(self.showError);
    };

    self.afterReload = function() {
        self.menu.selectedItem(self.dataVM);
    };

    self.getDataTemplate = async function () {
        if (typeof self.templates[self.dataVM.TemplateUrl] === "undefined") {
            return await axios.get(self.dataVM.TemplateUrl);
        } else
            return self.templates[self.dataVM.TemplateUrl];
    };

    self.setDataTemplate = function (resp) {
        if (typeof self.templates[self.dataVM.TemplateUrl] === "undefined") {
            self.templates[self.dataVM.TemplateUrl] = resp;
        }
        contentElement.innerHTML = resp.data;
    };

    return self;
};