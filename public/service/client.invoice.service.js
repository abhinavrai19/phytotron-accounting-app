'use strict';

angular.module('phytotronAccountingApp')
    .factory('InvoiceService', ['$http', function($http){
        return {
            // Get List of Projects for Invoicing
            getInvoiceProjectsList: function(invoicePeriodStartDate, invoicePeriodEndDate){
                return $http.get('/invoice/projects/'+invoicePeriodStartDate+'/'+invoicePeriodEndDate);
            },

            // Invoice Projects
            invoiceProjects: function(startDate,endDate,projectIds){
                var reqBody = {
                    invoicePeriodStartDate: startDate,
                    invoicePeriodEndDate: endDate,
                    projectIds: projectIds
                };
                return $http.post('/invoice/projects',reqBody);
            },
            // Get Invoice History/List
            getInvoiceList: function(invoiceHistoryStartDate, invoiceHistoryEndDate){
                return $http.get(/invoices/+invoiceHistoryStartDate+'/'+invoiceHistoryEndDate);
            }
        };
    }]);