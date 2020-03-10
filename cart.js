const cartQuantity = document.getElementById("add-to-cart-amount");
const cartQuantityMobile = document.getElementById("add-to-cart-amount-mobile");
const freight = 30;
const accessToken = localStorage.getItem("accessToken");

// 取出 localStorage裡的資料，有就取值，沒就塞空陣列
let cartProduct = JSON.parse(localStorage.getItem("cartList")) || [];
let customerInfo = JSON.parse(localStorage.getItem("customerInfo")) || [];
// Show the number of items in cart icon
quantityUpdate(cartProduct);

showProduct();
// Show the quantity in cart
function quantityUpdate() {
  console.log(cartProduct);
  let quantity = 0;
  if (cartProduct.length < 1) {
    cartQuantity.innerHTML = 0;
  } else {
    for (let i = 0; i < cartProduct.length; i++) {
      quantity += parseInt(cartProduct[i].quantity);
    }
    cartQuantity.innerHTML = quantity;
    cartQuantityMobile.innerHTML = quantity;
    document.querySelector(".cart-title-quantity").innerText = quantity;
  }
}

//Show the shopping cart product list
// Show the quantity in cart

function showProduct() {
  document.querySelector(".product-list-container").innerHTML = "";
  if (cartProduct.length < 1) {
    emptyCart();
  } else {
    if (customerInfo.length < 1) {
      document.querySelector(".customer-name-input").value = "";
      document.querySelector(".customer-phone-input").value = "";
      document.querySelector(".customer-address-input").value = "";
      document.querySelector(".customer-email-input").value = "";
    } else {
      document.querySelector(".customer-name-input").value = customerInfo.name;
      document.querySelector(".customer-phone-input").value =
        customerInfo.phone;
      document.querySelector(".customer-address-input").value =
        customerInfo.address;
      document.querySelector(".customer-email-input").value =
        customerInfo.email;
    }
    let subTotal = 0;
    let itemSubTotal;
    for (let i = 0; i < cartProduct.length; i++) {
      //Render Shopping List
      let item = document.createElement("div");
      item.className = "item";
      let leftContainer = document.createElement("div");
      leftContainer.className = "product-list-container-left";
      let productDescription = document.createElement("div");
      productDescription.className = "product-description";
      let picture = document.createElement("img");
      picture.className = "product-picture";
      let title = document.createElement("div");
      title.className = "product-title";
      let id = document.createElement("div");
      id.className = "product-id";
      let productColor = document.createElement("div");
      productColor.className = "product-color";
      let productColorText = document.createElement("p");
      productColorText.innerText = "顏色";
      let color = document.createElement("span");

      let productSize = document.createElement("div");
      productSize.className = "product-size";
      let productSizeText = document.createElement("p");
      productSizeText.innerText = "尺寸";
      let size = document.createElement("span");

      let removeImg = document.createElement("img");
      removeImg.className = "remove-item";
      removeImg.src = "images/cart-remove.png";

      let removeImgMobile = document.createElement("img");
      removeImgMobile.className = "remove-item-mobile";
      removeImgMobile.src = "images/cart-remove.png";

      let rightContainer = document.createElement("div");
      rightContainer.className = "product-list-container-right";

      let mobileTitleList = document.createElement("div");
      mobileTitleList.className = "product-list-mobile-title";
      let quantityText = document.createElement("p");
      let amountText = document.createElement("p");
      let subTotalText = document.createElement("p");
      quantityText.innerText = "數量";
      amountText.innerText = "單價";
      subTotalText.innerText = "小計";
      mobileTitleList.append(quantityText, amountText, subTotalText);

      let rightListContainer = document.createElement("div");
      rightListContainer.className = "product-list-mobile-right-container";
      let productQuantity = document.createElement("select");
      productQuantity.className = "product-quantity";
      let stock = cartProduct[i].stock;
      let quantity = cartProduct[i].quantity;
      for (let i = 1; i <= stock; i++) {
        let number = document.createElement("option");
        number.setAttribute("number", i);
        number.innerText = i;
        if (i == quantity) {
          number.selected = true;
        }
        productQuantity.append(number);
      }
      let productPrice = document.createElement("div");
      productPrice.className = "product-price";
      let productSubTotal = document.createElement("div");
      productSubTotal.className = "product-subTotal";
      let freight = 30;

      picture.src = cartProduct[i].pictureSrc;
      title.innerText = cartProduct[i].name;
      id.innerHTML = cartProduct[i].ID;
      color.innerText = cartProduct[i].colorName;
      size.innerText = cartProduct[i].size;
      productPrice.innerText = "NT." + cartProduct[i].price;
      itemSubTotal = parseInt(cartProduct[i].price) * quantity;
      productSubTotal.innerText = "NT." + itemSubTotal;

      subTotal += itemSubTotal;
      document.querySelector(".total-price").innerText = "NT." + subTotal;
      document.querySelector(".total-price-pay").innerHTML =
        "NT." + parseInt(subTotal + freight);

      //append
      productColor.append(productColorText, color);
      productSize.append(productSizeText, size);
      productDescription.append(
        title,
        id,
        productColor,
        productSize,
        removeImgMobile
      );

      leftContainer.append(picture, productDescription);
      rightListContainer.append(
        productQuantity,
        productPrice,
        productSubTotal,
        removeImg
      );
      rightContainer.append(mobileTitleList, rightListContainer);
      item.append(leftContainer, rightContainer);
      document.querySelector(".product-list-container").append(item);

      //SubTotal Calculate
      productQuantity.addEventListener("change", function() {
        changeQuantity(productQuantity, productSubTotal, i);
      });

      //Remove Item
      removeImg.addEventListener("click", function() {
        removeItem(i);
      });
      removeImgMobile.addEventListener("click", function() {
        removeItem(i);
      });
    }
  }
}

