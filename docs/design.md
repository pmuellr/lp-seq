lp-seq design
--------------------------------------------------------------------------------

2021-04-12 initial thoughts
================================================================================

The target device for this software is a Novation Launchpad Mini MK3 (LP),
because that's what I own. I assume this software should be able to work with
other Novation Launchpad flavors, but also assume something will need to be
tweaked.

The LP has 64 buttons arranged in an 8x8 grid.  There is a row of 8 buttons
at the top as well, but have pre-masked labels and so can only "back light".
There are also 8 buttons on the right as well, same as the top row (pre-masked).
Lastly, there is one light-able non-pressable ... indicator? ... at the top 
right, making the entire device actually 9x9.

labels in the top row:

- up arrow
- down arrow
- left arrow
- right arrow
- "Session"
- "Drums"
- "Keys"
- "User"

labels in the right column:

- 7 right arrows
- last button is "Stop Solo Mute"

We'll be using these buttons in the top-most row and right-most column as 
"function buttons" as well, with the "main" 8x8 grid being "content".

### implementation details

This will be a Node.js app, using the `midi` package from npm.  

It will connect to the LP to receive button presses, and send lighting commands.
Another function the LP provides is to scroll rando text, so we'll do that also.
As interstitials (configurable to turn off?) and with a special dump info
function.

The app will create a virtual Midi port that can be used in a DAW, connected to
a synth, etc. lp-seq will wrie midi information to it's output, to be dealt with
by the appropriate midi interpreter.


### modes

lp-seq will using a "modal" system like the LP in DAW mode, where you can
switch between "session", "drums", and "keys" modes.

lp-seq supports the following modes:

**note**: a note can be edited from several contexts, and includes the 
following data:

- midi channel
- midi note number
- midi velocity
- length 
- start offset in midi ticks, negative and positive (3x8 rows of negative,
  3x8 rows of positive, 1 "0" value row in between)

**trigger**: the 8x8 grid is arranged into 4 tracks.  Each track is 8 buttons
wide, and 2 buttons high.  So the 4 tracks are arranged on top of each other.
When "running", the current trigger button will flash left to right on the
top row of the track, then left to right on the bottom row of the track, for
each track.

**track**: each track holds up to 16 notes, and can be customized with a 
default note that applies to each of the individual notes.


**pattern**:


**project**:


### functions

`dump info`: scroll some status info with the text scroller until a key is
pressed

