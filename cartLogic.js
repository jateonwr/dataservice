function updateCartVisibility() {
    const cartBtn = document.getElementById('header-cart-btn');
    if (!cartBtn) return;

    if (isLoggedIn && currentPage === 'catalog') {
        cartBtn.classList.remove('hidden');
    } else {
        cartBtn.classList.add('hidden');
    }
}
