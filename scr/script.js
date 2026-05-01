const video = document.getElementById('video');
const onboardingForm = document.getElementById('onboarding-form');
const zeface = document.getElementById('Ze-face');
const greetingText = document.getElementById('greeting-text');
const batteryLevelEl = document.getElementById('battery-level');
const hungerIconEl = document.getElementById('hunger-icon');
const statusbar = document.getElementById('status-bar');

let jaAvisouFome = false;

function falar(texto) {
    greetingText.innerText = texto;
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR';
    synth.speak(utter);
}

async function init() {
    const nome = localStorage.getItem('nome');
    
    if (!nome) {
        onboardingForm.classList.remove('hidden');
        falar("Olá! Eu sou o Zé. Por favor, me diga seu nome e sua idade.");
    } else {
        statusbar.classList.remove('hidden');
        zeface.classList.remove('hidden');
        falar(`Olá ${nome}, que bom te ver!`);
    }
    
    startAI();
    monitorarBateria();
}

document.getElementById('btn-salvar').addEventListener('click', () => {
    const nome = document.getElementById('input-nome').value;
    const idade = document.getElementById('input-idade').value;
    
    if(nome && idade) {
        localStorage.setItem('nome', nome);
        localStorage.setItem('idade', idade);
        onboardingForm.classList.add('hidden');
        falar(`Olá ${nome}, que bom te ver!`);
    }
});


// Lógica da Bateria
async function monitorarBateria() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        
        const atualizarStatus = () => {
            const nivel = Math.round(battery.level * 100);
            batteryLevelEl.innerText = `${nivel}%`;

            if (nivel <= 15 && !battery.charging) {
                
                batteryLevelEl.style.color = "var(--danger)";
                if (!jaAvisouFome) {
                    falar("Ei, eu estou cansado e ficando sem energia! Por favor, me conecte ao carregador.");
                    jaAvisouFome = true;
                }
            } else if (nivel <= 50) {
                batteryLevelEl.style.color = "orange";
                jaAvisouFome = false;
            } else {
                batteryLevelEl.style.color = "var(--cyan)";
                jaAvisouFome = false;
            }
        };

        atualizarStatus();
        battery.addEventListener('levelchange', atualizarStatus);
        battery.addEventListener('chargingchange', atualizarStatus);
    }
}

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
    const eyes = document.querySelectorAll('.eye');
    const pupils = document.querySelectorAll('.pupil');
    const relX = (nosePoint.x / video.videoWidth);
    const relY = (nosePoint.y / video.videoHeight);
    const moveX = (relX - 0.5) * 40; 
    const moveY = (relY - 0.5) * 40;

    eyes.forEach(eye => {
        eye.style.transform = `translate(${-moveX}px, ${moveY}px)`;
    });

    pupils.forEach(pupil => {
        // const rect = pupil.getBoundingClientRect();

        // Dimensions and viewport-relative position
        // const width = rect.width;
        // const height = rect.height;
        // const top = rect.top;
        // const left = rect.left;
        //alert(`Eye dimensions: ${width}x${height}, Position: (${left}, ${top})`);

        // Optional: Position relative to the document (accounting for scroll)
        // const documentTop = top + window.scrollY;
        // const documentLeft = left + window.scrollX;
        //alert(`Eye position relative to document: (${documentLeft}, ${documentTop})`);

        pupil.style.transform = `translate(${-moveX}px, ${moveY}px)`;
    });
}

window.addEventListener('load', init);