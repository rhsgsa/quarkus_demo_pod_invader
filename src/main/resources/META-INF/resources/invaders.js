
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: { preload: preload, create: create, update: update, render: render }
};

//var game = new Phaser.Game(config);
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'assets/games/invaders/bullet.png');
    game.load.image('enemyBullet', 'assets/games/invaders/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/games/invaders/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'assets/games/invaders/player.png');
    game.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'assets/games/invaders/starfield.png');
    game.load.image('background', 'assets/games/starstruck/background2.png');
    // Add on screen button
    game.load.spritesheet('buttonleft', 'assets/buttons/buttons-big/button-left.png',96,64);
    game.load.spritesheet('buttonright', 'assets/buttons/buttons-big/button-right.png',96,64);
    game.load.spritesheet('buttonfire', 'assets/buttons/buttons-big/button-round-a.png',96,96);
    game.load.spritesheet('fullscreen', 'assets/buttons/buttons-big/button-full.png',112,46);
    
}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var buttonleft;
var buttonright;
var buttonfire;
var buttonfull;
var fire = false;
var left=false;
var right=false;
var controls;

var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;

var connectString = '';
var connectText;

var lives;
var enemyBullet;
var firingTimer = 0;
var respawnTimer = 0;
var stateText;
var livingEnemies = [];
var enemiesCoordinate = [];

function create() {

    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  The connecting pod
    connectString = 'Connecting : ';
    connectText = game.add.text(300, 10, connectString , { font: '20px Arial', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    
    controls = game.add.group();
    buttonleft = game.add.button(0, 472, 'buttonleft', removeGroup, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.scale.setTo(2,2);
    //buttonleft.events.onInputOver.add(function(){left=true;});
    buttonleft.events.onInputOut.add(function(){left=false;});
    buttonleft.events.onInputDown.add(function(){left=true; right=false});
    buttonleft.events.onInputUp.add(function(){left=false;});
    controls.add(buttonleft);
    
    buttonright = game.make.button(160, 472, 'buttonright', removeGroup, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.scale.setTo(2,2);
    //buttonright.events.onInputOver.add(function(){right=true;});
    buttonright.events.onInputOut.add(function(){right=false;});
    buttonright.events.onInputDown.add(function(){right=true; left=false});
    buttonright.events.onInputUp.add(function(){right=false;});
    controls.add(buttonright);
    
    buttonfire = game.add.button(670, 480, 'buttonfire', removeGroup, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    //buttonfire.events.onInputOver.add(function(){fire=true;});
    //buttonfire.events.onInputOut.add(function(){fire=false;});
    buttonfire.events.onInputDown.add(function(){fire=true;});
    //buttonfire.events.onInputUp.add(function(){fire=false;});  
    controls.add(buttonfire);

    buttonfull = game.add.button(350, 510, 'fullscreen', removeGroup, this, 0, 1, 0, 1);
    buttonfull.fixedToCamera = true;
    buttonfull.events.onInputDown.add(function(){
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
    });
    controls.add(buttonfull);

    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;
    //this.scale.setScreenSize( true );

    
    //this.scale.startFullScreen();
    
    
    
}
function removeGroup() {
    game.world.remove(group);
}

function createAliens () {


    //TODO : make this infinite from pod list
    var maxcount = 0;
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
            enemiesCoordinate[maxcount] = alien;
            alien.kill();
            maxcount++;
        }
    }

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;
    //game.world.bringToTop(controls);

    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if ((cursors.left.isDown || left) && player.x > 20)
        {
            player.body.velocity.x = -200;
            //left = false;
        }
        else if ((cursors.right.isDown || right) && player.x < 780 )
        {
            player.body.velocity.x = 200;
            //right = false
        }

        //  Firing?
        if (fireButton.isDown || fire)
        {
            fireBullet();
            fire = false;
        }

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        if (game.time.now > respawnTimer)
        {
            reviveEnemyToMatchPodCount();
        }
        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }

}


function reviveEnemyToMatchPodCount(){
    
    //TODO: revive base on current pod count
    // get pod count
    // if pod count more than alive alien, spawn alien. Max 4 x 10
    if(!stateText.visible){
        var livingEnemiesLocal = [];
        livingEnemiesLocal.length=0;

        aliens.forEachAlive(function(alien){

            // put every living enemy in an array
            livingEnemiesLocal.push(alien);
        });

        $.ajax({
            type: 'GET',
            url: '/count',
            success: function(data){
                connectText.text = connectString + data.currentPodName;
                if(livingEnemiesLocal.length < 40 && livingEnemiesLocal.length < data.count){
                    var i=0;
                    aliens.forEach(
                        function(alien){
                            if(i < data.count ){
                                if(!alien.alive){
                                    alien.reset(alien.x,alien.y);
                                }
                                i++;
                            }
                        }
                    );
                }
                console.log(data.count);
            },
        });
    }

    respawnTimer = game.time.now + 1000;
}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();
    
    //TODO: fire kill signal to pod
    $.ajax({
        type: 'POST',
        url: '/kill',
    });

    
    game.time.events.add(Phaser.Timer.SECOND * 4, ()=>{
        alien.reset(alien.x,alien.y);
    }, this);


    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}
