(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nlp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={
  "author": "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)",
  "name": "kompromiss",
  "description": "Computerlinguistik im browser",
  "version": "0.0.1",
  "main": "./builds/kompromiss.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/nlp-compromise/de-compromise.git"
  },
  "scripts": {
    "test": "node ./scripts/test.js",
    "build": "node ./scripts/build/index.js",
    "demo": "node ./scripts/demo.js",
    "watch": "node ./scripts/watch.js"
  },
  "files": [
    "builds/",
    "docs/"
  ],
  "dependencies": {},
  "devDependencies": {
    "babel-preset-es2015": "^6.24.0",
    "babelify": "7.3.0",
    "babili": "0.0.11",
    "browserify": "13.0.1",
    "browserify-glob": "^0.2.0",
    "bundle-collapser": "^1.2.1",
    "chalk": "^1.1.3",
    "codacy-coverage": "^2.0.0",
    "derequire": "^2.0.3",
    "efrt": "0.0.6",
    "eslint": "^3.1.1",
    "gaze": "^1.1.1",
    "http-server": "0.9.0",
    "nlp-corpus": "latest",
    "nyc": "^8.4.0",
    "shelljs": "^0.7.2",
    "tap-min": "^1.1.0",
    "tap-spec": "4.1.1",
    "tape": "4.6.0",
    "uglify-js": "2.7.0"
  },
  "license": "MIT"
}

},{}],2:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var tagset = _dereq_('./tagset');

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
var c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  black: '\x1b[30m'
};
//dont use colors on client-side
if (typeof module === 'undefined') {
  Object.keys(c).forEach(function (k) {
    c[k] = '';
  });
}

//coerce any input into a string
exports.ensureString = function (input) {
  if (typeof input === 'string') {
    return input;
  } else if (typeof input === 'number') {
    return '' + input;
  }
  return '';
};
//coerce any input into a string
exports.ensureObject = function (input) {
  if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object') {
    return {};
  }
  if (input === null || input instanceof Array) {
    return {};
  }
  return input;
};

exports.titleCase = function (str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

//shallow-clone an object
exports.copy = function (o) {
  var o2 = {};
  o = exports.ensureObject(o);
  Object.keys(o).forEach(function (k) {
    o2[k] = o[k];
  });
  return o2;
};
exports.extend = function (obj, a) {
  obj = exports.copy(obj);
  var keys = Object.keys(a);
  for (var i = 0; i < keys.length; i++) {
    obj[keys[i]] = a[keys[i]];
  }
  return obj;
};

//colorization
exports.green = function (str) {
  return c.green + str + c.reset;
};
exports.red = function (str) {
  return c.red + str + c.reset;
};
exports.blue = function (str) {
  return c.blue + str + c.reset;
};
exports.magenta = function (str) {
  return c.magenta + str + c.reset;
};
exports.cyan = function (str) {
  return c.cyan + str + c.reset;
};
exports.yellow = function (str) {
  return c.yellow + str + c.reset;
};
exports.black = function (str) {
  return c.black + str + c.reset;
};
exports.printTag = function (tag) {
  if (tagset[tag]) {
    var color = tagset[tag].color || 'black';
    return exports[color](tag);
  }
  return tag;
};
exports.printTerm = function (t) {
  var tags = Object.keys(t.tags);
  for (var i = 0; i < tags.length; i++) {
    if (tagset[tags[i]]) {
      var color = tagset[tags[i]].color || 'black';
      return exports[color](t.out('text'));
    }
  }
  return c.reset + t.plaintext + c.reset;
};

exports.leftPad = function (str, width, char) {
  char = char || ' ';
  str = str.toString();
  while (str.length < width) {
    str += char;
  }
  return str;
};

exports.isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

},{"./tagset":48}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';

var buildResult = _dereq_('./result/build');
var pkg = _dereq_('../package.json');
var log = _dereq_('./log');

//the main thing
var ldv = function ldv(str, lexicon) {
  // this.tagset = tagset;
  var r = buildResult(str, lexicon);
  r.tagger();
  return r;
};

//same as main method, except with no POS-tagging.
ldv.tokenize = function (str) {
  return buildResult(str);
};

//this is useful
ldv.version = pkg.version;

//turn-on some debugging
ldv.verbose = function (str) {
  log.enable(str);
};

//and then all-the-exports...
if (typeof self !== 'undefined') {
  self.ldv = ldv; // Web Worker
} else if (typeof window !== 'undefined') {
  window.ldv = ldv; // Browser
} else if (typeof global !== 'undefined') {
  global.ldv = ldv; // NodeJS
}
//don't forget amd!
if (typeof define === 'function' && define.amd) {
  define(ldv);
}
//then for some reason, do this too!
if (typeof module !== 'undefined') {
  module.exports = ldv;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../package.json":1,"./log":5,"./result/build":7}],4:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('../fns');

// const colors = {
//   'Person': '#6393b9',
//   'Pronoun': '#81acce',
//   'Noun': 'steelblue',
//   'Verb': 'palevioletred',
//   'Adverb': '#f39c73',
//   'Adjective': '#b3d3c6',
//   'Determiner': '#d3c0b3',
//   'Preposition': '#9794a8',
//   'Conjunction': '#c8c9cf',
//   'Value': 'palegoldenrod',
//   'Expression': '#b3d3c6'
// };

var tag = function tag(t, pos, reason) {
  var title = t.normal || '[' + t.silent_term + ']';
  title = fns.leftPad('\'' + title + '\'', 12);
  title += '  ->   ' + pos;
  title += fns.leftPad(reason || '', 15);
  console.log('%c' + title, ' color: #a2c99c');
};
var untag = function untag(t, pos, reason) {
  var title = t.normal || '[' + t.silent_term + ']';
  title = fns.leftPad('\'' + title + '\'', 12);
  title += '  ~*   ' + pos;
  title += '    ' + (reason || '');
  console.log('%c' + title, ' color: #b66a6a');
};
module.exports = {
  tag: tag,
  untag: untag
};

},{"../fns":2}],5:[function(_dereq_,module,exports){
'use strict';

var client = _dereq_('./client');
var server = _dereq_('./server');

var _enable = false;

module.exports = {
  enable: function enable(str) {
    if (str === undefined) {
      str = true;
    }
    _enable = str;
  },
  tag: function tag(t, pos, reason) {
    if (_enable === true || _enable === 'tagger') {
      if (typeof window !== 'undefined') {
        client.tag(t, pos, reason);
      } else {
        server.tag(t, pos, reason);
      }
    }
  },
  unTag: function unTag(t, pos, reason) {
    if (_enable === true || _enable === 'tagger') {
      if (typeof window !== 'undefined') {
        client.untag(t, pos, reason);
      } else {
        server.untag(t, pos, reason);
      }
    }
  }
};

},{"./client":4,"./server":6}],6:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('../fns');

//use weird bash escape things for some colors
var tag = function tag(t, pos, reason) {
  var title = t.normal || '[' + t.silent_term + ']';
  title = fns.yellow(title);
  title = fns.leftPad('\'' + title + '\'', 20);
  title += '  ->   ' + fns.printTag(pos);
  title = fns.leftPad(title, 54);
  console.log('       ' + title + '(' + fns.cyan(reason || '') + ')');
};

var untag = function untag(t, pos, reason) {
  var title = '-' + t.normal + '-';
  title = fns.red(title);
  title = fns.leftPad(title, 20);
  title += '  ~*   ' + fns.red(pos);
  title = fns.leftPad(title, 54);
  console.log('       ' + title + '(' + fns.red(reason || '') + ')');
};

module.exports = {
  tag: tag,
  untag: untag
};

},{"../fns":2}],7:[function(_dereq_,module,exports){
'use strict';

var Text = _dereq_('./index');
var tokenize = _dereq_('./lib/tokenize');
var p = _dereq_('./paths');
var Terms = p.Terms;
var fns = p.fns;
var normalize = _dereq_('../term/methods/normalize').normalize;

//basically really dirty and stupid.
var normalizeLex = function normalizeLex(lex) {
  lex = lex || {};
  return Object.keys(lex).reduce(function (h, k) {
    //add natural form
    h[k] = lex[k];
    var normal = normalize(k);
    //remove periods
    //normalize whitesace
    normal = normal.replace(/\s+/, ' ');
    //remove sentence-punctuaion too
    normal = normal.replace(/[.\?\!]/g, '');
    if (k !== normal) {
      //add it too
      h[normal] = lex[k];
    }
    return h;
  }, {});
};

var fromString = function fromString(str, lexicon) {
  var sentences = [];
  //allow pre-tokenized input
  if (fns.isArray(str)) {
    sentences = str;
  } else {
    str = fns.ensureString(str);
    sentences = tokenize(str);
  }
  //make sure lexicon obeys standards
  lexicon = normalizeLex(lexicon);
  var list = sentences.map(function (s) {
    return Terms.fromString(s, lexicon);
  });

  var r = new Text(list, lexicon);
  //give each ts a ref to the result
  r.list.forEach(function (ts) {
    ts.refText = r;
  });
  return r;
};
module.exports = fromString;

},{"../term/methods/normalize":52,"./index":9,"./lib/tokenize":11,"./paths":18}],8:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  /** did it find anything? */
  found: function found() {
    return this.list.length > 0;
  },
  /** just a handy wrap*/
  parent: function parent() {
    return this.reference || this;
  },
  /** how many Texts are there?*/
  length: function length() {
    return this.list.length;
  },
  /** nicer than constructor.call.name or whatever*/
  isA: function isA() {
    return 'Text';
  },
  /** the whitespace before and after this match*/
  whitespace: function whitespace() {
    var _this = this;

    return {
      before: function before(str) {
        _this.list.forEach(function (ts) {
          ts.whitespace.before(str);
        });
        return _this;
      },
      after: function after(str) {
        _this.list.forEach(function (ts) {
          ts.whitespace.after(str);
        });
        return _this;
      }
    };
  }

};

},{}],9:[function(_dereq_,module,exports){
'use strict';
//a Text is an array of termLists

var getters = _dereq_('./getters');

function Text(arr, lexicon, reference) {
  this.list = arr || [];
  this.lexicon = lexicon;
  this.reference = reference;
  //apply getters
  var keys = Object.keys(getters);
  for (var i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], {
      get: getters[keys[i]]
    });
  }
}
_dereq_('./methods/loops')(Text);
_dereq_('./methods/out')(Text);
_dereq_('./methods/misc')(Text);

module.exports = Text;

},{"./getters":8,"./methods/loops":12,"./methods/misc":13,"./methods/out":14}],10:[function(_dereq_,module,exports){
//these are common word shortenings used in the lexicon and sentence segmentation methods
//there are all nouns,or at the least, belong beside one.
'use strict';

//common abbreviations

var compact = {
  Noun: ['arc', 'al', 'exp', 'fy', 'pd', 'pl', 'plz', 'tce', 'bl', 'ma', 'ba', 'lit', 'ex', 'eg', 'ie', 'ca', 'cca', 'vs', 'etc', 'esp', 'ft',
  //these are too ambiguous
  'bc', 'ad', 'md', 'corp', 'col'],
  Organization: ['dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co',
  //proper nouns with exclamation marks
  'yahoo', 'joomla', 'jeopardy'],

  Place: ['Str', 'rd', 'st', 'dist', 'mt', 'ave', 'blvd', 'cl', 'ct', 'cres', 'hwy',
  //states
  'ariz', 'cal', 'calif', 'colo', 'conn', 'fla', 'fl', 'ga', 'ida', 'ia', 'kan', 'kans', 'minn', 'neb', 'nebr', 'okla', 'penna', 'penn', 'pa', 'dak', 'tenn', 'tex', 'ut', 'vt', 'va', 'wis', 'wisc', 'wy', 'wyo', 'usafa', 'alta', 'ont', 'que', 'sask'],

  Date: ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec', 'circa'],

  //Honorifics
  Honorific: ['adj', 'adm', 'adv', 'asst', 'atty', 'bldg', 'brig', 'capt', 'cmdr', 'comdr', 'cpl', 'det', 'dr', 'esq', 'gen', 'gov', 'hon', 'jr', 'llb', 'lt', 'maj', 'messrs', 'mister', 'mlle', 'mme', 'mr', 'mrs', 'ms', 'mstr', 'op', 'ord', 'phd', 'prof', 'pvt', 'rep', 'reps', 'res', 'rev', 'sen', 'sens', 'sfc', 'sgt', 'sir', 'sr', 'supt', 'surg'
  //miss
  //misses
  ]

};

//unpack the compact terms into the misc lexicon..
var abbreviations = {};
var keys = Object.keys(compact);
for (var i = 0; i < keys.length; i++) {
  var arr = compact[keys[i]];
  for (var i2 = 0; i2 < arr.length; i2++) {
    abbreviations[arr[i2]] = keys[i];
  }
}
module.exports = abbreviations;

},{}],11:[function(_dereq_,module,exports){
//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2017 MIT
'use strict';

var abbreviations = Object.keys(_dereq_('./abbreviations'));
//regs-
var abbrev_reg = new RegExp('\\b(' + abbreviations.join('|') + ')[.!?] ?$', 'i');
var acronym_reg = new RegExp('[ |\.][A-Z]\.?( *)?$', 'i');
var elipses_reg = new RegExp('\\.\\.+( +)?$');

//start with a regex:
var naiive_split = function naiive_split(text) {
  var all = [];
  //first, split by newline
  var lines = text.split(/(\n+)/);
  for (var i = 0; i < lines.length; i++) {
    //split by period, question-mark, and exclamation-mark
    var arr = lines[i].split(/(\S.+?[.!?])(?=\s+|$)/g);
    for (var o = 0; o < arr.length; o++) {
      all.push(arr[o]);
    }
  }
  return all;
};

var sentence_parser = function sentence_parser(text) {
  text = text || '';
  text = '' + text;
  var sentences = [];
  //first do a greedy-split..
  var chunks = [];
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || /\S/.test(text) === false) {
    return sentences;
  }
  //start somewhere:
  var splits = naiive_split(text);
  //filter-out the grap ones
  for (var i = 0; i < splits.length; i++) {
    var s = splits[i];
    if (s === undefined || s === '') {
      continue;
    }
    //this is meaningful whitespace
    if (/\S/.test(s) === false) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue;
      } else if (splits[i + 1]) {
        //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue;
      }
    }
    //else, only whitespace, no terms, no sentence
    chunks.push(s);
  }

  //detection of non-sentence chunks:
  //loop through these chunks, and join the non-sentence chunks back together..
  for (var _i = 0; _i < chunks.length; _i++) {
    var c = chunks[_i];
    //should this chunk be combined with the next one?
    if (chunks[_i + 1] !== undefined && (abbrev_reg.test(c) || acronym_reg.test(c) || elipses_reg.test(c))) {
      chunks[_i + 1] = c + (chunks[_i + 1] || '');
    } else if (c && c.length > 0) {
      //this chunk is a proper sentence..
      sentences.push(c);
      chunks[_i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text];
  }
  return sentences;
};

