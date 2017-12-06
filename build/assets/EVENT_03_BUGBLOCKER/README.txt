BG
-loops endlessly

---------------------------------------------------------------------

BORDER
-this is a static frame around the playfield.

---------------------------------------------------------------------

CAUTION SIGN
-this appears before a FAST (red flash warning) enemy appears.
-cycle through animation (00>>01) for a bit before spawning enemy.

---------------------------------------------------------------------

EXPLODE
-effect for hitting enemy with SWAT attack.

ORDER: 00 thru 04

---------------------------------------------------------------------

ENEMY_JUMPER
-this enemy behaves differently than the others.

ORDER: 00>>01>>02  (slight pause) 03>>04 (looping as it travels down screen)

-speed of the enemy is denoted by the color of their WARNING FLASH.

---------------------------------------------------------------------

ENEMY_LADYBUG
-this enemy simply slides down screen.

ORDER: 00 thru 05

-speed of the enemy is denoted by the color of their WARNING FLASH.

---------------------------------------------------------------------

ENEMY_ROBOT
-this enemy behaves differently than the others.

ORDER: 00 thru 05 (walking animation)
ORDER: WHEEL00 thru WHEEL04 (stops moving; transforming animation)
ORDER: WHEEL05>>WHEEL06 (loops; moves faster than walking animation)

-speed of the enemy is denoted by the color of their WARNING FLASH.

---------------------------------------------------------------------

ENEMY_WORM

ORDER: 00 thru 02

-speed of the enemy is denoted by the color of their WARNING FLASH.

---------------------------------------------------------------------

LENNY
-default frame is 00
-play through animation 01 through 07 whenever the player moves to a new location.

PANIC: 00>>01 (loops when an enemy is too low in any lane)

---------------------------------------------------------------------

MISS
-plays when enemy touches the buttons bar at the bottom of the playfield.
-enemy immediately disappears and is replaced by this animation.

ORDER: 01 thru 05

---------------------------------------------------------------------

PLAYFIELD
-this shakes whenever an enemy is hit by Lenny, or if an enemy gets past her.

---------------------------------------------------------------------

PLAYER_POSITION
-shows beneath player's current lane.
-stays until player moves to a new lane.

---------------------------------------------------------------------

SHOOTING STAR
-plays through animation occasionally in maybe 3 or 4 predetermined spots?

---------------------------------------------------------------------

SWAT
-effect for attacking (pressing center button)

ORDER: 00 thru 03

---------------------------------------------------------------------

WARNING FLASHES
-these show the player how fast a spawned enemy will be moving.

ORDER: 00>>01

-enemy spawns directly after the flash.

---------------------------------------------------------------------
