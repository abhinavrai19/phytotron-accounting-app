var Project = require('../models/project');
var Invoice = require('../models/invoice');
var moment = require('moment');
var async = require('async');
//moment().format();

// get projects for invoicing
// INCOMPLETE -- implement date filtering properly
exports.getInvoiceProjectsList = function(req, res){
    var invoicePeriodStartDate = new Date(req.params.invoicePeriodStartDate);
    var invoicePeriodEndDate = new Date(req.params.invoicePeriodEndDate);

    Project.find({
        $and: [
            { project_start_date: { $lt: invoicePeriodEndDate} },
            { project_end_date: { $gt: invoicePeriodStartDate} },
            {
                $or: [
                    { last_invoice_date: { $eq: null} },
                    {
                        $and: [
                            { last_invoice_date: { $ne: null} },
                            { last_invoice_date: { $lt: invoicePeriodEndDate} }
                        ]
                    }
                ]
            }
        ]
    })
        //.where('project_start_date').lt(invoicePeriodEndDate)
        //.where('project_end_date').gt(invoicePeriodStartDate)
        .exec(function(err, projectList){
            if(err){
                res.status('500');
                res.send('Error fetching Project List for Invoicing'+err);
            }else{
                // If project has the last invoice date later than the given period end date, remove the project from the list

                for(var i=0;i<projectList.length;i++){
                    var project = projectList[i];

                    if(project.last_invoice_date != null){
                        var lastInvoiceDate = moment(project.last_invoice_date);
                        var projectEndDate = moment(project.project_end_date);
                        //console.log('Last Invoice Date'+lastInvoiceDate.toDate());
                        //console.log('Project End Date'+projectEndDate.toDate());
                        //console.log('is Same'+ lastInvoiceDate.isSameOrAfter(projectEndDate,'day'));
                        if(lastInvoiceDate.isSameOrAfter(projectEndDate, 'day')){
                            projectList.splice(i,1);
                        }
                    }
                }
                res.send(projectList);
            }
        });
};

