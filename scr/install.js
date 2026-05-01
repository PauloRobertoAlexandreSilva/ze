window.addEventListener("load", function() {

    let buttonInstallApp = document.getElementById("buttonInstallApp");
    buttonInstallApp.style.display = 'none';

    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt = e;
    });

    window.addEventListener("appinstalled", () => {
        event.preventDefault();         // Prevents immediate prompt display
        deferredPrompt = event;

        buttonInstallApp.style.display = 'initial';

        buttonInstallApp.addEventListener('click', () => {
            buttonInstallApp.style.display = 'none';
            deferredPrompt.prompt();
        });

        deferredPrompt.userChoice.then(function(choiceResult) {
            deferredPrompt = null;
        });
    });
});