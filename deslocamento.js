let deslocamento = () => { 
  imgBufferDesfocado.loadPixels();
  imgTexto.loadPixels(); 
  imgAplicacao.loadPixels();
  
  for (let y = 0; y < imgTexto.height; y++) {
    for (let x = 0; x < imgTexto.width; x++) {
      
      let indice = (x + y * imgBufferDesfocado.width) * 4;
      let brilhoPixel = brightness(color(imgBufferDesfocado.pixels[indice],
                                          imgBufferDesfocado.pixels[indice + 1], 
                                          imgBufferDesfocado.pixels[indice + 2],
                                          imgBufferDesfocado.pixels[indice + 3]));

      let centroX = imgTexto.width / 2;
      let centroY = imgTexto.height / 2;
      

      //!estudar esta parte
      // vector from center to pixel
      let dx = x - centroX;
      let dy = y - centroY;

      // normalize direction vector
      let minMagnitude = 0.001;
      let magnitude = max(sqrt(dx * dx + dy * dy), minMagnitude);

      let dirX = dx / magnitude;
      let dirY = dy / magnitude;
      // center the brightness around 127.5 (midpoint)
      let brilhoNormalizado = map(brilhoPixel, 0, 255, -1, 1); // -1 = dark, +1 = bright

      // scale the displacement
      let deslocamento = brilhoNormalizado * forcaDeslocamento * (magnitude / max(centroX, centroY));

      let novoX = constrain(x + deslocamento * dirX, 0, imgTexto.width - 1);
      let novoY = constrain(y + deslocamento * dirY, 0, imgTexto.height - 1);
              
      //* samplear a nova imagem pq é o backward mapping 
      let corSampleada = InterpolacaoBilinear(imgTexto, novoX, novoY);
        
      imgAplicacao.pixels[indice] = red(corSampleada);
      imgAplicacao.pixels[indice + 1] = green(corSampleada);
      imgAplicacao.pixels[indice + 2] = blue(corSampleada);
      imgAplicacao.pixels[indice + 3] = alpha(corSampleada); 
      
    }
  }
  imgTexto.updatePixels();
  imgBufferDesfocado.updatePixels();
  imgAplicacao.updatePixels();
}   
  
function InterpolacaoBilinear(imgTextura, x, y) {

  //pego o integer do x1 e do y1
  let x1 = floor(x);
  let y1 = floor(y);
  let x2 = min(x1 + 1, imgTextura.width - 1);//uso o minimo pra escolher o menor
  let y2 = min(y1 + 1, imgTextura.height - 1);//porque se fosse o maximo da altura 
  
  //tenho que acelerar usando indices da imagem para ser mais eficiente do que o get()
  //basicamente pego os pixeis da imagem e transformo em cor

  let indiceq11 = (x1 + y1 * imgTextura.width) * 4;
  let q11 = color(imgTextura.pixels[indiceq11],
                  imgTextura.pixels[indiceq11 + 1],
                  imgTextura.pixels[indiceq11 + 2],
                  imgTextura.pixels[indiceq11 + 3],);
  
  let indiceq21 = (x2 + y1 * imgTextura.width) * 4;
  let q21 = color(imgTextura.pixels[indiceq21],
                  imgTextura.pixels[indiceq21 + 1],
                  imgTextura.pixels[indiceq21 + 2],
                  imgTextura.pixels[indiceq21 + 3],);
  
  let indiceq12 = (x1 + y2 * imgTextura.width) * 4;
  let q12 = color(imgTextura.pixels[indiceq12],
                  imgTextura.pixels[indiceq12 + 1],
                  imgTextura.pixels[indiceq12 + 2],
                  imgTextura.pixels[indiceq12 + 3],);
  
  let indiceq22 = (x2 + y2 * imgTextura.width) * 4;
  let q22 = color(imgTextura.pixels[indiceq22],
                  imgTextura.pixels[indiceq22 + 1],
                  imgTextura.pixels[indiceq22 + 2],
                  imgTextura.pixels[indiceq22 + 3],);

  //calculo as distancias
  let dx = x - x1;
  let dy = y - y1;

  //interpolo no eixo x os valores 
  let cTop = lerpColor(q11, q21, dx);
  let cBottom = lerpColor(q12, q22, dx);
  return lerpColor(cTop, cBottom, dy);//interpolo os valores finais
}