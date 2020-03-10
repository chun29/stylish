let product;
let page = 0;
let loading = false;
let catalog = "all";
const url = new URLSearchParams(window.location.search);
catalog = url.get("catalog");
if (catalog == null) {
  catalog = "all";
}
if (catalog == "women") {
  document.querySelector("#women-product").style = "color:#8b572a";
} else if (catalog == "men") {
  document.querySelector("#men-product").style = "color:#8b572a";
} else if (catalog == "accessories") {
  document.querySelector("#accessories-product").style = "color:#8b572a";
}

window.onload = function() {
  load();
  showCampaigns();
};

//Load Ajax Function
function load() {
  if (loading == false) {
    loading = true;
    let xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      "https://api.appworks-school.tw/api/1.0/products/" +
        catalog +
        "?paging=" +
        page,
      true
    );

    xhr.onload = function() {
      if (xhr.status === 200) {
        loading = false;
        console.log("xhr done successfully");
        product = JSON.parse(xhr.responseText);
        render(product);

        console.log(
          "https://api.appworks-school.tw/api/1.0/products/" +
            catalog +
            "?paging=" +
            page
        );
        page = product.next_paging;
      }
    };

    xhr.send();
  }
}

window.addEventListener("scroll", () => {
  const footer = document.querySelector("footer");
  if (footer.getBoundingClientRect().top < window.innerHeight) {
    if (product.next_paging !== undefined) {
      load(catalog, page);
    }
  }
});

// 渲染內容 Add Data to DOM
let myVar;
function render(product) {
  for (i = 0; i < product.data.length; i++) {
    let id = product.data[i].id;
    let item = document.createElement("a");
    item.className = "item";
    item.href = `product.html?id=${id}`;

    //img
    let img = document.createElement("img");
    img.className = "product-picture";
    img.src = product.data[i].main_image;

    //Product Color
    let productColor = document.createElement("div");
    productColor.className = "product-color";
    let colorBox = "";

    for (ii = 0; ii < product.data[i].colors.length; ii++) {
      colorBox += `<div class="product-color">
      <div class="color-box" style="background-color:#${product.data[i].colors[ii].code}"></div>
    </div>`;
    }
    productColor.innerHTML = colorBox;

    // productDescription
    let productDescription = document.createElement("div");
    productDescription.className = "product-description";
    let productDescriptionText = document.createTextNode(product.data[i].title);
    productDescription.appendChild(productDescriptionText);

    //product price
    let productPrice = document.createElement("div");
    productPrice.className = "product-price";
    let productPriceText = document.createTextNode(
      "TWD. $" + product.data[i].price
    );
    productPrice.appendChild(productPriceText);

    //append
    item.append(img, productColor, productDescription, productPrice);

    document.getElementById("product-container").append(item);
  }
}

//清空內容 Clear content
function clearHTML() {
  document.getElementById("product-container").innerHTML = "";
}

//搜尋功能 Search feature

document.querySelector(".search-web-input").addEventListener(
  "keydown",
  function(e) {
    if (e.keyCode === 13) {
      getData();
      document.querySelector(".search-web-input").value = "";
    }
  },
  false
);

function getData() {
  let req = new XMLHttpRequest();
  const searchProduct = document.querySelector(".search-web-input").value;

  req.open(
    "get",
    "https://api.appworks-school.tw/api/1.0/products/search?keyword=" +
      searchProduct
  );
  req.onload = function() {
    if (req.status === 200) {
      searchResult = JSON.parse(req.responseText);
      if (searchResult.data.length < 1) {
        clearHTML();
        let searchResult = document.createElement("p");
        searchResult.className = "no-search-result";
        searchResult.innerText = "沒有搜尋結果";
        document.getElementById("product-container").append(searchResult);
      } else {
        clearHTML();
        render(searchResult);
      }
    }
  };
  req.send();
}

//搜尋功能 Search feature MOBILE

let searchMobileBtn = document.getElementById("search-btn");
let searchInput = document.querySelector(".search-web-input");
let closeBtn = document.querySelector(".close-btn");
searchMobileBtn.addEventListener("click", () => {
  if (window.innerWidth < 1200) {
    searchInput.classList.add("search-product");
    closeBtn.style = "display:inline";
  }
});

