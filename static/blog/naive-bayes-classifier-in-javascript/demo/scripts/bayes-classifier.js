(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var stemmer = require('./stemmers/porter');

/**
 * Terminology
 *
 * label: refers to class, since `class` is a reserved word.
 * doc: refers to document, since `document` is a reserved word.
 * feature: a token (word) in the bag of words (document).
 */

/**
 * BayesClassifier
 * @desc Bayes classifier constructor
 * @constructor
 * @return Bayes classifier instance
 */
function BayesClassifier() {
  /*
   * Create a new instance when not using the `new` keyword.
   */
  if (!(this instanceof BayesClassifier)) {
    return new BayesClassifier();
  }

  /*
   * The stemmer provides tokenization methods.
   * It breaks the doc into words (tokens) and takes the
   * stem of each word. A stem is a form to which affixes can be attached.
   */
  this.stemmer = stemmer;

  /*
   * A collection of added documents
   * Each document is an object containing the class, and array of tokenized strings.
   */
  this.docs = [];

  /*
   * Index of last added document.
   */
  this.lastAdded = 0;

  /*
   * A map of every class features.
   */
  this.features = {};

  /*
   * A map containing each class and associated features.
   * Each class has a map containing a feature index and the count of feature appearances for that class.
   */
  this.classFeatures = {};

  /*
   * Keep track of how many features in each class.
   */
  this.classTotals = {};

  /*
   * Number of examples trained
   */
  this.totalExamples = 1;

  /* Additive smoothing to eliminate zeros when summing features,
   * in cases where no features are found in the document.
   * Used as a fail-safe to always return a class.
   * http://en.wikipedia.org/wiki/Additive_smoothing
   */
  this.smoothing = 1;
}

/**
 * AddDocument
 * @param {array} doc - document
 * @param {string} label - class
 * @return {object} - Bayes classifier instance
 */
BayesClassifier.prototype.addDocument = function(doc, label) {
  if (!this._size(doc)) {
    return;
  }

  if (this._isString(doc)) {
    doc = this.stemmer.tokenizeAndStem(doc);
  }

  var docObj = {
    label: label,
    value: doc
  };

  this.docs.push(docObj);

  // Add token (feature) to features map
  for (var i = 0; i < doc.length; i++) {
    this.features[doc[i]] = 1;
  }

};

/**
 * AddDocuments
 * @param {array} docs - documents
 * @param {string} label - class
 * @return {object} - Bayes classifier instance
 */
BayesClassifier.prototype.addDocuments = function(docs, label) {
  for (var i = 0; i < docs.length; i++) {
    this.addDocument(docs[i], label);
  }
};

/**
 * docToFeatures
 *
 * @desc
 * Returns an array with 1's or 0 for each feature in document
 * A 1 if feature is in document
 * A 0 if feature is not in document
 *
 * @param {string|array} doc - document
 * @return {array} features
 */
BayesClassifier.prototype.docToFeatures = function(doc) {
  var features = [];

  if (this._isString(doc)) {
    doc = this.stemmer.tokenizeAndStem(doc);
  }

  for (var feature in this.features) {
    features.push(Number(!!~doc.indexOf(feature)));
  }

  return features;
};

/**
 * classify
 * @desc returns class for document
 * @param {string} doc - document
 * @return {string} class
 */
BayesClassifier.prototype.classify = function(doc) {
  var classifications = this.getClassifications(doc);
  if (!this._size(classifications)) {
    throw 'Not trained';
  }
  return classifications[0].label;
};

/**
 * train
 * @desc train the classifier on the added documents.
 * @return {object} - Bayes classifier instance
 */
BayesClassifier.prototype.train = function() {
  var totalDocs = this.docs.length;
  for (var i = this.lastAdded; i < totalDocs; i++) {
    var features = this.docToFeatures(this.docs[i].value);
    this.addExample(features, this.docs[i].label);
    this.lastAdded++;
  }
};

/**
 * addExample
 * @desc Increment the counter of each feature for each class.
 * @param {array} docFeatures
 * @param {string} label - class
 * @return {object} - Bayes classifier instance
 */
BayesClassifier.prototype.addExample = function(docFeatures, label) {
  if (!this.classFeatures[label]) {
    this.classFeatures[label] = {};
    this.classTotals[label] = 1;
  }

  this.totalExamples++;

  if (this._isArray(docFeatures)) {
    var i = docFeatures.length;
    this.classTotals[label]++;

    while(i--) {
      if (docFeatures[i]) {
        if (this.classFeatures[label][i]) {
          this.classFeatures[label][i]++;
        } else {
          this.classFeatures[label][i] = 1 + this.smoothing;
        }
      }
    }
  } else {
    for (var key in docFeatures) {
      value = docFeatures[key];

      if (this.classFeatures[label][value]) {
        this.classFeatures[label][value]++;
      } else {
        this.classFeatures[label][value] = 1 + this.smoothing;
      }
    }
  }
};

/**
 * probabilityOfClass
 * @param {array|string} docFeatures - document features
 * @param {string} label - class
 * @return probability;
 * @desc
 * calculate the probability of class for the document.
 *
 * Algorithm source
 * http://en.wikipedia.org/wiki/Naive_Bayes_classifier
 *
 * P(c|d) = P(c)P(d|c)
 *          ---------
 *             P(d)
 *
 * P = probability
 * c = class
 * d = document
 *
 * P(c|d) = Likelyhood(class given the document)
 * P(d|c) = Likelyhood(document given the classes).
 *     same as P(x1,x2,...,xn|c) - document `d` represented as features `x1,x2,...xn`
 * P(c) = Likelyhood(class)
 * P(d) = Likelyhood(document)
 *
 * rewritten in plain english:
 *
 * posterior = prior x likelyhood
 *             ------------------
 *                evidence
 *
 * The denominator can be dropped because it is a constant. For example,
 * if we have one document and 10 classes and only one class can classify
 * document, the probability of the document is the same.
 *
 * The final equation looks like this:
 * P(c|d) = P(c)P(d|c)
 */
BayesClassifier.prototype.probabilityOfClass = function(docFeatures, label) {
  var count = 0;
  var prob = 0;

  if (this._isArray(docFeatures)) {
    var i = docFeatures.length;

    // Iterate though each feature in document.
    while(i--) {
      // Proceed if feature collection.
      if (docFeatures[i]) {
        /*
         * The number of occurances of the document feature in class.
         */
        count = this.classFeatures[label][i] || this.smoothing;

        /* This is the `P(d|c)` part of the formula.
         * How often the class occurs. We simply count the relative
         * feature frequencies in the corpus (document body).
         *
         * We divide the count by the total number of features for the class,
         * and add it to the probability total.
         * We're using Natural Logarithm here to prevent Arithmetic Underflow
         * http://en.wikipedia.org/wiki/Arithmetic_underflow
         */
        prob += Math.log(count / this.classTotals[label]);
      }
    }
  } else {
    for (var key in docFeatures) {
      count = this.classFeatures[label][docFeatures[key]] || this.smoothing;
      prob += Math.log(count / this.classTotals[label]);
    }
  }

  /*
   * This is the `P(c)` part of the formula.
   *
   * Divide the the total number of features in class by total number of all features.
   */
  var featureRatio = (this.classTotals[label] / this.totalExamples);

  /**
   * probability of class given document = P(d|c)P(c)
   */
  prob = featureRatio * Math.exp(prob);

  return prob;
};

/**
 * getClassifications
 * @desc Return array of document classes their probability values.
 * @param {string} doc - document
 * @return classification ordered by highest probability.
 */
BayesClassifier.prototype.getClassifications = function(doc) {
  var classifier = this;
  var labels = [];

  for (var className in this.classFeatures) {
    labels.push({
      label: className,
      value: classifier.probabilityOfClass(this.docToFeatures(doc), className)
    });
  }

  return labels.sort(function(x, y) {
    return y.value - x.value;
  });
};

/*
 * Helper utils
 */
BayesClassifier.prototype._isString = function(s) {
  return typeof(s) === 'string' || s instanceof String;
};

BayesClassifier.prototype._isArray = function(s) {
  return Array.isArray(s);
};

BayesClassifier.prototype._isObject = function(s) {
  return typeof(s) === 'object' || s instanceof Object;
};

BayesClassifier.prototype._size = function(s) {
  if (this._isArray(s) || this._isString(s) || this._isObject(s)) {
    return s.length;
  }
  return 0;
};

// For Browserify build
if (typeof window !== 'undefined') {
  window.BayesClassifier = BayesClassifier;
}

/*
 * Export constructor
 */
module.exports = BayesClassifier;

},{"./stemmers/porter":2}],2:[function(require,module,exports){
/*
 * @credit: https://github.com/NaturalNode/natural/blob/master/lib/natural/stemmers/porter_stemmer.js
 */

/*
  Copyright (c) 2011, Chris Umbel
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

// Denote groups of consecutive consonants with a C and consecutive vowels
// with a V.
function categorizeGroups(token) {
  return token.replace(/[^aeiou]+/g, 'C').replace(/[aeiouy]+/g, 'V');
}

// Denote single consonants with a C and single vowels with a V
function categorizeChars(token) {
  return token.replace(/[^aeiou]/g, 'C').replace(/[aeiouy]/g, 'V');
}

// Calculate the "measure" M of a word. M is the count of VC sequences dropping
// an initial C if it exists and a trailing V if it exists.
function measure(token) {
  if(!token)
    return -1;

  return categorizeGroups(token).replace(/^C/, '').replace(/V$/, '').length / 2;
}

// Determine if a token end with a double consonant i.e. happ
function endsWithDoublCons(token) {
  return token.match(/([^aeiou])\1$/);
}

// Replace a pattern in a word. if a replacement occurs an optional callback
// can be called to post-process the result. if no match is made NULL is
// returned.
function attemptReplace(token, pattern, replacement, callback) {
  var result = null;

  if((typeof pattern == 'string') && token.substr(0 - pattern.length) == pattern)
    result = token.replace(new RegExp(pattern + '$'), replacement);
  else if((pattern instanceof RegExp) && token.match(pattern))
    result = token.replace(pattern, replacement);

  if(result && callback)
    return callback(result);
  else
    return result;
}

// Attempt to replace a list of patterns/replacements on a token for a minimum
// measure M.
function attemptReplacePatterns(token, replacements, measureThreshold) {
  var replacement = null;

  for(var i = 0; i < replacements.length; i++) {
    if(!measureThreshold || measure(attemptReplace(token, replacements[i][0], '')) > measureThreshold)
      replacement = attemptReplace(token, replacements[i][0], replacements[i][1]);

    if(replacement)
      break;
  }

  return replacement;
}

// Replace a list of patterns/replacements on a word. if no match is made return
// the original token.
function replacePatterns(token, replacements, measureThreshold) {
  var result = attemptReplacePatterns(token, replacements, measureThreshold);
  token = !result ? token : result;
  return token;
}

// Step 1a as defined for the porter stemmer algorithm.
function step1a(token) {
  if(token.match(/(ss|i)es$/))
    return token.replace(/(ss|i)es$/, '$1');

  if(token.substr(-1) == 's' && token.substr(-2, 1) != 's' && token.length > 3)
    return token.replace(/s?$/, '');

  return token;
}

// Step 1b as defined for the porter stemmer algorithm.
function step1b(token) {
  if(token.substr(-3) == 'eed') {
    if(measure(token.substr(0, token.length - 3)) > 0)
      return token.replace(/eed$/, 'ee');
  } else {
    var result = attemptReplace(token, /ed|ing$/, '', function(token) {
      if(categorizeGroups(token).indexOf('V') >= 0) {
        var result = attemptReplacePatterns(token, [['at', 'ate'],  ['bl', 'ble'], ['iz', 'ize']]);
        if(result)
          return result;
        else {
          if(endsWithDoublCons(token) && token.match(/[^lsz]$/))
            return token.replace(/([^aeiou])\1$/, '$1');

          if(measure(token) == 1 && categorizeChars(token).substr(-3) == 'CVC' && token.match(/[^wxy]$/))
            return token + 'e';
        }

        return token;
      }

      return null;
    });

    if(result)
      return result;
  }

  return token;
}

// Step 1c as defined for the porter stemmer algorithm.
function step1c(token) {
  if(categorizeGroups(token).substr(-2, 1) == 'V') {
    if(token.substr(-1) == 'y')
      return token.replace(/y$/, 'i');
  }

  return token;
}

// Step 2 as defined for the porter stemmer algorithm.
function step2(token) {
  return replacePatterns(token, [['ational', 'ate'], ['tional', 'tion'], ['enci', 'ence'], ['anci', 'ance'],
    ['izer', 'ize'], ['abli', 'able'], ['alli', 'al'], ['entli', 'ent'], ['eli', 'e'],
    ['ousli', 'ous'], ['ization', 'ize'], ['ation', 'ate'], ['ator', 'ate'],['alism', 'al'],
    ['iveness', 'ive'], ['fulness', 'ful'], ['ousness', 'ous'], ['aliti', 'al'],
  ['iviti', 'ive'], ['biliti', 'ble']], 0);
}

// Step 3 as defined for the porter stemmer algorithm.
function step3(token) {
  return replacePatterns(token, [['icate', 'ic'], ['ative', ''], ['alize', 'al'],
  ['iciti', 'ic'], ['ical', 'ic'], ['ful', ''], ['ness', '']], 0);
}

// Step 4 as defined for the porter stemmer algorithm.
function step4(token) {
  return replacePatterns(token, [['al', ''], ['ance', ''], ['ence', ''], ['er', ''],
    ['ic', ''], ['able', ''], ['ible', ''], ['ant', ''],
    ['ement', ''], ['ment', ''], ['ent', ''], [/([st])ion/, '$1'], ['ou', ''], ['ism', ''],
    ['ate', ''], ['iti', ''], ['ous', ''], ['ive', ''],
  ['ize', '']], 1);
}

// Step 5a as defined for the porter stemmer algorithm.
function step5a(token) {
  var m = measure(token);

  if(token.length > 3 && ((m > 1 && token.substr(-1) == 'e') || (m == 1 && !(categorizeChars(token).substr(-4, 3) == 'CVC' && token.match(/[^wxy].$/)))))
    return token.replace(/e$/, '');

  return token;
}

// Step 5b as defined for the porter stemmer algorithm.
function step5b(token) {
  if(measure(token) > 1) {
    if(endsWithDoublCons(token) && token.substr(-2) == 'll')
      return token.replace(/ll$/, 'l');
  }

  return token;
}

var Tokenizer = function() {

};

// List of commonly used words that have little meaning to be excluded from analysis.
Tokenizer.stopwords = [
  'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
  'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
  'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
  'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
  'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
  'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '$', '1',
  '2', '3', '4', '5', '6', '7', '8', '9', '0', '_'
];

Tokenizer.prototype.trim = function(array) {
  while (array[array.length - 1] === '')
    array.pop();

  while (array[0] === '')
    array.shift();

  return array;
};

Tokenizer.prototype.tokenize = function(text) {
  // Break a string up into an array of tokens by anything non-word
  return this.trim(text.split(/\W+/));
};

var Stemmer = function() {

};

// perform full stemming algorithm on a single word
Stemmer.prototype.stem = function(token) {
  return step5b(step5a(step4(step3(step2(step1c(step1b(step1a(token.toLowerCase())))))))).toString();
};

Stemmer.prototype.addStopWord = function(stopWord) {
  Tokenizer.stopwords.push(stopWord);
};

Stemmer.prototype.addStopWords = function(moreStopWords) {
  Tokenizer.stopwords = Tokenizer.stopwords.concat(moreStopWords);
};

Stemmer.prototype.tokenizeAndStem = function(text, keepStops) {
  var stemmedTokens = [];

  new Tokenizer().tokenize(text).forEach(function(token) {
    if(keepStops || Tokenizer.stopwords.indexOf(token) == -1)
      stemmedTokens.push(this.stem(token));
  }.bind(this));

  return stemmedTokens;
};

module.exports = new Stemmer();

},{}]},{},[1]);
