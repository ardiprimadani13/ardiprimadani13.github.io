// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productName, productPrice, productImage, size) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === productName && item.size === size);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, image: productImage, size: size, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produk telah ditambahkan ke keranjang!');
    updateCheckoutTotal();
    closeModal(); // Assuming closeModal function hides the modal
}


function buyNow(productName, productPrice, productImage, availableSizes) {
    const selectedSize = prompt("Silakan pilih ukuran: " + availableSizes.join(", "));
    
    if (selectedSize && availableSizes.includes(selectedSize)) {
        addToCart(productName, productPrice, productImage, selectedSize);
        window.location.href = 'checkout.html'; // Arahkan pengguna ke checkout.html setelah menambahkan ke keranjang
    } else {
        alert("Silakan pilih ukuran yang tersedia.");
    }
}



// Fungsi untuk memuat keranjang dan menampilkan isinya
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart');
    if (cartContainer) {
        cartContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <p>${item.name}</p>
                    <p>Ukuran: ${item.size}</p> <!-- Tampilkan ukuran yang dipilih -->
                    <p>Harga: Rp${item.price}</p>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    <button onclick="removeFromCart(${index})">Hapus</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });
    }
    updateCheckoutTotal();
}

// Fungsi untuk memperbarui kuantitas produk di keranjang
function updateQuantity(index, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Fungsi untuk menghapus produk dari keranjang
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Fungsi untuk memperbarui total checkout
function updateCheckoutTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    // Diskon 20%
    const discount = totalPrice * 0.2;
    const totalAfterDiscount = totalPrice - discount;

    const totalProductsElement = document.getElementById('total-products');
    const totalPriceElement = document.getElementById('total-price');
    const discountElement = document.getElementById('discount');
    const totalAfterDiscountElement = document.getElementById('total-after-discount');

    if (totalProductsElement) {
        totalProductsElement.textContent = totalQuantity.toLocaleString('id-ID');
    }
    if (totalPriceElement) {
        totalPriceElement.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }
    if (discountElement) {
        discountElement.textContent = `Rp ${discount.toLocaleString('id-ID')} (20%)`;
    }
    if (totalAfterDiscountElement) {
        totalAfterDiscountElement.textContent = `Rp ${totalAfterDiscount.toLocaleString('id-ID')}`;
    }
}

// Fungsi untuk mengonfirmasi pesanan
function confirmOrder() {
    alert('Pesanan berhasil dilakukan!');
    localStorage.removeItem('cart');
    localStorage.removeItem('orderInfo');
    window.location.href = 'thankyou.html';
}

// Event listener untuk memuat keranjang saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const paymentMethod = document.getElementById('payment-method').value;
            const province = document.getElementById('province').value;

            const orderInfo = {
                name,
                phone,
                province,
                address,
                message,
                paymentMethod,
                cart: JSON.parse(localStorage.getItem('cart')) || [] // Pastikan ukuran juga disertakan di sini
            };
            
            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
            window.location.href = 'order.html';
        });
    }
});

    const orderDetails = document.getElementById('order-details');
    if (orderDetails) {
        const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
        if (orderInfo) {
            let totalAfterDiscount = calculateTotalAfterDiscount(orderInfo.cart);
    
            orderDetails.innerHTML = `
                <h3>Informasi Pelanggan</h3>
                <p>Nama: ${orderInfo.name}</p>
                <p>Telepon: ${orderInfo.phone}</p>
                <p>Provinsi: ${orderInfo.province}</p>
                <p>Alamat: ${orderInfo.address}</p>
                <p>Pesan Tambahan: ${orderInfo.message}</p>
                <h3>Ringkasan Pesanan</h3>
                <table>
                    <tr>
                        <th>Nama Produk</th>
                        <th>Harga</th>
                        <th>Diskon</th>
                        <th>ukuran</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                    </tr>
                    ${orderInfo.cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                            <td>Rp ${(item.price * item.quantity * 0.2).toLocaleString('id-ID')}</td>
                            <td>${item.size}</td> <!-- Menampilkan ukuran -->
                            <td>${item.quantity}</td>
                            <td>Rp ${((item.price * item.quantity) - (item.price * item.quantity * 0.2))}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="5"><strong>Total Pembayaran</strong></td>
                        <td><strong>Rp ${totalAfterDiscount}</strong></td>
                    </tr>
                </table>
            `;
        }
    }
    

