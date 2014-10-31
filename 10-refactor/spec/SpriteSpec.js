describe("Clase Sprite",function(){
	var canvas, ctx;
	
	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();

		oldGame = Game;
	});

	afterEach(function(){
	        Game = oldGame;
	});

	it("crear PlayerShip",function(){
		SpriteSheet ={
			map: { ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
			       missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
		};
		Game = {width: 320, height: 480,keys: {'left': true , 'right':false, 'fire': false}};

		boardummy = { add : function(){}};
		
		var miNave = new PlayerShip();
		miNave.board = boardummy;
		spyOn(boardummy , "add");

		expect(miNave.reload).toEqual(0.25);
		expect(miNave.x).toEqual(141.5);
		expect(miNave.y).toEqual(428);

		miNave.step(1);
		expect(miNave.x).toEqual(0);//0 y no -59 porque -59 <0 -> x = 0
		expect(boardummy.add).not.toHaveBeenCalled();
		
		Game.keys['left'] = false;
		Game.keys['right'] = true;
		miNave.step(3);
		expect(miNave.x).toEqual(283);
		expect(boardummy.add).not.toHaveBeenCalled();
		
		Game.keys['right'] = false;
		Game.keys['fire'] = true;
		
		miNave.step(1);		
		expect(miNave.x).toEqual(283);
		expect(boardummy.add).toHaveBeenCalled();
	});

	it("crear PlayerMissile",function(){
		SpriteSheet ={
			map: { missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
		};
		
		Game = {width: 320, height: 480};

		boardummy = { remove: function(){}};

		var missile = new PlayerMissile(120,428);
		missile.board = boardummy;
		spyOn(boardummy, "remove");
	
		expect(missile.x).toEqual(121);
		expect(missile.y).toEqual(438);

		missile.step(1);
		expect(missile.y).toEqual(-262);
		expect(boardummy.remove).toHaveBeenCalled();
		
	});

	it("crear Enemy",function(){
		SpriteSheet ={
			map: {  enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 }}
		};
		
		var enemies = {
   			 basic: { x: 100, y: 100, sprite: 'enemy_purple'},
			 basic1: { x: 100, y: -50, sprite: 'enemy_purple' , B: 100, C: 2 , E: 100 }
		};
		var boardummy = { remove: function(){}};

		Game = {width: 320, height: 480};

		var enemy = new Enemy(enemies.basic1);
		expect(enemy.x).toEqual(100);
		expect(enemy.y).toEqual(-50);
		enemy.step(1);
		expect(Math.floor(enemy.x)).toEqual(190);
		expect(enemy.y).toEqual(50);
	});

	it("prueba de draw PlayerShip",function(){
		SpriteSheet ={
			map: { ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 }},
			draw: function(){}
		};
		
		Game = {width: 320, height: 480};

		var miNave = new PlayerShip();
		spyOn(SpriteSheet, "draw");
		miNave.draw(ctx);
		expect(SpriteSheet.draw).toHaveBeenCalled();
 		expect(SpriteSheet.draw.calls[0].args[1]).toEqual("ship");
 		expect(SpriteSheet.draw.calls[0].args[2]).toEqual(miNave.x);
 		expect(SpriteSheet.draw.calls[0].args[3]).toEqual(miNave.y);
 		expect(SpriteSheet.draw.calls[0].args[4]).toEqual(0);

		
	});
});
