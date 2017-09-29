EVENT_01_PHONE.tps
-sprites used in the "don't get caught on your phone" minigame.


------------------------------------------------------------------
TALKING
-phone pose.
ORDER: 00>>01>>02
NOTES: as with the other poses we've done, play the whole animation everytime the button is pressed, then go back to 00 for neutral.

------------------------------------------------------------------
LIGHT_SWITCH
-light switch beside the door.
ORDER: 01>>02>>03 (sparks fly out when lights are flashing)
NOTES: after the lights flicker a few times the lights will go out, leading to the BLACKOUT frame below.
	this layer is above all the others (because of the flickering light layer) except for the BLACKOUT frame below.
------------------------------------------------------------------
BLACKOUT
-for when power is out.
ORDER: N/A
NOTES: this layer is above all the others other than the HUD layer.
------------------------------------------------------------------
REGISTER
-a chip reader & register on the right side of the counter.
ORDER: 00>>01>>00>>02
NOTES: it occasionally jumps up and down (with one of the unused rattle noises maybe?) to keep the player on their toes.
------------------------------------------------------------------
BACKGROUND
-background.
POS: x-0 y-0
ORDER: N/A
NOTES: 
------------------------------------------------------------------
CLEANING
-standard pose when no button is being pressed.
POS: x-49 y-2
ORDER: 00>>01>>02>>01
NOTES: 
------------------------------------------------------------------
CLEANING TRANSITION
-transition animation that plays when player stops mashing buttons.
POS: x-13 y-3
ORDER: N/A
NOTES: segue into CLEANING frames.
------------------------------------------------------------------
VIDEO
-phone pose.
POS: x-14 y-18
ORDER: 00>>01
NOTES: alternate between the two frames as fast as buttons are pressed.
------------------------------------------------------------------
ANGRY TEXTING
-phone pose.
POS: x-3 y-37
ORDER: 00>>01
NOTES: alternate between the two frames as fast as buttons are pressed.
------------------------------------------------------------------
TEXTING
-phone pose.
POS: x-3 y-11
ORDER: 00>>01
NOTES: alternate between the two frames as fast as buttons are pressed.
------------------------------------------------------------------
SELFIE
-phone pose.
POS: x-1 y-1
ORDER: 00>>01
NOTES: alternate between the two frames as fast as buttons are pressed.
------------------------------------------------------------------
BOSS
-twinkling eyes in doorway.
POS: x-131 y-39
ORDER: 00>>01
NOTES: loops quickly, disappears shortly before door closes.
------------------------------------------------------------------
DOOR_CLOSE
-door.
POS: x-106 y-7
ORDER: 00>>01>>02>>03>>04>>05>>04
NOTES: 
------------------------------------------------------------------
DOOR_OPEN
-door.
POS: x-106 y-7
ORDER: 00>>01>>02>>03>>04>>05>>04
NOTES: 
------------------------------------------------------------------
DOOR_OPEN_VERTICAL
-random alternate door opening animation.
POS: x-106 y-7
ORDER: 00>>01>>00>>02>>03>>04>>05>>04
NOTES: 
------------------------------------------------------------------
FAIL
-animation that plays when Lenny gets caught.
POS: x-0 y-0
ORDER: 00>>01>>02>>03>>04>>05>>06>>07>>08>>09>>10>>11
NOTES: 00 and 01 flash very quickly.
	Frames 07-11 loop until the stage transition.
------------------------------------------------------------------
