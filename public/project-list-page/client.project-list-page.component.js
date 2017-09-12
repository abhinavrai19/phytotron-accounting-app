angular.module('phytotronAccountingApp')
    .component('projectListPage',{
        templateUrl: 'project-list-page/client.project-list-page.template.html',
        controller: function ProjectListPageController(
            ProjectService,
            ClientService,
            RateService,
            ChamberService,
            ResourceService,
            Flash){

            var ctrl = this;

            // Start New Project
            // Project status
            ctrl.projectStatusList = ['ACTIVE','PAYMENT PENDING','COMPLETED'];

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'project_id',
                limit: 10,
                page: 1
            };

            // Parameters for clients available for project table pagination
            ctrl.clientTableQuery = {
                order: 'first_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getProjectList();

                //Pre Fetching data to Start a new PROJECT
                ctrl.initializeNewProject();
                ctrl.getAvailableClients();
                ctrl.getAvailableChamberRates();
                ctrl.getAvailableChambers();
                ctrl.getAvailableResources();
            };

            // Get Client List
            ctrl.getProjectList = function(){
                ProjectService.getProjectList()
                    .then(function success(res){
                        ctrl.projectList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // -------- create new project------------
            ctrl.initializeNewProject = function(){
                ctrl.newProject = {
                    project_id: "",
                    project_title: "",
                    project_start_date: "",
                    project_end_date: "",
                    clients: [],
                    chamber_rate: "",
                    chambers: [],
                    requires_additional_resources: false,
                    additional_resources: [],
                    project_status: "",
                    invoices: [],
                    last_invoice_date: "",
                    payments: []
                }

                // add client details [this list is used to put client ids into 'project clients' before final create is called]
                ctrl.addedClients =[];

                // add chamber details
                ctrl.selectedChamber = null;
                ctrl.carts_allocated = "";
                ctrl.chamber_allocation_date = "";
                ctrl.chamber_deallocation_date = "";

                // add resource details
                ctrl.selectedResource = null;
                ctrl.unit_rate = "";
                ctrl.units_consumed = "";
                ctrl.resource_allocation_date = "";
                ctrl.resource_deallocation_date = "";
                ctrl.resource_description = "";
                ctrl.resource_comments = "";
            };

            // Creating New Project after review
            ctrl.createNewProject = function(){
                // Prepare Client IDs for new project and then start
                ctrl.addedClients.forEach(function(client){
                    ctrl.newProject.clients.push(client._id);
                });
                ProjectService.createProject(ctrl.newProject)
                    .then(function success(res){
                        ctrl.$onInit();
                        Flash.create('success',res.data);
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // Functions to prefetch data for starting new project
            ctrl.getAvailableClients = function(){
                ClientService.getClientList()
                    .then(function success(res){
                        ctrl.availableClients = res.data;
                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            ctrl.getAvailableChamberRates = function (){
                RateService.getRateList()
                    .then(function success(res){
                        ctrl.availableChamberRates = res.data;
                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            ctrl.getAvailableChambers = function(){
                ChamberService.getChamberList()
                    .then(function success(res){
                        ctrl.availableChambers = res.data;
                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            ctrl.getAvailableResources = function () {
                ResourceService.getResourceList()
                    .then(function success(res){
                        ctrl.availableResources = res.data;
                    },function failure(res){
                        Flash.create('danger', res.data);
                });
            };

            // Add and remove clients from project
            ctrl.addClientsToProject = function(client){
                ctrl.addedClients.push(client);
                for(var i=0;i<ctrl.availableClients.length;i++){
                    if(ctrl.availableClients[i]._id==client._id){
                        ctrl.availableClients.splice(i,1);
                        return;
                    }
                }
            };

            ctrl.removeClientsFromProject = function(client){
                ctrl.availableClients.push(client);
                for(var i=0;i<ctrl.addedClients.length;i++){
                    if(ctrl.addedClients[i]._id==client._id){
                        ctrl.addedClients.splice(i,1);
                        return;
                    }
                }
            };

            // Add and remove chambers from project
            ctrl.addChamberToProject = function(){
                var chamber = {
                    chamber_id:                 ctrl.selectedChamber._id,
                    carts_allocated:            ctrl.carts_allocated,
                    chamber_allocation_date:    ctrl.chamber_allocation_date,
                    chamber_deallocation_date:  ctrl.chamber_deallocation_date,

                    display_chamber_name:       ctrl.selectedChamber.chamber_name
                };

                ctrl.newProject.chambers.push(chamber);
                ctrl.selectedChamber = null;
                ctrl.carts_allocated = "";
            };

            ctrl.removeChamberFromProject = function(index){
                ctrl.newProject.chambers.splice(index,1);
            }

            // Add and remove resources from project
            ctrl.addResourceToProject = function(){
                var resource = {
                    resource_id:                ctrl.selectedResource._id,
                    unit_rate:                  ctrl.unit_rate,
                    units_consumed:             ctrl.units_consumed,
                    resource_allocation_date:   ctrl.resource_allocation_date,
                    resource_deallocation_date: ctrl.resource_deallocation_date,
                    resource_description:       ctrl.resource_description,
                    resource_comments:          ctrl.resource_comments,

                    display_resource_name:      ctrl.selectedResource.resource_name
                }

                ctrl.newProject.additional_resources.push(resource);
                ctrl.selectedResource = null;
                ctrl.unit_rate = null;
                ctrl.units_consumed = null;
                ctrl.resource_description = null;
                ctrl.resource_comments = null;
            };

            ctrl.removeResourceFromProject = function(index) {
                ctrl.newProject.additional_resources.splice(index,1);
            };
        }
    });