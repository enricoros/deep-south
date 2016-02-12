var G = {
    baseUrl: '',
    autoScroll: true,
    autoScrollAnimate: true,
    characters: ['butters', 'cartman', 'garrison', 'kenny', 'kyle', 'randy', 'stan'],
    rows: undefined,
    generator: undefined,

    changeGenerator: function (generator) {
        if (G.generator) {
            if (G.generator.lastTimeout) {
                clearTimeout(G.generator.lastTimeout);
                G.generator.lastTimeout = false;
            }
        }
        G.generator = generator;
        if (typeof G.generator != 'function') {
            console.log('Only generator functions accepted');
            return;
        }
        // prepare S
        S.lines = G.rows.slice(0);
        S.$listRoot.empty();
        // launch Generator
        G.generator();
    }
};

var S = {
    $listScroll: $('.app-content'),
    $listRoot: $('#deep-chat'),
    $lastLine: undefined,
    alignStart: true,
    lastTimeout: false,
    lines: undefined,
    interval: 2000,

    addLine: function (character, line, alignStart) {
        var theName = '@' + character;
        var theImg = G.baseUrl + '/images/' + character + '.png';
        if (alignStart) {
            S.$lastLine = $(
                '<div class="app-line mdl-grid">' +
                '  <div class="app-line-pic mdl-cell mdl-cell--2-col mdl-typography--text-center">' +
                '    <img class="app-image" src="' + theImg + '">' +
                '  </div>' +
                '  <div class="app-line-text mdl-cell mdl-cell--6-col mdl-cell--middle">' +
                '    <div class="app-character-name">' + theName + '</div>' +
                '    <div class="app-character-text">' + line + '</div>' +
                '  </div>' +
                '</div>'
            );
        } else {
            S.$lastLine = $(
                '<div class="app-line mdl-grid">' +
                '  <div class="app-line-pic mdl-cell mdl-cell--2-col mdl-typography--text-center">' +
                '    <img class="app-image" src="' + theImg + '">' +
                '  </div>' +
                '  <div class="app-line-text mdl-cell mdl-cell--6-col mdl-cell--middle">' +
                '    <div class="app-character-name">' + theName + '</div>' +
                '    <div class="app-character-text">' + line + '</div>' +
                '  </div>' +
                '</div>'
            );
        }
        S.$listRoot.append(S.$lastLine);

        // scroll down
        if (G.autoScroll) {
            var scrollTop = S.$listScroll[0].scrollHeight - S.$listScroll.height() /* - padding_top - padding_bottom*/;
            if (G.autoScrollAnimate)
                S.$listScroll.animate({scrollTop: scrollTop}, 300, 'easeOutCubic');
            else
                S.$listScroll.scrollTop(scrollTop);
        }
    }

};

/**
 * Simple Easy generator
 */
function generate_totalRandom() {
    var character = G.characters.randomElement();
    var line = S.lines.randomElement()['Line'];

    S.addLine(character, line, Math.random() > 0.3);

    G.generator.lastTimeout = setTimeout(G.generator, S.interval)
}

