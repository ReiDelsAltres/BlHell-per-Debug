if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Сервис-воркер зарегистрирован c областью:', registration.scope);
            })
            .catch(error => {
                console.error('Ошибка регистрации сервис-воркера:', error);
            });
    });
}

window.loadFromCache = async (url) => {
    try {
        const cachedResponse = await caches.match(url);
        if (cachedResponse) {
            const arrayBuffer = await cachedResponse.arrayBuffer();
            const byteArray = Array.from(new Uint8Array(arrayBuffer));
            return byteArray;
        }
        console.warn("Вы офлайн, и данных в кэше не найдено для URL: " + url);
        return null;
    } catch (error) {
        console.error("Ошибка при загрузке из кэша:", error);
        return null;
    }
}
