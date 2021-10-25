function ListViewModel() {
    var self = new BaseViewModel();
    self._name = "list";
    self.items = ko.observableArray(); // array of viewmodels
    self.selectedItem = ko.observable();
    self.isItemSelected = ko.computed(function () {
        return (typeof self.selectedItem() != "undefined") && (self.selectedItem() != null);
    });
    self.selectedItemId = ko.computed(function () {
        if (self.isItemSelected()) {
            return self.selectedItem().id();
        } else {
            return null;
        }
    });

    self.onItemSelected = function (newValue) {
        return;
    };

    self.selectedItem.subscribe(function (newValue) {
        self.onItemSelected(newValue);
        return;
    });

    self.selectedItemUrl = ko.computed(function () {
        if (self.isItemSelected()) {
            return self.selectedItem().url();
        } else {
            return "";
        }
    });

    self.applyBindingsById = function (id) {
        ko.applyBindings(self, document.getElementById(id));
    };

    self.onTableHeaderClick = function () {
        var clicked = $(event.target);

        if (self.sortedColumnId === clicked[0].id) {
            self.order = self.order === "asc" ? "desc" : "asc";
        } else {
            self.sortedColumnId = clicked[0].id;
            self.order = "asc";
        }
        self.showSorting($(event.target));

        var sortedProperty = $.grep(self.sortData, function (n) {
            return n.sortName === self.sortedColumnId;
        })[0];
        self.sortedProperty = sortedProperty.propertyName;
        self.changeUrl({ 'sort': self.sortedProperty, 'order': self.order });

        self.loadFromServer().then(resp => self.mapData(resp)).catch(function (error) {
            console.log(error);
        });

    };

    self.showSorting = function () {
        $('.sortable').removeClass("asc");
        $('.sortable').removeClass("desc");
        $(`#${self.sortedColumnId}`).addClass(self.order);
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
        window.history.pushState(addparams, "machine", changedHref);
    };

    self.mapSortingfromJS = function (result) {
        self.sortData = result.sortData;
        self.order = result.order;
        self.sortedProperty = result.sortedProperty;
        self.sortedColumnId = result.sortedTableHeader;
        self.showSorting();
    };

    self.appliedSortStyle = false;
    self.applySortStyle = function () {
        if (self.appliedSortStyle)
            return;
        if (self.sortData !== "") {
            self.sortData.forEach(function (element) {
                $('#list').find('#' + element.sortName).addClass('sortable');
                $('#list').find('#' + element.sortName).attr('data-bind', 'click: onTableHeaderClick');
            });
            self.appliedSortStyle = true;
        }
    };

    self.loadFromServer = async function () {
        self.errors.removeAll();
        var url = self.getUrl();
        var result = await axios.get(url);
        return result;
    };

    self.mapData = function(response) {
        self.mapfromJS(response.data);
        self.applySortStyle();
        self.mapSortingfromJS(response.data);
    };

    self.onChanging = function (add, remove) {
    };

    self.paging = new PagingViewModel();
    self.paging.onChanging = function (params) {
        self.loadFromServer()
            .then(function (resp) {
                    self.mapData(resp);
                }
            ).catch(function (error) {
                console.log(error);
            });
        self.onChanging(params, []);
    };
    self.sortedColumnId = "";
    self.sortedProperty = "";
    self.order = "desc";
    self.sortData = "";
    self.urlSortParams = function () {
        return `sort=${self.sortedProperty}&order=${self.order}`;
    };

    self.initializeSortParameters = function () {
        var urlParams = new URLSearchParams(window.location.search);
        self.sortedProperty = urlParams.get("sort") || "";
        self.order = urlParams.get("order") || "";
    };

    self.reporting = new ReportingViewModel();
    self.reporting.onExportClick = function () {
        var reportUrl = self.getReportUrl();
        axios({
            url: reportUrl,
            method: "GET",
            responseType: "blob"
        }).then((response) => {
            var blob = new Blob([response.data], { type: response.data.type });
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "report.csv");
            document.body.appendChild(link);
            link.click();
        });
    };

    self.mapfromJS = function (result) {
        self.items.removeAll();
        self.selectedItem(null);
        self.paging.setPaging(result);
        self.aftermapfromJS(result);
    }

    self.afterApplyBindings = function () { };
    self.aftermapfromJS = function (result) { };

    self.init = function (externalParams) {
        self.initializeSortParameters();
        self.paging.initialize();
        self.setCustomProperties(externalParams);
    };

    self.setCustomProperties = function (externalParams) {
    }

    return self;
};