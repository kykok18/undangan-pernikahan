// =========================
// ELEMENT SELECTOR
// =========================

const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");

const music = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

const bottomNav = document.getElementById("bottomNav");

// =========================
// OPEN INVITATION
// =========================

if (openBtn && cover) {
  openBtn.addEventListener("click", () => {
    document.body.classList.remove("lock-scroll");
    document.body.classList.add("invitation-opened");

    cover.classList.add("opened");

    if (bottomNav) bottomNav.classList.add("show");
    if (musicBtn) musicBtn.classList.add("show");

    if (music) {
      music.volume = 0.35;

      music
        .play()
        .then(() => {
          if (musicBtn) musicBtn.classList.add("playing");
        })
        .catch(() => {
          console.log("Autoplay blocked by browser");
        });
    }

    setTimeout(() => {
      cover.style.display = "none";
    }, 1000);
  });
}

// =========================
// MUSIC BUTTON
// =========================

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (!music) return;

    if (music.paused) {
      music.play();
      musicBtn.classList.add("playing");
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
    }
  });
}

// =========================
// GUEST NAME FROM URL
// contoh: index.html?to=Rizky
// =========================

const params = new URLSearchParams(window.location.search);
const guestName = params.get("to") || params.get("kepada") || params.get("guest");

if (guestName) {
  const guestElement = document.getElementById("guestName");

  if (guestElement) {
    guestElement.innerText = decodeURIComponent(guestName.replace(/\+/g, " "));
  }
}

// =========================
// COUNTDOWN
// Tanggal: 28 Desember 2026, 09:00 WIB
// =========================

const targetDate = new Date("2026-06-28T09:00:00+07:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (distance <= 0) {
    daysEl.innerText = "00";
    hoursEl.innerText = "00";
    minutesEl.innerText = "00";
    secondsEl.innerText = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.innerText = String(days).padStart(2, "0");
  hoursEl.innerText = String(hours).padStart(2, "0");
  minutesEl.innerText = String(minutes).padStart(2, "0");
  secondsEl.innerText = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =========================
// GOOGLE CALENDAR
// =========================

const calendarBtn = document.getElementById("calendarBtn");

if (calendarBtn) {
  const eventTitle = "The Wedding of Mario & Angela";
  const eventDetails = "Undangan Pernikahan Mario & Angela";
  const eventLocation = "Desa. Sumbakeling, Kec. Pancalang, Kab. kuningan, Jawa Barat";

  const startDate = "20260628T020000Z";
  const endDate = "20260628T070000Z";

  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent(eventTitle) +
    "&dates=" +
    startDate +
    "/" +
    endDate +
    "&details=" +
    encodeURIComponent(eventDetails) +
    "&location=" +
    encodeURIComponent(eventLocation);

  calendarBtn.href = calendarUrl;
  calendarBtn.target = "_blank";
}

// =========================
// REVEAL ANIMATION
// muncul setiap masuk viewport
// =========================

const revealElements = document.querySelectorAll(".reveal");

let revealObserver = null;

if ("IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("show");
  });
}

// =========================
// ACTIVE NAVIGATION
// =========================

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

let ticking = false;

function updateActiveNav() {
  let currentSection = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 170;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveNav);
      ticking = true;
    }
  },
  { passive: true },
);

updateActiveNav();

// =========================
// SMOOTH NAVIGATION
// =========================

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetSelector = link.getAttribute("href");
    const targetSection = document.querySelector(targetSelector);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// =========================
// COPY REKENING
// =========================

const copyButtons = document.querySelectorAll(".btn-copy");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");

    if (!value) return;

    const originalText = button.innerHTML;

    try {
      await navigator.clipboard.writeText(value);

      button.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Disalin
      `;

      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1600);
    } catch (error) {
      const tempInput = document.createElement("input");
      tempInput.value = value;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      button.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Disalin
      `;

      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1600);
    }
  });
});

// =========================
// LIGHT GALLERY CAROUSEL
// =========================

const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryDots = document.getElementById("galleryDots");

