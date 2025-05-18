document.addEventListener("DOMContentLoaded", function () {
  // Form validation
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Validate name
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("name-error");
    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your name";
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      nameError.textContent = "Name must be at least 3 characters long";
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    // Validate email
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = "Please enter your email address";
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    // Validate phone
    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phone-error");
    if (!phoneInput.value.trim()) {
      phoneError.textContent = "Please enter your phone number";
      isValid = false;
    } else if (!phonePattern.test(phoneInput.value.trim())) {
      phoneError.textContent =
        "Please enter a valid 10-digit mobile number starting with 6-9";
      isValid = false;
    } else {
      phoneError.textContent = "";
    }

    // Validate subject
    const subjectInput = document.getElementById("subject");
    const subjectError = document.getElementById("subject-error");
    if (!subjectInput.value) {
      subjectError.textContent = "Please select a subject";
      isValid = false;
    } else {
      subjectError.textContent = "";
    }

    // Validate message
    const messageInput = document.getElementById("message");
    const messageError = document.getElementById("message-error");
    if (!messageInput.value.trim()) {
      messageError.textContent = "Please enter your message";
      isValid = false;
    } else if (messageInput.value.trim().length < 20) {
      messageError.textContent =
        "Your message is too short. Please provide more details.";
      isValid = false;
    } else {
      messageError.textContent = "";
    }

    // Validate GSTIN if provided
    const gstinInput = document.getElementById("gstin");
    const gstinError = document.getElementById("gstin-error");
    const gstinPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (
      gstinInput.value.trim() &&
      !gstinPattern.test(gstinInput.value.trim())
    ) {
      gstinError.textContent = "Please enter a valid 15-character GSTIN";
      isValid = false;
    } else {
      gstinError.textContent = "";
    }

    // If form is valid, show success message
    if (isValid) {
      document.getElementById("success-message").style.display = "block";
      contactForm.reset();

      // Hide success message after 5 seconds
      setTimeout(function () {
        document.getElementById("success-message").style.display = "none";
      }, 5000);
    }
  });

  // Auto-capitalize GSTIN
  const gstinInput = document.getElementById("gstin");
  gstinInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
  });

  // Restrict phone input to numbers only
  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("keypress", function (e) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  });

  // Toggle FAQ answers
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      // Toggle active class on the question
      this.classList.toggle("active");

      // Toggle display of the answer
      const answer = this.nextElementSibling;
      if (answer.style.display === "block") {
        answer.style.display = "none";
      } else {
        answer.style.display = "block";
      }
    });
  });
});

const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});
