var BasePath = "/"

window.dynamicBasePath = () => {
    var productionRoot = "/BlHell-per/";
    var debugRoot = "/BlHell-per-Debug/"
    var path = document.location.pathname;

    if (path.startsWith(debugRoot)) {
        BasePath = debugRoot;
    } else if (path.startsWith(productionRoot)) {
        BasePath = productionRoot;
    }
    return BasePath;
}
window.dynamicHref = (url) => {
    return BasePath + url;
}
window.dynamicSetUp = () => {
    var baseTag = document.createElement("base");
    var productionRoot = "/BlHell-per/";
    var debugRoot = "/BlHell-per-Debug/"
    var path = document.location.pathname;

    if (path.startsWith(debugRoot)) {
        baseTag.href = debugRoot;
    } else if (path.startsWith(productionRoot)) {
        baseTag.href = productionRoot;
    } else {
        baseTag.href = "/";
    }

    // Очень важно вставить <base> как первый элемент внутри <head>
    document.head.insertBefore(baseTag, document.head.firstChild);
}