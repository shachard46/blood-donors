// tabel
function translateCalanderDate(date) {
  var date = new Date(date);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getYear() - 100;
  var newDate = [day, month, year].join("/");
  return newDate;
}
function getRowIndex(marker) {
  var i = 1;
  filterList(all_donation_list, (filteredList) => {
    filteredList.forEach((element) => {
      if (findByAddress(element.address).address == getAdressFromPin(marker)) {
        console.log(findByAddress(element.address).address);
        console.log(i);
        return markRow(i);
      } else {
        i++;
      }
    });
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
  let MainbackgroundColor = "#e5e3e3";
  let secColor = "#c4131d";
  var rgb = rows[index].style.backgroundColor;
  let r = parseInt(getRGB(rgb).red);
  let g = parseInt(getRGB(rgb).green);
  let b = parseInt(getRGB(rgb).blue);
  if (rgbToHex(r, g, b) == secColor) {
    table.rows[index].style.backgroundColor = MainbackgroundColor;
  } else {
    table.rows[index].style.backgroundColor = secColor;
  }
}

//map
function initMap() {
  // filterList(all_donation_list, (filterdList) => {
  filterList(all_donation_list, (filterdList) => {
    if (homeAddress == undefined) {
      homeAddress = getCurrentLocation();
      document.getElementById("location_input").value = homeAddress;
    }
    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
    });
    setPin(map, homeAddress, true, "הבית שלך");
    setTimeout(() => {}, 100);
    for (let donation in filterdList) {
      setPin(
        map,
        filterdList[donation].address,
        false,
        setDescription(filterdList[donation])
      );
      setTimeout(() => {}, 1000);
    }
  });
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
function setDescription(donation) {
  let txt = `מיקום: ${donation.address}\n`;
  txt = txt + `שעת התחלה: ${donation.startTime} \n`;
  txt = txt + `שעת סיום: ${donation.endTime} \n`;
  return txt;
}

function getAdressFromPin(marker) {
  let str = marker.getTitle();
  for (var i = 7; i < str.length; i++) {}
  var i = 7;
  while (str[i] != "ש") {
    i++;
  }
  var res = str.slice(7, i - 1);
  return res;
}
