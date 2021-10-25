function PagingViewModel() {
    var self = this;
       
    self.recordsPerPage = 10;  

    self.totalRecordsCount = ko.observable(0);
    self.displayPageIndex = ko.observable(1);
    self.pageIndex = ko.observable(0);

    self.displayPageIndex.subscribe(function (newValue) {
        var ri = parseInt(self.displayPageIndex());
        if (isNaN(ri)) {
            self.displayPageIndex(self.pageIndex() + 1);
            return;
        }
        if (self.pageIndex() == ri - 1) {
            return;
        }
        if (ri > 0 && ri <= self.totalPagesCount()) {
            self.pageIndex(ri - 1);
            self.onChanging(self.urlParamsArray());
            return;
        }
        self.displayPageIndex(self.pageIndex() + 1);
        return;
    });
    
    self.totalPagesCount = ko.computed(function () {
        return Math.ceil(self.totalRecordsCount() / self.recordsPerPage);
    });
    self.next = function () {
        self.flipPage(self.pageIndex() + 1);
    };
    self.back = function () {
        self.flipPage(self.pageIndex() - 1);
    };
    
    self.clear = function () {
        self.totalRecordsCount(0);
        self.displayPageIndex(1);
        self.pageIndex(0);        
    };

    self.urlParamsArray = function () {
        return { 'pageIndex': self.pageIndex(), 'pageSize': self.recordsPerPage };
    };
    self.urlParams = function () {
        var params = self.urlParamsArray();
        var keysbyindex = Object.keys(params);
        var url='';
        for (var key in params) {
            if (key != keysbyindex[0]) {
                url = url + '&';
            }
            url = url + key + '=' + params[key];
        }
        return url;
    };
    
    self.flipPage = function (newPageNo) {
        if (parseInt(newPageNo) >= 0 && parseInt(newPageNo) < self.totalPagesCount()) {
            self.pageIndex(newPageNo);
            self.onChanging(self.urlParamsArray());
            self.displayPageIndex(newPageNo+1);
        }
    };

    self.setPaging = function (data) {
        self.recordsPerPage = data.pageSize;
        self.pageIndex(data.pageIndex);
        self.displayPageIndex(self.pageIndex() + 1);
        self.totalRecordsCount(data.totalRecords);
    };

    self.initialize = function () {
        var urlParams = new URLSearchParams(window.location.search);
        var pageSize = urlParams.get('pageSize') || "";
        pageSize = pageSize === "" ? 10 : pageSize;
        self.recordsPerPage = pageSize;

        var pageIndex = urlParams.get('pageIndex') || "";
        pageIndex = pageIndex === "" ? 0 : pageIndex;
        self.pageIndex(pageIndex);
    };
    
    return self;
};