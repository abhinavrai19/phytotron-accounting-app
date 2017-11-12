angular.module('phytotronAccountingApp')
    .component('chamberUsagePage',{
        templateUrl: 'chamber-usage-page/client.chamber-usage-page.template.html',
        controller: function ChamberUsagePageController(
            ChamberUsageReportService,
            ChamberTypeService,
            Flash
        ){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'chamber_name',
                limit: 15,
                page: 1
            };

            ctrl.$onInit = function(){
                // To show of hide report
                ctrl.isReportVisible = false;

                // inputs
                ctrl.usageStartDate = '';
                ctrl.usageEndDate = '';

                // Chamber Types in port
                ctrl.inReportChamberTypeList = [];
                ctrl.getChamberTypeList();
            };

            // Fetch list of all chamber types
            ctrl.getChamberTypeList = function(){
                ChamberTypeService.getChamberTypeList()
                    .then(function success(res){
                        ctrl.chamberTypeList = res.data;
                    },function failure(res){
                        Flash.create('danger','Error fetching chamber types: '+res.data);

                    });
            };

            // Fetch usage report by chamber, between given dates
            ctrl.getChamberUsageBetweenDates = function () {
                var reportParams = {
                    usageStartDate: ctrl.usageStartDate,
                    usageEndDate: ctrl.usageEndDate
                };
                ctrl.inReportChamberTypeList = [];

                ChamberUsageReportService.getChamberUsageBetweenDates(reportParams)
                    .then(function success(res){
                        // repopulate drop down and update complete usage report
                        ctrl.usageReport = res.data;
                        if(ctrl.usageReport.length==0){
                            Flash.create('success','No Chambers were in use during the selected period');

                            // set report visibility to false
                            ctrl.isReportVisible = false;
                        }else{
                            // set report visibility to true
                            ctrl.isReportVisible = true;
                        }

                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            ctrl.returnToSelectReportUsageDates = function(){
                // set report visibility to false
                ctrl.isReportVisible = false;
            }

            /*

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
                // clear partial report
                ctrl.partialUsageReport=[];
                // Fill partial report with corresponding chamber data.
                ctrl.completeUsageReport.forEach(function(reportEntry){
                    if(reportEntry.chamber_name==ctrl.selectedChamber){
                        ctrl.partialUsageReport.push(reportEntry);
                    }
                });
            };
            */

        }
    });