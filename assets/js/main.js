let publicKey, privateKey;

// Fungsi untuk menghitung GCD
function gcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function isPrime(num) {
  if (num <= 1) return false; // Bilangan <= 1 bukan bilangan prima
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false; // Jika habis dibagi, bukan bilangan prima
  }
  return true; // Jika lolos semua pengecekan, bilangan prima
}

// START MEMBUAT KUNCI RSA
async function generateKeys() {
  console.clear();
  try {
    // Ambil nilai p dan q dari input
    const p = parseInt(document.getElementById("prime-p").value.trim());
    const q = parseInt(document.getElementById("prime-q").value.trim());

    if (isNaN(p) || isNaN(q)) {
      Swal.fire({
        icon: "error",
        title: "Input Kosong",
        text: "Nilai p dan q tidak boleh kosong.",
      });
      return;
    }

    // Validasi jika p dan q sama
    if (p === q) {
      Swal.fire({
        icon: "error",
        title: "Input Tidak Valid",
        text: "Nilai p dan q tidak boleh sama.",
      });
      return;
    }

    // Validasi apakah p dan q adalah bilangan prima, jika tudak naka error
    if (!isPrime(p)) {
      Swal.fire({
        icon: "error",
        title: "Input Tidak Valid",
        text: "Nilai p harus bilangan prima.",
      });
      return;
    }

    if (!isPrime(q)) {
      Swal.fire({
        icon: "error",
        title: "Input Tidak Valid",
        text: "Nilai q harus bilangan prima.",
      });
      return;
    }

    // Hitung nilai n dan m
    const n = p * q; // n = p * q
    const m = (p - 1) * (q - 1); // m = (p-1) * (q-1)

    // Pilih nilai e secara dinamis yang memenuhi gcd(e, m) = 1
    let e = 0;
    for (let i = 2; i < m; i++) {
      if (gcd(i, m) === 1) {
        e = i;
        break; // Temukan e yang valid dan keluar dari loop
      }
    }

    // Jika tidak ada nilai e yang valid, akan error
    if (e === 0) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Tidak dapat menemukan nilai e yang valid.",
      });
      return;
    }

    // Hitung nilai d
    let d = 1;
    while ((d * e) % m !== 1) {
      d++;
    }

    // Simpan kunci
    publicKey = { e, n };
    privateKey = { d, n };

    // Tampilkan kunci ke pengguna
    document.getElementById("public-key").value = `e: ${e}, n: ${n}`;
    document.getElementById("private-key").value = `d: ${d}, n: ${n}`;

    console.log("Detail Kunci RSA:");
    console.log(`n (p * q): ${n}`);
    console.log(`m ((p - 1) * (q - 1)): ${m}`);
    console.log(
      `Kunci Public (e): ${e} (bilangan terkecil yang relatif prima dengan m=${m})`
    );
    console.log(
      `Kunci Private (d): ${d} (nilai d yang memenuhi (d * e) % m = 1)`
    );

    Swal.fire({
      icon: "success",
      title: "Kunci RSA Terbuat",
      text: "Jaga kerahasiaan Private key ya! enjoy.",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Membuat Kunci",
      text: "Terjadi kesalahan saat membuat kunci RSA. Silakan coba lagi.",
    });
    console.error(error);
  }
}
// END MEMBUAT KUNCI RSA

// START ENKRIPSI DATA
function encryptData() {
  try {
    const inputPublicKey = document
      .getElementById("encryption-public-key")
      .value.trim();
    const text = document.getElementById("text").value.trim();
    if (!text) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Mohon masukkan text yang akan dienkripsi.",
      });
      return;
    }

    if (!inputPublicKey) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Mohon masukkan Public Key untuk proses Enkripsi.",
      });
      return;
    }

    // Memvalidasi format public key: Harus sesuai dengan format "e: nilai, n: nilai"
    const publicKeyPattern = /^e:\s*\d+\s*,\s*n:\s*\d+$/;
    if (!publicKeyPattern.test(inputPublicKey)) {
      Swal.fire({
        icon: "error",
        title: "Enkripsi Gagal",
        text: "Format Public Key tidak valid. Harus sesuai dengan format 'e: nilai, n: nilai'.",
      });
      return;
    }

    const { e, n } = publicKey;
    const bigN = BigInt(n); // Konversi ke BigInt
    const bigE = BigInt(e);

    const charCodes = Array.from(text).map((char) =>
      BigInt(char.charCodeAt(0))
    );
    const encrypted = charCodes.map((code) => (code ** bigE % bigN).toString());

    document.getElementById("encrypted-output").value = encrypted.join(",");

    console.clear();

    // Cetak langkah-langkah enkripsi ke console biar aman
    console.log("Langkah-langkah Enkripsi:");
    console.log("ASCII dari plaintext:", charCodes.join(", "));
    charCodes.forEach((code, index) => {
      console.log(
        `Karakter '${text[index]}' -> ASCII(${code}) -> Enkripsi: (${code}^${bigE} mod ${bigN}) = ${encrypted[index]}`
      );
    });
    console.log("Hasil Enkripsi:", encrypted.join(", "));

    Swal.fire({
      icon: "success",
      title: "Enkripsi Berhasil",
      text: "Selamat! Pesan kamu sekarang terenkripsi.",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Enkripsi gagal",
      text: "Terjadi kesalahan saat Enkripsi. Pastikan kunci Public valid.",
    });
    console.error(error);
  }
}

