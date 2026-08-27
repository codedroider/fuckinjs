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
                bin += hiddenBin[j] === '\u200b' ? '0' : '1';
            }
            result += String.fromCharCode(parseInt(bin, 2));
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