function calculateTotalAfterDiscount(cart) {
    let totalPayment = 0;
    cart.forEach(item => {
        totalPayment += item.price * item.quantity;
    });

    // Diskon 20%
    const discount = totalPayment * 0.2;
    const totalAfterDiscount = totalPayment - discount;

    return totalAfterDiscount.toLocaleString('id-ID');
}


// Event listener untuk menampilkan email pengguna
document.addEventListener('DOMContentLoaded', function() {
    var userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        document.getElementById('welcomeMessage').innerHTML = 
            `Selamat Datang, <span class="user-email">${userEmail}</span>`;
    }
});

// Event listener untuk menambahkan event pencarian produk
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('searchQuery').value;
        const productType = document.getElementById('productType').value;
        const searchUrl = `${productType}?query=${query}`;
        window.location.href = searchUrl;
    });
});

// Event listener untuk memuat produk berdasarkan kategori dan query
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const category = params.get('category');

    fetchProducts(category, query);
});

function showProductDetails(element) {
    const productName = element.parentElement.getAttribute('data-name');
    const productPrice = element.parentElement.getAttribute('data-price');
    const productDescription = element.parentElement.getAttribute('data-description').replace(/<br>/g, '\n');
    const productReviews = element.parentElement.getAttribute('data-reviews').split(';');

    document.getElementById('modalProductName').innerText = productName;
    document.getElementById('modalProductPrice').innerText = `Harga: Rp ${productPrice}`;
    document.getElementById('modalProductDescription').innerHTML = productDescription.replace(/\n/g, '<br>');

    const reviewsList = document.getElementById('modalProductReviews');
    reviewsList.innerHTML = '';

    productReviews.forEach(review => {
        const [reviewText, reviewer, rating] = review.split(' - ');
        const reviewItem = document.createElement('li');
        reviewItem.innerHTML = `${reviewText} <strong>${reviewer}</strong> <span>${'★'.repeat(rating)}</span>`;
        reviewsList.appendChild(reviewItem);
    });

    document.getElementById('productModal').style.display = 'block';

    // Define buyNow function inside showProductDetails

}


// Event listener untuk menangani carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function showSlide(index) {
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    setInterval(nextSlide, 3000); // Ganti gambar setiap 3 detik
});

// Event listener untuk pencarian produk
document.addEventListener('DOMContentLoaded', function() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var keyword = urlParams.get('query');
    searchProducts(keyword);
});

