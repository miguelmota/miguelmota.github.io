# Machine Learning

field of study that gives comptuers thte ability to learn withou being explicitly progarmmed
modern def: well-posed learning problem: a computer pogram is said to learn from experience E with respect to some task T and some performance on T, as mesured by P, improves with experience E.

Task: classifying email as spam or not
Experience: watching you label hundreds of emails as spam or not
Performance measure: number of correctly classifying as spam or not

Supervised learning:
right answers given
Regression: Predict continous valued output

Unsupervised learning: give algorithm ton of data, and tell it to find structure
-does clustering of data to find pattern
  ex. social network analyis (friend connections), customer into different market segments, astronomical data analysis, group news stories by topic
-cocktail party problem
 -multiple people talking
 -algorithm to filter
 code:
   [W,s,v] = svd((repmat(sum(x.*x,1),size(x,1),1).*x)*x');    ***

use octave program to prototype algorithms

Linear Regression
Notation:
  m = number of training examples
  x's = "input" variable/feature
  y's = "output" variable/"target" variable

 (x,y) = one training example

            Training Set
               |
            learning algorithm
               |
size
of    -> h (hypothesis) -> estimated price
house

h maps from x's to y's

h represented as h(subtheta)(x) = theta(sub0) + theta(sub1)x


----------

Data
data consists of *data instances* (think of rows in db)
data instances are reprented as *feature vectors* (cell = feature) (think of columns)
features are chosen for a specific task at hand
-
Machine Learning is about *generalization*
-making sense of *existing* data
 "our data consists of 26 coherent groups"
and then make predictions about *new* data instances
 "this data instance belongs to group #5"

 Machine Learning consists of
 - Classification
 - Clustering
 - Regression (ranking?)
 classification and clustering look similar but the technology is different
 classification and regression look different but the technology is similar

 Classification
 Training phsase
 - input: data and their true *labels*
 - output: the "classication model" aka "classifier"
 Testing (a model application) phase
 - input: data instance
 - output: label
 Where do we labled instances?
 - eg. clickthrough data ('implicit feedback')
- crowdsource
 eg. Mechanical Turk, Samasource
Beware
 - data quality issues
 - data skewness
   eg. more linkedin recommendations != more important

k-nearest neighbors classifier
Support Vectort Machine (SVM)
  -maximum margin classifier
  -svm is good for non-linear classifier
  - used when thre is not too much training data
  - when the data has a geometric interpretation

Decision Trees
- question -> (yes,no)

Selecting the right Features is very important. Good features -> machine learning investment

Logistic Regression
A classification method, not a regression method
Formula:
  p = probability, C = coefficients, C1 = position, C2 = negative

    p(good at basketball)
log -------------------- ~ C1 * height + C2 * weight
    p(bad at basketball)

machine learning comes in for learning the coefficients

Logistic Regression
- when the number of fetures is small
  - the model will tell which features are important
- it's relatively fast


Clustering
- build coherent groups of data instances
  - coherence is not well defined
k-means clustering
 - centroids
eg. cluster 100k product reviews by topic, then by negative or positive

--------
Vector: a point in a space

Supervised learning: generates a function based upon assigned label that map inputs to desired outputs.
 - Regression, SVM, text classification

Unsupervised learning: Looks for partterns native to a dataset, and models it like clustering. (eg data mining and knowledge discovery)
 - k-means, Gaussian mixture model, image feature tracking, independent of labeling

Reinforcement learning: learns how to act given reward (or punishment) from the world.
 - Markov Design process, Dynamic Programming, Path finding


 -------------
 k-means - finding k
 silhoutte coefficient: take a point and calculate ratio of distance from all other points, divided by distance to nearest point not in cluster. highest coefficient = best k
