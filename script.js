const WHATSAPP_NUMBER = "919158448613";

const products = [
  { id: "karanji", name: "Karanji", marathi: "करंजी", price: 650, image: "images/karanji.jpg" },
  { id: "besan-ladoo", name: "Besan Ladoo", marathi: "बेसन लाडू", price: 600, image: "images/besan-ladoo.jpg" },
  { id: "rava-ladoo", name: "Rava Ladoo", marathi: "रवा लाडू", price: 560, image: "images/rava-ladoo.jpg" },
  { id: "chakli", name: "Bhajanichi Chakli", marathi: "भाजणीची चकली", price: 550, image: "images/bhajanichi-chakli.jpg" },
  { id: "sweet-shankarpali", name: "Sweet Shankarpali", marathi: "गोड शंकरपाळी", price: 460, image: "images/sweet-shankarpali.jpg" },
  { id: "khari-shankarpali", name: "Khari Shankarpali", marathi: "खारी शंकरपाळी", price: 460, image: "images/khari-shankarpali.jpg" },
  { id: "tikhat-shev", name: "Tikhat Shev", marathi: "तिखट शेव", price: 480, image: "images/tikhat-shev.jpg" },
  { id: "mithatli-shev", name: "Mithatli Shev", marathi: "मिठातली शेव", price: 450, image: "images/mithatli-shev.jpg" },
  { id: "bhajke-pohe-chivda", name: "Bhajke Pohe Chivda", marathi: "भाजके पोहे चिवडा", price: 460, image: "images/bhajke-pohe-chivda.jpg" },
  { id: "patal-pohe-chivda", name: "Patal Pohe Chivda", marathi: "पातळ पोहे चिवडा", price: 460, image: "images/patal-pohe-chivda.jpg" },
  { id: "maka-pohe-chivda", name: "Maka Pohe Chivda", marathi: "मका पोहे चिवडा", price: 460, image: "images/maka-pohe-chivda.jpg" }
];

const cart = [];
const money = amount => "₹" + amount.toLocaleString("en-IN");
const grid = document.getElementById("products");

products.forEach((product, index) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-image-wrap">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      <span class="product-number">FARAL ${String(index + 1).padStart(2, "0")}</span>
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-marathi">${product.marathi}</p>
      <p class="price">${money(product.price)} <small>/ kg</small></p>
      <div class="product-controls">
        <select class="weight-select" id="weight-${product.id}" aria-label="Choose weight for ${product.name}">
          <option value="0.5">½ kg — ${money(product.price / 2)}</option>
          <option value="1">1 kg — ${money(product.price)}</option>
        </select>
        <button class="add-button" type="button" data-product="${product.id}">+ Add</button>
      </div>
    </div>`;
  grid.appendChild(card);
});

grid.addEventListener("click", event => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  const product = products.find(item => item.id === button.dataset.product);
  const weight = Number(document.getElementById(`weight-${product.id}`).value);
  const existing = cart.find(item => item.id === product.id && item.weight === weight);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, weight, quantity: 1 });
  button.textContent = "✓ Added";
  button.classList.add("added");
  setTimeout(() => { button.textContent = "+ Add"; button.classList.remove("added"); }, 900);
  renderCart();
});

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const empty = document.getElementById("empty-cart");
  cartItems.innerHTML = "";
  empty.style.display = cart.length ? "none" : "block";
  cart.forEach((item, index) => {
    const lineTotal = item.price * item.weight * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div><div class="cart-item-name">${item.name} <span style="font-weight:400;color:#80675a">(${item.marathi})</span></div>
      <div class="cart-item-meta">${item.weight === 0.5 ? "½ kg" : "1 kg"} × ${item.quantity}</div></div>
      <div class="cart-item-right"><span class="cart-item-price">${money(lineTotal)}</span>
      <button class="remove-button" type="button" data-remove="${index}" aria-label="Remove ${item.name}">×</button></div>`;
    cartItems.appendChild(row);
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.weight * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("total").textContent = money(total);
  document.getElementById("floating-total").textContent = money(total);
  document.getElementById("cart-count").textContent = `${count} item${count === 1 ? "" : "s"}`;
}
document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  cart.splice(Number(button.dataset.remove), 1);
  renderCart();
});

document.getElementById("order-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) {
    alert("Please add at least one item to your order.");
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const note = document.getElementById("customer-note").value.trim();
  const total = cart.reduce((sum, item) => sum + item.price * item.weight * item.quantity, 0);
  const lines = [
    "🪔 *NEW DIWALI FARAL ORDER*",
    "",
    `Customer: ${name}`,
    `Phone: ${phone}`,
    ...(address ? [`Address / pickup: ${address}`] : []),
    "",
    "*Order items:*",
    ...cart.map((item, i) => `${i + 1}. ${item.name} (${item.marathi}) — ${item.weight === 0.5 ? "½ kg" : "1 kg"} × ${item.quantity} = ${money(item.price * item.weight * item.quantity)}`),
    "",
    `*Estimated total: ${money(total)}*`,
    ...(note ? ["", `Note: ${note}`] : []),
    "",
    "Please confirm availability and pickup/delivery details."
  ];
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
renderCart();
