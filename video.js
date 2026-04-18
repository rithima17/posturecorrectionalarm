let videoElement;
let started = false;

// Unlock audio (VERY IMPORTANT for Chrome)
function unlockAudio() {
    let audio = document.getElementById("audioElement");

    audio.muted = true;
    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        console.log("Audio unlocked");
    }).catch(err => console.log("Unlock failed:", err));
}

function start() {
    console.log("START CLICKED");

    if (started) return;
    started = true;

    unlockAudio(); // 🔥 unlock sound

    const container = document.getElementById("video");
    container.innerHTML = "";

    videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.style.width = "400px";
    videoElement.style.height = "300px";

    container.appendChild(videoElement);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoElement.srcObject = stream;
        })
        .catch(err => {
            console.error(err);
            alert("Camera not working: " + err.message);
        });
}

function stop() {
    started = false;

    if (videoElement && videoElement.srcObject) {
        let tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }

    document.getElementById("video").innerHTML = "";
}

// Play beep
function playBeep() {
    let audio = document.getElementById("audioElement");

    audio.currentTime = 0;
    audio.play().then(() => {
        console.log("Beep played");
    }).catch(err => {
        console.log("Beep failed:", err);
    });
}
