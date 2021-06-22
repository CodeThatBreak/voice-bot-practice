var grammar =
  "#JSGF V1.0; grammar keywords; public <keyword> = find | search | google |  for | web | sprinklr | go | to";

var recognition = new webkitSpeechRecognition() || SpeechRecognition();
var speechRecognitionList =
  new webkitSpeechGrammarList() || SpeechGrammarList();

recognition.continuous = false;
recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let btn = document.querySelector(".listen");
var message = document.querySelector(".output");

btn.addEventListener("click", () => {
  recognition.start();
  message.innerHTML = "Listening....";
});

recognition.onend = function(event){
  recognition.stop()
  message.innerHTML = "Click on mic button to start listening"; 
}

recognition.onresult = function (event) {
  var transcript = event.results[0][0].transcript;
  message.innerHTML = "Processing...";

  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transcript: transcript,
    }),
  }).then((res) => {
    res.json().then((value) => {
      switch (value.action) {
        case "search":
          message.innerHTML = "Redirecting...";
          window.open(`http://google.com/search?q=${value.search_query}`);
          message.innerHTML = "Click on mic button to start listening";
          break;

        case "website":
          message.innerHTML = "Redirecting...";
          window.open(`https://${value.website}`);
          message.innerHTML = "Click on mic button to start listening";
          break;

        default:
          message.innerHTML = value.message;
      }
    });
  });
};
