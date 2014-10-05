/**
 * Created by kostakis on 4/10/2014.
 */

//Geolocation functions

var myLat=255;
var myLon=255;
var myAlt=-1;
var myAcc=-1;
var myHeading=-1;
var mySpeed=-1;
var myGPSprovider=0; //GPS=1 , GSM=2

var watch_id = null;    // ID of the geolocation
//var tracking_data = []; // Array containing GPS position objects
var optionsWatchPosition = { frequency: 30000,timeout: 60000, enableHighAccuracy: false };

function startGeolocation(){
    console.log("Location search started!");
    // Start tracking the User
    watchID = navigator.geolocation.watchPosition(onSuccess, onError, optionsWatchPosition);

    if(optionsWatchPosition.enableHighAccuracy==true)
      $("#locinfo").css( "color", "red" );
    else
      $("#locinfo").css( "color", "blue" );
}

// onSuccess Geolocation
function onSuccess(position) {
     myLat=255;
     myLon=255;
     myAlt=-1;
     myAcc=-1;
     myHeading=-1;
     mySpeed=-1;
     myGPSprovider=0; //GPS=1 , GSM=2
    console.log("Location Updated");

    if(!isEmpty(position.coords.latitude))
           myLat = position.coords.latitude;
    if(!isEmpty(position.coords.longitude))
           myLon = position.coords.longitude;
    if(!isEmpty(position.coords.altitude))
           myAlt = position.coords.altitude;
    if(!isEmpty(position.coords.accuracy))
           myAcc = Math.round(position.coords.accuracy);
    if(!isEmpty(position.coords.heading))
          myHeading = position.coords.heading;
    if(!isEmpty(position.coords.speed))
           mySpeed = position.coords.speed;

    //position.timestamp
    if(optionsWatchPosition.enableHighAccuracy==true)
        myGPSprovider =1;//GPS
    else
        myGPSprovider =2;//GSM

    $("#locinfo").html('Latitude: '  + myLat      + '<br />' +
        'Longitude: ' + myLon    + '<br />' +
        'Accuracy: ' + myAcc    + '<br />' +
        '<hr />');

    optionsWatchPosition.enableHighAccuracy = true;

    clearWatch();
    startGeolocation();
}

// onError Callback receives a PositionError object
function onError(error) {
    console.log(error);
    $("#locinfo").html('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
    clearWatch();
    optionsWatchPosition.enableHighAccuracy = !optionsWatchPosition.enableHighAccuracy;
    startGeolocation();
}

function stopGeolocation(){
    console.log("Location search stopped!");
    // Stop tracking the user
    navigator.geolocation.clearWatch(watch_id);

    // Save the tracking data
    //window.localStorage.setItem(track_id, JSON.stringify(tracking_data));

    // Reset watch_id and tracking_data
    var watch_id = null;
    //var tracking_data = null;

    $("#locinfo").html("Tracking Stopped");

}

// clear the watch that was started earlier
//
function clearWatch() {
    if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}