//TODO: usar curvas bezier, mas pouco bezier
// talvez achar o ponto medio de uma curva
// e salvar 

//TODO: fazer algum sistema de oitavas, sobreponto as linhas desfocadas
//provavelmente tem que criar um array com os pontos, 
//e passar o nível da linha, provavelmente um valor entre 0 e 2 
//para ser multiplicado pelo stroke assim as primeiras oitavas são mais grossas
//e as ultimas serão mais finas, sem alterar a questão da cor da linha
//blur proporcional à oitava atual

//TODO criar sistema de pincel
//- colocar textura perlin normal -

//TODO OS pesos e valores tem que ser proporcionais a escala da tela
//provavelmente fazer uma variavel que escala 
//os valores que influenciem no desenho dos pixeis
//controlar o tamanho do texto pelo tamanho da tela

//Estudar o p5 graphics

//! objetivos realistas

//*adicionar controle grossura da linha
//*adicionar adicionar blur
//*dicionar adicionar textos nas areas estranhas
//*controlar cor do fundo e do texto
//!controlar a distorçao para sair do centro
//adicionar exportar como png ou jpeg
//adicionar logo em svg do devaneio do velhaco

//buffers graficos
let imgTexto; let imgBufferDesfocado;
let imgTextura; let imgAplicacao;

//forcas para deslocar
let forcaDeslocamento = 30; 
let direcaoX = 1 ; let direcaoY = 1;  

//variaveis das linhas
let numeroMaximoDePartes = 7; let numeroMinimoDePartes = 5;
let numeroDeLinhas = 5; let aleatoriedadeDeLinha = 20;
let chanceBifurcacao = 2; let atenuadorDeLinha = 10;
let espessuraDeLinha = 10;

let nivelDeDesfoque = 5;

//variaveis de texto
let TamanhoTextoPrincipal;
let textoPrincipal = "Devaneio do Velhaco";
let textoSuperior = "Devaneio";
let textoDireito = "Devaneio";
let textoInferior = "Devaneio";
let textoEsquerdo = "Devaneio";

//outras variaveis
let corTexto;
let corFundo;
let tamanhoDaTela = [1080,1350];

//essa é onde vai ser mirado as linhas da textura
let pontoCentral;

//aqui uma varivel para controlar o tamanho dos elementos
let escalaDaTela;

//========================================================//
//-----------------Seção botões---------------------------//
//=============definicoes de variaveis====================//
//========================================================//
let botaoTamanhoTextoPrincipal;
let botaoTextoPrincipal; let botaoTextoSuperior;
let botaoTextoDireito;let botaoTextoInferior; let botaoTextoEsquerdo;
let botaoCorTexto; let botaoCorFundo;

let botaoForcaDeslocamento;
let botaoGerarDeslocamento;

let botaoCriarTextura;
let botaoNumeroMaximoDePartes; let botaoNumeroMinimoDePartes;
let botaoNumeroDeLinhas; let botaoAleatoriedadeDeLinha;
let botaoChanceBifurcacao; let botaoAtenuadorDeLinha;
let botaoEspessuraDeLinha;
let botaoDesfoque;

let botaoTelaTextura; let botaoTelaTexto;
let botaoTelaAplicação



function preload() {
  font = loadFont("assets/Butler_Bold.otf")
}

