// ===== EDIT THESE =====
var WA = "919000000000";      // WhatsApp number with country code, no +
var MIN_ORDER = 200;           // minimum order in ₹
var PRODUCTS = [
  {id:1, e:"🧀", n:"Paneer Protein Snack", d:"Crispy spiced paneer bites, high in protein.", w:"200 g", p:180, pr:"18 g protein / serving"},
  {id:2, e:"🥣", n:"Moong Dal Snack", d:"Roasted moong dal crunch with Indian spices.", w:"200 g", p:150, pr:"14 g protein / serving"},
  {id:3, e:"🥞", n:"Protein Dosa Batter", d:"Protein-boosted batter, ready to pour and cook.", w:"1 kg", p:120, pr:"Protein-boosted"}
];
// ======================
var cart = {};
var $ = function(id){return document.getElementById(id)};
function inr(n){return "₹" + n}
function renderProducts(){
  $("grid").innerHTML = PRODUCTS.map(function(p){
    return '<div class="card"><div class="emoji">'+p.e+'</div><h3>'+p.n+'</h3><p>'+p.d+'</p><div class="meta">'+p.pr+' · '+p.w+'</div><div class="row"><span class="price">'+inr(p.p)+'</span><button class="add" data-id="'+p.id+'">Add to cart</button></div></div>';
  }).join("");
}
function total(){return PRODUCTS.reduce(function(s,p){return s+(cart[p.id]||0)*p.p},0)}
function count(){return Object.keys(cart).reduce(function(s,k){return s+cart[k]},0)}
function renderCart(){
  $("cnt").textContent = count();
  var html = PRODUCTS.filter(function(p){return cart[p.id]}).map(function(p){
    return '<div class="item"><div>'+p.n+'<br><span class="note">'+inr(p.p)+' each</span></div><div class="qty"><button data-m="'+p.id+'">−</button><span>'+cart[p.id]+'</span><button data-p="'+p.id+'">+</button></div></div>';
  }).join("");
  $("items").innerHTML = html || '<p class="note">Your cart is empty.</p>';
  $("total").textContent = inr(total());
  $("minnote").textContent = "Minimum order " + inr(MIN_ORDER) + ". Delivery charge confirmed on WhatsApp.";
}
function change(id,d){cart[id]=(cart[id]||0)+d; if(cart[id]<=0)delete cart[id]; renderCart()}
$("grid").addEventListener("click",function(e){var id=e.target.getAttribute("data-id"); if(id){change(+id,1); $("drawer").classList.add("open")}});
$("items").addEventListener("click",function(e){
  var p=e.target.getAttribute("data-p"), m=e.target.getAttribute("data-m");
  if(p)change(+p,1); if(m)change(+m,-1);
});
$("open").onclick=function(){$("drawer").classList.add("open")};
$("close").onclick=function(){$("drawer").classList.remove("open")};
$("drawer").addEventListener("click",function(e){if(e.target===$("drawer"))$("drawer").classList.remove("open")});
$("send").onclick=function(){
  if(!count()){alert("Please add items to your cart first.");return}
  if(total()<MIN_ORDER){alert("Minimum order is "+inr(MIN_ORDER)+".");return}
  var name=$("name").value.trim(), addr=$("addr").value.trim();
  if(!name||!addr){alert("Please enter your name and address.");return}
  var lines = PRODUCTS.filter(function(p){return cart[p.id]}).map(function(p){return "• "+p.n+" x "+cart[p.id]+" = "+inr(p.p*cart[p.id])});
  var msg = "Hi! I'd like to order:\n"+lines.join("\n")+"\n\nTotal: "+inr(total())+"\nName: "+name+"\nAddress: "+addr;
  window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank");
};
$("wafloat").href = "https://wa.me/"+WA+"?text="+encodeURIComponent("Hi! I want to know more about your products.");
renderProducts(); renderCart();
