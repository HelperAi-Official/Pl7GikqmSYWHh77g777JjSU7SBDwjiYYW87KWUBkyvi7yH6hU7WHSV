// markdown.js - Encargado de procesar el texto y los bloques de código

function renderMarkdown(text) {
    if (typeof marked !== 'undefined') {
        return marked.parse(text);
    }
    // Si por alguna razón marked no cargó, regresa el texto plano con saltos de línea
    return text.replace(/\n/g, '<br>');
}

function setupCodeBlocks(container) {
    container.querySelectorAll('pre code').forEach((block) => {
        if (block.parentElement.parentElement.classList.contains('code-block-wrapper')) return;

        // Detecta el lenguaje (ej: language-python -> PYTHON)
        let language = Array.from(block.classList).find(cls => cls.startsWith('language-'));
        language = language ? language.replace('language-', '').toUpperCase() : 'CODE';

        // Crea la burbuja contenedora del código
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // Crea la cabecera con el lenguaje y el botón de copiar
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span>[${language}]</span>
            <button class="copy-btn" onclick="copyCode(this)">Copiar</button>
        `;

        // Reorganiza los elementos en el DOM
        block.parentNode.parentNode.insertBefore(wrapper, block.parentNode);
        wrapper.appendChild(header);
        wrapper.appendChild(block.parentNode);
    });

    // Aplica el resaltado de sintaxis si highlight.js está disponible
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
