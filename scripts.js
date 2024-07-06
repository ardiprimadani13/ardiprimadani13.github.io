// JavaScript untuk mengontrol tampilan sidebar
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px';
    }
}

// JavaScript untuk slideshow
var slideIndex = 0;
showSlides();

function showSlides() {
    var slides = document.getElementsByClassName("mySlides");
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 5000); // Ubah gambar setiap 5 detik
}

function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "250px";
    } else {
        sidebar.style.width = "0";
    }
}

function logout() {
    // Lakukan proses logout di sini jika diperlukan, misalnya menghapus token atau data sesi

    // Redirect ke halaman login
    window.location.href = "index.html";
}

// script.js
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    var formData = {
        nama: document.getElementById('nama').value,
        email: document.getElementById('email').value,
        alamat: document.getElementById('alamat').value,
        telepon: document.getElementById('telepon').value
    };

    // Save data to localStorage
    localStorage.setItem('formData', JSON.stringify(formData));

    // Redirect to data.html
    window.location.href = 'data.html';
});

