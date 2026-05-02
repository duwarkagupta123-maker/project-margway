document.addEventListener("DOMContentLoaded", () => {
    // Check for vehicle type in URL parameters to pre-fill the form
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleParam = urlParams.get('vehicle');
    if (vehicleParam) {
        const vehicleSelect = document.getElementById('rent-vehicle-type');
        if (vehicleSelect) {
            vehicleSelect.value = vehicleParam;
        }
    }

    const bookFormBtn = document.querySelector("#bookForm .btn-dark");
    if (bookFormBtn) {
        bookFormBtn.addEventListener("click", () => {
            const pickup = document.getElementById("pickup-location").value;
            const drop = document.getElementById("drop-location").value;
            const date = document.getElementById("ride-date").value;
            const time = document.getElementById("ride-time").value;
            const vehicle = document.getElementById("vehicle-type").value;
            const passengers = document.getElementById("passengers").value;

            if (!pickup || !drop || !date || !time || !vehicle) {
                alert("Please fill in all required fields.");
                return;
            }

            const bookingData = {
                type: 'cab',
                pickup,
                drop,
                date,
                time,
                vehicle,
                passengers
            };

            localStorage.setItem("marg_currentBooking", JSON.stringify(bookingData));
            window.location.href = "billing.html";
        });
    }

    const rentFormBtn = document.querySelector("#rentForm .btn-dark");
    if (rentFormBtn) {
        rentFormBtn.addEventListener("click", () => {
            const name = document.getElementById("rent-name").value;
            const email = document.getElementById("rent-email").value;
            const vehicle = document.getElementById("rent-vehicle-type").value;
            const startDate = document.getElementById("start-date").value;
            const endDate = document.getElementById("end-date").value;
            const location = document.getElementById("pickup-location").value;

            if (!name || !email || !vehicle || !startDate || !endDate || !location) {
                alert("Please fill in all required fields.");
                return;
            }

            const bookingData = {
                type: 'rent',
                name,
                email,
                vehicle,
                startDate,
                endDate,
                location
            };

            localStorage.setItem("marg_currentBooking", JSON.stringify(bookingData));
            window.location.href = "billing.html";
        });
    }
});