function changeQuantity(productQuantity, productSubTotal, i) {
  let quantity = 0;
  let editQuantity =
    productQuantity.options[productQuantity.selectedIndex].value;
  productSubTotal.innerText =
    "NT." + parseInt(cartProduct[i].price) * editQuantity;

  //Change Shopping Cart
  cartProduct[i].quantity = editQuantity;
  localStorage.setItem("cartList", JSON.stringify(cartProduct));
  let countTotal = document.getElementsByClassName("product-subTotal");
  console.log(countTotal);
  let total = 0;
  for (let i = 0; i < countTotal.length; i++) {
    let itemCountTotal = countTotal[i].innerText.replace("NT.", "");
    total += parseInt(itemCountTotal);
  }
  document.querySelector(".total-price").innerText = "NT." + total;
  document.querySelector(".total-price-pay").innerHTML =
    "NT." + parseInt(total + freight);

  quantityUpdate(cartProduct);
}

function removeItem(i) {
  cartProduct.splice(i, 1);
  localStorage.setItem("cartList", JSON.stringify(cartProduct));
  showProduct();
  alert("商品已移除購物車");
  quantityUpdate(cartProduct);
}

//Check Out

//checkInfo
let customerInput = document.querySelectorAll(".customer-input");
let timeInput = document.querySelectorAll(".time-input");
function alertMessage() {
  for (let i = 0; i < customerInput.length; i++) {
    customerInput[i].addEventListener("keyup", () => {
      if (customerInput[i].value == "") {
        document.querySelectorAll(".customer-note")[i].style = "display:inline";
      } else {
        document.querySelectorAll(".customer-note")[i].style = "display:none";
      }
    });
  }
}
alertMessage();

function checkAllInfo() {
  for (let i = 0; i < customerInput.length; i++) {
    if (customerInput[i].value == "") {
      document.querySelectorAll(".customer-note")[i].style = "display:inline";
    }
  }

  for (let i = 0; i < timeInput.length; i++) {
    if (timeInput[i].checked) {
      document.querySelector(".customer-note-delivery").style = "display:none";
      return true;
    } else {
      console.log("no");
      document.querySelector(".customer-note-delivery").style =
        "display:inline";
    }
  }
  return false;
}

