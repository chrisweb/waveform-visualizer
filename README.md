waveform-visualizer
===================

audio theory
------------

Analog audio consists of waves. To digitalize audio we take samples of the wave amplitude (http://en.wikipedia.org/wiki/Amplitude) at different intervals in time.

The amount of samples taken during one second is called the sample rate (http://en.wikipedia.org/wiki/Sampling_(signal_processing)). For example the audio on CDs is sampled at 44.1kHz which means that we have to take 44100 samples per second.

Each sample is a number within range of numbers called the bit depth (http://en.wikipedia.org/wiki/Audio_bit_depth), often that range is 16bit (means it can be a value from 1 to 65536), but a wave can be positive or negative which means our values can in the range -32768 to +32767 (-2^15 to 2^15-1 (minus one because of the zero)).

PCM is an array of floating point values ranging from -1 to 1. they are represention a digital version of the wave. in webaudio, pcm the corresponds to an audio buffer. an audio buffer can store multiple channels.

The PCM floating point numbers can be converted from or to a sounds bit depth, which then would be an array of intergers  

Flac is lossless but still the values got compressed but not in a way that alters them; mp3 and ogg are not lossless. aiff is the lossless non compressed apple format and wav the microsoft lossless and non compressed format.

bit rate is a metric used to describe the amount of compression. common values are 128 and 192 kb/s.


what is frequency? is a high frequency a high tone and a bass has a low frequency? frequency only for analog? the sample rate needs to be above frequency, right!? different notes produce different frequencies. minimum sample rate has be be at least twice the maximum frequency. maximum audible frequency is 22kHz!?

what are decibels (dB)? the unit of amplitude!? only for analog sound!? bit depth of 16bit can be maximum of 98.09 dB whereas 20bit can 122.17 dB.

what is volume? volume always the same. What does a reduction or increase in volume do?






http://en.wikibooks.org/wiki/Sound_Synthesis_Theory/Sound_in_the_Time_Domain

web audio api
-------------

audio context
-------------

The first thing you need to get is the audio context. If you already worked with canvas this might be something you have already done.

The audio context is an object that has methods to interact with your audio in the browser.

The audio context allows you to create audio nodes and then connect them together to build complex audio graphs.

Audio nodes
-----------

There are different types of nodes, source nodes to get audio data from a server, from a microphone or even the audio tag.

The modification nodes let you alter the audio sound and the analysis nodes does what its name suggests, it lets you analyze the audio for example to create visualizations.

And finally destination nodes to output the audio.

