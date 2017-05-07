function loadUnits(callback) {
    var units = [];
    var data = {};

    $.ajax({
        "url": "ajax.php?action=list&entity=units",
        "method": "get",
        "dataType": "json",
        "data": data
    })
    .done(function(data) {
        
        console.log("unit data", data);
        data.forEach(function(item) {
            units.push(new BattleUnit(
                item["unit_id"],
                item["party_id"],
                item["sprite"],
                item["color"]
            ));
        });

        callback();
    })
    .fail(function(data) {
        console.log(data);
        console.error("didn't work");
    });

    return units;
}