function setup() {
  
  /*
  ――――――――――――――――――――――――――――――――――――――――――――――――――――
  ‖‖‖  ‖‖‖  ‖‖ seção configuração básica ‖‖  ‖‖‖   ‖‖‖
  ――――――――――――――――――――――――――――――――――――――――――――――――――――
  */
  let canvas = createCanvas(tamanhoDaTela[0], tamanhoDaTela[1]);
  canvas.parent("canvas-wrapper");//coloco como pai a div caixa do canvas
  noLoop();
  //!pixel density = 1 pra facilitar
  pixelDensity(1);
  textFont(font);
  mostrarCaixa("textura");
  
  /*
  ｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣
  ｢｣     seção criação de imagens     ｢｣
  ｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣｢｣
  */  
  
  //são as 3 imagens
  imgAplicacao = createImage(width,height);
  imgTexto = createImage(width,height);
  imgTextura = createGraphics(width,height); //textura inicial
  imgBufferDesfocado = createGraphics(width,height); //textura desfocada


  escalaDaTela = (sqrt(width * height))/1000;
  pontoCentral = [width/2,height/2];

  //========================================================//
  //-----------------Seção botões---------------------------//
  //========================================================//

  botaoCriarTextura = select("#botao-desenhar-textura");
  
  botaoNumeroMaximoDePartes = select("#controle-numero-maximo-de-partes"); 
  botaoNumeroMinimoDePartes = select("#controle-numero-minimo-de-partes");
  botaoNumeroDeLinhas = select("#controle-numero-de-linhas");  
  botaoAleatoriedadeDeLinha = select("#controle-aleatoriedade-da-linha");
  botaoChanceBifurcacao = select("#controle-chance-bifurcacao"); 
  botaoAtenuadorDeLinha = select("#controle-atenuador-de-linha");
  botaoEspessuraDeLinha = select("#controle-espessura-de-linha");

  botaoTamanhoTextoPrincipal = select("#controle-tamanho-texto-principal");
  botaoTextoPrincipal = select("#texto-principal");
  botaoTextoSuperior = select("#texto-superior");
  botaoTextoDireito = select("#texto-direito");
  botaoTextoInferior = select("#texto-inferior");
  botaoTextoEsquerdo = select("#texto-esquerdo");

  botaoCorFundo = select("#cor-fundo");
  botaoCorTexto = select("#cor-texto");

  botaoForcaDeslocamento = select("#controle-range-deslocamento");
  botaoGerarDeslocamento = select("#botao-gerar-deslocamento");
  
  botaoDesfoque =  select("#controle-desfoque-de-linha");
  
  select("#botao-tela-textura").mousePressed(() => {
    mostrarCaixa("textura");
    image(imgBufferDesfocado,0,0);
  });
  select("#botao-tela-texto").mousePressed(() => {
    mostrarCaixa("texto");
    escreverTexto();
  });
  select("#botao-tela-aplicacao").mousePressed(() => mostrarCaixa("aplicacao"));
}

function draw() {
  
  //aqui para iniciar com o valores que já estão nos sliders
  nivelDeDesfoque = botaoDesfoque.value(); espessuraDeLinha = botaoEspessuraDeLinha.value();
  numeroMaximoDePartes = botaoNumeroMaximoDePartes.value();  numeroMinimoDePartes = botaoNumeroMinimoDePartes.value();
  numeroDeLinhas = botaoNumeroDeLinhas.value();  aleatoriedadeDeLinha = botaoAleatoriedadeDeLinha.value();
  chanceBifurcacao = botaoChanceBifurcacao.value();  atenuadorDeLinha = botaoAtenuadorDeLinha.value();
  TamanhoTextoPrincipal = botaoTamanhoTextoPrincipal.value(); 

  corTexto = botaoCorTexto.value(); corFundo = botaoCorFundo.value();

  textoPrincipal = botaoTextoPrincipal.value();  
  textoSuperior = botaoTextoSuperior.value(); 
  textoDireito = botaoTextoDireito.value(); 
  textoInferior = botaoTextoInferior.value(); 
  textoEsquerdo = botaoTextoEsquerdo.value(); 

  //tem que usar uma arrow function porque a função mousePressed espera um callback (chamar uma função)
  botaoCriarTextura.mousePressed(criadorDeTextura);

  botaoGerarDeslocamento.mousePressed(distorcaoDoCanvas);

  botaoNumeroMaximoDePartes.changed(() => numeroMaximoDePartes = botaoNumeroMaximoDePartes.value());
  botaoNumeroMinimoDePartes.changed(() => numeroMinimoDePartes = botaoNumeroMinimoDePartes.value());
  botaoNumeroDeLinhas.changed(() => numeroDeLinhas = botaoNumeroDeLinhas.value());
  botaoAleatoriedadeDeLinha.changed(() => aleatoriedadeDeLinha = botaoAleatoriedadeDeLinha.value());
  botaoChanceBifurcacao.changed(() => chanceBifurcacao = botaoChanceBifurcacao.value());
  botaoAtenuadorDeLinha.changed(() => atenuadorDeLinha = botaoAtenuadorDeLinha.value());
 
  botaoCorFundo.changed(()=> {
    corFundo = botaoCorFundo.value();
    escreverTexto();
  });
  botaoCorTexto.changed(()=> {
    corTexto = botaoCorTexto.value();
    escreverTexto();
  });
  
  botaoTamanhoTextoPrincipal.changed(()=> {
    TamanhoTextoPrincipal = botaoTamanhoTextoPrincipal.value();
    escreverTexto();
  });

  botaoEspessuraDeLinha.changed(() => espessuraDeLinha = botaoEspessuraDeLinha.value());

  botaoDesfoque.input(() => {
    nivelDeDesfoque = botaoDesfoque.value();
    aplicarDesfoque();
  });
  
  botaoForcaDeslocamento.changed(() => forcaDeslocamento = botaoForcaDeslocamento.value());

  botaoTextoPrincipal.input(() => {
    //texto para distorcer é uma variavel global
    textoPrincipal = botaoTextoPrincipal.value();
    escreverTexto();
  });

  botaoTextoSuperior.input(() => {
    //texto para distorcer é uma variavel global
    textoSuperior = botaoTextoSuperior.value();
    escreverTexto();
  });

  botaoTextoDireito.input(() => {
    //texto para distorcer é uma variavel global
    textoDireito = botaoTextoDireito.value();
    escreverTexto();
  });

  botaoTextoInferior.input(() => {
    //texto para distorcer é uma variavel global
    textoInferior = botaoTextoInferior.value();
    escreverTexto();
  });

  botaoTextoEsquerdo.input(() => {
    //texto para distorcer é uma variavel global
    textoEsquerdo = botaoTextoEsquerdo.value();
    escreverTexto();
  });

  //!olhando em retrospecto não precisava ter variaveis nomeadas para segurar os botões !ou talvez sim
  background(255);
  criadorDeTextura();
}

