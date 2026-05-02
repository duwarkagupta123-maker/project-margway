document.addEventListener("DOMContentLoaded", () => {
    const contactFormBtn = document.querySelector("#contactForm .btn-dark");
    if (contactFormBtn) {
        contactFormBtn.addEventListener("click", () => {
            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const phone = document.getElementById("contact-phone").value;
            const subject = document.getElementById("contact-subject").value;
            const message = document.getElementById("contact-message").value;

            if (!name || !email || !message) {
                alert("Please fill in your name, email, and message.");
                return;
            }

            const newMessage = {
                id: Date.now(),
                name,
                email,
                phone,
                subject,
                message,
                date: new Date().toISOString()
            };

            let messages = JSON.parse(localStorage.getItem("marg_contactMessages")) || [];
            messages.push(newMessage);
            localStorage.setItem("marg_contactMessages", JSON.stringify(messages));

            alert("Thank you for reaching out! Your message has been saved and we will contact you shortly.");
            document.getElementById("contactForm").reset();
        });
    }
});
