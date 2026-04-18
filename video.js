let videofeed;
let posenet;
let poses = [];
let started = false;

// Setup function
function setup() {
  const canvas = createCanvas(400, 450);
  canvas.parent("video");

  // FIXED: Proper camera initialization
  videofeed = createCapture({
    video: true,
    audio: false
  });

  videofeed.size(width, height);
  videofeed.parent("video");

  // Important for browser compatibility
  videofeed.elt.setAttribute('playsinline', '');
  videofeed.elt.muted = true;
  videofeed.elt.autoplay = true;

  // Load PoseNet
  posenet = ml5.poseNet(videofeed, () => {
    console.log("PoseNet Ready");
  });

  posenet.on("pose", function (results) {
    poses = results;
  });

  videofeed.hide(); // hide raw video (we draw on canvas)
  noLoop(); // stop draw until start is clicked
}

// Draw loop
function draw() {
  if (started) {
    image(videofeed, 0, 0, width, height);
    calEyes();
  }
}

// Start button
function start() {
  started = true;
  loop();
}

// Stop button
function stop() {
  started = false;
  noLoop();
  removeblur();
}

// Eye tracking variables
let rightEye, leftEye;
let defaultRightEyePosition = [];
let defaultLeftEyePosition = [];

// Calculate posture
function calEyes() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    rightEye = pose.keypoints[2].position;
    leftEye = pose.keypoints[1].position;

    // Store initial position once
    if (defaultRightEyePosition.length < 1) {
      defaultRightEyePosition.push(rightEye.y);
    }

    if (defaultLeftEyePosition.length < 1) {
      defaultLeftEyePosition.push(leftEye.y);
    }

    // Check posture deviation
    if (Math.abs(rightEye.y - defaultRightEyePosition[0]) > 20) {
      blur();
    } else {
      removeblur();
    }
  }
}

// Blur + sound
function blur() {
  document.body.style.filter = "blur(5px)";
  document.body.style.transition = "0.5s";

  let audio = document.getElementById("audioElement");
  if (audio.paused) {
    audio.play();
  }
}

// Remove blur
function removeblur() {
  document.body.style.filter = "blur(0px)";

  let audio = document.getElementById("audioElement");
  audio.pause();
}
