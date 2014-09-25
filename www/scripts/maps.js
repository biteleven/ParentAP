//http://jsfiddle.net/hybrid13i/7JsVV/10/




function initializeMap() {
    var mapOptions = {
        credentials: "Atcaw7O3cbMdgpvDmRxx9tGXihtc02HUczEYXzjd2cswI6u-iI_obrpWVerjVZ8U",
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(38.078366 , 23.743858),
        zoom: 16
    };
    var map = new Microsoft.Maps.Map(document.getElementById("map-area"), mapOptions);

    map.entities.clear();
    var pushpin= new Microsoft.Maps.Pushpin(map.getCenter(), null);
    map.entities.push(pushpin);
    pushpin.setLocation(new Microsoft.Maps.Location(38.078366,23.743858));
    displayAlert('Pushpin Location Updated to ' + pushpin.getLocation() + '. Pan map to location, if pushpin is not visible');
}

function connect(e)
{
    var term= {button:e};
    $.ajax({
        url:'http://dev.bit11.gr/parentap/appData.ashx',
        crossDomain: true,
        type:'POST',
        data: { key: "12345", action: "getnearest", position: "38.08944515|23.73797894|5700" },
        dataType:'json',
        contentType: "application/json; charset=utf-8",
        error:function(jqXHR,text_status,strError){
            console.log('error');
            console.log(text_status);
            console.log(strError);
            alert("no connection");},
        timeout:60000,
        success:function(data){
            AddPushPins(data);
        }
    });}

var map = null;
var InfoBoxEntity = null;
var PushPinsEntity = null;

function AddPushPins(strJSON) {
    //var strJSON = document.getElementById('txtJSON');

    if (strJSON.value.length == 0) {
        alert('Please provide pushpin data in JSON format');
        return;
    }

    try{
        var data = JSON.parse(strJSON.value);
        SetPushPins(data);
        strJSON.value = "";
    }
    catch (ex) {
        alert('ERROR: Please provide valid JSON data');
    }
}

function LoadMap() {
    map = new Microsoft.Maps.Map(document.getElementById('MyMap'), {
        credentials: "Atcaw7O3cbMdgpvDmRxx9tGXihtc02HUczEYXzjd2cswI6u-iI_obrpWVerjVZ8U",
        mapTypeId: Microsoft.Maps.MapTypeId.road
    });

    PushPinsEntity = new Microsoft.Maps.EntityCollection();
    map.entities.push(PushPinsEntity);

    InfoBoxEntity = new Microsoft.Maps.EntityCollection();
    map.entities.push(InfoBoxEntity);

    map.setView({
        center: new Microsoft.Maps.Location(47.27197080559039, 1.303472656250002),
        zoom: 1
    });
}

function SetPushPins(PushPinData) {
    if (PushPinData.length == 0)
        return;


    for (var i = 0; i < PushPinData.length; i++) {
        var Loc = new Microsoft.Maps.Location(PushPinData[i].latitude, PushPinData[i].longitude);
        var Pushpin = new Microsoft.Maps.Pushpin(Loc);
        Pushpin.FamilyName = PushPinData[i].Title;
        Pushpin.TextMessage = PushPinData[i].Description;

        var InfoBox = new Microsoft.Maps.Infobox(Loc, { visible: false, offset: new Microsoft.Maps.Point(0, 30) });

        Microsoft.Maps.Events.addHandler(Pushpin, 'click', function (e) {
            InfoBox.setLocation(e.target.getLocation());
            InfoBox.setOptions({
                visible: true,
                title: e.target.Title,
                description: e.target.Description
            });
        });

        InfoBoxEntity.push(InfoBox);
        PushPinsEntity.push(Pushpin);
    }
}