// immediate invoked function

(function () {
    // initialise the WDC API
    var myConnector = tableau.makeConnector();

    //setup the schema for the data

    myConnector.getSchema = function (schemaCallback) {
        // define columns in an array of objects
        var cols = [{
            id: "Currency",
            alias: "Currency",
            dataType: tableau.dataTypeEnum.string,
            description: "Currencies Exchanged"
        }, {
            id: "Value",
            alias: "Value",
            dataType: tableau.dataTypeEnum.float,
            description: "Exchange Rate Value"
        }, {
            id: "BaseCurrency",
            alias: "Base Currency",
            dataType: tableau.dataTypeEnum.string,
            description: "Selected Base Currency"
        }];

        var tableSchema = {
            id: 'APILayer',
            alias: 'FX Rates API',
            columns: cols
        };
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {

        // get the base currency selected
        //var urlParam = tableau.connectionData.baseCurr;
        var accessKey = tableau.connectionData.key;
        var baseUrl = 'http://www.apilayer.net/api/live?access_key=' + accessKey;
       // var baseUrl = 'https://api.fixer.io/latest?base=' + urlParam;

        tableau.log(baseUrl);

        $.getJSON(baseUrl, function (resp) {
            var quoteData = resp.quotes;
            var tableData = []
            for (var key in quoteData) {
                if (quoteData.hasOwnProperty(key)) {
                    tableData.push({
                        'Currency': key,
                        'Value': quoteData[key],
                        'BaseCurrency': 'USD',
                    });
                }
            }
            table.appendRows(tableData);
            doneCallback();
        })
    }

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
    $("#clickButton").click(function () {

        var urlParam = {
            //baseCurr: $('#currencySelect').val().trim(),
            key: $('#accessKey').val().trim()
        };

       

        if (urlParam.key !== '') {

            tableau.connectionName = "APILayer-data";
            tableau.connectionData = urlParam;
            tableau.submit(); // This sends the connector object to Tableau
            //test if works on console
            tableau.log('This button is working neatly');
        } else {
            tableau.log('Please enter your API key!');
            $(".errorMessage").text('Please enter your API key');
        }
    });
});