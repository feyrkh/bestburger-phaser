TUTORIAL
Sprites used in the tutorial screens before Event stages.

-------------------------------------------------------------

BACKGROUND
-certain parts of the screen that are always there.

ORDER: 00>>01 LOOP

NOTES: Just for the heck of it I included the How To Play animation here to simplify things

-------------------------------------------------------------

BG_ANIMATION
-I'm sure there's a more efficient way to do this! but the animated bg is a 20 frame loop.

ORDER: 00>>01>>02 etc. (LOOPS)

-------------------------------------------------------------

EVENT_01_CHARA
-demonstration images for "Phoning It In" (event 01)

ORDER: 00>>01 (LOOPS during certain text...will be easier to coordinate in person or by myself)
ORDER: 02>>03 (LOOPS during certain text...will be easier to coordinate in person or by myself)

-------------------------------------------------------------

LITTLE_LENNY
-small character in the corner, explaining the rules of the game.

ORDER: 0>>01 (LOOPS while explaining rules)
ORDER: 02>>03 (LOOPS while showing time limit at end of tutorial)

-------------------------------------------------------------

TEXT_BOX
-instructions box and other elements.

	BUBBLE
	-text box.

	ORDER: N/A
	NOTES: this is always there. I only put it as its own thing because it has to sit above the animated background.
	
	-------------------------------------------------------------
	
	BUTTONS
	-button icons.
	
	RED00 etc.
	-unpressed buttons.

	RED01 etc.
	-pressed buttons.
	
	NOTES: when these animations play will vary depending on the tutorial.

	-------------------------------------------------------------

	TEXT
	-various tutorial messages.

	01_00 etc.
	-I thought this would be the simplest way to do things. minigame events will be denoted by numbers
	-for example, event_01 is "phoning it in" so 01_00 would be the first message for that tutorial.
	-messages advance when the player presses a button.
	-after the last message (showing the time limit) the tutorial transitions into the actual stage.

