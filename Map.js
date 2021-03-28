var Adreess_list=["בת חפר","בחן","אמץ"];
var geocoder;
var map;
var home_Adreess = "יד חנה";

function set_home_Adreess(Adreess){
    home_Adreess = Adreess;
    console.log(home_Adreess);
    initMap();
}
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
    });
    setPin(map,home_Adreess,true)
    for (i = 0;i<Adreess_list.length;i++){
        setPin(map,Adreess_list[i],false);

    }
}

function setPin(map,Adreess,home){
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
            });
        }
        else{
        const beachMarker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            icon: "Mada_icon.png",
        });}
    
    } else {
        alert('Geocode was not successful for the following reason: ' + status);
    }
    });
}
