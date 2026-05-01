const greetingText = document.getElementById('greeting-text');
const statusbar = document.getElementById('status-bar');
const onboardingForm = document.getElementById('onboarding-form');
const zeface = document.getElementById('Ze-face');

let jaAvisouFome = false;

document.getElementById('btn-salvar').addEventListener('click', () => {
    const nome = document.getElementById('input-nome').value;
    const idade = document.getElementById('input-idade').value;
    
    if(nome && idade) {
        localStorage.setItem('nome', nome);
        localStorage.setItem('idade', idade);
        
        falar(`Olá ${nome}, que bom te ver!`);

        onboardingForm.classList.add('hidden');
        statusbar.classList.remove('hidden');
        zeface.classList.remove('hidden');
    }
});

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

window.addEventListener('load', init);