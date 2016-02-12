var G = {
    characters: ['butters', 'cartman', 'garrison', 'kenny', 'kyle', 'randy', 'stan'],
    interval: 1000
};
var S = {
    $root: $('#deep-chat'),
    alignStart: true,
    lines: undefined
};


function newLine() {
    var character = G.characters.randomElement();

    S.alignStart = !S.alignStart;

    // add the snippet
    var $characterLine = $(
        '<div>' +
        '  <img src="/images/' + character + '.png" height="100" alt="">' +
        '  <span>' + character + ': ' + S.lines.randomElement()['Line'] +   '</span>' +
        '</div>'
    );
    S.$root.append($characterLine);

    // scroll down
    var height = 0;
    S.$root.children().each(function(i, value){
        height += parseInt($(this).height());
    });
    console.log(height);
    S.$root.animate({ scrollTop: height + '' });

    // repeat
    setTimeout(newLine, G.interval)
}

d3.csv("/all-seasons.csv", function (csv) {
    S.lines = csv;
});

setTimeout(newLine, G.interval);

