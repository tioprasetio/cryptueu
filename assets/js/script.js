window.addEventListener("load", function () {
  // console.log(document.querySelector("#showMenu"));
  document
    .querySelector("#showMenu")
    .addEventListener("click", function (event) {
      document.querySelector("#mobileNav").classList.remove("hidden");
    });

  document
    .querySelector("#hideMenu")
    .addEventListener("click", function (event) {
      document.querySelector("#mobileNav").classList.add("hidden");
    });

    document
    .querySelector("#nav")
    .addEventListener("click", function (event) {
      document.querySelector("#mobileNav").classList.add("hidden");
    });

  document.querySelectorAll("[toggleElement]").forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      // console.log(toggle);
      const answerElement = toggle.querySelector("[answer]");
      const caretElement = toggle.querySelector("img");
      console.log(answerElement);
      if (answerElement.classList.contains("hidden")) {
        answerElement.classList.remove("hidden");
        caretElement.classList.add("rotate-90");
      } else {
        answerElement.classList.add("hidden");
        caretElement.classList.remove("rotate-90");
      }
    });
  });
});

/*==================== SCROLL REVEAL ANIMATION ====================*/
document.addEventListener("DOMContentLoaded", () => {
  ScrollReveal().reveal(".judul", {
    duration: 2000, // Durasi animasi dalam milidetik
    origin: "top", // Asal animasi dari bawah
    distance: "30px", // Jarak elemen bergerak
    reset: true, // Ulangi animasi setiap kali elemen muncul
  });
  ScrollReveal().reveal(
    ".macbook, .cara-kerja2, .cara-kerja3, .cara-kerja4, .cara-kerja5, .fitur1, .box-crypt",
    {
      duration: 2000, // Durasi animasi dalam milidetik
      origin: "bottom", // Asal animasi dari bawah
      distance: "30px", // Jarak elemen bergerak
      reset: true, // Ulangi animasi setiap kali elemen muncul
    }
  );
  ScrollReveal().reveal(
    ".fitur2",
    {
      duration: 2000, // Durasi animasi dalam milidetik
      origin: "bottom", // Asal animasi dari bawah
      distance: "30px", // Jarak elemen bergerak
      delay: 400,
      reset: true, // Ulangi animasi setiap kali elemen muncul
    }
  );
  ScrollReveal().reveal(".btn-ayo", {
    duration: 2000, // Durasi animasi dalam milidetik
    origin: "bottom", // Asal animasi dari bawah
    distance: "30px", // Jarak elemen bergerak
    delay: 3500,
    reset: false, // Ulangi animasi setiap kali elemen muncul
  });
});