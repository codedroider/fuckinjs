const fuckinjs = {
    compile: function(str) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const bin = str.charCodeAt(i).toString(2).padStart(8, '0');
            for (let j = 0; j < bin.length; j++) {
                result += bin[j] === '0' ? '\u200b' : '\u200c';
            }
            result += '\u3164';
        }
        return result;
    },
    decompile: function(str) {
        let currentBin = '';
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '\u200b') {
                currentBin += '0';
            } else if (char === '\u200c') {
                currentBin += '1';
            } else if (char === '\u3164') {
                if (currentBin) {
                    result += String.fromCharCode(parseInt(currentBin, 2));
                    currentBin = '';
                }
            }
        }
        return result;
    }
};

(async function() {
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

        if (visibleJs) {
            try {
                eval(visibleJs);
            } catch (e) {
                console.error('fuckinjs runtime error');
            }
        }
        
        if (scriptTag.parentNode) {
            scriptTag.parentNode.removeChild(scriptTag);
        }
    }
})();
