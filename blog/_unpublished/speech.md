speech

Acoustic model: relationship between audio signal and phonemes
use software to create statistical representations of the sounds that make up each word
Language model: models the word sequences in the language

speech recog systems use both an acoustic model and a language model to represent the statistical properties of speech

recently Convolutional Neural Networks has led to big improvements in acoustic modeling


train acoustic model from user voice data

A phoneme is a unit of sound in speech. A phoneme doesn't have any inherent meaning by itself, but when you put phonemes together, they can make words. "T-A-BL"


markov chain

matrix multiplication, you multiple rows by columns

[.2 .8] [.9 .1]    =  (.2*.9) + (.8*.7) = .74  [.74 .26] = first state matrix (S1)
        [.7 .3]    = .26


    s2 = [.74 .26][ big assumption, remains same ] = [.848 .152]


stationary matrix, when the input matrix equal the output matrix. the system is said to be in a steady state

in Regular Markov Chains, successive state matrices will approach stationary matrix

pictogram: physcal things as images
ideogram: concepts as images
rebus princiople: sound+sound=new sound



speech synthesis process
text->text normalization->name entity detection->parts of speech->pronounciation

allophones - deferent ways of saying a phoneme, "positional variance" changes sound based on position. ex. t in troph, t in water, t in hot

automatic speech recognition systems is represented by a combination of hidden markov models for describing acoustic events and Markov chain models for the statistical modeling of word sequences on the symbolic level. MC for potential word sequences.

hidden markov models for acoustic analysis

16kHz with 16bits per sample is standard in speech recognition.

*speech understanding* starts with sequence of words hypotheses. try to derivce meaning from utterances.

phone is a single speech sound.
phoneme smalles unit of speech used to distinguish meaning.
phones are building block of spoken utterances that can be discriminated by listeners.

speech signals usually subdivided into 16-25ms sections called *frames*.
frames usually overlap to avoid losing information at the boundaries.
*frame rate* of 10 ms is standard. frame length of 20ms means signal sections would overlay by 50 percent.

continous feature vectors are identified with the outputs of a hidden markove model.

cepstral analysis has become the standard feature extraction method in ASR (automatic speech recognition).

The combination of subdiving a speech signal into frames and carrying out a local feature extraction is called *short-time analysis*

MCM helps to avoid the consideration of arbtriary word sequences during the search. Markov chain model statistically describes regularities of the language fragment considered and therfore is usually refered to as a language model.

speaker dependent - large vocab
speaker independent - small vocab

restriction of probable word sequences in defined application areas. ie first dictation systems were used by medical doctors only.

P(xt|y1:t) = P(xt|y1,y2,...yt)

first-order is same as Markov Assumption.
probablity of observation at n only dependends at time n-1.
second-order depends on n-1, n-2.

# sound
sample: volume at certain time
sample rate: number of samples per second (aka frequency)
array of samples: 0.7,0.2,0.4,-0.2,0.9
shape of bar graph will look like sound wave
a "window" is a sample, ex a 100ms out of a 10sec recording

# spectogram
A "waveform" shows variations in air pressure over time.
aplitude refers to loudness of components.
in spectogram dark black is high amplitude.
frequence is y axis, time is x axis in specto
"frequency spectrum" shows freq on x axis, amplitude on y axis

formats:
plosives: "bursts" (ie butt)

# radio waves
higher freq = longer wavelengths
lower freq = longer wave length
speech of light / frequency = wave length. RF travels close to Speed of Light
scientific term for length wave is "lambda"

#sphinx
The default for sound files used in Sphinx is a rate of 16 thousand samples per second (16KHz)
f 8KHz (telephone audio)