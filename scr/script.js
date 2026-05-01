const video = document.getElementById('video');

async function startAI() {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
        
        detect();
    } catch (err) {
        falar("Erro na inicialização da câmera.");
        console.error(err);
    }
}

async function detect() {
    setInterval(async () => {
        const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        if (detection) {
            const nose = detection.landmarks.getNose()[3];
            moverOlhos(nose);
        }
    }, 60);
}

function moverOlhos(nosePoint) {
    const relX = (nosePoint.x / video.videoWidth);
    const relY = (nosePoint.y / video.videoHeight);
    const moveX = (relX - 0.5) * 100; 
    const moveY = (relY - 0.5) * 100;

    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
        eye.style.transform = `translate(${-moveX}px, ${moveY}px)`;
    });
}