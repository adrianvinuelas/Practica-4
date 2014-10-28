/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("Clase GameBoardSpec", function(){
	
	var gameBoard;
	var canvas, ctx;
	
	beforeEach(function(){
		loadFixtures('index.html');
	
		canvas = $('#game')[0];
		expect(canvas).toExist();
	
		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
		
		oldGame = Game;

		gameBoard = new GameBoard();
	});

	afterEach(function(){
        	Game = oldGame;
   	});

	it("ADD de gameboard", function(){
		objeto1= {nave: "barco"};
		gameBoard.add(objeto1);
		expect(gameBoard.objects[0].nave).toEqual("barco");
		
		objeto2= "casa";
		gameBoard.add(objeto2);
		expect(gameBoard.objects[1]).toEqual(objeto2);

		objeto3 = 4;
		gameBoard.add(objeto3);
		expect(gameBoard.objects[2]).toEqual(4);
	});
	
	it("RESETREMOVED de gameboard", function(){
		gameBoard.resetRemoved();
		expect(gameBoard.removed.length).toEqual(0);
	});

	it("REMOVE de gameboard", function(){
		objeto1 = 1;
		objeto2 = 2;
		gameBoard.add(objeto1);
		gameBoard.add(objeto2);
		gameBoard.resetRemoved();
		expect(gameBoard.objects.length).toEqual(2);
		expect(gameBoard.removed.length).toEqual(0);
		gameBoard.remove(objeto2);
		expect(gameBoard.removed.length).toEqual(1);
	});

	it("FINALIZEREMOVED de gameboard", function(){
		objeto1 = 1;
		objeto2 = 2;
		gameBoard.add(objeto1);
		gameBoard.add(objeto2);
		gameBoard.resetRemoved();
		gameBoard.remove(objeto1);
		//gameBoard.remove(objeto2);
		expect(gameBoard.removed.length).toEqual(1);
		gameBoard.finalizeRemoved();
		expect(gameBoard.objects.length).toEqual(1);
	});

	it("ITERATE de gameBoard", function(){
		spyOn(ctx, "drawImage");
		Game = {width: 320, height: 480};
		SpriteSheet.load (sprites,function(){});
		var miNave = new PlayerShip();
		gameBoard.add(miNave);
		gameBoard.iterate('draw',ctx);
		expect(ctx.drawImage.calls[0].args[3]).toEqual(37);
		expect(ctx.drawImage.calls[0].args[4]).toEqual(42);
	});

	it("DRAW de gameboard", function(){
		spyOn(ctx, "fillText");
		var titulo = "titulo";
		var subtitulo = "subtitulo";
		var ts1 = new TitleScreen(titulo, subtitulo);
		gameBoard.add(ts1);
		gameBoard.draw(ctx);
		expect(ctx.fillText.calls[0].args[0]).toEqual(titulo);
  		expect(ctx.fillText.calls[1].args[0]).toEqual(subtitulo);
	});

	it("STEP de gameboard", function(){
		SpriteSheet.load (sprites,function(){});
		// Hacemos que se pulse la tecla left:
		Game = {width: 320, height: 480, keys: {'left': true}};
		// Creamos un PlayerShip para testar
		var miNave = new PlayerShip();
		gameBoard.add(miNave);
		gameBoard.step(0.5);// Hacemos como que ha pasado 0.5s
		expect(gameBoard.objects[0].x).toEqual(41.5);
	});
	
	it("OVERLAP de gameboard", function(){
		SpriteSheet.load (sprites,function(){});
		Game = {width: 320, height: 480, keys: {'left': true}};
		var miNave = new PlayerShip();
		var miNave2 = new PlayerShip();
		expect(gameBoard.overlap(miNave,miNave2)).toBe(true);
		miNave.step(0.5)
		expect(gameBoard.overlap(miNave,miNave2)).toBe(false);
	});

	it("OVERLAP y COLLIDE de gameboard", function(){
		SpriteSheet.load (sprites,function(){});
		Game = {width: 320, height: 480, keys: {'left': true}};
		var miNave = new PlayerShip();
		var miNave2 = new PlayerShip();
		miNave2.step(1)
		gameBoard.add(miNave);
		gameBoard.add(miNave2);
		expect(gameBoard.collide(miNave)).toBe(false);
	});

	it("DETECT de gameboard", function(){
		var obj = {}
		funcion = function(obj){
			return true;
		}
		gameBoard.add(obj);
		expect(gameBoard.detect(funcion)).toBe(obj);
	});

});
