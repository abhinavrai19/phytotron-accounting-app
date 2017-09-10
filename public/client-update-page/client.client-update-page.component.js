'use strict';
angular.module('phytotronAccountingApp')
    .component('clientUpdatePage',{
        templateUrl: 'client-update-page/client.client-update-page.template.html',
        controller: function ClientUpdatePageController($routeParams,ClientService, DepartmentService,Flash){
            var ctrl = this;

            // Array to populate client status
            ctrl.clientStatusList = ['ACTIVE', 'INACTIVE'];

            ctrl.$onInit = function(){
                ctrl.getClientById();
                ctrl.getClientDepartmentList();
            }

            ctrl.getClientById = function () {
                //Get current client details
                ClientService.getClientById($routeParams.id)
                    .then(function success(res){
                        ctrl.client = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            // Get Department List for add new client
            ctrl.getClientDepartmentList = function(){
                DepartmentService.getDepartmentList()
                    .then(function success(res){
                        ctrl.clientDepartmentList = res.data;
                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            // To prep data fields to empty to fill data for new entries
            ctrl.reinitializeClient = function(){
                ctrl.client = {
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

            ctrl.updateClient = function(){
                ClientService.updateClient(ctrl.client)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }

            // Add and Remove account numbers to newClient
            ctrl.addAccount = function () {
                ctrl.client.account_numbers.push(ctrl.accountNumber);
                ctrl.accountNumber = "";
            };

            ctrl.removeAccount = function(index){
                ctrl.client.account_numbers.splice(index,1);
            };
        }
    });