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

        html += `<div class="detail-row"><span class="detail-label">Service Type</span><span class="detail-value">Electric Cab Ride</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Pickup Location</span><span class="detail-value">${bookingData.pickup}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Drop Location</span><span class="detail-value">${bookingData.drop}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Date & Time</span><span class="detail-value">${bookingData.date} at ${bookingData.time}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Vehicle Type</span><span class="detail-value" style="text-transform: capitalize;">${bookingData.vehicle}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Est. Distance</span><span class="detail-value">${distance} km</span></div>`;
        html += `<div class="total-row"><h3>Total Amount</h3><div class="price">₹${total}</div></div>`;
    } else if (bookingData.type === 'rent') {
        const ratePerDay = bookingData.vehicle === 'tesla' ? 5000 : (bookingData.vehicle.includes('bike') || bookingData.vehicle.includes('bicycle') || bookingData.vehicle === 'ather' ? 500 : 1500);
        
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        total = days * ratePerDay;

        html += `<div class="detail-row"><span class="detail-label">Service Type</span><span class="detail-value">EV Rental</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Renter Name</span><span class="detail-value">${bookingData.name}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Vehicle Selected</span><span class="detail-value" style="text-transform: capitalize;">${bookingData.vehicle}</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Duration</span><span class="detail-value">${bookingData.startDate} to ${bookingData.endDate} (${days} Days)</span></div>`;
        html += `<div class="detail-row"><span class="detail-label">Pickup Location</span><span class="detail-value">${bookingData.location}</span></div>`;
        html += `<div class="total-row"><h3>Total Amount</h3><div class="price">₹${total}</div></div>`;
    }

    if (detailsContainer) detailsContainer.innerHTML = html;
});

function selectPayment(element) {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

function confirmPayment() {
    alert("Payment successful! Your eco-friendly ride is confirmed.");
    localStorage.removeItem("marg_currentBooking");
    window.location.href = "index.html";
}
