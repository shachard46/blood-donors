var Adreess_list=[["אמץ",set_description("17:00","19:00","אמץ")],["בחן",set_description("13:00","15:00","בחן")],["בת חפר",set_description("17:00","19:30","בת חפר")]];
var dis_list = [];
var geocoder;
var map;
var home_Adreess = "יד חנה";
function set_description(start,end,location){
    var txt = "starting time: " + start + "\n";
    txt = txt + "end time: "+ end + "\n";
    txt = txt + "location: "+ location + "\n";
    return txt;
}
function set_home_Adreess(Adreess){
    home_Adreess = Adreess;
    //console.log(home_Adreess);
    initMap();
}
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
    });
    setPin(map,home_Adreess,true,"הבית שלך")
    for (i = 0;i<Adreess_list.length;i++){
        setPin(map,Adreess_list[i][0],false,Adreess_list[i][1]);

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
// function update_dis(home_Adreess,target){
    
// }
