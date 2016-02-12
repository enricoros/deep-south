var G = {
    baseUrl: '',
    autoScroll: true,
    autoScrollAnimate: true,
    characters: ['butters', 'cartman', 'garrison', 'kenny', 'kyle', 'randy', 'stan'],
    typical: [ /* cartman */ 'guys', 'mom', 'jew', 'seriously', 'sweet', 'balls', 'bitch', 'poor', 'cool', 'aw man',
        'goddamnit', 'fuck', 'awesome', /* stan */ 'dude', 'dad', 'yeah', 'killed', 'best friend', 'dont know',
        'dont wanna', /* kyle */ 'ike', 'brother', 'fat', 'giant douche', 'hell', 'bastard', 'bastards', 'stupid', /* kenny */
        'woohoo', 'yeah', 'hey guys', 'huh', 'stick', 'freakin', 'nuh', 'vagina', 'okay', 'yep', 'nope',
        /* butters */ 'jeez', 'eric', 'oh boy', 'grounded', 'chaos', 'heck', 'sure', 'butt', /* randy */ 'porn' ],
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
        S.firstCharacter = undefined;
        S.lines = G.rows.slice(0);
        S.$listRoot.empty();
        // prepare UI
        $('#info-others').text('');
        $('#info-speaker').text('');
        // launch Generator
        G.generator();
    }
};

function addHighlight(src, highlight, className) {
    var regex = new RegExp("\\b" + highlight + "\\b", "gi");
    return src.replace(regex, function (matched) {
        return "<span class=\"" + className + "\">" + matched + "</span>";
    });
}

var S = {
    $listScroll: $('#list-scroll'),
    $listRoot: $('#deep-chat'),
    firstCharacter: undefined,
    lastTimeout: false,
    lines: undefined,

    addLine: function (character, line, alignStart) {
        var theName = '@' + character;
        // highlight characters' names
        G.characters.forEach(function (word) {
            line = addHighlight(line, word, 'hl-character-name');
        });
        // highlight typical words
        G.typical.forEach(function (word) {
            line = addHighlight(line, word, 'hl-typical');
        });
        if (alignStart) {
            S.$listRoot.append(
                '<div class="app-line mdl-grid">' +
                '  <div class="app-line-pic is-align-start mdl-cell mdl-cell--2-col">' +
                '    <div class="app-image character-' + character + '"></div>' +
                '  </div>' +
                '  <div class="app-line-text mdl-cell mdl-cell--6-col mdl-cell--middle">' +
                '    <div class="app-character-name">' + theName + '</div>' +
                '    <div class="app-character-text">' + line + '</div>' +
                '  </div>' +
                '</div>'
            );
        } else {
            S.$listRoot.append(
                '<div class="app-line mdl-grid">' +
                '  <div class="mdl-cell mdl-cell--4-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>' +
                '  <div class="app-line-text mdl-cell mdl-cell--6-col mdl-cell--middle mdl-typography--text-right">' +
                '    <div class="app-character-name">' + theName + '</div>' +
                '    <div class="app-character-text">' + line + '</div>' +
                '  </div>' +
                '  <div class="app-line-pic is-align-end mdl-cell mdl-cell--2-col">' +
                '    <div class="app-image character-' + character + '"></div>' +
                '  </div>' +
                '</div>'
            );
        }
        S.scrollDown();
    },

    addTyping: function(character, alignStart) {
        var theName = '@' + character;
        if (alignStart) {
            S.$listRoot.append(
                '<div class="app-line app-typing mdl-grid">' +
                '  <div class="app-line-text mdl-cell mdl-cell--12-col mdl-cell--middle">' +
                '    <div class="app-character-name">&nbsp; &nbsp; ' + theName + ' is typing ...</div>' +
                '  </div>' +
                '</div>'
            );
        } else {
            S.$listRoot.append(
                '<div class="app-line app-typing mdl-grid">' +
                '  <div class="app-line-text mdl-cell mdl-cell--12-col mdl-cell--middle mdl-typography--text-right">' +
                '    <div class="app-character-name">' + theName + ' is typing ... &nbsp; &nbsp;</div>' +
                '  </div>' +
                '</div>'
            );
        }
        S.scrollDown();
    },

    removeTyping: function() {
        S.$listRoot.find('.app-typing').remove();
    },

    scrollDown: function () {
        if (!G.autoScroll)
            return;
        var scrollTop = S.$listScroll[0].scrollHeight - S.$listScroll.height() /* - padding_top - padding_bottom*/;
        if (G.autoScrollAnimate)
            S.$listScroll.animate({scrollTop: scrollTop}, 300, 'easeOutCubic');
        else
            S.$listScroll.scrollTop(scrollTop);
    }
};

/**
 * Simple Easy generator
 */
function generate_totalRandom() {
    var character = G.characters.randomElement();
    var line = S.lines.randomElement()['Line'];

    S.addLine(character, line, Math.random() > 0.5);

    G.generator.lastTimeout = setTimeout(G.generator, 2000)
}

/**
 * Cooler generator
 */
function generate_stupid() {
    // choose one of the characters to be on the right side, like group chat APPs
    if (!S.firstCharacter) {
        S.firstCharacter = G.characters.randomElement();
        $('#info-others').text('Friends');
        $('#info-speaker').text(S.firstCharacter);
    }

    // character: use the first, or a random character
    var character = chance(35) ? S.firstCharacter : G.characters.randomElement();
    var alignEnd = character == S.firstCharacter;

    // lines: use an appropriate line, but sometimes just throw in a random one
    var lineText;
    var lineWordCount;
    do {
        var line = S.lines.randomElement();
        lineText = line['Line'];
        lineWordCount = countWords(lineText);
        var isShortEnough = lineWordCount < 40;
        var isSameCharacter = line['Character'].toLowerCase().indexOf(character) !== -1;
    } while (!isShortEnough || !isSameCharacter);

    // re-add some chaos back (lines by somebody else)
    if (chance(40)) {
        do {
            lineText = S.lines.randomElement()['Line'];
            lineWordCount = countWords(lineText);
        } while (lineWordCount > 35);
    }

    // delay for reading or race conditions (random)
    var delay = 1000 * (Math.random() + Math.random());
    var delayForReading = 200 + 1000 * 0.2 * (lineWordCount + 1);
    if (character == S.lastCharacter || chance(40))
        delay = delayForReading;
    S.lastCharacter = character;

    // timeout
    if (chance(40)) {
        // give time for reading
        S.addLine(character, lineText, !alignEnd);
        G.generator.lastTimeout = setTimeout(G.generator, delay);
    } else {
        // give time for writing
        S.addTyping(character, !alignEnd);
        G.generator.lastTimeout = setTimeout(function () {
            S.removeTyping();
            S.addLine(character, lineText, !alignEnd);
            G.generator();
        }, delay)
    }
}

function chance(valuePct) {
    return Math.random() <= (valuePct / 100);
}

function countWords(str) {
    return str.split(/\s+/).length;
}
