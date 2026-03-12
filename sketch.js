let menu = "loading" // main, game, night select, customNight, gameover, victory
let assetsLoaded = 0;

//all
let staticOverlay = null;

function setCameraOverlay(enabled) {
    if (!staticOverlay) {
        return;
    }
    staticOverlay.classList.toggle("fuzzy-overlay", enabled);
}

//main
let endCallButton;
let phoneCalling = false;
let level = "main"; // can be "main", "cameras"
let currentCam = 1;
let money = 45.00;
let camsDisabledTimer = 0;
let camFlipUpTimer = 0;
let camFlipDownTimer = 0;
let panelFlipUpTimer = 0;
let panelFlipDownTimer = 0;
let panelOpen = false;
let panelTurnOnTimer = 0;
let panelPage = "menu";
let camSwitchTimer = 0;
let characterMoveTimer = 0;
let numRects = 0;
let camButtons = [];
let seed = 0;
let moveQueue = [];
let internetUsage = 0;
let currentTranslate = 0;
let mainView;
let darrenInMainView = []
let evanInMainView = []
let seanInMainView = []
let ventOpen;
let michaelInOffice;
//buffers
let mainBuffer;
let cam2Buffer;
let cam9Buffer;
let camActivateBuffer;
let panelActivateBuffer;
//main images
let abdullahCam = []
let abdullahVentCam = []
let aidanCam = []
let alexCam = []
let alexHacker;
let darrenCam;
let darrenInDarrenCam = []
let evanInDarrenCam = []
let darrenVentCam = []
let evanCam = []
let hallwayCam;
let seanInHallwayCam = []
let evanInHallwayCam = []
let sahilCam = []
let jackCam = []
let seanCam = []
let jumpscares = []
let camUp = []
let camDown = []
let opaqueStatic = [];
let deathStatic = [];
let cameraMap;
let systemPanel;
let computerView;
let jumpscareQueue = "none";
let jumpscareTimer = 0;
let forceJumpscareTimer = 0;
let flickerTimer = 0;

//camera tool buttons
let ventLight;
let night = 1;
let time = 12;
let timeMS = 0;

//fps improvements
let mainNeedsRebuild = false;
let cam2NeedsRebuild = false;
let cam9NeedsRebuild = false;
let DEBUG = true;
let audioUnlocked = false;
let previousSeanPosition = 0;
let previousEvanPosition = 0;
let previousDarrenPosition = 0;

//main menu
let menuButtons = []
let newGameConfirm = false;
let menuCharacters = [[], [], []];
let char1Timer = 0;
let char2Timer = 0;
let char3Timer = 0;
let char1Twitching = 0;
let char2Twitching = 0;
let char3Twitching = 0;
let menuTransitionTimer = 0;
let newsPaper;
let newsPaperTransitionInTimer = 0;
let newsPaperTransitionOutTimer = 0;
let newsPaperTimer = 0;
let nightDescriptionTimer = 0;
let nightDescription = "NA"
let hasSeenNews = false;

//start screen
let nightStartSound;

//win screen
let winTimer = 0;
let winSound;

//dead screen
let abdullahJumpscare = [];
let aidanJumpscare = [];
let alexJumpscare = [];
let darrenJumpscare = [];
let evanJumpscare = [];
let jackJumpscare = [];
let seanJumpscare = [];
let scareTimer = 0;
let deadTimer = 0;
let jumpscareShakeTimer = 0;
let jumpscareBurstFired = false;

//all
let GAME_WIDTH = window.innerWidth;
let mainWidth = GAME_WIDTH * 1.2953125; // so max translate is 567 at 1080p
let GAME_HEIGHT = window.innerHeight;
let mainFont;

//characters
let sahil = {};
let abdullah = {};
let aidan = {};
let alex = {};
let darren = {};
let evan = {};
let jack = {};
let sean = {};
let michael = {};

let soundHolder = {}

sahil.active = 0;
sahil.position = 0;
sahil.timeSinceLastMoveAttempt = 0;
sahil.timeUntilNextPotentialMove = 30000;
sahil.ai = 1;
sahil.update = function() {
    if (sahil.ai > 0 && sahil.active == 1) {
        sahil.timeSinceLastMoveAttempt += deltaTime;
        if (sahil.timeSinceLastMoveAttempt > sahil.timeUntilNextPotentialMove) {
            if (random() < 0.5) {
                sahil.position = 1;
                debugLog("Sahil has moved to position " + sahil.position);
                sahil.timeSinceLastMoveAttempt = 0;
                sahil.timeUntilNextPotentialMove = random(40000 - sahil.ai * 1000, 40000);
                if (sahil.isOnCam()) {
                    disableCams(2000)
                }
            }
        }
    }
}
sahil.isOnCam = function() {
    if (level == "cameras" && currentCam == 1) {
        return true;
    }
    return false;
}

// Abdullah

