function loadUnits(callback) {
    var data = {};

    $.ajax({
        "url": "ajax.php?action=list&entity=units",
        "method": "get",
        "dataType": "json",
        "data": data
    })
    .done(function(data) {
        var units = [];

        console.log("unit data", data);
        data.forEach(function(item) {
            units.push(new BattleUnit(
                item["unit_id"],
                item["party_id"],
                item["sprite"],
                item["color"],
                item["jobclass"]
            ));
        });

        callback(units);
    })
    .fail(function(data) {
        console.log(data);
        console.error("didn't work");
    });
}