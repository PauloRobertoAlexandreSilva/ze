window.addEventListener('DOMContentLoaded', () => {

    if (!('share' in navigator) || !('canShare' in navigator)) {
        console.log('Web Share API not supported in this environment.');
        document.getElementById("buttonShare").style.display = "none";
        return;
    } else {
        document.getElementById("buttonShare").addEventListener("click", async () => {
            try {
                const response = await fetch('img/icon_180.png');
                const blob = await response.blob();
                const filesArray = [
                    new File(
                        [blob],
                        'img/icon_180.png',
                        { type: blob.type, lastModified: new Date().getTime() }
                    )
                ];

                const shareData = {
                    files: filesArray,
                    title: "Zé - Seu Assistente Virtual",
                    text: "Transforma o seu smartphone em um assistente virtual poderoso!\n\n\n",
                    url: "https://paulorobertoalexandresilva.github.io/ze/",
                };

                if (!(navigator.canShare(shareData))) {
                    throw new Error("Cannot share this data type or combination.");
                }

                await navigator.share(shareData);
            } catch (err) {
                console.log(err);
            }
        });

    }
});