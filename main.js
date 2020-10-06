// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA6lHioeOKITgz_ECHcM26ZFpdceDze1QY",
  authDomain: "test-form-f8400.firebaseapp.com",
  databaseURL: "https://test-form-f8400.firebaseio.com",
  projectId: "test-form-f8400",
  storageBucket: "test-form-f8400.appspot.com",
  messagingSenderId: "200590622876",
  appId: "1:200590622876:web:863db80184c67dddaf2d59"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Refernece contactInfo collections
let contactInfo = firebase.database().ref("infos");

// Listen for a submit
document.querySelector(".contact-form").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  //   Get input Values
  let name = document.querySelector(".name").value;
  let email = document.querySelector(".email").value;
  let message = document.querySelector(".message").value
  saveContactInfo(name, email, message);

  if (name, email == '') {
    alert('name and email are required to book your order')
    return;
  }

  document.querySelector(".contact-form").reset();
  sentEmail(name, email, message)
}

// Save infos to Firebase
function saveContactInfo(name, email, message) {
  let newContactInfo = contactInfo.push();

  newContactInfo.set({
    name: name,
    email: email,
    message: message,
  });
}

function sentEmail(name, email, message)
{

  Email.send({
    Host: "smtp.gmail.com",
    Username: "waltergrande53@gmail.com",
    Password: "soxopankraodwpas",
    To: 'waltergrande53@gmail.com',
    From: `${email}`,
    Subject: `${name} sent you a message`,
    Body: ` Message:${message}`
  }).then(
    message => alert('Your order has been placed')
  );
}





let size = document.querySelector('.size').options[0].selected

order_data = document.querySelector('#order');
let items = ['Skittles', 'Sour patch watermelon', 'Gummy bears', 'Peaches', 'Sour patch kids'];
let total = 0;
let size_display;
let total_amount = document.querySelector("#total")
let quantity = 0;
let home = document.getElementById('home');
let shop = document.querySelector('.container');
let cart = document.querySelector('#cart')
let check_out_btn = document.querySelector('#check_out_btn');
let div = document.createElement('div');



$(document).ready(function() {
  $(".size").change(function() {
    selectedSize = $(this).children("option:selected").val();
    if (selectedSize == null) {
      return;
    }
    selected_price = parseFloat(selectedSize)

  });
  return selectedSize = null;
})

function selected_item(i) {
  quantity = 1;
  total += selected_price;

  if (selected_price === 5) {
    size_display = 'Small'
  }
  else if (selected_price === 8) {
    size_display = 'Medium'

  }
  else if (selected_price === 10) {
    size_display = 'big'
  }
  check_out_btn.style.display = 'block'
  let div = document.createElement('div');
  div.className = 'list_items'
  let delete_btn = document.createElement("button");
  delete_btn.className = 'delete_btn'
  order_data.appendChild(div).innerHTML = `${items[i]} ${size_display} ${quantity} `;
  total_amount.innerHTML = `total: $${total} `;
  div.appendChild(delete_btn).innerHTML = 'remove';
  delete_btn.addEventListener('click', () => {
    total -= selected_price;
    order_data.removeChild(div)
    div.removeChild(delete_btn)
    total_amount.innerHTML = `total: $${total} `;
    if (total === 0) {
      check_out_btn.style.display = 'none'
    }
  })
};






function home_display() {
  home.style.display = 'block'
  shop.style.display = 'none'
  cart.style.display = 'none'
  order_data.style.display = 'none'
  check_out_btn.style.display='none'
  document.querySelector('#items-title').style.display = 'none'
  document.querySelector("#order-title").style.display = 'none'
  document.querySelector('.contact-form').style.display = 'none'

}

function shop_display() {
  let text = $('#order button').text('remove');
  shop.style.display = 'block'
  home.style.display = 'none'
  cart.style.display = 'none'
  $('#shop-section').css('display', 'block')
  document.querySelector('#items-title').style.display = 'block'
  document.querySelector("#order-title").style.display = 'block'
  order_data.style.display = 'none'
  order_data.style.display = 'block'
  document.querySelector('.contact-form').style.display = 'none'

}

function cart_display() {
  cart.style.display = 'block'
  order_data.display = 'none'
  home.style.display = 'none'
  shop.style.display = 'none'
  $('#shop-section').css('display', 'none')
  $('#items-litle').css('display', 'none')
  if (total > 0) {
    check_out_btn.style.display = 'block'
  } else {
    check_out_btn.style.display = 'none'
  }
  document.querySelector('.contact-form').style.display = 'none'
}

function check_out(message) {
  if (quantity === 0) {
    alert('empty')
    return;
  }
  order_data.style.display = 'none'
  text = $('#order button').text('');
  document.querySelector('#order-title').style.display = 'none'

  cart.style.display = 'block'
  home.style.display = 'none'
  $('.contact-form-section').css('display', 'flex')
  shop.style.display = 'none'
  check_out_btn.style.display = 'none'
  $('#shop-section').css('display', 'none')
  $('#items-litle').css('display', 'none')
  document.querySelector('.contact-form').style.display = 'block'
  message = document.querySelector(".message").value = order_data.innerText;
}
