document.addEventListener("DOMContentLoaded", () => {
    // ---- PRO FEATURE: Address Book ----
    const homeAddress = localStorage.getItem('marg_homeAddress');
    const useHomePickup = document.getElementById('use-home-pickup');
    const useHomeDrop = document.getElementById('use-home-drop');
    const useHomeRentPickup = document.getElementById('use-home-rent-pickup');
    
    if (homeAddress) {
        if (useHomePickup) {
            useHomePickup.style.display = 'inline-block';
            useHomePickup.addEventListener('click', () => { document.getElementById('pickup-location').value = homeAddress; calculateLiveFareCab(); });
        }
        if (useHomeDrop) {
            useHomeDrop.style.display = 'inline-block';
            useHomeDrop.addEventListener('click', () => { document.getElementById('drop-location').value = homeAddress; calculateLiveFareCab(); });
        }
        if (useHomeRentPickup) {
            useHomeRentPickup.style.display = 'inline-block';
            useHomeRentPickup.addEventListener('click', () => { document.getElementById('pickup-location').value = homeAddress; calculateLiveFareRent(); });
        }
    }

    // ---- PRO FEATURE: Form Persistence (Drafts) & Live Fare Preview ----
    const bookFormObj = document.getElementById('bookForm');
    if (bookFormObj) {
        const savedDraft = localStorage.getItem('marg_draft_bookForm');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (draft.pickup) document.getElementById('pickup-location').value = draft.pickup;
                if (draft.drop) document.getElementById('drop-location').value = draft.drop;
                if (draft.date) document.getElementById('ride-date').value = draft.date;
                if (draft.time) document.getElementById('ride-time').value = draft.time;
                if (draft.vehicle) document.getElementById('vehicle-type').value = draft.vehicle;
                if (draft.passengers) document.getElementById('passengers').value = draft.passengers;
                calculateLiveFareCab();
            } catch(e) {}
        }
        bookFormObj.addEventListener('input', () => {
            const draft = {
                pickup: document.getElementById('pickup-location').value,
                drop: document.getElementById('drop-location').value,
                date: document.getElementById('ride-date').value,
                time: document.getElementById('ride-time').value,
                vehicle: document.getElementById('vehicle-type').value,
                passengers: document.getElementById('passengers').value
            };
            localStorage.setItem('marg_draft_bookForm', JSON.stringify(draft));
            calculateLiveFareCab();
        });
    }

    const rentFormObj = document.getElementById('rentForm');
    if (rentFormObj) {
        const savedDraft = localStorage.getItem('marg_draft_rentForm');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (draft.name && document.getElementById('rent-name')) document.getElementById('rent-name').value = draft.name;
                if (draft.email && document.getElementById('rent-email')) document.getElementById('rent-email').value = draft.email;
                if (draft.vehicle && document.getElementById('rent-vehicle-type')) document.getElementById('rent-vehicle-type').value = draft.vehicle;
                if (draft.startDate && document.getElementById('start-date')) document.getElementById('start-date').value = draft.startDate;
                if (draft.endDate && document.getElementById('end-date')) document.getElementById('end-date').value = draft.endDate;
                if (draft.location && document.getElementById('pickup-location')) document.getElementById('pickup-location').value = draft.location;
                calculateLiveFareRent();
            } catch(e) {}
        }
        rentFormObj.addEventListener('input', () => {
            const draft = {
                name: document.getElementById('rent-name') ? document.getElementById('rent-name').value : '',
                email: document.getElementById('rent-email') ? document.getElementById('rent-email').value : '',
                vehicle: document.getElementById('rent-vehicle-type') ? document.getElementById('rent-vehicle-type').value : '',
                startDate: document.getElementById('start-date') ? document.getElementById('start-date').value : '',
                endDate: document.getElementById('end-date') ? document.getElementById('end-date').value : '',
                location: document.getElementById('pickup-location') ? document.getElementById('pickup-location').value : ''
            };
            localStorage.setItem('marg_draft_rentForm', JSON.stringify(draft));
            calculateLiveFareRent();
        });
    }

    function calculateLiveFareCab() {
        const vehicle = document.getElementById('vehicle-type')?.value;
        const liveFareCab = document.getElementById('live-fare-cab');
        const fareAmountCab = document.getElementById('fare-amount-cab');
        if (vehicle && liveFareCab) {
            const estimated = 50 + (5 * 15); // ₹50 base + estimated 5km
            liveFareCab.style.display = 'block';
            fareAmountCab.innerText = `₹${estimated} (min)`;
        }
    }

    function calculateLiveFareRent() {
        const vehicle = document.getElementById('rent-vehicle-type')?.value;
        const startDateStr = document.getElementById('start-date')?.value;
        const endDateStr = document.getElementById('end-date')?.value;
        const liveFareRent = document.getElementById('live-fare-rent');
        const fareAmountRent = document.getElementById('fare-amount-rent');
        
        if (vehicle && startDateStr && endDateStr && liveFareRent) {
            let ratePerDay = 1500;
            if (vehicle === 'tesla') ratePerDay = 4999;
            else if (vehicle === 'mg') ratePerDay = 3499;
            else if (vehicle === 'tata') ratePerDay = 2499;
            else if (vehicle === 'f77') ratePerDay = 1299;
            else if (vehicle === 'ather') ratePerDay = 499;
            else if (vehicle === 'bicycle') ratePerDay = 199;

            const start = new Date(startDateStr);
            const end = new Date(endDateStr);
            if (end >= start) {
                const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
                liveFareRent.style.display = 'block';
                fareAmountRent.innerText = `₹${days * ratePerDay}`;
            } else {
                liveFareRent.style.display = 'none';
            }
        }
    }

    // Check for vehicle type in URL parameters to pre-fill the form
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleParam = urlParams.get('vehicle');
    if (vehicleParam) {
        const vehicleSelect = document.getElementById('rent-vehicle-type');
        if (vehicleSelect) {
            vehicleSelect.value = vehicleParam;
            calculateLiveFareRent();
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

            // Save Address Book
            const saveHomePickup = document.getElementById('save-home-pickup');
            const saveHomeDrop = document.getElementById('save-home-drop');
            if (saveHomePickup && saveHomePickup.checked) localStorage.setItem('marg_homeAddress', pickup);
            if (saveHomeDrop && saveHomeDrop.checked) localStorage.setItem('marg_homeAddress', drop);

            const bookingData = { type: 'cab', pickup, drop, date, time, vehicle, passengers };
            localStorage.setItem("marg_currentBooking", JSON.stringify(bookingData));
            localStorage.removeItem('marg_draft_bookForm'); // Clear draft
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

            // Save Address Book
            const saveHomeRent = document.getElementById('save-home-rent-pickup');
            if (saveHomeRent && saveHomeRent.checked) localStorage.setItem('marg_homeAddress', location);

            const bookingData = { type: 'rent', name, email, vehicle, startDate, endDate, location };
            localStorage.setItem("marg_currentBooking", JSON.stringify(bookingData));
            localStorage.removeItem('marg_draft_rentForm'); // Clear draft
            window.location.href = "billing.html";
        });
    }
});

// Step 1: Get filter type -> Step 2: Loop through cards -> Step 3: Toggle display
window.filterVehicles = function(filterType, buttonElement) {
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    // Filter cards
    const cards = document.querySelectorAll('.vehicle-card');
    cards.forEach(card => {
        if (filterType === 'all' || card.getAttribute('data-type') === filterType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};
