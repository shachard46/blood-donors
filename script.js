let all_donation_list = [
  {
    date: "4/4/21",
    address: "אמץ",
    startTime: "17:00",
    endTime: "19:00",
    dis: "",
  },
  {
    date: "20/4/21",
    address: "בחן",
    startTime: "13:00",
    endTime: "15:00",
    dis: "",
  },
  {
    date: "7/4/21",
    address: "בת חפר",
    startTime: "17:00",
    endTime: "19:30",
    dis: "",
  },
];
let filterd_donation_list = [];
let dis_list = [];
let geocoder;
let map;
let homeAddress;
let date_radio;
var tableRows = document.getElementsByTagName('myTableData');

for (var i = 0; i < tableRows.length; i += 1) {
  tableRows[i].addEventListener('mouseover', function (e) {
    console.log("sdsd");
  });
  // or attachEvent, depends on browser
}
function translateCalanderDate(date) {
  var date = new Date(date);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getYear() - 100;
  var newDate = [day, month, year].join('/');
  return newDate;
}
function getDateFilters() {
  var ele = document.getElementsByName('radio_date');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      let x = ele[i].value;
      return x;
    }
  }
}
function filterByDate() {
  filterd_donation_list = [];
  var date = new Date(document.getElementById("calander").value);
  if (getDateFilters() == "exact_date") {
    for (let i in all_donation_list) {
      if (all_donation_list[i].date == translateCalanderDate(date)) {
        filterd_donation_list.splice(i, 1, all_donation_list[i]);
      }
    }
  }
  else {
    for (let i in all_donation_list) {
      for (let j = 0; j < 5; j++) {
        var tempDate = new Date(document.getElementById("calander").value);
        if (all_donation_list[i].date == translateCalanderDate(tempDate.setDate(tempDate.getDate() + j))) {
          filterd_donation_list.splice(i, 1, all_donation_list[i]);
          break
        }
      }

    }
  }
}


function setDescription(donation) {
  let txt = `starting time:${donation.startTime} \n`;
  txt = txt + `end time: ${donation.endTime} \n`;
  txt = txt + `location: ${donation.address}`;
  return txt;
}
function SetHomeAddress(Adreess) {
  homeAddress = Adreess;
  initMap();
}
function initMap() {
  filterByDate();
  if (homeAddress == undefined) {
    homeAddress = getCurrentLocation();
  }
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
  });
  setPin(map, homeAddress, true, "הבית שלך");
  for (let donation in filterd_donation_list) {
    setPin(
      map,
      filterd_donation_list[donation].address,
      false,
      setDescription(filterd_donation_list[donation])
    );
  }

}

function setPin(map, Adreess, home, description) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: Adreess }, function (results, status) {
    if (status === "OK") {
      if (home == true) {
        map.setCenter(results[0].geometry.location);
        const Marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: "./img/Home_icon.png",
          title: description,
        });
        clickMarker(Marker);
      } else {
        const Marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: "./img/Mada_icon.png",
          title: description,
        });
        clickMarker(Marker);
      }
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }

  });

}
function addRow() {
  let table = document.getElementById("myTableData");
  let rowCount = table.rows.length;
  if (rowCount > 1) {
    for (let i = rowCount; i > 1; i--) {
      table.deleteRow(i - 1);
    }
  }
  for (index in filterd_donation_list) {
    let date = filterd_donation_list[index].date;
    let address = filterd_donation_list[index].address;
    let startTime = filterd_donation_list[index].startTime;
    let endTime = filterd_donation_list[index].endTime;
    rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.insertCell(0).innerHTML = rowCount;
    row.insertCell(1).innerHTML = date;
    row.insertCell(2).innerHTML = address;
    row.insertCell(3).innerHTML = startTime;
    row.insertCell(4).innerHTML = endTime;
  }
}
function getRow(marker) {
  filterByDate();
  var markerTitel = marker.getTitle();
  for (var i = 0; i < filterd_donation_list.length; i++) {
    console.log(i);
    var listTitel = setDescription(filterd_donation_list[i]);
    console.log(markerTitel);
    console.log(listTitel);
    if (markerTitel == listTitel) {
      console.log("true");
      return i;
    }
  }
}

function clickMarker(marker) {
  google.maps.event.addListener(marker, 'click', function () {
    markRow(getRow(marker) + 1);
  });
}
function markRow(index) {
  let table = document.getElementById("myTableData");
  if (table.rows[index].style.backgroundColor == "red") {
    table.rows[index].style.backgroundColor = 'green';
  }
  else {
    table.rows[index].style.backgroundColor = "red";
  }


}
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // alert(pos.value);
        return pos;
      },
      () => { }
    );
  }
  return "יד חנה";
}
function autoComplete() {
  addressField = document.getElementById("location_input");
  autocomplete_ = new google.maps.places.Autocomplete(addressField, {
    componentRestrictions: { country: ["israel"] },
    fields: ["address_components", "geometry"],
    types: ["address"],
  });
  // autocomplete.addListener("place_changed", () => {
  //   autocomplete.getPlace();
  // });
}
function calculateDistances(origin, destinations) {
  let durations = [];
  let service = new google.maps.DistanceMatrixService(); //initialize the distance service
  service.getDistanceMatrix(
    {
      origins: [origin], //set origin, you can specify multiple sources here
      destinations: destinations, //set destination, you can specify multiple destinations here
      travelMode: google.maps.TravelMode.DRIVING, //set the travelmode
      unitSystem: google.maps.UnitSystem.METRIC, //The unit system to use when displaying distance
      avoidHighways: false,
      avoidTolls: false,
    },
    (response, status) => {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        const elements = response.rows[0].elements;
        for (i = 0; i < elements.length; i++) {
          durations[i] = {
            address: destinations[i],
            duration: elements[i].duration.value,
          };
        }
      }
    }
  );
  return durations;
}
