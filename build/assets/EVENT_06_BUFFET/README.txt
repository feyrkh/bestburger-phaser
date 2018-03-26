
-------------------BACKGROUND>>>
all sprites in this folder are static with the exception of GLASS.

GLASS
-this sprite is static EXCEPT when MAN_DRINK plays, in which case it disappears until that animation is complete. You'll see what I mean


-------------------FOOD>>>
gameplay icons.

BLUE, GREEN, RED, YELLOW
-these icons scroll across the counter toward Lenny
-pressing the correct input at the right time plays the BLUE_CLEAR (etc. for each color) frame and gives player a point.

WHITE
-this icon does not have a normal CLEAR animation. Instead, it can segue into either REJECT1, REJECT2 or SAD animations.


-------------------LENNY>>>
different actions for Lenny.

EAT
-plays when the correct button is pressed at the right time.

# of Frames: 3

MISS
-plays if the wrong button is pressed or if nothing is pressed before the item touches Lenny.

# of Frames: 3

SAD
-plays if player presses the wrong button in response to the WHITE hamburger icon, or if they press nothing

# of Frames: 5

REJECT1
-this plays in conjunction with the FOOD_WALL animation (below).
-plays either this animation or REJECT2 randomly when the correct button is pressed in response to the WHITE hamburger icon (the one Lenny doesn't want to eat)

# of Frames: 6

REJECT2
-plays either this animation or REJECT2 randomly when the correct button is pressed in response to the WHITE hamburger icon (the one Lenny doesn't want to eat)

# of Frames: 8

-------------------FOOD_WALL>>>
this animation plays at the same time as REJECT1 animation.
the reason it is separate is so Lenny can go back to neutral position and continue gameplay while this animation plays out.

# of Frames: 9

-------------------MAN>>>

MAN_ENTER
-animation of man entering from left and sitting down.
-happens maybe halfway through game?
-pause on frame 07 before sitting

# of Frames: 11

MAN_SIT
-static sprite that appears after MAN_ENTER animation.
-intended to obstruct player's view.

MAN_DRINK
-plays occasionally after MAN_ENTER animation.
-intended to obstruct player's view
-goes back to MAN_SIT sprite after playing through.

# of Frames: 15
-----------------------------------------------