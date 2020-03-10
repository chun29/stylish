//全域變數
let product;
let id;
const url = new URLSearchParams(window.location.search);
id = url.get("id");
let productSizeCollection = document.getElementById("product-size-collection");
let plus = document.getElementById("plus");
let minus = document.getElementById("minus");
let counterInput = document.getElementById("counter-input");
let chosenColor;
let chosenColorName;
let chosenSize;
let maxPurchaseAmount;
let addToCart = document.getElementById("cart-btn");
addToCart.disabled = true;

//Render at first
ajax(id);

function ajax(id) {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.appworks-school.tw/api/1.0/products/details?id=" + id,
    true
  );
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log("xhr done successfully");
      product = JSON.parse(xhr.responseText);
      render(product);
      console.log(product);
    }
  };
  xhr.send();
}

function render() {
  //Product-picture
  let productPicture = document.getElementById("product-picture");
  productPicture.src = product.data.main_image;

  //Product Title
  document.getElementById("product-title").innerText = product.data.title;

  //Product ID
  document.getElementById("product-id").innerHTML = product.data.id;

  //product-price
  document.getElementById("product-price").innerHTML =
    "TWD." + product.data.price;

  document.getElementById("product-note").innerText = `*${product.data.note}`;
  document.getElementById(
    "product-texture"
  ).innerText = `材質：${product.data.texture}`;
  document.getElementById("product-other-description").innerText =
    product.data.description;
  document.getElementById(
    "product-place"
  ).innerText = `產地：${product.data.place}`;
  document.getElementById("product-story").innerText = product.data.story;

  //product-color
  let productColorCollection = document.getElementById(
    "product-color-collection"
  );

  for (i = 0; i < product.data.colors.length; i++) {
    let colorContainer = document.createElement("button");
    colorContainer.className = "color-container";
    let colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style = `background-color:#${product.data.colors[i].code}`;
    colorContainer.appendChild(colorBox);
    productColorCollection.appendChild(colorContainer);
  }
  //product-size

  for (i = 0; i < product.data.sizes.length; i++) {
    let productSizeBtn = document.createElement("button");
    productSizeBtn.className = "size-button";
    productSizeBtn.innerText = product.data.sizes[i];
    productSizeCollection.appendChild(productSizeBtn);
  }

  for (i = 0; i < product.data.images.length; i++) {
    let productPicture = document.createElement("img");
    productPicture.className = "product-detail-picture";
    productPicture.src = product.data.images[i];

    document.getElementById("product-details").append(productPicture);
  }

  //Color Button Active and inactive 效果
  let colorContainers = document.getElementsByClassName("color-container");

  for (let i = 0; i < product.data.colors.length; i++) {
    colorContainers[i].addEventListener("click", () => {
      addToCart.disabled = true;
      counterInput.value = 0;
      for (let i = 0; i < product.data.sizes.length; i++) {
        sizeButtons[i].classList.remove("size-btn-active");
        sizeButtons[i].removeAttribute("disabled");
      }

      let cc = colorContainers[0];
      while (cc) {
        if (cc.classList.contains("color-container")) {
          cc.classList.remove("color-btn-active");
        }
        cc = cc.nextSibling;
      }
      colorContainers[i].classList.add("color-btn-active");

      chosenColor = product.data.colors[i].code;
      chosenColorName = product.data.colors[i].name;

      for (let i = 0; i < product.data.variants.length; i++) {
        if (product.data.variants[i].color_code === chosenColor) {
          if (product.data.variants[i].stock < 1) {
            let noStockSize = product.data.variants[i].size;
            for (let i = 0; i < product.data.sizes.length; i++) {
              if (product.data.sizes[i] === noStockSize) {
                sizeButtons[i].setAttribute("disabled", "disabled");
              }
            }
          }
        }
      }
    });
  }

  //Size Button Active and inactive 效果
  let sizeButtons = document.getElementsByClassName("size-button");
  for (let i = 0; i < product.data.sizes.length; i++) {
    sizeButtons[i].addEventListener("click", () => {
      addToCart.disabled = false;
      chosenSize = sizeButtons[i].textContent;
      counterInput.value = 1;
      let sb = sizeButtons[0];
      while (sb) {
        if (sb.classList.contains("size-button")) {
          sb.classList.remove("size-btn-active");
        }
        sb = sb.nextSibling;
      }
      sizeButtons[i].classList.add("size-btn-active");

      //plus/minus counter

      for (let i = 0; i < product.data.variants.length; i++) {
        if (
          product.data.variants[i].size === chosenSize &&
          product.data.variants[i].color_code === chosenColor
        ) {
          maxPurchaseAmount = product.data.variants[i].stock;
        }
      }
    });
  }

  plus.addEventListener("click", () => {
    for (let i = 0; i < sizeButtons.length; i++) {
      if (sizeButtons[i].classList.contains("size-btn-active")) {
        if (counterInput.value >= maxPurchaseAmount) {
          return false;
        } else {
          counterInput.value = parseInt(counterInput.value) + 1;
        }
      }
    }
  });

  minus.addEventListener("click", () => {
    for (let i = 0; i < sizeButtons.length; i++) {
      if (sizeButtons[i].classList.contains("size-btn-active")) {
        if (counterInput.value < 1) {
          return false;
        } else {
          counterInput.value = parseInt(counterInput.value) - 1;
        }
      }
    }
  });

  //Stock
  let stock = product.data.variants;
  stock.map(stock => {
    console.log(
      `color:${stock.color_code}/size:${stock.size}剩${stock.stock}件`
    );
  });

  //Default color btn[0] active

  colorContainers[0].classList.add("color-btn-active");
  let defaultColor = product.data.colors[0].code;
  chosenColor = defaultColor;
  chosenColorName = product.data.colors[0].name;
  for (let i = 0; i < product.data.variants.length; i++) {
    if (product.data.variants[i].color_code === defaultColor) {
      if (product.data.variants[i].stock < 1) {
        let noStockSize = product.data.variants[i].size;
        for (let i = 0; i < product.data.sizes.length; i++) {
          if (product.data.sizes[i] === noStockSize) {
            sizeButtons[i].setAttribute("disabled", "disabled");
          }
        }
      }
    }
  }

  brandLogo = document.querySelector(".brand-logo");
  brandLogo.href = "index.html";

  //Local Storage

  //product Title
  const productTitle = document.getElementById("product-title").innerText;
  const productPrice = document.getElementById("product-price").innerText;
  const productID = document.getElementById("product-id").innerText;

  //顯示購物車數量
  const cartQuantity = document.getElementById("add-to-cart-amount");
  const cartQuantityMobile = document.getElementById(
    "add-to-cart-amount-mobile"
  );

  //購買數量 ： counterInput.value;
  //加入購物車btn: addToCart

  // 取出 localStorage裡的資料，有就取值，沒就塞空陣列
  let cartProduct = JSON.parse(localStorage.getItem("cartList")) || [];
  // Show the number of items in cart icon
  quantityUpdate(cartProduct);

  //監聽事件:加入購物車
  addToCart.addEventListener("click", addProduct);

  //加入購物車Function
  function addProduct(e) {
    e.preventDefault();
    let priceText = productPrice.replace("TWD.", "");

    let product = {
      name: productTitle,
      quantity: counterInput.value,
      price: priceText,
      ID: productID,
      size: chosenSize,
      color: chosenColor,
      colorName: chosenColorName,
      pictureSrc: productPicture.src,
      stock: maxPurchaseAmount
    };

    for (let i = 0; i < cartProduct.length; i++) {
      if (
        productTitle === cartProduct[i].name &&
        chosenSize === cartProduct[i].size &&
        chosenColor === cartProduct[i].color
      ) {
        cartProduct.splice(i, 1);
      }
    }
    cartProduct.push(product);
    localStorage.setItem("cartList", JSON.stringify(cartProduct));
    quantityUpdate(cartProduct);
    alert("已將商品加入購物車");
  }

  // Show the quantity in cart
  function quantityUpdate() {
    let quantity = 0;
    let arrayJason = JSON.parse(localStorage.getItem("cartList"));
    if (arrayJason < 1) {
      cartQuantity.innerHTML = 0;
    } else {
      for (let i = 0; i < arrayJason.length; i++) {
        quantity += parseInt(arrayJason[i].quantity);
      }
      cartQuantity.innerHTML = quantity;
      cartQuantityMobile.innerHTML = quantity;
    }
  }
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
