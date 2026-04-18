let videofeed;
let posenet;
let poses = [];
let started = false;

function setup() {
  const canvas = createCanvas(400, 300);
  canvas.parent("video");

  videofeed = createCapture({
    video: true,
    audio: false
  });

  videofeed.size(400, 300);

  // browser compatibility fix
  videofeed.elt.setAttribute('playsinline', '');
  videofeed.elt.muted = true;
  videofeed.elt.autoplay = true;

  posenet = ml5.poseNet(videofeed, () => {
    console.log("PoseNet Ready");
  });

  posenet.on("pose", (results) => {
    poses = results;
  });

  videofeed.hide();
  noLoop();
}

function draw() {
  if (started) {
    image(videofeed, 0, 0, width, height);
  }
}

function start() {
  console.log("START CLICKED");
  started = true;
  loop();
}

function stop() {
  started = false;
  noLoop();
  document.body.style.filter = "none";
}

let defaultY = null;

function checkPosture() {
  if (poses.length > 0) {
    let y = poses[0].pose.keypoints[1].position.y;

    if (defaultY === null) {
      defaultY = y;
    }

    if (Math.abs(y - defaultY) > 20) {
      document.body.style.filter = "blur(5px)";
      document.getElementById("audioElement").play();
    } else {
      document.body.style.filter = "none";
      document.getElementById("audioElement").pause();
    }
  }
}
