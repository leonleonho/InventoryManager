sap.ui.define(function() {
    Formatters = {
        conditionFormat: function(value) {
            return parseFloat(value);
        },
        priceFormatter: function(value) {
            return "$" + parseFloat(value).toFixed(2);
        },
        nameFormater: function(part1) {
            if (!part1) {
                return "In Inventory";
            }
            return part1;
        },
    };

    return Formatters;
});
//$.sap.declare("util.com.scout138.inventoryManager.Formatter");
