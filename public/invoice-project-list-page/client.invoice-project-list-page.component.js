angular.module('phytotronAccountingApp')
    .component('invoiceProjectListPage',{
        templateUrl: 'invoice-project-list-page/client.invoice-project-list-page.template.html',
        controller: function InvoiceProjectListPageController(InvoiceService,
                                                              $location,
                                                              Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'project_id',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.invoicePeriodStartDate='';
                ctrl.invoicePeriodEndDate= new Date();

                ctrl.invoiceProjectList = [];
                ctrl.selectedProjectIds = [];
            };

            // get list of eligible projects for invoicing in a particular period.
            ctrl.getInvoiceProjectList = function(){
                InvoiceService.getInvoiceProjectsList(ctrl.invoicePeriodStartDate,ctrl.invoicePeriodEndDate)
                    .then(function success(res){
                        ctrl.invoiceProjectList = res.data;
                        console.log('getInvoiceProjectList');
                        console.log(res.data);
                        Flash.create('success', ctrl.invoiceProjectList.length + ' projects available for invoicing for selected criteria.');
                    },function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            // Invoice a list of selected projects.
            ctrl.invoiceProjects = function(){
                InvoiceService.invoiceProjects(ctrl.invoicePeriodStartDate,ctrl.invoicePeriodEndDate,ctrl.selectedProjectIds)
                    .then(function success(res){
                        var responseData = res.data;
                        console.log(responseData);
                        // Display success message
                        if(responseData.projects_invoice_success.length>0){
                            var successMessage = 'Invoicing successful for: ';
                            responseData.projects_invoice_success.forEach(function(successProjectId){
                                successMessage = successMessage + successProjectId + ' \n';
                            });
                            Flash.create('success',successMessage);
                        }

                        // Display failure message
                        if(responseData.projects_invoice_failure.length>0){
                            var failureMessage = 'Invoicing failure for: ';
                            responseData.projects_invoice_failure.forEach(function(failureProjectId){
                                failureMessage = failureMessage + failureProjectId + ' \n';
                            });
                            responseData.error_list.forEach(function(error){
                                failureMessage = failureMessage + error + ' \n';
                            });
                            Flash.create('danger',failureMessage);
                        }

                        $location.path( '/home' );
                    }, function failure(res){
                        // The server side has no error handling. Hence a custom error message here.
                        Flash.create('danger', 'ERROR in Invoicing service'+ res.data);
                    });
            };

        }
    });