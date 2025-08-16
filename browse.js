// Simple frontend cart using localStorage. Replace storage actions with API calls to your backend as needed.

const STORAGE_KEY = 'demo_bookstore_cart';

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }catch(e){
    return [];
  }
}
function saveCart(cart){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  renderCartCount();
}
function addToCart(book){
  const cart = getCart();
  const found = cart.find(b => b.id === book.id);
  if(found) found.qty += 1;
  else cart.push({...book, qty:1});
  saveCart(cart);
  //alert(`${book.title} ඇතුලත් වුණා ─ Cart එකට!`);
  // If you have backend: fetch('/api/cart', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({action:'add', book})})
}

function removeFromCart(id){
  let cart = getCart().filter(b=> b.id !== id);
  saveCart(cart);
  renderCartPage();
}

function renderCartCount(){
  const count = getCart().reduce((s,b)=>s+b.qty,0);
  const el = document.querySelectorAll('.cart-count');
  el.forEach(x => x.textContent = count);
}

/* --- Render cart small preview (for right column) --- */
function renderCartPreview(container){
  if(!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length===0){
    container.innerHTML = '<p class="small">Cart හි පොත් නැහැ.</p>';
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="meta">
        <div><strong>${item.title}</strong></div>
        <div class="small">Price: ${item.price} LKR • Qty: ${item.qty}</div>
        <div style="margin-top:6px"><button class="btn secondary" data-remove="${item.id}">Remove</button></div>
      </div>
    `;
    container.appendChild(div);
  });
  container.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.onclick = e => removeFromCart(btn.getAttribute('data-remove'));
  });
}

/* --- For cart.html page --- */
function renderCartPage(){
  const list = document.getElementById('cart-list');
  const totalEl = document.getElementById('cart-total');
  if(!list) return;
  const cart = getCart();
  list.innerHTML = '';
  if(cart.length===0){
    //list.innerHTML = '<p>Cart හි පොත් එකක්වත් නෑ.</p>';
    totalEl.textContent = '0 LKR';
    return;
  }
  let total = 0;
  cart.forEach(item=>{
    total += (item.price * item.qty);
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="meta">
        <div><strong>${item.title}</strong></div>
        <div class="small">Price: ${item.price} LKR • Qty: ${item.qty}</div>
        <div style="margin-top:6px">
          <button class="btn secondary" data-dec="${item.id}">-</button>
          <button class="btn secondary" data-inc="${item.id}">+</button>
          <button class="btn secondary" data-rm="${item.id}">Remove</button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
  totalEl.textContent = total + ' LKR';

  list.querySelectorAll('[data-inc]').forEach(b=>{
    b.onclick = () => { changeQty(b.getAttribute('data-inc'), +1) }
  });
  list.querySelectorAll('[data-dec]').forEach(b=>{
    b.onclick = () => { changeQty(b.getAttribute('data-dec'), -1) }
  });
  list.querySelectorAll('[data-rm]').forEach(b=>{
    b.onclick = () => removeFromCart(b.getAttribute('data-rm'));
  });
}

function changeQty(id, delta){
  const cart = getCart();
  const it = cart.find(x=>x.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) {
    const idx = cart.findIndex(x=>x.id===id); cart.splice(idx,1);
  }
  saveCart(cart);
  renderCartPage();
}

/* Initialize when DOM loaded */
document.addEventListener('DOMContentLoaded', ()=>{
  renderCartCount();
  const preview = document.getElementById('cart-preview');
  renderCartPreview(preview);
  renderCartPage();
});