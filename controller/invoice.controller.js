var Project = require('../models/project');
var Invoice = require('../models/invoice');
var moment = require('moment');
var async = require('async');
var CONSTANTS = require('../constants');
var PrintUtility = require('./utility.generatePDF');
var MathUtility = require('./utility.mathematics');

//------------------------------------------------------------------------------

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
                // create an empty array of eligible projects and only put projects for which last invoice date is before given period end date.
                // If project has the last invoice date later than the given period end date, remove the project from the list
                var invoiceEligibleProjects = [];
                projectList.forEach(function(currentProject){
                    if(currentProject.last_invoice_date != null){
                        var lastInvoiceDate = moment(currentProject.last_invoice_date);
                        var projectEndDate = moment(currentProject.project_end_date);
                        if(lastInvoiceDate.isBefore(projectEndDate, 'day')){
                            invoiceEligibleProjects.push(currentProject);
                        }
                    }else{
                        invoiceEligibleProjects.push(currentProject);
                    }
                });
                res.send(invoiceEligibleProjects);
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
    var roundOffToDigits = CONSTANTS.ROUND_OFF_AMOUNT_TO_VALUE;

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
                        // Calculate cost for the invoice.
                        // set the data in the invoice object.
                        // add invoice to the invoice table.
                        // update the fields in the project object
                        // save project to project table.


                        var projectStartDate = moment(project.project_start_date);
                        var projectEndDate = moment(project.project_end_date);
                        // if project was never invoiced before set the date to project start date.
                        if(project.last_invoice_date==null){
                            project.last_invoice_date = project.project_start_date;
                        }
                        var lastInvoiceDate = moment(project.last_invoice_date);

                        // initialize invoice Bill start and end dates
                        var invoiceBillStartDate = lastInvoiceDate;
                        var invoiceBillEndDate;

                        if(projectEndDate.isBefore(invoicePeriodEndDate, 'day')){
                            invoiceBillEndDate = projectEndDate;
                        }else{
                            invoiceBillEndDate = invoicePeriodEndDate;
                        }

                        // initialize invoice id and the invoice object
                        var invoice_id = project.project_id+'_'+ moment().unix();
                        var invoice = {
                            phytotron_id:               CONSTANTS.PHYTOTRON_ID,
                            invoice_id:                 invoice_id,
                            project_id:                 project.project_id,
                            project_title:              project.project_title,
                            project_start_date:         projectStartDate.format('L'),
                            project_end_date:           projectEndDate.format('L'),
                            clients:                    [],
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

                        // Put Client details in the invoice
                        project.clients.forEach(function(clientEntry){
                            // create a client object to be pushed to client list in invoice
                            var client = {
                                first_name: clientEntry.first_name,
                                last_name: clientEntry.last_name,
                                department: clientEntry.department,
                                address: clientEntry.address
                            };
                            invoice.clients.push(client);
                        });

                        // Initialize the invoice amounts
                        var totalChamberUsageCost = 0;
                        var totalAdditionalResourceCost = 0;
                        var adjustments = 0;
                        var discounts = 0;
                        var billAmount;
                        var totalAmount;

                        // calculate each chamber cost and push an entry into chamber usage cost
                        project.chambers.forEach(function(chamberEntry){
                            // create a chamber usage cost object
                            var chamberUsageCostEntry = {
                                chamber_name: chamberEntry.chamber.chamber_name,
                                carts_allocated: chamberEntry.carts_allocated,
                                start_date: '',
                                end_date: '',
                                usage_days: 0,
                                chamber_rate: project.chamber_rate.rate_value,
                                chamber_cost: 0
                            };

                            // declare chamber bill start and end date and initialize them based on below checks
                            var chamberBillStartDate;
                            var chamberBillEndDate;

                            var chamberAllocationDate = moment(chamberEntry.chamber_allocation_date);
                            var chamberDeallocationDate = moment(chamberEntry.chamber_deallocation_date);

                            // ADDED CHANGE: 2nd check in If below(chamberDeallocationDate.isAfter())
                            // only calculate bill for this chamber if chamber is allocated before the invoiceBillEndDate
                            if(chamberAllocationDate.isBefore(invoiceBillEndDate) && chamberDeallocationDate.isAfter(invoiceBillStartDate)){

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
                                var chamberUsageDays = chamberBillEndDate.diff(chamberBillStartDate, 'days');

                                var chamberCost = chamberUsageDays* chamberUsageCostEntry.carts_allocated* chamberUsageCostEntry.chamber_rate;
                                // Round off chamberCost
                                chamberCost = MathUtility.roundNumberTo(chamberCost, roundOffToDigits);

                                // fill in the remaining values in the chamber usage cost object
                                chamberUsageCostEntry.start_date = chamberBillStartDate.format('L');
                                chamberUsageCostEntry.end_date = chamberBillEndDate.format('L');
                                chamberUsageCostEntry.usage_days = chamberUsageDays;
                                chamberUsageCostEntry.chamber_cost = chamberCost;

                                // push the object in the invoice object and add the cost to totalChamberUsageCost
                                invoice.chamber_usage_cost.push(chamberUsageCostEntry);
                                totalChamberUsageCost = totalChamberUsageCost + chamberCost;

                            } // END OF if chamberAllocation is before invoiceBillEndDate
                        });

                        // calculate each additional resource cost and push an entry into additional resource cost
                        project.additional_resources.forEach(function(resourceEntry){
                            if(resourceEntry.resource_invoiced==false){
                                var resourceAllocationDate = moment(resourceEntry.resource_allocation_date);
                                var resourceDeallocationDate = moment(resourceEntry.resource_deallocation_date);
                                var resourceUsageDays =resourceDeallocationDate.diff(resourceAllocationDate, 'days');

                                var resourceUsageCostEntry = {
                                    resource_name: resourceEntry.resource.resource_name,
                                    unit_rate: resourceEntry.unit_rate,
                                    units_consumed: resourceEntry.units_consumed,
                                    start_date: resourceAllocationDate.format('L'),
                                    end_date: resourceDeallocationDate.format('L'),
                                    usage_days: resourceUsageDays,
                                    description: resourceEntry.resource_description,
                                    comments: resourceEntry.resource_comments,
                                    resource_cost: 0
                                };
                                resourceUsageCostEntry.resource_cost = resourceUsageCostEntry.unit_rate * resourceUsageCostEntry.units_consumed;
                                // Round Resource Cost
                                resourceUsageCostEntry.resource_cost = MathUtility.roundNumberTo(resourceUsageCostEntry.resource_cost, roundOffToDigits);

                                // Push this entry into the invoice object and add the cost to totalAdditionalResourceCost
                                invoice.additional_resource_cost.push(resourceUsageCostEntry);
                                totalAdditionalResourceCost = totalAdditionalResourceCost + resourceUsageCostEntry.resource_cost;

                                // update resource_invoiced to true.
                                resourceEntry.resource_invoiced = true;
                            }
                        });

                        // find the bill Amount and total amount and set these into the invoice object
                        // Round off each of them
                        billAmount = totalChamberUsageCost + totalAdditionalResourceCost;
                        billAmount = MathUtility.roundNumberTo(billAmount, roundOffToDigits);

                        totalAmount = billAmount + adjustments - discounts;
                        totalAmount = MathUtility.roundNumberTo(totalAmount, roundOffToDigits);

                        // Round Numbers to

                        invoice.bill_amount = billAmount;
                        invoice.total_amount = totalAmount;

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

                                // save the corresponding project with the updated last invoice date as well.
                                project.last_invoice_date = invoiceBillEndDate.toDate();

                                project.save(function(err){
                                    if(err){
                                        console.log('ERROR: updating project with last_invoice_date');
                                    }else{
                                        console.log('SUCCESS: Project updated with last_invoice_date');
                                        PrintUtility.generateSingleInvoicePDF(invoice);
                                    }
                                }); // END OF project.save()
                            }
                        }); // END OF invoiceInstance save()
                    }
                }); // END OF Project.find().exec()
        }); // END OF projectIdList.forEach

        callback(null);
    };

    var sendResponse = function(err,result){
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

// Generate Invoice PDFs for all the invoices in the request.
exports.generateInvoicePDFs = function(req, res){
    var invoices = req.body;
    PrintUtility.generateMultipleInvoicePDFs(invoices);
    res.send('Invoice(s) Generated');
};