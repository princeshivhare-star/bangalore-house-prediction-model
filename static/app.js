function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1;
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1;
}

// ✅ Automatically detect correct backend URL (local or Render)
const baseUrl = window.location.origin;

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  // ❗ Correct backend URL
  var url = `${baseUrl}/predict_home_price`;

  $.post(
    url,
    {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value,
    },
    function (data, status) {
      console.log(data);
      estPrice.innerHTML =
        "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
      console.log(status);
    }
  ).fail(function () {
    estPrice.innerHTML =
      "<h2>Error fetching price. Check backend connection.</h2>";
  });
}

function onPageLoad() {
  console.log("document loaded");

  // ❗ Correct backend URL
  var url = `${baseUrl}/get_location_names`;

  $.get(url, function (data, status) {
    console.log("Got response for get_location_names");

    if (data && data.locations) {
      var uiLocations = document.getElementById("uiLocations");

      $("#uiLocations").empty();
      $("#uiLocations").append(
        new Option("Choose a Location", "", true, true)
      );

      for (var i = 0; i < data.locations.length; i++) {
        var opt = new Option(data.locations[i]);
        $("#uiLocations").append(opt);
      }
    }
  }).fail(function () {
    console.error("❌ Failed to load locations. Backend not reachable.");
  });
}

window.onload = onPageLoad;
