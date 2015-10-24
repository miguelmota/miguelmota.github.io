Baye's Rule, learning from experience

General rule for conditional probablity
P(A|B) = P(A) x P(B|A)
         ------------
             P(B)

General Conjuction Rule, rearranged
P(A and B) = P(A)P(B|A)

"working" version of Baye's rule, what's used in calculations
P(A|B) = P(A)P(B|A)
        -------------------------
        P(A)P(B|A) + P(not-A)P(B|not-A)

https://www.youtube.com/watch?v=E2pOJwSwWDk

P(B1|G)   = 0.5 * (0.5)
           --------------
              0.5 * 0.5  + ((0.5) * (0.3))

P(B1|G) = 62.5%

two computer chip companies sell chips.
company A sold 100 chips of which 5 were defective
company B sold 300 chips of which 21 were defective

what's the prob that defective chip came from company B.

P(compB) = 100/400 = .75 // base rates  https://en.wikipedia.org/wiki/Base_rate_fallacy
P(compA) = .25 // base rates
P(compB|D) =  21/300 = 0.07
P(compB|D) = 5/100 = 0.05

P(B|D) = (.75) * (0.07)
         ------------------
          (.75) * (0.07) + (.25) * (.05)

          .0525
          ---
          .0525+.0125

          .0525
          ---- = 0.81
          .065


-------
baye's rule revision

P(A|B,C) = P(B|A,C)P(A|C)
           -------------
             P(B|C)

use bayes rule to obtain P(Xt|Y1:t)
               A   B     C
P(Xt|Y1:t) = P(Xt|Yt, Y1:t-1)

           = P(Yt|Xt,Y1:t-1) P(Xt|Y1:t-1)
             --------------------------
                 P(Yt|Y1:t-1)
