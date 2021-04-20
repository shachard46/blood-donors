
// tabel
function translateCalanderDate(date) {
  date = new Date(date);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getYear() - 100;
  let newDate = [day, month, year].join("/");
  return newDate;
}
function getRowIndex(marker) {
  let i = 1;
  filterList(all_donation_list, (filteredList) => {
    filteredList.forEach((element) => {
      if (
        findByAddressAndDate(element.address, element.date).address ==
        getAdressFromPin(marker)
      ) {
        console.log(
          findByAddressAndDate(element.address, element.date).address
        );
        console.log(i);
        return markRow(i);
      } else {
        i++;
      }
    });
  });
}
function getRGB(str) {
  let match = str.match(
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
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function markRow(index) {
  let table = document.getElementById("donationTable");
  let rows = table.getElementsByTagName("tr");
  let MainbackgroundColor = "#e5e3e3";
  let secColor = "#c4131d";
  let rgb = rows[index].style.backgroundColor;
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
  getCurrentLocation((Address) => {
    if (homeAddress == undefined) {
      homeAddress = Address;
      document.getElementById("location_input").value = homeAddress;
    }
    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
    });
    setPin(map, homeAddress, true, "הבית שלך");
  });
}


function updateMap() {
  filterList(all_donation_list, (filterdList) => {
    getCurrentLocation((Address) => {
      if (homeAddress == undefined) {
        homeAddress = Address;
        document.getElementById("location_input").value = homeAddress;
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
    });

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
  for (let i = 7; i < str.length; i++) {}
  let i = 7;
  while (str[i] != "ש") {
    i++;
  }
  let res = str.slice(7, i - 1);
  return res;
}
