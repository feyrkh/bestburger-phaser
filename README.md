# phaser3-project-template
A Phaser 3 Project Template

 To use, install NodeJS for your OS, go into the bestburger-phaser directory, and type: npm install
 To run the program, execute run.sh on a Linux-based system (should work on OSX as well). For Windows...dunno!
 
 View the code here:
 https://ide.c9.io/feyrkh/bestburger-phaser
 
# Building on Windows
The patch manager doesn't handle Windows line endings very well. Open a git bash shell in the repo directory,
then type the following:
```
git config --global core.eol lf
git rm --cached -rf .
git diff --cached --name-only -z | xargs -n 50 -0 git add -f
git ls-files -z | xargs -0 rm
git checkout .
```
Then you should be able to use `npm install` as normal.
 
# Patching the Phaser source code
 If you have to patch the Phaser source code, do this:
 ```
 // one-time only
 npm install -g patch-package
 // make sure you have the latest changes
 git pull
 // generate the patch file each time you update the source code
 patch-package phaser
 // after testing that your changes worked and didn't break anything:
 git add *
 git status
 // after reviewing git status to make sure you're changing what you intended only
 git commit
 // enter a message, press Ctrl+X, Y, then press enter to save
 git push
 ```