// markdown.js

// Configuración recomendada para marked + hljs
if (typeof marked !== 'undefined' && typeof hljs !== 'undefined') {
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (_) {}
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
}

function renderMarkdown(text) {
    if (typeof marked !== 'undefined') {
        return marked.parse(text);
    }
    // Fallback: texto plano con saltos de línea si marked no carga
    return text.replace(/\n/g, '<br>');
}

function setupCodeBlocks(container) {
    container.querySelectorAll('pre code').forEach((block) => {
        // Evitar procesar dos veces el mismo bloque
        if (block.closest('.code-block-wrapper')) return;

        // Detecta el lenguaje
        let languageClass = Array.from(block.classList).find(cls => cls.startsWith('language-'));
        let language = languageClass ? languageClass.replace('language-', '').toUpperCase() : 'CODE';

        // Crear el wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // Crear la cabecera
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span>[${language}]</span>
            <button class="copy-btn" onclick="copyCode(this)">Copiar</button>
        `;

        // Reestructurar el DOM
        const preElement = block.parentNode;
        preElement.parentNode.insertBefore(wrapper, preElement);
        wrapper.appendChild(header);
        wrapper.appendChild(preElement);
    });

    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
}

function copyCode(button) {
    const wrapper = button.closest('.code-block-wrapper');
    const codeText = wrapper.querySelector('code').innerText;

    navigator.clipboard.writeText(codeText).then(() => {
        button.textContent = '¡Copiado!';
        setTimeout(() => {
            button.textContent = 'Copiar';
        }, 2000);
    });
}
