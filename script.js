const CONFIG = {
  namaPanggilan: "",
  judulNama: "my favorite person",
  getPesanSurat: function(nama) {
    return `Selamat ulang tahun, ${nama}. ♡

Terima kasih sudah hadir dan membuat banyak hal sederhana terasa istimewa. Aku berharap di umur yang baru ini, kamu selalu diberi kesehatan, ketenangan, keberanian, dan banyak alasan untuk tersenyum.

Semoga hal-hal yang sedang kamu perjuangkan pelan-pelan menemukan jalannya. Jangan lupa istirahat, jangan terlalu keras sama diri sendiri, dan ingat kalau kamu pantas mendapatkan hal-hal baik.

Aku mungkin nggak selalu punya kata-kata yang sempurna, tapi aku akan selalu mendoakan yang terbaik untukmu. Semoga hari ini sehangat senyummu.

Happy birthday, my love. I’m so lucky to have you. ♡`;
  },
  pesanKejutan: "Kalau aku boleh meminta satu hal, aku ingin kita terus punya alasan untuk tertawa bersama, saling mendukung, dan membuat lebih banyak kenangan kecil. Kamu spesial, hari ini dan seterusnya. ♡",
  musikFile: "assets/music.mp3"
};

// Pemilih elemen (Selector) yang sudah diperbaiki total dari backslash
const dapatkanElemen = (selector) => document.querySelector(selector);

const recipientHeading = dapatkanElemen("#recipient-heading");
const recipientLetterInput = dapatkanElemen("#recipient-letter-input");
const typingMessage = dapatkanElemen("#typing-message");
const typingCursor = dapatkanElemen("#typing-cursor");
const music = dapatkanElemen("#background-music");
const musicToggle = dapatkanElemen("#music-toggle");
const musicIcon = dapatkanElemen("#music-icon");
const musicLabel = dapatkanElemen("#music-label");
const floatingLayer = dapatkanElemen("#floating-layer");

const shareArea = dapatkanElemen("#share-area");
const shareLinkOutput = dapatkanElemen("#share-link-output");
const shareBtnCopy = dapatkanElemen("#share-btn-copy");

if (recipientHeading) recipientHeading.textContent = CONFIG.judulNama;
const footerYear = dapatkanElemen("#footer-year");
if (footerYear) footerYear.textContent = `© ${new Date().getFullYear()} · dibuat dengan cinta`;

let typingTimer;
let isTyping = false;

// 1. LOGIKA DETEKSI LINK OTOMATIS (URL PARAMETER)
const urlParams = new URLSearchParams(window.location.search);
const namaDariLink = urlParams.get('nama');

if (recipientLetterInput) {
    if (namaDariLink) {
        // Jika dibuka lewat link yang sudah ada namanya (Untuk si doi)
        recipientLetterInput.value = namaDariLink;
        recipientLetterInput.classList.remove("garis-isi");
        recipientLetterInput.readOnly = true;
        recipientLetterInput.style.cursor = "default";
        if (shareArea) shareArea.style.display = "none"; 
    } else {
        // Jika dibuka pertama kali untuk dibuat template-nya
        recipientLetterInput.value = "";
        recipientLetterInput.classList.add("garis-isi");
        if (shareArea) shareArea.style.display = "block"; 
        updateShareLink("");
    }
}

function typeLetter() {
  clearInterval(typingTimer);
  if (typingMessage) typingMessage.textContent = "";
  let index = 0;
  isTyping = true;
  if (typingCursor) typingCursor.hidden = false;
  
  const namaAktif = (recipientLetterInput && recipientLetterInput.value) ? recipientLetterInput.value : "kamu";
  const pesanDinamis = CONFIG.getPesanSurat(namaAktif);

  typingTimer = setInterval(() => {
    if (typingMessage) typingMessage.textContent += pesanDinamis.charAt(index);
    index++;
    if (index >= pesanDinamis.length) {
      clearInterval(typingTimer);
      isTyping = false;
      if (typingCursor) typingCursor.hidden = true;
    }
  }, 27);
}

