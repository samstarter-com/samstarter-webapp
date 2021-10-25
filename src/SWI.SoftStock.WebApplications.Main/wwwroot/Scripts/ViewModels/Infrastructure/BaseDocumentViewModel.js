function BaseDocumentViewModel() {
    var self = new BaseViewModel();
    self.index = 0;
    self.id = ko.observable();

    self.onDownloadClick = function () {
        axios({
            url: self.downloadUrl(),
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', self.name());
            document.body.appendChild(link);
            link.click();
        });
    };

    return self;
};