// INCOMPLETE----------------------------
// Invoice projects provided as a list of project_ids. The default period is:
// Each projects last invoice date to current date/project end date, whichever is earlier.
exports.invoiceProjects = function(req, res){

    var projectsInvoicedSuccessfully = [];
    var projectsInvoiceFailed = [];
    var errorList =[];

    var projectIdList = req.body.projectIds;
    //var invoicePeriodStartDate = moment(req.body.invoicePeriodStartDate);
    var invoicePeriodEndDate = moment(req.body.invoicePeriodEndDate); // this is also the date that the project will be marked as invoiced on

    var invoiceAllProjectsIndividually = function(callback){
        // For each project Id in the request, generate an invoice and save to DB.
        projectIdList.forEach(function(project_id){
            Project.findOne({'project_id': project_id})
                .populate('clients')
                .populate('chamber_rate')
                .populate('chambers.chamber')
                .populate('chambers.crop')
                .populate('additional_resources.resource')
                .exec(function(err,project){
                    if(err){
                        projectsInvoiceFailed.push(project_id);
                        errorList.push(err+ ' Error fetching data for project: '+project_id);
                    }else{
                        console.log('calculating invoice for project: '+project.project_id);
                        // Calculate cost for the invoice.
                        // set the data in the invoice object.
                        // add invoice to the invoice table.
                        // update the fields in the project object
                        // save project to project table.

                        //var projectStartDate = new moment(project.project_start_date);

                        var projectEndDate = moment(project.project_end_date);
                        // if project was never invoiced before set the date to project start date.
                        if(project.last_invoice_date==null){
                            project.last_invoice_date = project.project_start_date;
                        }
                        var lastInvoiceDate = moment(project.last_invoice_date);

                        // initialize invoice Bill start and end dates
                        var invoiceBillStartDate = moment(project.last_invoice_date);
                        var invoiceBillEndDate;

                        if(projectEndDate.isBefore(invoicePeriodEndDate, 'day')){
                            invoiceBillEndDate = projectEndDate;
                        }else{
                            invoiceBillEndDate = invoicePeriodEndDate;
                        }

                        // initialize invoice id and the invoice object
                        var invoice_id = project.project_id+'_'+ moment().unix();
                        var invoice = {
                            invoice_id:                 invoice_id,
                            project_id:                 project.project_id,
                            generation_date:            invoiceBillEndDate.toDate(),
                            bill_start_date:            invoiceBillStartDate.toDate(),
                            bill_end_date:              invoiceBillEndDate.toDate(),
                            bill_amount:                0,                              // basic cost + additional cost
                            chamber_usage_cost:         [],                             // cost of chamber usage
                            additional_resource_cost:   [],                             // cost of additional resources
                            adjustments:                0,                              // misc cost
                            discounts:                  0,                              // discounts
                            total_amount:               0                               // bill amount + adjustments + discounts
                        };

                        var totalChamberUsageCost = 0;
                        var totalAdditionalResourceCost = 0;
                        var adjustments = 0;
                        var discounts = 0;
                        var billAmount = 0;
                        var totalAmount = 0;

                        // calculate each chamber cost and push an entry into chamber usage cost
                        project.chambers.forEach(function(chamberEntry){
                            // create a chamber usage cost object
                            var chamberUsageCostEntry = {
                                chamber_name: chamberEntry.chamber.chamber_name,
                                start_date: '',
                                end_date: '',
                                chamber_rate: project.chamber_rate.rate_value,
                                chamber_cost: 0
                            };

                            // declare chamber bill start and end date and initialize them based on below checks
                            var chamberBillStartDate;
                            var chamberBillEndDate;

                            var chamberAllocationDate = moment(chamberEntry.chamber_allocation_date);
                            var chamberDeallocationDate = moment(chamberEntry.chamber_deallocation_date);

                            // only calculate bill for this chamber if chamber is allocated before the invoiceBillEndDate
                            if(chamberAllocationDate.isBefore(invoiceBillEndDate)){

                                // set chamberBillStart date to maximum of chamberAllocationDate and invoiceBillStartDate
                                if(chamberAllocationDate.isAfter(invoiceBillStartDate,'day')){
                                    chamberBillStartDate = chamberAllocationDate;
                                }else{
                                    chamberBillStartDate = invoiceBillStartDate;
                                }

                                // Set chamberBillEndDate to minimum of chamberDeallocationDate and invoiceBillEndDate
                                if(chamberDeallocationDate.isBefore(invoiceBillEndDate,'day')){
                                    chamberBillEndDate = chamberDeallocationDate;
                                }else{
                                    chamberBillEndDate = invoiceBillEndDate;
                                }

                                // once the billing start and end dates for a chamber are found, find the duration between these.
                                // multiply with the chamber rates and get the cost for that particular chamber use.
                                var usageDays = chamberBillEndDate.diff(chamberBillStartDate, 'days');
                                var chamberCost = usageDays*chamberUsageCostEntry.chamber_rate;

                                // fill in the remaining values in the chamber usage cost object
                                chamberUsageCostEntry.start_date = chamberBillStartDate.toDate();
                                chamberUsageCostEntry.end_date = chamberBillEndDate.toDate();
                                chamberUsageCostEntry.chamber_cost = chamberCost;

                                // push the object in the invoice object and add the cost to totalChamberUsageCost
                                invoice.chamber_usage_cost.push(chamberUsageCostEntry);
                                totalChamberUsageCost = totalChamberUsageCost + chamberCost;

                            } // END OF if chamberAllocation is before invoiceBillEndDate
                        });

                        // calculate each additional resource cost and push an entry into additional resource cost
                        project.additional_resources.forEach(function(resourceEntry){
                            if(resourceEntry.resource_invoiced==false){
                                var resourceUsageCostEntry = {
                                    resource_name: resourceEntry.resource.resource_name,
                                    unit_rate: resourceEntry.unit_rate,
                                    units_consumed: resourceEntry.units_consumed,
                                    start_date: resourceEntry.resource_allocation_date,
                                    end_date: resourceEntry.resource_deallocation_date,
                                    description: resourceEntry.resource_description,
                                    comments: resourceEntry.resource_comments,
                                    resource_cost: 0
                                };
                                resourceUsageCostEntry.resource_cost = resourceUsageCostEntry.unit_rate * resourceUsageCostEntry.units_consumed;

                                // Push this entry into the invoice object and add the cost to totalAdditionalResourceCost
                                invoice.additional_resource_cost.push(resourceUsageCostEntry);
                                totalAdditionalResourceCost = totalAdditionalResourceCost + resourceUsageCostEntry.resource_cost;

                                // update resource_invoiced to true.
                                resourceEntry.resource_invoiced = true;
                            }
                        });

                        // find the bill Amount and total amount and set these into the invoice object
                        billAmount = totalChamberUsageCost + totalAdditionalResourceCost;
                        totalAmount = billAmount + adjustments - discounts;

                        invoice.bill_amount = billAmount;
                        invoice.total_amount = totalAmount;
                        console.log('invoice calculated for project: '+project.project_id);

                        // now that the invoice is prepared for this single project. Save that invoice into the DB.
                        var invoiceInstance = new Invoice(invoice);
                        invoiceInstance.save(function(err){
                            if(err){
                                // If save error, push the current project id to failed list and push into error list.
                                projectsInvoiceFailed.push(project.project_id);
                                errorList.push(err+ ' Error saving invoice for the project: '+project.project_id);
                            }else{
                                // ON SUCCESS push project id into success list and update the project as well with updated data.
                                projectsInvoicedSuccessfully.push(project.project_id);
                                console.log('projectsInvoicedSuccessfully: '+projectsInvoicedSuccessfully.length);

                                // save the corresponding project with the updated last invoice date as well.
                                project.last_invoice_date = invoiceBillEndDate.toDate();

                                console.log('Success List'+projectsInvoicedSuccessfully.length+' : uptil project: '+project.project_id);
                                console.log('Failure List'+projectsInvoiceFailed.length+' : uptil project: '+project.project_id);
                                project.save(function(err){
                                    if(err){
                                        console.log('ERROR: updating project with last_invoice_date');
                                    }else{
                                        console.log('SUCCESS: Project updated with last_invoice_date');
                                    }
                                }); // END OF project.save()
                            }
                        }); // END OF invoiceInstance save()
                    }
                }); // END OF Project.find().exec()
        }); // END OF projectIdList.forEach

        console.log('Success List: '+projectsInvoicedSuccessfully.length);
        console.log('Failure List: '+projectsInvoiceFailed.length);
        callback(null);
    };

    var sendResponse = function(err,result){
        console.log('Final callback, sending response');
        // once all the projects are invoiced.. send the success and error list in the response
        var responseBody = {
            projects_invoice_success: projectsInvoicedSuccessfully,
            projects_invoice_failure: projectsInvoiceFailed,
            error_list: errorList
        };
        res.send(responseBody);
    };

    async.series([invoiceAllProjectsIndividually],sendResponse);

};

// Find all invoices generated within given dates
exports.getInvoiceList = function (req, res) {
    var invoiceHistoryStartDate = new Date(req.params.invoiceHistoryStartDate);
    var invoiceHistoryEndDate = new Date(req.params.invoiceHistoryEndDate);
    Invoice.find()
        .where('generation_date').gt(invoiceHistoryStartDate)
        .where('generation_date').lt(invoiceHistoryEndDate)
        .exec(function(err, invoiceList){
            if(err){
                res.status(500);
                res.send('Error fetching invoice list: '+err);
            }else{
                res.send(invoiceList);
            }
        });
};