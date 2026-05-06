document.addEventListener("DOMContentLoaded", () => {
    const bookingData = JSON.parse(localStorage.getItem("marg_currentBooking"));
    if (!bookingData) {
        alert("No active booking found!");
        window.location.href = "index.html";
        return;
    }

    const orderId = "MW-" + Math.floor(1000 + Math.random() * 9000);
    const orderIdEl = document.getElementById("order-id");
    if(orderIdEl) orderIdEl.innerText = "Booking ID: #" + orderId;

    const detailsContainer = document.getElementById("invoice-details");
    let html = '';
    let total = 0;

    if (bookingData.type === 'cab') {
        const baseFare = 50;
        const ratePerKm = 15;
        const distance = Math.floor(Math.random() * 20) + 5; 
        total = baseFare + (distance * ratePerKm);
        
        // Step 1: Get data from storage (already done) -> Step 2: Calculate CO2 saved -> Step 3: Display to user
        const co2Saved = (distance * 0.2).toFixed(1);
        bookingData.co2Saved = co2Saved;
        bookingData.total = total;

        html += `<div class="detail-row"><span class="detail-label">Service Type</span><span class="detail-value">Electric Cab Ride</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Pickup Location</span><span class="detail-value">${bookingData.pickup}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Drop Location</span><span class="detail-value">${bookingData.drop}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Date & Time</span><span class="detail-value">${bookingData.date} at ${bookingData.time}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Vehicle Type</span><span class="detail-value" style="text-transform: capitalize;">${bookingData.vehicle}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Est. Distance</span><span class="detail-value">${distance} km</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Sustainability Score</span><span class="detail-value" style="color: #28a745; font-weight: bold;"><i class="fas fa-leaf"></i> ${co2Saved} kg CO₂ Saved</span></div>`;
        html += `<div class="total-row"><h3>Total Amount</h3><div class="price">₹${total}</div></div>`;
    } else if (bookingData.type === 'rent') {
        let ratePerDay = 1500;
        if (bookingData.vehicle === 'tesla') ratePerDay = 4999;
        else if (bookingData.vehicle === 'mg') ratePerDay = 3499;
        else if (bookingData.vehicle === 'tata') ratePerDay = 2499;
        else if (bookingData.vehicle === 'f77') ratePerDay = 1299;
        else if (bookingData.vehicle === 'ather') ratePerDay = 499;
        else if (bookingData.vehicle === 'bicycle') ratePerDay = 199;
        
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        total = days * ratePerDay;
        
        // Step 1: Get data from storage (already done) -> Step 2: Calculate CO2 saved -> Step 3: Display to user
        const co2Saved = (days * 5).toFixed(1);
        bookingData.co2Saved = co2Saved;
        bookingData.total = total;

        html += `<div class="detail-row"><span class="detail-label">Service Type</span><span class="detail-value">EV Rental</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Renter Name</span><span class="detail-value">${bookingData.name}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Vehicle Selected</span><span class="detail-value" style="text-transform: capitalize;">${bookingData.vehicle}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Duration</span><span class="detail-value">${bookingData.startDate} to ${bookingData.endDate} (${days} Days)</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Pickup Location</span><span class="detail-value">${bookingData.location}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Sustainability Score</span><span class="detail-value" style="color: #28a745; font-weight: bold;"><i class="fas fa-leaf"></i> ${co2Saved} kg CO₂ Saved</span></div>`;
        html += `<div class="total-row"><h3>Total Amount</h3><div class="price">₹${total}</div></div>`;
    }
    
    // Save updated bookingData back so it can be added to history
    localStorage.setItem("marg_currentBooking", JSON.stringify(bookingData));

    if (detailsContainer) detailsContainer.innerHTML = html;
});

function selectPayment(element) {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

function confirmPayment() {
    // Step 1: Get current booking data from storage
    const currentBooking = JSON.parse(localStorage.getItem("marg_currentBooking"));
    if (currentBooking) {
        // Step 2: Get history from storage or initialize
        let history = JSON.parse(localStorage.getItem("marg_history")) || [];
        currentBooking.status = "Completed";
        currentBooking.paymentDate = new Date().toISOString();
        
        const currentUserStr = localStorage.getItem("marg_currentUser");
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            currentBooking.userEmail = currentUser.email;
        }

        // Step 3: Push current booking to history and save
        history.push(currentBooking);
        localStorage.setItem("marg_history", JSON.stringify(history));
    }

    alert("Payment successful! Your eco-friendly ride is confirmed.");
    localStorage.removeItem("marg_currentBooking");
    window.location.href = "index.html";
}
