angular.module('phytotronAccountingApp')
    .component('chamberUsagePage',{
        templateUrl: 'chamber-usage-page/client.chamber-usage-page.template.html',
        controller: function ChamberUsagePageController(
            ChamberUsageReportService,
            Flash
        ){
            var ctrl = this;

            // inputs
            ctrl.usageStartDate = '';
            ctrl.usageEndDate = '';
            ctrl.selectedChamber='';

            // outputs
            ctrl.completeUsageReport = null;
            ctrl.partialUsageReport = null;
            ctrl.chamberDropDownList=[];

            ctrl.getChamberUsageBetweenDates = function () {
                var reportParams = {
                    usageStartDate: ctrl.usageStartDate,
                    usageEndDate: ctrl.usageEndDate
                };
                ChamberUsageReportService.getChamberUsageBetweenDates(reportParams)
                    .then(function success(res){
                        //console.log(res.data);
                        ctrl.completeUsageReport = ctrl.parseChamberUsageBetweenDateReport(res.data);
                        //console.log(ctrl.completeUsageReport);
                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            // Parse data from server from project based to chamber based.
            ctrl.parseChamberUsageBetweenDateReport = function (data) {

                // array to hold parsed data
                var report = [];

                // for each project entry
                data.forEach(function(runningProject){
                    var currentProjectId = runningProject.project_id;
                    // for each chamber entry in current project
                    runningProject.chambers.forEach(function(currentChamberUsage){

                        var chamberName = currentChamberUsage.chamber.chamber_name;
                        var allocationDate = currentChamberUsage.chamber_allocation_date;
                        var deallocationDate = currentChamberUsage.chamber_deallocation_date;
                        var cartsUsed = currentChamberUsage.carts_allocated;

                        var usageEntry = {
                            chamber_name: chamberName,
                            project_id: currentProjectId,
                            start_date: allocationDate,
                            end_date: deallocationDate,
                            carts: cartsUsed
                        };
                        report.push(usageEntry);

                        // Also update chamberDropDownList
                        var chamberInDropDownList = false;
                        for(var i=0;i<ctrl.chamberDropDownList.length;i++){
                            if(ctrl.chamberDropDownList[i]==chamberName){
                                chamberInDropDownList = true;
                                break;
                            }
                        }
                        if(!chamberInDropDownList){
                            ctrl.chamberDropDownList.push(chamberName);
                        }
                    });
                });
                return report;
            };
            
            ctrl.drawChamberUsageChart = function () {
                ctrl.partialUsageReport=[];
                ctrl.completeUsageReport.forEach(function(reportEntry){
                    if(reportEntry.chamber_name==ctrl.selectedChamber){
                        ctrl.partialUsageReport.push(reportEntry);
                    }
                });
            };
        }
    });