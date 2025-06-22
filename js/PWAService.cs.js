window.PWA_Initialize = async (interop) => {
    let handler = function () {
        interop.invokeMethodAsync("PWAService.StatusChanged", navigator.onLine);
    }

    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);

    handler(navigator.onLine);

    return handler
}
window.PWA_Dispose = async (handler) => {
    if (handler != null) {

        window.removeEventListener("online", handler);
        window.removeEventListener("offline", handler);
    }
}