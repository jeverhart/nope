const counterDiv = document.getElementById('counter');
var config = {
  apiKey: 'AIzaSyDEr5G5oGn-bDUdnIVODE30vkFxPq0OFXg',
  authDomain: 'nope-a74cd.firebaseapp.com',
  databaseURL: 'https://nope-a74cd.firebaseio.com/',
  storageBucket: 'bucket.appspot.com',
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var counting = 0;

var starCountRef = firebase.database().ref('nopeCounter');
starCountRef.on('value', function(dataSnapshot) {
  console.log(dataSnapshot.node_.value_);
  counterDiv.innerHTML = dataSnapshot.node_.value_;
  counting = dataSnapshot.node_.value_;
});

function writeUserData(counter) {
  console.log('welp');
  firebase
    .database()
    .ref()
    .set({
      nopeCounter: counter,
    });
}

const nopeBtn = document.getElementById('nope');
nopeBtn.addEventListener('touchstart', pressButton);
nopeBtn.addEventListener('touchend', restoreButton);

nopeBtn.addEventListener('click', sayNope);

const msg = new SpeechSynthesisUtterance();
msg.text = 'Nope';
msg.lang = 'en-US';

function pressButton(event) {
  nopeBtn.classList.add('press');
  event.preventDefault();
}

function sayNope(ev) {
  window.speechSynthesis.speak(msg);
  writeUserData(counting + 1);
  ev.preventDefault();
}

function restoreButton(ev) {
  nopeBtn.classList.remove('press');
  sayNope(ev);
}
