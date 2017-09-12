angular.module('phytotronAccountingApp')
    .component('clientListPage',{
        templateUrl: 'client-list-page/client.client-list-page.template.html',
        controller: function ClientListPageController(ClientService, DepartmentService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'first_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getClientList();
                ctrl.getClientDepartmentList();
                ctrl.initializeNewClient();

                // Array to populate client status
                ctrl.clientStatusList = ['ACTIVE', 'INACTIVE'];
            };

            // Get Client List
            ctrl.getClientList = function(){
                ClientService.getClientList()
                    .then(function success(res){
                        ctrl.clientList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // Get Department List for add new client
            ctrl.getClientDepartmentList = function(){
                DepartmentService.getDepartmentList()
                    .then(function success(res){
                        ctrl.clientDepartmentList = res.data;
                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            // To prep data fields to empty to fill data for new client
            ctrl.initializeNewClient = function(){
                ctrl.newClient = {
                    first_name: "",
                    last_name: "",
                    email: "",
                    contact_number: "",
                    address: "",
                    account_numbers: [],
                    department: "",
                    status: ""
                }
                ctrl.accountNumber = "";

            };

            // Save Client to database
            ctrl.addClient = function(){
                ClientService.createClient(ctrl.newClient)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getClientList();
                        ctrl.initializeNewClient();
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // Add and Remove account numbers to newClient
            ctrl.addAccount = function () {
                ctrl.newClient.account_numbers.push(ctrl.accountNumber);
                ctrl.accountNumber = "";
            };

            ctrl.removeAccount = function(index){
                ctrl.newClient.account_numbers.splice(index,1);
            };
        }
    });