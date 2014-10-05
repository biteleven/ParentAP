//http://jsfiddle.net/hybrid13i/7JsVV/10/



function connect(e)
{
    var term= {button:e};
    $.ajax({
        url:'http://dev.bit11.gr/parentap/appData.ashx',
        crossDomain: true,
        type:'GET',
        data: { "key":"12345", "action":"getnearest", "position":"38.08944515|23.73797894|5700" },
        dataType:'json',
        contentType: "application/json; charset=utf-8",
        error:function(jqXHR,text_status,strError){
            console.log('error');
            console.log(jqXHR);
            //console.log(strError);
            alert("no connection");},
        timeout:60000,
        success:function(data){
            SetPushPins(data);
        },
        complete: function() {
            // Schedule the next request when the current one's complete
            setTimeout(connect, 5000);
        }
    });}

var map = null;
var InfoBoxEntity = null;
var PushPinsEntity = null;
var myPositionPin = null;

function AddPushPins(strJSON) {
    //var strJSON = document.getElementById('txtJSON');

    if (strJSON.length == 0) {
        alert('Please provide pushpin data in JSON format');
        return;
    }

    try{
        var data = JSON.parse(strJSON);
        SetPushPins(data);
        strJSON.value = "";
    }
    catch (ex) {
        alert('ERROR: Please provide valid JSON data');
    }
}

function LoadMap() {
//    var map = new Microsoft.Maps.Map(document.getElementById("map-area"), mapOptions);

    map = new Microsoft.Maps.Map(document.getElementById('map-area'), {
        credentials: "Atcaw7O3cbMdgpvDmRxx9tGXihtc02HUczEYXzjd2cswI6u-iI_obrpWVerjVZ8U",
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(38.078366 , 23.743858),
        zoom: 14
    });

    PushPinsEntity = new Microsoft.Maps.EntityCollection();
    map.entities.push(PushPinsEntity);

    InfoBoxEntity = new Microsoft.Maps.EntityCollection();
    map.entities.push(InfoBoxEntity);

    //var myloc = new Microsoft.Maps.Location(myLat, myLon);
    //myPositionPin = new Microsoft.Maps.Pushpin(myloc);

   /* map.setView({
        center: new Microsoft.Maps.Location(47.27197080559039, 1.303472656250002),
        zoom: 1
    });*/
}

function SetPushPins(PushPinData) {
    if (PushPinData.length == 0)
        return;


    for (var i = 0; i < PushPinData.length; i++) {
        var Loc = new Microsoft.Maps.Location(PushPinData[i].latitude, PushPinData[i].longitude);
        var Pushpin = new Microsoft.Maps.Pushpin(Loc,
        {
            text: PushPinData[i].FamilyName,
                height:39,
                width:80,
                typeName: 'blackText'
        });
        Pushpin.Title = PushPinData[i].FamilyName;
        Pushpin.Description = PushPinData[i].TextMessage;

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