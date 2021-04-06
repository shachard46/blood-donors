let all_donation_list = [
  {
    date: "4/4/2021",
    address: "אמץ",
    startTime: "17:00",
    endTime: "19:00",
  },
  {
    date: "20/4/2021",
    address: "בחן",
    startTime: "13:00",
    endTime: "15:00",
  },
  {
    date: "7/4/2021",
    address: "בת חפר",
    startTime: "17:00",
    endTime: "19:30",
  },
];
let filterd_donation_list = [];
let dis_list = [];
let geocoder;
let map;
let homeAddress;
let date_radio;
var tableRows = document.getElementsByTagName("myTableData");

for (var i = 0; i < tableRows.length; i += 1) {
  tableRows[i].addEventListener("mouseover", function (e) { });
  // or attachEvent, depends on browser
}
function initMap() {
  // filterList(all_donation_list, (filterdList) => {
  filterdList = all_donation_list;
  if (homeAddress == undefined) {
    homeAddress = getCurrentLocation();
  }
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
  });
  setPin(map, homeAddress, true, "הבית שלך");
  for (let donation in filterdList) {
    setPin(
      map,
      filterdList[donation].address,
      false,
      setDescription(filterdList[donation])
    );
  }
  // });
}
function translateCalanderDate(date) {
  var date = new Date(date);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getYear() - 100;
  var newDate = [day, month, year].join("/");
  return newDate;
}
function getDateFilters() {
  var ele = document.getElementsByName("radio_date");
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      let x = ele[i].value;
      return x;
    }
  }
}
function filterByDate(exact, list, date) {
  return _.filter(list, (e) => {
    var dateParts = e.date.split("/");
    var calDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    let inRange =
      Math.abs(
        calDate.getDate() -
        date.getDate() +
        10 * (calDate.getMonth() - date.getMonth()) +
        100 * (calDate.getYear() - date.getYear())
      ) <= 5;
    return exact
      ? translateCalanderDate(e.date) == translateCalanderDate(date)
      : inRange;
  });
}
function filterList(list, callback) {
  filterByDistance(
    document.getElementById("disRange").value,
    filterByDate(
      getDateFilters() == "exact_date",
      list,
      new Date(document.getElementById("calander").value)
    ),
    (filtered) => callback(filtered)
  );
}
function getAdressFromPin(marker) {
  let str = marker.getTitle();
  for (var i = 7; i < str.length; i++) {

  }
  var i = 7;
  while (str[i] != 'ש') {
    i++;
  }
  var res = str.slice(7, i - 1);
  return res;
}
function setDescription(donation) {
  let txt = `מיקום: ${donation.address}\n`;
  txt = txt + `שעת התחלה: ${donation.startTime} \n`;
  txt = txt + `שעת סיום: ${donation.endTime} \n`;
  return txt;
}
function SetHomeAddress(Adreess) {
  homeAddress = Adreess;
  initMap();
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
function updateTable() {
  let table = document.getElementById("myTableData");
  let rowCount = table.rows.length;
  if (rowCount > 1) {
    for (let i = rowCount; i > 1; i--) {
      table.deleteRow(i - 1);
    }
  }
  filterList(all_donation_list, (filteredList) => {
    filteredList.forEach((element) => {
      rowCount = table.rows.length;
      let row = table.insertRow(rowCount);
      row.insertCell(0).innerHTML = rowCount;
      row.insertCell(1).innerHTML = findByAddress(element.address).date;
      row.insertCell(2).innerHTML = findByAddress(element.address).address;
      row.insertCell(3).innerHTML = findByAddress(element.address).startTime;
      row.insertCell(4).innerHTML = findByAddress(element.address).endTime;
      row.insertCell(5).innerHTML = element.distance;
    });
  });
}
function getRowIndex(marker) {
  // filterList();
  // // var markerTitel = marker.getTitle();
  // for (var i = 0; i < all_donation_list.length; i++) {
  //   // console.log(findByAddress(element.address).address);
  //   // if (markerTitel == listTitel) {
  //   //   return i + 1;
  //   // }
  // }
  var i = 1;
  filterList(all_donation_list, (filteredList) => {
    filteredList.forEach((element) => {
      if (findByAddress(element.address).address == getAdressFromPin(marker)) {
        console.log(findByAddress(element.address).address);
        console.log(i);
        return markRow(i);
      }
      else {
        i++;
      }
    });
  });
}
function clickMarker(marker) {
  google.maps.event.addListener(marker, "click", function () {
    (getRowIndex(marker));
    //markRow
  });
}
function getRGB(str) {
  var match = str.match(
    /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/
  );
  return match
    ? {
      red: match[1],
      green: match[2],
      blue: match[3],
    }
    : {};
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function markRow(index) {
  let table = document.getElementById("myTableData");
  var rows = table.getElementsByTagName("tr");
  let redbackgroundColor = "#C4141D";
  let secColor = "#ffffff";
  var rgb = rows[index].style.backgroundColor;
  let r = parseInt(getRGB(rgb).red);
  let g = parseInt(getRGB(rgb).green);
  let b = parseInt(getRGB(rgb).blue);
  if (rgbToHex(r, g, b) == secColor) {
    table.rows[index].style.backgroundColor = redbackgroundColor;
  } else {
    table.rows[index].style.backgroundColor = secColor;
  }

}
function getCurrentLocation() {
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //       // alert(pos.value);
  //       return pos;
  //     },
  //     () => {}
  //   );
  // }
  return "יד חנה";
}
function autoComplete() {
  let addressField = document.getElementById("location_input");
  let autocomplete = new google.maps.places.Autocomplete(addressField, {
    componentRestrictions: { country: ["isr"] },
    fields: ["address_components", "geometry"],
    types: [],
  });
  // autocomplete.addListener("place_changed", () => {
  //   setPin(autocomplete.getPlace());
  // });
}
function getDistances(origin, destinations, callback) {
  var distances = [];
  let service = new google.maps.DistanceMatrixService(); //initialize the distance service
  let addresses = _.map(destinations, (dest) => dest.address);
  service.getDistanceMatrix(
    {
      origins: [origin], //set origin, you can specify multiple sources here
      destinations: addresses, //set destination, you can specify multiple destinations here
      travelMode: google.maps.TravelMode.DRIVING, //set the travelmode
      unitSystem: google.maps.UnitSystem.METRIC, //The unit system to use when displaying distance
      avoidHighways: false,
      avoidTolls: false,
    },
    (response, status) => {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        const elements = response.rows[0].elements;
        for (i = 0; i < elements.length; i++) {
          distances.push({
            address: addresses[i],
            distance: Number(elements[i].distance.value) / 1000,
          });
        }
        distances = _.sortBy(distances, (distance) => distance.distance);
        callback(distances);
      }
    }
  );
}
function addKM(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].distance = list[i].distance + "km";
  }
  console.log(list);
  return list;
}
function filterByDistance(max, destinations, callback) {
  getDistances(homeAddress, destinations, (distances) => {
    var filtered = _.filter(distances, (dist) => Number(dist.distance) <= max);
    console.log(filtered);
    callback(filtered);
  });
}

function findByAddress(address) {
  return _.filter(
    all_donation_list,
    (element) => element.address == address
  )[0];
}
