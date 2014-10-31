/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

*/

describe("pruebas de PlayerMissileSpec", function(){

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

	it("prueba de step",function(){
		var objBoard = { remove: function(obj) {} }; //tablero imaginario que necesitamos crear para hacer la prueba 
		spyOn(objBoard, "remove");
		
		var gameMissile = new PlayerMissile(10,71);
		gameMissile.board = objBoard;
		
		expect(gameMissile.x).toEqual(11);
		expect(gameMissile.y).toEqual(81);

		var dt = 1;
   		gameMissile.step(dt);

		expect(gameMissile.board.remove).toHaveBeenCalled();
   		expect(gameMissile.y).toEqual(-619);
		
		var gameMissile2 = new PlayerMissile(47,61);
		gameMissile2.board = objBoard;
		expect(gameMissile2.x).toEqual(48);
		expect(gameMissile2.y).toEqual(71);
		
		dt= 2;
		gameMissile2.step(dt);

		expect(gameMissile2.board.remove).toHaveBeenCalled();
   		expect(gameMissile2.y).toEqual(-1329);
	});

	it("prueba de draw", function(){
		SpriteSheet.load (sprites,function(){});
		spyOn(ctx, "drawImage");
		
		var gameMissile = new PlayerMissile(10,71);
		gameMissile.draw(ctx);
		
		
		expect(ctx.drawImage.calls[0].args[1]).toEqual(0);
		expect(ctx.drawImage.calls[0].args[2]).toEqual(30);
		expect(ctx.drawImage.calls[0].args[3]).toEqual(2);
		expect(ctx.drawImage.calls[0].args[4]).toEqual(10);

		
		objSprite = { draw: function(ctx,name,x,y) {} };
		var gameMissile2 = new PlayerMissile(10,71);
		SpriteSheet = objSprite;
		spyOn(SpriteSheet, "draw");
		gameMissile2.draw(ctx);

		expect(SpriteSheet.draw).toHaveBeenCalled();
		
		
	});
});
