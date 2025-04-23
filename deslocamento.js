let deslocamento = (tamanho) => { 
    let tamanhoDaTela = tamanho;
    imgTextura.loadPixels();
    imgParaDistorcer.loadPixels(); 
    
    imgFinal = createImage(tamanhoDaTela[0], tamanhoDaTela[1]);
    imgFinal.loadPixels();
    
    for (let y = 0; y < imgParaDistorcer.height; y++) {
      for (let x = 0; x < imgParaDistorcer.width; x++) {
        
        let indice = (x + y * imgTextura.width) * 4;
        let brilhoPixel = brightness(color(imgTextura.pixels[indice],
                                           imgTextura.pixels[indice + 1], 
                                           imgTextura.pixels[indice + 2],
                                           imgTextura.pixels[indice + 3]));
  
        let deslocamentoX = map(brilhoPixel, 0, 255, -forcaDeslocamentoX, forcaDeslocamentoX);
        let deslocamentoY = map(brilhoPixel, 0, 255, -forcaDeslocamentoY, forcaDeslocamentoY);
        
        let novoX = constrain(x + deslocamentoX * direcaoX, 0, imgParaDistorcer.width -1);
        let novoY = constrain(y + deslocamentoY * direcaoY, 0, imgParaDistorcer.height -1);
                
        //* samplear a nova imagem pq é o backward mapping 
        let corSampleada = InterpolacaoBilinear(imgParaDistorcer, novoX, novoY);
          
        imgFinal.pixels[indice] = red(corSampleada);
        imgFinal.pixels[indice + 1] = green(corSampleada);
        imgFinal.pixels[indice + 2] = blue(corSampleada);
        imgFinal.pixels[indice + 3] = alpha(corSampleada); 
        
      }
    }
    imgParaDistorcer.updatePixels();
    imgTextura.updatePixels();
    imgFinal.updatePixels();
  }   
  
  function InterpolacaoBilinear(imgParaDistorcer, x, y) {
  
    //pego o integer do x1 e do y1
    let x1 = floor(x);
    let y1 = floor(y);
    let x2 = min(x1 + 1, imgParaDistorcer.width - 1);//uso o minimo pra escolher o menor
    let y2 = min(y1 + 1, imgParaDistorcer.height - 1);//porque se fosse o maximo da altura 
    
    //tenho que acelerar usando indices da imagem para ser mais eficiente do que o get()
    //basicamente pego os pixeis da imagem e transformo em cor
  
    let indiceq11 = (x1 + y1 * imgParaDistorcer.width) * 4;
    let q11 = color(imgParaDistorcer.pixels[indiceq11],
                    imgParaDistorcer.pixels[indiceq11 + 1],
                    imgParaDistorcer.pixels[indiceq11 + 2],
                    imgParaDistorcer.pixels[indiceq11 + 3],);
    
    let indiceq21 = (x2 + y1 * imgParaDistorcer.width) * 4;
    let q21 = color(imgParaDistorcer.pixels[indiceq21],
                    imgParaDistorcer.pixels[indiceq21 + 1],
                    imgParaDistorcer.pixels[indiceq21 + 2],
                    imgParaDistorcer.pixels[indiceq21 + 3],);
    
    let indiceq12 = (x1 + y2 * imgParaDistorcer.width) * 4;
    let q12 = color(imgParaDistorcer.pixels[indiceq12],
                    imgParaDistorcer.pixels[indiceq12 + 1],
                    imgParaDistorcer.pixels[indiceq12 + 2],
                    imgParaDistorcer.pixels[indiceq12 + 3],);
    
    let indiceq22 = (x2 + y2 * imgParaDistorcer.width) * 4;
    let q22 = color(imgParaDistorcer.pixels[indiceq22],
                    imgParaDistorcer.pixels[indiceq22 + 1],
                    imgParaDistorcer.pixels[indiceq22 + 2],
                    imgParaDistorcer.pixels[indiceq22 + 3],);
  
    //calculo as distancias
    let dx = x - x1;
    let dy = y - y1;
  
    //interpolo no eixo x os valores 
    let cTop = lerpColor(q11, q21, dx);
    let cBottom = lerpColor(q12, q22, dx);
    return lerpColor(cTop, cBottom, dy);//interpolo os valores finais
  }