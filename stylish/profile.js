//按鈕登入
let person = { userID: "", name: "", accessToken: "", email: "", picture: "" };

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
          document.querySelector(".member img").src = person.picture;
          document.querySelector(".member-mobile img").src = person.picture;
          document.querySelector(".right-container span").innerHTML =
            person.name;
          document.querySelector(".name").innerHTML = person.name;
          document.querySelector(".email").innerHTML = person.email;
        }
      );

      // GetProfile();
    } else if (res.status === "not_authorized" || res.status === "unknown") {
      //App未授權或用戶登出FB網站才讓用戶執行登入動作
      FB.login(
        function(response) {
          //console.log(response); //debug用
          if (response.status === "connected") {
            //user已登入FB
            //抓userID
            console.log(response);
            person.userID = response.authResponse.userID;

            console.log(`新登入FB的user-ID:${person.userID}`);

            person.accessToken = response.authResponse.accessToken;

            localStorage.setItem("accessToken", person.accessToken);

            FB.api(
              "/me?fields=id,name,first_name,last_name,email,picture.type(large)",
              function(userData) {
                person.name = userData.name;
                person.email = userData.email;
                person.picture = userData.picture.data.url;
                document.querySelector(".membership img").src = person.picture;
                document.querySelector(".member img").src = person.picture;
                document.querySelector(".member-mobile img").src =
                  person.picture;
                document.querySelector(".right-container span").innerHTML =
                  person.name;
                document.querySelector(".name").innerHTML = person.name;
                document.querySelector(".email").innerHTML = person.email;
              }
            );

            // GetProfile();
          } else {
            // user FB取消授權
            alert("Facebook帳號無法登入");
          }
          //"public_profile"可省略，仍然可以取得name、userID
        },
        { scope: "public_profile,email" }
      );
    }
  });
}
