let publicKey, privateKey;

const privateKeyTextarea = document.getElementById("private-key");
const publicKeyTextarea = document.getElementById("public-key");

// Pastikan tetap readonly meskipun properti dihapus
privateKeyTextarea.addEventListener("focus", () => {
  privateKeyTextarea.readOnly = true; // Kembalikan readonly jika dihapus
});
publicKeyTextarea.addEventListener("focus", () => {
  publicKeyTextarea.readOnly = true; // Kembalikan readonly jika dihapus
});

// START MEMBUAT KUNCI RSA
async function generateKeys() {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt", "decrypt"]
    );

    publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    // KONVERSI KUNCI KE FORMAT PEM
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${btoa(
      String.fromCharCode(...new Uint8Array(publicKey))
    )}\n-----END PUBLIC KEY-----`;

    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${btoa(
      String.fromCharCode(...new Uint8Array(privateKey))
    )}\n-----END PRIVATE KEY-----`;

    // MUNCULKAN KUNCI KE TAMPILAN
    document.getElementById("public-key").value = publicKeyPem;
    document.getElementById("private-key").value = privateKeyPem;

    Swal.fire({
      icon: "success",
      title: "Kunci Terbuat",
      text: "Kunci Public dan Private berhasil dibuat. Jaga kerahasiaan Private Key ya!",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal membuat kunci",
      text: "Terjadi kesalahan saat membuat kunci RSA. Silahkan coba lagi",
    });
    console.error(error);
  }
}
// END MEMBUAT KUNCI RSA

// START ENKRIPSI DATA
async function encryptData() {
  try {
    const text = document.getElementById("text").value.trim();
    if (!text) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Mohon masukkan text yang akan dienkripsi.",
      });
      return;
    }

    const publicKeyPem = document.getElementById("encryption-public-key").value.trim();
    if (!publicKeyPem) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Kunci Public kosong. Silahkan buat terlebih dahulu.",
      });
      return;
    }

    const publicKeyBuffer = Uint8Array.from(
      atob(
        publicKeyPem
          .replace("-----BEGIN PUBLIC KEY-----", "")
          .replace("-----END PUBLIC KEY-----", "")
          .replace(/\s+/g, "")
      ),
      (c) => c.charCodeAt(0)
    );

    const importedPublicKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      false,
      ["encrypt"]
    );

    const encryptedData = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      importedPublicKey,
      new TextEncoder().encode(text)
    );

    document.getElementById("encrypted-output").value = btoa(
      String.fromCharCode(...new Uint8Array(encryptedData))
    );

    Swal.fire({
      icon: "success",
      title: "Enkripsi Berhasil",
      text: "Pesanmu berhasil dienkripsi.",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Enkripsi gagal",
      text: "Terjadi kesahalan saat Enkripsi. Pastikan kunci Public valid.",
    });
    console.error(error);
  }
}
// END ENKRIPSI DATA

// START DEKRIPSI DATA
async function decryptData() {
  try {
    const encryptedText = document
      .getElementById("encrypted-input")
      .value.trim();
    const privateKeyPem = document
      .getElementById("decrypt-private-key")
      .value.trim();

    if (!encryptedText || !privateKeyPem) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Masukkan teks terenkripsi dan Kunci Private",
      });
      return;
    }

    const privateKeyBuffer = Uint8Array.from(
      atob(
        privateKeyPem
          .replace("-----BEGIN PRIVATE KEY-----", "")
          .replace("-----END PRIVATE KEY-----", "")
          .replace(/\s+/g, "")
      ),
      (c) => c.charCodeAt(0)
    );

    const importedPrivateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      false,
      ["decrypt"]
    );

    const encryptedData = Uint8Array.from(atob(encryptedText), (c) =>
      c.charCodeAt(0)
    );

    const decryptedData = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      importedPrivateKey,
      encryptedData
    );

    document.getElementById("decrypted-output").value =
      new TextDecoder().decode(decryptedData);

    Swal.fire({
      icon: "success",
      title: "Dekripsi Berhasil",
      text: "Pesan kamu berhasil dideskripsi.",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Dekripsi Gagal",
      text: "Pastikan text terenkripsi dan Private Key benar.",
    });
    console.error(error);
  }
}
// END DEKRIPSI DATA

// START FUNGSI MUAT ULANG
function reset() {
  document.getElementById("text").value = "";
  document.getElementById("public-key").value = "";
  document.getElementById("private-key").value = "";
  document.getElementById("encryption-public-key").value = "";
  document.getElementById("encrypted-output").value = "";
  document.getElementById("encrypted-input").value = "";
  document.getElementById("decrypt-private-key").value = "";
  document.getElementById("decrypted-output").value = "";

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
          <li>Generate kunci RSA dengan klik tombol <b>"Buat kunci RSA"</b> untuk mendapatkan public dan private key untuk menerima dan mengirim pesan.</li>
          <li>Masukkan public key partner jika akan <b>mengirim pesan</b>.</li>
          <li>Masukkan pesan pada kolom <b>"Masukkan Text"</b> untuk dienkripsi.</li>
          <li>Klik tombol <b>"Encrypt"</b> untuk menghasilkan teks terenkripsi.</li>
          <li>Untuk dekripsi, masukkan teks terenkripsi dan private key anda pada kolom yang sesuai.</li>
          <li>Klik tombol <b>"Decrypt"</b> untuk mendapatkan teks asli.</li>
        </ul>
      `,
    icon: "info",
    confirmButtonText: "Mengerti",
  });
});
