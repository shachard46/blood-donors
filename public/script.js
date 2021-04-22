let all_donation_list = [];
readFromFile();
let filterd_donation_list = [];
let dis_list = [];
let geocoder;
let map;
let homeAddress;
let date_radio;
var tableRows = document.getElementsByTagName("myTableData");
const DAY_IN_MS = 8.64e7;

for (var i = 0; i < tableRows.length; i += 1) {
  tableRows[i].addEventListener("mouseover", function (e) {});
  // or attachEvent, depends on browser
}

function getDateFilters() {
  var e = document.getElementById("selectList");
  var strUser = e.value;
  return strUser;
}
function filterByDate(exact, list, date) {
  let dateParts = date.split("/");
  date = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]);
  return _.filter(list, (e) => {
    dateParts = e.date.split("/");
    calDate = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]);
    let inRange =
      Math.abs(calDate.getTime() - date.getTime()) <= 5 * DAY_IN_MS &&
      calDate.getTime() + DAY_IN_MS >= Date.now();
    return exact
      ? translateCalanderDate(calDate) == translateCalanderDate(date) &&
          calDate.getTime() + DAY_IN_MS >= Date.now()
      : inRange;
  });
}
function filterList(list, callback) {
  filterByDistance(
    document.getElementById("disRange").value,
    filterByDate(
      getDateFilters() == "תאריך מדוייק",
      list,
      document.getElementById("date").value
    ),
    (filtered) => callback(filtered)
  );
}
function SetHomeAddress(Adreess) {
  homeAddress = Adreess;
}
function clickMarker(marker, list) {
  google.maps.event.addListener(marker, "click", function () {
    getRowIndex(marker, list);
    //markRow
  });
}
function coordinatesToName(Address, callback) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: Address }, function (results, status) {
    if (status === "OK") {
      let AddressName = results[0].formatted_address;
      callback(AddressName);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = position.coords.latitude + "," + position.coords.longitude;
        coordinatesToName(pos, (result) => callback(result));
        // alert(pos.value);
      },
      () => {}
    );
  }
}
function autoComplete() {
  let addressField = document.getElementById("location_input");
  let autocomplete = new google.maps.places.Autocomplete(addressField, {
    componentRestrictions: { country: ["isr"] },
    fields: ["address_components", "geometry"],
    types: [],
  });
}

function recDistances(service, addresses, cb) {
  let currentAdresses = addresses;
  let nextAdresses = [];
  if (addresses.length >= 25) {
    currentAdresses = addresses.slice(0, 25);
    nextAdresses = addresses.slice(25, addresses.length);
  }
  let settings = {
    origins: [origin], //set origin, you can specify multiple sources here
    destinations: currentAdresses, //set destination, you can specify multiple destinations here
    travelMode: google.maps.TravelMode.DRIVING, //set the travelmode
    unitSystem: google.maps.UnitSystem.METRIC, //The unit system to use when displaying distance
    avoidHighways: false,
    avoidTolls: false,
  };
  if (nextAdresses.length == 0) cb();
  recDistances(
    nextAdresses,
    service.getDistanceMatrix(settings, cb),
    settings.destinations.length == 0
  );
}

function getDistances(origin, destinations, callback) {
  let service = new google.maps.DistanceMatrixService(); //initialize the distance service
  let addresses = _.map(destinations, (dest) => dest.address);

  let settings = {
    origins: [origin], //set origin, you can specify multiple sources here
    destinations: addresses, //set destination, you can specify multiple destinations here
    travelMode: google.maps.TravelMode.DRIVING, //set the travelmode
    unitSystem: google.maps.UnitSystem.METRIC, //The unit system to use when displaying distance
    avoidHighways: false,
    avoidTolls: false,
  };
  function addToDistances(response, status, startIndex) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
      const elements = response.rows[0].elements;
      for (i = 0; i < elements.length; i++) {
        if (elements[i].status == "OK")
          destinations[startIndex + i].distance =
            Number(elements[i].distance.value) / 1000;
      }
    }
  }
  function rec(startIndex) {
    let currentAdresses = addresses.slice(startIndex, addresses.length);
    let end = 0;
    if (addresses.length >= 25 + startIndex) {
      currentAdresses = addresses.slice(startIndex, startIndex + 25);
      startIndex = startIndex + 25;
    } else end = addresses.length;
    settings.destinations = currentAdresses;

    if (end == addresses.length) {
      service.getDistanceMatrix(settings, (response, status) => {
        addToDistances(response, status, startIndex);
        destinations = _.sortBy(destinations, (distance) => distance.distance);
        callback(destinations);
      });
      return;
    }

    service.getDistanceMatrix(settings, (response, status) => {
      addToDistances(response, status, startIndex - 25);
      rec(startIndex);
    });
  }
  rec(0);
}

function addKM(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].distance = list[i].distance + "km";
  }
  return list;
}
function filterByDistance(max, destinations, callback) {
  getDistances(homeAddress, destinations, (distances) => {
    var filtered = _.filter(distances, (dist) => Number(dist.distance) <= max);
    callback(filtered);
  });
}
function findByAddressAndDate(address, date) {
  return _.filter(
    all_donation_list,
    (element) => element.address == address && element.date == date
  )[0];
}
function readFromFile() {
  $.getJSON("./donations.json", (data) => (all_donation_list = data));
}
function updateTable(list) {
  let table = document.getElementById("donationTable");
  let rowCount = table.rows.length;
  if (rowCount > 0) {
    for (let i = rowCount; i > 0; i--) {
      if (table.rows[i - 1].id !== "t_header") table.deleteRow(i - 1);
    }
  }
  console.log(list);
  list.forEach((element) => {
    rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.insertCell(0).innerHTML = findByAddressAndDate(
      element.address,
      element.date
    ).date;
    row.insertCell(1).innerHTML = findByAddressAndDate(
      element.address,
      element.date
    ).address;
    row.insertCell(2).innerHTML =
      findByAddressAndDate(element.address, element.date).startTime +
      "-" +
      findByAddressAndDate(element.address, element.date).endTime;
    row.insertCell(3).innerHTML =
      parseFloat(element.distance).toFixed(1).toString() + ` ק"מ`;
  });
}
function post() {
  let formNodes = document.getElementById("form").childNodes;
  let formData = {};
  _.forEach(
    _.filter(formNodes, (node) => node.type != undefined),
    (node) => (formData[node.name] = node.value)
  );
  $.ajax({ type: "POST", url: "/api/users", data: formData, enctype: true });
  location.href = "Thanks.html";
}

function sss(list, index) {
  if (list.length == index) {
    return;
  }
  let donation = list[index];
  geocoder.geocode({ address: donation.address }, (results, status) => {
    if (status == "OK") {
      all_donation_list[index].position = results[0].geometry.location;
    } else {
      console.log(
        "Geocode was not successful for the following reason: ",
        status
      );
    }
    setTimeout(() => {
      sss(list, index + 1);
    }, 1000);
  });
}
