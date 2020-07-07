/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const snapshotButton = document.getElementById('snapshot');
const filterSelect = document.getElementById('filter');

// Put variables in global scope to make them available to the browser console.
const video = window.video = document.getElementById('video');
const canvas = window.canvas = document.getElementById('canvas');
const image = window.image = document.getElementById('image');
const status = document.getElementById("status");
// canvas.width = 480;
// canvas.height = 360;

snapshotButton.onclick = function() {
    status.innerHTML = "processing...";
  canvas.className = filterSelect.value;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//   const dataURL = canvas.toDataURL();
//   image.src = dataURL;
    let src = cv.imread(canvas);
    let srctmp = new cv.Mat();
    let dst = new cv.Mat();
    let men = new cv.Mat();
    let menO = new cv.Mat();

    if(filterSelect.value == 'blur'){
        let ksize = new cv.Size(5, 5);
        cv.GaussianBlur(src, srctmp, ksize, 0, 0, cv.BORDER_DEFAULT);
    }else{
        srctmp = src;
    }
    cv.Laplacian(srctmp, dst, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
    cv.meanStdDev(dst, menO, men);
    // cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    console.log(menO.data64F[0], men.data64F[0]);
    if(men.data64F[0] > 10)
        status.innerHTML = "ok";
    else
        status.innerHTML = "blur";
    // cv.imshow('canvas', dst);
    src.delete(); dst.delete();
};

filterSelect.onchange = function() {
  video.className = filterSelect.value;
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);