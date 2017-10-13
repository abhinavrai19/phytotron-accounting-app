var Project = require('../models/project');
var Invoice = require('../models/invoice');
var moment = require('moment');
var async = require('async');
var hbs = require('hbs');
var wkhtmltopdf = require('wkhtmltopdf');


//REPORT TEMPLATE----------------------------------------------------------------------------------------------------------------------
var reportTemplate = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <!--Header-->\n' +
    '    <ul>\n' +
    '        <li><h4>North Carolina State University</h4></li>\n' +
    '        <li><p>Southeastern Plant Environment Laboratories</p></li>\n' +
    '        <li><p>Invoice for Services Rendered</p></li>\n' +
    '    </ul>\n' +
    '</head>\n' +
    '<body>\n' +
    '<!--Invoice Page START-->\n' +
    '<div layout="column">\n' +
    '    <!--Invoice and Project Details-->\n' +
    '    <ul>\n' +
    '        <li><p><b>Phytotron ID:</b> A020201</p></li>\n' +
    '        <li><b>Invoice #:</b> {{selectedInvoice.invoice_id}}</li>\n' +
    '\n' +
    '        <li><p><b>Preparation Date:</b> {{selectedInvoice.generation_date}}</p></li>\n' +
    '        <li><p><b>Billing Interval:</b> {{selectedInvoice.bill_start_date}}    -    {{selectedInvoice.bill_end_date}}</p></li>\n' +
    '\n' +
    '        <li><p><b>Project ID:</b> {{selectedInvoice.project_id}} </p></li>\n' +
    '        <li><p><b>Project Title:</b> {{selectedInvoiceProject.project_title}} </p></li>\n' +
    '\n' +
    '        <li><p><b>Project Duration:</b> {{selectedInvoiceProject.project_start_date}}    -    {{selectedInvoiceProject.project_end_date}}</p></li>\n' +
    '    </ul>\n' +
    '    <br>\n' +
    '    <!-- Client Details-->\n' +
    '    <b>In Account With: </b>\n' +
    '    <table>\n' +
    '        <thead>\n' +
    '        <th>Client Name</th>\n' +
    '        <th>Department Name</th>\n' +
    '        <th>Address</th>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '        <tr md-row ng-repeat="client in selectedInvoiceProject.clients">\n' +
    '            <td>{{client.first_name}} {{client.last_name}}</td>\n' +
    '            <td>{{client.department}}</td>\n' +
    '            <td>{{client.address}}</td>\n' +
    '        </tr>\n' +
    '        </tbody>\n' +
    '    </table>\n' +
    '    <br>\n' +
    '\n' +
    '    <!-- Chamber Bill Cost Details -->\n' +
    '    <div ng-hide="$ctrl.selectedInvoice.chamber_usage_cost.length==0">\n' +
    '        <b>Chamber Usage:</b>\n' +
    '        <table>\n' +
    '            <thead>\n' +
    '            <th>Chamber Name</th>\n' +
    '            <th>Start Date</th>\n' +
    '            <th>End Date</th>\n' +
    '            <th>Chamber Rate</th>\n' +
    '            <th>Chamber Cost</th>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    '            {{#each selectedInvoice.chamber_usage_cost}}\n' +
    '            <tr>\n' +
    '                <td>{{chamber_name}}</td>\n' +
    '                <td>{{start_date}}</td>\n' +
    '                <td>{{end_date}}</td>\n' +
    '                <td>{{chamber_rate}}</td>\n' +
    '                <td>{{chamber_cost}}</td>\n' +
    '            </tr>\n' +
    '            {{/each}}\n' +
    '            </tbody>\n' +
    '        </table>\n' +
    '        <br>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <!--Additional Resource Cost Details -->\n' +
    '    <div ng-hide="$ctrl.selectedInvoice.additional_resource_cost.length==0">\n' +
    '        <b> Additional Resources Usage:</b>\n' +
    '        <table>\n' +
    '            <thead>\n' +
    '            <th>Resource Name</th>\n' +
    '            <th>Unit Rate</th>\n' +
    '            <th>Units Consumed</th>\n' +
    '            <th>Start Date</th>\n' +
    '            <th>End Date</th>\n' +
    '            <th>Description</th>\n' +
    '            <th>Comments</th>\n' +
    '            <th>Resource Cost</th>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    '            {{#each selectedInvoice.additional_resource_cost}}\n' +
    '            <tr>\n' +
    '                <td>{{resource_name}}</td>\n' +
    '                <td>{{unit_rate}}</td>\n' +
    '                <td>{{units_consumed}}</td>\n' +
    '                <td>{{start_date}}</td>\n' +
    '                <td>{{end_date}}</td>\n' +
    '                <td>{{description}}</td>\n' +
    '                <td>{{comments}}</td>\n' +
    '                <td>{{resource_cost}}</td>\n' +
    '            </tr>\n' +
    '            {{/each}}\n' +
    '            </tbody>\n' +
    '        </table>\n' +
    '        <br>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <!--Cost Split -->\n' +
    '    <ul md-cols="4" md-gutter="1em" md-row-height="10px">\n' +
    '        <li><p>Bill Amount: {{selectedInvoice.bill_amount}}</p></li>\n' +
    '        <li><p>Adjustments: {{selectedInvoice.adjustments}}</p></li>\n' +
    '        <li><p>Discounts: {{selectedInvoice.discounts}}</p></li>\n' +
    '        <li><p>Total Amount: {{selectedInvoice.total_amount}}</p></li>\n' +
    '    </ul>\n' +
    '    <br>\n' +
    '\n' +
    '    <!--Footer-->\n' +
    '    <ul>\n' +
    '        <li>Please make check payable to: <b>North Carolina State University</b></li>\n' +
    '\n' +
    '        <li>Remit with one (1) copy of this invoice to:</li>\n' +
    '\n' +
    '        <li>North Carolina State University</li>\n' +
    '        <li>Office of Finance and Business, Box 7201</li>\n' +
    '        <li>Raleigh, North Carolina 27695-7201</li>\n' +
    '\n' +
    '        <li>Business Office</li>\n' +
    '\n' +
    '        <li>Deposit Check to: North Carolina Agricultural Research Service</li>\n' +
    '        <li>Misc. Rec. -- Phytotron Revenue Code No. 4-16952-0791</li>\n' +
    '    </ul>\n' +
    '\n' +
    '</div>\n' +
    '<!--Invoice Page END-->\n' +
    '</body>\n' +
    '</html>';

var invoiceReportTemplate = hbs.compile(reportTemplate);

//---------------------------------------------------------------------------------------------------------------------------------------------------


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

                                project.save(function(err){
                                    if(err){
                                        console.log('ERROR: updating project with last_invoice_date');
                                    }else{
                                        console.log('SUCCESS: Project updated with last_invoice_date');
                                        // Generate PDF Report when everything is updated in the database
                                        // Generate HTML with the data from the current report
                                        var invoiceReportData = {selectedInvoice: invoice, selectedInvoiceProject: project};
                                        var invoiceReportHTML = invoiceReportTemplate(invoiceReportData);

                                        // set pdf file name
                                        var pdfFileName = invoice.invoice_id+'.pdf';
                                        var options = {
                                            output: pdfFileName,
                                            pageSize: 'A4',

                                        }
                                        wkhtmltopdf(invoiceReportHTML,options);


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