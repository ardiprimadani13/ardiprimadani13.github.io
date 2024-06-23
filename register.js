document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    // Lakukan proses registrasi di sini (opsional)
    alert('Registrasi berhasil! Silakan login dengan akun yang sudah dibuat.');
    window.location.href = 'login.html'; // Arahkan kembali ke halaman login setelah registrasi berhasil
});

document.addEventListener('DOMContentLoaded', function() {
    const trackingData = {
        '1234567890': [
            { date: '2023-06-15', location: 'Surabaya' },
            { date: '2023-06-16', location: 'DC Jakarta' },
            { date: '2023-06-17', location: 'Penjaringan' }
        ],
        '0987654321': [
            { date: '2023-06-12', location: 'Malang' },
            { date: '2023-06-13', location: 'Surabaya' },
            { date: '2023-06-14', location: 'Sidoarjo' }
        ],
        // Tambahkan data resi lainnya sesuai kebutuhan
    };

    window.trackResi = function() {
        const resiInput = document.getElementById('resiInput').value.trim();
        const trackingResult = document.getElementById('trackingResult');

        if (resiInput === '') {
            trackingResult.innerHTML = '<p>Harap masukkan nomor resi.</p>';
        } else if (trackingData[resiInput]) {
            const trackingInfo = trackingData[resiInput];
            trackingResult.innerHTML = '';

            trackingInfo.forEach(info => {
                const trackingItem = document.createElement('div');
                trackingItem.className = 'tracking-item';
                trackingItem.innerHTML = `<span class="tracking-date">${info.date}</span> <span class="tracking-location">${info.location}</span>`;
                trackingResult.appendChild(trackingItem);
            });
        } else {
            trackingResult.innerHTML = '<p>Nomor resi tidak ditemukan. Silakan coba lagi.</p>';
        }
    };
});
