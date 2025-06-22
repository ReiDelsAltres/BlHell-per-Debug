window.getSvgPathAttribute = (selector, attribute = "d") => {
    const pathElement = document.querySelector(selector);
    return pathElement ? pathElement.getAttribute(attribute) : null;
};