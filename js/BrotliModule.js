(async () => {

    const brotli = await import("https://unpkg.com/brotli-wasm@3.0.0/index.web.js?module")
        .then(m => m.default);

    window.brotliWasm = brotli;
    console.log("brotliWasm загружен:", window.brotliWasm);
})();

window.compressBrotli = (buffer) => {
    const jsArray = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

    if (!window.brotliWasm) {
        throw new Error("brotliWasm не проинициализирован. Проверьте, что модуль загружен.");
    }

    const result =  window.brotliWasm.compress(jsArray);

    let binary = "";
    result.forEach(b => binary += String.fromCharCode(b));
    // Преобразуем в Base64
    return btoa(binary);
};

// Функция для декомпрессии
window.decompressBrotli = (buffer) => {
    const jsArray = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

    if (!window.brotliWasm) {
        throw new Error("brotliWasm не проинициализирован. Проверьте, что модуль загружен.");
    }

    try {
        const result = window.brotliWasm.decompress(jsArray);

        let binary = "";
        result.forEach(b => binary += String.fromCharCode(b));
        // Преобразуем в Base64
        return btoa(binary);
    } catch (error) {

        console.warn(error)
        return buffer;
    }
};
