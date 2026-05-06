document.addEventListener("DOMContentLoaded", () => {
    const historyBody = document.getElementById("history-body");
    const emptyHistory = document.getElementById("empty-history");
    const historyTable = document.querySelector(".history-table");

    const currentUserStr = localStorage.getItem("marg_currentUser");
    let currentUserEmail = null;
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        currentUserEmail = currentUser.email;
    } else {
        window.location.href = "login.html";
        return;
    }

    const historyStr = localStorage.getItem("marg_history");
    let history = historyStr ? JSON.parse(historyStr) : [];
    
    history = history.filter(booking => booking.userEmail === currentUserEmail);

    if (history.length === 0) {
        if (historyTable) historyTable.style.display = "none";
        if (emptyHistory) emptyHistory.style.display = "block";
        return;
    }
    
    history.reverse().forEach(booking => {
        const tr = document.createElement("tr");
        
        const dateStr = booking.date || (booking.paymentDate ? new Date(booking.paymentDate).toLocaleDateString() : 'N/A');
        const service = booking.type === 'cab' ? 'Cab Ride' : 'EV Rental';
        const vehicle = booking.vehicle ? booking.vehicle.toUpperCase() : 'N/A';
        const amount = booking.total ? `₹${booking.total}` : 'N/A';
        const status = booking.status || 'Completed';
        const co2 = booking.co2Saved ? `${booking.co2Saved} kg` : '0 kg';

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>${service}</td>
            <td>${vehicle}</td>
            <td>${amount}</td>
            <td><span class="status-badge">${status}</span></td>
            <td style="color: #28a745; font-weight: bold;"><i class="fas fa-leaf"></i> ${co2}</td>
        `;
        historyBody.appendChild(tr);
    });
});