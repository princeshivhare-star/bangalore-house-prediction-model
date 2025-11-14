// 🔥 Use Render backend URL
const backend = "https://bangalore-house-prediction-model.onrender.com";

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

function onClickedEstimatePrice() {
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bath = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  $.post(
    backend + "/predict_home_price",
    {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bath,
      location: location.value,
    },
    function (data) {
      estPrice.innerHTML = "<h2>" + data.estimated_price + " Lakh</h2>";
    }
  ).fail(function () {
    estPrice.innerHTML = "<h2>Error contacting backend</h2>";
  });
}

function onPageLoad() {
  console.log("Loading locations...");

  $.get(backend + "/get_location_names", function (data) {
    if (data && data.locations) {
      $("#uiLocations").empty();
      $("#uiLocations").append(new Option("Choose a Location", "", true, true));

      data.locations.forEach(loc => {
        $("#uiLocations").append(new Option(loc));
      });
    }
  }).fail(function () {
    console.error("❌ Failed to load locations");
  });
}

window.onload = onPageLoad;
