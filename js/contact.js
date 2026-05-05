document.addEventListener("DOMContentLoaded", () => {
    const contactFormBtn = document.querySelector("#contactForm .btn-dark");
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        // Live Form Validation: Real-time listeners
        const contactInputs = contactForm.querySelectorAll("input, textarea");
        contactInputs.forEach(input => {
            input.addEventListener("input", (e) => {
                const val = e.target.value.trim();
                if (val === "") {
                    e.target.style.border = "2px solid red";
                } else if (e.target.type === "email" && !val.includes("@")) {
                    e.target.style.border = "2px solid red";
                } else {
                    e.target.style.border = "2px solid green";
                }
            });
        });
    }

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