function searchProducts(keyword) {
    var products = document.querySelectorAll('.product');

    products.forEach(function(product) {
        var productName = product.querySelector('p').textContent.toLowerCase();
        var productDiv = product.closest('.product');
        if (productName.includes(keyword.toLowerCase())) {
            productDiv.style.display = 'block';
        } else {
            productDiv.style.display = 'none';
        }
    });
}
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', function() {
    const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
    const discount = orderInfo.discount || 0;

    const orderItems = document.getElementById('order-items');
    let totalAfterDiscount = 0;

    orderInfo.cart.forEach(item => {
        const totalPrice = item.price * item.quantity;
        const discountedPrice = totalPrice - (totalPrice * discount);
        totalAfterDiscount += discountedPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Rp${item.price}</td>
            <td>Rp${(item.price * item.quantity * discount).toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>Rp${discountedPrice.toFixed(2)}</td>
        `;

        orderItems.appendChild(row);
    });

    const totalAfterDiscountElement = document.getElementById('total-after-discount');
    totalAfterDiscountElement.textContent = `Rp${totalAfterDiscount.toFixed(2)}`;
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('send-otp').addEventListener('click', function() {
        const phoneNumber = document.getElementById('phone-number').value;
        if (phoneNumber) {
            alert(`Kode OTP telah dikirim ke nomor: ${phoneNumber}`);
            document.getElementById('otp-section').style.display = "block";
        } else {
            alert("Silakan masukkan nomor telepon.");
        }
    });

    document.getElementById('phone-login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const otpCode = [
            document.getElementById('otp-1').value,
            document.getElementById('otp-2').value,
            document.getElementById('otp-3').value,
            document.getElementById('otp-4').value
        ].join('');
        if (otpCode.length === 4) {
            alert(`Kode OTP ${otpCode} berhasil diverifikasi.`);
            localStorage.setItem('userPhone', document.getElementById('phone-number').value);
            window.location.href = 'index.html';
        } else {
            alert("Silakan masukkan kode OTP yang valid.");
        }
    });

    const otpInputs = document.querySelectorAll('.otp-inputs input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
    });
});


// Fungsi untuk memulai percakapan dengan penjual
function chatWithSeller(productName, productPrice, productImage) {
    var productDetails = {
        name: productName,
        price: productPrice,
        image: productImage
    };
    localStorage.setItem('chatProductDetails', JSON.stringify(productDetails));
    window.location.href = 'chat.html';
}

// Function to open modal for entering order ID
function enterResiNumber(productName) {
    document.getElementById('resiModal').style.display = 'block';
    // Set product name as reference for entering order ID
    document.getElementById('resiInput').setAttribute('data-product', productName);
}

// Function to close modal for entering order ID
function closeResiModal() {
    document.getElementById('resiModal').style.display = 'none';
}

// Function to check entered order ID
function checkResiNumber(productName) {
    const orderIdInput = document.getElementById('resiInput').value.trim();
    // Example correct order ID for 'Sepatu Adidas'
    const correctOrderId = '123456789';

    if (orderIdInput === correctOrderId) {
        // Correct order ID, proceed to rating
        openRatingModal(productName, correctOrderId);
    } else {
        // Incorrect order ID, show error message
        alert('Nomor Pesanan ID tidak valid untuk produk ini.');
        closeResiModal();
    }
}

// Function to open rating modal
function openRatingModal(productName, orderId) {
    document.getElementById('ratingModal').style.display = 'block';
    document.getElementById('productResi').innerText = `Nomor Pesanan ID: ${orderId}`;
    document.getElementById('selectedProduct').innerText = `Produk: ${productName}`;
}

// Function to close rating modal
function closeRatingModal() {
    document.getElementById('ratingModal').style.display = 'none';
}

// Event listener to handle star rating selection
document.addEventListener('DOMContentLoaded', function() {
    var stars = document.querySelectorAll('.rating .star');
    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            var value = parseInt(star.getAttribute('data-value'));
            setRating(value);
        });
    });
});


// Fungsi untuk menetapkan nilai bintang yang dipilih
function setRating(value) {
    selectedRating = value;

    // Menghapus kelas 'checked' dari semua bintang
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => star.classList.remove('checked'));

    // Menambahkan kelas 'checked' ke bintang yang memiliki nilai sesuai
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
            star.classList.add('checked');
        }
    });

    // Menyimpan nilai bintang yang dipilih ke input hidden
    document.getElementById('selectedRating').value = selectedRating;
}

// Fungsi untuk mengirim penilaian
function submitRating() {
    // Ambil nilai ulasan
    const reviewText = document.getElementById('reviewText').value;

    // Lakukan sesuatu dengan nilai rating (selectedRating) dan ulasan (reviewText) di sini
    console.log('Rating:', selectedRating);
    console.log('Ulasan:', reviewText);

    // Tambahan: setelah mengirim penilaian, bisa saja Anda ingin menutup modal
    closeRatingModal();
}

window.trackResi = function() {
    const resiInput = document.getElementById('resiInput').value.trim();
    const trackingResult = document.getElementById('trackingResult');
    const trackingTable = document.getElementById('trackingTable');
    const trackingTableBody = document.querySelector('#trackingTable tbody');
    const noTrackingData = document.getElementById('noTrackingData');

    // Bersihkan tabel dan pesan sebelumnya
    trackingTableBody.innerHTML = '';
    trackingTable.style.display = 'none';
    noTrackingData.style.display = 'none';

    if (resiInput === '') {
        noTrackingData.textContent = 'Harap masukkan nomor resi.';
        noTrackingData.style.display = 'block';
    } else if (trackingData[resiInput]) {
        const trackingInfo = trackingData[resiInput];

        trackingInfo.forEach(info => {
            const trackingRow = document.createElement('tr');
            trackingRow.innerHTML = `<td style="border: 1px solid #ccc; padding: 8px;">${info.date}</td>
                                     <td style="border: 1px solid #ccc; padding: 8px;">${info.location}</td>
                                     <td style="border: 1px solid #ccc; padding: 8px;">${info.status}</td>`;
            trackingTableBody.appendChild(trackingRow);
        });

        trackingTable.style.display = 'table'; // Tampilkan tabel dengan data
    } else {
        noTrackingData.textContent = 'Nomor resi tidak ditemukan. Silakan coba lagi.';
        noTrackingData.style.display = 'block';
    }
};

// JavaScript for flash sale countdown timer
function flashSaleCountdown() {
    const endDate = new Date().getTime() + (3 * 60 * 60 * 1000); // 3 hours from now
    const countdownElement = document.getElementById('flashSaleCountdown');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${hours} : ${minutes} : ${seconds}`;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "FLASH SALE BERAKHIR";
        }
    }

    const interval = setInterval(updateCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    flashSaleCountdown();
});
