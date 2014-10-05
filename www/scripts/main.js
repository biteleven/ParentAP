
// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    document.addEventListener("backbutton", function(e){
        if($.mobile.activePage.is('#activity')){
            e.preventDefault();
            navigator.app.exitApp();
        }
        else {
            navigator.app.backHistory()
        }
    }, false);
    $("#locinfo").html("Init Geolocation");
    startGeolocation();
}

var airlinesApp = function(){}

airlinesApp.prototype = function() {
    var _flightForCheckin = null,
    _flightForDetails=null,
    _ffNum = null, 
    _customerData = null,
    _login = false,
    
    run = function(){
        var that = this,
        $seatPicker=$('#seatPicker');
        $('#tripDetail').on('pagebeforeshow',$.proxy(_initTripDetail,that));
        $('#boardingPass').on('pageshow',$.proxy(_initBoardingPass,that));
        $('#home').on('pagebeforecreate',$.proxy(_initHome,that));
        $('#checkIn').on('pageshow', $.proxy(_initCheckIn,that));
        
        $('#myTripsListView').on('click', 'li', function () {
        	var item = $(this);
        	_flightForCheckin = item.data('flight');
            _flightForDetails = item.data('flight');
        });
        
        $seatPicker.on('pageshow', function (event) {
        	var el = $('#seatMapPickerContainer', this),
        	seat = _flightForCheckin.segments[_flightForCheckin.currentSegment].seat;
        	seatMapDrawing.drawSeatMap(el, seat);
        
        });
        
        $seatPicker.on('pagebeforehide', function (event) {
        	_flightForCheckin.segments[_flightForCheckin.currentSegment].seat = seatMapDrawing.getselectedSeat();
        });
    },
    
    _initTripDetail = function(){
        var seg = _flightForDetails.segments[0];
	    $('#tripDetail-title').text(seg.from + ' to ' + seg.to);
	    $('#tripDetail-flightNum').text(seg.flightNum);
	    $('#tripDetail-depart').text(seg.departDate + ' at ' + seg.time);
	    $('#tripDetail-seat').text(seg.seat);
	    seg = _flightForDetails.segments[1];
	    $('#tripDetail-return-title').text(seg.from + ' to ' + seg.to);
	    $('#tripDetail-return-flightNum').text(seg.flightNum);
	    $('#tripDetail-return-depart').text(seg.departDate + ' at ' + seg.time);
        $('#tripDetail-return-seat').text(seg.seat);
    },
    
    _initBoardingPass = function(){
        currentseg = _flightForCheckin.segments[_flightForCheckin.currentSegment];

	    $('#boardingpass-cnum').text(_flightForCheckin.cNum);
	    $('#boardingpass-passenger').text(_customerData.firstName + ' ' + _customerData.lastName);
	    $('#boardingpass-seat').text(currentseg.seat);
	    $('#boardingpass-gate').text(currentseg.gate);
	    $('#boardingpass-depart').text(currentseg.time);
	    var flight = currentseg.flightNum + ':' + currentseg.from + ' to ' + currentseg.to;
	    $('#boardingpass-flight').text(flight);
    },
    
    _initHome = function(){
        if (!_login) {
	    	$.mobile.changePage("#activity", { transition: "flip" });

	    }
    },
    
    _initCheckIn = function(){
        var currentseg = _flightForCheckin.segments[_flightForCheckin.currentSegment],
	    seat = currentseg.seat,
	    flight = currentseg.from + ' to ' + currentseg.to;
	    $('#checkIn-flight-number').text(currentseg.flightNum);
	    $('#checkIn-flight-destination').text(flight);
        
	    $('#checkIn-seat').text(seat);
    },
    
    _handleLogOn = function (ff, success) {
		if (success) {
			_ffNum = ff;
			airData.getDataforFF(_ffNum,_handleDataForFF);
		}
	},
    
    _handleDataForFF = function (data) {
        $flightList = $('#myTripsListView');
		_customerData = data;
		$('#ffname').text(data.firstName);
		$('#ffnum').text(data.ffNum);
		$('#currentStatus').text(data.status);
		$('#miles').text(data.miles);
		$('#numberOfFlights').text(data.flights.length);
		for (var i in data.flights) {
			var flight = data.flights[i],
            currentSegment = flight.segments[flight.currentSegment];
			$flightList.append('<li id="' + flight.id + '"><a href="#tripDetail" data-transition="slide">' + currentSegment.from + ' to ' + currentSegment.to + '</a></li>');
			var item = $('#' + flight.id, $flightList);
			item.data('flight', flight);
			if (flight.timeToCheckIn) {

				item.addClass('checkIn');
				$('a', item).attr('href', '#checkIn');
			}
			else {
				item.addClass('tripDetail');
			}
		}
		$.mobile.changePage('#home', { transition: 'flip' });

	};
    
    return {
        run:run,
    };
}();

// Emergency Call Functions
// process the confirmation dialog result
function onEmergencyConfirm(button) {
    alert('Επιλέξατε ' + button);
}

// Show a custom confirmation dialog
//
function showEmergencyConfirm() {
    navigator.notification.confirm(
        'Επιβεβαίωση κλήσης ανάγκης',  // message
        onEmergencyConfirm,              // callback to invoke with index of button pressed
        'Κλήση ανάγκης',            // title
        'Κλήση,Ακύρωση'          // buttonLabels
    );
}


function updateStatus(e)
{
    var locstring;
    locstring='1|';
    locstring+= myAcc + '|';
    locstring+= myLat + '|';
    locstring+= myLon + '|';
    locstring+= myAlt + '|';
    locstring+= myHeading + '|';
    locstring+= mySpeed + '|';
    locstring+= '0|Not Available|';
    locstring+= myGPSprovider;
    //locstring="1|15|38.09150549|23.78104448|120|122|10|8|Test Location 33|1";
    $.ajax({
        url:'http://dev.bit11.gr/parentap/appData.ashx',
        crossDomain: true,
        type:'GET',
        data: { "key":"12345", "action":"updateposition", "loc": locstring },
        dataType:'json',
        contentType: "application/json; charset=utf-8",
        error:function(jqXHR,text_status,strError){
            console.log('error');
            console.log(jqXHR);
            //console.log(strError);
            alert("no connection");},
        timeout:60000,
        success:function(data){
            if(data.success==true) {
                alert("Success");
            }
            else{
                alert("Failed");
            }
        }
    });}