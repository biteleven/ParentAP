
function initializeMap() {
    var mapOptions = {
        credentials: "Atcaw7O3cbMdgpvDmRxx9tGXihtc02HUczEYXzjd2cswI6u-iI_obrpWVerjVZ8U",
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(38.078366 , 23.743858),
        zoom: 16
    };
    var map = new Microsoft.Maps.Map(document.getElementById("map-area"), mapOptions);
}

