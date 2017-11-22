angular.module('phytotronAccountingApp')
    .component('invoiceRevertProjectListPage',{
        templateUrl: 'invoice-revert-project-list-page/client.invoice-revert-project-list-page.template.html',
        controller: function InvoiceRevertProjectListPageController(InvoiceService,
                                                              $location,
                                                              moment,
                                                              Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'project_id',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.revertLastInvoiceProjectList = [];
                ctrl.selectedProjectIds = [];
                ctrl.getRevertLastInvoiceProjectList();
            };

            // get list of eligible projects for invoicing in a particular period.
            ctrl.getRevertLastInvoiceProjectList = function(){
                ctrl.selectedProjectIds = [];
                InvoiceService.getRevertLastInvoiceProjectList()
                    .then(function success(res){
                        ctrl.revertLastInvoiceProjectList = res.data;
                        ctrl.revertLastInvoiceProjectList.forEach(function (project) {
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

                        Flash.create('success', ctrl.revertLastInvoiceProjectList.length + ' projects available for which last invoice can be reverted.');
                    },function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            // Invoice a list of selected projects.
            ctrl.revertLastInvoice = function(){
                InvoiceService.revertLastInvoice(ctrl.selectedProjectIds)
                    .then(function success(res){
                        var responseData = res.data;
                        Flash.create('success', responseData);
                        $location.path( '/home' );
                    }, function failure(res){
                        // The server side has no error handling. Hence a custom error message here.
                        Flash.create('danger', 'ERROR in Revert Last Invoicing service'+ res.data);
                    });
            };

        }
    });