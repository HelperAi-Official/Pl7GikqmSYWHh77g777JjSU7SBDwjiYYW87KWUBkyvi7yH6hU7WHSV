// markdown.js - Mini motor de Markdown propio

function renderMarkdown(text) {
    if (!text) return "";

    // 1. Escapar HTML básico para seguridad (evita inyecciones extrañas)
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 2. Bloques de código (```lenguaje ... ```)
    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        let language = lang ? lang.toUpperCase() : 'CODE';
        return `
        <div class="code-block-wrapper">
            <div class="code-header">
                <span>[${language}]</span>
                <button class="copy-btn" onclick="copyCode(this)">Copiar</button>
            </div>
            <pre><code>${code.trim()}</code></pre>
        </div>`;
    });

    // 3. Código en línea (`código`)
    html = html.replace(/`([^`]+)`/g, '<code style="background: #2d2d30; padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');

    // 4. Negritas (**texto**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 5. Cursivas (*texto*)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 6. Saltos de línea (convierte los \n en <br>)
    html = html.replace(/\n/g, '<br>');

    return html;
}

// Función auxiliar vacía para mantener compatibilidad si se llama
function setupCodeBlocks(container) {
    // Ya no necesita hacer nada porque el bloque de código se genera completo arriba,
    // pero dejamos la función para que no rompa nada si se invoca.
}

// Función para el botón Copiar
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
