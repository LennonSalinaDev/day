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

let elementoSelecionado = null; // Variável para armazenar o elemento selecionado

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

      // Armazena o nome do elemento no próprio elemento
      novoElemento.data('nomeElemento', nomeElemento);

      // Verifica se a caixa de seleção 'Pessoa' está marcada
      const checkboxPessoa = document.getElementById('btn-check-outlined');
      const isPessoaChecked = checkboxPessoa.checked;

       // Adiciona ou remove a classe .icon-person conforme a marcação da caixa de seleção
      if (isPessoaChecked) {
          novoElemento.addClass('icon-person');
      } else {
          novoElemento.removeClass('icon-person');
      }
  
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
      // Adicionando evento de duplo clique para exibir o modal
      let toqueCount = 0;
let ultimoToqueTempo = 0;

novoElemento.on('click touchstart', function() {
  const agora = new Date().getTime();

  elementoSelecionado = novoElemento; // Armazena a referência do elemento ao ser clicado
  

  // Se o último toque foi há mais de 0,3 segundos, resete a contagem
  if (agora - ultimoToqueTempo > 300) {
    toqueCount = 0;
  }

  toqueCount++;
  ultimoToqueTempo = agora;

  // Se for o segundo toque (duplo toque) dentro de 0,3 segundos, chama a função exibirModal()
  if (toqueCount === 2) {
    exibirModal();
    toqueCount = 0;  // Reseta o contador de toques para o próximo duplo toque
  }
});

      // Resetar a seleção dos botões de rádio e limpar o input
      $('input[name="grupoRadio"]').prop('checked', false);
      $('#element-name').val('');
      habilitarBotaoCriar();  // Para garantir que o botão "Criar" esteja desabilitado após a limpeza
    }
}

function exibirModal() {
  // Obtém o nome do elemento do data armazenado no elemento
  const nomeElemento = elementoSelecionado.data('nomeElemento');

  $('#elementNamePlaceholder').text(nomeElemento);
  $('#myModal').addClass('modal-pequeno').modal('show'); // Adiciona a classe 'modal-pequeno'
}
function alterarCorCarta() {
  const elementos = document.querySelectorAll('.draggable-element');

  elementos.forEach(elemento => {
    elemento.style.backgroundColor = '#ecf0f1';
  });
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
        if (cartasViradas) {
            // Armazena a cor original antes de virar a carta
            if (!elemento.classList.contains('verso')) {
                elemento.dataset.corOriginal = elemento.style.backgroundColor;
            }

            elemento.classList.add('verso');
            elemento.style.backgroundColor = 'var(--preto)'; // Define a cor rgba quando a carta está virada
            algumaCartaVirada = true;
        } else {
            elemento.classList.remove('verso');

            // Restaura a cor original se existe
            const corOriginal = elemento.dataset.corOriginal;
            if (corOriginal) {
                elemento.style.backgroundColor = corOriginal;
            }
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

function selecionarOpcao(opcao) {
  console.log('Opção selecionada:', opcao);

  // Altera a cor de fundo do botão correspondente
  $(`.opcao-modal:eq(${opcao - 1})`).toggleClass('opcao-selecionada');

  // Marca o rádio correspondente
  $(`#radio${opcao}`).prop('checked', true);

  if (opcao === 1 && elementoSelecionado) {
    elementoSelecionado.css('background-color', '#ecf0f1');
  }else if(opcao === 2 && elementoSelecionado){
    elementoSelecionado.css('background-color', 'rgba(244, 20, 20, 0.879)');
  }else if(opcao === 3 && elementoSelecionado){
    elementoSelecionado.css('background-color', 'rgba(248, 248, 8, 0.941');
  }else if(opcao === 4 && elementoSelecionado){
    elementoSelecionado.css('background-color', '#3498db');
  }
  // Obtenha o nome do elemento
  var elementName = nomeElemento;  // Altere isso conforme a lógica para obter o nome do elemento
  // Atualize o conteúdo do span com o nome do elemento
  $('#elementNamePlaceholder').text(elementName);

  // Fechar o modal
  $('#myModal').modal('hide');
}
$(document).ready(function() {
  $('#closeModalButton').click(function() {
    $('#myModal').modal('hide');
  });
});
function moverElementos() {
  // Selecione todos os elementos criados
  const elementos = document.querySelectorAll('.draggable-element');

  // Para cada elemento, gere uma nova posição aleatória dentro dos limites da tela
  elementos.forEach(elemento => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const randomX = Math.random() * (screenWidth - elemento.offsetWidth);
    const randomY = Math.random() * (screenHeight - elemento.offsetHeight);

    // Anima a transição do elemento para a nova posição com duração de 5 segundos
    $(elemento).animate({ top: randomY, left: randomX }, 500);
  });
}