//função que alterna as caixas laterais, textura, textos e aplicação (tta)
function mostrarCaixa(caixaAtiva) {
  let paineis = selectAll(".caixa");
  for (let p of paineis) {
    p.hide();
  }

  select("#"+caixaAtiva).show();
}

//escreve o texto 
function escreverTexto(){
  background(corFundo);
  fill(corTexto);
  noStroke();
  textAlign(CENTER,TOP);
  textSize(TamanhoTextoPrincipal);
  textStyle(BOLD);
  text(textoPrincipal, 80, 320, width-160);

  let tamanhoTextoMoldura =40
  textStyle(NORMAL);
  textAlign(CENTER,TOP);
  
  push();
  rotate(HALF_PI);
  textSize(50);
  text(textoDireito, tamanhoTextoMoldura+30, -width+tamanhoTextoMoldura/4 +20, height-tamanhoTextoMoldura/2 -50,tamanhoTextoMoldura);
  rotate(-PI);
  text(textoEsquerdo, -height+tamanhoTextoMoldura +10, tamanhoTextoMoldura/4+20, height -tamanhoTextoMoldura/2 -50,tamanhoTextoMoldura);
  rotate(HALF_PI);
  text(textoSuperior, tamanhoTextoMoldura+30, tamanhoTextoMoldura/4 +20, width-tamanhoTextoMoldura -50,tamanhoTextoMoldura);
  pop();
  //não sei pq mas tinha que fazer um push pop para o lado inferior
  push();
  textSize(50);
  rotate(PI); // Rotate 180 degrees (PI radians)
  text(textoInferior , -width+70, -height + tamanhoTextoMoldura -20, width-tamanhoTextoMoldura -30,tamanhoTextoMoldura);
  pop();

  loadPixels();
  imgTexto.loadPixels();
  for (let p = 0; p < pixels.length; p ++ ) {
    imgTexto.pixels[p] = pixels[p]; 
  } 
  imgTexto.updatePixels();
  updatePixels();
}

function aplicarDesfoque() {
  imgBufferDesfocado.image(imgTextura, 0, 0);
  //background(255)
  imgBufferDesfocado.filter(BLUR, nivelDeDesfoque);
  
  image(imgBufferDesfocado,0,0);
}

function distorcaoDoCanvas() {
 
   
    
    deslocamento(tamanhoDaTela);
    tint(255,255);
    //image(imgTextura,0,0);
    tint(255,255);
    image(imgAplicacao,0,0);
}

function criadorDeTextura(){
  //! isso tudo provavelmente tem que ser automatizado de alguma forma
  //Que aqui eu não uso tipo duas linahs no mesmo lugar, sera que posso reiniciar a seed no mesmo lugar?
  //simgTextura.clear();
  imgBufferDesfocado.background(255);
  imgTextura.background(255);

  for (let p = 0; p < numeroDeLinhas; p++) {
    numeroDePartes = floor(random(numeroMinimoDePartes,numeroMaximoDePartes));
    desenhoLinha(imgTextura, pontoAleatorioBorda(),pontoCentral,numeroDePartes,random(30,90));
  }
  imgTextura.filter(BLUR, nivelDeDesfoque/2)
  
  //puxar o blur para ser chamado quando alterado o valor do botão
  for (let p = 0; p < numeroDeLinhas; p++) {
    numeroDePartes = floor(random(numeroMinimoDePartes,numeroMaximoDePartes));
    desenhoLinha(imgTextura,pontoAleatorioBorda(),pontoCentral,numeroDePartes,random(20,90));
  }
  
  aplicarDesfoque();
} 

function pontoAleatorioBorda() {
  //seleciono um caso que escolhe um dos lados da tela e um ponto aleatorio 
  // retorna um array
  let caso = floor(random(4));
  switch(caso){
    case 0: return([random(width),0]);
    case 1: return([width,random(height)]);
    case 2: return([random(width),height]);
    case 3: return([0,random(height)]);
  }
}
 