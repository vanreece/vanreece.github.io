var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
function loadDefaults() {
    var charString = window.localStorage.getItem('charString');
    if (charString) {
        document.getElementById("characters").value = charString;
    }
    var regexString = window.localStorage.getItem('regexString');
    if (regexString) {
        document.getElementById("regex").value = regexString;
    }
    var excluded = window.localStorage.getItem('excluded');
    if (excluded) {
        document.getElementById("regex").value = excluded;
    }
    var required = window.localStorage.getItem('required');
    if (required) {
        document.getElementById("regex").value = required;
    }
    inputChanged();
}
(function () {
    getWordlist(function (wl) {
        wordlist = wl;
        wordlistLoaded = true;
        loadDefaults();
    });
})();
function wordInSet(word, tileSet, excluded, required) {
    var charsRemaining = tileSet.slice();
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
        }
        charsRemaining = charsRemaining.slice(0, index) + charsRemaining.slice(index + 1);
        for (var j = 0; j < required.length; j++) {
            var element = required[j];
            if (word.indexOf(element) === -1) {
                return false;
            }
        }
    }
    return true;
}
function inputChanged() {
    var charString = document.getElementById("characters").value.toLowerCase();
    var regexString = document.getElementById("regex").value.toLowerCase();
    var excluded = document.getElementById("excluded").value.toLowerCase();
    var required = document.getElementById("required").value.toLowerCase();
    window.localStorage.setItem('charString', charString);
    window.localStorage.setItem('regexString', regexString);
    window.localStorage.setItem('excluded', excluded);
    window.localStorage.setItem('required', required);
    var regex = new RegExp(regexString);
    var words = __spreadArray([], wordlist, true);
    // Filter words by regex
    words = words.filter(function (word) { return regex.test(word); });
    // Filter words by can be made with tiles
    words = words.filter(function (word) { return wordInSet(word, charString, excluded, required); });
    // Frequency analysis
    // TBD
    var wordHistogram = new Map();
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        for (var _a = 0, word_1 = word; _a < word_1.length; _a++) {
            var letter = word_1[_a];
            wordHistogram.set(letter, (wordHistogram.get(letter) || 0) + 1);
        }
    }
    // Display results (And sort them if necessary)
    var results = "";
    var sorter = [];
    wordHistogram.forEach(function (count, letter) {
        sorter.push({ letter: letter, count: count });
    });
    sorter.sort(function (a, b) { return b.count - a.count; });
    results += 'Letter histogram:\n';
    sorter.forEach(function (value) {
        results += "".concat(value.letter, ": ").concat(value.count, "\n");
    });
    for (var _b = 0, words_2 = words; _b < words_2.length; _b++) {
        var word = words_2[_b];
        results += word + "\n";
    }
    document.getElementById("results").textContent = results;
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