let videoElement;
let started = false;

function start() {
    console.log("START CLICKED");

    if (started) return;
    started = true;

    videoElement = document.createElement("video");
    videoElement.setAttribute("autoplay", true);
    videoElement.setAttribute("playsinline", true);
    videoElement.style.width = "400px";
    videoElement.style.height = "300px";

    const container = document.getElementById("video");
    container.innerHTML = ""; // clear previous
    container.appendChild(videoElement);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoElement.srcObject = stream;
        })
        .catch(err => {
            console.error("Camera error:", err);
            alert("Camera access failed: " + err.message);
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
