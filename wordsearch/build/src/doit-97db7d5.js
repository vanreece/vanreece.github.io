var wordlist = [];
var wordlistLoaded = false;
function getWordlist(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', 'wordlists/wordle.txt', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type === null) {
                console.log('Failed to get content type for loading word list');
                return;
            }
            if (type.indexOf("text") !== 1) {
                var wordlist = request.responseText.split('\n').slice(0, -1);
                callback(wordlist);
            }
        }
    };
}
(function () {
    getWordlist(function (wl) {
        wordlist = wl;
        wordlistLoaded = true;
    });
})();
var words_with_friends_tiles = {
    "A": { "number": 9, "points": 1 },
    "B": { "number": 2, "points": 4 },
    "C": { "number": 2, "points": 4 },
    "D": { "number": 5, "points": 2 },
    "E": { "number": 13, "points": 1 },
    "F": { "number": 2, "points": 4 },
    "G": { "number": 3, "points": 3 },
    "H": { "number": 4, "points": 3 },
    "I": { "number": 8, "points": 1 },
    "J": { "number": 1, "points": 10 },
    "K": { "number": 1, "points": 5 },
    "L": { "number": 4, "points": 2 },
    "M": { "number": 2, "points": 4 },
    "N": { "number": 5, "points": 2 },
    "O": { "number": 8, "points": 1 },
    "P": { "number": 2, "points": 4 },
    "Q": { "number": 1, "points": 10 },
    "R": { "number": 6, "points": 1 },
    "S": { "number": 5, "points": 1 },
    "T": { "number": 7, "points": 1 },
    "U": { "number": 4, "points": 2 },
    "V": { "number": 2, "points": 5 },
    "W": { "number": 2, "points": 4 },
    "X": { "number": 1, "points": 8 },
    "Y": { "number": 2, "points": 3 },
    "Z": { "number": 1, "points": 10 },
    ".": { "number": 2, "points": 0 },
};
function wordInSet(word, charString, excluded, required) {
    var charsRemaining = charString.slice();
    var score = 0;
    for (var i = 0; i < word.length; i++) {
        var ch = word[i];
        if (excluded.indexOf(ch) !== -1) {
            return false;
        }
        var index = charsRemaining.indexOf(ch);
        if (index == -1) {
            index = charsRemaining.indexOf('.');
            if (index == -1) {
                return false;
            }
            else {
                score += words_with_friends_tiles[ch.toUpperCase()]["points"];
            }
        }
        else {
            score += words_with_friends_tiles[ch.toUpperCase()]["points"];
        }
        charsRemaining = charsRemaining.slice(0, index) + charsRemaining.slice(index + 1);
        for (var j = 0; j < required.length; j++) {
            var element = required[j];
            if (word.indexOf(element) === -1) {
                return false;
            }
        }
    }
    return score;
}
function inputChanged() {
    var charString = document.getElementById("characters").value.toLowerCase();
    var regex = new RegExp(document.getElementById("regex").value.toLowerCase());
    var excluded = document.getElementById("excluded").value.toLowerCase();
    var required = document.getElementById("required").value.toLowerCase();
    var sortByScore = document.getElementById("sortByScore").checked;
    findWords(wordlist, charString, excluded, required, sortByScore, function (goodWords) {
        var filteredWords = goodWords.filter(function (word) {
            return word.word.match(regex);
        });
        var results = "";
        for (var i = 0; i < filteredWords.length; i++) {
            results += filteredWords[i].word + " - " + filteredWords[i].score + "\n";
        }
        document.getElementById("results").textContent = results;
    });
}
function scorecompare(x, y) {
    if (x.score > y.score) {
        return 1;
    }
    if (x.score < y.score) {
        return -1;
    }
    return 0;
}
function lengthcompare(x, y) {
    if (x.word.length > y.word.length) {
        return 1;
    }
    if (x.word.length < y.word.length) {
        return -1;
    }
    return 0;
}
function findWords(wordlist, charString, excluded, required, sortByScore, callback) {
    var goodWords = [];
    for (var i = 0; i < wordlist.length; i++) {
        var word = wordlist[i];
        var wordScore = wordInSet(word, charString, excluded, required);
        if (wordScore) {
            goodWords.push({ word: word, score: wordScore });
        }
    }
    if (sortByScore) {
        goodWords.sort(scorecompare);
    }
    else {
        goodWords.sort(lengthcompare);
    }
    goodWords.reverse();
    callback(goodWords);
}
function store(slotType, slotNumber) {
    var string = document.getElementById(slotType).value.toLowerCase();
    window.localStorage.setItem(slotType + slotNumber, string);
}
function load(slotType, slotNumber) {
    var value = window.localStorage.getItem(slotType + slotNumber);
    if (value) {
        document.getElementById(slotType).value = value;
        inputChanged();
    }
}
// function createHTML() {
//     const text = document.createElement("text");
//     text.textContent = "Hello world!\nLet's get some words searchin'"
//     document.body.appendChild(text);
// }
// createHTML();
//# sourceMappingURL=doit.js.map