
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const checkoutBtn = document.querySelector(".checkout-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
let cart = [];
let itemstext = document.querySelector('#items-text')
const alertBtn= document.querySelector('.alert-btn')
const alertShow= document.querySelector('.alert')
const alertOverlay= document.querySelector('.alert-overlay')
const closeAlert=document.querySelector('.close-alert')
let delivery=document.querySelector('.delivery')
let deliver=document.querySelector('.deliver')
const cartFooter = document.querySelector('.cart-footer')

const cartEmpty = document.querySelector('.cart-empty')

// products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      // let contentful = await client.getEntries({
      //   content_type: "comfyHouseProducts"
      // });
      // console.log(contentful.items);
      // console.log(data);

      let products = data.items;
      products = products.map(item => {
        const { title,size, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title,size, price, id, image };
      });


      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// ui
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      result += `
   <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
          </div>
          <h3>${product.title} ${product.size}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!-- end of single product -->
   `;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach(button => {
      let id = button.dataset.id;

      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } else {
        button.addEventListener("click", event => {
          // disable button
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          // add to cart
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          cart = [...cart, cartItem];
          
          Storage.saveCart(cart);
          // add to DOM
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          this.showCart();
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<!-- cart item -->
            <!-- item image -->
            <img src=${item.image} alt="product" />
            <!-- item info -->
            <div>
              <h4>${item.title} ${item.size}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <!-- item functionality -->
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">
                ${item.amount}
              </p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
              
            </div>
          <!-- cart item -->
    `;
    cartContent.appendChild(div);
  }
  showCart() {
   if (cart.length===0) {
     checkoutBtn.style.visibility ='hidden'
     delivery.style.visibility ='hidden'
     deliver.style.visibility ='hidden'
     cartFooter.style.visibility ='hidden'
     cartEmpty.style.visibility='visible'
   }else {
      checkoutBtn.style.visibility='visible'
      delivery.style.visibility ='visible'
      deliver.style.visibility ='visible'
      cartFooter.style.visibility ='visible'
      cartEmpty.style.visibility ='hidden'
      
   }
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  showAlert(){
  alertOverlay.classList.add('transparentBcg');
  alertShow.classList.add("showAlert")
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeAlert.addEventListener('click',this.hideAlert)
    alertBtn.addEventListener("click",this.showAlert)
    closeCartBtn.addEventListener("click", this.hideCart);

  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideAlert(){
    alertOverlay.classList.remove('transparentBcg');
    alertShow.classList.remove('showAlert')
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    console.log(cart)
    checkoutBtn.addEventListener("click", () => {
      this.checkOut();
    });
    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
       cart = cart.filter(item => item.id !== id);


        this.setCartValues(cart);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement.parentElement);
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach(button => {
          if (parseInt(button.dataset.id) === id) {
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
          }
        });
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cart = cart.filter(item => item.id !== id);
          // console.log(cart);

          this.setCartValues(cart);
          Storage.saveCart(cart);
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          const buttons = [...document.querySelectorAll(".bag-btn")];
          buttons.forEach(button => {
            if (parseInt(button.dataset.id) === id) {
              button.disabled = false;
              button.innerHTML = `<i class="fas fa-shopping-cart"></i>add cart`;
            }
          });
        }
      }
    });
  }
  checkOut() {
    // console.log(this);
    let tempTotal = 0;
    let itemsTotal = 0;
    let order=''
    let deliverOption=`${delivery.value}`
  cart.map(items =>{
    tempTotal += items.price * items.amount;
    itemsTotal += items.amount;
    let list = document.createElement('span')

    list.innerHTML += `${items.title},${items.size}
     Amount ${items.amount} `;
     order += list.innerHTML;
    
    itemstext.value=`${order}, ${deliverOption}, Total ${ parseFloat(tempTotal.toFixed(2))}`  ;
  })
    cart=[]
  
    //console.log(cart.title);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach(button => {
      button.disabled = false;
      button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to Cart`;
    });
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  ui.setupAPP();

  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
