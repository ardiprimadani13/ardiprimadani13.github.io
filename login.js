document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    // Lakukan validasi login di sini
    // Contoh sederhana: jika username dan password adalah 'admin'
    if (username === 'admin' && password === 'admin') {
        alert('Login berhasil!');
        localStorage.setItem('loggedIn', 'true'); // Simpan status login di local storage
        window.location.href = 'index.html'; // Arahkan kembali ke halaman beranda setelah login berhasil
    } else {
        alert('Login gagal. Harap periksa kembali username dan password Anda.');
    }
});
