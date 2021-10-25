function UsageMachineViewModel() {
    var self = new MachineViewModel();
    
    var dateformat = 'DD.MM.YYYY';
    self.mapping.from = {
        create: function(options) {
            return moment(options.data).format(dateformat);
        }
    };
    self.mapping.to = {
        create: function (options) {
            return moment(options.data).format(dateformat);
        }
    };
    return self;
}