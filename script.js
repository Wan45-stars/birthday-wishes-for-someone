// CONFIGURATION ASLI BEBAS ERROR
const CONFIG = {
  namaPanggilan: "Sayang", 
  musikFile: "" 
};

// Variabel penampung parameter gambar hasil generate
let linkFoto1 = "";
let linkFoto2 = "";
let linkFoto3 = "";

// Ambil element DOM asli bawaan Anda
const recipientLetterInput = document.getElementById("recipientLetterInput");
const copyBtn = document.getElementById("copy-btn");
const shareLinkInput = document.getElementById("shareLinkInput");

// ==========================================
// 1. FUNGSI BAWAAN ASLI: UNTUK MENGAKSIKAN KLIK FOTO
// ==========================================
window.pilihFoto = function(inputId) {
  const inputEl = document.getElementById(inputId);
  if (inputEl) {
    inputEl.click();
  }
};

// ==========================================
// 2. FUNGSI FIX: PROSES UPLOAD OTOMATIS KE IMGBB
// ==========================================
window.gantiFoto = async function(event, imgId) {
  const file = event.target.files[0]; // Membaca file gambar pertama secara tepat
  if (!file) return;

  if (copyBtn) copyBtn.textContent = "Mengupload foto... ⏳";

  const formData = new FormData();
  formData.append("image", file);

  // API Key ImgBB Anda langsung ditanam
  const MY_API_KEY = "dbff725afa76d3cca8e851ae9653993e"; 

  try {
    // Memanggil alamat API resmi ImgBB tanpa menggunakan kurung yang merusak
    const response = await fetch(`https://imgbb.com{MY_API_KEY}`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    
    if (data.success) {
      const urlGambarSelesai = data.data.url;
      
      // Simpan URL gambar online ke parameter share link Anda
      if (imgId === "img-memory-1") linkFoto1 = urlGambarSelesai;
      if (imgId === "img-memory-2") linkFoto2 = urlGambarSelesai;
      if (imgId === "img-memory-3") linkFoto3 = urlGambarSelesai;

      // Update langsung preview foto di layar browser agar muncul gambarnya
      const imgTarget = document.getElementById(imgId);
      if (imgTarget) {
        imgTarget.src = urlGambarSelesai;
        imgTarget.style.opacity = "1";
      }

      // Perbarui tautan pembagian secara otomatis
      const namaAktif = (recipientLetterInput && recipientLetterInput.value) ? recipientLetterInput.value.trim() : "";
      updateShareLink(namaAktif);
      
      if (copyBtn) copyBtn.textContent = "Salin Link 🔗";
    } else {
      console.error("ImgBB Error:", data.error);
      if (copyBtn) copyBtn.textContent = "Gagal upload foto ❌";
    }
  } catch (error) {
    console.error("Gagal mengunggah foto:", error);
    if (copyBtn) copyBtn.textContent = "Gagal upload foto ❌";
  }
};

// ==========================================
// 3. FUNGSI BAWAAN ASLI: PERAKIT URL DINAMIS
// ==========================================
window.updateShareLink = function(nama) {
  const baseUrl = window.location.origin + window.location.pathname;
  let customUrl = `${baseUrl}?nama=${encodeURIComponent(nama)}`;
  
  if (linkFoto1) customUrl += `&f1=${encodeURIComponent(linkFoto1)}`;
  if (linkFoto2) customUrl += `&f2=${encodeURIComponent(linkFoto2)}`;
  if (linkFoto3) customUrl += `&f3=${encodeURIComponent(linkFoto3)}`;
  
  if (shareLinkInput) {
    shareLinkInput.value = customUrl;
  }
};

// ==========================================
// 4. FUNGSI BAWAAN ASLI: UNTUK MENYALIN LINK
// ==========================================
window.salinTautan = function() {
  if (shareLinkInput && shareLinkInput.value) {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareLinkInput.value);
    
    if (copyBtn) {
      copyBtn.textContent = "Tersalin! ✔️";
      setTimeout(() => {
        copyBtn.textContent = "Salin Link 🔗";
      }, 2000);
    }
  }
};

// ==========================================
// 5. LOGIKA INIT DDOMContentLoaded ASLI TEMPLATE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const namaDariLink = urlParams.get("nama");
  const f1 = urlParams.get("f1");
  const f2 = urlParams.get("f2");
  const f3 = urlParams.get("f3");

  // MODE BACA (Jika dibuka pacar lewat link generate)
  if (namaDariLink) {
    if (recipientLetterInput) {
      recipientLetterInput.value = namaDariLink;
      recipientLetterInput.disabled = true;
    }
    
    // Memunculkan gambar kiriman pengguna dari URL
    if (f1) { const m1 = document.getElementById("img-memory-1"); if(m1) m1.src = f1; }
    if (f2) { const m2 = document.getElementById("img-memory-2"); if(m2) m2.src = f2; }
    if (f3) { const m3 = document.getElementById("img-memory-3"); if(m3) m3.src = f3; }
    
    // Menyembunyikan alat editor
    const generatorArea = document.getElementById("generator-area");
    if (generatorArea) generatorArea.style.display = "none";
  } else {
    // MODE EDIT (Oleh pembuat pertama kali)
    if (recipientLetterInput) {
      recipientLetterInput.addEventListener("input", (e) => {
        updateShareLink(e.target.value);
      });
    }
  }
});
