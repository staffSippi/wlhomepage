$(document).ready(function () {
  const root = document.documentElement;

  if (themePrimaryColor) {
    root?.style.setProperty("--bs-primary", themePrimaryColor);
  }
  if (themeSecondaryColor) {
    root?.style.setProperty("--bs-secondary", themeSecondaryColor);
  }

  let locationSearchAjax = {
    url: `${window.location.protocol}//${siteDomain}/flightApi/api/getAirports`,
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

  if (localStorage.getItem("auth-token")) {
    // console.log(localStorage.getItem("auth-token"));
    $(".authMode").show();
  } else {
    $(".guestMode").show();
  }

  $("#passengerCount").on("click", function () {
    $("#passengerSelectModal .modal-body").html(
      $("#passengerPopoverContent").html()
    );
    $("#passengerSelectModal").modal("show");
  });

  function calculatePassengerCount() {
    var adultCount = 1;
    var childrenCount = 0;
    var infantCount = 0;
    if ($("#passengerSelectModal").length) {
      adultCount = $("#passengerSelectModal .adultCount").val();
      childrenCount = $("#passengerSelectModal .childrenCount").val();
      infantCount = $("#passengerSelectModal .infantCount").val();
    } else {
      adultCount = $(".popover .adultCount").val();
      childrenCount = $(".popover .childrenCount").val();
      infantCount = $(".popover .infantCount").val();
    }
    console.log({ adultCount });
    $("#passengerCount").html(
      //   `${adultCount} <i class="fas fa-user-tie"></i>, ${childrenCount} <i class="fas fa-child"></i>, ${infantCount} <i class="fas fa-baby-carriage"></i>`
      `${adultCount} Adult(s), ${childrenCount} Child, ${infantCount} Infant`
    );

    $("input[name='adult']").val(adultCount);
    $("input[name='children']").val(childrenCount);
    $("input[name='infant']").val(infantCount);
  }

  $(".origin-select2").select2({
    ajax: locationSearchAjax,
    placeholder: "Origin",
  });
  $(".destination-select2").select2({
    ajax: locationSearchAjax,
    placeholder: "Destination",
  });

  if ($("#passengerSelectModal").length < 1) {
    new bootstrap.Popover(document.querySelector(".pax-popover"), {
      trigger: "click",
      container: "body",
      title: "Select Passengers",
      sanitize: false,
      html: true,
      // placement: "bottom",
      content() {
        return $("#passengerPopoverContent").html();
      },
    });
  }

  $(document).on("scroll", function () {
    console.log("Scrolled");
    $("nav.navbar").toggleClass(
      "bg-transparent",
      $(document).scrollTop() <= 50
    );
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
      let minPaxCount = 1;
      if ($(this).next().attr("name") !== "adult") {
        minPaxCount = 0;
      }

      if (newValue >= minPaxCount) {
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
