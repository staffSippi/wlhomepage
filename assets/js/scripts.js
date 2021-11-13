$(document).ready(function () {
  //   var siteDomain = window.location.hostname;
  //   var siteDomain = "packagecart.in";

  let locationSearchAjax = {
    url: `http://${siteDomain}/flightApi/api/getAirports`,
    method: "POST",
    headers: {
      // "auth-token": "1234",

      "site-id": siteId,
    },
    dataType: "json",
    //   contentType: "application/json; charset=utf-8",

    data: function (params) {
      var query = {
        searchBy: params.term,
        type: "public",
      };

      // Query parameters will be ?search=[term]&type=public
      return query;
    },
    processResults: function (data) {
      // Transforms the top-level key of the response object from 'items' to 'results'
      if (data.success) {
        let results = data.result.airports;

        return {
          results: results.map((result) => {
            return {
              id: result.cityCode,
              text: `${result.cityName} (${result.cityCode})`,
            };
          }),
        };
      }
    },
  };

  function calculatePassengerCount() {
    var adultCount = $(".popover .adultCount").val();
    var childrenCount = $(".popover .childrenCount").val();
    var infantCount = $(".popover .infantCount").val();
    // alert("Hi");
    // alert(adultCount);

    $("#passengerCount").html(
      //   `${adultCount} <i class="fas fa-user-tie"></i>, ${childrenCount} <i class="fas fa-child"></i>, ${infantCount} <i class="fas fa-baby-carriage"></i>`
      `${adultCount} Adult(s), ${childrenCount} Child, ${infantCount} Infant`
    );
  }

  $(".origin-select2").select2({
    ajax: locationSearchAjax,
    placeholder: "Origin",
  });
  $(".destination-select2").select2({
    ajax: locationSearchAjax,
    placeholder: "Destination",
  });

  new bootstrap.Popover(document.querySelector(".pax-popover"), {
    trigger: "click",
    container: "body",
    title: "Select Passengers",
    sanitize: false,
    html: true,
    placement: "bottom",
    content() {
      return $("#passengerPopoverContent").html();
    },
  });

  $(document).on("scroll", function () {
    console.log("Scrolled");
  });

  $(document).on("click", ".add", function () {
    if ($(this).prev().val() < 9) {
      var newValue = +$(this).prev().val() + 1;
      $(this).prev().val(newValue).attr("value", newValue);
    }
    calculatePassengerCount();
  });
  $(document).on("click", ".sub", function () {
    if ($(this).next().val() > 1) {
      var newValue = +$(this).next().val() - 1;
      if ($(this).next().val() > 1) {
        $(this).next().attr("value", newValue).val(newValue);
      }
    }
    calculatePassengerCount();
  });

  var returnDatePicker;

  returnDatePicker = $("#returnDateInput").datepicker({
    minDate: new Date(),
  });

  $("#departureDateInput").datepicker({
    minDate: new Date(),
    onSelect: function (date) {
      returnDatePicker.datepicker("option", { minDate: date });
    },
  });
});
