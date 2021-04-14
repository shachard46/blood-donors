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
  tableRows[i].addEventListener("mouseover", function (e) { });
  // or attachEvent, depends on browser
}

function getDateFilters() {
  var e = document.getElementById("selectList");
  var strUser = e.value;
  return strUser;
}
function filterByDate(exact, list, date) {
  return _.filter(list, (e) => {
    // var dateParts = e.date.split("/");
    var calDate = new Date(e.date);
    let inRange =
      Math.abs(calDate.getTime() - date.getTime()) <= 5 * DAY_IN_MS &&
      calDate.getTime() > Date.now();
    return exact
      ? translateCalanderDate(e.date) == translateCalanderDate(date)
      : inRange;
  });
}
function filterList(list, callback) {
  filterByDistance(
    document.getElementById("disRange").value,
    filterByDate(
      getDateFilters() == "תאריך מדוייק",
      list,
      new Date(document.getElementById("date").value)
    ),
    (filtered) => callback(filtered)
  );
}
function SetHomeAddress(Adreess) {
  homeAddress = Adreess;
  updateMap();
}
function clickMarker(marker) {
  google.maps.event.addListener(marker, "click", function () {
    getRowIndex(marker);
    //markRow
  });
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
  let dates = _.map(destinations, (dest) => dest.date);
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
      console.log(status);
      if (status == google.maps.DistanceMatrixStatus.OK) {
        const elements = response.rows[0].elements;
        for (i = 0; i < elements.length; i++) {
          distances.push({
            address: addresses[i],
            date: dates[i],
            distance: Number(elements[i].distance.value) / 1000,
          });
        }
        distances = _.sortBy(distances, (distance) => distance.distance);
        console.log(distances);
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
function findByAddressAndDate(address, date) {

  return _.filter(
    all_donation_list,
    (element) => element.address == address && element.date == date
  )[0];
}
function readFromFile() {
  $.getJSON("../donations.json", (data) => (all_donation_list = data));
}
function updateTable() {
  let table = document.getElementById("donationTable");
  let rowCount = table.rows.length;
  console.log(rowCount);
  if (rowCount > 0) {
    for (let i = rowCount; i > 0; i--) {
      table.deleteRow(i - 1);
    }
  }
  filterList(all_donation_list, (filteredList) => {
    console.log("filtered list: ", filteredList);
    filteredList.forEach((element) => {
      rowCount = table.rows.length;
      let row = table.insertRow(rowCount);
      row.insertCell(0).innerHTML = findByAddressAndDate(element.address, element.date).date;
      row.insertCell(1).innerHTML = findByAddressAndDate(element.address, element.date).address;
      row.insertCell(2).innerHTML =
        findByAddressAndDate(element.address, element.date).startTime +
        "-" +
        findByAddressAndDate(element.address, element.date).endTime;
      row.insertCell(3).innerHTML =
        parseFloat(element.distance).toFixed(1).toString() + ` ק"מ`;
    });
  });
}