abdullah.active = 1;
abdullah.position = 0;
abdullah.attacking = 0;
abdullah.timeSinceLastMoveAttempt = 0;
abdullah.timeUntilNextMoveAttempt = 0;
abdullah.moveQueue = [];
abdullah.ai = 20;
// Call this once in a while
abdullah.tick = function() {
    if (abdullah.active == 1) {
        abdullah.timeSinceLastMoveAttempt += deltaTime;
        if (abdullah.attacking == 0) {
            if (abdullah.timeSinceLastMoveAttempt >= 10000) {
                if (random() < abdullah.ai / 40) {
                    abdullah.attacking = 1;
                    abdullah.timeUntilNextMoveAttempt = random(15000 - abdullah.ai * 500, 15000);
                } else {
                    abdullah.timeUntilNextMoveAttempt = random(5000 - abdullah.ai * 200, 5000);
                }
                abdullah.timeSinceLastMoveAttempt = 0;
            }
        } else {
            if (abdullah.timeSinceLastMoveAttempt >= abdullah.timeUntilNextMoveAttempt) {
                abdullah.timeSinceLastMoveAttempt = 0;
                if (random() < abdullah.ai / 10) {
                    if (abdullah.isBeingLookedAtInVent()) {
                        //add abdullah's move to the move queue
                        debugLog("Abdullah is being looked at in the vent, so his move has been added to the move queue for position " + (abdullah.position + 1));
                        abdullah.active = 0; // this makes it so he doesn't move again until his move in the move queue is executed
                        moveQueue.push([abdullah, abdullah.position + 1]);
                    } else {
                        abdullah.position += 1;
                        debugLog("Abdullah has moved to position " + abdullah.position);
                        if (abdullah.isOnCam()) {
                            disableCams(2000)
                        }
                    }
                    if (abdullah.position == 5) {
                        if (!soundHolder.ventWalking.isPlaying()) {
                            soundHolder.ventWalking.play();
                        }
                    } else {
                        playWalkingSound();
                    }
                }
                if (abdullah.position == 6) {
                    jumpscareQueue = "abdullah";
                    abdullah.active = 0;
                    forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
                }
                abdullah.timeUntilNextMoveAttempt = random(5000 - abdullah.ai * 200, 5000);
                abdullah.timeSinceLastMoveAttempt = 0;
            }
        }
    }
}
abdullah.isBeingLookedAtInVent = function() {
    if (level == "cameras" && currentCam == 10 && abdullah.position >= 4 && abdullah.position <= 5 && mouseIsPressed) {
        return true;
    }
    return false;
}
abdullah.isOnCam = function() {
    //check if hes being seen on cam 7
    if (level == "cameras" && currentCam == 7 && abdullah.position < 5 && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}

// Aidan

aidan.active = 1;
aidan.position = 0;
aidan.attacking = 0;
aidan.timeSinceLastUpdate = 0;
aidan.ai = 20;
// Call this once in a while
aidan.tick = function() {
    if (aidan.active == 1) {
        aidan.timeSinceLastUpdate += deltaTime;
        if (aidan.timeSinceLastUpdate >= 6000) {
            aidan.timeSinceLastUpdate = 0;
            if (aidan.attacking == 0) {
                if (random() < aidan.ai / 40) {
                    aidan.position += 1;
                    debugLog("Aidan has moved to position " + aidan.position);
                    if (aidan.isOnCam()) {
                        disableCams(2000)
                    }
                }
                if (aidan.position == 6) {
                    aidan.attacking = 1;
                    debugLog("Aidan has started attacking");
                    // Play some audio queue (you can still save yourself)
                }
            } else {
                // Aidan is attacking
                aidan.position += 1;
                debugLog("Aidan has moved to position " + aidan.position);
                playWalkingSound();
                if (aidan.isOnCam()) {
                    disableCams(2000)
                }
                if (aidan.position == 10) {
                    aidan.active = false;
                    jumpscareQueue = "aidan";
                    forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
                }
            }
        }
    }
}
aidan.isOnCam = function() {
    if (level == "cameras" && currentCam == 5 && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}

// Alex

alex.position = 0;
alex.ai = 1;
alex.active = 1;
alex.target = "none"
alex.killTimer = 0;
alex.calmProgress = 0;
// Should call this every second
alex.tick = function() {
    if (alex.ai > 0 && alex.active == 1) {
        if (level == "cameras") {
            alex.changeInternetUsage(deltaTime);
        } else {
            alex.changeInternetUsage(-deltaTime / (Math.max(alex.ai / 2, 1))); // internet usage decreases while not in cameras
        }
    } else if (alex.killTimer > 0) {
        //alex has a target
        alex.killTimer -= deltaTime;
        if (alex.killTimer <= 0) {
            jumpscareQueue = "alex";
            forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
            alex.active = 0;
        }
    }
}
alex.changeInternetUsage = function(amount) {
    if (alex.ai > 0 && alex.active == 1) {
        internetUsage += amount;
        internetUsage = max(0, internetUsage);
        let oldPosition = alex.position;
        if (internetUsage < 10000) {
            alex.position = 0;
        } else if (internetUsage < 20000) {
            alex.position = 1;
        } else if (internetUsage < 30000) {
            alex.position = 2;
        } else if (internetUsage < 40000) {
            alex.position = 3;
        } else if (internetUsage < 50000) {
            alex.position = 4;
        } else if (internetUsage < 60000) {
            alex.position = 5;
            //play some audio queue
        } else {
            alex.position = 6;
            alex.active = 0;
            alex.target = floor(random(1, 12)); // pick a random cam to hack
            alex.calmProgress = 1000;
            alex.killTimer = 20000 - alex.ai * 200;
        }
        if (oldPosition != alex.position) {
            playWalkingSound();
            debugLog("Alex has moved to position " + alex.position);
            if (alex.isOnCam()) {
                disableCams(2000)
            }
        }
    }
}
alex.isOnCam = function() {
    if (level == "cameras" && currentCam == 3 && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}

// Darren
darren.active = 1;
darren.position = 0;
darren.timeSinceLastMoveAttempt = 0;
darren.name = "Darren";
darren.siphoning = false;
darren.timeSinceLastMoneySteal = 0;
darren.moveQueue = [];
darren.ai = 20;
// Call every second
darren.tick = function() {
    if (darren.active == 1) {
        if (!darren.siphoning) {
            darren.timeSinceLastMoveAttempt += deltaTime;
            if (darren.timeSinceLastMoveAttempt >= 7500) {
                darren.timeSinceLastMoveAttempt = 0;
                // darren is just always moving towards you, you can pause him (reset updatesSinceLastMove and set his position to 6) by flashing the light on him in his vent.
                // I guess you could just keep pausing him but its kind of a waste of time so you have to balance it. Maybe the crazy hard nights where you get no money you basically have to keep him paused the entire time.
                if (random() < darren.ai / 20) {
                    if (darren.isBeingLookedAt()) {
                        //add darren's move to the move queue
                        debugLog("Darren is being looked at in main, so his move has been added to the move queue for position " + (darren.position + 1));
                        darren.active = 0; // this makes it so he doesn't move again until his move in the move queue is executed
                        moveQueue.push([darren, darren.position + 1]);
                    } else if (darren.isBeingLookedAtInVent()) {
                        //add darren's move to the move queue
                        debugLog("Darren is being looked at in vent, so his move has been added to the move queue for position " + (darren.position + 1));
                        darren.active = 0; // this makes it so he doesn't move again until his move in the move queue is executed
                        darren.moveQueue.push([darren, darren.position + 1]);
                    } else {
                        darren.position += 1;
                        debugLog("Darren has moved to position " + darren.position);
                        if (darren.isOnCam()) {
                            disableCams(2000)
                        }
                        if (darren.position >= 3 && darren.position <= 6) {
                            mainNeedsRebuild = true;
                        }
                    }
                    if (darren.position == 7) {
                        if (!soundHolder.ventWalking.isPlaying()) {
                            soundHolder.ventWalking.play();
                        }
                    } else if (darren.position == 10) {
                        // play some audio queue
                        // darren steals some money
                        debugLog("Darren has started siphoning money");
                        darren.siphoning = true;
                        mainNeedsRebuild = true;
                    } else {
                        playWalkingSound();
                    }
                }
                darren.timeSinceLastMoveAttempt = 0;
            }
        } else {
            // darren is stealing 10 cents per second, he has opened the vent and you need to close it.
            // When he first appears, he immediately steals 5 dollars.
            if (darren.timeSinceLastMoneySteal >= 1000) {
                darren.timeSinceLastMoneySteal -= 1000;
                money -= darren.ai / 10 + 0.5;
                if (money <= 0) {
                    // darren kills you
                    darren.active = 0;
                    jumpscareQueue = "darren";
                    forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
                }
            }
            darren.timeSinceLastMoneySteal += deltaTime;
        }
    }
}
darren.isBeingLookedAt = function() {
    //this only checks if hes being looked at in the main view
    if (level == "main" && (darren.position >= 3 && darren.position <= 5) && currentTranslate < mainWidth - GAME_WIDTH) {
        return true;
    }
    return false;
}
darren.isBeingLookedAtInVent = function() {
    if (level == "cameras" && currentCam == 11 && darren.position >= 6 && darren.position <= 8 && mouseIsPressed && camsDisabledTimer <= 0 && ventLight.checkClicked()) {
        return true;
    }
    return false;
}
darren.isOnCam = function() {
    if (level == "cameras" && currentCam == 9 && darren.position <= 3 && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}

// Evan
evan.active = 1;
evan.position = 0;
evan.target = "office"
evan.previousTarget = "office";
evan.name = "Evan";
evan.timeSinceLastMove = 0;
evan.ai = 20;
evan.tick = function() {
    //this logic is really confusing
    if (evan.active == 1) {
        evan.timeSinceLastMove += deltaTime;
        if (evan.timeSinceLastMove >= 4500) {
            if (random() < evan.ai / 20) {
                let isMoveQueued = false;
                let oldPosition = evan.position;
                if (evan.isOnCam()) {
                    disableCams(2000)
                }
                if (evan.isBeingLookedAt()) {
                    isMoveQueued = true;
                }
                switch (evan.target) {
                    case "office":
                        if (evan.position <= 6) {
                            evan.position += 1;
                        } else if (evan.position == 8 || evan.position == 9) {
                            evan.position += 1;
                        } else if (evan.position == 10) {
                            evan.position = 7; //hallway end of hall
                        } else if (evan.position == 7) {
                            evan.position = 11;
                        } else {
                            evan.active = 0;
                            jumpscareQueue = "evan";
                            forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
                        }
                        break;
                    case "evansRoom":
                        if (evan.position >= 4 && evan.position <= 7) {
                            evan.position -= 1;
                        } else if (evan.position <= 3) {
                            evan.position = 0
                            evan.target = "office";
                            stopDanceMonkey();
                            // turn off the music
                        } else if (evan.position == 8 || evan.position == 9) {
                            evan.position += 1;
                        } else if (evan.position == 10 || evan.position == 11) {
                            evan.position = 7; //hallway end of hall
                        }
                        break;
                    case "darrensRoom":
                        if (evan.position <= 6) {
                            evan.position += 1;
                        } else if (evan.position <= 10) {
                            evan.position = 8; // made it to darrens room
                            evan.target = "office";
                            mainNeedsRebuild = true;
                            // turn off the music
                            stopDanceMonkey();
                        } else if (evan.position == 11) {
                            evan.position = 7; //hallway end of hall
                        }
                        break;
                }
                if (evan.isOnCam()) {
                    disableCams(2000)
                }
                if (evan.isBeingLookedAt()) {
                    isMoveQueued = true;
                }
                if (evan.isOnCam()) {
                    disableCams(2000)
                }
                if (isMoveQueued) {
                    //add evan's move to the move queue
                    moveQueue.push([evan, evan.position]);
                    evan.active = 0; // this makes it so he doesn't move again until his move in the move queue is executed
                    evan.position = oldPosition; // reset his position until the move queue executes his move
                    debugLog("Evan is being looked at, so his move has been added to the move queue for position " + evan.position);
                } else if (evan.position == 7 || evan.position == 11 || evan.position == 7 || evan.position == 11) {
                    mainNeedsRebuild = true;
                    playWalkingSound();
                    debugLog("Evan has moved to position " + evan.position);
                } else {
                    playWalkingSound();
                    debugLog("Evan has moved to position " + evan.position);
                }
            }
            evan.timeSinceLastMove = 0;
        }
    }
}
evan.isBeingLookedAt = function() {
    //only check main
    if (level == "main" && (evan.position == 7 || evan.position == 11) && currentTranslate < mainWidth - GAME_WIDTH) {
        return true;
    }
    return false;
}
evan.isOnCam = function() {
    //check evan cam
    if (level == "cameras" && currentCam == 4 && evan.position <= 2 && camsDisabledTimer <= 0) {
        return true;
    }
    //check hallway cam
    if (level == "cameras" && currentCam == 2 && evan.position >= 4 && evan.position <= 6 && camsDisabledTimer <= 0) {
        return true;
    }
    //check darren cam
    if (level == "cameras" && currentCam == 9 && evan.position >= 8 && evan.position <= 10 && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}

// Jack
jack.position = 0;
jack.angerLevel = 0;
jack.timeSinceLastAngerIncreaseChance = 0;
jack.ai = 1;
jack.oldPosition = 0;
jack.active = 1;
jack.tick = function() {
    if (jack.ai > 0) {
        jack.timeSinceLastAngerIncreaseChance += deltaTime;
        if (jack.timeSinceLastAngerIncreaseChance >= 10000) {
            jack.timeSinceLastAngerIncreaseChance = 0;
            if (random() < jack.ai / 20) {
                jack.increaseAnger(1);
            }
        }
    }
}
jack.increaseAnger = function(amount) {
    if (jack.ai > 0 && jack.active == 1) {
        let oldPosition = jack.position;
        jack.angerLevel += amount;
        if (jack.angerLevel < 10) {
            jack.position = 0;
        } else if (jack.angerLevel < 20) {
            jack.position = 1;
        } else if (jack.angerLevel < 30) {
            jack.position = 2;
        } else if (jack.angerLevel < 40) {
            jack.position = 3;
        } else if (jack.angerLevel < 50) {
            jack.position = 4;
        } else if (jack.angerLevel < 60) {
            jack.position = 5;
        } else {
            jack.position = 6;
            jack.active = 0;
            jumpscareQueue = "jack";
            forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
        }
        if (jack.isOnCam() && camsDisabledTimer <= 0) {
            disableCams(2000)
        }
        if (jack.position != oldPosition) {
            playWalkingSound();
            debugLog("Jack has moved to position " + jack.position);
        }
        jack.oldPosition = jack.position;
    }
}
jack.isOnCam = function() {
    if (level == "cameras" && currentCam == 8 && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}

// Sean
sean.active = 1;
sean.position = 0;
sean.timeSinceLastMoveAttempt = 0;
sean.name = "Sean";
sean.ai = 20;
sean.killTimer = 0;
sean.attackQueued = false;
sean.attackPrevented = false;
sean.attackRecoveryTimer = 0;
sean.forceAttackTimer = 0;
sean.tick = function() {
    if (sean.ai > 0 && sean.active == 1) {
        if (sean.killTimer <= 0) {
            sean.timeSinceLastMoveAttempt += deltaTime;
            if (sean.isOnCam()) {
                sean.timeSinceLastMoveAttempt = 0;
            }
            if (sean.timeSinceLastMoveAttempt > 6500) {
                if (random() < sean.ai / 20) {
                    sean.timeSinceLastMoveAttempt = 0;
                    let oldPosition = sean.position;
                    let option = random();
                    let isMoveQueued = false
                    if (sean.isOnCam()) {
                        disableCams(2000)
                    }
                    if (sean.isBeingLookedAtInMainView()) {
                        isMoveQueued = true;
                    }
                    if (option < 0.1) {
                        debugLog("Sean has stayed in the same position");
                        // stay in the same position
                        //make a sound cue
                    } else if (option < 0.5) {
                        // teleport to random position
                        sean.position = floor(random(sean.position, 11)); // there are 10 positions he can be in on the cam/main view, from 0 to 10
                        debugLog("Sean has teleported to position " + sean.position);
                        //make a sound cue
                    } else if (option < 0.9) {
                        // move towards the player
                        if (sean.position < 11) {
                            sean.position += 1;
                        }
                        playWalkingSound();
                        debugLog("Sean has moved towards the player to position " + sean.position);
                    } else {
                        // move away from the player
                        if (sean.position > 0) {
                            sean.position -= 1;
                        }
                        playWalkingSound();
                        debugLog("Sean has moved away from the player to position " + sean.position);
                    }
                    if (sean.isOnCam()) {
                        disableCams(2000)
                    }
                    if (sean.isBeingLookedAtInMainView()) {
                        isMoveQueued = true;
                    }
                    if (isMoveQueued) {
                        //add sean's move to the move queue
                        moveQueue.push([sean, sean.position]);
                        sean.active = 0;
                        sean.position = oldPosition; // reset his position until the move queue executes his move
                        debugLog("Sean is being looked at in the main view, so his move has been added to the move queue for position " + sean.position);
                    } else if (sean.position != oldPosition && (((sean.position >= 7 && sean.position <= 9) || sean.position == 11) || ((oldPosition >= 7 && oldPosition <= 9) || oldPosition == 11))) {
                        mainNeedsRebuild = true;
                    }
                    if (sean.position == 11) {
                        // do the sean event where he appears in the main view and you have to do some quick time event to make him go away
                        // if you fail he kills you
                        if (level == "main") {
                            sean.attackPrevented = false;
                            sean.killTimer = 2000 - sean.ai * 50;
                            soundHolder.seanAppear.play();
                        } else {
                            sean.attackQueued = true;
                            sean.forceAttackTimer = random(4000, 10000);
                        }
                    }
                }
            }
        } else {
            //seans position is 11,
            sean.killTimer -= deltaTime;
            if (sean.killTimer <= 0) {
                if (sean.attackPrevented) {
                    sean.position = floor(random(0, 3)); // 0, 1, or 2
                } else {
                    sean.active = 0;
                    sean.position = 3; //position where hes nowhere to be seen on cams or main
                }
                sean.attackRecoveryTimer = 4000; //after sean attacks, the screen will fade back in for 2 seconds
                soundHolder.seanAppear.stop();
                mainNeedsRebuild = true;
                disableCams(2000);
            }
        }
    }
}
sean.isOnCam = function() {
    if (level == "cameras" && ((currentCam == 6 && sean.position <= 2) || (currentCam == 2 && sean.position >= 4 && sean.position <= 6)) && camsDisabledTimer <= 0) {
        return true;
    }
    return false;
}
sean.isBeingLookedAtInMainView = function() {
    if (level == "main" && (sean.position >= 7 && sean.position <= 9) && currentTranslate < mainWidth - GAME_WIDTH) {
        return true;
    }
    return false;
}

michael = {}
michael.ai = 1;
michael.position = 0;
michael.affectedCharacter = -1;
michael.timeSinceLastFlickerChance = 0;
michael.update = function() {
    if (michael.position == 0) {
        if (random() < michael.ai / 100) {
            michael.position = 1;
            //increase one random characters ai to 20
            michael.affectedCharacter = floor(random(0, 7));
            switch (michael.affectedCharacter) {
                case 0:
                    if (abdullah.ai == 0) {
                        abdullah.position = 0;
                    }
                    abdullah.ai += 10;
                    break;
                case 1:
                    if (aidan.ai == 0) {
                        aidan.position = 0;
                    }
                    aidan.ai += 10;
                    break;
                case 2:
                    if (alex.ai == 0) {
                        alex.position = 0;
                    }
                    alex.ai += 10;
                    break;
                case 3:
                    if (darren.ai == 0) {
                        darren.position = 0;
                    }
                    darren.ai += 10;
                    break;
                case 4:
                    if (evan.ai == 0) {
                        evan.position = 0;
                    }
                    evan.ai += 10;
                    break;
                case 5:
                    if (jack.ai == 0) {
                        jack.position = 0;
                    }
                    jack.ai += 10;
                    break;
                case 6:
                    if (sean.ai == 0) {
                        sean.position = 0;
                    }
                    sean.ai += 10;
                    break;
            }
            mainNeedsRebuild = true;
        }
    } else {
        if (random() < michael.ai / 40) {
            michael.position = 0;
            switch (michael.affectedCharacter) {
                case 0:
                    abdullah.ai -= 5;
                    break;
                case 1:
                    aidan.ai -= 5;
                    break;
                case 2:
                    alex.ai -= 5;
                    break;
                case 3:
                    darren.ai -= 5;
                    break;
                case 4:
                    evan.ai -= 5;
                    break;
                case 5:
                    jack.ai -= 5;
                    break;
                case 6:
                    sean.ai -= 5;
                    break;
            }
            mainNeedsRebuild = true;
        }
    }
}
michael.tick = function() {
    if (michael.ai == 20) {
        michael.timeSinceLastFlickerChance += deltaTime;
        if (michael.timeSinceLastFlickerChance >= 5000) {
            michael.timeSinceLastFlickerChance = 0;
            if (random() < michael.ai / 40) {
                michael.update();
                if (level == "main") {
                    flickerTimer = 500;
                    soundHolder.michaelFlicker.play();
                    let moveExecuted = false;
                    for (let i of moveQueue) {
                        i[0].position = i[1];
                        i[0].active = 1; // make the character active again after their move has been executed
                        debugLog("Executed a move in the move queue for " + i[0].name + ", their new position is " + i[1]);
                        moveExecuted = true;
                    }
                    if (moveExecuted) {
                        mainNeedsRebuild = true;
                        cam2NeedsRebuild = true;
                        cam9NeedsRebuild = true;
                        playWalkingSound();
                    }
                    moveQueue = [];
                }
            }
        }
    }
}

class CamButton {
    constructor(xPos, yPos, camNum) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.camNum = camNum;
        this.disabled = false;
        this.activeClock = 0;
    }

    draw() {
        push();
        if (currentCam == this.camNum) {
            this.activeClock += deltaTime;
            if (this.activeClock > 2000) {
                this.activeClock = 0;
            }
            if (this.activeClock > 1000) {
                fill(96, 150, 96, 180);
            } else {
                fill(96, 96, 96, 180);
            }
        } else {
            fill(96, 96, 96, 180);
        }
        stroke(255);
        strokeWeight(GAME_WIDTH * 0.0025);
        rect(this.xPos * GAME_WIDTH, this.yPos * GAME_HEIGHT, 0.06 * GAME_WIDTH, 0.06 * GAME_HEIGHT);
        pop();
        push();
        textSize(0.018 * GAME_WIDTH);
        textFont(mainFont);
        fill(255);
        text("Cam" + (this.camNum).toString().padStart(2, '0'), this.xPos * GAME_WIDTH + 0.003 * GAME_WIDTH, this.yPos * GAME_HEIGHT + 0.055 * GAME_HEIGHT);
        pop();
    }

    checkClicked() {
        if (mouseX > this.xPos * GAME_WIDTH && mouseX < (this.xPos + 0.06) * GAME_WIDTH && mouseY > this.yPos * GAME_HEIGHT && mouseY < (this.yPos + 0.06) * GAME_HEIGHT) {
            return true;
        }
        return false;
    }
}

class CamTool {
    constructor(xPos, yPos, text) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.GAME_WIDTH = 0.15;
        this.GAME_HEIGHT = 0.1;
        this.text = text;
    }

    draw() {
        push();
        fill(96, 96, 96, 180);
        stroke(255);
        strokeWeight(5);
        rect(this.xPos * GAME_WIDTH, this.yPos * GAME_HEIGHT, this.GAME_WIDTH * GAME_WIDTH, this.GAME_HEIGHT * GAME_HEIGHT);
        pop();
        push();
        textSize(0.03 * GAME_WIDTH);
        textFont(mainFont);
        fill(255);
        textLeading(0.04 * GAME_HEIGHT);
        text(this.text, this.xPos * GAME_WIDTH + 0.003 * GAME_WIDTH, this.yPos * GAME_HEIGHT + 0.05 * GAME_HEIGHT);
        pop();
    }

    checkClicked() {
        if (mouseX > this.xPos * GAME_WIDTH && mouseX < (this.xPos + this.GAME_WIDTH) * GAME_WIDTH && mouseY > this.yPos * GAME_HEIGHT && mouseY < (this.yPos + this.GAME_HEIGHT) * GAME_HEIGHT) {
            return true;
        }
        return false;
    }
}

class PanelButton {
    constructor(text, row) {
        this.text = text;
        this.row = row;
        this.offset = GAME_HEIGHT * 0.05 * row;
        this.bbox = mainFont.textBounds(this.text, 0.55 * GAME_WIDTH, 0.4 * GAME_HEIGHT + this.offset, 0.018 * GAME_WIDTH);
        this.actionTimer = 0;
    }

    draw() {
        push();
        textSize(0.018 * GAME_WIDTH);
        textFont(mainFont);
        fill(255);
        let addition = " ";
        if (this.actionTimer > 0) {
            let numDots = 3 - floor(this.actionTimer / 333) % 3;
            for (let i = 0; i < numDots; i++) {
                addition += ".";
            }
        }
        text(this.text + addition, 0.55 * GAME_WIDTH, 0.4 * GAME_HEIGHT + this.offset);
        pop();
    }

    checkClicked() {
        if (mouseX > this.bbox.x && mouseX < this.bbox.x + this.bbox.w && mouseY > this.bbox.y && mouseY < this.bbox.y + this.bbox.h) {
            return true;
        }
        return false;
    }

    tick() {
        if (this.actionTimer > 0) {
            this.actionTimer = max(0, this.actionTimer - deltaTime);
        }
    }
}

class MenuButton {
    constructor(text, xPos, yPos) {
        this.text = text;
        this.xPos = xPos;
        this.yPos = yPos;
        this.visible = true;
        this.bbox = mainFont.textBounds(this.text, this.xPos * GAME_WIDTH, this.yPos * GAME_HEIGHT, 0.03 * GAME_WIDTH);
    }

    draw() {
        if (!this.visible) {
            return;
        }
        push();
        textSize(0.03 * GAME_WIDTH);
        if (this.checkClicked()) {
            fill(200);
        } else {
            fill(255);
        }
        textFont(mainFont);
        text(this.text, this.xPos * GAME_WIDTH, this.yPos * GAME_HEIGHT);
        pop();
    }

    checkClicked() {
        if (mouseX > this.bbox.x && mouseX < this.bbox.x + this.bbox.w && mouseY > this.bbox.y && mouseY < this.bbox.y + this.bbox.h) {
            return true;
        }
        return false;
    }
}

function loadImageWrapper(path) {
    return loadImage(path, assetLoaded);
}

function loadSoundWrapper(path) {
    return loadSound(path, assetLoaded);
}

function preload() {
    mainFont = loadFont("assets/VCR_OSD_MONO.ttf", assetLoaded);
    debugLog("Loading images...")
    cameraMap = loadImageWrapper("assets/images/cameras.png");

    // load the cams
    abdullahCam[0] = loadImageWrapper("assets/images/abdullah/frame0.webp");
    abdullahCam[1] = loadImageWrapper("assets/images/abdullah/frame1.webp");
    abdullahCam[2] = loadImageWrapper("assets/images/abdullah/frame2.webp");
    abdullahCam[3] = loadImageWrapper("assets/images/abdullah/frame3.webp");
    abdullahCam[4] = loadImageWrapper("assets/images/abdullah/frame4.webp");
    abdullahCam[5] = loadImageWrapper("assets/images/abdullah/frame5.webp");
    abdullahCam[6] = loadImageWrapper("assets/images/abdullah/frame6.webp");
    abdullahCam[7] = loadImageWrapper("assets/images/abdullah/frame7.webp");
    abdullahCam[8] = loadImageWrapper("assets/images/abdullah/frame8.webp");

    abdullahVentCam[0] = loadImageWrapper("assets/images/abdullahVent/frame0.webp");
    abdullahVentCam[1] = loadImageWrapper("assets/images/abdullahVent/frame1.webp");
    abdullahVentCam[2] = loadImageWrapper("assets/images/abdullahVent/frame2.webp");

    //change to webp
    aidanCam[0] = loadImageWrapper("assets/images/aidan/frame0.webp");
    aidanCam[1] = loadImageWrapper("assets/images/aidan/frame1.webp");
    aidanCam[2] = loadImageWrapper("assets/images/aidan/frame2.webp");
    aidanCam[3] = loadImageWrapper("assets/images/aidan/frame3.webp");
    aidanCam[4] = loadImageWrapper("assets/images/aidan/frame4.webp");
    aidanCam[5] = loadImageWrapper("assets/images/aidan/frame5.webp");
    aidanCam[6] = loadImageWrapper("assets/images/aidan/frame6.webp");
    aidanCam[7] = loadImageWrapper("assets/images/aidan/frame7.webp");
    aidanCam[8] = loadImageWrapper("assets/images/aidan/frame8.webp");
    aidanCam[9] = loadImageWrapper("assets/images/aidan/frame9.webp");
    aidanCam[10] = loadImageWrapper("assets/images/aidan/frameEmpty.webp");

    alexCam[0] = loadImageWrapper("assets/images/alex/frame0.webp");
    alexCam[1] = loadImageWrapper("assets/images/alex/frame1.webp");
    alexCam[2] = loadImageWrapper("assets/images/alex/frame2.webp");
    alexCam[3] = loadImageWrapper("assets/images/alex/frame3.webp");
    alexCam[4] = loadImageWrapper("assets/images/alex/frame4.webp");
    alexCam[5] = loadImageWrapper("assets/images/alex/frame5.webp");
    alexCam[6] = loadImageWrapper("assets/images/alex/frame6.webp");

    alexHacker = loadImageWrapper("assets/images/frameHacker.png");

    darrenCam = loadImageWrapper("assets/images/darren/frame0.webp");
    darrenInDarrenCam[0] = loadImageWrapper("assets/images/darren/frame1d.webp");
    darrenInDarrenCam[1] = loadImageWrapper("assets/images/darren/frame2d.webp");
    darrenInDarrenCam[2] = loadImageWrapper("assets/images/darren/frame3d.webp");
    evanInDarrenCam[0] = loadImageWrapper("assets/images/darren/frame1e.webp");
    evanInDarrenCam[1] = loadImageWrapper("assets/images/darren/frame2e.webp");
    evanInDarrenCam[2] = loadImageWrapper("assets/images/darren/frame3e.webp");

    darrenVentCam[0] = loadImageWrapper("assets/images/darrenVent/frame0.webp");
    darrenVentCam[1] = loadImageWrapper("assets/images/darrenVent/frame1.webp");
    darrenVentCam[2] = loadImageWrapper("assets/images/darrenVent/frame2.webp");

    evanCam[0] = loadImageWrapper("assets/images/evan/frame0.webp");
    evanCam[1] = loadImageWrapper("assets/images/evan/frame1.webp");
    evanCam[2] = loadImageWrapper("assets/images/evan/frame2.webp");
    evanCam[3] = loadImageWrapper("assets/images/evan/frame3.webp");

    hallwayCam = loadImageWrapper("assets/images/hallway/frame0.webp");
    evanInHallwayCam[0] = loadImageWrapper("assets/images/hallway/frame1e.webp");
    evanInHallwayCam[1] = loadImageWrapper("assets/images/hallway/frame2e.webp");
    evanInHallwayCam[2] = loadImageWrapper("assets/images/hallway/frame3e.webp");
    seanInHallwayCam[0] = loadImageWrapper("assets/images/hallway/frame1s.webp");
    seanInHallwayCam[1] = loadImageWrapper("assets/images/hallway/frame2s.webp");
    seanInHallwayCam[2] = loadImageWrapper("assets/images/hallway/frame3s.webp");

    jackCam[0] = loadImageWrapper("assets/images/jack/frame0.webp");
    jackCam[1] = loadImageWrapper("assets/images/jack/frame1.webp");
    jackCam[2] = loadImageWrapper("assets/images/jack/frame2.webp");
    jackCam[3] = loadImageWrapper("assets/images/jack/frame3.webp");
    jackCam[4] = loadImageWrapper("assets/images/jack/frame4.webp");
    jackCam[5] = loadImageWrapper("assets/images/jack/frame5.webp");
    jackCam[6] = loadImageWrapper("assets/images/jack/frame6.webp");

    sahilCam[0] = loadImageWrapper("assets/images/sahil/frame0.png");
    sahilCam[1] = loadImageWrapper("assets/images/sahil/frame1.png");

    seanCam[0] = loadImageWrapper("assets/images/sean/frame0.png");
    seanCam[1] = loadImageWrapper("assets/images/sean/frame1.png");
    seanCam[2] = loadImageWrapper("assets/images/sean/frame2.png");
    seanCam[3] = loadImageWrapper("assets/images/sean/frame3.png");
    seanSecret = loadImageWrapper("assets/images/sean/frame2s_secret.png");

    mainView = loadImageWrapper("assets/images/main/main.webp");

    darrenInMainView[0] = loadImageWrapper("assets/images/main/framed1.webp");
    darrenInMainView[1] = loadImageWrapper("assets/images/main/framed2.webp");

    seanInMainView[0] = loadImageWrapper("assets/images/main/frames1.webp");
    seanInMainView[1] = loadImageWrapper("assets/images/main/frames2.webp");
    seanInMainView[2] = loadImageWrapper("assets/images/main/frames3.webp");
    seanInMainView[3] = loadImageWrapper("assets/images/main/frames4.webp");

    evanInMainView[0] = loadImageWrapper("assets/images/main/framee1.webp");
    evanInMainView[1] = loadImageWrapper("assets/images/main/framee2.webp");

    ventOpen = loadImageWrapper("assets/images/main/ventOpen.webp");

    michaelInOffice = loadImageWrapper("assets/images/michaelInOffice.webp");

    mainFont = loadFont("assets/VCR_OSD_MONO.ttf");

    camUp[0] = loadImageWrapper("assets/images/camUp/camUp (1).webp");
    camUp[1] = loadImageWrapper("assets/images/camUp/camUp (2).webp");
    camUp[2] = loadImageWrapper("assets/images/camUp/camUp (3).webp");
    camUp[3] = loadImageWrapper("assets/images/camUp/camUp (4).webp");
    camUp[4] = loadImageWrapper("assets/images/camUp/camUp (5).webp");
    camUp[5] = loadImageWrapper("assets/images/camUp/camUp (6).webp");
    camUp[6] = loadImageWrapper("assets/images/camUp/camUp (7).webp");
    camUp[7] = loadImageWrapper("assets/images/camUp/camUp (8).webp");
    camUp[8] = loadImageWrapper("assets/images/camUp/camUp (9).webp");
    camUp[9] = loadImageWrapper("assets/images/camUp/camUp (10).webp");

    camDown[0] = loadImageWrapper("assets/images/camDown/camDown (1).webp");
    camDown[1] = loadImageWrapper("assets/images/camDown/camDown (2).webp");
    camDown[2] = loadImageWrapper("assets/images/camDown/camDown (3).webp");
    camDown[3] = loadImageWrapper("assets/images/camDown/camDown (4).webp");
    camDown[4] = loadImageWrapper("assets/images/camDown/camDown (5).webp");
    camDown[5] = loadImageWrapper("assets/images/camDown/camDown (6).webp");
    camDown[6] = loadImageWrapper("assets/images/camDown/camDown (7).webp");
    camDown[7] = loadImageWrapper("assets/images/camDown/camDown (8).webp");

    opaqueStatic[0] = loadImageWrapper("assets/images/opaqueStatic/staticVid (1).webp");
    opaqueStatic[1] = loadImageWrapper("assets/images/opaqueStatic/staticVid (2).webp");
    opaqueStatic[2] = loadImageWrapper("assets/images/opaqueStatic/staticVid (3).webp");
    opaqueStatic[3] = loadImageWrapper("assets/images/opaqueStatic/staticVid (4).webp");
    opaqueStatic[4] = loadImageWrapper("assets/images/opaqueStatic/staticVid (5).webp");
    opaqueStatic[5] = loadImageWrapper("assets/images/opaqueStatic/staticVid (6).webp");
    opaqueStatic[6] = loadImageWrapper("assets/images/opaqueStatic/staticVid (7).webp");
    opaqueStatic[7] = loadImageWrapper("assets/images/opaqueStatic/staticVid (8).webp");
    opaqueStatic[8] = loadImageWrapper("assets/images/opaqueStatic/staticVid (9).webp");
    opaqueStatic[9] = loadImageWrapper("assets/images/opaqueStatic/staticVid (10).webp");
    opaqueStatic[10] = loadImageWrapper("assets/images/opaqueStatic/staticVid (11).webp");
    opaqueStatic[11] = loadImageWrapper("assets/images/opaqueStatic/staticVid (12).webp");
    opaqueStatic[12] = loadImageWrapper("assets/images/opaqueStatic/staticVid (13).webp");
    opaqueStatic[13] = loadImageWrapper("assets/images/opaqueStatic/staticVid (14).webp");
    opaqueStatic[14] = loadImageWrapper("assets/images/opaqueStatic/staticVid (15).webp");
    opaqueStatic[15] = loadImageWrapper("assets/images/opaqueStatic/staticVid (16).webp");
    opaqueStatic[16] = loadImageWrapper("assets/images/opaqueStatic/staticVid (17).webp");
    opaqueStatic[17] = loadImageWrapper("assets/images/opaqueStatic/staticVid (18).webp");
    opaqueStatic[18] = loadImageWrapper("assets/images/opaqueStatic/staticVid (19).webp");
    opaqueStatic[19] = loadImageWrapper("assets/images/opaqueStatic/staticVid (20).webp");

    for (let i = 0; i < 125; i++) {
        deathStatic.push(loadImageWrapper("assets/images/deathStatic/deathStatic (" + (i + 1).toString() + ").webp"));
    }

    //load the menu screen characters, there are 7 options, choose 3 random ones to load for the menu screen
    let menuCharacterOptions = [1, 2, 3, 4, 5, 6, 7];
    shuffle(menuCharacterOptions, true);
    menuCharacters[0][0] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[0] + "/a.webp");
    menuCharacters[0][1] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[0] + "/b.webp");
    menuCharacters[0][2] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[0] + "/c.webp");
    menuCharacters[1][0] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[1] + "/a.webp");
    menuCharacters[1][1] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[1] + "/b.webp");
    menuCharacters[1][2] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[1] + "/c.webp");
    menuCharacters[2][0] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[2] + "/a.webp");
    menuCharacters[2][1] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[2] + "/b.webp");
    menuCharacters[2][2] = loadImageWrapper("assets/images/menu/" + menuCharacterOptions[2] + "/c.webp");

    newsPaper = loadImageWrapper("assets/images/newsPaper.webp");

    debugLog("Finished loading images");

    // load the jumpscares

    debugLog("Loading sounds...");
    //load sounds
    soundHolder.danceMonkeyClose = loadSoundWrapper("assets/sounds/closeDanceMonkey.wav");
    soundHolder.danceMonkeyFar = loadSoundWrapper("assets/sounds/farDanceMonkey.wav");
    soundHolder.musicStop = loadSoundWrapper("assets/sounds/musicStop.wav");
    soundHolder.buzzLoop = loadSoundWrapper("assets/sounds/buzzLoop.wav");
    soundHolder.completeBeep = loadSoundWrapper("assets/sounds/completeBeep.wav");
    soundHolder.buttonPress = loadSoundWrapper("assets/sounds/buttonPress.wav");
    soundHolder.camOpen = loadSoundWrapper("assets/sounds/camOpen.mp3");
    soundHolder.camClose = loadSoundWrapper("assets/sounds/camClose.mp3");
    soundHolder.camSound = loadSoundWrapper("assets/sounds/camSound.wav");
    soundHolder.progressBeep = loadSoundWrapper("assets/sounds/progressBeep.wav");
    soundHolder.panelOpen = loadSoundWrapper("assets/sounds/panelOpen.wav");
    soundHolder.panelClose = loadSoundWrapper("assets/sounds/panelClose.wav");
    soundHolder.mainAmbience = loadSoundWrapper("assets/sounds/mainAmbience.mp3");
    soundHolder.pcStart = loadSoundWrapper("assets/sounds/pcStart.wav");
    soundHolder.pcIdle = loadSoundWrapper("assets/sounds/pcIdle.wav");

    soundHolder.abdullahShorts = []
    soundHolder.abdullahShorts[0] = loadSoundWrapper("assets/sounds/abdullahRot/1.wav");
    soundHolder.abdullahShorts[1] = loadSoundWrapper("assets/sounds/abdullahRot/2.wav");
    soundHolder.abdullahShorts[2] = loadSoundWrapper("assets/sounds/abdullahRot/3.wav");
    soundHolder.abdullahShorts[3] = loadSoundWrapper("assets/sounds/abdullahRot/4.wav");
    soundHolder.abdullahShorts[4] = loadSoundWrapper("assets/sounds/abdullahRot/5.wav");
    soundHolder.abdullahShorts[5] = loadSoundWrapper("assets/sounds/abdullahRot/6.wav");
    soundHolder.abdullahShorts[6] = loadSoundWrapper("assets/sounds/abdullahRot/7.wav");
    soundHolder.abdullahShorts[7] = loadSoundWrapper("assets/sounds/abdullahRot/8.wav");
    soundHolder.abdullahShorts[8] = loadSoundWrapper("assets/sounds/abdullahRot/9.wav");
    soundHolder.abdullahShorts[9] = loadSoundWrapper("assets/sounds/abdullahRot/10.wav");
    soundHolder.abdullahShorts[10] = loadSoundWrapper("assets/sounds/abdullahRot/11.wav");
    soundHolder.abdullahShorts[11] = loadSoundWrapper("assets/sounds/abdullahRot/12.wav");
    soundHolder.abdullahShorts[12] = loadSoundWrapper("assets/sounds/abdullahRot/13.wav");
    soundHolder.abdullahShorts[13] = loadSoundWrapper("assets/sounds/abdullahRot/14.wav");
    soundHolder.abdullahShorts[14] = loadSoundWrapper("assets/sounds/abdullahRot/15.wav");
    soundHolder.abdullahShorts[15] = loadSoundWrapper("assets/sounds/abdullahRot/16.wav");
    soundHolder.abdullahShorts[16] = loadSoundWrapper("assets/sounds/abdullahRot/17.wav");
    soundHolder.abdullahShorts[17] = loadSoundWrapper("assets/sounds/abdullahRot/18.wav");
    soundHolder.abdullahShorts[18] = loadSoundWrapper("assets/sounds/abdullahRot/19.wav");
    soundHolder.abdullahShorts[19] = loadSoundWrapper("assets/sounds/abdullahRot/20.wav");
    soundHolder.abdullahShorts[20] = loadSoundWrapper("assets/sounds/abdullahRot/21.wav");
    soundHolder.abdullahShorts[21] = loadSoundWrapper("assets/sounds/abdullahRot/22.wav");
    for (let i of soundHolder.abdullahShorts) {
        i.setVolume(0.25);
    }
    soundHolder.currentAbdullahShort = soundHolder.abdullahShorts[0]

    soundHolder.walkingSounds = []
    soundHolder.walkingSounds[0] = loadSoundWrapper("assets/sounds/walking1.wav");
    soundHolder.walkingSounds[1] = loadSoundWrapper("assets/sounds/walking2.wav");
    soundHolder.ventWalking = loadSoundWrapper("assets/sounds/ventWalk.mp3");
    soundHolder.ventWalking.setVolume(0.25);

    soundHolder.camSwitch = loadSoundWrapper("assets/sounds/camSwitch.wav");
    soundHolder.camSwitch.setVolume(0.5);

    soundHolder.gargles = []
    soundHolder.gargles[0] = loadSoundWrapper("assets/sounds/Garble1.ogg");
    soundHolder.gargles[1] = loadSoundWrapper("assets/sounds/Garble2.ogg");
    soundHolder.gargles[2] = loadSoundWrapper("assets/sounds/Garble3.ogg");
    soundHolder.gargles[3] = loadSoundWrapper("assets/sounds/Garble4.ogg");
    for (let i of soundHolder.gargles) {
        i.setVolume(0);
    }

    soundHolder.ventClose = loadSoundWrapper("assets/sounds/ventClose.wav");
    soundHolder.seanAppear = loadSoundWrapper("assets/sounds/seanAppear.wav");
    soundHolder.menuMusic = loadSoundWrapper("assets/sounds/menuMusic.mp3");
    soundHolder.menuMusic.setVolume(0.5);

    //character menu buzzes
    soundHolder.menuBuzzes = []
    soundHolder.menuBuzzes[0] = loadSoundWrapper("assets/sounds/char1buzz.wav");
    soundHolder.menuBuzzes[1] = loadSoundWrapper("assets/sounds/char2buzz.wav");
    soundHolder.menuBuzzes[2] = loadSoundWrapper("assets/sounds/char3buzz.wav");

    //death
    soundHolder.jumpscare = loadSoundWrapper("assets/sounds/jumpscare.wav");
    soundHolder.eerie = loadSoundWrapper("assets/sounds/eerie.wav");

    //win
    soundHolder.winSound = loadSoundWrapper("assets/sounds/win.wav");
    soundHolder.nightStartSound = loadSoundWrapper("assets/sounds/nightStart.mp3")

    soundHolder.michaelFlicker = loadSoundWrapper("assets/sounds/flickerMichael.wav");

    //calls
    soundHolder.calls = []
    for (let i = 0; i < 5; i++) {
        soundHolder.calls[i] = loadSoundWrapper("assets/sounds/night" + (i + 1) + ".wav");
    }

    debugLog("Finished loading sounds");

    debugLog("Loading jumpscares...");
    for (let i = 0; i < 30; i++) {
        abdullahJumpscare.push(loadImageWrapper("assets/jumpscares/abdullah/abdullah001080"+i.toString().padStart(2, '0')+".webp"));
    }
    for (let i = 0; i < 30; i++) {
        aidanJumpscare.push(loadImageWrapper("assets/jumpscares/aidan/aidan001080"+i.toString().padStart(2, '0')+".webp"));
    }
    for (let i = 0; i < 30; i++) {
        alexJumpscare.push(loadImageWrapper("assets/jumpscares/alex/alex001080"+i.toString().padStart(2, '0')+".webp"));
    }
    for (let i = 0; i < 30; i++) {
        darrenJumpscare.push(loadImageWrapper("assets/jumpscares/darren/darren001080"+i.toString().padStart(2, '0')+".webp"));
    }
    for (let i = 0; i < 30; i++) {
        evanJumpscare.push(loadImageWrapper("assets/jumpscares/evan/evan001080"+i.toString().padStart(2, '0')+".webp"));
    }
    for (let i = 0; i < 30; i++) {
        jackJumpscare.push(loadImageWrapper("assets/jumpscares/jack/jack001080"+i.toString().padStart(2, '0')+".webp"));
    }
    for (let i = 0; i < 30; i++) {
        seanJumpscare.push(loadImageWrapper("assets/jumpscares/sean/sean001080"+i.toString().padStart(2, '0')+".webp"));
    }
}

