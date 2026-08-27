const fuckinjs = {
    compile: function(str) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const bin = str.charCodeAt(i).toString(2);
            for (let j = 0; j < bin.length; j++) {
                result += bin[j] === '0' ? '\u200b' : '\u200c';
            }
            result += '\u3164';
        }
        return result;
    },
    decompile: function(str) {
        const parts = str.split('\u3164');
        let result = '';
        for (let i = 0; i < parts.length; i++) {
            const hiddenBin = parts[i];
            if (!hiddenBin) continue;
            let bin = '';
            for (let j = 0; j < hiddenBin.length; j++) {
                if (hiddenBin[j] === '\u200b') {
                    bin += '0';
                } else if (hiddenBin[j] === '\u200c') {
                    bin += '1';
                }
            }
            if (bin) {
                const parsed = parseInt(bin, 2);
                if (!isNaN(parsed)) {
                    result += String.fromCharCode(parsed);
                }
            }
        }
        return result;
    }
};

(async function() {
    async function runFuckinJs() {
        const scripts = document.querySelectorAll('script[type="text/fuckinjs"]');
        for (const scriptTag of scripts) {
            let hiddenCode = '';
            const src = scriptTag.getAttribute('src');

            if (src) {
                try {
                    const response = await fetch(src);
                    hiddenCode = await response.text();
                } catch (e) {
                    console.error(`failed to load ${src}`);
                    continue;
                }
            } else {
                hiddenCode = scriptTag.textContent;
            }

            const visibleJs = fuckinjs.decompile(hiddenCode);

            if (visibleJs && visibleJs.trim()) {
                try {
                    const newScript = document.createElement('script');
                    newScript.textContent = visibleJs;
                    document.body.appendChild(newScript);
                } catch (e) {
                    console.error('fuckinjs runtime error');
                }
            }
            
            if (scriptTag.parentNode) {
                scriptTag.parentNode.removeChild(scriptTag);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFuckinJs);
    } else {
        runFuckinJs();
    }
})();
