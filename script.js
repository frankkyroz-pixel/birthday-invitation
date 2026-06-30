// ======================
// FIREBASE
// ======================

const firebaseConfig = {
  apiKey: "AIzaSyBNzko21LcfEUB0zt8aCo_7fEAak6pEr1c",
  authDomain: "invitation-birth.firebaseapp.com",
  databaseURL: "https://invitation-birth-default-rtdb.firebaseio.com",
  projectId: "invitation-birth",
  storageBucket: "invitation-birth.firebasestorage.app",
  messagingSenderId: "443858069397",
  appId: "1:443858069397:web:1784d601929096ef93389c",
  measurementId: "G-GHLE24BWVH"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("birthdayWall");

// =====================================
// BIRTHDAY INVITATION
// =====================================

// ---------- ELEMENT ----------
const slides = document.querySelectorAll(".slide");
const openBtn = document.getElementById("openBtn");

const nextBtns = document.querySelectorAll(".next");
const backBtns = document.querySelectorAll(".back");

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

const mapsBtn = document.getElementById("mapsBtn");
const waBtn = document.getElementById("waBtn");

let currentSlide = 0;
let musicPlaying = false;

// ---------- SHOW SLIDE ----------
function showSlide(index){

    if(index < 0) return;

    if(index >= slides.length) return;

    slides.forEach(slide=>{

        slide.classList.remove("active");

    });

    slides[index].classList.add("active");

    currentSlide = index;

}

// ---------- OPEN INVITATION ----------
openBtn.addEventListener("click",()=>{

    showSlide(1);

    function shootConfetti(){
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    });
}

shootConfetti();

    bgMusic.play().then(()=>{

        musicPlaying = true;

        musicBtn.textContent = "🔊";

    }).catch(()=>{

        console.log("Browser menolak autoplay.");

    });

});
// ==============================
// OPEN GOOGLE MAPS
// ==============================
if (mapsBtn) {
mapsBtn.addEventListener("click",()=>{

    window.open(
    "https://www.google.com/maps/place/TOKO+FAIZ/@-6.0922888,106.5243149,17z/data=!3m1!4b1!4m6!3m5!1s0x2e41fe253daeb943:0xad3a9da3762610c6!8m2!3d-6.0922888!4d106.5243149!16s%2Fg%2F11g6mh859s?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",      
     "_blank"
  );

});

}

// ==============================
// RSVP WHATSAPP
// ==============================
if(waBtn){
waBtn.addEventListener("click",()=>{

    const pesan = `Halo izz! 👋

Aku sudah menerima undangan ulang tahunmu 🎉

Aku akan hadir. Sampai jumpa!`;

    window.open(
        `https://wa.me/6285810091442?text=${encodeURIComponent(pesan)}`,
        "_blank"
    );

});
}

// ---------- NEXT ----------
nextBtns.forEach(button=>{

    button.addEventListener("click",()=>{

        showSlide(currentSlide + 1);

    });

});

// ---------- BACK ----------
backBtns.forEach(button=>{

    button.addEventListener("click",()=>{

        showSlide(currentSlide - 1);

    });

});

// ---------- MUSIC ----------
musicBtn.addEventListener("click",()=>{

    if(musicPlaying){

        bgMusic.pause();

        musicBtn.textContent = "🔇";

    }else{

        bgMusic.play();

        musicBtn.textContent = "🔊";

    }

    musicPlaying = !musicPlaying;

});
// ==============================
// BIRTHDAY WALL (CHAT)
// ==============================

// ======================
// NAME POPUP
// ======================

const popup = document.getElementById("namePopup");
const popupName = document.getElementById("popupName");
const saveName = document.getElementById("saveName");

let savedName = localStorage.getItem("guestName");

if(savedName){

    popup.classList.add("hide");

}else{

    popup.classList.remove("hide");

}

saveName.addEventListener("click",()=>{

    const name = popupName.value.trim();

    if(name===""){

        alert("Masukkan nama dulu 😊");

        return;

    }

    localStorage.setItem("guestName",name);

    savedName=name;

    popup.classList.add("hide");

});

const guestMessage = document.getElementById("guestMessage");
const sendWish = document.getElementById("sendWish");
const wishList = document.getElementById("wishList");

// ==============================
// LOAD CHAT REALTIME
// ==============================

chatRef.on("child_added", (snapshot) => {

    const wish = snapshot.val();

    const div = document.createElement("div");

    div.className = "wishItem";

  const colors = [
"#25D366",
"#0A84FF",
"#FF9800",
"#9C27B0",
"#F44336",
"#009688",
"#3F51B5",
"#E91E63"
];

const avatar = wish.name.charAt(0).toUpperCase();

const color = colors[
    wish.name.charCodeAt(0) % colors.length
];

div.innerHTML = `
<div class="chatHeader">

    <div class="avatar" style="background:${color}">
    
    ${avatar}

</div>

    <div class="chatInfo">

        <div class="chatName">

            ${wish.name}

        </div>

        <div class="chatMessage">

            ${wish.message}

        </div>

        <div class="chatTime">

            ${new Date(wish.time).toLocaleTimeString("id-ID",{
                hour:"2-digit",
                minute:"2-digit"
            })}

        </div>

    </div>

</div>
`;

        // otomatis scroll ke bawah 

    wishList.appendChild(div);

    wishList.scrollTop = wishList.scrollHeight;

});

   
   




// pertama kali load


// kirim ucapan


sendWish.addEventListener("click",()=>{

    const name = savedName;
    const message = guestMessage.value.trim();
   if(!message){

    alert("Tulis ucapan dulu ya 😊");

    return;

}
  
    // kirim ke Firebase
    chatRef.push({

        name: name,

        message: message,

        time: Date.now()

    });

    guestMessage.value="";

});
    