function loadImageWrapper(path) {
    return loadImage(path, assetLoaded);
}

function loadSoundWrapper(path) {
    return loadSound(path, assetLoaded);
}

function changeImageDimensions(newWidth, newHeight) {
    //calculate the new mainWidth
    mainWidth = newWidth * 1.2953125

    cameraMap.resize(newWidth * 0.703125, newHeight);
    for (let i = 0; i < abdullahCam.length; i++) {
        abdullahCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < abdullahVentCam.length; i++) {
        abdullahVentCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < aidanCam.length; i++) {
        aidanCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < alexCam.length; i++) {
        alexCam[i].resize(newWidth, newHeight);
    }
    darrenCam.resize(newWidth, newHeight);
    for (let i = 0; i < darrenInDarrenCam.length; i++) {
        darrenInDarrenCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < evanInDarrenCam.length; i++) {
        evanInDarrenCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < darrenVentCam.length; i++) {
        darrenVentCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < evanCam.length; i++) {
        evanCam[i].resize(newWidth, newHeight);
    }
    hallwayCam.resize(newWidth, newHeight);
    for (let i = 0; i < evanInHallwayCam.length; i++) {
        evanInHallwayCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < seanInHallwayCam.length; i++) {
        seanInHallwayCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < jackCam.length; i++) {
        jackCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < sahilCam.length; i++) {
        sahilCam[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < seanCam.length; i++) {
        seanCam[i].resize(newWidth, newHeight);
    }
    mainView.resize(mainWidth, newHeight);
    for (let i = 0; i < darrenInMainView.length; i++) {
        darrenInMainView[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < seanInMainView.length; i++) {
        seanInMainView[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < evanInMainView.length; i++) {
        evanInMainView[i].resize(newWidth, newHeight);
    }
    ventOpen.resize(newWidth, newHeight);
    michaelInOffice.resize(newWidth, newHeight);
    for (let i = 0; i < camUp.length; i++) {
        camUp[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < camDown.length; i++) {
        camDown[i].resize(newWidth, newHeight);
    }

    //resize the jumpscares
    for (let i = 0; i < abdullahJumpscare.length; i++) {
        abdullahJumpscare[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < aidanJumpscare.length; i++) {
        aidanJumpscare[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < alexJumpscare.length; i++) {
        alexJumpscare[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < darrenJumpscare.length; i++) {
        darrenJumpscare[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < evanJumpscare.length; i++) {
        evanJumpscare[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < jackJumpscare.length; i++) {
        jackJumpscare[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < seanJumpscare.length; i++) {
        seanJumpscare[i].resize(newWidth, newHeight);
    }

    //resize static
    for (let i = 0; i < deathStatic.length; i++) {
        deathStatic[i].resize(newWidth, newHeight);
    }
    for (let i = 0; i < opaqueStatic.length; i++) {
        opaqueStatic[i].resize(newWidth, newHeight);
    }

    //resize menu characters
    for (let i = 0; i < menuCharacters.length; i++) {
        for (let j = 0; j < menuCharacters[i].length; j++) {
            let tempHeight = newHeight * (1 + (1 + i) * 0.1);
            let tempWidth = tempHeight / 1.25;
            menuCharacters[i][j].resize(tempWidth, tempHeight);
        }
    }

    newsPaper.resize(newWidth, newHeight);

    //create buffers
    mainBuffer = createGraphics(mainWidth, GAME_HEIGHT);
    rebuildMainBuffer();

    //create composited camera buffers for multi-character cams
    cam2Buffer = createGraphics(GAME_WIDTH, GAME_HEIGHT);
    cam9Buffer = createGraphics(GAME_WIDTH, GAME_HEIGHT);
    rebuildCam2Buffer();
    rebuildCam9Buffer();

    //create camera activate buffer
    camActivateBuffer = createGraphics(GAME_WIDTH, GAME_HEIGHT);
    camActivateBuffer.fill(0, 0, 0, 0);
    camActivateBuffer.stroke(200);
    camActivateBuffer.strokeWeight(GAME_WIDTH * 0.0025);
    camActivateBuffer.rect(GAME_WIDTH * 0.225, GAME_HEIGHT * 0.9, GAME_WIDTH * 0.35, GAME_HEIGHT * 0.2, GAME_WIDTH * 0.02);
    camActivateBuffer.line(GAME_WIDTH * 0.4, GAME_HEIGHT * 0.925, GAME_WIDTH * 0.25, GAME_HEIGHT * 0.95);
    camActivateBuffer.line(GAME_WIDTH * 0.4, GAME_HEIGHT * 0.925, GAME_WIDTH * 0.55, GAME_HEIGHT * 0.95);
    camActivateBuffer.line(GAME_WIDTH * 0.4, GAME_HEIGHT * 0.945, GAME_WIDTH * 0.25, GAME_HEIGHT * 0.97);
    camActivateBuffer.line(GAME_WIDTH * 0.4, GAME_HEIGHT * 0.945, GAME_WIDTH * 0.55, GAME_HEIGHT * 0.97);

    //create panel activate buffer
    panelActivateBuffer = createGraphics(mainWidth, GAME_HEIGHT);
    panelActivateBuffer.fill(0, 0, 0, 0);
    panelActivateBuffer.stroke(200);
    panelActivateBuffer.strokeWeight(GAME_WIDTH * 0.0025);
    panelActivateBuffer.rect(mainWidth - 0.1 * GAME_HEIGHT, GAME_HEIGHT * 0.4, GAME_HEIGHT * 0.2, GAME_HEIGHT * 0.2, GAME_WIDTH * 0.02);
    panelActivateBuffer.line(mainWidth - 0.05 * GAME_HEIGHT, GAME_HEIGHT * 0.5, mainWidth - 0.02 * GAME_HEIGHT, GAME_HEIGHT * 0.55);
    panelActivateBuffer.line(mainWidth - 0.05 * GAME_HEIGHT, GAME_HEIGHT * 0.5, mainWidth - 0.02 * GAME_HEIGHT, GAME_HEIGHT * 0.45);
    panelActivateBuffer.line(mainWidth - 0.075 * GAME_HEIGHT, GAME_HEIGHT * 0.5, mainWidth - 0.045 * GAME_HEIGHT, GAME_HEIGHT * 0.55);
    panelActivateBuffer.line(mainWidth - 0.075 * GAME_HEIGHT, GAME_HEIGHT * 0.5, mainWidth - 0.045 * GAME_HEIGHT, GAME_HEIGHT * 0.45);
}

function setup() {
    console.log(assetsLoaded);
    const canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
    canvas.parent("game-root");

    // Delay DOM lookup until setup so the element exists reliably.
    staticOverlay = document.getElementById("static");
    
    // Performance optimizations
    pixelDensity(1); // Prevent high-DPI displays from rendering 4x pixels
    frameRate(60);   // Set explicit target framerate
    
    //shift all the x positions by 0.005 to the right
    camButtons.push(new CamButton(0.539, 0.363, 1));
    camButtons.push(new CamButton(0.607, 0.416, 2));
    camButtons.push(new CamButton(0.693, 0.365, 3));
    camButtons.push(new CamButton(0.761, 0.365, 4));
    camButtons.push(new CamButton(0.869, 0.421, 5));
    camButtons.push(new CamButton(0.845, 0.551, 6));
    camButtons.push(new CamButton(0.675, 0.503, 7));
    camButtons.push(new CamButton(0.578, 0.528, 8));
    camButtons.push(new CamButton(0.578, 0.625, 9));
    camButtons.push(new CamButton(0.688, 0.721, 10));
    camButtons.push(new CamButton(0.748, 0.796, 11));

    //create cam buttons
    ventLight = new CamTool(0.825, 0.85, "Light");

    //create panel buttons
    playMusic = new PanelButton("> Play Music", 0);
    playMusicEvan = new PanelButton("> Cam 4", 0);
    playMusicDarren = new PanelButton("> Cam 9", 1);
    playMusicBack = new PanelButton("> Back", 2);
    
    deliverBeer = new PanelButton("> Deliver Beer", 1);
    confirmBeer = new PanelButton("> Confirm Beer Delivery", 0);
    beerBack = new PanelButton("> Back", 1);

    manageInternet = new PanelButton("> Manage Network", 2);
    resetInternet = new PanelButton("> Reset Network", 0);
    scanInternet = new PanelButton("> Scan Network", 1);
    internetBack = new PanelButton("> Back", 2);

    orderPizza = new PanelButton("> Order Pizza", 3);
    confirmPizza = new PanelButton("> Confirm Pizza Order", 0);
    pizzaBack = new PanelButton("> Back", 1);

    debugLog("Resizing images...")
    changeImageDimensions(GAME_WIDTH, GAME_HEIGHT);
    debugLog("Finished resizing images");

    debugLog(JSON.stringify(nights))

    previousSeanPosition = sean.position;
    previousEvanPosition = evan.position;
    previousDarrenPosition = darren.position;

    //menu buttons
    menuButtons.push(new MenuButton("New game", 0.05, 0.5));
    menuButtons.push(new MenuButton("Custom night", 0.05, 0.7));
    menuButtons.push(new MenuButton("Confirm?", 0.25, 0.5));
    menuButtons[2].visible = false;

    //phone call button
    endCallButton = new CamTool(0.05, 0.05, "End Call");

    //call the loader one last time to make sure everything is loaded before starting the game
    assetLoaded();
}

function draw() {
    switch (menu) {
        case "main":
            //draw main menu
            background(20);
            //draw the characters
            char1Timer -= deltaTime;
            char2Timer -= deltaTime;
            char3Timer -= deltaTime;
            if (char1Timer <= 0 && !char1Twitching) {
                char1Timer = random(50, 100);
                char1Twitching = floor(random(1, 3));
                soundHolder.menuBuzzes[0].loop();
            } else if (char1Timer <= 0 && char1Twitching) {
                char1Timer = random(1000, 5000);
                char1Twitching = 0;
                soundHolder.menuBuzzes[0].stop();
            }
            if (char2Timer <= 0 && !char2Twitching) {
                char2Timer = random(50, 100);
                char2Twitching = floor(random(1, 3));
                soundHolder.menuBuzzes[1].loop();
            } else if (char2Timer <= 0 && char2Twitching) {
                char2Timer = random(1000, 5000);
                char2Twitching = 0;
                soundHolder.menuBuzzes[1].stop();
            }
            if (char3Timer <= 0 && !char3Twitching) {
                char3Timer = random(50, 100);
                char3Twitching = floor(random(1, 3));
                soundHolder.menuBuzzes[2].loop();
            } else if (char3Timer <= 0 && char3Twitching) {
                char3Timer = random(1000, 5000);
                char3Twitching = 0;
                soundHolder.menuBuzzes[2].stop();
            }

            //draw char 1
            if (char1Twitching == 0) {
                image(menuCharacters[0][0], GAME_WIDTH * 0.3, 0);
            } else if (char1Twitching == 1) {
                image(menuCharacters[0][1], GAME_WIDTH * 0.3, 0);
            } else if (char1Twitching == 2) {
                image(menuCharacters[0][2], GAME_WIDTH * 0.3, 0);
            }

            //draw char 2
            if (char2Twitching == 0) {
                image(menuCharacters[1][0], GAME_WIDTH * 0.5, GAME_HEIGHT * 0.025);
            } else if (char2Twitching == 1) {
                image(menuCharacters[1][1], GAME_WIDTH * 0.5, GAME_HEIGHT * 0.025);
            } else if (char2Twitching == 2) {
                image(menuCharacters[1][2], GAME_WIDTH * 0.5, GAME_HEIGHT * 0.025);
            }

            //draw char 3
            if (char3Twitching == 0) {
                image(menuCharacters[2][0], GAME_WIDTH * 0.7, GAME_HEIGHT * 0.05);
            } else if (char3Twitching == 1) {
                image(menuCharacters[2][1], GAME_WIDTH * 0.7, GAME_HEIGHT * 0.05);
            } else if (char3Twitching == 2) {
                image(menuCharacters[2][2], GAME_WIDTH * 0.7, GAME_HEIGHT * 0.05);
            }

            textSize(0.05 * GAME_WIDTH);
            textFont(mainFont);
            fill(255);
            text("Five Nights\nUntil Wednesday", 0.05 * GAME_WIDTH, 0.15 * GAME_WIDTH)
            for (let i of menuButtons) {
                i.draw();
            }

            if (menuTransitionTimer > 0) {
                menuTransitionTimer -= deltaTime;
                fill(0, 0, 0, map(menuTransitionTimer, 2000, 0, 0, 255));
                rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                if (menuTransitionTimer <= 0) {
                    if (night == 1 && !hasSeenNews) {
                        newsPaperTransitionInTimer = 2000;
                        menu = "news";
                        hasSeenNews = true;
                    } else {
                        loadNight(night)
                        menu = "nightDescription";
                        nightDescriptionTimer = 5000; // Show the night description for 5 seconds
                        soundHolder.nightStartSound.play();
                    }
                    setCameraOverlay(false);
                    for (let i of soundHolder.menuBuzzes) {
                        if (i.isPlaying()) {
                            i.stop()
                        }
                    }
                    soundHolder.menuMusic.stop();
                }
            }
            break;
        case "news":
            image(newsPaper, 0, 0);

            if (newsPaperTransitionInTimer > 0) {
                newsPaperTransitionInTimer -= deltaTime;
                fill(0, 0, 0, map(newsPaperTransitionInTimer, 2000, 0, 255, 0));
                rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                if (newsPaperTransitionInTimer <= 0) {
                    newsPaperTransitionInTimer = 0;
                    newsPaperTimer = 8000; // Show the newspaper for 8 seconds
                }
            } else if (newsPaperTimer > 0) {
                newsPaperTimer -= deltaTime;
                if (newsPaperTimer <= 0) {
                    newsPaperTimer = 0;
                    newsPaperTransitionOutTimer = 2000; // Start fade to black
                }
            } else if (newsPaperTransitionOutTimer > 0) {
                newsPaperTransitionOutTimer -= deltaTime;
                fill(0, 0, 0, map(newsPaperTransitionOutTimer, 2000, 0, 0, 255));
                rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                if (newsPaperTransitionOutTimer <= 0) {
                    newsPaperTransitionOutTimer = 0;
                    //enter night description
                    menu = "nightDescription";
                    loadNight(night)
                    nightDescriptionTimer = 5000; // Show the night description for 5 seconds
                    soundHolder.nightStartSound.play();
                }
            }
            break;
        case "nightDescription":
            background(0);
            //draw night and night description
            push();
            textAlign(CENTER, CENTER);
            fill(255);
            textSize(GAME_WIDTH * 0.05);
            textFont(mainFont)
            text("Night " + night, GAME_WIDTH / 2, GAME_HEIGHT / 2 - (GAME_HEIGHT * 0.1));
            textSize(GAME_WIDTH * 0.025);
            text('"'+nightDescription+'"', GAME_WIDTH/2, GAME_HEIGHT/2);
            textSize(GAME_WIDTH*0.05);
            text("12:00 AM", GAME_WIDTH/2, GAME_HEIGHT/2 + (GAME_HEIGHT*0.1));
            pop();

            if (nightDescriptionTimer > 0) {
                nightDescriptionTimer -= deltaTime;
                if (nightDescriptionTimer <= 0) {
                    nightDescriptionTimer = 0;
                    //start the game
                    menuButtons[2].visible = false;
                    menuButtons[2].text = "Confirm?"
                    menu = "game";
                    if (night >= 1 && night <= 5) {
                        soundHolder.calls[night - 1].play();
                        phoneCalling = true;
                    }
                    soundHolder.mainAmbience.loop();
                    menuButtons[0].text = "Continue";
                }
            }

            break;
        case "game":
            if (flickerTimer > 0) {
                flickerTimer -= deltaTime;
            }
            if (camSwitchTimer > 0) {
                camSwitchTimer = max(camSwitchTimer - deltaTime, 0);
            }
            if (camsDisabledTimer > 0) {
                camsDisabledTimer = max(camsDisabledTimer - deltaTime, 0);
            }
            if (forceJumpscareTimer > 0) {
                forceJumpscareTimer -= deltaTime;
                if (forceJumpscareTimer < 0) {
                    if (level == "cameras") {
                        mouseLeftCamActivateButton = false;
                        camFlipDownTimer = 200;
                        jumpscareTimer = 200;
                        currentTranslate = 0;
                        level = "main";
                        setCameraOverlay(false);
                        for (let i of soundHolder.gargles) {
                            i.setVolume(0);
                        }
                        updateDanceMonkeyAudio();
                        soundHolder.camSound.stop();
                        soundHolder.camClose.play();
                    }
                } else if (level == "main" && forceJumpscareTimer <= 5000) {
                    forceJumpscareTimer = 0;
                    jumpscareTimer = 200;
                }
            }
            if (jumpscareTimer > 0) {
                jumpscareTimer -= deltaTime;
                currentTranslate -= 1000 * deltaTime / 1000;
                currentTranslate = constrain(currentTranslate, 0, mainWidth - GAME_WIDTH);
                if (jumpscareTimer <= 0) {
                    stopAllSounds();
                    //play the jumpscare
                    menu = "dead";
                    soundHolder.jumpscare.play();
                    scareTimer = 1000;
                    jumpscareShakeTimer = 0;
                    jumpscareBurstFired = false;
                    debugLog("You have died to " + jumpscareQueue)
                }
                
            }
            //if sean has an attack queued, tick it
            if (sean.forceAttackTimer > 0) {
                sean.forceAttackTimer -= deltaTime;
                if (sean.forceAttackTimer <= 0) {
                    //force down the camera and start seans attack
                    mouseLeftCamActivateButton = false;
                    camFlipDownTimer = 200;
                    currentTranslate = 0;
                    level = "main";
                    setCameraOverlay(false);
                    for (let i of soundHolder.gargles) {
                        i.setVolume(0);
                    }
                    updateDanceMonkeyAudio();
                    soundHolder.camSound.stop();
                    soundHolder.camClose.play();
                    sean.attackPrevented = false;
                    sean.killTimer = 2000 - sean.ai * 50;
                    soundHolder.seanAppear.play();
                    sean.attackQueued = false;
                }
            }
            if (sean.attackRecoveryTimer > 0) {
                sean.attackRecoveryTimer -= deltaTime;
                if (sean.attackRecoveryTimer <= 0) {
                    if (!sean.attackPrevented) {
                        jumpscareQueue = "sean";
                        forceJumpscareTimer = random(5000, 10000); // if the jumpscare doesn't execute within 5 seconds, it will force execute
                    }
                    // Always clear this flag after recovery so the next Sean attack starts clean.
                    sean.attackPrevented = false;
                }
            }

            // update the move queue, move queue is only used for characters that are moving to / from the main view.
            if ((level != "main" && moveQueue.length > 0) || (level == "main" && currentTranslate == mainWidth - GAME_WIDTH)) {
                let moveExecuted = false;
                for (let i of moveQueue) {
                    i[0].position = i[1];
                    i[0].active = 1; // make the character active again after their move has been executed
                    debugLog("Executed a move in the move queue for " + i[0].name + ", their new position is " + i[1]);
                    moveExecuted = true;
                }
                if (moveExecuted) {
                    mainNeedsRebuild = true;
                    cam2NeedsRebuild = true;
                    cam9NeedsRebuild = true;
                    playWalkingSound();
                }
                moveQueue = [];
            }
            // update darren's vent move queue
            if ((!mouseIsPressed || level != "cameras" || currentCam != 11) && darren.moveQueue.length > 0) {
                for (let i of darren.moveQueue) {
                    i[0].position = i[1];
                    i[0].active = 1; // make darren active again after his move has been executed
                    debugLog("Executed a move in darren's vent move queue, his new position is " + i[1]);
                    if (!soundHolder.ventWalking.isPlaying()) {
                        soundHolder.ventWalking.play();
                    }
                }
                darren.moveQueue = [];
            }
            // update abdullah's vent move queue
            if ((!mouseIsPressed || level != "cameras" || currentCam != 10) && abdullah.moveQueue.length > 0) {
                for (let i of abdullah.moveQueue) {
                    i[0].position = i[1];
                    i[0].active = 1; // make abdullah active again after his move has been executed
                    debugLog("Executed a move in abdullah's vent move queue, his new position is " + i[1]);
                    if (!soundHolder.ventWalking.isPlaying()) {
                        soundHolder.ventWalking.play();
                    }
                }
                abdullah.moveQueue = [];
            }

            // update the characters
            //sahil.update();
            abdullah.tick();
            aidan.tick();
            darren.tick();
            sean.tick();
            evan.tick();
            jack.tick();
            if (time != 12) {
                michael.tick();
            }

            //tick alex last since hes based on internet usage
            alex.tick();

            //tick the panel buttons
            resetInternet.tick();
            scanInternet.tick();
            confirmPizza.tick();
            playMusicEvan.tick();
            playMusicDarren.tick();
            confirmBeer.tick();

            // Mark multi-character camera buffers dirty when relevant character positions change.
            if (sean.position != previousSeanPosition || evan.position != previousEvanPosition) {
                cam2NeedsRebuild = true;
            }
            if (darren.position != previousDarrenPosition || evan.position != previousEvanPosition) {
                cam9NeedsRebuild = true;
            }

            previousSeanPosition = sean.position;
            previousEvanPosition = evan.position;
            previousDarrenPosition = darren.position;

            // Rebuild once per frame after all state updates so render uses current data.
            if (mainNeedsRebuild) {
                rebuildMainBuffer();
                mainNeedsRebuild = false;
            }
            if (cam2NeedsRebuild) {
                rebuildCam2Buffer();
                cam2NeedsRebuild = false;
            }
            if (cam9NeedsRebuild) {
                rebuildCam9Buffer();
                cam9NeedsRebuild = false;
            }

            // draw the screen
            switch (level) {
                case "main":
                    // Calculate panning velocity
                    if (jumpscareTimer <= 0) {
                        let vel = 0;
                        if (mouseX < 0.25 * GAME_WIDTH) {
                            vel = map(mouseX, 0, 0.25 * GAME_WIDTH, -1000, -500) * deltaTime / 1000;
                        } else if (mouseX > 0.75 * GAME_WIDTH) {
                            vel = map(mouseX, 0.75 * GAME_WIDTH, GAME_WIDTH, 500, 1000) * deltaTime / 1000;
                        }
                        currentTranslate += vel;
                        currentTranslate = constrain(currentTranslate, 0, mainWidth - GAME_WIDTH);
                    }
                        
                    image(mainBuffer, -currentTranslate, 0);

                    // cams opening (UI elements, no translation needed)
                    image(camActivateBuffer, 0, 0);
                    if (isMouseInCamActivateButton() && mouseLeftCamActivateButton && camFlipDownTimer <= 0 && camFlipUpTimer <= 0) {
                        camFlipUpTimer = 250;
                        seed = floor(random(0, 22));
                        soundHolder.currentAbdullahShort = soundHolder.abdullahShorts[seed];
                        mouseLeftCamActivateButton = false;
                        soundHolder.camOpen.play();
                        //if sean is attacking, stop the attack
                        if (sean.killTimer > 0) {
                            sean.attackPrevented = true;
                            soundHolder.seanAppear.stop();
                        }
                    } else if (!isMouseInCamActivateButton() && !mouseLeftCamActivateButton) {
                        mouseLeftCamActivateButton = true;
                    }
                    if (camFlipUpTimer > 0) {
                        camFlipUpTimer = max(camFlipUpTimer - deltaTime, 0);
                        image(camUp[floor((250 - camFlipUpTimer) / 28)], 0, 0, GAME_WIDTH, GAME_HEIGHT);
                        if (camFlipUpTimer <= 0) {
                            level = "cameras";
                            setCameraOverlay(true);
                            for (let i of soundHolder.gargles) {
                                i.setVolume(0.5);
                            }
                            updateDanceMonkeyAudio();
                            soundHolder.camSound.loop();
                        }
                    }
                    if (camFlipDownTimer > 0) {
                        camFlipDownTimer = max(camFlipDownTimer - deltaTime, 0);
                        image(camDown[floor((200 - camFlipDownTimer) / 28.6)], 0, 0);
                    }

                    // panel opening
                    image(panelActivateBuffer, -currentTranslate, 0);
                    if (isMouseInPanelOpenButton() && mouseLeftPanelOpenButton && panelFlipDownTimer <= 0 && !panelOpen && panelFlipUpTimer <= 0) {
                        panelFlipUpTimer = 200;
                        mouseLeftPanelOpenButton = false;
                        soundHolder.panelOpen.play();
                    } else if (!isMouseInPanelOpenButton() && !mouseLeftPanelOpenButton) {
                        mouseLeftPanelOpenButton = true;
                    }
                    if (panelFlipUpTimer > 0) {
                        panelFlipUpTimer = max(panelFlipUpTimer - deltaTime, 0);
                        // scale the camera opening animation so we can reuse assets
                        push();
                        rotate(-HALF_PI);
                        image(camUp[floor((250 - panelFlipUpTimer) / 28)], -3 * GAME_HEIGHT / 4, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH / 2);
                        pop();
                        if (panelFlipUpTimer <= 0) {
                            panelOpen = true;
                            panelPage = "menu";
                            panelTurnOnTimer = 975;
                            soundHolder.pcStart.play();
                        }
                    }

                    //if the panel is open, draw the panel
                    if (panelOpen) {
                        // Consolidate all panel rendering into one push/pop block
                        push();
                        rotate(-HALF_PI);
                        image(camUp[9], -3 * GAME_HEIGHT / 4, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH / 2);
                        pop();

                        //draw the contents of the panel
                        push();
                        fill (0, 0, 0, 0);
                        stroke(255);
                        strokeWeight(GAME_WIDTH * 0.0025);
                        rect(GAME_WIDTH * 0.5 + GAME_WIDTH * 0.01, GAME_HEIGHT * 0.25 + GAME_WIDTH * 0.01, GAME_WIDTH * 0.5 - GAME_WIDTH * 0.02, GAME_HEIGHT * 0.5 - GAME_WIDTH * 0.02);
                        pop();

                        if (panelTurnOnTimer > 0) {
                            panelTurnOnTimer = max(panelTurnOnTimer - deltaTime, 0);
                            push();
                            //draw startup screen
                            textSize(0.02 * GAME_WIDTH);
                            textAlign(CENTER, CENTER);
                            textFont(mainFont);
                            fill(180);
                            text("Loading", GAME_WIDTH * 0.75, GAME_HEIGHT * 0.5);
                            pop();
                        } else {
                            if (!soundHolder.pcIdle.isPlaying()) {
                                soundHolder.pcIdle.loop();
                            }
                            //draw the computer view and accept inputs
                            switch (panelPage) {
                                case "menu":
                                    if (evan.ai > 0) {
                                        playMusic.draw();
                                    }
                                    if (aidan.ai > 0) {
                                        deliverBeer.draw();
                                    }
                                    if (abdullah.ai > 0) {
                                        manageInternet.draw();
                                    }
                                    if (sahil.ai > 0) {
                                        orderPizza.draw();
                                    }
                                    break;
                                case "manageInternet":
                                    resetInternet.draw();
                                    scanInternet.draw();
                                    internetBack.draw();
                                    //show internet status
                                    //purchase additional internet button
                                    //back button
                                    break;
                                case "orderPizza":
                                    confirmPizza.draw();
                                    pizzaBack.draw();
                                    //if the pizza has not been ordered, show confirm button
                                    //if the pizza has been ordered, show estimated delivery time
                                    //back button
                                    break;
                                case "playMusic":
                                    playMusicEvan.draw();
                                    playMusicDarren.draw();
                                    playMusicBack.draw();
                                    //play music in evans room button
                                    //play music in darren's room button
                                    //back button
                                    break;
                                case "deliverBeer":
                                    confirmBeer.draw();
                                    beerBack.draw();
                                    //show confirm button
                                    //back button
                            }
                            //draw the amount of money you have for pizza and beer
                            push();
                            textSize(0.018 * GAME_WIDTH);
                            textFont(mainFont);
                            fill(255);
                            textAlign(RIGHT, TOP);
                            text("$" + money.toFixed(2), 0.95 * GAME_WIDTH, 0.3 * GAME_HEIGHT);
                            pop();
                        }

                        //check if the mouse leaves the panel, if it does, close the panel
                        if (!isMouseInPanel()) {
                            panelOpen = false;
                            panelFlipDownTimer = 200;
                            soundHolder.panelClose.play();
                            soundHolder.pcStart.stop();
                            soundHolder.pcIdle.stop();
                        }
                    }

                    if (panelFlipDownTimer > 0) {
                        panelFlipDownTimer = max(panelFlipDownTimer - deltaTime, 0);
                        push();
                        rotate(-HALF_PI);
                        image(camDown[floor((200 - panelFlipDownTimer) / 28.6)], -3 * GAME_HEIGHT / 4, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH / 2);
                        pop();
                    }

                    //if sean is attacking, flicker the screen
                    if (sean.killTimer > 0) {
                        fill(0, 0, 0, 20);
                        rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                        fill(0, 0, 0, random(50, 150));
                        rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                    }

                    //if you are recovering from a sean attack, fade the screen back in
                    push();
                    if (sean.attackRecoveryTimer > 0) {
                        fill(0, 0, 0, map(sean.attackRecoveryTimer, 0, 4000, 0, 255));
                        rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                    }
                    pop();

                    //if the screen is flickering from a michael effect, fade the screen back in
                    if (flickerTimer > 0) {
                        fill(0, 0, 0, map(flickerTimer, 0, 500, 0, 255));
                        rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                    }
                    break;
                case "cameras":
                    switch (currentCam) {
                        case 1: //sahil cam
                            image(sahilCam[sahil.position], 0, 0);
                            break;
                        case 2: //hallway cam
                            image(cam2Buffer, 0, 0);
                            break;
                        case 3: //alex cam
                            image(alexCam[alex.position], 0, 0);
                            break;
                        case 4: //evan cam
                            if (evan.position <= 2) {
                                image(evanCam[evan.position], 0, 0);
                            } else {
                                image(evanCam[3], 0, 0);
                            }
                            break;
                        case 5: //aidan cam
                            push();
                            scale(-1, 1);
                            translate(-GAME_WIDTH, 0)
                            image(aidanCam[Math.min(aidan.position, 10)], 0, 0);
                            pop();
                            break;
                        case 6: //sean cam
                            if (sean.position <= 2) {
                                image(seanCam[sean.position], 0, 0);
                            } else {
                                image(seanCam[3], 0, 0);
                            }
                            break;
                        case 7: //abdullah cam
                            if (abdullah.position == 0) {
                                image(abdullahCam[seed % 3], 0, 0);
                                if (!soundHolder.currentAbdullahShort.isPlaying()) {
                                    soundHolder.currentAbdullahShort.loop();
                                }
                            } else if (abdullah.position < 4) {
                                image(abdullahCam[abdullah.position + 4], 0, 0);
                            } else {
                                image(abdullahCam[8], 0, 0);
                            }
                            break;
                        case 8: //jack cam
                            image(jackCam[jack.position], 0, 0);
                            break;
                        case 9: //darren cam
                            image(cam9Buffer, 0, 0);
                            break;
                        case 10: //abdullah vent cam
                            // check if the vent light is on:
                            if (mouseIsPressed && ventLight.checkClicked()) {
                                if (!soundHolder.buzzLoop.isPlaying()) {
                                    soundHolder.buzzLoop.loop();
                                    soundHolder.buttonPress.play();
                                }
                                if (abdullah.position == 5) {
                                    image(abdullahVentCam[1], 0, 0);
                                } else {
                                    image(abdullahVentCam[2], 0, 0);
                                }
                            } else {
                                image(abdullahVentCam[0], 0, 0);
                                if (soundHolder.buzzLoop.isPlaying()) {
                                    soundHolder.buzzLoop.stop();
                                }
                            }
                            break;
                        case 11: //darren vent cam
                            // check if the vent light is on:
                            if (mouseIsPressed && ventLight.checkClicked()) {
                                if (!soundHolder.buzzLoop.isPlaying()) {
                                    soundHolder.buzzLoop.loop();
                                    soundHolder.buttonPress.play();
                                }
                                if (darren.position == 7 || darren.position == 8) {
                                    //darren gets 2 positions in the vent to balance it a bit.
                                    image(darrenVentCam[1], 0, 0);
                                } else {
                                    image(darrenVentCam[2], 0, 0);
                                }
                            } else {
                                image(darrenVentCam[0], 0, 0);
                                if (soundHolder.buzzLoop.isPlaying()) {
                                    soundHolder.buzzLoop.stop();
                                }
                            }
                            break;
                    }
                    //if alex has a target and we are on his cam, draw alex in the cam
                    if (currentCam == alex.target) {
                        imageMode(CENTER);
                        image(alexHacker, random(-GAME_WIDTH * 0.05, GAME_WIDTH + GAME_WIDTH * 0.05), random(-GAME_HEIGHT * 0.05, GAME_HEIGHT + GAME_HEIGHT * 0.05));
                        imageMode(CORNER);
                        alex.calmProgress -= deltaTime;
                        if (alex.calmProgress <= 0) {
                            alex.target = "none";
                            alex.position = 0;
                            internetUsage = 0;
                            alex.killTimer = 0;
                            alex.active = 1;
                            panelPage = "menu";
                            internetUsage = 0;
                            playWalkingSound();
                        }
                    }

                    //draw the overlay static if the cams aren't disabled, there are 61 total frames of static

                    if (camsDisabledTimer > 0) {
                        image(opaqueStatic[floor((camsDisabledTimer % 500) / 25)], 0, 0);
                    }
                    drawCamMap();
                    image(camActivateBuffer, 0, 0);
                    if (isMouseInCamActivateButton() && mouseLeftCamActivateButton) {
                        //roll michael's chance (whenever you flip down the camera)
                        michael.update();
                        mouseLeftCamActivateButton = false;
                        camFlipDownTimer = 200;
                        level = "main";
                        setCameraOverlay(false);
                        for (let i of soundHolder.gargles) {
                            i.setVolume(0);
                        }
                        updateDanceMonkeyAudio();
                        soundHolder.camSound.stop();
                        soundHolder.camClose.play();
                        //if a sean attack is queued, start the attack
                        if (sean.attackQueued) {
                            sean.attackPrevented = false;
                            sean.killTimer = 2000 - sean.ai * 50;
                            sean.attackQueued = false;
                            sean.forceAttackTimer = 0;
                            soundHolder.seanAppear.play();
                        }
                    } else if (!isMouseInCamActivateButton() && !mouseLeftCamActivateButton) {
                        mouseLeftCamActivateButton = true;
                    }
                    if (currentCam == 10 || currentCam == 11) {
                        ventLight.draw();
                    }

                    if (camSwitchTimer > 0) {
                        //randomly draw white rectangles on the screen with varying opacity, similar to fnaf 2 cam switch effect
                        for (let i = 0; i < numRects; i++) {
                            fill(random(128, 255), random(50, 200));
                            noStroke();
                            rect(0, random(-GAME_HEIGHT * 0.2, GAME_HEIGHT), GAME_WIDTH, random(GAME_HEIGHT * 0.05, GAME_HEIGHT * 0.15));
                        }
                    }
                    break;
            }
            //update and draw time
            timeMS += deltaTime;
            if (timeMS >= 60000) {
                timeMS -= 60000;
                incrementTime();
            }
            push();
            textSize(0.05 * GAME_WIDTH);
            textAlign(RIGHT, TOP);
            textFont(mainFont);
            fill(220);
            text(time.toString() + " AM", GAME_WIDTH * 0.95, GAME_HEIGHT * 0.05);
            pop();

            //if a phone call is playing, draw the end call button
            if (phoneCalling) {
                endCallButton.draw();
            }

            break;
        case "dead":
            //draw death screen
            if (scareTimer > 0) {
                // Trigger one burst halfway through the jumpscare.
                if (!jumpscareBurstFired && scareTimer <= 500) {
                    jumpscareBurstFired = true;
                    jumpscareShakeTimer = 180;
                }

                let shakeX = 0;
                let shakeY = 0;
                if (jumpscareShakeTimer > 0) {
                    jumpscareShakeTimer = max(0, jumpscareShakeTimer - deltaTime);
                    let intensity = map(jumpscareShakeTimer, 0, 180, 0, GAME_WIDTH * 0.02);
                    shakeX = random(-intensity, intensity);
                    shakeY = random(-intensity, intensity);
                }

                //draw jumpscare
                let progress = map(scareTimer, 1000, 0, 0, 29);
                switch (jumpscareQueue) {
                    case "aidan":
                        image(aidanJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                    case "alex":
                        image(alexJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                    case "abdullah":
                        image(abdullahJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                    case "darren":
                        image(darrenJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                    case "evan":
                        image(evanJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                    case "jack":
                        image(jackJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                    case "sean":
                        image(seanJumpscare[floor(progress)], shakeX, shakeY);
                        break;
                }
                scareTimer -= deltaTime;
                if (scareTimer <= 0) {
                    deadTimer = 5000;
                    jumpscareShakeTimer = 0;
                    soundHolder.eerie.play();
                }
            } else if (deadTimer > 0) {
                deadTimer -= deltaTime;
                //draw static and gameover screen
                let progress = map(deadTimer, 5000, 0, 0, 124);
                image(deathStatic[floor(progress)], 0, 0)
                if (deadTimer <= 0) {
                    menu = "main";
                    setCameraOverlay(true);
                    //reset the game state
                    resetGame();
                    mainNeedsRebuild = true;
                }
            }
            break;
        case "win":
            //draw win screen
            if (winTimer > 0) {
                winTimer -= deltaTime;
                if (winTimer <= 0) {
                    menu = "nightDescription";
                    loadNight(night)
                    menu = "nightDescription";
                    nightDescriptionTimer = 5000; // Show the night description for 5 seconds
                    soundHolder.nightStartSound.play();
                    resetGame();
                }
            }
            break;
        case "customNight":
            //draw custom night screen
            background(20);
            push();
            textAlign(CENTER, CENTER);
            fill(255);
            textSize(GAME_WIDTH * 0.05);
            textFont(mainFont)
            text("Custom Night (Not implemented yet, also no back button lol)", GAME_WIDTH / 2, GAME_HEIGHT * 0.1);
            break;
    }
    
}

function updateDanceMonkeyAudio() {
    if (evan.target == "evansRoom" && level == "cameras" && currentCam == 4) {
        soundHolder.danceMonkeyClose.setVolume(1);
        soundHolder.danceMonkeyFar.setVolume(0);
    } else if (evan.target == "darrensRoom" && level == "cameras" && currentCam == 9) {
        soundHolder.danceMonkeyClose.setVolume(1);
        soundHolder.danceMonkeyFar.setVolume(0);
    } else {
        soundHolder.danceMonkeyClose.setVolume(0);
        soundHolder.danceMonkeyFar.setVolume(1);
    }

    //im also going to check abdullahs brain rot music here since its also affected by the cameras
    if (level != "cameras" || currentCam != 7) {
        if (soundHolder.currentAbdullahShort.isPlaying()) {
            soundHolder.currentAbdullahShort.stop();
        }
    }
}

function playDanceMonkey() {
    soundHolder.danceMonkeyClose.stop();
    soundHolder.danceMonkeyFar.stop();
    soundHolder.danceMonkeyFar.loop();
    soundHolder.danceMonkeyFar.setVolume(1);
    soundHolder.danceMonkeyClose.loop();
    soundHolder.danceMonkeyClose.setVolume(0);
}

function stopDanceMonkey() {
    soundHolder.danceMonkeyClose.stop();
    soundHolder.danceMonkeyFar.stop();
    soundHolder.musicStop.play();
}

function mouseClicked() {
    //only handle clicks if we are in the main menu or the game
    if (menu == "main" || menu == "game" || menu == "customNight") {
        tryUnlockAudio();

        //this runs when mouse is released
        switch (menu) {
            case "main":
                if (menuButtons[0].checkClicked() && !menuButtons[2].visible) {
                    menuButtons[2].visible = true;
                } else if (menuButtons[2].checkClicked()) {
                    menuTransitionTimer = 2000;
                    if (keyIsDown(49)) {
                        night = 1;
                        menuButtons[2].text = "Skipping to night 1... why?"
                    } else if (keyIsDown(50)) {
                        night = 2;
                        menuButtons[2].text = "Skipping to night 2..."
                    } else if (keyIsDown(51)) {
                        night = 3;
                        menuButtons[2].text = "Skipping to night 3..."
                    } else if (keyIsDown(52)) {
                        night = 4;
                        menuButtons[2].text = "Skipping to night 4..."
                    } else if (keyIsDown(53)) {
                        night = 5;
                        menuButtons[2].text = "Skipping to night 5..."
                    } else if (keyIsDown(54) && keyIsDown(SHIFT)) {
                        night = 6;
                        menuButtons[2].text = "Skipping to night 6... nice"
                    } else {
                        menuButtons[2].text = "Good luck :)"
                    }
                } else if (menuButtons[1].checkClicked()) {
                    //go to night select
                    menu = "customNight";
                }
                break;
            case "game":
                handleGameClick();
                break;
        }

        startMenuMusicIfReady();
    }
}

function touchStarted() {
    tryUnlockAudio();
    startMenuMusicIfReady();
}

function handleGameClick() {
    if (level == "cameras" && camSwitchTimer <= 0) {
        // Check if the user clicked on any of the cam buttons
        for (let i of camButtons) {
            if (i.checkClicked() && i.camNum != currentCam) {
                currentCam = i.camNum;
                camSwitchTimer = 100;
                i.activeClock = 1000;
                numRects = floor(random(5, 15));
                soundHolder.camSwitch.play();
                updateDanceMonkeyAudio();
            }
        }

        // Check if the user clicked on the vent light while darren is in position 7 or 8
        if (mouseIsPressed && ventLight.checkClicked() && currentCam == 11 && (darren.position == 7 || darren.position == 8)) {
            darren.moveQueue = [[darren, 6]] // clear move queue and this specific move
            darren.timeSinceLastMoveAttempt = darren.ai * 250 - 10000; //now you have a better reason to flash darren since it will freeze him for a bit
        }
    } else if (level == "main") {
        // debugLog(mouseX / GAME_WIDTH + ", " + mouseY / GAME_HEIGHT);
        if (darren.siphoning && mouseX > 0.75 * GAME_WIDTH - currentTranslate && mouseX < 0.85 * GAME_WIDTH - currentTranslate && mouseY > 0.6 * GAME_HEIGHT && mouseY < 0.75 * GAME_HEIGHT) {
            darren.siphoning = false;
            darren.position = 0;
            soundHolder.ventClose.play();
            mainNeedsRebuild = true;
            //play vent close sound
        }

        //check panel buttons
        if (panelOpen && panelTurnOnTimer <= 0) {
            switch (panelPage) {
                case "menu":
                    if (playMusic.checkClicked() && evan.ai > 0) {
                        panelPage = "playMusic";
                        soundHolder.completeBeep.play();
                    } else if (deliverBeer.checkClicked() && aidan.ai > 0) {
                        panelPage = "deliverBeer";
                        soundHolder.completeBeep.play();
                    } else if (manageInternet.checkClicked() && abdullah.ai > 0) {
                        panelPage = "manageInternet";
                        soundHolder.completeBeep.play();
                    } else if (orderPizza.checkClicked() && sahil.ai > 0) {
                        panelPage = "orderPizza";
                        soundHolder.completeBeep.play();
                    }
                    break;
                case "manageInternet":
                    if (resetInternet.checkClicked()) {
                        if (resetInternet.actionTimer == 0) {
                            //reset internet code
                            abdullah.position = 0;
                            abdullah.attacking = 0;
                            disableCams(5000);
                            resetInternet.actionTimer = 10000;
                            alex.changeInternetUsage(20000); // reset alex's internet usage
                            soundHolder.completeBeep.play();
                        } else {
                            //fail (on cooldown)
                        }
                    } else if (scanInternet.checkClicked()) {
                        if (scanInternet.actionTimer == 0) {
                            //scan internet code
                            scanInternet.actionTimer = 10000;
                            soundHolder.completeBeep.play();
                        } else {
                            //fail
                        }
                    } else if (internetBack.checkClicked()) {
                        panelPage = "menu";
                        soundHolder.progressBeep.play();
                    }
                    break;
                case "orderPizza":
                    if (confirmPizza.checkClicked()) {
                        if (confirmPizza.actionTimer == 0) {
                            //confirm pizza order code
                            confirmPizza.actionTimer = 30000;
                            soundHolder.completeBeep.play();
                        } else {
                            //fail
                        }
                    } else if (pizzaBack.checkClicked()) {
                        panelPage = "menu";
                        soundHolder.progressBeep.play();
                    }
                    break;
                case "playMusic":
                    if (playMusicEvan.checkClicked()) {
                        //play music in evans room code
                        if (playMusicEvan.actionTimer == 0) {
                            evan.target = "evansRoom";
                            playDanceMonkey();
                            playMusicEvan.actionTimer = 20000;
                            soundHolder.completeBeep.play();
                            alex.changeInternetUsage(10000);
                        } else {
                            //fail (on cooldown)
                        }
                    } else if (playMusicDarren.checkClicked()) {
                        //play music in darren's room code
                        if (playMusicDarren.actionTimer == 0) {
                            evan.target = "darrensRoom";
                            playDanceMonkey();
                            playMusicDarren.actionTimer = 20000;
                            soundHolder.completeBeep.play();
                            alex.changeInternetUsage(10000);
                        } else {
                            //fail (on cooldown)
                        }
                    } else if (playMusicBack.checkClicked()) {
                        panelPage = "menu";
                        soundHolder.progressBeep.play();
                    }
                    break;
                case "deliverBeer":
                    if (confirmBeer.checkClicked()) {
                        if (confirmBeer.actionTimer == 0 && money >= 5) {
                            //confirm beer delivery code
                            confirmBeer.actionTimer = 5000;
                            disableCams(5000);
                            aidan.position = 0; // aidan gets his beer and goes back to his starting position as a result
                            aidan.attacking = 0;
                            let anger = 0;
                            if (sean.position >= 4 && sean.position <= 6) {
                                anger += 20;
                            }
                            if (evan.position >= 4 && evan.position <= 6) {
                                anger += 20;
                            }
                            jack.increaseAnger(anger);
                            soundHolder.completeBeep.play();
                            money -= 5;
                        } else {
                            //fail
                        }
                    } else if (beerBack.checkClicked()) {
                        panelPage = "menu";
                        soundHolder.progressBeep.play();
                    }
                    break;
            }
        }
        if (phoneCalling && endCallButton.checkClicked()) {
            phoneCalling = false;
            for (let i of soundHolder.phoneCalls) {
                if (i.isPlaying()) {
                    i.stop();
                }
            }
        }
    }
}

function drawCamMap() {
    push();
    scale(0.75);
    image(cameraMap, GAME_WIDTH * 0.645, GAME_HEIGHT * 0.323);
    pop();
    for (let i of camButtons) {
        i.draw();
    }
}

let mouseLeftCamActivateButton = true;

function isMouseInCamActivateButton() {
    if (mouseX > GAME_WIDTH * 0.225 && mouseX < GAME_WIDTH * 0.575 && mouseY > GAME_HEIGHT * 0.9 && mouseY < GAME_HEIGHT * 1.1) {
        return true;
    }
    return false;
}

let mouseLeftPanelOpenButton = true;

function isMouseInPanel() {
    if (mouseX > GAME_WIDTH * 0.5 && mouseY > GAME_HEIGHT * 0.25 && mouseY < GAME_HEIGHT * 0.75) {
        return true;
    }
    return false;
}

function isMouseInPanelOpenButton() {
    if (mouseX > GAME_WIDTH - 0.1  *GAME_HEIGHT && mouseY > GAME_HEIGHT * 0.4 && mouseY < GAME_HEIGHT * 0.6 && currentTranslate >= mainWidth - GAME_WIDTH) {
        return true;
    }
    return false;
}

function checkDisabled(camNum) {
    if (camButtons[camNum - 1].disabled) {
        return true;
    }
    return false;
}

function disableCams(time) {
    camsDisabledTimer = time;
    let rand = floor(random(0, 4)); // 0 to 3
    soundHolder.gargles[rand].play();
    //play cams disabled sound for time seconds
}

function isBrainRotPlaying() {
    for (let i of soundHolder.abdullahShorts) {
        if (i.isPlaying()) {
            return true;
        }
    }
    return false;
}

function playWalkingSound() {
    let numSound = floor(random(0, 2));
    if (!soundHolder.walkingSounds[0].isPlaying() && !soundHolder.walkingSounds[1].isPlaying()) {
        soundHolder.walkingSounds[numSound].play();
    }
}

function rebuildMainBuffer() {
    debugLog("Rebuilding main buffer...");
    mainBuffer.clear();
    mainBuffer.image(mainView, 0, 0);
    //unfortunately we have to go by layers which is really long
    if (sean.position == 7) {
        mainBuffer.image(seanInMainView[0], 0, 0);
    }
    if (evan.position == 7) {
        mainBuffer.image(evanInMainView[0], 0, 0);
    }
    if (sean.position == 8) {
        mainBuffer.image(seanInMainView[1], 0, 0);
    }
    if (darren.position == 4 || darren.position == 5) {
        mainBuffer.image(darrenInMainView[darren.position - 4], 0, 0);
    }
    if (evan.position == 11) {
        mainBuffer.image(evanInMainView[1], 0, 0);
    }
    if (sean.position == 9) {
        mainBuffer.image(seanInMainView[2], 0, 0);
    } else if (sean.position == 11) {
        mainBuffer.image(seanInMainView[3], 0, 0);
    }
    if (darren.siphoning) {
        mainBuffer.image(ventOpen, 0, 0);
    }
    if (michael.position == 1) {
        mainBuffer.image(michaelInOffice, 0, 0);
    }
}

function rebuildCam2Buffer() {
    cam2Buffer.clear();
    cam2Buffer.image(hallwayCam, 0, 0);
    if (evan.position == 4) {
        cam2Buffer.image(evanInHallwayCam[0], 0, 0);
    }
    if (sean.position >= 4 && sean.position <= 5) {
        cam2Buffer.image(seanInHallwayCam[sean.position - 4], 0, 0);
    }
    if (evan.position >= 5 && evan.position <= 6) {
        cam2Buffer.image(evanInHallwayCam[evan.position - 5], 0, 0);
    }
    if (sean.position == 6) {
        cam2Buffer.image(seanInHallwayCam[2], 0, 0);
    }
}

function rebuildCam9Buffer() {
    cam9Buffer.clear();
    cam9Buffer.image(darrenCam, 0, 0);
    if (darren.position <= 2) {
        cam9Buffer.image(darrenInDarrenCam[darren.position], 0, 0);
    }
    if (evan.position >= 8 && evan.position <= 10) {
        cam9Buffer.image(evanInDarrenCam[evan.position - 8], 0, 0);
    }
}

function loadNight(night) {
    let nightNum = night - 1;
    abdullah.ai = nights[nightNum].abdullah;
    aidan.ai = nights[nightNum].aidan;
    alex.ai = nights[nightNum].alex;
    darren.ai = nights[nightNum].darren;
    sean.ai = nights[nightNum].sean;
    evan.ai = nights[nightNum].evan;
    jack.ai = nights[nightNum].jack;
    sahil.ai = nights[nightNum].sahil;
    michael.ai = nights[nightNum].michael;
    time = 12;
    timeMS = 0;
    money = nights[nightNum].money;
    nightDescription = nights[nightNum].title;

    //if a characters AI is 0, set a specific position in where they aren't seen
    if (abdullah.ai == 0) {
        abdullah.position = 4;
    }
    if (aidan.ai == 0) {
        aidan.position = 10;
    }
    if (alex.ai == 0) {
        alex.position = 6;
    }
    if (darren.ai == 0) {
        darren.position = 3;
    }
    if (sean.ai == 0) {
        sean.position = 3;
    }
    if (evan.ai == 0) {
        evan.position = 3;
    }
    if (jack.ai == 0) {
        jack.position = 6;
    }

    abdullah.active = 1;
    aidan.active = 1;
    alex.active = 1;
    darren.active = 1;
    sean.active = 1;
    evan.active = 1;
    jack.active = 1;
    sahil.active = 1;
    michael.active = 1;
    mainNeedsRebuild = true;
    cam2NeedsRebuild = true;
    cam9NeedsRebuild = true;

    previousSeanPosition = sean.position;
    previousEvanPosition = evan.position;
    previousDarrenPosition = darren.position;
}

function stopAllSounds() {
    for (let key in soundHolder) {
        let value = soundHolder[key];
        if (Array.isArray(value)) {
            // handle arrays of sounds
            value.forEach(s => {
                if (s && s.isPlaying()) s.stop();
            });
        } else {
            // handle single sounds
            if (value && value.isPlaying()) value.stop();
        }
    }
}

function resetGame() {
    //reset globals
    internetUsage = 0;
    money = 0;
    level = "main"; // can be "main", "cameras"
    resetAudio();
    currentCam = 1;
    money = 45.00;
    camsDisabledTimer = 0;
    camFlipUpTimer = 0;
    camFlipDownTimer = 0;
    panelFlipUpTimer = 0;
    panelFlipDownTimer = 0;
    panelOpen = false;
    panelTurnOnTimer = 0;
    panelPage = "menu";
    camSwitchTimer = 0;
    characterMoveTimer = 0;
    numRects = 0;
    jumpscareQueue = "none";
    jumpscareTimer = 0;
    forceJumpscareTimer = 0;
    winTimer = 0;
    scareTimer = 0;
    deadTimer = 0;
    jumpscareShakeTimer = 0;
    jumpscareBurstFired = false;
    currentTranslate = 0;
    mainNeedsRebuild = false;
    cam2NeedsRebuild = true;
    cam9NeedsRebuild = true;

    //reset character settings
    sahil.position = 0;
    sahil.timeSinceLastMoveAttempt = 0;
    sahil.timeUntilNextPotentialMove = 30000;

    abdullah.position = 0;
    abdullah.attacking = 0;
    abdullah.timeSinceLastMoveAttempt = 0;
    abdullah.timeUntilNextMoveAttempt = 0;
    abdullah.moveQueue = [];

    aidan.position = 0;
    aidan.attacking = 0;
    aidan.timeSinceLastUpdate = 0;

    alex.position = 0;
    alex.ai = 1;
    alex.target = "none"
    alex.killTimer = 0;
    alex.calmProgress = 0;

    darren.position = 0;
    darren.timeSinceLastMoveAttempt = 0;
    darren.siphoning = false;
    darren.timeSinceLastMoneySteal = 0;
    darren.moveQueue = [];

    evan.position = 0;
    evan.target = "office"
    evan.previousTarget = "office";
    evan.timeSinceLastMove = 0;

    jack.position = 0;
    jack.angerLevel = 0;
    jack.timeSinceLastAngerIncreaseChance = 0;
    jack.oldPosition = 0;

    sean.position = 0;
    sean.timeSinceLastMoveAttempt = 0;
    sean.killTimer = 0;
    sean.attackQueued = false;
    sean.attackPrevented = false;
    sean.attackRecoveryTimer = 0;
    sean.forceAttackTimer = 0;

    michael.position = 0;
    michael.affectedCharacter = -1;

    previousSeanPosition = sean.position;
    previousEvanPosition = evan.position;
    previousDarrenPosition = darren.position;

    //clear move queues
    moveQueue = []
    darren.moveQueue = [];
    abdullah.moveQueue = [];

    startMenuMusicIfReady();
}

function debugLog(message) {
    if (DEBUG) {
        console.log(message);
    }
}

function tryUnlockAudio() {
    if (audioUnlocked) {
        return true;
    }

    if (typeof getAudioContext === "function") {
        let audioContext = getAudioContext();
        if (audioContext && audioContext.state !== "running") {
            audioContext.resume();
            audioContext = getAudioContext();
        }
        audioUnlocked = !!audioContext && audioContext.state === "running";
    } else {
        audioUnlocked = true;
    }

    return audioUnlocked;
}

function startMenuMusicIfReady() {
    if (menu === "main" && audioUnlocked && soundHolder.menuMusic && !soundHolder.menuMusic.isPlaying()) {
        soundHolder.menuMusic.loop();
    }
}

function incrementTime() {
    if (time == 12) {
        time = 1;
    } else {
        time++;
    }
    if (time == 6) {
        //end the game
        menu = "win";
        winTimer = 7897;
        night++;
        stopAllSounds();
        soundHolder.winSound.play();
    }
}

function resetAudio() {
    const audioContext = getAudioContext();
    if (audioContext.state === 'running') {
        audioContext.suspend().then(() => {
            console.log("Audio context suspended.");
            setTimeout(() => {
                audioContext.resume().then(() => {
                    console.log("Audio context resumed.");
                });
            }, 100);
        });
    }
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        resetAudio();
    }
}
