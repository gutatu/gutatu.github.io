//TODO: usar curvas bezier, mas pouco bezier
// talvez achar o ponto medio de uma curva
// e salvar 

//TODO: fazer algum sistema de oitavas, sobreponto as linhas desfocadas
//provavelmente tem que criar um array com os pontos, 
//e passar o nível da linha, provavelmente um valor entre 0 e 2 
//para ser multiplicado pelo stroke assim as primeiras oitavas são mais grossas
//e as ultimas serão mais finas, sem alterar a questão da cor da linha
//blur proporcional à oitava atual

//TODO fazer controles no site para controlar as variaveis

//TODO bifurcação tem que seguir levemente o vetor inicial
//provavelmente copiar o vetor do [ponto,ponto+1]
//e girar levemente sobre o ponto com um theta aleatorio

//buffers graficos
let imgFinal; let imgParaDistorcer; let imgTextura;

//forcas para deslocar
let forcaDeslocamentoX = 30; let forcaDeslocamentoY = 30; 
let direcaoX = 1 ; let direcaoY = 1;  

//variaveis das linhas
let numeroMaximoDePartes = 7; let numeroMinimoDePartes = 5;
let numeroDeLinhas = 5; let aleatoriedadeDaLinha = 20;
let chanceBifurcacao = 2; let atenuadorDeLinha = 10;


//outras variaveis
let TextoParaDistorcer = "devaneio do velhaco devaneio do velhaco devaneio do velhaco\ndevaneio do velhaco\ndevaneio do velhaco\ndevaneio do velhaco\ndevaneio do velhaco\ndevaneio do velhaco";
let tamanhoDaTela = [600,600];
let pontoCentral;

//========================================================//
//-----------------Seção botões---------------------------//
//=============definicoes de variaveis====================//
//========================================================//
let botaoTextoParaDistorcer;
let botaoForcaDeslocamentoX; let botaoForcaDeslocamentoY;
let botaoGerarDeslocamento;

let botaoCorDoFundo; let botaoCriarTextura
let botaoNumeroMaximoDePartes; let botaoNumeroMinimoDePartes;
let botaoNumeroDeLinhas; let botaoAleatoriedadeDaLinha;
let botaoChanceBifurcacao; let botaoAtenuadorDeLinha;
let botaoSalvarTextura;


function setup() {
  let canvas = createCanvas(tamanhoDaTela[0], tamanhoDaTela[1]);
  canvas.parent("caixa-do-canvas");//coloco como pai a div caixa do canvas
  
  pontoCentral = [width/2,height/2];
  //!pixel density = 1 pra facilitar
  pixelDensity(1);
  noLoop();

  imgFinal = createImage(width,height);
  imgParaDistorcer = createImage(width,height);
  imgTextura = createImage(width,height);


  //========================================================//
  //-----------------Seção botões---------------------------//
  //========================================================//
  
  botaoCorDoFundo = select("#botao-limpar");
  botaoCriarTextura = select("#botao-desenhar-textura");
  botaoSalvarTextura = select("#botao-salvar-textura");
  
  botaoNumeroMaximoDePartes = select("#controle-numero-maximo-de-partes"); 
  botaoNumeroMinimoDePartes = select("#controle-numero-minimo-de-partes");
  botaoNumeroDeLinhas = select("#controle-numero-de-linhas");  
  botaoAleatoriedadeDaLinha = select("#controle-aleatoriedade-da-linha");
  botaoChanceBifurcacao = select("#controle-chance-bifurcacao"); 
  botaoAtenuadorDeLinha = select("#controle-atenuador-de-linha");

  botaoTextoParaDistorcer = select("#texto-para-distorcer");
  botaoForcaDeslocamentoX = select("#controle-deslocamento-x");
  botaoForcaDeslocamentoY = select("#controle-deslocamento-y");
  botaoGerarDeslocamento = select("#botao-gerar-deslocamento");
}

function draw() {

  botaoCorDoFundo.mousePressed(() => background(255));
  botaoCriarTextura.mousePressed(criadorDeTextura);
  botaoSalvarTextura.mousePressed(salvarTextura);
  botaoGerarDeslocamento.mousePressed(distorcaoDoCanvas);

  botaoNumeroMaximoDePartes.changed(() => numeroMaximoDePartes = botaoNumeroMaximoDePartes.value());
  botaoNumeroMinimoDePartes.changed(() => numeroMinimoDePartes = botaoNumeroMinimoDePartes.value());
  botaoNumeroDeLinhas.changed(() => numeroDeLinhas = botaoNumeroDeLinhas.value());
  botaoAleatoriedadeDaLinha.changed(() => aleatoriedadeDaLinha = botaoAleatoriedadeDaLinha.value());
  botaoChanceBifurcacao.changed(() => chanceBifurcacao = botaoChanceBifurcacao.value());
  botaoAtenuadorDeLinha.changed(() => atenuadorDeLinha = botaoAtenuadorDeLinha.value());
  
  botaoForcaDeslocamentoX.changed(() => forcaDeslocamentoX = botaoForcaDeslocamentoX.value());
  botaoForcaDeslocamentoY.changed(() => forcaDeslocamentoY = botaoForcaDeslocamentoY.value());
  botaoTextoParaDistorcer.input(() => {
    TextoParaDistorcer = botaoTextoParaDistorcer.value()
    escreverTexto();
  });
   
  background(255);
  
}

function escreverTexto(){
  background(255);
  textAlign(CENTER,TOP);
  strokeWeight(0.1);
  textSize(50)
  text(TextoParaDistorcer, 60, 60, width*0.8);
}

function salvarTextura(){

  loadPixels();
  imgTextura.loadPixels();

  for (let p = 0; p < pixels.length; p++) {
    imgTextura.pixels[p] = pixels[p];    
  }

  updatePixels();
  imgTextura.updatePixels();
  escreverTexto();
}


function distorcaoDoCanvas() {
 
    loadPixels();
    imgParaDistorcer.loadPixels();
    for (let p = 0; p < pixels.length; p +=4 ) {
      imgParaDistorcer.pixels[p] = pixels[p];       // Red
        imgParaDistorcer.pixels[p + 1] = pixels[p + 1]; // Green
        imgParaDistorcer.pixels[p + 2] = pixels[p + 2]; // Blue
        imgParaDistorcer.pixels[p + 3] = pixels[p + 3]; // Alpha    
    } 

    imgParaDistorcer.updatePixels();
    updatePixels();
    
    deslocamento(tamanhoDaTela);
    tint(255,255)
    image(imgTextura,0,0);
    tint(255,100)
    image(imgFinal,0,0);
}

function criadorDeTextura(){
  //! isso tudo provavelmente tem que ser automatizado de alguma forma
  background(255);

  for (let p = 0; p < numeroDeLinhas; p++) {
    numeroDePartes = floor(random(numeroMinimoDePartes,numeroMaximoDePartes));
    desenhoLinha(pontoAleatorioBorda(),pontoCentral,numeroDePartes,random(30,90));
  }
  filter(BLUR, 20);

  for (let p = 0; p < numeroDeLinhas; p++) {
    numeroDePartes = floor(random(numeroMinimoDePartes,numeroMaximoDePartes));
    desenhoLinha(pontoAleatorioBorda(),pontoCentral,numeroDePartes,random(20,90));
  }
  filter(BLUR, 13);

} 

function pontoAleatorioBorda() {
  let caso = floor(random(4));

  switch(caso){
    case 0: return([random(width),0]);
    case 1: return([width,random(height)]);
    case 2: return([random(width),height]);
    case 3: return([0,random(height)]);
  }
}
