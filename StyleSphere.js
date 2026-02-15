const products = [{
        id: 1,
        name: "Denim Jacket",
        brand: "Levi's",
        price: 90,
        category: "men",
        isNew: true,
        onSale: false,
        img: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    },
    {
        id: 2,
        name: "Running Shoes",
        brand: "Nike",
        price: 120,
        category: "shoes",
        isNew: false,
        onSale: true,
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        id: 3,
        name: "Handbag",
        brand: "Zara",
        price: 70,
        category: "women",
        isNew: true,
        onSale: false,
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
    },
    {
        id: 4,
        name: "Watch",
        brand: "Daniel",
        price: 150,
        category: "accessories",
        isNew: false,
        onSale: true,
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
        id: 5,
        name: "Casual T-Shirt",
        brand: "Nike",
        price: 35,
        category: "men",
        isNew: true,
        onSale: false,
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        id: 6,
        name: "Floral Dress",
        brand: "Zara",
        price: 95,
        category: "women",
        isNew: false,
        onSale: true,
        img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c"
    }
];

let cart = JSON.parse(localStorage.cart || "[]");
let wishlist = JSON.parse(localStorage.wishlist || "[]");

/* ---------- PAGE SWITCH ---------- */

function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
    if (id === "cart") renderCart();
    if (id === "wishlist") renderWishlist();
}

/* ---------- USER ---------- */

function saveUser() {
    let u = {
        name: uName.value,
        email: uEmail.value,
        phone: uPhone.value
    };
    localStorage.user = JSON.stringify(u);
    navUser.innerText = "Hi, " + u.name;
    bootstrap.Modal.getInstance(userModal).hide();
}

function checkUser() {
    let u = localStorage.user;
    if (!u) new bootstrap.Modal(userModal).show();
    else navUser.innerText = "Hi, " + JSON.parse(u).name;
}
checkUser();

/* ---------- DARK MODE ---------- */

function toggleDark() {
    document.body.classList.toggle("dark");
    localStorage.dark = document.body.classList.contains("dark");
}
if (localStorage.dark === "true") document.body.classList.add("dark");

/* ---------- PRODUCTS ---------- */

function openAllProducts() {
    showPage("products");
    renderProducts();
}

function filterNew() {
    showPage("products");
    renderProducts(p => p.isNew);
}

function filterSale() {
    showPage("products");
    renderProducts(p => p.onSale);
}

function renderProducts(filterFn) {
    let list = [...products];
    if (filterFn) list = list.filter(filterFn);

    let q = searchInput.value.toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));

    let s = sortSelect.value;
    if (s === "low") list.sort((a, b) => a.price - b.price);
    if (s === "high") list.sort((a, b) => b.price - a.price);

    productGrid.innerHTML = list.map(p => `
<div class="col-md-3 mb-4">
<div class="product-card" onclick="openDetail(${p.id})">
<div class="product-img-wrap">
<img src="${p.img}">
<button class="btn btn-primary add-cart-hover" onclick="event.stopPropagation();addCart(${p.id})">Add to Cart</button>
</div>
<div class="p-2">
<b>${p.name}</b><br>$${p.price}
</div>
</div></div>`).join("");
}

/* ---------- DETAIL ---------- */

function openDetail(id) {
    let p = products.find(x => x.id === id);
    detailBody.innerHTML = `
<div class="row">
<div class="col-md-6"><img class="img-fluid" src="${p.img}"></div>
<div class="col-md-6">
<h3>${p.name}</h3>
<p>$${p.price}</p>
<select id="sizeSel" class="form-select w-50 mb-2">
<option value="">Select Size</option><option>S</option><option>M</option><option>L</option>
</select>
<input id="qtySel" type="number" value="1" min="1" class="form-control w-25 mb-2">
<button class="btn btn-primary" onclick="addCart(${p.id})">Add to Cart</button>
</div></div>`;
    showPage("detail");
}

/* ---------- CART ---------- */

function addCart(id) {
    let qty = 1;

    const qtyInput = document.getElementById("qtySel");
    if (qtyInput) {
        qty = parseInt(qtyInput.value) || 1;
    }

    cart.push({
        id,
        qty
    });
    localStorage.cart = JSON.stringify(cart);

    updateCounts();
    alert("Added to cart ✅");
}


function renderCart() {
    if (!cart.length) {
        cartBody.innerHTML = `Cart empty <button class="btn btn-primary" onclick="openAllProducts()">Continue Shopping</button>`;
        return;
    }
    cartBody.innerHTML = cart.map((c, i) => {
        let p = products.find(x => x.id === c.id);
        return `<div class="border p-2 mb-2">${p.name} x ${c.qty}
<button onclick="removeCart(${i})">❌</button></div>`;
    }).join("");
}

function removeCart(i) {
    cart.splice(i, 1);
    localStorage.cart = JSON.stringify(cart);
    renderCart();
    updateCounts();
}

/* ---------- WISHLIST ---------- */

function renderWishlist() {
    if (!wishlist.length) {
        wishBody.innerHTML = `Wishlist empty <button onclick="openAllProducts()" class="btn btn-primary">Shop</button>`;
        return;
    }
    wishBody.innerHTML = wishlist.map(id => {
        let p = products.find(x => x.id === id);
        return `<div>${p.name}</div>`;
    }).join("");
}

/* ---------- COUNTS ---------- */

function updateCounts() {
    cartCount.innerText = cart.length;
    wishCount.innerText = wishlist.length;
}
updateCounts();

searchInput.oninput = renderProducts;

function filterCategory(cat) {
    showPage("products");
    renderProducts(p => p.category === cat);
}

function subscribeNews() {
    let e = newsEmail.value;
    if (!e.includes("@")) return alert("Enter valid email");
    alert("Subscribed successfully ✅");
    newsEmail.value = "";
}

function showInfo(type) {
    showPage("profile");
    profileBody.innerHTML = `<h4 class="mb-3 text-capitalize">${type}</h4>
<p>This is demo content for ${type} page.</p>`;
}

function renderFeatured() {
    let list = products.slice(0, 4);

    featuredGrid.innerHTML = list.map(p => `
<div class="col-md-3 mb-4">
<div class="product-card" onclick="openDetail(${p.id})">
<div class="product-img-wrap">
<img src="${p.img}">
<button class="btn btn-primary add-cart-hover"
onclick="event.stopPropagation();addCart(${p.id})">
Add to Cart
</button>
</div>
<div class="p-2">
<b>${p.name}</b><br>$${p.price}
</div>
</div>
</div>
`).join("");
}

renderFeatured();
