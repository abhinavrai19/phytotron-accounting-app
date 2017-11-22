angular.module('phytotronAccountingApp')
    .component('projectListPage',{
        templateUrl: 'project-list-page/client.project-list-page.template.html',
        controller: function ProjectListPageController(
            ProjectService,
            ClientService,
            RateService,
            ChamberService,
            CropService,
            ResourceService,
            moment,
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
                ctrl.searchChamber='';
                ctrl.searchCrop='';
                ctrl.searchResource='';
                ctrl.activeProjectList = [];

                ctrl.getProjectList();

                //Pre Fetching data to Start a new PROJECT
                ctrl.initializeNewProject();
                ctrl.getAvailableClients();
                ctrl.getAvailableChamberRates();
                ctrl.getAvailableChambers();
                ctrl.getAvailableCrops();
                ctrl.getAvailableResources();

            };

            // Get Project List
            ctrl.getProjectList = function(){
                ProjectService.getProjectList()
                    .then(function success(res){
                        ctrl.projectList = res.data;
                        // format display dates in the table
                        ctrl.projectList.forEach(function(project){
                            project.project_start_date = moment(project.project_start_date);
                            project.project_end_date = moment(project.project_end_date);
                            if(project.last_invoice_date!=null){
                                project.last_invoice_date = moment(project.last_invoice_date);
                            }

                            // if project is active then push the project to running project list.
                            if(project.project_status == 'ACTIVE'){
                                ctrl.activeProjectList.push(project);
                            }

                            // push
                        });
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // -------- create new project------------
            ctrl.initializeNewProject = function(){

                ctrl.projectVerified = false;

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
                    project_status: "ACTIVE",
                    last_invoice_date: ""
                };

                // add chamber details
                ctrl.selectedChamber = null;
                ctrl.carts_allocated = "";
                ctrl.crop = "";
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

            ctrl.getAvailableCrops = function(){
                CropService.getCropList()
                    .then(function success(res){
                        ctrl.availableCrops = res.data;
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
                ctrl.newProject.clients.push(client);
                for(var i=0;i<ctrl.availableClients.length;i++){
                    if(ctrl.availableClients[i]._id==client._id){
                        ctrl.availableClients.splice(i,1);
                        return;
                    }
                }
            };

            ctrl.removeClientsFromProject = function(client){
                ctrl.availableClients.push(client);
                for(var i=0;i<ctrl.newProject.clients.length;i++){
                    if(ctrl.newProject.clients[i]._id==client._id){
                        ctrl.newProject.clients.splice(i,1);
                        return;
                    }
                }
            };

            // Add and remove chambers from project
            ctrl.addChamberToProject = function(){
                var chamber = {
                    chamber:                            ctrl.selectedChamber,
                    carts_allocated:                    ctrl.carts_allocated,
                    crop:                               ctrl.crop,
                    chamber_allocation_date:            moment(ctrl.chamber_allocation_date),
                    chamber_deallocation_date:          moment(ctrl.chamber_deallocation_date)
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
                    resource:                           ctrl.selectedResource,
                    unit_rate:                          ctrl.unit_rate,
                    units_consumed:                     ctrl.units_consumed,
                    resource_allocation_date:           moment(ctrl.resource_allocation_date),
                    resource_deallocation_date:         moment(ctrl.resource_deallocation_date),
                    resource_description:               ctrl.resource_description,
                    resource_comments:                  ctrl.resource_comments
                };

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

            ctrl.verifyProject = function(project){
                console.log(project);
                ctrl.projectVerified= true;
                if (project.project_id=="") {
                    ctrl.projectVerified= false;
                    Flash.create('danger','Project Id missing: Must have a unique id');
                }
                if (project.clients.length==0) {
                    ctrl.projectVerified=false;
                    Flash.create('danger','0 Clients: Project must have at least one client');
                }
                if (project.project_start_date==""){
                    ctrl.projectVerified=false;
                    Flash.create('danger','Project Start Date cannot be null');
                }
                if(project.chamber_rate==""){
                    ctrl.projectVerified=false;
                    Flash.create('danger','Project must have a chamber rate');
                }
            };
        }
    });