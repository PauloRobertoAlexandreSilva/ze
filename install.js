window.addEventListener("load", function() {

    let buttonInstallApp = document.getElementById("buttonInstallApp");
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt = e;
    });

    window.addEventListener("appinstalled", () => {
        buttonInstallApp.setAttribute("hidden", "");
    });

    buttonInstallApp.addEventListener("click", async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (outcome === 'accepted') {
                //console.log('User accepted the install prompt.');
            } else if (outcome === 'dismissed') {
                //console.log('User dismissed the install prompt');
            }
        }
    });
});