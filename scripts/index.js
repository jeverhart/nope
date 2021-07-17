import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";

const counterDiv = document.getElementById("counter");

const config = {
  apiKey: "AIzaSyDEr5G5oGn-bDUdnIVODE30vkFxPq0OFXg",
  authDomain: "nope-a74cd.firebaseapp.com",
  databaseURL: "https://nope-a74cd.firebaseio.com/",
  storageBucket: "bucket.appspot.com",
};
firebase.initializeApp(config);

let hasParam = false;
let isNewParam = false;

const mySound = document.getElementById("sound");
const myGroup = document.getElementById("group");
const myForm = document.getElementById("group-form");

const goPlaces = (e) => {
  e.preventDefault();
  const myInput = document.getElementById("group-input");
  window.location.href =
    "https://nope.city/?group=" + myInput.value.toLowerCase();
};

if (myForm) {
  myForm.addEventListener("submit", goPlaces);
}

// Get url parameter values
const urlParams = new URLSearchParams(window.location.search);

let urlToCheck = ``;

// Get a reference to the database service
let counting = 0;

let starCountRef = firebase.database().ref("nopeCounter");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

if (urlParams.get("group") != null) {
  const myParam = urlParams.get("group");
  hasParam = true;
  urlToCheck = `groups/${myParam}`;
  starCountRef = firebase.database().ref(urlToCheck + "/nopeCounter");
  myGroup.innerHTML =
    "<a href='https://nope.city:1234/'>" +
    myParam +
    "<span style='margin-left:10px'>&times;</span></a>";
} else {
  const myParam = makeid(5);
  hasParam = true;
  urlToCheck = `groups/${myParam}`;
  starCountRef = firebase.database().ref(urlToCheck + "/nopeCounter");
}

let onLoad = 0;
starCountRef.on("value", function(dataSnapshot) {
  //console.log(dataSnapshot.node_.value_);

  if (dataSnapshot.node_.value_) {
    counting = dataSnapshot.node_.value_;
    counterDiv.innerHTML = new Intl.NumberFormat().format(
      dataSnapshot.node_.value_
    );
  } else {
    counting = 0;
    counterDiv.innerHTML = 0;
  }
  if (hasParam && onLoad > 0) {
    mySound.play();
    //window.speechSynthesis.speak(msg);
  }
  onLoad = onLoad + 1;
  console.log(onLoad);
});

function writeUserData(counter) {
  //if (process.env.NODE_ENV === 'production'){
  if (hasParam) {
    firebase
      .database()
      .ref(urlToCheck)
      .set({
        nopeCounter: counter,
      });
  } else {
    firebase
      .database()
      .ref()
      .set({
        nopeCounter: counter,
      });
  }
  //}
}

const body = document.getElementById("body");
const nopeBtn = document.getElementById("nope");
nopeBtn.addEventListener("touchstart", handleTouchStart);
nopeBtn.addEventListener("touchend", handleTouchEnd);

nopeBtn.addEventListener("click", sayNope);

const msg = new SpeechSynthesisUtterance();
msg.text = "Nope";
msg.lang = "en-US";

function handleTouchStart(e) {
  e.preventDefault();
  sayNope();
  body.classList.add("press");
}

function handleTouchEnd(ev) {
  body.classList.remove("press");
}

function sayNope() {
  if (hasParam) {
    body.classList.add("press");
    setTimeout(() => {
      body.classList.remove("press");
    }, 500);
  } else {
    //window.speechSynthesis.speak(msg);
    body.classList.add("press");
    setTimeout(() => {
      body.classList.remove("press");
    }, 500);
    mySound.play();
  }

  writeUserData(counting + 1);
}
