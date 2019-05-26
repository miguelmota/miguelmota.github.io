var $ = document;

var classifier = new BayesClassifier();

var form = $.querySelector('.train-document-form');
var doc = form.querySelector('.document');
var label = form.querySelector('.label');
var train = $.querySelector('.train');
var trainedDocs = $.querySelector('.trained-documents');
var trainedDocsTitle = $.querySelector('.trained-documents-title');

var classifyForm = $.querySelector('.classify-document-form');
var classifyDoc = classifyForm.querySelector('.document');
var classifyOutput = $.querySelector('.classify-output');

form.onsubmit = function(e) {
  e.preventDefault();
  classifier.addDocument(doc.value, label.value);
  var text = $.createTextNode(doc.value + ' => ' + label.value);
  var div = $.createElement('div');
  div.appendChild(text);
  trainedDocs.appendChild(div);
  train.style.display = 'block';
  trainedDocs.style.display = 'block';
  this.reset();
};

train.onclick = function(e) {
  e.preventDefault();
  classifier.train();

  form.style.display = 'none';
  train.style.display = 'none';
  classifyForm.style.display = 'block';
  trainedDocsTitle.textContent = 'Trained documents:';
};

classifyForm.onsubmit = function(e) {
  e.preventDefault();
  var label = classifier.classify(classifyDoc.value);

  var text = $.createTextNode(classifyDoc.value + ' => ' + label);
  var div = $.createElement('div');
  div.appendChild(text);
  classifyOutput.appendChild(div);
  classifyOutput.style.display = 'block';
  this.reset();
};
