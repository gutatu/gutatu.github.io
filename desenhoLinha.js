//*funcao principal que cria as linhas semi aleatorias

/**
 * @param {p5.graphics} buffer - p5 grapics para ser desenhado= [x,y]
 * @param {Array} arrayInicial - array do ponto inicial com a posição x e y = [x,y]
 * @param {Array} arrayFinal - array do ponto final com a posição x e y = [x,y]
 * @param {number} numeroDePartes - o número de partes da linha
 * @param {number} corDaLinha - a cor da linha entre 20 - 255
 */

function desenhoLinha(buffer,arrayInicial, arrayFinal, numeroDePartes, corDaLinha = 20) {
  let listaPontos = [];
  let valorNoise = random(2000);

  //so defino os vetores e a direção principal da linha
  let pontoInicial = createVector(arrayInicial[0], arrayInicial[1]);
  let pontoFinal = createVector(arrayFinal[0], arrayFinal[1]);
  let vetorDirecao = p5.Vector.sub(pontoFinal, pontoInicial);

  //defino os pontos iniciais para desenhar as linhas
  //e calculo o passo da linha 
  let ponto1 = pontoInicial.copy(); let ponto2 = pontoInicial.copy();
  let passo = p5.Vector.div(vetorDirecao, numeroDePartes);


  //*definir os pontos para ser salvos na lista de pontos
  for (let i = 0; i < numeroDePartes; i++) {
    //crio a lista dentro da lista e adiciono o primeiro ponto
    listaPontos[i] = [];
    listaPontos[i].push(ponto1.x, ponto1.y);

    //adiciono um vetor aleatorio no passo
    //assim ele não se movimenta aleatoriamente
    //mas muda levemente a direção do ponto
    passo.add(randomGaussian(0, aleatoriedadeDeLinha),
    randomGaussian(0, aleatoriedadeDeLinha));
    ponto2.add(passo);

    //uso o ponto 2 para a lista e atualizo o ponto 1 como ponto 2
    listaPontos[i].push(ponto2.x, ponto2.y);
    ponto1.set(ponto2);

    //adiciono a cor da linha na lista
    listaPontos[i].push(corDaLinha);
    if (corDaLinha < 255){
      corDaLinha += (noise(valorNoise) * atenuadorDeLinha);
      valorNoise += 0.05
    }
  }

  //*pintar as linhas
  for (let j = 0; j < listaPontos.length - 1; j++) {
    buffer.strokeWeight((3000 / listaPontos[j][4])*(espessuraDeLinha/10));
    buffer.stroke(listaPontos[j][4]);

    buffer.line(
      listaPontos[j][0],
      listaPontos[j][1],
      listaPontos[j][2],
      listaPontos[j][3]
    );
  }

  //*aleatoriedorizor de bifurcação 
  for (let h = 0; h < listaPontos.length - 1; h++) {

    if (random(20) < chanceBifurcacao) {
      let pontoBifurcacao = random(listaPontos);

      //faço uma recursão chamando a função com os valores do ponto
      desenhoLinha(buffer,[pontoBifurcacao[0],
      pontoBifurcacao[1]],
        [pontoBifurcacao[2],
        pontoBifurcacao[3]],
        random(1, 5),
        pontoBifurcacao[4]);
    }
  }
}