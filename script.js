let all_donation_list = [
  {
    date: "02/04/21",
    address: "אמץ",
    startTime: "17:00",
    endTime: "19:00",
    dis: "",
  },
  {
    date: "03/04/21",
    address: "בחן",
    startTime: "13:00",
    endTime: "15:00",
    dis: "",
  },
  {
    date: "03/04/21",
    address: "בת חפר",
    startTime: "17:00",
    endTime: "19:30",
    dis: "",
  },
];
let filterd_donation_list = all_donation_list;
let dis_list = [];
let geocoder;
let map;
let homeAddress;
let date_radio;

function getDateFilters() {
  var ele = document.getElementsByName('radio_date');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      let x = ele[i].value;
      return x;
    }
  }
}
function filterByDate(date) {
  console.log(filterd_donation_list);
  for (let i in all_donation_list) {
    if (getDateFilters() == "exact_date") {
      if (all_donation_list[i].date != date) {
        filterd_donation_list.splice(i, 1);
      }
    }

  }
  console.log(filterd_donation_list);


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
  if (homeAddress == undefined) {
    homeAddress = getCurrentLocation();
  }
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
  });
  setPin(map, homeAddress, true, "הבית שלך");
  for (let donation in all_donation_list) {
    setPin(
      map,
      all_donation_list[donation].address,
      false,
      setDescription(all_donation_list[donation])
    );
  }
}

function setPin(map, Adreess, home, description) {
  const image = "./img/Home_icon.png";
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: Adreess }, function (results, status) {
    if (status === "OK") {
      if (home == true) {
        map.setCenter(results[0].geometry.location);
        const beachMarker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: "./img/Home_icon.png",
          title: description,
        });
      } else {
        const beachMarker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: "./img/Mada_icon.png",
          title: description,
        });
      }
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function addRow() {
  let table = document.getElementById("myTableData");
  let rowCount = table.rows.length;
  // let sorted_list = _.sortBy(donation_list, (address) => {
  // return calculateDistances(homeAddress, donation_list[address])
  // })
  for (index in all_donation_list) {
    let date = all_donation_list[index].date;
    let address = all_donation_list[index].address;
    let startTime = all_donation_list[index].startTime;
    let endTime = all_donation_list[index].endTime;
    rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.insertCell(0).innerHTML = rowCount;
    row.insertCell(1).innerHTML = date;
    row.insertCell(2).innerHTML = address;
    row.insertCell(3).innerHTML = startTime;
    row.insertCell(4).innerHTML = endTime;
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
