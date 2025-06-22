window.renderMath = (element, latex) => {
    if (window.katex) {
        // Функция renderToString генерирует HTML-строку для отображения формулы
        element.innerHTML = window.katex.renderToString(latex, { throwOnError: false, unicodeTextInMathMode: true });
    } else {
        console.error("KaTeX library is not loaded.");
    }
};
window.renderKaTeX = (latex, elementId) => {
    if (window.katex) {
        try {
            const htmlFormula = window.katex.renderToString(latex, { throwOnError: false, unicodeTextInMathMode: true });
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = htmlFormula;
            }
        } catch (e) {
            console.error("Ошибка при рендеринге KaTeX:", e);
        }
    } else {
        console.error("KaTeX не загружен");
    }
};
window.renderKaTeX = (latex) => {
    if (window.katex) {
        try {
            return window.katex.renderToString(latex, { throwOnError: false, strict: false });
        } catch (e) {
            console.error("Ошибка при рендеринге KaTeX:", e);
            return latex;
        }
    }
    console.error("KaTeX не загружен");
    return latex;
};

window.renderLatexText = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Элемент с id=${elementId} не найден.`);
        return;
    }
    // Вызываем auto-render на данном элементе с настройками разделителей
    if (window.renderMathInElement) {
        window.renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ]
        });
    } else {
        console.error("Функция renderMathInElement не определена.");
    }
};