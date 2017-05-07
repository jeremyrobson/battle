function getSpread(x, y, action) {
    var newspread = [];
    
    newspread = [{x: x, y: y}];

    return newspread;
}

function getTargetList(map, unit, node, spread) {
    var targetList = [];
    spread.forEach(function(s) {
        var mapunit = map.getUnit(s.x, s.y);
        if (mapunit && mapunit.id != unit.id) { //do not target self based on map location
            targetList.push(mapunit);
        }
        if (s.x == node.x && s.y == node.y) { //only target self in new move location
            targetList.push(unit);
        }
    });
    return targetList;
}

function createDiamond(x, y, range, includeCenter) {
    var diamond = [];
    for (var i=-range; i<=range; i++) {
        for (var j=-range; j<=range; j++) {
            if (!includeCenter && i == j) {
                continue;
            }
            else if (Math.abs(i) + Math.abs(j) <= range) {
                diamond.push({
                    x: i + x,
                    y: j + y
                });
            }
        }
    }
    return diamond;
}