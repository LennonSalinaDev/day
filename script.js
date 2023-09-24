let cartasViradas = false; // Variável para controlar se as cartas estão viradas
function habilitarBotaoCriar() {
    const radioButtons = document.getElementsByName('grupoRadio');
    const criarButton = document.querySelector('button[onclick="criarElemento()"]');

    let algumSelecionado = false;
    for (let i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        algumSelecionado = true;
        break;
      }
    }

    criarButton.disabled = !algumSelecionado;
}

// Chama a função para garantir o estado inicial do botão ao carregar a página
habilitarBotaoCriar();

function criarElemento() {
    // Verifica se alguma carta está virada e impede a criação de um novo elemento
    const elementos = document.querySelectorAll('.draggable-element');
    const algumaCartaVirada = Array.from(elementos).some(elemento => elemento.classList.contains('verso'));
      
    if (algumaCartaVirada) {
      return;
    }
  
    var nomeElemento = $('#element-name').val();
    if (nomeElemento) {
      // Obtém a cor selecionada pelo botão de rádio
      const radioSelecionado = document.querySelector('input[name="grupoRadio"]:checked');
      const corSelecionada = radioSelecionado ? getComputedStyle(radioSelecionado).backgroundColor : colors[0];
      
      // Cria um novo elemento com a cor selecionada
      var novoElemento = $('<div class="draggable-element frente" style="background-color: ' + corSelecionada + '">' + nomeElemento + '</div>');
      novoElemento.appendTo('body');
      novoElemento.addClass('frente'); // Adiciona classe para a frente do elemento
  
      novoElemento.on('touchstart mousedown', function(event) {
        event.preventDefault(); // Evita o comportamento padrão dos eventos
  
        var isTouch = event.type === 'touchstart';
        var eventoArraste = isTouch ? 'touchmove' : 'mousemove';
        var eventoSolte = isTouch ? 'touchend' : 'mouseup';
  
        $(document).on(eventoArraste, function(e) {
          e.preventDefault();
  
          var offsetX = isTouch ? e.originalEvent.touches[0].pageX : e.pageX;
          var offsetY = isTouch ? e.originalEvent.touches[0].pageY : e.pageY;
  
          novoElemento.css({
            top: offsetY - novoElemento.height() / 2,
            left: offsetX - novoElemento.width() / 2
          });
        });
  
        $(document).on(eventoSolte, function() {
          $(document).off(eventoArraste);
          $(document).off(eventoSolte);
  
          verificarExclusao(novoElemento);
        });
      });

      // Resetar a seleção dos botões de rádio e limpar o input
      $('input[name="grupoRadio"]').prop('checked', false);
      $('#element-name').val('');
      habilitarBotaoCriar();  // Para garantir que o botão "Criar" esteja desabilitado após a limpeza
    }
}

  function verificarExclusao(elemento) {
    var areaExclusao = $('#area-exclusao')[0].getBoundingClientRect();
  
    // Verifica a interseção do elemento com a área de exclusão
    var elementPos = elemento.position();
    var elementWidth = elemento.width();
    var elementHeight = elemento.height();
  
    if (elementPos.left + elementWidth > areaExclusao.left &&
        elementPos.top + elementHeight > areaExclusao.top &&
        elementPos.left < areaExclusao.right &&
        elementPos.top < areaExclusao.bottom) {
      elemento.remove(); // Remove o elemento
    }
  }
  
  const buttons = document.querySelectorAll('.trocarBtn');
  const colors = ['#f9f9f9', '#e74c3c', '#f7dc6F', '#3498db'];
  
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => trocarCor(button, index));
  });
  
  let corSelecionada = colors[0]; // Cor padrão é a do radio 1

  function virarTodasAsCartas() {
    const elementos = document.querySelectorAll('.draggable-element');

    let algumaCartaVirada = false;  // Variável para verificar se alguma carta está virada

    elementos.forEach(elemento => {
        // Atualiza a condição para virar as cartas
        if (cartasViradas) {
            elemento.classList.add('verso');
            algumaCartaVirada = true;
        } else {
            elemento.classList.remove('verso');
        }

        elemento.classList.toggle('frente');
    });

    // Atualiza o estado das cartas viradas
    cartasViradas = !cartasViradas;

    // Mostra ou oculta o input, botão "Criar" e botões de rádio apenas quando todas as cartas estiverem viradas para a frente
    const todasViradas = !algumaCartaVirada;
    if (todasViradas) {
        $('#element-name').show();
        $('button[onclick="criarElemento()"]').show();
        $('input[name="grupoRadio"]').prop('disabled', false);
    } else {
        $('#element-name').hide();
        $('button[onclick="criarElemento()"]').hide();
        $('input[name="grupoRadio"]').prop('disabled', true);
    }
}