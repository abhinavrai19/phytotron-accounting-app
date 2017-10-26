
// Function to round a given number to provided decimal places
exports.roundNumberTo = function(number, digits) {
    return parseFloat(roundOffTo(number, digits));
};

var roundOffTo = function(number, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if( number < 0) {
        negative = true;
        number = number * -1;
    }
    var multiplicator = Math.pow(10, digits);
    number = parseFloat((number * multiplicator).toFixed(11));
    number = (Math.round(number) / multiplicator).toFixed(2);
    if( negative ) {
        number = (number * -1).toFixed(2);
    }
    return number;
};