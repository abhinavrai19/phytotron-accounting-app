angular.module('phytotronAccountingApp')
    .component('invoiceHistoryPage',{
        templateUrl: 'invoice-history-page/client.invoice-history-page.template.html',
        controller: function InvoiceHistoryPageController(InvoiceService,
                                                          ProjectService,
                                                          moment,
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
                        // format Dates in the invoice history page
                        ctrl.invoiceList.forEach(function(invoice){
                            invoice.generation_date = moment(invoice.generation_date).format('L');
                            invoice.bill_start_date = moment(invoice.bill_start_date).format('L');
                            invoice.bill_end_date = moment(invoice.bill_end_date).format('L');
                            /*
                            invoice.chamber_usage_cost.forEach(function(chamberUsageCost){
                                chamberUsageCost.start_date = moment(chamberUsageCost.start_date).format('L');
                                chamberUsageCost.end_date = moment(chamberUsageCost.end_date).format('L');
                            });
                            invoice.additional_resource_cost.forEach(function (additionalResourceCost) {
                                additionalResourceCost.start_date = moment(additionalResourceCost.start_date).format('L');
                                additionalResourceCost.end_date = moment(additionalResourceCost.end_date).format('L');
                            });
                            */
                        });
                        Flash.create('success',ctrl.invoiceList.length+ ' Invoice(s) found between selected dates.');
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            // Generate PDFs for selected Invoices
            ctrl.generateInvoicePDFs = function(){
                InvoiceService.generateInvoicePDFs(ctrl.selectedInvoices)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            // function to show detailed info of the selected invoice.
            // function gets project and client details of the selected invoice and displays the details.
            ctrl.showInvoiceDetails = function(){

                ctrl.selectedInvoice = ctrl.selectedInvoices[0];
                ctrl.isVisibleInvoiceDetails = true;

                /*
                var projectId = ctrl.selectedInvoice.project_id;
                ProjectService.getProjectById(projectId)
                    .then(function success(res){
                        ctrl.selectedInvoiceProject = res.data;
                        // parse dates in invoice details
                        ctrl.selectedInvoiceProject.project_start_date = moment(ctrl.selectedInvoiceProject.project_start_date).format('L');
                        ctrl.selectedInvoiceProject.project_end_date = moment(ctrl.selectedInvoiceProject.project_end_date).format('L');

                        ctrl.isVisibleInvoiceDetails = true;
                    },function failure(res){
                        Flash.create('danger',res.data);
                        ctrl.isVisibleInvoiceDetails = false;
                    });
                */
            };

            ctrl.hideInvoiceDetails = function(){
                ctrl.isVisibleInvoiceDetails = false;
            };
        }
    });