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
                        // parse this list to contain only chamberTypes that are in the usage list as well.
                        // Also adding an all field to display whole usage report

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
                // list used to
                ctrl.inReportChamberTypeList = [];

                ChamberUsageReportService.getChamberUsageBetweenDates(reportParams)
                    .then(function success(res){
                        // repopulate drop down and update complete usage report
                        ctrl.usageReport = res.data;
                        // In this loop, for each usage entry:
                        // replace each chamberType_id in usage report entry with chamberType object
                        // Also push matched UsageEntry.chamberType to inReportChamberTypeList.
                        ctrl.usageReport.forEach(function(usageEntry){

                            for(var i=0;i<ctrl.chamberTypeList.length;i++){
                                var chamberTypeListEntry = ctrl.chamberTypeList[i];
                                if(usageEntry.chamber_type == chamberTypeListEntry._id){
                                    usageEntry.chamber_type = chamberTypeListEntry;
                                    break;
                                }
                            }

                            // check if usageEntry.chamber_type is already in the inReportChamberTypeList, if not push it
                            var isPresentInInReportChamberTypeList = false;
                            for(var i=0; i<ctrl.inReportChamberTypeList.length;i++){
                                if(usageEntry.chamber_type._id == ctrl.inReportChamberTypeList[i]._id){
                                    isPresentInInReportChamberTypeList=true;
                                    break;
                                }
                            }
                            // If ChamberEntry was not in inReportChamberTypeList, push it
                            if(!isPresentInInReportChamberTypeList){
                                ctrl.inReportChamberTypeList.push(usageEntry.chamber_type);
                            }
                        });

                        if(ctrl.usageReport.length==0){
                            Flash.create('success','No Chambers were in use during the selected period');

                            // set report visibility to false
                            ctrl.isReportVisible = false;
                        }else{
                            // set report visibility to true
                            ctrl.isReportVisible = true;

                            // add an All Entry in inReportChamberTypeList and Sort it as well.
                            var allChambersObject = {
                                _id: "",
                                chamber_type_name: " All Chambers"
                            }
                            ctrl.inReportChamberTypeList.push(allChambersObject);
                            ctrl.inReportChamberTypeList.sort(compareChamberTypeByName);

                        }

                    }, function failure(res){
                        Flash.create('danger', res.data);
                    });
            };

            ctrl.returnToSelectReportUsageDates = function(){
                // set report visibility to false
                ctrl.isReportVisible = false;
            };
            
            ctrl.printPage = function () {
                window.print();
            };

            // compare function to sort chamberType List
            function compareChamberTypeByName(a,b){
                if (a.chamber_type_name < b.chamber_type_name)
                    return -1;
                if (a.chamber_type_name > b.chamber_type_name)
                    return 1;
                return 0;
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