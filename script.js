document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("college-theme");
  const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const setTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "day" : "night"} mode`);
      themeToggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀️" : "🌙";
      themeToggle.querySelector(".theme-toggle-label").textContent = isDark ? "Day mode" : "Night mode";
    }
  };
  setTheme(initialTheme);
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("college-theme", theme);
      setTheme(theme);
    });
  }

  const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
  const heroDots = Array.from(document.querySelectorAll(".hero-dot"));
  const previousHeroButton = document.querySelector(".hero-prev");
  const nextHeroButton = document.querySelector(".hero-next");
  if (heroSlides.length && heroSlides.length === heroDots.length) {
    let activeSlide = 0;
    const showSlide = (index) => {
      activeSlide = index;
      heroSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === index);
        heroDots[slideIndex].classList.toggle("is-active", slideIndex === index);
        heroDots[slideIndex].setAttribute("aria-pressed", String(slideIndex === index));
      });
    };

    heroDots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });
    if (previousHeroButton) {
      previousHeroButton.addEventListener("click", () => {
        showSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length);
      });
    }
    if (nextHeroButton) {
      nextHeroButton.addEventListener("click", () => {
        showSlide((activeSlide + 1) % heroSlides.length);
      });
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setInterval(() => {
        showSlide((activeSlide + 1) % heroSlides.length);
      }, 5000);
    }
  }

  const defaultSchoolData = {
    school: {
      fullName: "Vidya Vati Devi P.G. College",
      shortName: "P.G. College",
      hindiName: "विद्यावती देवी",
      heroName: "Vidya Vati Devi",
      heroCollege: "P.G. College",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      session: "2026–27",
      description: "Vidya Vati Devi P.G. College, Prayagraj offers a range of degree and professional course options to help students take the next step in their academic journey.",
      phoneDisplay: "9119859999 · 7014098304",
      phoneNumbers: ["9119859999", "7014098304"],
      whatsappCountryCode: "91",
      emailDisplay: "Email address to be confirmed",
      addressDisplay: "Prayagraj, Uttar Pradesh — confirm full address"
    },
    courses: [
      { abbreviation: "BA", title: "B.A." },
      { abbreviation: "BC", title: "B.Com." },
      { abbreviation: "MA", title: "M.A." },
      { abbreviation: "BS", title: "B.Sc." },
      { abbreviation: "MC", title: "M.Com." },
      { abbreviation: "BE", title: "B.Ed." },
      { abbreviation: "BP", title: "B.P.Ed." },
      { abbreviation: "DE", title: "D.El.Ed.", highlight: true },
      { abbreviation: "DP", title: "D.Pharma" },
      { abbreviation: "BP", title: "B.Pharma" },
      { abbreviation: "12", title: "10th & 12th" },
      { abbreviation: "IT", title: "I.T.I." },
      { abbreviation: "LL", title: "B.A. LL.B." },
      { abbreviation: "LB", title: "LL.B." },
      { abbreviation: "MS", title: "M.Sc." }
    ],
    gallery: [
      { file: "assests/gallery1.jpg", alt: "College community at a campus event" },
      { file: "assests/gallery2.jpg", alt: "Students taking part in an outdoor activity" },
      { file: "assests/gallery3.jpg", alt: "Students and staff at a college event" },
      { file: "assests/gallery4.jpg", alt: "Students receiving recognition at college" },
      { file: "assests/gallery5.jpg", alt: "Students participating in an outdoor college activity" },
      { file: "assests/gallery6.jpg", alt: "Students taking part in a campus activity" },
      { file: "assests/gallery7.jpg", alt: "College community gathered outdoors" },
      { file: "assests/gallery9.jpg", alt: "College staff and students at an event" },
      { file: "assests/hero.jpg", alt: "College entrance and campus view" }
    ],
    leadership: [
      { role: "Manager", name: "", photo: "" },
      { role: "Director", name: "", photo: "" }
    ]
  };

  const renderSchoolData = async () => {
    let data = defaultSchoolData;

    try {
      const response = await fetch("school-data.json");
      if (response.ok) {
        const json = await response.json();
        if (json.school && Array.isArray(json.courses) && Array.isArray(json.gallery) && Array.isArray(json.leadership)) {
          data = json;
        }
      }
    } catch (error) {
      console.warn("Using built-in default school data because school-data.json could not be fetched.", error);
    }

    document.querySelectorAll("[data-school-field]").forEach((element) => {
      const value = data.school[element.dataset.schoolField];
      if (value !== undefined) element.textContent = value;
    });
    document.title = `${data.school.fullName}, ${data.school.city} | Admissions ${data.school.session}`;

    const internationalPhone = (phone) => {
      const digits = String(phone).replace(/\D/g, "");
      const countryCode = String(data.school.whatsappCountryCode || "91").replace(/\D/g, "");
      return digits.length > 10 && digits.startsWith(countryCode) ? digits : `${countryCode}${digits}`;
    };
    const phoneNumbers = Array.isArray(data.school.phoneNumbers) ? data.school.phoneNumbers : [];
    const firstPhone = phoneNumbers[0];
    const floatingWhatsApp = document.getElementById("floatingWhatsApp");
    const floatingCall = document.getElementById("floatingCall");
    if (floatingWhatsApp && firstPhone) {
      floatingWhatsApp.href = `https://wa.me/${internationalPhone(firstPhone)}?text=${encodeURIComponent("Hello, I would like to know more about admissions.")}`;
    }
    if (floatingCall && firstPhone) floatingCall.href = `tel:+${internationalPhone(firstPhone)}`;

    const contactPhoneLinks = document.getElementById("contactPhoneLinks");
    if (contactPhoneLinks && phoneNumbers.length) {
      contactPhoneLinks.replaceChildren();
      phoneNumbers.forEach((phone, index) => {
        if (index) {
          const separator = document.createElement("span");
          separator.setAttribute("aria-hidden", "true");
          separator.textContent = " · ";
          contactPhoneLinks.append(separator);
        }
        const callLink = document.createElement("a");
        callLink.href = `tel:+${internationalPhone(phone)}`;
        callLink.textContent = phone;
        const whatsappLink = document.createElement("a");
        whatsappLink.href = `https://wa.me/${internationalPhone(phone)}?text=${encodeURIComponent("Hello, I would like to know more about admissions.")}`;
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";
        whatsappLink.textContent = "WhatsApp";
        contactPhoneLinks.append(callLink, whatsappLink);
      });
    }

    const courseGrid = document.getElementById("courseGrid");
    if (courseGrid) {
      courseGrid.innerHTML = "";
      data.courses.forEach((course, index) => {
        const link = document.createElement("a");
        link.className = course.highlight ? "course-card course-highlight" : "course-card";
        link.href = "#admission";
        const header = document.createElement("span");
        header.className = "course-card-header";
        const abbreviation = document.createElement("span");
        abbreviation.className = "course-card-badge";
        abbreviation.textContent = course.abbreviation;
        const number = document.createElement("span");
        number.className = "course-card-number";
        number.textContent = String(index + 1).padStart(2, "0");
        header.append(abbreviation, number);
        const title = document.createElement("strong");
        title.className = "course-card-title";
        title.textContent = course.title;
        const footer = document.createElement("span");
        footer.className = "course-card-footer";
        footer.textContent = "Enquire about this course";
        const arrow = document.createElement("span");
        arrow.className = "course-card-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        footer.append(arrow);
        link.append(header, title, footer);
        courseGrid.append(link);
      });
    }

    const campusGallery = document.getElementById("campusGallery");
    if (campusGallery) {
      campusGallery.innerHTML = "";
      data.gallery.forEach((photo) => {
        const card = document.createElement("figure");
        card.className = "gallery-card";
        const image = document.createElement("img");
        image.src = photo.file;
        image.alt = photo.alt;
        image.loading = "lazy";
        const caption = document.createElement("figcaption");
        caption.className = "gallery-caption";
        const label = document.createElement("span");
        label.textContent = "CAMPUS MOMENTS";
        const title = document.createElement("strong");
        title.textContent = photo.alt;
        caption.append(label, title);
        card.append(image, caption);
        campusGallery.append(card);
      });
    }

    const leadershipGrid = document.getElementById("leadershipGrid");
    if (leadershipGrid) {
      leadershipGrid.innerHTML = "";
      data.leadership.forEach((leader) => {
        const column = document.createElement("div");
        column.className = "col-sm-6 col-lg-4";
        const card = document.createElement("article");
        card.className = "leader-card";
        const photo = document.createElement("div");
        photo.className = "leader-photo";
        if (leader.photo) {
          const image = document.createElement("img");
          image.src = leader.photo;
          image.alt = leader.name ? `${leader.name}, ${leader.role}` : leader.role;
          photo.append(image);
        } else {
          photo.textContent = "Photo coming soon";
        }
        const name = document.createElement("h3");
        name.textContent = leader.name || leader.role;
        const role = document.createElement("p");
        role.textContent = leader.name ? leader.role : "Name and photo to be added";
        card.append(photo, name, role);
        column.append(card);
        leadershipGrid.append(column);
      });
    }
  };
  renderSchoolData();

  const backToTop = document.getElementById("backToTop");
  const updateBackToTop = () => {
    if (window.scrollY > 450) backToTop.classList.add("visible");
    else backToTop.classList.remove("visible");
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Close the mobile navigation after selecting a section.
  document.querySelectorAll("#mainNav .nav-link, #mainNav .btn").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.getElementById("mainNav");
      if (nav.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  // The visitor reviews the prefilled WhatsApp message and sends it from WhatsApp.
  const form = document.getElementById("enquiryForm");
  const message = document.getElementById("formMessage");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const whatsappLink = document.getElementById("floatingWhatsApp");
    const whatsappNumber = whatsappLink ? new URL(whatsappLink.href).pathname.replace(/\D/g, "") : "";
    if (!whatsappNumber) {
      message.textContent = "WhatsApp contact number is unavailable. Please call the college using the contact number shown on this page.";
      return;
    }

    const body = [
      "College website enquiry",
      `Name: ${data.get("fullName")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email") || "Not provided"}`,
      `Enquiry: ${data.get("interest")}`,
      "",
      `Message: ${data.get("message")}`
    ].join("\n");
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`;
  });
});
