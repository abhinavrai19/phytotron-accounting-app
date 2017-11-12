angular.module('phytotronAccountingApp')
    .component('invoiceProjectListPage',{
        templateUrl: 'invoice-project-list-page/client.invoice-project-list-page.template.html',
        controller: function InvoiceProjectListPageController(InvoiceService,
                                                              $location,
                                                              moment,
                                                              Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'missing_resources_sort',
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
                        ctrl.invoiceProjectList.forEach(function (project) {
                            // Add primary client as a filtering field for projects in list
                            project.primary_client = project.clients[0].first_name +' '+project.clients[0].last_name;


                            // Create Moment Object for returned Date fields
                            project.project_start_date = moment(project.project_start_date);
                            project.project_end_date = moment(project.project_end_date);
                            if(project.last_invoice_date!=null){
                                project.last_invoice_date = moment(project.last_invoice_date);
                            }

                            // Create Missing Resources field for the listed projects
                            if(project.requires_additional_resources==true && project.additional_resources.length==0){
                                project.missing_resources = true;
                                project.missing_resources_sort = "A"
                            }else{
                                project.missing_resources = false;
                                project.missing_resources_sort = "B"
                            }
                        });

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