let checkoutBtn = document.querySelector(".checkout");
checkoutBtn.disabled = true;

TPDirect.setupSDK(
  12348,
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);

TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****"
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY"
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "後三碼"
    }
  },
  styles: {
    // Style all elements
    input: {
      color: "gray"
    },
    // Styling ccv field
    "input.cvc": {
      "font-size": "14px"
    },
    // Styling expiration-date field
    "input.expiration-date": {
      "font-size": "14px"
    },
    // Styling card-number field
    "input.card-number": {
      "font-size": "14px"
    },
    // style focus state
    ":focus": {
      color: "black"
    },
    // style valid state
    ".valid": {
      color: "green"
    },
    // style invalid state
    ".invalid": {
      color: "red"
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange"
      }
    }
  }
});
TPDirect.card.onUpdate(function(update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()

  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    checkoutBtn.removeAttribute("disabled");
  } else {
    // Disable submit Button to get prime.
    checkoutBtn.setAttribute("disabled", true);
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  // if (update.cardType === "visa") {
  // Handle card type visa.
  // }

  // 0	欄位已填好，並且沒有問題
  // 1	欄位還沒有填寫
  // 2	欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor
  // 3	使用者正在輸入中

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError();
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess();
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.cvc === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.cvc === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
});

// call TPDirect.card.getPrime when user submit form to get tappay prime
checkoutBtn.addEventListener("click", onSubmit);
function addInfo() {
  let name = document.querySelector(".customer-name-input").value;
  let phone = document.querySelector(".customer-phone-input").value;
  let address = document.querySelector(".customer-address-input").value;
  let email = document.querySelector(".customer-email-input").value;
  customerInfo = {
    name: name,
    phone: phone,
    address: address,
    email: email
  };
  localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
}

function onSubmit(event) {
  event.preventDefault();
  addInfo();
  if (checkAllInfo() === false) {
    alert("訂購資料請填寫完整");
  } else {
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      return;
    }

    // Get prime
    TPDirect.card.getPrime(result => {
      if (result.status !== 0) {
        alert("get prime error " + result.msg);
        return;
      }
      let prime = result.card.prime;
      const primeNumber = prime;
      const subtotal = parseInt(
        document.querySelector(".total-price").innerHTML.replace("NT.", "")
      );
      const freight = 30;
      const total = subtotal + freight;

      const name = document.querySelector(".customer-name-input").value;
      const phone = document.querySelector(".customer-phone-input").value;
      const address = document.querySelector(".customer-address-input").value;
      const email = document.querySelector(".customer-email-input").value;
      let time;
      let formDom = document.forms[0];
      for (let i = 0; i < formDom.time.length; i++) {
        if (formDom.time[i].checked) {
          time = document.querySelectorAll("label")[i].htmlFor;
        }
      }
      const list = JSON.parse(localStorage.getItem("cartList"));
      let listItem = [];
      for (let i = 0; i < list.length; i++) {
        let newItem = {
          id: list[i].ID,
          name: list[i].name,
          price: parseInt(list[i].price),
          color: {
            code: list[i].color,
            name: list[i].colorName
          },
          size: list[i].size,
          qty: parseInt(list[i].quantity)
        };
        listItem.push(newItem);
      }
      const form = {
        prime: primeNumber,
        order: {
          shipping: "delivery",
          payment: "credit_card",
          subtotal: subtotal,
          freight: freight,
          total: total,
          recipient: {
            name: name,
            phone: phone,
            email: email,
            address: address,
            time: time
          },
          list: listItem
        }
      };
      console.log(form);
      sendOrder(form);
      document.querySelector(".loading").style = "display:inline";
    });
  }

  function sendOrder(data) {
    let xhr = new XMLHttpRequest();
    let url = "https://api.appworks-school.tw/api/1.0/order/checkout";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let json = JSON.parse(xhr.responseText);
        let orderNumber = json.data.number;
        thankYouPage(orderNumber, data);
        localStorage.setItem("cartList", JSON.stringify([]));
        cartQuantity.innerHTML = 0;
        cartQuantityMobile.innerHTML = 0;
        console.log(orderNumber);
      }
    };
    let sendData = JSON.stringify(data);
    xhr.send(sendData);
  }
}