// END ENKRIPSI DATA

// START DEKRIPSI DATA
function decryptData() {
  try {
    const encryptedText = document
      .getElementById("encrypted-input")
      .value.trim();
    const inputPrivateKey = document
      .getElementById("decrypt-private-key")
      .value.trim();

    if (!encryptedText) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Masukkan teks terenkripsi.",
      });
      return;
    }

    if (!inputPrivateKey) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Mohon masukkan Private Key untuk proses Dekripsi.",
      });
      return;
    }

    // Memvalidasi format public key: Harus sesuai dengan format "d: nilai, n: nilai"
    const privateKeyPattern = /^d:\s*\d+\s*,\s*n:\s*\d+$/;
    if (!privateKeyPattern.test(inputPrivateKey)) {
      Swal.fire({
        icon: "error",
        title: "Enkripsi Gagal",
        text: "Format Private Key tidak valid. Harus sesuai dengan format 'd: nilai, n: nilai'.",
      });
      return;
    }

    const encryptedArray = encryptedText.split(",").map((code) => BigInt(code));
    const { d, n } = privateKey;
    const bigN = BigInt(n); // Konversi ke BigInt
    const bigD = BigInt(d);

    const decrypted = encryptedArray
      .map((code) => Number(code ** bigD % bigN))
      .map((code) => String.fromCharCode(code))
      .join("");

    document.getElementById("decrypted-output").value = decrypted;

    console.clear();

    // Cetak langkah-langkah dekripsi ke console biar aman
    console.log("Langkah-langkah Dekripsi:");
    console.log("Teks terenkripsi:", encryptedArray.join(", "));
    encryptedArray.forEach((code, index) => {
      const ascii = Number(code ** bigD % bigN);
      console.log(
        `Elemen terenkripsi ${code} -> Dekripsi: (${code}^${bigD} mod ${bigN}) = ASCII(${ascii}) -> Karakter: '${String.fromCharCode(
          ascii
        )}'`
      );
    });
    console.log("Hasil Dekripsi:", decrypted);

    Swal.fire({
      icon: "success",
      title: "Dekripsi Berhasil",
      text: "Selamat! Pesan kamu berhasil didekripsi.",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Dekripsi Gagal",
      text: "Pastikan teks terenkripsi dan Private Key benar.",
    });
    console.error(error);
  }
}

// END DEKRIPSI DATA

// START FUNGSI MUAT ULANG
function reset() {
  document.getElementById("text").value = "";
  document.getElementById("prime-p").value = "";
  document.getElementById("prime-q").value = "";
  document.getElementById("public-key").value = "";
  document.getElementById("private-key").value = "";
  document.getElementById("encryption-public-key").value = "";
  document.getElementById("encrypted-output").value = "";
  document.getElementById("encrypted-input").value = "";
  document.getElementById("decrypt-private-key").value = "";
  document.getElementById("decrypted-output").value = "";
  console.clear();

  Swal.fire({
    icon: "success",
    title: "Dikosongkan",
    text: "Semua inputan sudah berhasil dibersihkan. Enjoy!",
  });
}
// END FUNGSI MUAT ULANG

// MENJALANKAN ALERT PANDUAN PENGGUNAAN KETIKA LOAD
document.addEventListener("DOMContentLoaded", function () {
  Swal.fire({
    title: "Panduan Penggunaan",
    html: `
        <ul style="text-align: left; list-style: disc; margin-left: 20px;">
          <li>Inputkan <b>bilangan prima P</b> dan <b>bilangan prima q</b>.</li>
          <li>Generate kunci RSA dengan klik tombol <b>"Buat kunci RSA"</b> untuk mendapatkan public dan private key.</li>
          <li>Masukkan pesan pada kolom <b>"Masukkan Text"</b> untuk dienkripsi.</li>
          <li>Klik tombol <b>"Enkripsi"</b> untuk menghasilkan teks terenkripsi.</li>
          <li>Untuk dekripsi, masukkan teks terenkripsi dan private key anda pada kolom yang sesuai.</li>
          <li>Klik tombol <b>"Dekripsi"</b> untuk mendapatkan teks asli.</li>
        </ul>
      `,
    icon: "info",
    confirmButtonText: "Mengerti",
  });
});