module.exports = sentence_parser;
// console.log(sentence_parser('john f. kennedy'));

},{"./abbreviations":10}],12:[function(_dereq_,module,exports){
'use strict';
//this methods are simply loops around each termList object.

var methods = ['toTitleCase', 'toUpperCase', 'toLowerCase',
// 'toCamelCase',
//
// 'hyphenate',
// 'dehyphenate',
// 'trim',
//
// 'insertBefore',
// 'insertAfter',
// 'insertAt',
//
// 'replace',
// 'replaceWith',
//
// 'delete',
// 'lump',

'tagger'];

var addMethods = function addMethods(Text) {
  methods.forEach(function (k) {
    Text.prototype[k] = function () {
      for (var i = 0; i < this.list.length; i++) {
        this.list[i][k].apply(this.list[i], arguments);
      }
      return this;
    };
  });

  //add an extra optimisation for tag method
  Text.prototype.tag = function () {
    //fail-fast optimisation
    if (this.list.length === 0) {
      return this;
    }
    for (var i = 0; i < this.list.length; i++) {
      this.list[i].tag.apply(this.list[i], arguments);
    }
    return this;
  };
};

module.exports = addMethods;

},{}],13:[function(_dereq_,module,exports){
'use strict';

var Terms = _dereq_('../paths').Terms;

var miscMethods = function miscMethods(Text) {

  var methods = {

    terms: function terms() {
      var _this = this;

      var list = [];
      //make a Terms Object for every Term
      this.list.forEach(function (ts) {
        ts.terms.forEach(function (t) {
          list.push(new Terms([t], ts.lexicon, _this));
        });
      });
      var r = new Text(list, this.lexicon, this.parent);
      return r;
    }

  };

  //hook them into result.proto
  Object.keys(methods).forEach(function (k) {
    Text.prototype[k] = methods[k];
  });
  return Text;
};

module.exports = miscMethods;

},{"../paths":18}],14:[function(_dereq_,module,exports){
'use strict';

var _topk = _dereq_('./topk');
var offset = _dereq_('./offset');
var termIndex = _dereq_('./indexes');

var methods = {
  text: function text(r) {
    return r.list.reduce(function (str, ts) {
      str += ts.out('text');
      return str;
    }, '');
  },
  normal: function normal(r) {
    return r.list.map(function (ts) {
      var str = ts.out('normal');
      var last = ts.last();
      if (last) {
        var punct = last.endPunctuation();
        if (punct === '.' || punct === '!' || punct === '?') {
          str += punct;
        }
      }
      return str;
    }).join(' ');
  },
  root: function root(r) {
    return r.list.map(function (ts) {
      return ts.out('root');
    }).join(' ');
  },
  /** output where in the original output string they are*/
  offsets: function offsets(r) {
    return offset(r);
  },
  /** output the tokenized location of this match*/
  index: function index(r) {
    return termIndex(r);
  },
  grid: function grid(r) {
    return r.list.reduce(function (str, ts) {
      str += ts.out('grid');
      return str;
    }, '');
  },
  color: function color(r) {
    return r.list.reduce(function (str, ts) {
      str += ts.out('color');
      return str;
    }, '');
  },
  array: function array(r) {
    return r.list.map(function (ts) {
      return ts.out('normal');
    });
  },
  csv: function csv(r) {
    return r.list.map(function (ts) {
      return ts.out('csv');
    }).join('\n');
  },
  newlines: function newlines(r) {
    return r.list.map(function (ts) {
      return ts.out('newlines');
    }).join('\n');
  },
  json: function json(r) {
    return r.list.reduce(function (arr, ts) {
      var terms = ts.terms.map(function (t) {
        return {
          text: t.text,
          normal: t.normal,
          tags: t.tag
        };
      });
      arr.push(terms);
      return arr;
    }, []);
  },
  html: function html(r) {
    var html = r.list.reduce(function (str, ts) {
      var sentence = ts.terms.reduce(function (sen, t) {
        sen += '\n    ' + t.out('html');
        return sen;
      }, '');
      return str += '\n  <span>' + sentence + '\n  </span>';
    }, '');
    return '<span> ' + html + '\n</span>';
  },
  terms: function terms(r) {
    var arr = [];
    r.list.forEach(function (ts) {
      ts.terms.forEach(function (t) {
        arr.push({
          text: t.text,
          normal: t.normal,
          tags: Object.keys(t.tags)
        });
      });
    });
    return arr;
  },
  debug: function debug(r) {
    console.log('====');
    r.list.forEach(function (ts) {
      console.log('   --');
      ts.debug();
    });
    return r;
  },
  topk: function topk(r) {
    return _topk(r);
  }
};
methods.plaintext = methods.text;
methods.normalized = methods.normal;
methods.colors = methods.color;
methods.tags = methods.terms;
methods.offset = methods.offsets;
methods.idexes = methods.index;
methods.frequency = methods.topk;
methods.freq = methods.topk;
methods.arr = methods.array;

var addMethods = function addMethods(Text) {
  Text.prototype.out = function (fn) {
    if (methods[fn]) {
      return methods[fn](this);
    }
    return methods.text(this);
  };
  Text.prototype.debug = function () {
    return methods.debug(this);
  };
  return Text;
};

module.exports = addMethods;

},{"./indexes":15,"./offset":16,"./topk":17}],15:[function(_dereq_,module,exports){
'use strict';
//find where in the original text this match is found, by term-counts

var termIndex = function termIndex(r) {
  var result = [];
  //find the ones we want
  var want = {};
  r.terms().list.forEach(function (ts) {
    want[ts.terms[0].uid] = true;
  });

  //find their counts
  var sum = 0;
  var parent = r.all();
  parent.list.forEach(function (ts, s) {
    ts.terms.forEach(function (t, i) {
      if (want[t.uid] !== undefined) {
        result.push({
          text: t.text,
          normal: t.normal,
          term: sum,
          sentence: s,
          sentenceTerm: i
        });
      }
      sum += 1;
    });
  });

  return result;
};
module.exports = termIndex;

},{}],16:[function(_dereq_,module,exports){
'use strict';
/** say where in the original output string they are found*/

var findOffset = function findOffset(parent, term) {
  var sum = 0;
  for (var i = 0; i < parent.list.length; i++) {
    for (var o = 0; o < parent.list[i].terms.length; o++) {
      var t = parent.list[i].terms[o];
      if (t.uid === term.uid) {
        return sum;
      } else {
        sum += t.whitespace.before.length + t._text.length + t.whitespace.after.length;
      }
    }
  }
  return null;
};

//like 'text' for the middle, and 'normal' for the start+ends
//used for highlighting the actual words, without whitespace+punctuation
var trimEnds = function trimEnds(ts) {
  var terms = ts.terms;
  if (terms.length <= 2) {
    return ts.out('normal');
  }
  //the start
  var str = terms[0].normal;
  //the middle
  for (var i = 1; i < terms.length - 1; i++) {
    var t = terms[i];
    str += t.whitespace.before + t.text + t.whitespace.after;
  }
  //the end
  str += ' ' + terms[ts.terms.length - 1].normal;
  return str;
};

//map over all-dem-results
var allOffset = function allOffset(r) {
  var parent = r.all();
  return r.list.map(function (ts) {
    var words = [];
    for (var i = 0; i < ts.terms.length; i++) {
      words.push(ts.terms[i].normal);
    }
    var nrml = trimEnds(ts);
    var txt = ts.out('text');
    var startAt = findOffset(parent, ts.terms[0]);
    var beforeWord = ts.terms[0].whitespace.before;
    var wordStart = startAt + beforeWord.length;
    return {
      text: txt,
      normal: ts.out('normal'),
      //where we begin
      offset: startAt,
      length: txt.length,
      wordStart: wordStart,
      wordEnd: wordStart + nrml.length
    };
  });
};
module.exports = allOffset;

},{}],17:[function(_dereq_,module,exports){
'use strict';
//

var topk = function topk(r, n) {
  //count occurance
  var count = {};
  r.list.forEach(function (ts) {
    var str = ts.out('root');
    count[str] = count[str] || 0;
    count[str] += 1;
  });
  //turn into an array
  var all = [];
  Object.keys(count).forEach(function (k) {
    all.push({
      normal: k,
      count: count[k]
    });
  });
  //add percentage
  all.forEach(function (o) {
    o.percent = parseFloat((o.count / r.list.length * 100).toFixed(2));
  });
  //sort by freq
  all = all.sort(function (a, b) {
    if (a.count > b.count) {
      return -1;
    }
    return 1;
  });
  if (n) {
    all = all.splice(0, n);
  }
  return all;
};

module.exports = topk;

},{}],18:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  fns: _dereq_('../fns'),
  Terms: _dereq_('../terms'),
  tags: _dereq_('../tagset')
};

},{"../fns":2,"../tagset":48,"../terms":67}],19:[function(_dereq_,module,exports){
'use strict';

//thanks germany!

var capitalStep = function capitalStep(ts) {
  var reason = 'titlecase-noun';
  ts.terms.forEach(function (t, i) {
    if (i === 0) {
      return;
    }
    //is titleCase?
    if (/^[A-Z][a-z-]+$/.test(t.text) === true) {
      t.tag('Substantiv', reason);
    }
  });
  return ts;
};
module.exports = capitalStep;

},{}],20:[function(_dereq_,module,exports){
'use strict';

var suffixTest = _dereq_('./lib/suffixTest');

var patterns = {
  femaleNouns: [_dereq_('./patterns/femaleNouns'), 'FemininSubst'],
  maleNouns: [_dereq_('./patterns/maleNouns'), 'MannlichSubst'],
  neuterNouns: [_dereq_('./patterns/neuterNouns'), 'SachlichSubst']
};

//
var genderStep = function genderStep(ts) {
  var reason = 'suffix-match';
  var keys = Object.keys(patterns);
  ts.terms.forEach(function (t) {
    //only try nouns
    if (t.tags.Substantiv !== true) {
      return;
    }
    for (var i = 0; i < keys.length; i++) {
      if (suffixTest(t, patterns[keys[i]][0]) === true) {
        t.tag(patterns[keys[i]][1], reason);
        return;
      }
    }
  });
  return ts;
};
module.exports = genderStep;

},{"./lib/suffixTest":39,"./patterns/femaleNouns":42,"./patterns/maleNouns":43,"./patterns/neuterNouns":44}],21:[function(_dereq_,module,exports){
'use strict';

var capitalStep = _dereq_('./capital-step');
var lexStep = _dereq_('./lexicon-step');
var suffixStep = _dereq_('./suffix-step');
var nounFallback = _dereq_('./noun-fallback');
var genderStep = _dereq_('./gender-step');
//
var tagger = function tagger(ts) {
  // look against known-words
  ts = lexStep(ts);
  // look at titlecase terms
  ts = capitalStep(ts);
  // look at known-suffixes
  ts = suffixStep(ts);
  // assume nouns, otherwise
  ts = nounFallback(ts);
  // guess gender for nouns, adjectives
  ts = genderStep(ts);
  return ts;
};
module.exports = tagger;

},{"./capital-step":19,"./gender-step":20,"./lexicon-step":22,"./noun-fallback":40,"./suffix-step":47}],22:[function(_dereq_,module,exports){
'use strict';

var lex = _dereq_('./lexicon');

var lexStep = function lexStep(ts) {
  var reason = 'lexicon-match';
  //each lexicon:
  Object.keys(lex).forEach(function (k) {
    //each term
    for (var i = 0; i < ts.terms.length; i++) {
      var t = ts.terms[i];
      if (lex[k].obj[t.normal] !== undefined) {
        t.tag(lex[k].tag, reason);
      }
    }
  });
  return ts;
};
module.exports = lexStep;

},{"./lexicon":38}],23:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:ER;1:EN;2:EH;3:D5;4:AX;5:C7;6:EJ;7:E9;8:D3;9:DU;A:DQ;B:DO;C:C4;D:CF;E:EO;aD0bB4chinB3dAAe8Uf8Dg6Ph6Ci5Xj5Qk54l4Rm4An3Yo3Pp35q6Hr2Rs1Wt1Ou0Ov01wPzF;aMeLuIwF;anzBLeiF;felBAtF;eAgE8hoec2Wstaerks0wi4M;egel9HfriedEEgespitBTkunftsGlassungsbeschraenk0nehmDJrueckgekeBNsF;aetz48ta3V;geri19o62;hn0itgemaess2nM;gB4hlF;lo5reiDT;aPeIiFoch1PuenschC1;chtigGederho9Nld,rFssens-weDB;k7tschaft41;!e60s7E;iIltHrt,sGttbewerbsneuF;tr4;e7Kt73;beruehmt2gDUweit7D;s5tF;!eFgehD4verbr9L;!rAW;chs1Jhrschein7sserd16;eKiertJoF;ell6rF;auss34geFigDUteilAOzugs1V;lD6sF;ehNt5U;!e,gDK;heme9rF;aRbQdPeiMfLgJhaeB1kIleEmHoeffentli8ruecDZsFtraut,wirCTzweif9R;chFeu8iegCYpaet7FtaerDY;achtCXiedeneAulCG;arkCCehCQ;la1oC7rusCBuerz0;angFeb7olCD;enDJ;em0olg0rueBA;nFs0;bB6fa8igFz9I;te,ungAQ;aDVr87;e76l6Yre6G;eGntwortF;e0liDGungsbewuD5;nd1rgeBH;eb0Am07nGrF;al0sprueng7;angebracAZbeWeRgeOhinterfraC2interesCOkMmittel9Kp0AsLterJvFzeit84;erGoF;ll6QrbereitD;aeZfaelscAWletAJmiZsF;orBYtel8J;g06sF;chied22t53;er39ozi4;lFontro98;ar,ug;aDHeignDfaehrdDh8BklaeC1loe7XnutACrechtferAHsGte5QwF;i7UoDG;chminB9t89;ingeschraenB8rF;h87kan9lHwF;aFu7D;eh9rt6I;aubt,edC4;aMeindrucB3fristDgrLhJirBTkanCrIsGwFzaBB;affnDus7O;chFetA2tiD4;adDw1;ecA8uehAS;elliBFiF;ndeBN;en9XueAR;chtD;fangreic0XgeGkaemAGstritten5SweltFzaeun0;gBCo45;kehBIrechnD;erFr8W;a7Gfül7SgGhoe82pFrasAWschuldDteueBGwiegBHzeugAP;roport8B;eoBL;aLeKiefJoHrFuerkB;aditionFis0uebs0;eC6s74;erFt;ic9X;!e4Iro0s0;chn3ur91;buiC8et6ge3Ftsaech7ube;a08chZeXiVoSpQtGueF;ffiBHss2;aMeKillg68rHuF;fIndF;en3A;eFiC6uktu3L;ckFng;enV;i7OllvertretF;ende;atliBBeFndfe6Rrk53tio83;nd6rk2A;aFezialiBVitz,o1J;et41n3;genann4WzialF;!dem80eFversicherungs75;n,r;chFnn6NtuationsbedinAF;e0Xt7W;cZlbstFns5NpaBJ;bewus8OgenuE;aMief,lLmKnellJoIrittHuld6wF;erFier3K;en,s0wieg9R;wei5;ens0n6E;!er;a83erz7S;au,echt95ic6Z;erfs0rf2;ch58n9At0;aQeIiHoGuF;ecksichts68nderneu1ssB;bus0te;cht6skaC;al,cht1DgKiIlHnGpublikan3siF;gnA4ste9;om2St2H;aVevAMig18;b60cFn;hs0;elrec6MiFu5E;er0on4;dikal8Retselh19ffi76sFt6U;aCch;aUerSlRoMrFublik;aIeisHivat2oF;fit27mF;inente8Mpt;bereini9Jwe8V;eGktiF;sARzi1;se9zi5;lHsF;iFthum;tiv;itischFn3;!e64;aus4Ko2Q;fe8SmaneCsoenF;lichA5;laestinens3rGtriarFusF;ch4;allA7teiF;inPlo5;bLeJffGpt0CrF;dnu53ganiADi6A;enFiziell9Y;en,sF;icht7;ffentYkoFsterreich3;logBnomB;eFsolD;rs0;aOeKiIoGuechF;tern;et6min4rm4twF;endig9O;edFgeri9D;erlaend3r6D;nn7Mt0uF;!eFgegru3Dn0;!n,r,sF;!te;c9Zechs2Yh9Hmh04s5tF;ionale,ur4L;aQeNiLoFysterW;derIegHmeGnF;a0Xti1;ntM;lich2V;at2nF;!en,s0;litaFnK;erBn0;diFhrfa9Jil1N;al,en3EterrF;an;eIngel5TrkHssGxF;im4;enhOiv91;an0i1;cht6B;aMeIiGondon64uxurF;ioe5;ber4nkF;e,sgeri7S;bGg4iFtz0;c4Rse;ens0DhF;af0;engInGteCuF;f31nen5R;d5KgF;!em,frist6sam;er,s0;aYiXlVnappe,oIrGuF;enftig24r19;aeft6iFo56;sengeschuett80t3;loss4mNnHrrGstenF;guenst5Slo5;e8Xu90;grue9kr2DsItroHzeF;nt0ArF;n0Ut87;l31vers;equeColi2EtF;a9ern7K;fortXmHpF;eteClFromis1E;et0iz4O;e3Munist3;are,einFug;!e06kar7Es0;lometer0Knd37;lt2tF;astroph4hol3;aHuF;eFng2;d3ngs1E;ehr7hrFp7M;eGzehnF;teF;lang;lleg4mp2DnIrreGsFtalien3;lamBol49raelB;leva9parF;ab7U;dire86fNhaf4WnovationsoMsze48tF;a85eFrovert6Y;gJlligeCrF;essHnF;!ationalF;!eM;aCie5X;ri1;ri3R;i3SorF;mi1;aOeLiKoF;chHeGheF;!n,r;ch4Pher0U;entw2OqF;ualifi3L;es3Ylf2Istor3;ft6i2CrFss3;be,gestF;ell0;eufGlbeAndf7ErF;m2Dt2;ig56;aran48eTlRnadQrFut2;aNenzPoJuF;ndsaHppF;enF;we1K;etz7;be,essHssF;!eF;!r;er2teA;ndFu;io5;en1Z;aFeichzeit6obal07;t0ub3O;ae0Lb0Jeign0Kf0Fg0Dk0Cl08m03n00pZrXsOtKu62wGzF;a5Ee66i2U;aGiFo7Buens8;l26s5;ehFltberei0;l0r0;aHeGrF;e61o1M;il0;rn0uf0;amSchLellschaftKiJpHtFu8;ar58eF;ll0u1;anCraechF;sbere0V;ch1nn0;li5E;aeEeFi6Xmugg5Mwae8;it1;ec20iF;ch4Zng46;anz1fl5LlanHra5L;aFehm5LuE;nnFu;teA;aHeinFis8;!samFte;!eA;ch0essF;!i3L;au9be,eFob0;geGiFnk0;s4Nte0;nt7;auf0lei4Onue3V;enwaert6laub0ruF;en4M;aHeiGord1ueF;hr0ll0;er0t;els8ss0;au0eut4YildFra8;et2;nd1uF;ss1;aUckw-13eRiQlexPoMrIuF;eGnF;di1;hre0Qnf0;anzo20eieAistHuF;cht0IeheF;n,reA;gerec35;lgGrF;ci1m4tgeseE;end5A;ib56;nanzie57t,xi1;hl1Oin,rn,stFt0u8;e,gF;el4I;ls59rb07t4vori5A;c0Tffizient2Zh0Si0Iklat4Qle42m0Gn08rMtabLuHvangel3xF;a3GpFterritori4zel4Q;lizH;-1PropaF;eischGweF;it;eAs0;li1;aZbUfPhNkenn18leicht1nLsIwFzeug0;artGuF;ensc0J;e0uO;atzUe5BtF;au9eF;!ll0s;e4ZstF;e,ha2Q;eblich2oF;eh0;ahruGoF;lgreich2Grder7;ngsF;gemaeF;ss;aGit2LoF;st;rmFu0;ungsF;lo5;rbW;dLgKtF;fIsGtaeus8wF;ick3H;cheid3Bet1LprecheF;ndeA;erCue1D;!ag0D;guelt6lo5;anzipi1ot01pF;oe34;geneNnGskaFt3W;lt;deut6geHig,stig,wandGzF;eln,ig0U;freie;b2HfueHlGrFseE;eis0i2I;ei2I;g0hr0;!n,r,s;emal0Sren1J;ht2;a03eUiRoOrJuF;enn,mpHnk3JrchF;geFschnitt7;fue0TseE;fe;astis3NeiHiF;ng2MttF;e,g39;dimensFst2ze3Z;ion4;kumGmiPppFti1;elt2;en0B;cGenstaelt3DfferenFre3Kskre0ver5;zi1;ht,ke;fek0mLnkKsItaiGut7zentF;!r4;llF;ie1B;igForient26;ni1;bar;okrF;atB;en1EmalHuF;erF;ha0Z;ig2V;esB;a18eYiVlUoQrJuF;ergernah,nF;dFt2;esF;weit2;aungebra23eitKiJuF;chstueGesk1Qt4;al;ckF;haft;lla9sa9tB;!e,geschi17;dengestueEeGnnFsnB;er;rsennoFse;ti1;os5utueberstroU;llGsherF;igeA;igs0;absicht1Nd0Kfr0Hg0Dherrs8ispiel0Aka07l04m00nXrRsMtJvorzu14wFziff1;aGirtschaf0YusF;st2;eFff1I;hr0;ag0riebF;sbediF;ng0;chHeEor0Wser2tF;e,i2HuerF;zt;aFlagnahm0;emt;eIueF;chFhmtR;tiF;gt2;cFit;hti0M;achFuE;bFteil13;ar0;erkGueF;ht;ensF;weR;eidi0EiebtF;!eF;!s0;emGnC;nt2;pf0;haGlo5;se;ft2;eFrenz0;hr0isF;teF;rt2;euFisW;ndD;et;eFinYroh0;cGutF;ends0;kt;rocke,yerF;ische;b14ch0dres13e0Zk0Sl0Nm0DnZrTuFvi13;fgeQsF;drueck7geGlaendBreiF;chZ;bLdKlo0Wma8pra06rHschuGwaeFzeich05;hl0;etH;iFuesG;chF;te0;e17ien0;au0ilF;de0;bra8reFstau0;gt;ab3roHtgF;ere8;ch0;ga9;isF;ch0D;alog,erkaRgeIschliessHtiquF;ieF;rt;end;b7kuendMlLoJrLsF;iedHpaMtF;a0NrF;eb0;el0;rdF;ne0;eg0;ig0;nn0;bKerikGueF;sa9;anB;isF;cheA;!n;ivaGulF;an0;le9;nt;lFt2;ergGgemeinF;!en;roeF;ss0;kuKtHut,zeptF;abFi1;el;iv,ueF;llF;en;rat;hn7ltF;es0;liF;ch;si1;geMhaeng6ruKsF;olHtrF;aFus;kt2;ut2;!e;pt;ig;druKleJsF;eEich1tiF;mm0;er0;tz0;hn0;ck0;te";

},{}],24:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:AM;1:AG;2:AS;3:AV;4:AW;5:9X;6:A2;7:93;8:B1;9:AQ;A:9T;B:5J;C:AK;D:6L;E:AN;F:AE;--,a9Ob8Pc8Od7Xe77f6Tg61h5Fi4Yj4Qk4Kl48m3Rn36o30p2Xqu2Vr2Ns1Lt1Eu0Zv0Gw02x-m2zGà;eZiYuOwG;aLeIischenG;!dG;r6ur4;c5HiG;hunderB0m2teG;m2n7Z;nGr;g9Pzigm2;!allerAUeOgMleLmKnJobAUsItHvor,weGzuAZ;ge,il0;aAGief9;amm0chuld0eh79;ae99ich8Yutze;ei9indest44u8X;i9Ft4D;egebene8Rl1Jrun9EuG;n9Ote;i5r9;em3rka;h1TitG;le0CwA;aPeLiJoG;a8Gchen7Nert3hlHmoALrG;tgenau12u37;!an,gemerkt;d1ederG;!um;ch,g0iHnigGrk7Ist6C;!er,s65;la9FtG;aSer9Kh6;ehrendIhGnderbare7;lwArG;ha9Sli4;!de89;erUiQoG;lleOnNrG;!aLb4Sd6Per9gest5BhKmJnHsich11u5LwG;a8Xeg;!eGhe20;!w9O;a8ittag;er,in;b,us;!ei5noet0sta3Z;n6Cr;a,eG;lHrG;m2t6R;!e2Sfa4leicht,me9B;botene7gHmut3sGtrack3N;taend7Zus;eGleich8G;beD;!ebQltimo,mOnGsw;bedingt,eiDgKisono,lae4Bnoet57teIverGweF;diente7MsG;chaem3GeheD;n,rG;!de7Kei5h87schiedsl8DweC;eGlu4H;a6Nme6rG;ech3Bn;!ei5soG;!n9;erGli7MrigeD;!aHd16ei5ga0PhaGmorg0rasch75;nd,upt;ll,us;aJeHoGrotz,schingderassab8Jyp2A;i,nnB;ilGstwA;s,wA;eg3gGus5W;ewAsG;!u4J;am0Gch09eZiVoMpKtG;aIeHrengs4SuG;fBndB;llBts;dtein4VngBpelwAtt;aetGri4;es4N;!da2Oeb0fo65gMlchKmFnIwGzusag0;eGieso;it,n5H;derg5ZnGst;ab55taC;!erG;a5Zma6Q;ar,lG;ei4;cherHeGnn6T;beRhs6P;heiGli4;tshalb1;chsmNhMiIlG;bGt0;er,st;neHtG;!eDh1wa77;rGtw4M;s8GzeF;n6Pr;al,illioneG;nm2;aKeibchBlHnGon;ells3Yurstrac2L;ankw7SeHiG;chtw7Re76;c1Aun3M;etzuGria6A;ng6S;s54t;a5DeJings7AuG;eck3WnG;dGt1;!h4Sum,w7J;aliIchtHiGtour;hBn;eDs;st0Ut1;aGer;rtal6Hsi;arHer,hasBlausibTroGunk58;!bewAzentu2;!adoxe7to30;beIeft1ft7UhneGnline;!dGg4Th6;ies;nGrh68;!a2LdG;re6;!aTePiMoIuG;nGr;!me6X;chIrmaHtG;fEwend2X;le7;!m3H;e7Hmm1rgendG;sGwo;!wo;bHt4PuG;erd6Wli4;enGst;!an,b1Rei5h1;chJeIheHm3JtuerlichG;!e7;!b1Ozu;chs2Rm3;!ei5hHmGts;a8it41;er,ine6;aSePiIoG;eglichGn3Yrgen74;e7st;nLtG;!ei5h6nicht0s6HtHuG;nt1;ag6ZeGlerwei5Nwochs;ls,nG;!dr6;de2Dus;hr6TiG;neGstW;rs6Otw2T;l,nGssB;chGge8;eGm2;ror6L;aMeIiHogG;is4N;eb1n0Rte7;dig3iHtztG;end3li4ma8;cGd1;hth6;engsInHutG;!ha8;da44ge;s69tG;!eD;a5DeinesKnapp,onJuG;erz3rG;iose7zG;erha52um;sequenUt20;fEweC;aMeHuG;e0Kst;!dHh1ma8ns5ZtGw0S;zt;eGo4;nfErGsm2;a31zeF;!mmerscha4D;hre51mTnJrgendG;!wG;aGie,o;nn;!bOcl,desNei5fol55klusive,mLneKsHteressanGzwis2T;te7;bMgeHoG;f0OweF;h2Ws56;n,rh44;iGm1;tt0;!s0;esondere;meGst3X;ns,rG;!h6zu;aXeQiIoG;echstGffent3;eDpersön3;eLnG;!a06e6fo2Eg1Dsicht3teGu0K;nIrG;!ei5h1ruecG;ks;!ra2D;!rG;!bLin,zul3K;idenaLrIuG;er,tG;e,zuta4F;!a2SbHuG;eb1nt1;ei;ng9;lHufB;enwA;bGt;e-hal2StaCweC;a05ePlKottlob,rGut;atis,oG;esstGssG;entG;ei8;eichHuG;eck2O;!aHerGfEma2Go3Ywohl;ma2FwA;uf;faellUgeQmPnLrJsHwissG;!e2B;chwei3UtG;ern;adeGechterPn43;!a1Km2so,weCzu;!auGug;!esWsoG;!gGw0R;ut;ae2Eeinh6;benInG;!ei5uG;eb1;enfE;ig9;engGnz,r;ige7;aSern1luQoOrJueG;nfHrG;!ei5wa3A;m2teDundzwanz0F;eiJueheG;r,sG;teD;ns;hera0Zli4taC;lgGrtan;ende1Kli4;gs,ssabG;wa2B;elsch1Pst;ben01g2hYiQnNrJtIxG;cellence,tG;ra;c,wa3M;freu1Kgo,sG;a2AtG;!aun1Ien08mG;al3I;d3tG;gGl0Xspreche29;eg0;gLlJnG;e2Gfa4g27ige14m2sG;c1StG;!ma8w0R;enG;ds;enG;s,t3;!eGr15;dGma8r;em;!fEsoG;!wG;enG;ig;a01eUieRoQrJuG;cha02rchHtzG;endm2;!a00ei5weg2W;au0Neim2iIob0uG;eb0mhGnt0;er1U;nIttG;enG;m2s;!n0;ch,nnersIrt1N;nsHsG;m2s2H;taC;mnae0Qnno4rKsG;gHsenungeaGto;cht10;leiG;ch0;aGein9gestalt,ma07weil,zeF;rt;!hJma8nIrG;nied1ueberhinaG;us;k,n;eim;a,irca;a09ePiIlHrutG;to;indl1Mo08;nn0sJttG;eGsH;!sG;cho0;!h1lHwG;eil0;ang;dauerWfehlsVgreifWiQkanntNrLsIzG;eichnGu1O;ende7;oHtenG;fEs;nders;ei1NgaG;b,uf;eGli4;rmaG;ss0;!dJei5leiInahe,sG;eiGpiel02;te;be;e0Ls1D;gemaeK;liG;che7;rwA;ldHn0OrfuG;ss;!moegG;liG;ch9;b0Zch0Xeuss0Vl0Cmtliche0BnUpropTuG;ch,fQsG;!gerechnOnahmNsGweis3;cLeG;n,rG;!hIstG;anG;de;alb;hlieR;swA;et;!ei5gruPwaG;er0R;os;!dPei5fNgesich0PhaMlaeLsG;aIonHtelG;le;st0;tzwA;eise;ss3;nd;anC;nand1;erGie;eLnKsG;!rIwoG;!h6;in;um;fEor09taC;rs07;ias,lHsGtersh1;!bald,o;eOhi1s04wMzG;eFuG;lanIoHseG;hr;ft;ge;it;eg;er;inMm2nJrdHsG;amt;inC;gs;fEthalb0;en;al8;!e;er9;st;tm2;al;eLsJzuG;eg3;li4;ch;eiG;ts;ndIrG;!ma8;ls;!s";

},{}],25:[function(_dereq_,module,exports){
"use strict";

module.exports = "aKdar,eIfGhBinne,kund,loAn7offJsta6u3voraFwe6zu0;!r1s0teil;ammHtande;ec6ueck;eb1mh0;er,in;ere8rig;tt;e6i0;c0edD;ht;ckBs;er1in0;!ab,unt9zu;a1e0um,vor;in;n,us;e0ort;rn,st;inh3ntgeg0;en;b2llzu,us0;!einand0;er;!waerts";

},{}],26:[function(_dereq_,module,exports){
"use strict";

module.exports = "&,+,aJbHdEeDfalls,inCnachCo8respektive,so5u4w0zumal;aehre3e1ie0ohingegen;!wo8;dHil,nn0;!g7;nd;bald,f1lange,nd1w0;eit,ie,o3;ern;b0dB;!g1wo0;hl;lei3;dem;he,ntwed6;a1enn,o0;ch;!ss;e0zw;vor,ziehungsweise;b0ls,nstatt;er";

},{}],27:[function(_dereq_,module,exports){
"use strict";

module.exports = "d2ein0;!e0;!m,n,r,s;as,e0ie;m,n,r,s";

},{}],28:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:24;1:2D;2:25;a28b22c21d1Ve1Of1Ig1Bh12i0Zj0Xk0Rl0Nm09n05o04p01rXsJtCunAv8w3yoko;a6er5i4oh3to,ut;lf2Hnungsnot;edergebu2Hrtschaft1O;kstatt,leigh;f28llf2End;e3w-tocB;ag,rmoeg1L;i3s0AternehmenssteuF;!cef;a8elefonnuTim14o6r4u3;er,ge0N;auer3euha0M;!fei0;c3des16ec3;ht0;lf23t,u1X;a1JchAed,ozialh1Vp8s,t3uchocY;a6e4raf3u1V;e,kaKt1K;rbeh1Su3;ern;dlmay0hm0si;e3ur;rb0zi0Q;a7neeb1Bul6w3;e3ienbach0;i3st04;nepe1z;d,t02;er1Ju;a5e4ied2u3;eck,ndC;d,g2publiI;ch2f,umf1L;arlamentska4ds,e1hilharmon1Hlo,o1r3;aeamb2opaga1I;mm0;eko0Rno,pTrders;a4e3ot,ummS;tzha17ubau0;bel3to,z6;sch0O;aEeDi9o6u3;e4kakama3tt0;li;ller-mün9tt0;ni4r3;al,genpo1;ka;l5neraloel0Fss,t3;h0Xs3;chu01;ch;hrwert0Brk2taph0;ni0r3tthaeus-mai0uC;cia,ia,k;as5einwaDi0Xpgs,u3;ft3st;f0Wwaf0Q;ker-schuel0t;am5l4oerper00prf,u3;er,n1;a06ient2;eras,m3;er3;!n;ahresfri1uge3;nd;da,n3;g3s2;ebo4r0A;a7e5il4ochbu3rk;rg;degard,fe;i3ll0;di,mZrZ;ftFlbins2nd5u3;s3t;haltKtu0;!voll;e4glf,ia,osalia,u3;n1s;bu09d5gen4is2ld9rvais3werbekapitalI;es;d,wa07;enktaf2u3;ld;a7e6inanzhWlVo5r3uess2;au,eiheits3g,i1;straV;lt0rm2;d0i0;hZu1;-mail,g,hefr8inkomm6n4rb3;schaft6;dstuPtwicklung3;shN;en3;steu0;au;-mark,a5hs,oppel-cds,pa,r3unkelziff0;ittstaatenkla3ogenmafM;us2;g3u0;!m3;ar;ds,laudH;a5e4gag,ib2lutt3ru1;at;ihAtt0;chmann,erb2rm0yernhypo;er;el;bfDda,gBlicAn8r4str3;id;beitslosenh4m3t;ut;il3;fe;g1two8;st;ia;!e3;nda;ah3;rt";

},{}],29:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:IU;1:IS;2:HX;3:HK;4:HT;5:FX;6:I3;7:IO;8:I8;9:IL;A:IR;B:G5;C:IM;D:GV;E:HH;F:IN;G:GM;H:HA;I:GY;J:D4;K:IJ;aE0bC2dBGe8Wf8Ag81h7Gi78k6Ml6Am5Wn5Ko5Ep56r4Us3Yt3Pu2Yv0Vw09zL;a07e05iDuLwiA;e03f02ho2ko4l6Cma1ne8rRsMzuL;geCGla9mDTrecGPs60trI0weC;ammenMchLti4;au0reEK;arE9bI9fa9hFQko4sMtrHLzuL;fBHsD0treIK;cDYeBteH;echtzu3ZueckL;b3EeTfSgQhPkOne8trHHzL;aG8i3uL;drFKeRfüKgewiIPhAHkLzi3;aIKeKo4;aIJeK;ab0ol0;eLreGR;b0h0wiIK;aEKiC;ro9K;lIKriedenzU;ck0g6;ig0rL;bHSr0sto2;eFVhl0;a01eUiNuL;eLnF;ns1rd5;dOederLss0;aufz34erBQfiChMko4zL;ugHW;ab0erCAol0;erLm0;lJsL;eBpHHt3;cQgPhr0iterMnd0rLtt63;b0d0;arDEeMg3s3zuL;eLfAMma1;ntwiGK;faHne8;hs6k0;cNeFDhrMlt0rLs1;n0t0;ne8z2P;hLk6;en,s0zuEF;er01oL;llZrLti2;anWbeVd8MfABgHDhaEko4lTsRweQzuL;bNd8LfAAgMlJne8sLwePzi3;cA7teH;auk6eh0;eLriA;reEIug0;is0rf0;chLteH;iH5lGFreD4;eLiJ;g0s0;izu9RreEC;b8Ako4t73zuL;ko4t72;b88eCzi3;a13b0Wd0Tei0Rf0Qg0Ph0Mk0Kl0Hm0Fn0Eo0Cp0Br09sWtSuRwMzL;eAJicIoe6P;aOeMiLoeEYunF;rk7Rs1;hr0iLnd0;ge7s0;hr0nd6;nsicGKrsa1;ag0eLi3S;iMuL;e7f6;d5l0;aWchSeRiQoPpi8KtLu1;aMeLrE9;ck0h0ue7;at7FeL;nd5rk0;eEJrg0;cG9l7T;lbstaend5tz0;aNeEOiGElLwe5;echBEiL;e9m4C;eFRff0;eBSnd0;ecEBiL;cIn60;a9fl7Pulve7;eLr8K;d0ffent71;achlaess5icI;arkt0eAAiL;nFsC4tt6;aMeLi2;g0ih0;en5Rge7ngsam0ss0ut0;aG5leine7nLo4raC4uerz0;eEEueE8;aMeLinF;hl0im6Rlf0;nd6rr0;aeHeDIlDHoGGroesEK;aHo6ZuJ;nLt6;b7Zfa1ig0;aMien0opp6rL;aeAeifa1;nk0u0;au0eQiPleBLrNuL;ch0eL;nd0ss0;eLiA;it0nn0;et0nd0;rg0sE7ug0;bschi2TeMnLrB4;ke7la9twoC6;nFusE4;ebZmRnterL;biCdrBRg3maDYr6TsNweDFzL;e8Wi3uL;b6Ig3;ag0chMtLu1;e74ueB;aeBe9DreB5;bRdr3fa9g3kQrPsOzuL;bMg3keKsLwAP;chuFQeBtE6;au0riA;eE6teH;ei9ueCK;eKreEN;eneF9riA;eLrigbleAW;n,rL;bTdeBCfSg3l2JnRprüf0rQsPtNwLze58;aLeCYiC;ch0eEB;reLün1;ff0ib0;chreC0eB;as1ed0;acIe8;liJüK;liG;aeAFeQhema2PoPrLun;aNeMiL;mm0ump30;nn0t0;e9Zg0kDns35u0;et0le35rpe4P;ilLst0;h3Nne8zL;une8;a0Fch06e04i02kiz7Go01pVtLu1;aReQoOrNuL;di2eL;rz0tz0;aE9ei1;er0pLss0;f0p0;ige1Urb0;bi1We9Vrt0tL;io7BtLui2;fiC;aPeOrLu2;eMiL;e9ng0;ch0ng0;icDQrr0;r0zi2;n44rg0;cherLeg0muB5nk0;n,s8Az89;h0in,nLtz0;d0k0;aSeA7iRlPmNnaHrumC1ueMwL;eC6iA;r0tz0;eLi11ueG;ck0i9;aLenFie9uG;f0g0;ck0eb0;eCYff0u0;g0mm6ni2;ae1eOiNuL;eLh0i6N;hr0tt6;cIe1s38;aRchQdPf1ZgNhabiliDkMpa21sLtt0ziD;erD1pekD;laBMonstr3KruD;iLn0;er0st1X;en,u6B;n0tfAW;gi2liBT;aQflJlaPrL;aeNiva17oLu05;bi2du66fiLgnosti66t1Mvo66;li2ti2;g0s67;tz0zi2;ck0rLsBMt65;k0tizipi2;bserCMef6OffeMpe1LrL;ga03i62;nLri2;bMhaEzuL;haElJ;ar0le8Q;aOeNiederMoDuL;eBtz0;lJsc5Kzul0C;hm0nn0ut0E;chMheL;b3UlJ;ar89de91geA9hPlCOvOweAOzuL;de90g3hOko4lMpruLspi4HvNweAN;ef0;aCOes0;oll55;ol0;aXeWiNoL;bi05derLtiC3;niB0;lFniANssStL;ans3film0hQmPne8rOt2Swi81zuL;bLma1rNt2Rwi80;esLriA;ti4;ed0;a1is1;aEelf0;br1Mh7O;id0ld0;ch0ng6;a9eTiQoL;ckeOes0hn0sL;lMwe96zuL;sc4Twe95;a9eg0;n,rn;beLeBZnF;raL;liAG;ck0gMhr0iLnk0rn0s0uAD;h0st0t0;en,itiA1;a03enn01ipp0lXnVoPriSuL;eLltiBDs1;mMrzeL;n,rtrAM;me7;llabo08mOnMoLrrigi2;pe07rdi4Q;kreLsulDtrol8Szent06;tiA4;bi4NmLpenA3;en,uni4I;aLue9O;ck0ll0;aMet6CingeL;ln,n;er0rL;ma1;enLze4T;!zule94;ndi1Epp0sLuf0;cLsi2;hi2;dentifi46gnoRmQnLso8D;fOteMvL;esD;gOnsiAPrL;es9MpreD;or99;porD;ri2;a02eQiMoL;er0ff0l0;ev0nL;ausg3bla1Dde7gARlJne8wegtae6LzL;i3uL;ko4ne8we8TzufuJ;iVlf0rL;aNbeizuf3LhaErs1s54uLz53;eber3BmL;sc3Hta6Vzusc3H;bz6YnzuQuL;f38sL;biB5ko4sNzuL;fLhaEko4ne8s4Y;iCueK;p1OteH;f3Cko4zi3;l0rat0;lMndhLu0;ab0;bi2t0;aranDeMleichz6NoeAKrLuG;e8Pue9;bPfaeh7Fgenzus4Zh0lOnNstaEwL;aehrLiAHoe88;en,lei7P;ie9uJ;aAiAt0;en,rL;au1;a05eYiWlToOreMuL;e6Bsio37;iLu0;ma1zube37;erFlOrLtografi2;ci2mu76tL;seBzuL;f2RseB;ge7;anMieL;g0h0;ki2;nLr80xi2;an2Rd0;rPstL;haElJste1IzuL;haElJsL;chLteH;re5H;nLt5;haEzu6F;hr0ll0ss0;in16mpfe77nt0PrPtab6PvakOxL;isDpL;anLorD;di2;ui2;a0Jb0If0Fg0Dh0Bk0Al06m03n01oZprYrWsStRwNzL;ae71eLi16wiA;ug0;aNeLirt5B;ck0iLrb0;s0te7;e75rt0;e77r8C;chMeBp1AtL;a8ZiG;ein0ie9l9DuL;et3Z;eLicI;c6Yg0i1;e9ob0;be7eL;f2Lr3U;aeKeL;nn0ue7;oLut5;egLrd0;li1;aNeL;b0iL;ch3Md0;eu3Lng0ub0;e8Ula2;aEeb0oL;eh0l0;aLeh0re6X;e4Pt3G;aMiCoLreu0ueH;lg0;hr0ss0;riA;hn0r3Z;biCdeGfYgeVkUlSm2Sne8rRsOwNzL;auLi3;be7;e7Mi73;chLeCt3;aeLe2Blue15uld5;d5rf0;icI;aLed5oG;rv0st0;o4rae45;genLh0;ne8se72tr6YzuL;ko4seBwi3N;alMeLli3;rn0ss6;l0t0;ar3Hb0Gd0Ff0Dge0Ch0Bk0Al07m4Gne8or06paGquarDr04sZtr7CzL;a5Ki3uL;bWd0DfVgUhTlSm4Ene8rRsLtr6RweC;aGchOeBpiNtL;eLuf0;h0ll0;el0;aLr1R;eBlt0;ae31ei1icI;aZeYo7M;aEol0;eh0re5X;orFue01;e03iC;chNeBpMteL;ck0h0ig0ll0;ar0;aEl7OrL;ae3Qe4J;ae2QeiLicI;h0s0;dn0;aMeLo1;g0it0;d0ss0;a79eKl6C;aEeims0ol0;h0st3;a3Bl7DorFueL;g0hr0;ae4riA;eLiCriA;zi3;a03e00iWrUuL;ld0rchL;bRdr38fQg3lPsNzuL;dr37fPsL;cMeB;cLeBu1;hl5Y;a6UeucI;ueK;liGre1;oLueG;ss6;en0sL;kMtanL;zi2;rediDuD;ck0fiMmL;enD;ni2;em4Mnk0rMst3ue7vonLzuL;ko4;lJs0Qz0P;au0eSiRlQrNuL;ch0eL;nd6ss0;aMeLiA;ch0ms0;ndma1Uu0;as0e21iG;et0ld0tt0;a17de16e14f12g0Vh0Ti0Qjah0k0Nl0Lme1Rn0Kob0Jr0AsYtVuUvorzuTwNzL;a3SeLi3;ic40;aOeMirLunF;k0t21;g0is0rL;b0kstell5t0;elt5fLhr0;fn0;st3;g0rte3V;aReil5rL;aLe1N;cIg0;aen0AchReQiPorg0se7tLu1;aNeMi4rL;af0e2U;ch0h0ig0ll0ue7;et5;cUeg0;it5tz0;aOer0im3QlNneMoen5rLw2;ae1V;id0;eun5ie9;ed5ff0;aSeiOuL;eLh5;cksicLhr0;ht5;s0tL;sMzL;usL;teH;pp0t0;acI;e5BuB;a9eLo31;b0g0;aMl47o4raeL;ft5;em36nntg4V;sMtr44wo2WzuL;be1SlJtr43;te3F;aLeb0;lt0nd6upt0;ePi50lOnuJrL;eLueC;if0nz0;eg0;ei1ueG;gn0h0isL;te7;a9oerFrL;ag0ei0;inLnd0;druGflu9;ut0;cInLr02uftr3N;staCtL;r3Lwo13;b33e30gi2kzepDn1Mppel1Lr1Jtm0uL;f0RsL;b3Ld0Neinander0Lf0Jg0Hh0Fk0Cl0Bprobi2r08s03t01u48wYzL;a20uL;arVbUdTgShRlPma1nuBrNsLta00u46weiY;ag0cLe3Ap3Ut01;hl4I;aeLicIuf0;um0;ad0ie46oL;es0s0;and6;eb0l1Mre08;e1Zr0D;au0i4Jre16;be15;ae1NeiMiL;rk0;s0t0;aLreQ;us1;chNeh0p3EtLu1;a3NeL;ig0ll0;aEl40reLue3L;ib0;eLicI;c1LiL;ch0s0;a3Oie3Mo3L;o4undL;schaL;ft0;aLeb6;lt0nd6;e10l0ZreL;nz0;aHueL;hr0ll0;seBzL;useB;eMrLue3G;ueG;nk0;b09d07faHg06h04k03l02ne8rZsXtVwTzuL;bRfOgNhMkla2lLma1ne8po0CsWtr22zwiA;eg0o34;aEeb0o2;eb0re1F;aMrL;is1;ll0ng0;au0es1Lr3E;aLeL;rt0;e0WreL;ib0t0;tLu1;eHoG;eLoHuf0;chtzuerLg0;haE;a2Ro2O;la2o4;aEeb0oL;er0l0;e05re0X;eGrL;aeA;au0es14i1Er2XueL;rd0;beLtikuM;it0;li2;aly0Wbi19da0Ve0Tf0Sg0Nh0Li0Kk0Hl0Gme0Fn0Ep0Br09s02tr19w00zL;i3uL;bi17e0RfWgThSkRlPn0CpaOr2DsMtreLvertr1JweC;ff0t0;ch04e19ied6p1TtL;e0Qr23;ck0ss0;aLeg0;st0;l19o4u09;aEe0C;eMlL;ei1;b0h0;ert5;ig0;aeLeC;hl0;chQeBpNtL;eLreA;ch0ue7;oLre1;rn0;tz0;au0l1Y;ecLuf0;hn0;a9eMreL;is0;il0;ae17e8;ld0rk0;eg0oG;aemMuL;rb6;pf0;mi2;aEeLo2;b0iz0;eNreMuG;ck0;if0;b0hL;en,o2;aAorFueK;iLrke1A;gn0;ue7;si2;ti2;cInFusL;se7;ht0;b1Af13ge11h0Zl0Une8ruCs0Ct0AverlaAw06zL;i3uL;b02f01g0PhaEjZlXmilFne8rWsRtrQwLzi3;aNeMiL;ck6;i1nd0;eLrt0;hl0lz0;et0;chOeNic0BpaEtL;eHi4;ll0;h0tz0;a0Fi0El0Su0A;at0uts1;eLie0Ho0G;g0hn0s0;ag0;lt0;eFueK;au0;eh0;aMeL;rf0;eLrt0;lz0;au1rLun;ag0et0;ag0chUeTiRolPpOtL;eMi4;mm0;mp6;re1;vi2;er0;cLtz0;he7;gn0tz0;aQiPl03oOreNuL;ett6;eln;ck0ib0;tt0;eb0;ff0;hm0;aOeNieMoL;es0;fe7;g0it0s0;uf0;aLeb0;eAlt0;b0wiL;nn0;eFiClMueK;hr0;ie9;ss0;nd0;de7;rn;au0iOrL;e1iA;ng0;ch0;ld0;en";

},{}],30:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:BU;1:C1;2:BO;3:BT;4:BA;5:C0;6:A3;7:8K;8:AO;9:5F;A:AR;B:BS;aAFb98c8Sd8Je7Vf6Zg6Bh5Mi5Gj57k4Dl44m3Pn3Fo37p2Cr1Us0Vt0Eu06vXwLxiao1SyKzC;aeh6eHiGuCwa1ypri95;eg0ga1kae1OsCwae2I;ammenCc0It09;ha1sC;chC4to9U;nsBWvi6W;do1itCntralraBrou95ug0;g89raBLso9Vungs2F;ig93o1;aLeHiDoCuenscBY;lfBKrtla5Q;derspB1lDrC;kungsgr4DtschaftsBF;lenCs4;!be7A;chselBLiEltDrt0stC;-p0en6Y;kriB7m72raBB;hnachtsbaBAne;gChlBBld,rr0;en,goAI;eFiEorC;b8Jga1ha1jahreszeitB5o90ra1sCwuerf0;cAQi86pK;etnam8Cttor7L;rCteran0;bEda9Eein5Xh9Vlu2sCt9K;e,tCucBG;o96yn0;ae7raucherpr91;eberImGnErCs-97;nenAZspCwaA;ru1;-94f9Mm53terCwi9N;ga1nehmensgewin6;fa1ga1stCwelt2V;ae7;ga1sch0W;aQeMhKiJoFrCsche5Duerk0;aCes0o3T;kt9uC;ergae2m;desscEeDn,rCuK;er82nad82;ne,pf0;huB0;erv9HscAX;e8Gier5oCr4;mA7rvaA;ilErCsBxt0;mi6roC;ri2;en,nehme27;g0milenCnz,rif2O;!rebe92;a09chXeUiSk30lowak0oQpNtDuedCwi36;en5Uo2paz1Gwe2;aIeHolGreiEuC;dCehl0;e3ien9H;fenCk,t5Q;!w4I;pe,tU;i2Gr2Gv0;atCdtte9Ie8Shl,ndo7Uuse0;en,sC;b4Jp7JsekretaA5;d-6Xe3Di4Dons9rC;it,uC;eng,ng;eh6ld8mmernachtst9TwjeByin3CzialC;d70i2plae6staaB;cherheitsCn6;g4Lk2R;g0kt9nCrb0;atCi9s9;or0s;aLeJiIlachtbu8FmHolz,rGuEwC;aCu1;n7WrzwaA;es7Rhe,ldC;en5E;e77i64;erz0i5Uol5U;enen6Ql7Em4;rbenhaCwardnad5;uf0;d4Yed0rCtt0;pi1;al,e8Xft,rg,tell59;aSeMiJoGuC;eCmaen0ss0;ckChe;en,ga1schlC;üs5;nDtC;or0sti42;!aA;e79ngDos,sCval0z6L;ikofa2Xse;!o;be7RchtsGfe1XgDh5iCkt9praesenta3ser12xro5C;cht8Yn79z;enDiC;erungsk1Wss68;!waA;ext4Ys30;hm0mi8Rng,tko,um,viv;aZeWhilViUlRoOrDsych6RuC;n82ts8L;aesidentLeJiIoC;duFfEtCz6V;ago5TestC;a3en;ess9it;ktivitaetszuwäCze3;ch5;m8Anz8Svat47;i6PsseC;bericht0;en,schaftskand1T;lizDol,rtCst0;illo,ugi5M;eik1Di2;aCeitg0;eCn6F;ne6Ntz0;cass5QerrEl5M;ippe,osoph0;nDrC;ot;!g;es5nHp4rFsEtDzC;if74;ie3riar2Pt0;sagi88t9;kCtei50;!pl7C;et2Ots2L;berIeGffizi84goni-ZrDsCt80we77;t3HwaA;der7WganisDtC;en,sverein0;at9m0;koClk6H;l5Rnom0;kommandiere7on;aGeEiDordCu7B;en,o2we2;chol7Eed2Blako1V;ls4rv0uC;an40ba6Q;chEehrbod0m0rr0tionalC;i2sC;o0Yta8;baCfahr0;rs5W;aPeNiLoEuDythC;en,os;enteferi1s6Lt;enc7RnaHrGsC;c7QlemC;-Cs;aktiC;vi2;d0g0ill4;r1Tt2Z;nisterp4QtgliedsCyazawa;s5Kta8;chanism0nC;g,s1P;er6Cn0Tr3Isssta1Ntthi6S;aJeHiGoC;bbyi2eDhnC;absch7E;hCw0;ne59;ami6ban4efe3Rn3K;bens6TiCon;be,tzins72;ed0fontai6i0stw17;aYen,inderWn0ZoGrEuCw4;nd0rC;d0on,se52;eCi6Ko8;d2Li4U;eQhlhau3Bll6ImNnErrCsteng1G;espon48uptionsskC;and43;fIkurHrGsEtDzernC;e4Vs;inent2Arahe3;e5QumC;!e3;ad;re3;erenzkClikt25;reis0;mDpC;liz0o3Eromis5;and3Ku3D;pf0;ga40sC;chuh0o4F;mpfeins5HnGpita0rCtholik6D;amira,din3MlCst0;-ChD;hCot64;ei0R;al,dC;id8;aIeHiGoEuC;d0e09ngsoCri2;zia14;ch0e1QschCurna13;ka;a1g3B;ns,ts;cks4hrCns0;esan24ga1;de3Ng-metall-2Ompul5nErDsC;a1la1S;a4Wrt5Mvi1;dustries41go,itiat9sa2AteCvest9;nCresse3;da3;aKeHiGoDuCwa1;ngerstre4It;chschulreCef0;kt9;or0;nw3Fpparc2U;i03lDnCrr0;ni1r4C;d5JmI;berm50eQf0k0nIrGusC;en,haltC;en,sC;!sC;tre4J;aAtmC;ut;dlungsspiIg,sC;!-Ce8geo0X;hFjC;oDueC;rg0;ch0e0T;ag0;el4U;f0upt2S;-38aVeLinzbu0PlaKoIrCuld0;ad,enzuebGieFossCue7;bCku7ra4R;etriC;ebe;ch0;er4P;izueCldsto6uvern1Y;ta;nz;dank0fange6nIo0FrGsFwiC;nnDssensgC;rue7;e,s;a1ichtspun3Qundheitsschaed0;h0Qichtssa1XstensaC;ft;eraCo11;el0lC;!inspe1L;eEmsachurdia,ng,rt0zaC;-sCsC;treif0;rt0st0;a02eZiSlMortschri0RrGuC;eEnCs5;damentaCk0;li2;hrerschei3Br2s28;aEeCiedL;ddie,iCu7;d15landv2X;geb1XnC;k0zC;!o22;e1JuC;echtling42gC;haClots0;ef0fC;enC;!s;lGnDrmenCsc43;ku7;anzCn0;e1Ejongl0XmC;aer2V;ipin10mC;en,s;i7ldCrd0Ytz0;beC;rg;d0eFktEnDvorC;it3M;g,s;en,or0;d0ll0;be17g4hrg2WiSlRmNngKrJtIuGwaAxC;-Epe12tC;reC;mi2;kommu0Ap0Q;-Cg0ro;kommissionsp0Os1J;aBo;b0loe18;elhCpa3H;arC;dt;iDpC;fa1;gRlC;io;efa3lemann-jens0;dgGnCsr2O;b2Bdring0Pf37gEkla1sCzelvert19;ae2CchniC;tt0;a1r2C;enoC;ss0;aIeFiDonalds4uC;ft,rch2M;eCplom8s05;n2pg0;al,moCng;kr8nstC;ra3;eChrendorf;mon0n0;aQhFlint4ommonwealth0Rsu-C;vorsiC;tze7;nd0;aLeHinGrC;istDoC;ni2;dCen;emokr8;es0;fredaDmieC;rie5;ktC;eur;ot0;rlEst1V;a0FeXiVluem,oRrKuC;chstab0ll0nDr15ss0trC;os;desDzenthC;al;pCs07;raeC;siC;de3;anFei,iDoCunn0;ck0;efCt0;en,ka2;cheneCdt;xpeC;rt0;d0eCg0rk;d0rsenC;ga1neuC;li1;olC;og0;amt0itSlaRnOrIsFtriebDwCzirk;ei5;eLsraC;et0;chluCen;esC;seH;eicheGg,iFtEufsC;soC;ld8;hoA;chB;!n;!eluxC;-sC;ta8;ng0;ra0P;c4hnhoef0lk4rnevTuC;loew0m,stei6t0;ne;b12erzt0ffront,ge3irporBkt0Tl0Mm0Kn04ppet03rWsRtMuC;fIgenzHsEtoC;kCm8r0;onzerW;flu0Hga1nahmefC;aeC;ll0;eug0;schDtraC;eg0gs0H;rei,wu1;em,laEomC;tesBvC;ersuc0R;ntCs;ik;i8peKtC;a,ronC;aCom0;ut0;at0;beitsGchiteFeEnoAtiC;keln;ld;ns;kt0;plC;aeK;it;aPdLfa1grKrJsFtCzuS;eDonC;!io;il0;aeEcDpC;ruec06;hlaM;tz0;eiz;iff0;ers4rC;a1eC;as;on;ly2rC;chi2;aJtskollC;eg0;!berHkohol,lFptDvaC;ro;raC;um;einC;ga1;to;eurGiC;enEonaDvi2;st0;er0;kur5;!en;ts;nt0;en;ga1sC;chDtricC;he;luC;es5;se;ng";

},{}],31:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:E7;1:E5;2:DH;3:DS;4:CI;5:DX;6:CM;7:CJ;8:DW;aCEbAUcAOd9Te91f8Ag6Yh68i5Tj5Pk4Fl40m3Bn2Vo2Op24quart23r1Rs0Yt0Gu08vTwGz9;ahl04eDiCu9y2X;eriC6gestaend9Asammen9;lBOs35w9;ac2Zi16;el6mm1t62;hnt2i9ntr0ug;ch0ta7V;aHeCiAo9u9S;chenend0ert1hlwoll0lfenbueDFrt7Z;e9sm9H;n,sC2;iCrkBs9tt1;en,t9;d2Cf2Ljordan4;e7Us;hna7Qssruß4;hBn2Trsch9ZsAtt9;!enme1;hingtAZs4P;lergebCQrzDD;at5XeGiEo9ukov96;elk8lCr9;biAAgC1h6Ejahre9kommCNstandsmitglied76ur7Gwo8O;n,s9;!nive9R;k3um0;chy-reg1Adeo,e9gDHlniDKsi1;lfach3rt2tnCT;hik2r9;bDdi4LfaC5gnuCNhAkehrsCTmoCNn8Us9tr3E;ag0p3R;aAo1uet9;ungsCQ;elt8Elt0;reCZundu6V;eberFf1mDnArteil9s-repraesentanD9;!en,s;gAhe72ter9weAI;haD8n8L;aB0ezief1l68;deAXla7satz9;minD5plD5;e12lAKmaBE;aPeLhHiGoErCscheBu9;ch9eb62neC9tzi4N;!olsky-zit4X;chi0tscheCH;avn25e62i9;bu17eAL;des9r6ulouBX;opf1urteil6;bCGer6;ai4e9uer5U;ater9m0;!haCSs9;!t5S;am,herCNl9rritoC6;!e9;fon9kommunikations7Z;!e,gespraeAK;bCMdschikiCCgebue2HiwCJl3uziAZ;aZchReQhando46iPloweC2oOpMrinag81tDuAy9;ri0st0H;b0Oed9jC4;frankr3Vos9;se2PtaBO;aDeuergeCich3Xockholm,rAu9;di0eck6Cttga7F;a9eichhoelz1;f4Glsu7ssenki82;heimn97ld8;atsBbilitaets2Ydt9edtBY;schloAKwe9;rk0;d4Poberhaeupt1t8V;aBOekt8Fiel9;!zeug;ftwareC4ndierungsg6B;biBKlve8Anga1W;chst2kretari3Zme89r2V;aEei3EiffDkop87lBmier8Nott4rKwe9;d0i9;g0ne5;a9eppt84oss8Z;chtpf9Mg3F;!e5;fe,u9;fen81s0S;ar9c0Mig91ngerhaus0udi-ara2M;brueck0la7;aJeFhein4iDoCu9;d1eAhrgASmaeB8ndschr9ss7U;eib0;g0ssels1A;sto84tAX;ese7Nga,nd9sik0;er5fle60;chnu8XgBiAnn0praesentantenhaus8Ls9utl4Lvi1;ervo33t-6Cult3G;ch8Jseu52;im3;ed1sta9FtBGuB4;e9Ei1;aPeNfLhaenom0ilotproKlIoGr9;aEe7WiDo9;-kopf-eBblAdu9f56graB9je9ra,tokoA8;kt6;em0;in77;nziB1vile4O;ba2Tg;k1l0r9sEtsdAH;t38zellB3;a9us;edoy1kat0;je27;arrB1erd6lich9u7;tfa8Y;acekeepi2Lki2Zrso9;na5I;kApier6r9ss73;adi3ke8Vla9Ptner5R;et,iAM;bDeCffen8EgoniBhr0pf8rc0Hst9xford;d9slawonien37;eutsch4;-volk3la7;ko-aud5Dl,sterr50;dachlosen0Ber9je1Ust;haus4Mschle9W;aJeHiDor9;d9w9T;bosA3ir4rhein-westfAzy9;pe8E;al0;eAger9ve6O;!-del93;dersac9mands4;hs0;st,tz4Cu9;-del1Lg6Fsee6H;ch9hrungs93shoern1;barlaAs9;pi2;en9nd;de82;aPeMiFoCu9;enAs9tt2E;e0ikt6Tt1;ch0st1;dell76rsl7Ks9tive5v0Y;amb9kau75t5J;ik;ami,liEnDsstrYt9;gliedAleOtel9;!a3Qme1n;!er5s9;!l1Q;is0Kus;e9Vta1;cklenburg-vorpomme7NdiAer,gawa7Sis9lbourne,nschenre3Psse1Hta8P;s0ter-baf7T;en,ka8K;drFed9EiEl8CnBrkeAss9teria4A;!akSe;nz9Bti1A;cAd86n9oev1;heim;he5S;la7nz;id;aKeHiFoDu9y6Q;dwig3MeBmAx9;em6Lor;pur;be5Vn0;b,ch,e9nd6L;ch1;by0c31ed,ssab6Jt9;au0;benAd1e6Wnz9tt5Dut9;kir76;!s7Y;b4Och0denschlussg23eAg9nd67teinis8U;er45;ch4Pnd8;a07er54i02lZnYoKrBu9;erz2pf1r9;di8Ssbaromet1;aEeDiAoa9;ti0;egs9te8F;g7Zverb9;re8K;ditinst0Luz3;f7Fnken9;be6Sha9;eus,us;ble35eLlJmInCpAr9;n,ps;enhag0f9;-an-kopf-re7Uki8S;kurs7BsDt0vergenzBz9;e9il;ntrationslag1pt0rt;kri9;te80;ta2Wul0F;ite3man4W;lektivs,um9;bi0;ln,nigrS;ie;agenfu3Dische3o9;e4Ist9;er5D;el,gali,n9rchenvolksb6Osangani;d9o;!e9;r9s;!n,z41;bine63iserGlEnin7SpitDrBsAvaliersdeli9;kt;ach7TchmMs2;atsc9lsru29tel4T;hi;a2Jel;i9ku2;b1for7F;rAslau9;te5P;ei5S;a9orda7Bu2N;-Ahr9kar6Ep7Qzzfe5G;e1Qhundert6tause7zeh6O;wo2R;mLnAr4sra4Rta5Wzm9;ir;dFkrafttret0la7nEsCterAvestmentbanki9;ng;e2Kieu9n77;rs;ekt0t9;itut0;e5Bsbru3Y;iBone6Oustrie9;l9u0Z;ae45;en,vidu0z;it9mobilie3D;at;aPeJiGo9undert0;-chi-minh-3LchEeAf,l4ngko9rm4Ht4Bust4H;ng4B;chstBr9;ge9n1;ra6R;ma5F;lohn4wa1T;lfs6Nn9;der61t9;er4;bronDer40ft,iBkt2GlArz9ss0u;!en,ogenaura4W;ler33ms-burton-29sinki;l69m9zo2;!at4;!-2R;aGeFlbjahr3m3YnCsch18u9;ptquarti1s9;!e3Uhaltsd9;efiz1D;au,d9nov1sa-spar2H;el9tu4M;n,sb10;us8;g,r;ePiNlMoKrDu9;atemala-2VeteBt9;a0Eh9;ab0;r5sieg2;emi0iechEossDu9;en,nd9;gAs9;atzur05tueck6;esetz3C;britan5SuU;en4ische5;ett9rl3P;ing0;ue2N;ft,pfeltre9;ff0;b00de3VfYgenWhUlOmKn,orJpae2KrGsBtrae3Vw9;a9erbe35i66;e0Rnd;amtmeta4WchAetzYicht8praech9tod0undheit3E;!e5s;aeft9i2FlNos4Z;!en,s9;fe2Jv49;aeAicht9ueR;en,s4I;t0usc01;gi0;einschaftsuBue9;se,t9;!er;nt11;aCd9;eAha9;e11us2M;r5s;ec9;ht1;ae9i3Bo1;lt1;te9;il;aeng0Be9uehl0;cht0;aeudeAet,iet9;!e9;n,s;aUePiOlJor0rBu9;e9tt1;hrung1Enft2;ankEied9uehstü1M;ensArich9;shaf0;ab10g9;espraec9;he;fu00r9;eich21;aggschiff,eCoreBug9;b9zL;la2U;nz;is2R;er,nn4;hlverhalt0ld8n0YrnsehCstAu9;er,illet1Y;iva9la7spiel4P;ls;due3Jen;ch,ech,hrAss,x,z9;it;waAz9;eug6;ss1;cuadZhepaYiRlPnLrEsDu-Cx9;-9emp2il;ju9;goslawi0;lae03;chbo26s0t4;be,dEeigDfuCgeb9mittlungs2Zstaun0;ni9;sse9;!n,s;rt;nisse5;b1Mgescho2Go2;d3glBsembl3t9;setz0wicklungsla9;end,nd;a7is1Z;e9sa2B;me2Wnd;!er,gentumsv2Wn9s0;fCgreif0ko3Ule1PvAwanderungs9zelanli34;gese24;ern9;ehm0;amilienhae9uehlungsvermo30;us1;ar;or;aZeSiPoIrCu9;eAnk9schan1Ktze7;eln;ll,sseldorf;ama,eCitt9;el,la9;e9nd;nd1;h9ieYsd0;bu1E;erfEku28ppelAr9;f,tmu7;besteuerungsAz9;imm1;ab9;ko37;ch0er5;amante9enstmaed2Wng6sziplinar1W;ng9;eschaeft;bEfizit6kr2RlegationDsAtail08utsch9zib2;land07;aAogestr2s9;au;st1;smitglied1;ak2;ch,eBmask2Zr9t0yt06;l1Bm9;stadt;ch8;hCoAre9;do;meba9rps;ck;e9il3;mni0X;a0He03iZlaXoUrNu9yt3;chLdKeHkare0Blga24ndesCrgtBss9;ge9;ld1;heat1;aCg1LkriminaBla9;e9ndJ;nd8;la9;mt3;ch8nd9;el,n9;iss3;apeZg1X;!eD;aDem0u9;essAttoinlandsprodukt9;!es;el9;!s;nden9si0B;burgs;livi0nn,rd,s9;ni0t9;on;e9tt;tt1;er,ld9;er5u9;ng9;sw0Y;dKiJkanntwIlErBs9tt6;chaeftigungsverhä0Rtr9;eb0;g-karaAn9;!au;baM;faBg9;i0ra9;ds;st;erd0;ne5spiel6;aueBe9uerf0H;nk0;denHfGgFlleEnCs2uAye9;rn;gewer9spar0;be;d,glades9;ch;tt;!an;oeg;!-9;bad0;b10e0Wfghani0Vi0Tk0Nl0Gm0Dn07rUsRtMu9;ck4fFgeCktions13s9;chwiAla7maDsterb0tra9;li0;tz;n9s;!ma9;ss;bBsAtragsv9;olum0;eh0;egeI;la7;nd;eli1h0lanComkrafBtent9;at6;!en;twerks;ta;erbaidsch0Ji0yl9;verfa9;hr0;beitsCchiv0gAme00znei9;mittel5;entiYu9;meC;gGlosengeld3vCzeit9;koAmode9;ll;nt0;erhae9;lt9;nis9;se;ebiS;daluDgel3kara,liCsAw9zS;es0;eh0i9;nn0;eg0;si0;mXs9t3;terd9;am;baEgClheil9t1;mi9;tt2;el;e9i1;ri0;ni0;t9w;enzBien9;pak9;et;ei9;ch0;ds,r3;es;stF;gypt0mt8thio9;pi0;er5;!n;enEgeordneBhoer0idjAko9;mm0;an;ten9;ha9;us;deAteu1;er;ss0;en";

},{}],32:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:43;1:3Z;2:44;3:3Y;a3Ub34c31d2Qe2If29g20h1Ti1Pj1Kk1Cl17m0Ln0Ko0Hp05rYsMtKuIvEw7york,z4;ahl,eit5i3Mu4;kun26sammenarb3;!u2;a9e8irtschaft7o4;che4lfga2rt0;!n4;!ende;!spolit33;lt,st0;ehrungsuni2Shl3Jig3Dlesa,shingt2S;er4orst3M;antwor3Eg5handlung0kauf,tr4;ag,et1;angenh3l1Z;hr,msa29n4rt3Psa;i2Mterstuetzu2;agSel,hema,o4;cht1d,nn0;aEchCeBhe1Yi9o7p6t4;a4r3u0T;at38dt;d,rech1;ld4mm1nnt2Mzialdemokr4;at0;ch4tua0S;e0At;iXpt27rb0;arpi2r4u1W;itt,o01;c10m22;abin9e5icht4olle,ussl32;er,u2;fo1Hgi5publik4;!an1;erung4on;!schef;!s;arDds,eCla1Mol8r4;aTo4;blem5duk0Dze4;nt,ss;!e;en,i4;tik5z4;ei,ist0;!er;ki2rs0Ht1;is,lament,tei4;!en,t1W;effentBktob1p5r4st0;ganisa02t;f1posi01;am0igeria,ov1H;aJeGi8o4uenH;eg6n4skau;a4t1P;teQ;lichk3;cha20lliAnister8t4;gli6t4;e4wo1V;!l;ed1;!pra4;esident20;a1Uon0;di0h5ns4;ch0;rh3;e8i,n6r4;k4t1N;!t;ag1n4;!heim;nn1rz;a5eu0Wo4uxemV;esu2nd0X;ender5fontaine,ge,nd4;!es;!n;aAi9laus,o6ri5u4wasniewski;nd0;eg,t10;ali5hl,lleg0mm4nz1G;ent0Gi0I;ti0O;lomet1nd1rcF;mpf,n0W;a5u4;erg0li,ni;hr4nu0Apan;!e4;!n,s;g,n4sra11tali0;forma4stit8teres0Tvesti4;ti4;on0;a6elm5ilfe,oe4;he;ut;elf07m6nd5u4;ptstadt,s;!el;burg;e6r4;enz0ossbritanni0u4;nd,ppe;fa08ld,ri15s5w4;alt,erkschaft0i0O;ch5e4prae0I;llscha5tz;ae4ichW;ft;aBdp,ebruNi9o8r4uJ;a4eit02ied0;nk4u0L;furt,r4;ei0A;rm;lm,rm4;a,en;ll;in8n6r5u4xpK;!ropa;folg,gebXklae02;de,t4;scheidu2wicklu2;fu5sa4;tz;ehX;dr,eAi7o5pa,r4;ittZuT;ll4nner7;ar;en5sku4;ssiA;stG;bat6legi5mokratie,utschl03z4;emb1;ert0;te;du,h5lint4;on;ance,ef,ina;aQeHild,liGoEruessMu4;ch,eBnd4;!es4;kan8re6t5we4;hr;ag;gieCpubl4;ik;zl1;nd4rg1;nis;er4nn;se;ck;deuBgiAhoe9ispi8r6su5teiligu2voelke4;ru2;ch;iNl4;in;el;rd0;nn;tu2;nk5u,y4;ern;!en;mt,nCp,r7u4;fgabe,s4;l4senminist1;and;beit4mee,t;!geb1nehm1s4;losigk3plaetze;eit;er;fa2gab0si5t4;eil;cht;en;ng";

},{}],33:[function(_dereq_,module,exports){
"use strict";

module.exports = "a7beim,durchs,fuers,i6u3vo2z0;!u0;m,r;m,r2;eb0ms,nt0;er0;m,s;m,ns;!ns,ufs";

},{}],34:[function(_dereq_,module,exports){
"use strict";

module.exports = "'s,a1Fb1Bd0Te0Jgenuege1Mi08je00keinYlWmQniPpaar,sJunsIvielHw1z0;u0Rweierl1K;aEe9i7o0;!b1Idur5fu0OgAh4m0Ana5r0von,zu;a1in,u0;eb0Mm;n,u0;f,s;er,in;ch;e0r;so,vA;lBm,n2r,s0;halb,w0;eg16;!ig0;!eOst14;nn,rum,s;!e0V;!erW;aemtli04einVi4o0;etw02l2v0;iel0;!e;chR;ch,e;chts,emB;an4e1i0;ch,r;hr1i0;nLste09;!ere9;!ch2;autUetztere0;!r,s;!e0;!m,n,r0Es;d4gliche3m0neF;and0;!e0;m,n;!n,r;e0wedL;!m,n,r0s;!mann;c9h5nwiewe4rgend0;ein1we0;lDm;!e0;!m,r;it;m,n2r0;!e0;!m,n,r,s;!en;h,k;benso8in5r,s,t2u0;ch,er,re0;!m,n,r;li1w0;as;che;and1ige0;!n,r,s;er;viel;asGe4i0u;ch,e0r;j6s0;!e0;!l3m,n,r,s;in9m7n6r1sse0;lbKn;e3gleichJj1lKsel0;be1;enige0;!n;n,r;en,jenigEs1;s0zufolge;elbC;!e0;!m,n;!selbe;eide1iss0;ch7erl;!n,r0s;!l6;ll1ndere0;m,r,s;!e0;!dem,m,n,r0s;!ha2l1meist0;en;ei;nd";

},{}],35:[function(_dereq_,module,exports){
"use strict";

module.exports = "aHdreiEeCfuenfAhundert8ii,neun,s4t9vier3z0;ehn1w0;anzDei5oelf;!eDt6;!zB;ech1ieb0;en1z9;s0z4;!e8;!t0;ausend;!e5z0;e8ig;in0lf;e2hundert;!e1ss0;ig;in1;cht1ndert0;halb;!ze0;hn";

},{}],36:[function(_dereq_,module,exports){
"use strict";

module.exports = "0:IY;1:H9;2:IP;3:I8;4:HP;5:IT;6:IO;7:II;8:HU;9:FV;A:GR;B:IW;C:FF;D:EF;E:CV;F:HR;G:F3;H:ID;I:H6;J:FR;aGFbDJdCUeAMf9Vg86h77i74jube5k6Ol6Am5Vn5Lo5Kp59quitDOr4Xs3Lt3Cu2Jv0Vw06zK;a04eYieh84oXuKwa4;eBLgeSlRna7DrueckOsKtreI5we8;ammengeLtK;eh0im5M;bJ9fu8ko2schlIZtrK;ag0oI1;b83geKkehCverwiHzieDV;b2PfKga4ha5no2rJ8scCUtrAwiHzIL;a32u8;asHHeF2;g0Tla6me6no2sK;aHRchLeh0pJ2tK;a8o6;lGZniIPob0ri7;eg0g1;iNrK;leEVri6sK;cCKtK;o4TriIK;chneKg9F;!n,t0;ehlAIhCW;a03eViNoMuK;eKrDTssHV;hl0nschHWrDSsFG;hHOllCDrd0;ch0dNeLll,nk0rKsH0;d,ft,kEY;derKg0s1;aufg2Og4JhoCO;erKmA;fIHrIKsK;etBIprKta8;aFMecD4oB;ggeQh0iLrKtt0;de,f0tA;gerNnt0sMteK;rgeKt0;g7ko2;en,s,t;e,n,t0;faGVla6;chGKeNgt0hrg2BndLrK;!en,f1ntDtA;eKt0;lt0rt0;chFKh5re3;erYoK;llzHGrKtE;aSbeRentFPgeMherLlKseCO;ag,eDX;ges86sFX;dBAfHWgNha5ko2lMno2sKtrFWwoFQzHC;chKeh0t6D;lFUob0ri7;ad0eGJ;a4eb0;ha5i6D;nLrbeitAusgeK;ga4s7Y;geKkom41;ko2t8R;a0Qb0Md0Keinba5Ff0Ig0Gh0Ek0Dl06m03no2oeffentlicEHr02sRtOurteiGwLzK;eEQicCJ;eiLiC7oK;b0rf0;geCst;an,ei5DrK;aKet0i7;g0t;chQeh0iPpNtKucF;aLeKie6o8AriEKue8;h9ll0;en57nd1;rKuFI;aEGecBYicE4oB;ckeCnk0;lGYmolz0ob0ri7wK;aLiKu8;eg0nd0;en9Nnd1;at0oGT;ag,iKocFut0;eKsFFtte5;d0t0;aOetzC9ieNoK;er0rK;!enK;!gega4;f1h1re,ss1;d0ngD7sF8uK;f0tete;au4ZoerpeCP;aKind7Wo3H;e4ftJlf0nd92;aKe6liDW;ng0ss;i9FlKolF3ueg9;og0uechtC1;eutliBiKoG3;c28ent1;arg0iMoLuK;cFnd0;rg0t0;n8Zss;bschiedJenEInK;sta5twoC;ebWmUnterKrt7W;bSgRhQlOno2sLwoE6zK;eichnELog0;ch7EtKucD5;rKuet9B;eiBiDF;aKieBY;g,uf0;a5ie5;esch4Nrab0;leib0roB;fasDKgeKstel5woFK;b0ga4he,ko2stiEN;erLriggebKt0;li7;einsti2fVgTlSnRqueCsNtrLwKzeuBX;iHu8;aKoEQ;f0g0;chMeh0prLtK;a8eB8;a9Fu4;lDRriFH;eh23im20o2;eE5ie8A;eKo6;b0ga4;aKlF2;hr0ll0;aQeilOi76oetArKu9;aMiLuK;eB9g0;eb0f3Onke3;eADf1ge,t1ut0;gKna3Hte3;eno2;et0nzDMuK;chDLg0;a0Sch0Ae09i07k6Mo04p01tKuADymboli2O;aVeRiPoOrLueK;nADr8B;eKiEYoemt0;b0iK;k0t0;ppt0sDJ;eKmmt1nk0;g1ss1;ckBFh3UigLllKueC;!en,tD;eKt;!rt0;e8gnEmmBBnd1pe5rNttK;fLgeK;fu8g7;a9Lin7E;b1tA;aDWe73iel1YrKueC;aKec9HicBN;ch1eBng1;lKr5K;idarisElK;!e3te3;cheCeh9gnalisiCVnKtz9X;d,g0ke;he,i1tztD;aZeXiVlSmi75nRoE9rOuLwK;a86i8;erLfKl71;en,tA;f0t0;eiLieKump9T;!b1;bt,t0;eid0iE2;aLieKo6ug0;f0ss9;eCZge;c9JeK;n1ss0;iKr0;d0n2XteC;eKfft1uDC;me,tz32;eLg4Oh1mme5nKss1;g0k1;he3ss0um0;aUeOiMol5uK;eKf0tscF;ckD5gt0st0;cKef1ss1;htA;agier4GbellEch8CdOgeNiLklamiD1praes7QsK;idEul84;ch2RsK;s0t0;le,neriI;et0uz7N;eumtDg0ng6Ht0;aSeil0fle9MlQrK;aNeisgMoK;duziKfi4XphezA9testE;er9;eg7;eKll0;gt0sen4T;aKuendeC;edierCSn9S;k7PssK;e3iCK;blieBSeffnAffenbaCFperE;aPeNiKut6D;edergeLmK;mt;ga4la6sc6X;hKig0nD4;me;chLehKg0hm1nnCB;erg21m0;empfu8geK;g7ko2la6wiH;aVeUiOoMuK;ess6QsK;izEs1N;cFeKniB6;chC3ge3;sNtK;geKmacFteilC1;hoKno2trAU;lf0;chB1sK;la6Eversta8;hr0in06lde1E;chLg,hn0nge6UrK;kiIschE;e,te3;aSePiLoK;b0esBThBVsg5B;eKtt0;fKg1BssD;!eK;n,rBP;bt1g32hnLiKse;d0stA;e3tD;eMg1nde81sLuK;f0scFtJ;en,se;ge3s9SuK;ft,tA;aVeUlSoQriPuK;eLrK;siI;mmBCndK;en,igK;en,tD;eBtisier3T;enn5Rmm9nKstAB;kur60nB6troll5YzentrB2;aKettB4in8O;ff0gt1ng;hrA6nn9;emMm1nLuK;e7Sft0;didAWn29;e3p77;dentifizEgnoriAZnKst;formEsze5MterpretATvestieK;rt1;a0CeZiOoMuK;el5lK;di7M;b0cKerAUff3D;h00k0;eSlRnK;ausgePgeMneLterlKzukam0;a6ie6U;hm0;nLwK;iHo99;!o2;he,ko2;ft;lt1ssK;!e;b0iss01rK;aSgeOrs2WuMvorgK;eKi4U;ga4hPrB9trA;mgespB6nterK;gefB4;g7sK;chLtK;elG;ob0;nLusgeK;fu8g7ko2no2sp4C;gezAD;be3eNlMndLtK;!te3;el9le;f0te;lt,ngKt9Yuf91;e3t;a17eRiQlMrKutgehei6;atul9Ri9JuK;e2YppiI;aLeichgKiB;eko2;enz0ubK;en,t1;bt,lt,ngD;ae0Yb0Sd0Qeini98f0Mg0Ih0Eko2l0Am08n06p05r03sStPwLzK;ei97i0Qog0wu4;aMes0iHoK;e6Tnn0rK;b0d0f0;c88ehGnn1rAAsB;an,oetJrK;aKet0i7o95unk0;g0u0;a8ZchSeRpQtMuK;c73nK;g0k0;and1eMi8SoLriK;ch0tt0;hl0rb0ss0;he3lG;a5ieGroB;h0ss0t7F;aff5AeKi7Gl9Rni9Qo9Pri7;he,i1W;at0echnJiKu9R;et0ss0;la9TriH;an9So2uK;e5Tt78;aKe6;c6Nh8T;aMeLiKte,u4;ng9tt0;g4Zs0;d0ng,ss0uf0;aMeLoKt;b0er5Zlf0;!imge7B;bt,lt0n5S;a4eMoLrK;i8CuendJ;lt0ss0;b0nueberstP;aMiel,loLor7IuK;eh7Ind0;g0h0ss0;ehr1Vll0;a4DiKru4;eh0;aIeOli7oMrKu8;aKoB;c62uc3W;rKt0;en,g0;!t0;n76usse77;b1e5lt1rant84;a08e01iZlWoSrOuK;eKhr0;g0hKrch4M;l8BrK;e,tD;aMeK;igeKue;g7ko2la6sp8V;gt0ss0;erd7ZlMrK;derKmiItgeschV;e,n,tD;gt1;ieLoKuecF;g0h0ss1;sse3;elDnK;anziIde33g1;hlPiOrtigbri4stK;geKsi3O;ha5le77no2sK;chKta8;ri7;er42;e3gesc22t1;eKn19s54voris15;lGnd0;i18mpf14n0HrNs6OxK;isLpK;andE;ti7E;eignAf0Bg09h07inner06k04lYmVoeff2OrTsQtPwLzK;aehGiel9wu4;aLi2RoK;g0rb0;e3TrK;b0tJ;ei5;chKo4DtoB;ein9ien1lo6o3AreK;ck0;eiKu4;ch9;itt06oK;eglichKrdJ;e,t1;aNeMiLoK;e4IsB;e6tt0;bt0d33g0ichteC;euKg1ss0;te5Q;en6VlK;aertDomm;e,n,t1;aeGielt1oK;b0eh9ff0lt0;aKeb0i13riff1;b0eb0ng0;or3Jr0RuK;ell9hr0nd0;dAgag05tK;deckt1f02gZhXlVno2ri6sOwMzK;og0ueK;ndA;ickKo52;eGle;chOpMtK;aKe1Uue8;mm0nd1;a3HrK;a49eche3ic3XoB;eiKi4Hlo2D;de;a09ieK;ss;aKie5;eGlt0;a4egenK;gKscXt4I;etrA;al0XiK;el0;ie2X;aLeh0UinKohl0u8;de,g;hl0nK;d1g0;gnAlt0nK;be00dra4fror,gOi2Jpra56sLtraKzu06;f0t;cLetKt0M;zt0;hla4W;eKi3O;bTdSfQgPha5laOno2richtJsLtrKwiHz5U;ag0et0o57;chLet3QtK;elGi4X;l61ri7;d0ss0;a4ri52;a4VrKueh4B;or0;ru4;roBu8;r66z5J;a04e01iZoWrTuK;erfRrK;chKft0;geNraMzK;og0uK;se13;ng;ru4scKz5B;hl3U;e3te3;aLeh0i4oKueck50;e1Gh24;eng3Zng0;kumLmiK;niI;enY;en4UskutK;ie3P;battEck4SmonstKnk9u17;ri3R;ieC;beigewHcFrKueC;f,stK;elK;le;a2DeSiRlPoNrKucF;aKing9;chKecFn4Cuch1O;!en,te3;et0ykotK;tiI;eibt,iKocki3Fueh3G;eb1tz0;etJldAn;a22d1Ye1Xf1Mg1Eh18i17k12l0Xm0Wnoe0Ur0Ls05tVvorstSwOzK;eichLiKog0weife5;eRffer1P;neK;!t;ahCiMoKun14;g0rK;b0f0;es1;aLeK;he;nd;eSonRrK;aNeMi7oLuK;e36g0;ff0g0;ff0t0;cLeKge,t;f0gt;ht2V;en,te;ilig9n,t0;aYchPiOp4JtLuK;cht1;aLeh9ri46uenK;de3;eti34nd1;tz0;aef02einRiPloOni42o6rLuldRwoK;er0r1;aenLeibKi7;en,t;kt0;ss1;ed0mpK;ft0;ig0;g0nn0ss1;eOiLuK;f0h2A;chtetDeK;f1t0;!e3;cMiK;teK;n,t0;hn0;tiK;ge3;erke,ueh34;aLeKi32og0;g9ucF;d0s0AuK;eKf0;rn;aLenne3la2Bomm9raeftiK;gt0;eme3m0nntK;en,geK;g7word0;be16getr31mes1Utrug0;aLerrs0EinK;de2H;nLrKupt1N;re3;deG;lt;anQeb0inPlOoNrK;ab0i22ueK;ndAssK;e3t1;nn0;eiQiB;g1n9;g0n1;aSindeRlueQrPuK;erKnd0;chLwoC;rt0;teK;n,t;eit;ge5;!n,t;e8ll0nd1sK;st0;influs14ndJ;aue1SeutJiLroK;ht;en0ng0;et;bsichti11nspruK;ch0T;lanciIsi0Rt,u9;e,t;b1Qe1Lg1Jh1Illeingela6n0Upp0Sr0Oss,ttackiIuK;f02sK;bild0fiel1gNmach1SspraMwiLzeK;ichnA;ch,es;ch1;eLiK;ng1;bUfa0XgTlQno2r2CsLtr1UwK;ac03iH;chMeKp28;h0tK;zt;iKlo6ri7;ed0;aLoeK;st;d0uf0;a4eb0liB;li7roB;geOhie5rMtLwK;eis0ies;rat;echterKi16;ha5;bYfUg0LhTko2no2r1VsQtOwLzK;og0wu4;acLoK;rf0;hs0;an,rA;et0;chKe6;lKob0;ag0;a5ob0;aMl0XorK;deK;rt;ll0ng0;ot0roB;beitMgumentiK;erK;en,t0;et1;elli0FlaudiI;er0;bot0geNleMtrat1weiK;se;!en;ge;b01fYgVhTkRla15no2r15sMtKwiHz0I;an,rK;ag0et0i7oU;chMeh0p10tK;iKo6;eg0;lo6o6ri7woK;ll0;laKo2uendiK;gt;a5e,oK;b0eU;a4eb0riK;ff0;ng0;aLocF;ht0;hr0ll0ng0;ot0u8;nd0;nt0;ieK;re;ndMussK;erK;te3;erK;e,t0;ber0DgePlLzeichK;ne;ehnLiK;ef;e3t0;!n;b05f04g02ha5l00no2rWsQtOwLzK;og0;iHoK;rb0;es0;an,rK;ag0et0;chKeh0pYto6;lNniMoLri7;eb0;b0ss0;tt0;ag0o6;i6uK;f0ng0;ss0;mm0;aQehK;nt;eb0o5;lt0;ahr0;roB;ch0;uf0;en";

},{}],37:[function(_dereq_,module,exports){
/* nlp-compromise/efrt v0.0.6
 usage: unpack(myPackedString).has(word)
 by @spencermountain MIT
*/
'use strict';

var BASE = 36;

var seq = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var cache = seq.split('').reduce(function (h, c, i) {
  h[c] = i;
  return h;
}, {});

// 0, 1, 2, ..., A, B, C, ..., 00, 01, ... AA, AB, AC, ..., AAA, AAB, ...
var toAlphaCode = function toAlphaCode(n) {
  if (seq[n] !== undefined) {
    return seq[n];
  }
  var places = 1;
  var range = BASE;
  var s = '';

  for (; n >= range; n -= range, places++, range *= BASE) {}
  while (places--) {
    var d = n % BASE;
    s = String.fromCharCode((d < 10 ? 48 : 55) + d) + s;
    n = (n - d) / BASE;
  }
  return s;
};

var fromAlphaCode = function fromAlphaCode(s) {
  if (cache[s] !== undefined) {
    return cache[s];
  }
  var n = 0;
  var places = 1;
  var range = BASE;
  var pow = 1;

  for (; places < s.length; n += range, places++, range *= BASE) {}
  for (var i = s.length - 1; i >= 0; i--, pow *= BASE) {
    var d = s.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    n += d * pow;
  }
  return n;
};

var encoding = {
  toAlphaCode: toAlphaCode,
  fromAlphaCode: fromAlphaCode
};

//the symbols are at the top of the array.
var symbols = function symbols(t) {
  //... process these lines
  var reSymbol = new RegExp('([0-9A-Z]+):([0-9A-Z]+)');
  for (var i = 0; i < t.nodes.length; i++) {
    var m = reSymbol.exec(t.nodes[i]);
    if (!m) {
      t.symCount = i;
      break;
    }
    t.syms[encoding.fromAlphaCode(m[1])] = encoding.fromAlphaCode(m[2]);
  }
  //remove from main node list
  t.nodes = t.nodes.slice(t.symCount, t.nodes.length);
};

//are we on the right path with this string?
var prefix = function prefix(str, want) {
  //allow perfect equals
  if (str === want) {
    return true;
  }
  //compare lengths
  var len = str.length;
  if (len >= want.length) {
    return false;
  }
  //quick slice
  if (len === 1) {
    return str === want[0];
  }
  return want.slice(0, len) === str;
};

//spin-out all words from this trie
var unravel = function unravel(trie) {
  var all = {};
  var crawl = function crawl(index, pref) {
    var node = trie.nodes[index];
    if (node[0] === '!') {
      all[pref] = true;
      node = node.slice(1); //ok, we tried. remove it.
    }
    var matches = node.split(/([A-Z0-9,]+)/g);
    for (var i = 0; i < matches.length; i += 2) {
      var str = matches[i];
      var ref = matches[i + 1];
      if (!str) {
        continue;
      }

      var have = pref + str;
      //branch's end
      if (ref === ',' || ref === undefined) {
        all[have] = true;
        continue;
      }
      var newIndex = trie.indexFromRef(ref, index);
      crawl(newIndex, have);
    }
  };
  crawl(0, '');
  return all;
};

var methods = {
  // Return largest matching string in the dictionary (or '')
  has: function has(want) {
    //fail-fast
    if (!want) {
      return false;
    }
    //then, try cache-lookup
    if (this._cache) {
      return this._cache[want] || false;
    }
    var self = this;
    var crawl = function crawl(index, prefix$$1) {
      var node = self.nodes[index];
      //the '!' means a prefix-alone is a good match
      if (node[0] === '!') {
        //try to match the prefix (the last branch)
        if (prefix$$1 === want) {
          return true;
        }
        node = node.slice(1); //ok, we tried. remove it.
      }
      //each possible match on this line is something like 'me,me2,me4'.
      //try each one
      var matches = node.split(/([A-Z0-9,]+)/g);
      for (var i = 0; i < matches.length; i += 2) {
        var str = matches[i];
        var ref = matches[i + 1];
        if (!str) {
          continue;
        }
        var have = prefix$$1 + str;
        //we're at the branch's end, so try to match it
        if (ref === ',' || ref === undefined) {
          if (have === want) {
            return true;
          }
          continue;
        }
        //ok, not a match.
        //well, should we keep going on this branch?
        //if we do, we ignore all the others here.
        if (prefix(have, want)) {
          index = self.indexFromRef(ref, index);
          return crawl(index, have);
        }
        //nah, lets try the next branch..
        continue;
      }

      return false;
    };
    return crawl(0, '');
  },

  // References are either absolute (symbol) or relative (1 - based)
  indexFromRef: function indexFromRef(ref, index) {
    var dnode = encoding.fromAlphaCode(ref);
    if (dnode < this.symCount) {
      return this.syms[dnode];
    }
    return index + dnode + 1 - this.symCount;
  },

  toArray: function toArray() {
    return Object.keys(this.toObject());
  },

  toObject: function toObject() {
    if (this._cache) {
      return this._cache;
    }
    return unravel(this);
  },

  cache: function cache() {
    this._cache = unravel(this);
    this.nodes = null;
    this.syms = null;
  }
};
var methods_1 = methods;

//PackedTrie - Trie traversal of the Trie packed-string representation.
var PackedTrie = function PackedTrie(str) {
  this.nodes = str.split(';'); //that's all ;)!
  this.syms = [];
  this.symCount = 0;
  this._cache = null;
  //process symbols, if they have them
  if (str.match(':')) {
    symbols(this);
  }
};

Object.keys(methods_1).forEach(function (k) {
  PackedTrie.prototype[k] = methods_1[k];
});

var ptrie = PackedTrie;

var index = function index(str) {
  return new ptrie(str);
};

module.exports = index;

},{}],38:[function(_dereq_,module,exports){
'use strict';

var unpack = _dereq_('./efrt-unpack');

//order doesn't (shouldn't) matter here
var data = {
  adjectives: [_dereq_('./_packed/_adjectives'), 'Adjektiv'],
  adverbs: [_dereq_('./_packed/_adverbs'), 'Adverb'],
  auxiliaries: [_dereq_('./_packed/_auxiliaries'), 'Hilfsverb'],
  conjunctions: [_dereq_('./_packed/_conjunctions'), 'Bindewort'],
  determiners: [_dereq_('./_packed/_determiners'), 'Determinativ'],
  femaleNouns: [_dereq_('./_packed/_femaleNouns'), 'FemininSubst'],
  infinitives: [_dereq_('./_packed/_infinitives'), 'Infinitiv'],
  maleNouns: [_dereq_('./_packed/_maleNouns'), 'MannlichSubst'],
  neuterNouns: [_dereq_('./_packed/_neuterNouns'), 'SachlichSubst'],
  nouns: [_dereq_('./_packed/_nouns'), 'Substantiv'],
  prepositions: [_dereq_('./_packed/_prepositions'), 'Praposition'],
  pronouns: [_dereq_('./_packed/_pronouns'), 'Pronomen'],
  values: [_dereq_('./_packed/_values'), 'Zahl'],
  verbs: [_dereq_('./_packed/_verbs'), 'Verb']
};
Object.keys(data).forEach(function (k) {
  var tag = data[k][1];
  data[k] = {
    obj: unpack(data[k][0]).toObject(),
    tag: tag
  };
});

module.exports = data;

},{"./_packed/_adjectives":23,"./_packed/_adverbs":24,"./_packed/_auxiliaries":25,"./_packed/_conjunctions":26,"./_packed/_determiners":27,"./_packed/_femaleNouns":28,"./_packed/_infinitives":29,"./_packed/_maleNouns":30,"./_packed/_neuterNouns":31,"./_packed/_nouns":32,"./_packed/_prepositions":33,"./_packed/_pronouns":34,"./_packed/_values":35,"./_packed/_verbs":36,"./efrt-unpack":37}],39:[function(_dereq_,module,exports){
'use strict';

var suffixTest = function suffixTest(t, list) {
  var len = t.normal.length;
  for (var i = 1; i < list.length; i++) {
    if (t.normal.length <= i) {
      return false;
    }
    var str = t.normal.substr(len - i, len - 1);
    if (list[i][str] !== undefined) {
      return true;
    }
  }
  return false;
};
module.exports = suffixTest;

},{}],40:[function(_dereq_,module,exports){
'use strict';
//if we have no tags, make it a noun

var nounFallback = function nounFallback(ts) {
  ts.terms.forEach(function (t) {
    if (Object.keys(t.tags).length === 0) {
      t.tag('Substantiv', 'noun-fallback');
    }
  });
  return ts;
};
module.exports = nounFallback;

},{}],41:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "er": 1,
    "he": 1,
    "ch": 1,
    "en": 1,
    "es": 1,
    "ig": 1,
    "de": 1,
    "ge": 1,
    "ne": 1,
    "nd": 1,
    "em": 1,
    "le": 1,
    "ar": 1,
    "os": 1,
    "re": 1,
    "ll": 1,
    "al": 1,
    "iv": 1,
    "it": 1,
    "el": 1,
    "me": 1,
    "se": 1,
    "eu": 1,
    "il": 1,
    "mm": 1,
    "au": 1,
    "rm": 1,
    "rz": 1,
    "ff": 1,
    "eh": 1,
    "xe": 1,
    "im": 1,
    "ue": 1
  },
  {
    "ive": 1,
    "sam": 1,
    "ein": 1,
    "nah": 1
  },
  {
    "frei": 1,
    "nehm": 1,
    "fair": 1,
    "klug": 1
  },
  {
    "freie": 1,
    "stark": 1
  }
]

},{}],42:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "ng": 1,
    "en": 1,
    "on": 1,
    "it": 1,
    "ft": 1,
    "ie": 1,
    "ik": 1,
    "et": 1,
    "nz": 1,
    "he": 1,
    "ne": 1,
    "se": 1,
    "be": 1,
    "ei": 1,
    "ur": 1,
    "pe": 1,
    "ve": 1,
    "dt": 1,
    "ra": 1,
    "ta": 1,
    "iz": 1,
    "su": 1,
    "dp": 1,
    "pd": 1,
    "ty": 1,
    "pg": 1,
    "ap": 1,
    "eu": 1,
    "fa": 1,
    "cd": 1,
    "ga": 1,
    "vs": 1
  },
  {
    "ahl": 1,
    "eln": 1,
    "uld": 1,
    "cdu": 1,
    "ddr": 1,
    "rid": 1,
    "poe": 1,
    "not": 1
  },
  {
    "bank": 1,
    "form": 1,
    "reue": 1
  },
  {
    "front": 1,
    "othek": 1
  },
  {
    "enität": 1
  }
]

},{}],43:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "er": 1,
    "rn": 1,
    "ch": 1,
    "ag": 1,
    "rs": 1,
    "ss": 1,
    "tz": 1,
    "es": 1,
    "us": 1,
    "kt": 1,
    "at": 1,
    "nd": 1,
    "nn": 1,
    "el": 1,
    "or": 1,
    "ef": 1,
    "st": 1,
    "rt": 1,
    "ug": 1,
    "an": 1,
    "rd": 1,
    "ll": 1,
    "eg": 1,
    "ck": 1,
    "il": 1,
    "uf": 1,
    "au": 1,
    "ar": 1,
    "ff": 1,
    "tt": 1,
    "ls": 1,
    "gs": 1,
    "ds": 1,
    "fs": 1,
    "ub": 1,
    "fe": 1,
    "ks": 1,
    "ed": 1,
    "bs": 1,
    "pf": 1,
    "ic": 1,
    "rf": 1,
    "hs": 1,
    "lf": 1,
    "im": 1,
    "am": 1,
    "ai": 1,
    "ki": 1,
    "ex": 1,
    "ak": 1,
    "ps": 1,
    "ph": 1,
    "ir": 1,
    "af": 1,
    "rb": 1,
    "lm": 1,
    "rz": 1,
    "ri": 1,
    "li": 1,
    "gh": 1,
    "oo": 1,
    "og": 1,
    "ob": 1,
    "si": 1,
    "eo": 1,
    "do": 1,
    "ni": 1,
    "id": 1,
    "pp": 1,
    "so": 1,
    "hm": 1,
    "ac": 1,
    "ud": 1,
    "kw": 1,
    "di": 1,
    "ax": 1,
    "mi": 1,
    "mp": 1,
    "ix": 1,
    "wf": 1,
    "no": 1,
    "hi": 1
  },
  {
    "hof": 1,
    "eur": 1,
    "ieb": 1,
    "ohn": 1,
    "eiz": 1,
    "ama": 1,
    "anc": 1,
    "ctu": 1,
    "que": 1,
    "imm": 1,
    "arl": 1,
    "ony": 1,
    "abu": 1
  },
  {
    "stab": 1,
    "text": 1,
    "herr": 1,
    "keln": 1,
    "arzt": 1,
    "ingo": 1
  },
  {
    "schuh": 1,
    "multi": 1
  }
]

},{}],44:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "um": 1,
    "ns": 1,
    "ts": 1,
    "al": 1,
    "ms": 1,
    "rg": 1,
    "as": 1,
    "ld": 1,
    "rk": 1,
    "os": 1,
    "to": 1,
    "ut": 1,
    "ka": 1,
    "ia": 1,
    "ad": 1,
    "em": 1,
    "io": 1,
    "ot": 1,
    "go": 1,
    "pt": 1,
    "pa": 1,
    "da": 1,
    "iv": 1,
    "lz": 1,
    "ro": 1,
    "ko": 1,
    "lo": 1,
    "ol": 1,
    "po": 1,
    "yl": 1,
    "ow": 1,
    "ux": 1
  },
  {
    "amt": 1,
    "awa": 1,
    "pur": 1
  },
  {
    "zeug": 1,
    "heim": 1,
    "lied": 1,
    "dorf": 1,
    "scha": 1,
    "orps": 1
  },
  {
    "gramm": 1,
    "werks": 1,
    "korea": 1
  },
  {
    "bafoeg": 1,
    "mbabwe": 1,
    "schiff": 1
  }
]

},{}],45:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "ng": 1,
    "on": 1,
    "rn": 1,
    "it": 1,
    "el": 1,
    "in": 1,
    "rs": 1,
    "is": 1,
    "ns": 1,
    "us": 1,
    "ie": 1,
    "se": 1,
    "ik": 1,
    "tz": 1,
    "um": 1,
    "ts": 1,
    "an": 1,
    "ag": 1,
    "nz": 1,
    "nn": 1,
    "ck": 1,
    "at": 1,
    "ls": 1,
    "as": 1,
    "au": 1,
    "ur": 1,
    "or": 1,
    "rg": 1,
    "ld": 1,
    "ss": 1,
    "ef": 1,
    "ms": 1,
    "ke": 1,
    "pe": 1,
    "al": 1
  }
]

},{}],46:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "rt": 1,
    "et": 1,
    "gt": 1,
    "lt": 1,
    "te": 1,
    "ht": 1,
    "st": 1,
    "kt": 1,
    "nt": 1,
    "zt": 1,
    "ft": 1,
    "bt": 1,
    "mt": 1,
    "ut": 1,
    "be": 1,
    "fe": 1,
    "pt": 1,
    "ss": 1,
    "og": 1,
    "dt": 1,
    "ng": 1,
    "at": 1,
    "ke": 1,
    "ag": 1,
    "ug": 1,
    "ah": 1,
    "or": 1
  },
  {
    "eln": 1,
    "itt": 1,
    "ieb": 1,
    "gab": 1,
    "tze": 1,
    "ief": 1,
    "ern": 1,
    "tan": 1,
    "arf": 1,
    "hob": 1,
    "kam": 1,
    "arb": 1,
    "ann": 1,
    "ieg": 1,
    "bot": 1,
    "lud": 1
  },
  {
    "nahm": 1,
    "wies": 1,
    "traf": 1,
    "fiel": 1,
    "fuhr": 1,
    "fahl": 1
  },
  {},
  {
    "schied": 1
  }
]

},{}],47:[function(_dereq_,module,exports){
'use strict';
//basic POS-tags (gender done afterwards)

var patterns = {
  adjectives: [_dereq_('./patterns/adjectives'), 'Adjektiv'],
  nouns: [_dereq_('./patterns/nouns'), 'Substantiv'],
  verbs: [_dereq_('./patterns/verbs'), 'Verb']
};

var testSuffixes = function testSuffixes(t, list) {
  var len = t.normal.length;
  for (var i = 1; i < list.length; i++) {
    if (t.normal.length <= i) {
      return false;
    }
    var str = t.normal.substr(len - i, len - 1);
    if (list[i][str] !== undefined) {
      return true;
    }
  }
  return false;
};
//
var suffixStep = function suffixStep(ts) {
  var reason = 'suffix-match';
  var keys = Object.keys(patterns);
  ts.terms.forEach(function (t) {
    //skip already-tagged terms
    if (Object.keys(t.tags).length > 0) {
      return;
    }
    for (var i = 0; i < keys.length; i++) {
      if (testSuffixes(t, patterns[keys[i]][0]) === true) {
        t.tag(patterns[keys[i]][1], reason);
        return;
      }
    }
  });
  return ts;
};
module.exports = suffixStep;

},{"./patterns/adjectives":41,"./patterns/nouns":45,"./patterns/verbs":46}],48:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  Substantiv: { //noun
    is: [],
    enemy: ['Verb', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },
  MannlichSubst: { //masculine noun
    is: ['Substantiv'],
    enemy: ['Feminin', 'Sachlich']
  },
  FemininSubst: { //feminine noun
    is: ['Substantiv'],
    enemy: ['Mannlich', 'Sachlich']
  },
  SachlichSubst: { //neuter noun
    is: ['Substantiv'],
    enemy: []
  },

  Pronomen: { //pronoun
    is: ['Substantiv'],
    enemy: []
  },
  Determinativ: { //determiner
    is: [],
    enemy: []
  },

  Zahl: { //value
    is: [],
    enemy: ['Substantiv', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },

  Verb: { //verb
    is: [],
    enemy: ['Substantiv', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },
  Infinitiv: { //infinitive verb
    is: ['Verb'],
    enemy: []
  },
  Hilfsverb: { //Auxiliary Verb
    is: [],
    enemy: ['Substantiv', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },

  Adjektiv: { //adjective
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },
  Adverb: { //adverb
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Artikel', 'Bindewort', 'Praposition']
  },
  Artikel: { //article
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Adverb', 'Bindewort', 'Praposition']
  },
  Bindewort: { //conjunction
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Adverb', 'Artikel', 'Praposition']
  },
  Praposition: { //preposition
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort']
  },
  Url: {
    is: [],
    enemy: []
  }
};

},{}],49:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('./paths').fns;
var build_whitespace = _dereq_('./whitespace');
var makeUID = _dereq_('./makeUID');
//normalization
var normalize = _dereq_('./methods/normalize').normalize;

var Term = function Term(str) {
  this._text = fns.ensureString(str);
  this.tags = {};
  //seperate whitespace from the text
  var parsed = build_whitespace(this._text);
  this.whitespace = parsed.whitespace;
  this._text = parsed.text;
  this.parent = null;
  this.silent_term = '';
  this.lumped = false;
  //normalize the _text
  this.normal = normalize(this._text);
  //has this term been modified
  this.dirty = false;
  //make a unique id for this term
  this.uid = makeUID(this.normal);

  //getters/setters
  Object.defineProperty(this, 'text', {
    get: function get() {
      return this._text;
    },
    set: function set(txt) {
      txt = txt || '';
      this._text = txt.trim();
      this.dirty = true;
      if (this._text !== txt) {
        this.whitespace = build_whitespace(txt);
      }
      this.normalize();
    }
  });
  //bit faster than .constructor.name or w/e
  Object.defineProperty(this, 'isA', {
    get: function get() {
      return 'Term';
    }
  });
};
Term.prototype.normalize = function () {
  return normalize(this.text);
};

_dereq_('./methods/tag')(Term);
_dereq_('./methods/out')(Term);
_dereq_('./methods/case')(Term);
_dereq_('./methods/punctuation')(Term);
module.exports = Term;

},{"./makeUID":50,"./methods/case":51,"./methods/normalize":52,"./methods/out":56,"./methods/punctuation":58,"./methods/tag":60,"./paths":63,"./whitespace":64}],50:[function(_dereq_,module,exports){
'use strict';
//this is a not-well-thought-out way to reduce our dependence on `object===object` reference stuff
//generates a unique id for this term
//may need to change when the term really-transforms? not sure.

var uid = function uid(str) {
  var nums = '';
  for (var i = 0; i < 5; i++) {
    nums += parseInt(Math.random() * 9, 10);
  }
  return str + '-' + nums;
};
module.exports = uid;

},{}],51:[function(_dereq_,module,exports){
'use strict';

var addMethods = function addMethods(Term) {

  var methods = {
    toUpperCase: function toUpperCase() {
      this.text = this.text.toUpperCase();
      this.tag('#UpperCase', 'toUpperCase');
      return this;
    },
    toLowerCase: function toLowerCase() {
      this.text = this.text.toLowerCase();
      this.unTag('#TitleCase');
      this.unTag('#UpperCase');
      return this;
    },
    toTitleCase: function toTitleCase() {
      this.text = this.text.replace(/^[a-z]/, function (x) {
        return x.toUpperCase();
      });
      this.tag('#TitleCase', 'toTitleCase');
      return this;
    },
    //(camelCase() is handled in `./terms` )

    /** is it titlecased because it deserves it? Like a person's name? */
    needsTitleCase: function needsTitleCase() {
      var titleCases = ['Person', 'Place', 'Organization', 'Acronym', 'UpperCase', 'Currency', 'RomanNumeral', 'Month', 'WeekDay', 'Holiday', 'Demonym'];
      for (var i = 0; i < titleCases.length; i++) {
        if (this.tags[titleCases[i]]) {
          return true;
        }
      }
      //specific words that keep their titlecase
      //https://en.wikipedia.org/wiki/Capitonym
      var irregulars = ['i', 'god', 'allah'];
      for (var _i = 0; _i < irregulars.length; _i++) {
        if (this.normal === irregulars[_i]) {
          return true;
        }
      }
      return false;
    }
  };
  //hook them into result.proto
  Object.keys(methods).forEach(function (k) {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{}],52:[function(_dereq_,module,exports){
'use strict';

var killUnicode = _dereq_('./unicode');
var isAcronym = _dereq_('./isAcronym');

//some basic operations on a string to reduce noise
exports.normalize = function (str) {
  str = str || '';
  str = str.toLowerCase();
  str = str.trim();
  var original = str;
  //(very) rough asci transliteration -  bjŏrk -> bjork
  str = killUnicode(str);
  //hashtags, atmentions
  str = str.replace(/^[#@]/, '');
  // coerce single curly quotes
  str = str.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]+/g, '\'');
  // coerce double curly quotes
  str = str.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036"]+/g, '');
  //coerce unicode elipses
  str = str.replace(/\u2026/g, '...');
  //en-dash
  str = str.replace(/\u2013/g, '-');

  //strip leading & trailing grammatical punctuation
  if (/^[:;]/.test(str) === false) {
    str = str.replace(/\.{3,}$/g, '');
    str = str.replace(/['",\.!:;\?\)]$/g, '');
    str = str.replace(/^['"\(]/g, '');
  }
  //oh shucks,
  if (str === '') {
    str = original;
  }
  return str;
};

exports.addNormal = function (term) {
  var str = term._text || '';
  str = exports.normalize(str);
  //compact acronyms
  if (isAcronym(term._text)) {
    str = str.replace(/\./g, '');
  }
  //nice-numbers
  str = str.replace(/([0-9]),([0-9])/g, '$1$2');
  term.normal = str;
};

// console.log(normalize('Dr. V Cooper'));

},{"./isAcronym":53,"./unicode":54}],53:[function(_dereq_,module,exports){
'use strict';
//regs -

var periodAcronym = /([A-Z]\.)+[A-Z]?$/;
var oneLetterAcronym = /^[A-Z]\.$/;
var noPeriodAcronym = /[A-Z]{3}$/;

/** does it appear to be an acronym, like FBI or M.L.B. */
var isAcronym = function isAcronym(str) {
  //like N.D.A
  if (periodAcronym.test(str) === true) {
    return true;
  }
  //like 'F.'
  if (oneLetterAcronym.test(str) === true) {
    return true;
  }
  //like NDA
  if (noPeriodAcronym.test(str) === true) {
    return true;
  }
  return false;
};
module.exports = isAcronym;

},{}],54:[function(_dereq_,module,exports){
'use strict';

var noUmlaut = function noUmlaut(str) {
  // ä, ö and ü, ß
  str = str.replace(/\xE4/, 'ae');
  str = str.replace(/\xF6/, 'oe');
  str = str.replace(/\xFC/, 'ue');
  str = str.replace(/\xDF/, 'ss');
  return str;
};
module.exports = noUmlaut;

},{}],55:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('../../paths').fns;
var colors = {
  'Person': '#6393b9',
  'Pronoun': '#81acce',
  'Noun': 'steelblue',
  'Verb': 'palevioletred',
  'Adverb': '#f39c73',
  'Adjective': '#b3d3c6',
  'Determiner': '#d3c0b3',
  'Preposition': '#9794a8',
  'Conjunction': '#c8c9cf',
  'Value': 'palegoldenrod',
  'Expression': '#b3d3c6'
};

//a nicer logger for the client-side
var clientSide = function clientSide(t) {
  var color = 'silver';
  var tags = Object.keys(t.tags);
  for (var i = 0; i < tags.length; i++) {
    if (colors[tags[i]]) {
      color = colors[tags[i]];
      break;
    }
  }
  var word = fns.leftPad(t.text, 12);
  word += ' ' + tags;
  console.log('%c ' + word, 'color: ' + color);
};
module.exports = clientSide;

},{"../../paths":63}],56:[function(_dereq_,module,exports){
'use strict';

var renderHtml = _dereq_('./renderHtml');
var fns = _dereq_('../../paths').fns;
var clientDebug = _dereq_('./client');

var serverDebug = function serverDebug(t) {
  var tags = Object.keys(t.tags).map(function (tag) {
    return fns.printTag(tag);
  }).join(', ');
  var word = t.text;
  word = '\'' + fns.yellow(word || '-') + '\'';
  var silent = '';
  if (t.silent_term) {
    silent = '[' + t.silent_term + ']';
  }
  word = fns.leftPad(word, 25);
  word += fns.leftPad(silent, 5);
  console.log('   ' + word + '   ' + '     - ' + tags);
};

var methods = {
  /** a pixel-perfect reproduction of the input, with whitespace preserved */
  text: function text(r) {
    return r.whitespace.before + r._text + r.whitespace.after;
  },
  /** a lowercased, punctuation-cleaned, whitespace-trimmed version of the word */
  normal: function normal(r) {
    return r.normal;
  },
  /** even-more normalized than normal */
  root: function root(r) {
    return r.root || r.normal;
  },
  /** the &encoded term in a span element, with POS as classNames */
  html: function html(r) {
    return renderHtml(r);
  },
  /** a simplified response for Part-of-Speech tagging*/
  tags: function tags(r) {
    return {
      text: r.text,
      normal: r.normal,
      tags: Object.keys(r.tags)
    };
  },
  /** check-print information for the console */
  debug: function debug(t) {
    if (typeof window !== 'undefined') {
      clientDebug(t);
    } else {
      serverDebug(t);
    }
  }
};

var addMethods = function addMethods(Term) {
  //hook them into result.proto
  Term.prototype.out = function (fn) {
    if (!methods[fn]) {
      fn = 'text';
    }
    return methods[fn](this);
  };
  return Term;
};

module.exports = addMethods;

},{"../../paths":63,"./client":55,"./renderHtml":57}],57:[function(_dereq_,module,exports){
'use strict';
//turn xml special characters into apersand-encoding.
//i'm not sure this is perfectly safe.

var escapeHtml = function escapeHtml(s) {
  var HTML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    ' ': '&nbsp;'
  };
  return s.replace(/[<>&"' ]/g, function (ch) {
    return HTML_CHAR_MAP[ch];
  });
};

//remove html elements already in the text
//not tested!
//http://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side
var sanitize = function sanitize(html) {
  var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
  var tagOrComment = new RegExp('<(?:'
  // Comment body.
  + '!--(?:(?:-*[^->])*--+|-?)'
  // Special "raw text" elements whose content should be elided.
  + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
  // Regular name
  + '|/?[a-z]' + tagBody + ')>', 'gi');
  var oldHtml = void 0;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
};

//turn the term into ~properly~ formatted html
var renderHtml = function renderHtml(t) {
  var classes = Object.keys(t.tags).filter(function (tag) {
    return tag !== 'Term';
  });
  classes = classes.map(function (c) {
    return 'nl-' + c;
  });
  classes = classes.join(' ');
  var text = sanitize(t.text);
  text = escapeHtml(text);
  var el = '<span class="' + classes + '">' + text + '</span>';
  return escapeHtml(t.whitespace.before) + el + escapeHtml(t.whitespace.after);
};

module.exports = renderHtml;

},{}],58:[function(_dereq_,module,exports){
'use strict';

var endPunct = /([a-z])([,:;\/.(\.\.\.)\!\?]+)$/i;
var addMethods = function addMethods(Term) {

  var methods = {
    /** the punctuation at the end of this term*/
    endPunctuation: function endPunctuation() {
      var m = this.text.match(endPunct);
      if (m) {
        var allowed = {
          ',': 'comma',
          ':': 'colon',
          ';': 'semicolon',
          '.': 'period',
          '...': 'elipses',
          '!': 'exclamation',
          '?': 'question'
        };
        if (allowed[m[2]] !== undefined) {
          return m[2];
        }
      }
      return null;
    },
    setPunctuation: function setPunctuation(punct) {
      this.killPunctuation();
      this.text += punct;
      return this;
    },

    /** check if the term ends with a comma */
    hasComma: function hasComma() {
      if (this.endPunctuation() === 'comma') {
        return true;
      }
      return false;
    },

    killPunctuation: function killPunctuation() {
      this.text = this._text.replace(endPunct, '$1');
      return this;
    }
  };
  //hook them into result.proto
  Object.keys(methods).forEach(function (k) {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{}],59:[function(_dereq_,module,exports){
'use strict';

var path = _dereq_('../../paths');
var tagset = path.tags;

//recursively-check compatibility of this tag and term
var canBe = function canBe(term, tag) {
  //fail-fast
  if (tagset[tag] === undefined) {
    return true;
  }
  //loop through tag's contradictory tags
  var enemies = tagset[tag].enemy || [];
  for (var i = 0; i < enemies.length; i++) {
    if (term.tags[enemies[i]] === true) {
      return false;
    }
  }
  if (tagset[tag].is !== undefined) {
    return canBe(term, tagset[tag].is); //recursive
  }
  return true;
};

module.exports = canBe;

},{"../../paths":63}],60:[function(_dereq_,module,exports){
'use strict';

var setTag = _dereq_('./setTag');
var _unTag = _dereq_('./unTag');
var _canBe = _dereq_('./canBe');

//symbols used in sequential taggers which mean 'do nothing'
//.tag('#Person #Place . #City')
var ignore = {
  '.': true
};
var addMethods = function addMethods(Term) {

  var methods = {
    /** set the term as this part-of-speech */
    tag: function tag(_tag, reason) {
      if (ignore[_tag] !== true) {
        setTag(this, _tag, reason);
      }
    },
    /** remove this part-of-speech from the term*/
    unTag: function unTag(tag, reason) {
      if (ignore[tag] !== true) {
        _unTag(this, tag, reason);
      }
    },
    /** is this tag compatible with this word */
    canBe: function canBe(tag) {
      tag = tag || '';
      if (typeof tag === 'string') {
        //everything can be '.'
        if (ignore[tag] === true) {
          return true;
        }
        tag = tag.replace(/^#/, '');
      }
      return _canBe(this, tag);
    }
  };

  //hook them into term.prototype
  Object.keys(methods).forEach(function (k) {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{"./canBe":59,"./setTag":61,"./unTag":62}],61:[function(_dereq_,module,exports){
'use strict';
//set a term as a particular Part-of-speech

var path = _dereq_('../../paths');
var log = path.log;
var fns = path.fns;
var unTag = _dereq_('./unTag');
// const tagset = path.tags;
var tagset = _dereq_('../../../tagset');

var putTag = function putTag(term, tag, reason) {
  tag = tag.replace(/^#/, '');
  //already got this
  if (term.tags[tag] === true) {
    return;
  }
  term.tags[tag] = true;
  log.tag(term, tag, reason);

  //extra logic per-each POS
  if (tagset[tag]) {
    //drop any conflicting tags
    var enemies = tagset[tag].enemy;
    for (var i = 0; i < enemies.length; i++) {
      if (term.tags[enemies[i]] === true) {
        unTag(term, enemies[i], reason);
      }
    }
    //apply implicit tags
    if (tagset[tag].is) {
      tagset[tag].is.forEach(function (doAlso) {
        if (term.tags[doAlso] !== true) {
          putTag(term, doAlso, ' --> ' + tag); //recursive
        }
      });
    }
  }
};

//give term this tag
var wrap = function wrap(term, tag, reason) {
  if (!term || !tag) {
    return;
  }
  //handle multiple tags
  if (fns.isArray(tag)) {
    tag.forEach(function (t) {
      return putTag(term, t, reason);
    }); //recursive
    return;
  }
  putTag(term, tag, reason);
  //add 'extra' tag (for some special tags)
  if (tagset[tag] && tagset[tag].also !== undefined) {
    putTag(term, tagset[tag].also, reason);
  }
};

module.exports = wrap;

},{"../../../tagset":48,"../../paths":63,"./unTag":62}],62:[function(_dereq_,module,exports){
'use strict';
//set a term as a particular Part-of-speech

var path = _dereq_('../../paths');
var log = path.log;
var tagset = path.tags;

//remove a tag from a term
var unTag = function unTag(term, tag, reason) {
  if (term.tags[tag]) {
    log.unTag(term, tag, reason);
    delete term.tags[tag];

    //delete downstream tags too
    if (tagset[tag]) {
      var also = tagset[tag].is;
      for (var i = 0; i < also.length; i++) {
        unTag(term, also[i], ' - -   - ');
      }
    }
  }
};

var wrap = function wrap(term, tag, reason) {
  if (!term || !tag) {
    return;
  }
  //support '*' flag - remove all-tags
  if (tag === '*') {
    term.tags = {};
    return;
  }
  //remove this tag
  unTag(term, tag, reason);
  return;
};
module.exports = wrap;

},{"../../paths":63}],63:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  fns: _dereq_('../fns'),
  log: _dereq_('../log'),
  tags: _dereq_('../tagset')
};

},{"../fns":2,"../log":5,"../tagset":48}],64:[function(_dereq_,module,exports){
'use strict';
//punctuation regs-

var before = /^(\s|-+|\.\.+)+/;
var minusNumber = /^( *)-(\$|€|¥|£)?([0-9])/;
var after = /(\s+|-+|\.\.+)$/;

//seperate the 'meat' from the trailing/leading whitespace.
//works in concert with ./src/result/tokenize.js
var build_whitespace = function build_whitespace(str) {
  var whitespace = {
    before: '',
    after: ''
  };
  //get before punctuation/whitespace
  //mangle 'far - fetched', but don't mangle '-2'
  var m = str.match(minusNumber);
  if (m !== null) {
    whitespace.before = m[1];
    str = str.replace(/^ */, '');
  } else {
    m = str.match(before);
    if (m !== null) {
      whitespace.before = str.match(before)[0];
      str = str.replace(before, '');
    }
  }
  //get after punctuation/whitespace
  m = str.match(after);
  if (m !== null) {
    str = str.replace(after, '');
    whitespace.after = m[0];
  }
  return {
    whitespace: whitespace,
    text: str
  };
};
module.exports = build_whitespace;

},{}],65:[function(_dereq_,module,exports){
'use strict';

var Term = _dereq_('../term');
var hasHyphen = /^([a-z]+)(-)([a-z0-9].*)/i;
var wordlike = /\S/;

var notWord = {
  '-': true,
  '–': true,
  '--': true,
  '...': true
};

//turn a string into an array of terms (naiive for now, lumped later)
var fromString = function fromString(str) {
  var result = [];
  var arr = [];
  //start with a naiive split
  str = str || '';
  if (typeof str === 'number') {
    str = '' + str;
  }
  var firstSplit = str.split(/(\S+)/);
  for (var i = 0; i < firstSplit.length; i++) {
    var word = firstSplit[i];
    if (hasHyphen.test(word) === true) {
      //support multiple-hyphenated-terms
      var hyphens = word.split('-');
      for (var o = 0; o < hyphens.length; o++) {
        if (o === hyphens.length - 1) {
          arr.push(hyphens[o]);
        } else {
          arr.push(hyphens[o] + '-');
        }
      }
    } else {
      arr.push(word);
    }
  }
  //greedy merge whitespace+arr to the right
  var carry = '';
  for (var _i = 0; _i < arr.length; _i++) {
    //if it's more than a whitespace
    if (wordlike.test(arr[_i]) === true && notWord[arr[_i]] === undefined) {
      result.push(carry + arr[_i]);
      carry = '';
    } else {
      carry += arr[_i];
    }
  }
  //handle last one
  if (carry && result.length > 0) {
    result[result.length - 1] += carry; //put it on the end
  }
  return result.map(function (t) {
    return new Term(t);
  });
};
module.exports = fromString;

},{"../term":49}],66:[function(_dereq_,module,exports){
'use strict';

//getters/setters for the Terms class

module.exports = {

  parent: {
    get: function get() {
      return this.refText || this;
    },
    set: function set(r) {
      this.refText = r;
      return this;
    }
  },

  parentTerms: {
    get: function get() {
      return this.refTerms || this;
    },
    set: function set(r) {
      this.refTerms = r;
      return this;
    }
  },

  dirty: {
    get: function get() {
      for (var i = 0; i < this.terms.length; i++) {
        if (this.terms[i].dirty === true) {
          return true;
        }
      }
      return false;
    },
    set: function set(dirt) {
      this.terms.forEach(function (t) {
        t.dirty = dirt;
      });
    }
  },

  refTerms: {
    get: function get() {
      return this._refTerms || this;
    },
    set: function set(ts) {
      this._refTerms = ts;
      return this;
    }
  },
  found: {
    get: function get() {
      return this.terms.length > 0;
    }
  },
  length: {
    get: function get() {
      return this.terms.length;
    }
  },
  isA: {
    get: function get() {
      return 'Terms';
    }
  },
  whitespace: {
    get: function get() {
      var _this = this;

      return {
        before: function before(str) {
          _this.firstTerm().whitespace.before = str;
          return _this;
        },
        after: function after(str) {
          _this.lastTerm().whitespace.after = str;
          return _this;
        }
      };
    }
  }

};

},{}],67:[function(_dereq_,module,exports){
'use strict';

var build = _dereq_('./build');
var getters = _dereq_('./getters');
var tagger = _dereq_('../tagger');

//Terms is an array of Term objects, and methods that wrap around them
var Terms = function Terms(arr, lexicon, refText, refTerms) {
  var _this = this;

  this.terms = arr;
  this.lexicon = lexicon;
  this.refText = refText;
  this._refTerms = refTerms;
  this.count = undefined;
  this.get = function (n) {
    return _this.terms[n];
  };
  //apply getters
  var keys = Object.keys(getters);
  for (var i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], getters[keys[i]]);
  }
};

Terms.prototype.tagger = function () {
  return tagger(this);
};

_dereq_('./methods/misc')(Terms);
_dereq_('./methods/out')(Terms);
_dereq_('./methods/loops')(Terms);

Terms.fromString = function (str, lexicon) {
  var termArr = build(str);
  var ts = new Terms(termArr, lexicon, null);
  //give each term a reference to this ts
  ts.terms.forEach(function (t) {
    t.parentTerms = ts;
  });
  return ts;
};
module.exports = Terms;

},{"../tagger":21,"./build":65,"./getters":66,"./methods/loops":68,"./methods/misc":69,"./methods/out":70}],68:[function(_dereq_,module,exports){
'use strict';
//these methods are simply term-methods called in a loop

var addMethods = function addMethods(Terms) {

  var foreach = [['tag'], ['unTag'], ['canBe'], ['toUpperCase', 'UpperCase'], ['toLowerCase'], ['toTitleCase', 'TitleCase']];

  foreach.forEach(function (arr) {
    var k = arr[0];
    var tag = arr[1];
    var myFn = function myFn() {
      var args = arguments;
      this.terms.forEach(function (t) {
        t[k].apply(t, args);
      });
      if (tag) {
        this.tag(tag, k);
      }
      return this;
    };
    Terms.prototype[k] = myFn;
  });
  return Terms;
};

module.exports = addMethods;

},{}],69:[function(_dereq_,module,exports){
'use strict';

var miscMethods = function miscMethods(Terms) {

  var methods = {

    firstTerm: function firstTerm() {
      return this.terms[0];
    },
    lastTerm: function lastTerm() {
      return this.terms[this.terms.length - 1];
    },
    all: function all() {
      return this.parent;
    },
    data: function data() {
      return {
        text: this.out('text'),
        normal: this.out('normal')
      };
    },
    term: function term(n) {
      return this.terms[n];
    },
    first: function first() {
      var t = this.terms[0];
      return new Terms([t], this.lexicon, this.refText, this.refTerms);
    },
    last: function last() {
      var t = this.terms[this.terms.length - 1];
      return new Terms([t], this.lexicon, this.refText, this.refTerms);
    },
    slice: function slice(start, end) {
      var terms = this.terms.slice(start, end);
      return new Terms(terms, this.lexicon, this.refText, this.refTerms);
    },
    endPunctuation: function endPunctuation() {
      return this.last().terms[0].endPunctuation();
    },
    index: function index() {
      var parent = this.parentTerms;
      var first = this.terms[0];
      if (!parent || !first) {
        return null; //maybe..
      }
      for (var i = 0; i < parent.terms.length; i++) {
        if (first === parent.terms[i]) {
          return i;
        }
      }
      return null;
    },
    termIndex: function termIndex() {
      var first = this.terms[0];
      var ref = this.refText || this;
      if (!ref || !first) {
        return null; //maybe..
      }
      var n = 0;
      for (var i = 0; i < ref.list.length; i++) {
        var ts = ref.list[i];
        for (var o = 0; o < ts.terms.length; o++) {
          if (ts.terms[o] === first) {
            return n;
          }
          n += 1;
        }
      }
      return n;
    },
    //number of characters in this match
    chars: function chars() {
      return this.terms.reduce(function (i, t) {
        i += t.whitespace.before.length;
        i += t.text.length;
        i += t.whitespace.after.length;
        return i;
      }, 0);
    },
    //just .length
    wordCount: function wordCount() {
      return this.terms.length;
    },

    //this has term-order logic, so has to be here
    toCamelCase: function toCamelCase() {
      this.toTitleCase();
      this.terms.forEach(function (t, i) {
        if (i !== 0) {
          t.whitespace.before = '';
        }
        t.whitespace.after = '';
      });
      this.tag('#CamelCase', 'toCamelCase');
      return this;
    }
  };

  //hook them into result.proto
  Object.keys(methods).forEach(function (k) {
    Terms.prototype[k] = methods[k];
  });
  return Terms;
};

module.exports = miscMethods;

},{}],70:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('../paths').fns;

var methods = {
  text: function text(ts) {
    return ts.terms.reduce(function (str, t) {
      str += t.out('text');
      return str;
    }, '');
  },

  normal: function normal(ts) {
    var terms = ts.terms.filter(function (t) {
      return t.text;
    });
    terms = terms.map(function (t) {
      return t.normal; //+ punct;
    });
    return terms.join(' ');
  },

  grid: function grid(ts) {
    var str = '  ';
    str += ts.terms.reduce(function (s, t) {
      s += fns.leftPad(t.text, 11);
      return s;
    }, '');
    return str + '\n\n';
  },

  color: function color(ts) {
    return ts.terms.reduce(function (s, t) {
      s += fns.printTerm(t);
      return s;
    }, '');
  },
  csv: function csv(ts) {
    return ts.terms.map(function (t) {
      return t.normal.replace(/,/g, '');
    }).join(',');
  },

  newlines: function newlines(ts) {
    return ts.terms.reduce(function (str, t) {
      str += t.out('text').replace(/\n/g, ' ');
      return str;
    }, '').replace(/^\s/, '');
  },
  /** no punctuation, fancy business **/
  root: function root(ts) {
    return ts.terms.filter(function (t) {
      return t.text;
    }).map(function (t) {
      return t.root;
    }).join(' ').toLowerCase();
  },

  html: function html(ts) {
    return ts.terms.map(function (t) {
      return t.render.html();
    }).join(' ');
  },
  debug: function debug(ts) {
    ts.terms.forEach(function (t) {
      t.out('debug');
    });
  }
};
methods.plaintext = methods.text;
methods.normalize = methods.normal;
methods.normalized = methods.normal;
methods.colors = methods.color;
methods.tags = methods.terms;

var renderMethods = function renderMethods(Terms) {
  Terms.prototype.out = function (str) {
    if (methods[str]) {
      return methods[str](this);
    }
    return methods.text(this);
  };
  //check method
  Terms.prototype.debug = function () {
    return methods.debug(this);
  };
  return Terms;
};

module.exports = renderMethods;

},{"../paths":71}],71:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  fns: _dereq_('../fns'),
  Term: _dereq_('../term')
};

},{"../fns":2,"../term":49}]},{},[3])(3)
});