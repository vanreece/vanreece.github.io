var wordlist = [];
var wordlistLoaded = false;
var gw = [];

var words_with_friends_tiles = {
  "A": {"number": 9, "points": 1},
  "B": {"number": 2, "points": 4},
  "C": {"number": 2, "points": 4},
  "D": {"number": 5, "points": 2},
  "E": {"number": 13, "points": 1},
  "F": {"number": 2, "points": 4},
  "G": {"number": 3, "points": 3},
  "H": {"number": 4, "points": 3},
  "I": {"number": 8, "points": 1},
  "J": {"number": 1, "points": 10},
  "K": {"number": 1, "points": 5},
  "L": {"number": 4, "points": 2},
  "M": {"number": 2, "points": 4},
  "N": {"number": 5, "points": 2},
  "O": {"number": 8, "points": 1},
  "P": {"number": 2, "points": 4},
  "Q": {"number": 1, "points": 10},
  "R": {"number": 6, "points": 1},
  "S": {"number": 5, "points": 1},
  "T": {"number": 7, "points": 1},
  "U": {"number": 4, "points": 2},
  "V": {"number": 2, "points": 5},
  "W": {"number": 2, "points": 4},
  "X": {"number": 1, "points": 8},
  "Y": {"number": 2, "points": 3},
  "Z": {"number": 1, "points": 10},
  ".": {"number": 2, "points": 0},
};

function wordInSet(word, charString, tilesInfo) {
  var charsRemaining = charString.slice();
  var score = 0;
  for (var i = 0; i < word.length; i++) {
    var ch = word[i];
    var index = charsRemaining.indexOf(ch);
    if (index == -1) {
      index = charsRemaining.indexOf('.');
      if (index == -1) {
        return false;
      } else {
        score += tilesInfo[ch.toUpperCase()]["points"]
      }
    } else {
      score += tilesInfo[ch.toUpperCase()]["points"]
    }
    charsRemaining = charsRemaining.slice(0, index) + charsRemaining.slice(index + 1);
  }
  return score;
}

function scorecompare(x,y) {
  if (x[1] > y[1]) {
    return 1;
  }
  if (x[1] < y[1]) {
    return -1;
  }
  return 0;
}

function lengthcompare(x,y) {
  if (x[0].length > y[0].length) {
    return 1;
  }
  if (x[0].length < y[0].length) {
    return -1;
  }
  return 0;
}

function inputChanged() {
  var charString = document.getElementById("characters").value.toLowerCase();
  var regex = new RegExp(document.getElementById("regex").value.toLowerCase());
  var sortByScore = document.getElementById("sortByScore").checked;

  findWords(wordlist, charString, sortByScore, function (goodWords) {
    var filteredWords = goodWords.filter(function (word) {
      return word[0].match(regex);
    });
    var results = "";
    for (var i = 0; i < filteredWords.length; i++) {
      wordInfo = filteredWords[i];
      word = wordInfo[0];
      score = wordInfo[1];
      results += word + " - " + score + "\n";
    }
    document.getElementById("results").textContent = results;
    gw = goodWords;
  })
}

function findWords(wordlist, charString, sortByScore, callback) {
  var goodWords = [];
  for (var i = 0; i < wordlist.length; i++) {
    var word = wordlist[i];
    wordScore = wordInSet(word, charString, words_with_friends_tiles)
    if (wordScore) {
      goodWords.push([word, wordScore]);
    }
  }
  if (sortByScore) {
    goodWords.sort(scorecompare);
  } else {
    goodWords.sort(lengthcompare);
  }
  goodWords.reverse();
  callback(goodWords);
}

var isNode=new Function("try {return this===global;}catch(e){return false;}");

if (isNode()) {
  module.exports.wordInSet = wordInSet;
  module.exports.findWords = findWords;
}
