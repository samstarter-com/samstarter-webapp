function UserRoleViewModel() {
    var self = new DetailViewModel();
    self.mapped = false;
    self.structureUnitId = null;
    self.roleId = ko.observable();
    self.roleName = ko.observable();
    self.description = ko.observable();
    self.isInRole = ko.observable();
    self.changed = ko.observable(false);
    self.isInRole.subscribe(function (newIsInRole) {
        if (self.mapped) {
            self.changed(true);
        }
    });
    
    //self.roleData = ko.computed(
    //    function() {
    //        return 'RoleId=' + self.roleId() + '&StructureUnitId=' + self.structureUnitId + '&IsInRole=' + self.isInRole();
    //    }
    //);
        
    return self;
};

