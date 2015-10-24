
http://chrisnatale.info/markov-models-in-javascript-part-i-an-observable-markov-chain/


1. Markov Model
A stochastic model that assumes the Markov Property.
What is the Markov Property?
The conditional probability distribution of the future states depend only upon the present state. That is, given the present, the future does not depend on the past.

Markov chain aka Observable Markov Model/Process (OMM)

//copied
OMM is a way of estimating the probablity of  a future series of events using only the previous events for each item in the series as inference

// c
if data structure exhibits this behavior, we can say it possesses the Markov Property

http://techeffigytutorials.blogspot.com/2015/01/markov-chains-explained.html
Markov Table, table of probablilites

state    nextstate prob
cloudy   cloudy    0.1
clou     rain     0.5
cloudy   sunny    0.4
rain     cloudy   0.3
rain     rain     0.6
rain    sunny    0.1
sunny    cloudy  0.4
sunny   rain     0.1
sunny   sunny    0.5

Transition Matrix

 C    R   S
C .1 .5  .4
R .3 .6  .1
S .4 .1  .5

it is memorieless, the next state only relies on the previous state.



// rows of P sum to 1 and are nonnegative, it is a "stochastic matrix"
  var transitionMatrix = [
    [0.9, 0.1],
    [0.5, 0.5]
  ];



"states" are categories.
can only be in one, never both or none.
can remain or move states.

markov chains are a combination of probablity and matrix operations

it's a series of probablity trees, you can do 5 10 etc steps into the future
we can find the probability of being in a state in the future, the power of markov chains

                  TO
             state1 state2
      state1
FROM  state2

insurance
high risk , low risk
H->H 6
H->L 4
L->H 15
L-> 85

10% chnace high risk, 90 low based on data. "come through the door" initial state
[.1 .9] initial state vector

probablity that a new customer will be in LOW RISK after on year?
stituaion 1: customer enters high risk and move to low risk = .04
sit 2: cust enter low risk and remains low risk: 0.85 * 0.9= .765
add both = .805 after 1 year
                     H    L
[.1 .9][.6 .4]   = [.195 .805]
        .15 .85



http://di.ubi.pt/~jpaulo/competence/tutorials/hmm-tutorial-1.pdf



a markov model is a chain structure bayes net
CPT = conditional probablity table
https://youtu.be/9dp4whVQv5s?t=2m43s

--
*stationary distrubition* - running the recursion til the distrubition remains the same, no matter what the initial distrubution was.



--
hidden markov model
look at systems where what we wish to predict is not what we observe - the underlying sytem is hidden

ex given a sequence of seaweed observations (dry or wet or damp) is it winter or summer

observable state - state of seaweed
hidden state - weather

we model such a process using a hmm where there is an underlying hidden markov process changing over time and a set of observable states which are link somehow to the hidden states

the number of hidden states and number of observable states may be different

each observable state has a connection to each hidden state. each edge has a probablity. the probablity of generating a particular observed state given that the markov process is in a particular hidden state.

all probablilies entering an observable state should sum to 1. sum of probablity(obsrevation | sum) prob(obs|cloud) pr(obs|rain)

emission matrix contain the probs of the observable states given a particular hidden state.

https://youtu.be/j3r9a75zOvM?t=14m57s

each prob in state matrix does not change over time or evolve.

in practice, this is one of the most *unrealistic assumptions* of markov models about real processes.

once system can be describe as HMM, three problems can be solved.
Evaulation : finding probablity of an observed sequence given HMM
Decoding : finding sequence of hidden states that most probably generated an observed sequence
Learning : generating an HMM given a sequence of observations

we use the forward algorithm to calculate the prob of an observation given a particular HMM and hence choose the most probable HMM.

we use the viterbi algorithm to find the most probable sequence of hidden states given a sequence of observations and a HMM.

we can use the Baum-Welch expectation maximumization algorithm to identify optimal paramaters for the HMM.

## Forward algorithm - exhaustive search
we want to find prob of observed sequence given HMM, where params are known.
we have seq of seaweed observations.
suppose the obsrevations for 3 consecutive days are (dry, damp, soggy) on each of these days, the weather may have been sunny cloudy or rainy. we can picture the obseravationsand the possible hidden states a a trellis diagram.

                      seaweed state today
                       dry      damp     soggy
weather        sunny   0.60    0.35      0.05
yesterday      cloudy   .25     .50     .25
               rainy   .05      .45       .50

under each column is the obsrvation at that time. the probalbity of this obsrvation given any one of the states is provided by the emission matrix.

one method of calc the prob of observed seq would be to find each possible seq of hiden states and sum these probs.

for ex there would be 3^3 = 27 possible different weather sequences, so the prob is
  Pr(dry,damp,soggy|HMM) =
     Pr(dry,damp,soggy| sunny,sunny,sunny) +
     Pr(dry,damp,soggy| sunny,sunny,cloudy) +
     Pr(dry,damp,soggy| sunny,sunny,rainty) +
     Pr(dry,damp,soggy| rainy,rainy,rainy) +
     and so on

this is computationally expenseive

# foward algorithm - complexity reduction
partial probablity is calculated as: (j) = Pr(observation | hidden state j) x Pr(all paths to state j at time t)

the sum of all partial probablities gives the probablity of the obsrvation, given the HMM

each partial prob at time t > 2 is calculated from the previous states


      confusion matrix (emession matrix)
                      seaweed state today
                       dry      damp     soggy
weather        sunny   0.60    0.35      0.05
yesterday      cloudy   .25     .50     .25
               rainy   .05      .45       .50

                  state transition matrix
                      weather today
                       sunny  cloudy rainy
weather        sunny   0.50    0.375  0.125
yesterday      cloudy  .250    .125    .625
               rainy   .250    .375   .375


## viterbi algorithm
decoding
take HMM and determine from an observation seq the most likely seq of underlying hidden states taht might have generated it

viterbi algorithm - exhaustive search
the most probable seq of hidden states is that combination that maximizes Pr(observed sequence | hidden state combination)


find the overall best path by choosing the state with the maximum partial prob and choosing its best path


http://yitingtech.blogspot.com/2014/05/how-i-understand-about-markov-model-i.html
