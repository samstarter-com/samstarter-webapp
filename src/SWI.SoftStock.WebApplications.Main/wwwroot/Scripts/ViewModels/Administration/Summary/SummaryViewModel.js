function SummaryViewModel(url, menu) {

    var self = new DetailViewModel();
    self.menu(menu);
    self.TemplateUrl = url;

    self.loadFromServer = async function () {
        return await axios.get(`${self.baseApiAddress}${ADMINISTRATION_SUMMARY_ENDPOINT}`);
    };

    self.mapData = function (response) {
        ko.mapping.fromJS(response.data.details, self.mapping, self);
    };

    return self;
}