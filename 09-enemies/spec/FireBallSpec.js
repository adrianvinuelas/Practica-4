describe("pruebas PlayerExplosion",function(){
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

	it("crear fireball",function(){
		SpriteSheet.map = {
			explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 }
		}
		
		var fire = new PlayerExplosion(100,50,-1);

		expect(fire.x).toEqual(68);
		expect(fire.y).toEqual(-14);
		expect(fire.vx).toEqual(-100);
	});

	it("step fireball",function(){
		SpriteSheet.map = {
			explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 }
		}
		
		boardummy = {remove: function(obj){}};
		spyOn(boardummy,"remove");
		
		var fire = new PlayerExplosion(100,50,-1);
		fire.board = boardummy;
		fire.step(0.1);
		
		expect(fire.x).toEqual(58);
		expect(fire.y).toEqual(-84);
		expect(fire.vy).toEqual(-650);
		expect(boardummy.remove).not.toHaveBeenCalled();

		var fire1 = new PlayerExplosion(100,50,-1);
		fire1.board = boardummy;
		fire1.step(1);
		

		expect(fire1.x).toEqual(-32);
		expect(fire1.y).toEqual(-714);
		expect(fire1.vy).toEqual(-650);
		expect(boardummy.remove).not.toHaveBeenCalled();
		fire1.step(1);
		expect(boardummy.remove).toHaveBeenCalled();

		
	});

	it("draw fireball",function(){
		SpriteSheet = {
			map : {explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 }},
			draw : function(){}
		}

		
		var fire = new PlayerExplosion(100,50,-1);
		spyOn(SpriteSheet,"draw");
		fire.draw(ctx);

		expect(SpriteSheet.draw).toHaveBeenCalled();
		/*expect(ctx.drawImage.calls[0].args[1]).toEqual(0);
		expect(ctx.drawImage.calls[0].args[2]).toEqual(30);
		expect(ctx.drawImage.calls[0].args[3]).toEqual(2);
		expect(ctx.drawImage.calls[0].args[4]).toEqual(10);*/
	});
});
