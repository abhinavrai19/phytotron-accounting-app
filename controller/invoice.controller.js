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
        .populate('clients')
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
                        var lastInvoiceDate;
                        if(project.last_invoice_date==null){
                            lastInvoiceDate = moment(project.project_start_date);
                        }else{
                            lastInvoiceDate = moment(project.last_invoice_date);
                        }


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
                            total_amount:               0,                              // bill amount + adjustments + discounts
                            invoice_amount_distribution:[],
                            is_invoice_paid:            false,
                            payment_date:               null
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
                                // Correction for difference plus one to get correct allocated days.
                                var chamberUsageDays = chamberBillEndDate.diff(chamberBillStartDate, 'days') + 1;

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
                                // update associated invoice id
                                resourceEntry.associated_invoice_id = invoice_id;
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

                        // Generate Invoice amount distribution for the set accounts.
                        project.invoice_amount_distribution.forEach(function (accountEntry) {
                            var shareAmount = accountEntry.percent_share*invoice.total_amount / 100;
                            shareAmount = MathUtility.roundNumberTo(shareAmount, roundOffToDigits);
                            var invoiceAmountDistributionEntry = {
                                client_first_name: accountEntry.client_first_name,
                                client_last_name: accountEntry.client_last_name,
                                account_number: accountEntry.client_account_number,
                                // Percent Share of the bill amount
                                share_amount: shareAmount
                            }
                            invoice.invoice_amount_distribution.push(invoiceAmountDistributionEntry);
                        });


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

                                // UPDATE PROJECT DETAILS AFTER INVOICING
                                // save project last invoice date and last invoice id to REVERT params
                                project.revert_to_invoice_date = project.last_invoice_date;
                                project.revert_to_invoice_id = project_id.last_invoice_id;

                                // save the corresponding project with the updated last invoice date and id.
                                project.last_invoice_date = invoiceBillEndDate.toDate();
                                project.last_invoice_id = invoice_id;

                                // Set revert invoice
                                project.revert_invoice_possible = true;

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
    console.log('Running getInvoiceList');
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
    console.log('Running generateInvoicePDFs');
    var invoices = req.body;
    PrintUtility.generateMultipleInvoicePDFs(invoices);
    res.send('Invoice(s) Generated');
};

// REVERT INVOICE

// Get Revert Last Invoice Project List.
exports.getRevertLastInvoiceProjectList = function(req, res){
    console.log('RUNNING getRevertLastInvoiceProjectList');
    Project.find({revert_invoice_possible: true})
        .populate('clients')
        .populate('chamber_rate')
        .populate('chambers.chamber')
        .populate('chambers.crop')
        .populate('additional_resources.resource')
        .exec(function(err,projectList){
            if(err){
                res.status('500');
                res.send('Error Finding Projects for reverting invoice '+err);

            }else{
                res.send(projectList);
            }
        })

};

// Revert Last Invoice for selected project.
exports.revertLastInvoice = function (req, res) {
    var projectIds = req.body.project_ids;
    // Current Code for single project for which last invoice can be reverted
    var projectId = projectIds[0];
    Project.findOne({'project_id': projectId})
        .populate('clients')
        .populate('chamber_rate')
        .populate('chambers.chamber')
        .populate('chambers.crop')
        .populate('additional_resources.resource')
        .exec(function(err,project){
            if(err){
                res.status('500');
                res.send('Error fetching Project Details for Reverting Invoice '+err);
            }else{
                if(project.revert_invoice_possible){
                    // get invoice id to revert from DB
                    var invoiceIdToRevert = project.last_invoice_id;

                    // Set Revert Params to last params and udpate flag
                    project.revert_invoice_possible=false;
                    project.last_invoice_date = project.revert_to_invoice_date;
                    project.last_invoice_id = project.revert_to_invoice_id;

                    // Set Revert Params to null
                    project.revert_to_invoice_id = '';
                    project.revert_to_invoice_date = null;

                    // Also if any resource was accounted in that invoice
                    project.additional_resources.forEach(function(resourceEntry){
                        if(resourceEntry.associated_invoice_id == invoiceIdToRevert && resourceEntry.resource_invoiced == true){
                            resourceEntry.resource_invoiced = false;
                            resourceEntry.associated_invoice_id = '';
                        }
                    });


                    // After updating project details, delete particular entry from invoice Table and then save the project details
                    Invoice.findOneAndRemove({ invoice_id: invoiceIdToRevert})
                        .exec(function(err, removedItem){
                            // If error removing invoice
                            if(err){
                                res.status('500');
                                res.send('Error removing invoice from DB '+err);
                            }
                            // If invoice not found in deletion

                            /*// NOTE: Commented for now - proceed to update project even if invoice to be deleted was not in DB
                            if(!removedItem){
                                res.status('500');
                                res.send('Revert Error: Cannot Find Invoice to Delete' + err);
                            }
                            */
                            // Deletion is successful
                            // update the project details as well

                            // NOTE: ANOTHER METHOD CAN BE USED TO UPDATE
                            project.save(function(err){
                                if(err){
                                    res.status('500');
                                    res.send('Invoice to be reverted, deleted from DB, but Project Update failed '+err);
                                }else{
                                    // service successful
                                    res.send('Invoice Reverted Successfully');
                                }
                            });
                        });
                }else{
                    // service successful
                    res.send('Cannot revert invoice for this project / Already 1 invoice reverted for this project ');
                }
            }
        });
};

// INVOICE PAYMENTS
exports.getUnpaidInvoiceList = function(req, res){
    console.log('RUNNING getUnpaidInvoiceList');

    Invoice.find({
        project_id: req.params.projectId,
        is_invoice_paid: false
    })
        .exec(function (err,unpaidInvoiceList) {
            if(err){
                res.status(500);
                res.send('Error fetching unpaid invoice List '+err);
            }else{
                res.send(unpaidInvoiceList);
            }
        });
};

exports.setInvoicesAsPaid = function(req, res){
    console.log('RUNNING setInvoicesAsPaid');
    // Only for a single invoice for now
    var invoiceId = req.body.invoiceIds[0];
    var paymentDate = req.body.paymentDate;
    Invoice.findOne({invoice_id: invoiceId})
        .exec(function(err, invoice){
            if(err){
                res.status(500);
                res.send('Error findind invoice to set payment date of '+err);
            }else{
                invoice.is_invoice_paid = true;
                invoice.payment_date = paymentDate;
                var invoiceInstance = new Invoice(invoice);
                invoiceInstance.save(function(err){
                    if(err){
                        res.status(500);
                        res.send('Error saving payment details of the invoice '+err);
                    }else{
                        res.send('Successfully updated payment details of the invoice');
                    }

                });
            }
        });
};