closeBtn.addEventListener("click", () => {
  searchInput.classList.remove("search-product");
  searchInput.value = "";
  closeBtn.style = "display:none";
});

//Get Marketing Campaigns
let slideIndex = 3;

//連線取得資料
function showCampaigns() {
  let req = new XMLHttpRequest();
  req.open("get", "https://api.appworks-school.tw/api/1.0/marketing/campaigns");
  req.onload = function() {
    if (req.status === 200) {
      campaigns = JSON.parse(req.responseText);
      console.log("https://api.appworks-school.tw/api/1.0/marketing/campaigns");
      renderCampaigns(campaigns);
    }
  };
  req.send();
}

const slideshowContainer = document.getElementById("slideshow-container");
const banner = document.getElementById("banner");

//Render出Slide Show
function renderCampaigns(campaigns) {
  //Create img element
  let slideImg = document.createElement("img");
  slideImg.className = "ad";

  let imageUrl = campaigns.data.map(
    pictureUrl => `https://api.appworks-school.tw${pictureUrl.picture}`
  );
  let productId = campaigns.data.map(productId => productId.product_id);

  //Story Text
  let story = document.getElementById("text");

  //Dots
  let dotContainer = document.createElement("div");
  dotContainer.className = "dot-container";

  for (i = 0; i < campaigns.data.length; i++) {
    let dot = document.createElement("span");
    dot.className = "dot";
    dotContainer.appendChild(dot);
    dot.id = `dot${i + 1}`;
  }
  let dots = document.getElementsByClassName("dot");
  banner.appendChild(dotContainer);

  //先執行第一次ChangeImage
  changeImage();

  //Change Image Function
  function changeImage() {
    if (slideIndex < imageUrl.length - 1) {
      slideIndex++;
    } else {
      slideIndex = 0;
    }

    slideImg.src = imageUrl[slideIndex];
    slideshowContainer.href = `product.html?id=${productId[slideIndex]}`;

    let storyText = "";
    let res = campaigns.data[slideIndex].story.split("\n");

    for (j = 0; j < 4; j++) {
      storyText += `<div>${res[j]}</div>`;
    }
    story.innerHTML = storyText;
    slideshowContainer.append(slideImg, story);

    //Dot

    for (i = 0; i < 3; i++) {
      if (i === slideIndex) {
        dots[i].className = "active dot";
      } else {
        dots[i].className = "dot";
      }
    }
  }

  setInterval(changeImage, 10000);

  let dot1 = document.getElementById("dot1");
  dot1.addEventListener("click", () => {
    slideIndex = 2;
    changeImage();
  });
  let dot2 = document.getElementById("dot2");
  dot2.addEventListener("click", () => {
    slideIndex = 0;
    changeImage();
  });

  let dot3 = document.getElementById("dot3");
  dot3.addEventListener("click", () => {
    slideIndex = 1;
    changeImage();
  });
}

//顯示購物車數量
const cartQuantity = document.getElementById("add-to-cart-amount");
const cartQuantityMobile = document.getElementById("add-to-cart-amount-mobile");

// 取出 localStorage裡的資料，有就取值，沒就塞空陣列
const form = [
  {
    prime: "",
    order: {
      shipping: "delivery",
      payment: "credit_card",
      subtotal: "",
      freight: 30,
      total: "",
      recipient: {
        name: "",
        phone: "",
        email: "",
        address: "",
        time: ""
      },
      list: []
    }
  }
];
let cartProduct = JSON.parse(localStorage.getItem("cartList")) || [];
// Show the number of items in cart icon
quantityUpdate(cartProduct);

// Show the quantity in cart
function quantityUpdate() {
  let quantity = 0;
  if (cartProduct.length < 1) {
    cartQuantity.innerHTML = 0;
  } else {
    for (let i = 0; i < cartProduct.length; i++) {
      quantity += parseInt(cartProduct[i].quantity);
    }
    cartQuantity.innerHTML = quantity;
    cartQuantityMobile.innerHTML = quantity;
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
