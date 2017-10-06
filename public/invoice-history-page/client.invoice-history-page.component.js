angular.module('phytotronAccountingApp')
    .component('invoiceHistoryPage',{
        templateUrl: 'invoice-history-page/client.invoice-history-page.template.html',
        controller: function InvoiceHistoryPageController(InvoiceService,
                                                          ProjectService,
                                                          Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'generation_date',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.invoiceHistoryStartDate='';
                ctrl.invoiceHistoryEndDate = new Date();
                ctrl.invoiceList = '';

                ctrl.selectedInvoices = [];
                ctrl.selectedInvoice = {};
                ctrl.selectedInvoiceProject = {};

                // variable to show or hide between invoiceList and selected invoice Details.
                ctrl.isVisibleInvoiceDetails = false;
            };

            // get List of Invoices between a given period
            ctrl.getInvoiceList = function(){
                InvoiceService.getInvoiceList(ctrl.invoiceHistoryStartDate,ctrl.invoiceHistoryEndDate)
                    .then(function success(res){
                        ctrl.invoiceList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // function to show detailed info of the selected invoice.
            // function gets project and client details of the selected invoice and displays the details.
            ctrl.showInvoiceDetails = function(){
                ctrl.selectedInvoice = ctrl.selectedInvoices[0];
                var projectId = ctrl.selectedInvoice.project_id;
                ProjectService.getProjectById(projectId)
                    .then(function success(res){
                        ctrl.selectedInvoiceProject = res.data;
                        ctrl.isVisibleInvoiceDetails = true;
                    },function failure(res){
                        Flash.create('danger',res.data);
                        ctrl.isVisibleInvoiceDetails = false;
                    });
            };

            ctrl.hideInvoiceDetails = function(){
                ctrl.isVisibleInvoiceDetails = false;
            };
        }
    });