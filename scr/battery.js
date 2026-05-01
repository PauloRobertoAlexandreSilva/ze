
// Lógica da Bateria
async function monitorarBateria() {
    const batteryLevel = document.getElementById('battery-level');

    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        
        const atualizarStatus = () => {
            const nivel = Math.round(battery.level * 100);
            batteryLevel.innerText = `${nivel}%`;

            if (nivel <= 15 && !battery.charging) {
                
                batteryLevel.style.color = "var(--danger)";
                if (!jaAvisouFome) {
                    falar("Ei, eu estou cansado e ficando sem energia! Por favor, me conecte ao carregador.");
                    jaAvisouFome = true;
                }
            } else if (nivel <= 50) {
                batteryLevel.style.color = "orange";
                jaAvisouFome = false;
            } else {
                batteryLevel.style.color = "var(--cyan)";
                jaAvisouFome = false;
            }
        };

        atualizarStatus();
        battery.addEventListener('levelchange', atualizarStatus);
        battery.addEventListener('chargingchange', atualizarStatus);
    }
}