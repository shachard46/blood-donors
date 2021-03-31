var donation_list=[ 
    {date:"31/03/21" ,address:"אמץ",startTime:"17:00",endTime:"19:00",dis:''},                
    {date:"30/03/21" ,address:"בחן",startTime:"13:00",endTime:"15:00",dis:''},          
    {date:"29/03/21" ,address:"בת חפר",startTime:"17:00",endTime:"19:30",dis:''}
];
var dis_list = [];
var geocoder;
var map;
var home_Adreess = "יד חנה";
function set_description(donation){
    var txt = `starting time:${donation.startTime} \n`;
    txt = txt + `end time: ${donation.endTime} \n`;
    txt = txt + `location: ${donation.address}`;
    return txt;
}
function set_home_Adreess(Adreess){
    home_Adreess = Adreess;
    initMap();
}
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
    });
    setPin(map,home_Adreess,true,"הבית שלך")
    for (let donation in donation_list){
        setPin(map,donation_list[donation].address,false,set_description(donation_list[donation]));

    }
}

function setPin(map,Adreess,home,description){
    const image ="Home_icon.png";
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': Adreess}, function(results, status) {
    if (status === 'OK') {
        if (home == true){
            map.setCenter(results[0].geometry.location);
            const beachMarker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                icon: "Home_icon.png",
                title: description,
            });
        }
        else{
            const beachMarker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                icon: "Mada_icon.png",
                title: description,
        });}
    
    } else {
        alert('Geocode was not successful for the following reason: ' + status);
    }
    });
    
}

function addRow() {
    var table = document.getElementById("myTableData");
    var rowCount = table.rows.length;
    console.log(donation_list.length);
    for(index in donation_list){
        var date =donation_list[index].date;
        var address = donation_list[index].address;
        var startTime = donation_list[index].startTime;
        var endTime = donation_list[index].endTime;
        rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        row.insertCell(0).innerHTML= rowCount;
        row.insertCell(1).innerHTML= date;
        row.insertCell(2).innerHTML= address;
        row.insertCell(3).innerHTML= startTime;
        row.insertCell(4).innerHTML= endTime;
    }
}

// function calculateDistances(origin,destination) {
//     console.log(origin,destination)
//     var service = new google.maps.DistanceMatrixService(); //initialize the distance service
//     service.getDistanceMatrix(
//         {
//         origins: [origin], //set origin, you can specify multiple sources here
//         destinations: [destination],//set destination, you can specify multiple destinations here
//         travelMode: google.maps.TravelMode.DRIVING, //set the travelmode
//         unitSystem: google.maps.UnitSystem.METRIC,//The unit system to use when displaying distance
//         avoidHighways: false,
//         avoidTolls: false
//         }, calcDistance); // here calcDistance is the call back function
//     }
//     function calcDistance(response, status) {
//     if (status != google.maps.DistanceMatrixStatus.OK) { // check if there is valid result
//         alert('Error was: ' + status);
//     } else {
//         var origins = response.originAddresses;
//         var destinations = response.destinationAddresses;
//         for (var i = 0; i < origins.length; i++) {
//         var results = response.rows[i].elements;
    
//         for (var j = 0; j < results.length; j++) {
//             console.log('Distance from '+origins[i] + ' to ' + destinations[j]+ ': ' + results[j].distance.text ); // alert the result
//             if (dis_list.length==donation_list.length){
//                 dis_list = [];
//                 }
//             dis_list.push(results[j].distance.text);
//         }
//         }
//     }
//     }
