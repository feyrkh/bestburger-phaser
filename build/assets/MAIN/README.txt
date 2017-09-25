MAIN_GAME.tps
-sprites used in the main game mode.



------------------------------------------------------------------
MAIN_ICON_CLEAR
-effect for when icons are cleared.

POS: tied to current icon?
ORDER: 00>>01 etc.
------------------------------------------------------------------
MAIN_WINDOW
-where the gameplay takes place.

WINDOW_FAILURE_LINE: this is the fail line that penalizes the player when an order  touches it without being cleared.
POS: x-39 y-6
ORDER: 00>>01>>02>>03>>02>>01
NOTES: hold frame 03 for a bit, about a half second.

WINDOW_FRAME: this is the frame of the gameplay window. I put the bottom bar/buttons  there for reference since they'll be covered up anyway.
POS: x-0 y-0
ORDER: N/A

WINDOW_BACKGROUND: this is the BG for the gameplay window. It's a little transparent, we'll see how that looks.
POS: x-38 y-0
ORDER: N/A

------------------------------------------------------------------
MAIN_BACKGROUND
-scrolling background graphics behind gameplay/HUD.

BACKGROUND: background graphics
POS: x-0 y-0
ORDER: N/A
NOTES: background scrolls slowly. should loop seamlessly.
------------------------------------------------------------------
MAIN_BUTTONS
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
