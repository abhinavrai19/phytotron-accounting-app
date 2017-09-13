angular.module('phytotronAccountingApp')
    .component('projectUpdatePage',{
        templateUrl: 'project-update-page/client.project-update-page.template.html',
        controller: function ProjectListPageController(
            ProjectService,
            ClientService,
            RateService,
            ChamberService,
            ResourceService,
            $routeParams,
            $location,
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
                ctrl.getProjectById();

                //Pre Fetching data to Update PROJECT
                ctrl.initializePageVariables();
                ctrl.getAvailableClients();
                ctrl.getAvailableChamberRates();
                ctrl.getAvailableChambers();
                ctrl.getAvailableResources();
            };

            // Get Project By ID
            ctrl.getProjectById = function(){
                ProjectService.getProjectById($routeParams.id)
                    .then(function success(res){
                        ctrl.project = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // -------- create new project------------
            ctrl.initializePageVariables = function(){
                ctrl.projectVerified = false;

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

            // Update Project after review
            ctrl.updateProject = function(){
                console.log('Update Project controller: client side ');
                console.log(ctrl.project);
                ProjectService.updateProject(ctrl.project)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        $location.path( '/home' );
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

            // Function to remove already added clients from available clients
            ctrl.updateAvailableClients = function () {
                ctrl.project.clients.forEach(function(existingClient){
                    for(var i=0;i<ctrl.availableClients.length;i++){
                        if(ctrl.availableClients[i]._id==existingClient._id){
                            ctrl.availableClients.splice(i,1);
                        }
                    }
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
                ctrl.project.clients.push(client);
                for(var i=0;i<ctrl.availableClients.length;i++){
                    if(ctrl.availableClients[i]._id==client._id){
                        ctrl.availableClients.splice(i,1);
                        return;
                    }
                }
            };

            ctrl.removeClientsFromProject = function(client){
                ctrl.availableClients.push(client);
                for(var i=0;i<ctrl.project.clients.length;i++){
                    if(ctrl.project.clients[i]._id==client._id){
                        ctrl.project.clients.splice(i,1);
                        return;
                    }
                }
            };

            // Add and remove chambers from project
            ctrl.addChamberToProject = function(){
                var chamber = {
                    chamber:                    ctrl.selectedChamber,
                    carts_allocated:            ctrl.carts_allocated,
                    chamber_allocation_date:    ctrl.chamber_allocation_date,
                    chamber_deallocation_date:  ctrl.chamber_deallocation_date
                };

                ctrl.project.chambers.push(chamber);
                ctrl.selectedChamber = null;
                ctrl.carts_allocated = "";
            };

            ctrl.removeChamberFromProject = function(index){
                ctrl.project.chambers.splice(index,1);
            }

            // Add and remove resources from project
            ctrl.addResourceToProject = function(){
                var resource = {
                    resource:                   ctrl.selectedResource,
                    unit_rate:                  ctrl.unit_rate,
                    units_consumed:             ctrl.units_consumed,
                    resource_allocation_date:   ctrl.resource_allocation_date,
                    resource_deallocation_date: ctrl.resource_deallocation_date,
                    resource_description:       ctrl.resource_description,
                    resource_comments:          ctrl.resource_comments
                }

                ctrl.project.additional_resources.push(resource);
                ctrl.selectedResource = null;
                ctrl.unit_rate = null;
                ctrl.units_consumed = null;
                ctrl.resource_description = null;
                ctrl.resource_comments = null;
            };

            ctrl.removeResourceFromProject = function(index) {
                ctrl.project.additional_resources.splice(index,1);
            };

            ctrl.verifyProject = function(project){
                ctrl.projectVerified= true;
                if (project.project_id=="") {
                    ctrl.projectVerified= false;
                    Flash.create('danger','Project Id missing: Must have a unique id');
                }
                if (project.clients.length==0) {
                    ctrl.projectVerified=false;
                    Flash.create('danger','0 Clients: Project must have at least one client');
                }
            };
        }
    });