function updateShareLink(nama) {
    if (!shareLinkOutput) return;
    const baseURl = window.location.origin + window.location.pathname;
    if (nama.trim() === "") {
        shareLinkOutput.value = baseURl;
    } else {
        shareLinkOutput.value = `${baseURl}?nama=${encodeURIComponent(nama.trim())}`;
    }
}

if (recipientLetterInput) {
  recipientLetterInput.addEventListener("input", () => {
      if (!namaDariLink) {
          updateShareLink(recipientLetterInput.value);
      }
  });

  recipientLetterInput.addEventListener("change", () => {
      if (recipientLetterInput.value.trim() !== "" && !namaDariLink) {
          recipientLetterInput.classList.remove("garis-isi");
      } else if (recipientLetterInput.value.trim() === "" && !namaDariLink) {
          recipientLetterInput.classList.add("garis-isi");
      }
      typeLetter();
  });
}

const retypeBtn = dapatkanElemen("#retype-button");
if (retypeBtn) {
    retypeBtn.addEventListener("click", typeLetter);
}
typeLetter();

if (shareBtnCopy) {
    shareBtnCopy.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(shareLinkOutput.value);
            shareBtnCopy.textContent = "Tersalin! 📋";
            setTimeout(() => shareBtnCopy.textContent = "Salin Link 🔗", 1500);
        } catch (err) {
            if (shareLinkOutput) shareLinkOutput.select();
        }
    });
}

if (musicToggle && music) {
    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
          musicToggle.setAttribute("aria-pressed", "true");
          if (musicIcon) musicIcon.textContent = "♫";
          if (musicLabel) musicLabel.textContent = "Matikan musik";
        } catch (error) {
          if (musicLabel) musicLabel.textContent = "Tambahkan assets/music.mp3";
        }
      } else {
        music.pause();
        musicToggle.setAttribute("aria-pressed", "false");
        if (musicIcon) musicIcon.textContent = "♫";
        if (musicLabel) musicLabel.textContent = "Putar musik";
      }
    });

    music.addEventListener("ended", () => {
      musicToggle.setAttribute("aria-pressed", "false");
      if (musicLabel) musicLabel.textContent = "Putar musik";
    });
}

const heartSymbols = ["♡", "♥", "ღ", "✿"];
function createFloatingHeart() {
  if (!floatingLayer) return;
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 22}px`;
  heart.style.animationDuration = `${7 + Math.random() * 7}s`;
  floatingLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}
setInterval(createFloatingHeart, 950);
for (let i = 0; i < 8; i++) setTimeout(createFloatingHeart, i * 350);

function burstParticles(button) {
  if (!floatingLayer) return;
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 34; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    const angle = (Math.PI * 2 * i) / 34;
    const distance = 45 + Math.random() * 100;
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    const size = 4 + Math.random() * 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    floatingLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 1300);
  }
}

const wishes = [
  "Semoga hal baik datang tanpa harus selalu kamu kejar. ♡",
  "Semoga kamu tumbuh tanpa kehilangan lembutnya hatimu. ✿",
  "Semoga satu per satu impianmu menemukan jalan pulang.",
  "Semoga kamu selalu punya tempat untuk merasa aman dan dicintai."
];

const wishBtn = dapatkanElemen("#wish-button");
if (wishBtn) {
    wishBtn.addEventListener("click", (event) => {
      const result = dapatkanElemen("#wish-result");
      if (result) result.textContent = wishes[Math.floor(Math.random() * wishes.length)];
      burstParticles(event.currentTarget);
    });
}

const surpriseBtn = dapatkanElemen("#surprise-button");
if (surpriseBtn) {
    surpriseBtn.addEventListener("click", (event) => {
      const message = dapatkanElemen("#surprise-message");
      if (message) {
          message.hidden = false;
          message.textContent = CONFIG.pesanKejutan;
      }
      event.currentTarget.textContent = "Kejutan sudah terbuka ♡";
      burstParticles(event.currentTarget);
    });
}

function pilihFoto(inputId) {
  const inputEl = document.getElementById(inputId);
  if (inputEl) inputEl.click();
}

function gantiFoto(event, imgId) {
  const file = event.target.files[0]; // Menambahkan index [0] agar membaca single file dengan benar
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgEl = document.getElementById(imgId);
      if (imgEl) imgEl.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}
