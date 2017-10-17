MAIN_GAME.tps
-sprites used in the main game mode.



(FOLDER) BORDER SLOW MOTION
-bezel effect for when slow motion is active.
------------------------------------------------------------------
ORDER: 00 through 03 (when slowmo is activated)
ORDER: 04 through 18 (loop for duration of slowmo mode)
ORDER: 19 through 21 (when slowmo is deactivated)


(FOLDER) PARTICLES
-various particle effects.
------------------------------------------------------------------
COIN
-a particle that can fly into the points meter on the right after each point gained.
------------------------------------------------------------------



(FOLDER) MAIN_COMBO
-three folders in here, controlling the combo meter, numbers and bonus icons.
------------------------------------------------------------------
(FOLDER) COUNTER
-a small popout window that appears to keep track of current number of hits)

ORDER: 00 through 08 (when counter pops out after player has achieved a 10 hit combo)
ORDER: 09 through 14 (when a combo milestone is reached, such as 20, 50, 70, 100, 150, 200, 250, 300, 400 or more)
ORDER: 15 through 19 (when combo is lost and counter leaves screen)
------------------------------------------------------------------
(FOLDER) DIGITS
-number icons for counting combo.
------------------------------------------------------------------
(FOLDER) POINT_ICON
-reward icons to show how many points player will earn after losing their current combo (mostly window decoration)

NOTES: These are all 8 frame loops.
------------------------------------------------------------------
(FOLDER) MAIN_ICON_CLEAR
-effect for when icons are cleared. I have 4 different new ones here, think it would look good if they played randomly?

POS: tied to current icon?
ORDER: 00 through 05
06 through 11
12 through 17
18 through 23
24 through 29
------------------------------------------------------------------
(FOLDER) MAIN_WINDOW
-where the gameplay takes place.

WINDOW_FAILURE_LINE: this is the fail line that penalizes the player when an order  touches it without being cleared.
POS: x-39 y-6
ORDER: 00>>01>>02>>03>>02>>01
NOTES: hold frame 03 for a bit, about a half second.

WINDOW_FRAME00: this is the frame of the gameplay window. 
POS: x-0 y-0
ORDER: N/A

WINDOW_FRAME01: for when a bad input happens.

BOTTOM_BAR: just a placeholder for the hud at the bottom.

RESTAURANT_BG: this goes behind the WINDOW_FRAME00. it's a big extended to accomodate window shake.

WINDOW_BACKGROUND: this is the BG for the gameplay window. It's a little transparent, we'll see how that looks.
POS: x-38 y-0
ORDER: N/A

------------------------------------------------------------------
(FOLDER) MAIN_BACKGROUND
-scrolling background graphics behind gameplay/HUD.

BACKGROUND: background graphics
POS: x-0 y-0
ORDER: N/A
NOTES: background scrolls slowly. should loop seamlessly.
------------------------------------------------------------------
(FOLDER) MAIN_BUTTONS
-the button key on the bottom of the screen.

RED: it's a button
POS: x-38 y-114
ORDER: N/A
NOTES:

YELLOW: it's a button
POS: x-57 y-114
ORDER: N/A
NOTES:

SPECIAL: we don't have the purpose of this one locked down yet, but it'll probably be used to break penalty blocks and special bonus icons.
POS: x-76 y-114
ORDER: N/A
NOTES:

YELLOW: it's a button
POS: x-96 y-114
ORDER: N/A
NOTES:

BLUE: it's a button
POS: x-115 y-114
ORDER: N/A
NOTES:

BUTTON_PRESS: the frame that overlaps a button when it is pressed or held.
POS: same as corresponding button.
ORDER: N/A
NOTES:

SPARKLE: a particle effect to fly off of buttons when pressed.
POS: 
ORDER: N/A
NOTES: can this be done in-engine where a bunch of them fly off and disappear when a button is pressed?

BUTTONS_BAR: containing shape for buttons.
POS: x-34 y-110
ORDER: N/A
NOTES:
------------------------------------------------------------------