if (galleryTrack && galleryDots) {
  const slides = Array.from(galleryTrack.querySelectorAll(".gallery-slide"));

  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "gallery-dot";
    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      galleryTrack.scrollTo({
        left: galleryTrack.clientWidth * index,
        behavior: "smooth",
      });
    });

    galleryDots.appendChild(dot);
  });

  const dots = Array.from(galleryDots.querySelectorAll(".gallery-dot"));

  function updateGalleryDot() {
    const index = Math.round(galleryTrack.scrollLeft / galleryTrack.clientWidth);

    dots.forEach((dot) => dot.classList.remove("active"));

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }

  galleryTrack.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateGalleryDot);
    },
    { passive: true },
  );

  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => {
      galleryTrack.scrollBy({
        left: -galleryTrack.clientWidth,
        behavior: "smooth",
      });
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener("click", () => {
      galleryTrack.scrollBy({
        left: galleryTrack.clientWidth,
        behavior: "smooth",
      });
    });
  }
}

// =========================
// WISH FORM GOOGLE SHEET
// =========================

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbwdKHqohpuT-DGgMv6ETPWz_RlTQkkhAhN5U5jX12nYmmnWa7mdaBQv2HTvE-YqfXF8/exec";

const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

function renderWish(name, message) {
  if (!wishList) return;

  const card = document.createElement("div");
  card.className = "wish-card reveal show";

  card.innerHTML = `
    <b>${escapeHTML(name)}</b>
    <p>${escapeHTML(message)}</p>
  `;

  wishList.prepend(card);
}

async function loadWishes() {
  if (!wishList) return;

  wishList.innerHTML = `
    <div class="wish-card">
      <b>Memuat ucapan...</b>
      <p>Mohon tunggu sebentar.</p>
    </div>
  `;

  try {
    const response = await fetch(GOOGLE_SHEET_API);
    const result = await response.json();

    if (result.status !== "success") {
      wishList.innerHTML = `
        <div class="wish-card">
          <b>Belum ada ucapan</b>
          <p>Jadilah yang pertama mengirim doa.</p>
        </div>
      `;
      return;
    }

    wishList.innerHTML = "";

    if (!result.data || result.data.length === 0) {
      wishList.innerHTML = `
        <div class="wish-card">
          <b>Belum ada ucapan</b>
          <p>Jadilah yang pertama mengirim doa.</p>
        </div>
      `;
      return;
    }

    result.data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "wish-card reveal show";

      card.innerHTML = `
        <b>${escapeHTML(item.name)}</b>
        <p>${escapeHTML(item.message)}</p>
      `;

      wishList.appendChild(card);
    });
  } catch (error) {
    wishList.innerHTML = `
      <div class="wish-card">
        <b>Ucapan belum bisa dimuat</b>
        <p>Silakan cek koneksi atau konfigurasi Google Sheet.</p>
      </div>
    `;

    console.log("Gagal mengambil ucapan:", error);
  }
}

if (wishForm && wishList) {
  loadWishes();

  wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("wishName");
    const messageInput = document.getElementById("wishMessage");

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) return;

    const submitBtn = wishForm.querySelector("button[type='submit']");
    const oldText = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Mengirim...";
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);

    try {
      const response = await fetch(GOOGLE_SHEET_API, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        renderWish(name, message);
        wishForm.reset();
      } else {
        alert(result.message || "Gagal mengirim ucapan");
      }
    } catch (error) {
      alert("Gagal mengirim ucapan. Cek koneksi atau URL Google Sheet.");
      console.log(error);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = oldText;
    }
  });
}

// =========================
// DECOR PARALLAX RINGAN
// =========================

// =========================
// ESCAPE HTML
// =========================

function escapeHTML(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// =========================
// IMAGE OPTIMIZATION - LIGHT VERSION
// =========================

document.querySelectorAll("img").forEach((img) => {
  img.decoding = "async";
  img.setAttribute("draggable", "false");

  const isAboveFold = img.closest(".cover") || img.closest(".home-section");

  if (isAboveFold) {
    img.loading = "eager";
    img.fetchPriority = "high";
  } else {
    img.loading = "lazy";
    img.fetchPriority = "low";
  }
});

// =========================
// INITIAL STATE
// =========================

if (bottomNav) bottomNav.classList.remove("show");

if (musicBtn) {
  musicBtn.classList.remove("show");
  musicBtn.classList.remove("playing");
}
