import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

hydrate(<RemixBrowser />, document);

if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}    

// window.addEventListener('beforeinstallprompt', (event) => {
//     // Prevent the mini-infobar from appearing on mobile.
//     event.preventDefault();
//     console.log('👍', 'beforeinstallprompt', event);
//     // Stash the event so it can be triggered later.
//     window.deferredPrompt = event;
//     // Remove the 'hidden' class from the install button container.
//     divInstall.classList.toggle('hidden', true);
// });