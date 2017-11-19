BG
-loops endlessly

---------------------------------------------------------------------

PLAYFIELD
-this shakes whenever an enemy is hit by Lenny, or if an enemy gets past her.

---------------------------------------------------------------------

BORDER
-this is a static frame around the playfield.

---------------------------------------------------------------------

SHOOTING STAR
-plays through animation occasionally in maybe 3 or 4 predetermined spots?

---------------------------------------------------------------------

ENEMIES AND THEIR BEHAVIOR:

-all enemy types have a standard speed type.

ENEMY_LADYBUG

ENEMY_ROBOT

ENEMY_WORM

-all of these simply play through their frames in order as they slide downscreen.
-speed of the enemy is denoted by the color of their WARNING FLASH.

ENEMY_JUMPER
-this is the only enemy that behaves differently than the others.

ORDER: 00>>01>>02  (slight pause) 03>>04 (looping as it travels down screen)

---------------------------------------------------------------------

WARNING FLASHES
-these show the player how fast a spawned enemy will be moving.
-because the stupid center button is one pixel larger than the others, I unfortunately had to make separate sprites for it.

ORDER: 00>>01

-enemy spawns directly after the flash.

---------------------------------------------------------------------

CAUTION SIGN
-this appears before a FAST (red flash warning) enemy appears.
-cycle through animation (00>>01) for a bit before spawning enemy.

---------------------------------------------------------------------

PLAYER POSITION
-is displayed behind Lenny sprite to show her location.

---------------------------------------------------------------------

LENNY
-default frame is 00
-play through animation 01 through 07 whenever the player moves to a new location.

---------------------------------------------------------------------
