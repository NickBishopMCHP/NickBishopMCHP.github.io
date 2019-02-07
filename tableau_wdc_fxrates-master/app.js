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
            id: 'ExchangeRates',
            alias: 'FX Rates API',
            columns: cols
        };
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {

        // get the base currency selected
        var accessKey = tableau.connectionData.key;
        var baseUrl = 'https://api.exchangeratesapi.io/latest?base=USD';

        tableau.log(baseUrl);

        $.getJSON(baseUrl, function (resp) {
            var rateData = resp.rates;
            var tableData = []
            for (var key in rateData) {
                if (rateData.hasOwnProperty(key)) {
                    tableData.push({
                        'Currency': key,
                        'Value': rateData[key],
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

// Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Get Exchange Rates!"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });