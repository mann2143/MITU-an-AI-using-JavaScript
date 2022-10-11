// vars and elements

const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const turn_on = document.querySelector("#turn_on");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const machine = document.querySelector(".machine");
const msgs = document.querySelector(".messages");
let stopingR = false;

// create a new message

function createMsg(who, msg) {
let newmsg = document.createElement("p");
newmsg.innerText = msg;
newmsg.setAttribute("class", who);
//msgs.appendChild(newmsg);
}


document.querySelector("#start_mitu_btn").addEventListener("click" , () =>{
  recognition.start();
});


// mitu's commands

let mituComs = [];
mituComs.push("hi mitu");
mituComs.push("what are your command");
mituComs.push("close this - to close opened popups");
mituComs.push(
  "change my information - information regarding your acoounts and you"
);
mituComs.push("whats the weather or temperature");
mituComs.push("show the full weather report");
mituComs.push("are you there - to check mitus presence");
mituComs.push("shut down - stop voice recognition");
mituComs.push("open google");
mituComs.push('search for "your keywords" - to search on google ');
mituComs.push("open youtube");
mituComs.push('play "your keywords" - to search on youtube ');
mituComs.push("close this youtube tab - to close opened youtube tab");
mituComs.push("open firebase");
mituComs.push("open instagram");
mituComs.push("open my instagram profile");
mituComs.push("open github");
mituComs.push("open my github profile");

// show a warn to check for all the commands

console.warn('*to check for the commands speak "what are your commands"');

// date and time
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

// this is what mitu tells about weather
let weatherStatement = "";
let charge,chargeStatus, connectivity, currentTime
chargeStatus = "unplugged"

window.onload = () => {
  // turn_on.play();
  turn_on.addEventListener("ended", () => {
    setTimeout(() => {
      // automitu();
      readOut("Ready to go");
      if (localStorage.getItem("mitu_setup") === null) {
        readOut(
          "kindly fill out the form on your screen so that you could access most of my features and if you want to see my commands see a warning in the console"
        );
      }
    }, 200);
  });

  mituComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p><br />`;
  });
  // battery
  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  // internet connectivity

    if(navigator.onLine){
      document.querySelector("#internet").textContent = "online"
      connectivity = "online"
    } else {
      document.querySelector("#internet").textContent = "offline"
      connectivity = "offline"
    }

  setInterval(() => {
    if(navigator.onLine){
      document.querySelector("#internet").textContent = "online"
      connectivity = "online"
    } else {
      document.querySelector("#internet").textContent = "offline"
      connectivity = "offline"
    }
  }, 60000);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${
      (batteryObject.level * 100).toFixed(2)
    }%`;
    charge = batteryObject.level * 100
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${
        (batteryObject.level * 100).toFixed(2)
      }% Charging`;
      chargeStatus = "plugged in"
    }
  }

  // timer
  setInterval(() => {
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  time.textContent = `${hrs} : ${mins} : ${secs}`;
  }, 1000);
};

//function formatAMPM(date) {
  //var hours = date.getHours();
  //var minutes = date.getMinutes();
  //var ampm = hours >= 12 ? 'pm' : 'am';
  //hours = hours % 12;
  //hours = hours ? hours : 12; // the hour '0' should be '12'
  //minutes = minutes < 10 ? '0'+minutes : minutes;
  //var strTime = hours + ':' + minutes + ' ' + ampm;
  //currentTime = strTime
  //time.textContent = strTime
//}

//formatAMPM(date)
//setInterval(() => {
  //formatAMPM(date)
//}, 60000);

// auto mitu

function automitu() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

// 
// start mitu with btn
document.querySelector("#start_mitu_btn").addEventListener("click", () => {
  recognition.start();
})


document.querySelector("#stop_mitu_btn").addEventListener("click", () => {
  stopingR = true;
  recognition.stop();
})

// show waether
function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}`;
      weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
      weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `the weather in ${data.name} is ${
        data.weather[0].description
      } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
    }
  };

  xhr.send();
}

// convert kelvin to celcius
function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

if (localStorage.getItem("mitu_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("mitu_setup")).location);
}

// mitu information setup

const setup = document.querySelector(".mitu_setup");
setup.style.display = "none";
if (localStorage.getItem("mitu_setup") === null) {
  setup.style.display = "flex";
  setup.querySelector("button").addEventListener("click", userInfo);
}

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value,
    instagram: setup.querySelectorAll("input")[3].value,
    github: setup.querySelectorAll("input")[4].value,
  };

  let testArr = [];

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("please enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("mitu_setup", JSON.stringify(setupInfo));
    setup.style.display = "none";
    weather(JSON.parse(localStorage.getItem("mitu_setup")).location);
  }
}

// speech recognition

// speech lang

let speech_lang = "hi-IN" // "hi-IN" | "en-US"
if(localStorage.getItem("lang") === null){
  localStorage.setItem("lang", "en-US")
}


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = localStorage.getItem("lang")

var synth = window.speechSynthesis;
// const speech = new SpeechSynthesisUtterance();

recognition.onstart = function () {
  console.log("voice recognition activated");
  document.querySelector("#stop_mitu_btn").style.display = "flex"
};

// arr of window
let windowsB = []

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  let userData = localStorage.getItem("mitu_setup");
  console.log(`my words :${transcript}`);
 // createMsg("usermsg", transcript);
  // commands
  // hi - hello

  if(localStorage.getItem("lang") === "en-US"){
    if (transcript.includes("hi mitu")) {
      readOut("hello user");
    }

    // change lang command

    if(transcript.includes("switch to hindi")){
      readOut("switching to hindi")
      speech_lang = "hi-IN"
      localStorage.setItem("lang", "hi-IN")
      stopingR = true
      recognition.stop()
      location.reload()
      readOutHindi("मैं तैयार हूँ, सर")
    }
  
    // some casual commands
    if (transcript.includes("what is the current charge")) {
      readOut(`the current charge is ${charge}`);
    }
    if (transcript.includes("what is the charging status")) {
      readOut(`the current charging status is ${chargeStatus}`);
    }
    if (transcript.includes("what is the current time")) {
      readOut(`the current time is ${currentTime}`);
    }
    if(transcript.includes("what is the connection status")) {
      if (JSON.parse(userData).name){
        readOut(`you are ${connectivity} ${JSON.parse(userData).name}`)
      }
    }
    // mitu commands
    if (transcript.includes("what are your command")) {
      readOut("here's the list of commands i can follow");
      if(window.innerWidth <= 400 ){
        window.resizeTo(screen.width,screen.height)
      }
      document.querySelector(".commands").style.display = "block";
    }
    // mitu bio
    if (transcript.includes("tell me about yourself")) {
      readOut(
        "i am mitu, a voice assistant made for browsers using javascript by Mr. Harman. I can do anything which can be done from a browser."
      );
    }
  
    // close popups
    if (transcript.includes("close this")) {
      readOut("closing the tab ");
      document.querySelector(".commands").style.display = "none";
      if(window.innerWidth >= 401 ){
        window.resizeTo(250,250)
      }
      setup.style.display = "none";
    }
  
    // info change
    if (transcript.includes("change my information")) {
      readOut("Opening the information tab");
      localStorage.clear();
      
      if(window.innerWidth <= 400 ){
        window.resizeTo(screen.width,screen.height)
      }
      setup.style.display = "flex";
      setup.querySelector("button").addEventListener("click", userInfo);
    }
  
    
    // weather report
    if (
      transcript.includes("what is the current temperature")
    ) {
      readOut(weatherStatement);
    }
  
    if (transcript.includes("full weather report")) {
      readOut("opening the weather report");
      let a = window.open(
        `https://www.google.com/search?q=weather+in+${
          JSON.parse(localStorage.getItem("mitu_setup")).location
        }`
      );
      windowsB.push(a)
    }
    // availability check
    if (transcript.includes("are you there")) {
      readOut("yes");
    }
    // close voice recognition
    if(transcript.includes("shut down")||(transcript.includes("shutdown"))) {
      if (JSON.parse(userData).name){
        readOut(`OK ${JSON.parse(userData).name} I will take a nap`)
        stopingR = true;
        recognition.stop();
      }
    }
  
    if(transcript.includes("meetoo") ||transcript.includes("mi tu") ||transcript.includes("mi too") ||transcript.includes("me too")||transcript.includes("mitthu")||transcript.includes("bittu")) {
      readOut(`Standby, Gathering the data,,,Data has been configured and accepted`);
    }

  if(transcript.includes("hello")) {
      if (JSON.parse(userData).name){
        readOut(`Hello ${JSON.parse(userData).name} I am mitu Mr. Harman's augmented reality and personal assistant.`)
      }
  }

  if(transcript.includes("hii")||transcript.includes("hi")){
      if(JSON.parse(userData).name){
        readOut(`Hello ${JSON.parse(userData).name} I am mitu Mr. Harman's augmented reality and personal assistant.`)
  }
};

  if(transcript.includes("for me")) {
  readOut("no,but you have access to all of harman's protocols. Do you want to know what all things I can do?");
}

  if(transcript.includes("yes")||transcript.includes("yess")){
   readOut("mitu stands for Multimedia and Interactive Teaching Unit. Mr Harman really likes his acronyms... Speaking of the things I can do,,,....... I have access to the entire global network")
}
  if(transcript.includes("no thank you")||transcript.includes("noo, thank you")){
   readOut("Thankyou for your precious time. If you need any help feel free to ask me")
}

  
    // firebase
  
    if (transcript.includes("open fire base") && transcript.includes("account")) {
      readOut("opening firebase console");
      let accId = transcript;
      accId = accId.split("");
      accId.pop();
      accId = accId[accId.length - 1];
      console.log(`accId: ${accId}`);
      // https://console.firebase.google.com/u/0/
      let a = window.open(`https://console.firebase.google.com/u/${accId}/`);
      windowsB.push(a)
    }
  
    // userdata access commands
  
    if (transcript.includes("what is my name")) {
      readOut(`I know that you are ${JSON.parse(userData).name}`);
    }
    if (transcript.includes("what is my bio")) {
      readOut(`I know that you are ${JSON.parse(userData).bio}`);
    }
  
    // google
  
    if (transcript.includes("open google")) {
      readOut("opening google");
      let a = window.open("https://www.google.com/");
      windowsB.push(a)
    }
  
    if (transcript.includes("in googe search")) {
      readOut("here's your result");
      let input = transcript.split("");
      input.splice(0, 11);
      input.pop();
      input = input.join("").split(" ").join("+");
      let a = window.open(`https://www.google.com/search?q=${input}`);
      windowsB.push(a)
    }
  
    // youtube
    if (transcript.includes("open youtube")) {
      readOut("opening youtube");
      let a = window.open("https://www.youtube.com/");
      windowsB.push(a)
    }
  
    if (transcript.includes("play videos of")) {
      let playStr = transcript.split("");
      playStr.splice(0, 15);
      let videoName = playStr.join("");
      playStr = playStr.join("").split(" ").join("+");
      readOut(`searching youtube for ${videoName}`);
      let a = window.open(`https://www.youtube.com/search?q=${playStr}`
      );
      windowsB.push(a)
    }
  
    // OPEN AMAZON

 if (transcript.includes("open amazon")){
  readOut("Opening amazon");
  let a = window.open("https://www.amazon.com/");
  windowsB.push(a)
}

// AMAZON SEARCH

if(transcript.includes("in amazon search")){
  readOut("Searching.... here's the result");
  let input = transcript.split("");
  input.splice(0,17);
  input.pop();
  input = input.join("").split(" ").join("+");
  console.log(input);
  let a = window.open(`https://www.amazon.com/s?k=${input}`)
  windowsB.push(a)
}

// OPEN FLIPKART

if (transcript.includes("open flipkart")){
  readOut("Opening flipkart");
  let a = window.open("https://www.flipkart.com/");
  windowsB.push(a)
}

// FLIPKART SEARCH

if(transcript.includes("in flipkart search")){
  readOut("Searching.... here's the result");
  let input = transcript.split("");
  input.splice(0,19);
  input.pop();
  input = input.join("").split(" ").join("-");
  console.log(input);
  let a = window.open(`https://www.flipkart.com/search?q=${input}`)
  windowsB.push(a)
}

// OPEN FACEBOOK

if (transcript.includes("open facebook")){
  readOut("Opening facebook");
  let a = window.open("https://www.facebook.com/");
  windowsB.push(a)
}

// FACEBOOK SEARCH

if(transcript.includes("in facebook search")){
  readOut("Searching.... here's the result");
  let input = transcript.split("");
  input.splice(0,18);
  input.pop();
  input = input.join("").split(" ").join(".");
  console.log(input);
  let a = window.open(`https://www.facebook.com/${input}`)
  windowsB.push(a)
}

// OPEN WIKIPEDIA

if (transcript.includes("open wikipedia")){
  readOut("Opening wikipedia");
  let a = window.open("https://www.wikipedia.org");
  windowsB.push(a)
}

// WIKIPEDIA SEARCH

//if(transcript.includes("show me everything you know about")){
  //readOut("Searching.... here's the result");
  //let input = transcript.split("");
  //input.splice(0,34);
  //input.pop();
  //input = input.join("").split(" ").join("_");
  //console.log(input);
  //let a = window.open(`https://en.wikipedia.org/wiki/${input}`)
  //windowsB.push(a)
//}

// OPEN CLASSROOM

if (transcript.includes("open classroom") && transcript.includes("account")){
  readOut("Opening classroom");
  let accId = transcript;
  accId = accId.split("");
  accId.pop();
  accId = accId[accId.length - 1];
  console.log(`accId: ${accId} `);
  let a = window.open(`https://classroom.google.com/u/${accId}/h`);
  windowsB.push(a)
}

// OPEN ANY WEBSITE

if(transcript.includes("search")){
  readOut("Searching.... here's the result");
  let input = transcript.split("");
  input.splice(0,7);
  input.pop();
  input = input.join("").split(" ").join("+");
  console.log(input);
  let a = window.open(`https://www.bing.com/search?q=${input}`)
  windowsB.push(a)
}
  
    // instagram
    if (transcript.includes("open instagram")) {
      readOut("opening instagram");
      let a =window.open("https://www.instagram.com");
      windowsB.push(a)
    }
    if (transcript.includes("open my instagram profile")) {
      if (JSON.parse(userData).instagram) {
        readOut("opening your instagram profile");
        let a =window.open(
          `https://www.instagram.com/${JSON.parse(userData).instagram}/`
        );
        windowsB.push(a)
      } else {
        readOut("i didn't found your instagram information");
      }
    }
    
    // github
    if (transcript.includes("open my github profile")) {
      readOut("opening your github profile");
      let a = window.open(`https://github.com/${JSON.parse(userData).github}`);
      windowsB.push(a)
    }
    if (transcript.includes("open github")) {
      readOut("opening github");
      let a = window.open("https://github.com/");
      windowsB.push(a)
    }
    // calendar
    if (transcript.includes("open calendar")) {
      readOut("opening calendar");
      let a = window.open("https://calendar.google.com/");
      windowsB.push(a)
    }
    // close all opened tabs
    if (transcript.includes("close all tabs")) {
      readOut("closing all tabs")
      windowsB.forEach((e) => {
        e.close()
      })
  
    }
  
    // news commands
    if (transcript.includes("top headlines")) {
      readOut("These are today's top headlines")
      getNews()
  
    }
  
    if (transcript.includes("news regarding")) {
      readOut("These are today's top headlines")
      let input = transcript
      let a = input.indexOf("regarding")
      input = input.split("")
      input.splice(0,a+9)
      input.shift()
      input.pop()
  
      readOut(`here's some headlines on ${input.join("")}`)
      getCategoryNews(input.join(""))
  
    }
  }    

  if(localStorage.getItem("lang") === "hi-IN"){
    if(transcript.includes("हैलो जार्विस")){
      readOutHindi("हैलो सर")
    }

    if(transcript.includes("इंग्लिश में बदलो")){
      readOutHindi("इंग्लिश में बदल रहा हूँ")
      speech_lang = "en-US"
      localStorage.setItem("lang", "en-US")
      stopingR = true
      recognition.stop()
      location.reload()
      readOut("ready to go")
    }
  }


}

recognition.onend = function () {
  if (stopingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stopingR === true) {
    recognition.stop();
    document.querySelector("#stop_mitu_btn").style.display = "none"
  }
};

// speak out



function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
  // createMsg("jmsg", message);
}


function readOutHindi(message) {
  
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  speech.lang = "hi-IN"
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
  createMsg("jmsg", message);
}





// small mitu
const smallmitu = document.querySelector("#small_mitu")



//smallmitu.addEventListener("click", () => {
  //window.open(`${window.location.href}`,"newWindow","menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0")
  //window.close()
//})



document.querySelector("#mitu_start").addEventListener("click", () => {
  recognition.start()
})

// calendar

const lang = navigator.language;

let datex = new Date();
let dayNumber 	= date.getDate();
let monthx 		= date.getMonth();

let dayName 	= date.toLocaleString(lang, {weekday: 'long'});
let monthName 	= date.toLocaleString(lang, {month: 'long'});
let year 		= date.getFullYear();

document.querySelector("#month").innerHTML = monthName
document.querySelector("#day").innerHTML = dayName
document.querySelector("#date").innerHTML = dayNumber
document.querySelector("#year").innerHTML = year

document.querySelector(".calendar").addEventListener("click", () => {
  window.open("https://calendar.google.com/")
})


// news setup

async function getNews(){
  var url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=b0712dc2e5814a1bb531e6f096b3d7d3"
  var req = new Request(url)
  await fetch(req).then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 10
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")

    });
    readOut(a)
  })
}

// category news

let yyyy,mm,dd

dd = date.getDate()
mm = date.getMonth()
yyyy = date.getFullYear()

async function getCategoryNews(category){
  var url =
    "https://newsapi.org/v2/everything?" +
    `q=${category}&` +
    `from=${yyyy}-${mm}-${dd}&` +
    "sortBy=popularity&" +
    "apiKey=b0712dc2e5814a1bb531e6f096b3d7d3";

    // https://newsapi.org/v2/everything?q=Apple&from=2021-09-19&sortBy=popularity&apiKey=API_KEY

    var req = new Request(url)

  await fetch(req).then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 10
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")
    });
    readOut(a)
  })
}