function emptyCart() {
  let emptyCartH1 = document.createElement("h1");
  emptyCartH1.className = "empty-cart-h1";
  emptyCartH1.innerHTML = "你的購物車中沒有商品";
  let homeLink = document.createElement("a");
  let goHomePageBtn = document.createElement("div");
  goHomePageBtn.className = "go-home-page-btn";
  goHomePageBtn.innerText = "回首頁逛逛";
  homeLink.href = "index.html";
  homeLink.append(goHomePageBtn);
  document.querySelector("main").innerHTML = "";
  document.querySelector("main").append(emptyCartH1, homeLink);
}

function thankYouPage(orderNumber, data) {
  document.querySelector(".loading").style = "display:none";
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + " " + time;
  let main = document.querySelector("main");
  main.innerHTML = "";
  let top = document.createElement("div");
  top.className = "order-top";
  let location = (document.createElement("div").innerHTML = "HOME > 訂單狀態");
  let img = document.createElement("img");
  img.src = "images/check.png";
  img.className = "check-ok";
  let orderOK = document.createElement("p");
  orderOK.innerText = "訂單已成功送出";
  orderOK.className = "order-ok";
  let email = document.createElement("p");
  email.innerHTML = `請至${data.order.recipient.email}收取確認信`;
  email.className = "order-ok";

  let number = document.createElement("p");
  number.innerHTML = `訂單號碼${orderNumber}`;
  let hr = document.createElement("hr");
  top.append(img, hr, orderOK, email, hr);
  let detail = document.createElement("div");
  detail.className = "delivery-detail";
  let output = `<div class="delivery-detail">
  <h3>寄送明細</h3>
  <div class="order-detail">
    <div class="order-detail-left">
      <p>訂單編號：${orderNumber}</p>
      <p>訂購時間：${dateTime}</p>
      <p>收件人：${data.order.recipient.name}</p>
      <p>電話：${data.order.recipient.phone}</p>
    </div>
    <div class="order-detail-right">
      <p>地址：${data.order.recipient.address}</p>
      <p>寄送方式：${data.order.shipping}</p>
      <p>寄送時間：${data.order.recipient.time}</p>
      <p>付款方式：${data.order.payment}</p>
    </div>
  </div>
</div>`;
  detail.innerHTML = output;
  main.append(location, top, detail);
}

//FB LOGIN
let person = { userID: "", name: "", accessToken: "", email: "" };

window.fbAsyncInit = function() {
  FB.init({
    appId: "755632211586010",
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: "v5.0" // Use this Graph API version for this call.
  });
  FBLogin();
};

(function(d, s, id) {
  // Load the SDK asynchronously
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function FBLogin() {
  FB.getLoginStatus(function(res) {
    console.log(`status:${res.status}`); //Debug

    if (res.status === "connected") {
      person.userID = res.authResponse.userID;
      person.accessToken = res.authResponse.accessToken;
      console.log(`已登入過FB，不需重複登入，userID:${person.userID}`);
      console.log(res);
      localStorage.setItem("accessToken", res.authResponse.accessToken);

      FB.api(
        "/me?fields=id,name,first_name,last_name,email,picture.type(large)",
        function(userData) {
          person.name = userData.name;
          person.email = userData.email;
          person.picture = userData.picture.data.url;
          document.querySelector(".membership img").src = person.picture;
          document.querySelector(".member-mobile img").src = person.picture;
        }
      );
    } else if (res.status === "not_authorized" || res.status === "unknown") {
      //App未授權或用戶登出FB網站才讓用戶執行登入動作

      console.log("未登入過");
    }
  });
}
