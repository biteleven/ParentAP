/**
 * Created by kostakis on 4/10/2014.
 */

//Geolocation functions

var myLat=null;
var myLon=null;
var myAlt=null;
var myAcc=null;
var myHeading=null;
var mySpeed=null;
var myGPSprovider=null; //GPS=1 , GSM=2

var watch_id = null;    // ID of the geolocation
//var tracking_data = []; // Array containing GPS position objects
var optionsWatchPosition = { frequency: 3000,timeout: 5000, enableHighAccuracy: true };

function startGeolocation(){
    console.log("Location search started!");
    // Start tracking the User
    watchID = navigator.geolocation.watchPosition(onSuccess, onError, optionsWatchPosition);

    $("#locinfo").html("Tracking Started");
}

// onSuccess Geolocation
function onSuccess(position) {
    console.log("Location Updated");
    $("#locinfo").html('Latitude: '  + position.coords.latitude      + '<br />' +
        'Longitude: ' + position.coords.longitude     + '<br />' +
        '<hr />');

    myLat = position.coords.latitude;
    myLon = position.coords.longitude;
    myAlt = position.coords.altitude;
    myAcc = position.coords.accuracy;
    myHeading = position.coords.heading;
    mySpeed = position.coords.speed;

    //position.timestamp
    myGPSprovider =1;//GPS

   // var optionsWatchPosition = { frequency: 3000,timeout: 120000, enableHighAccuracy: true };
    //clearWatch();
   // startGeolocation();
}

// onError Callback receives a PositionError object
function onError(error) {
    console.log(error);
    alert("GPS Error");
    //clearWatch();
    //var optionsWatchPosition = { frequency: 3000,timeout: 5000, enableHighAccuracy: false };
    //startGeolocation();
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