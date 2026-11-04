
    
        const inputImagem = document.getElementById("imagem");
        const areaUpload = document.getElementById("area-upload");

        const painelAnalise = document.getElementById("painel-analise");
        const imagemAnalise = document.getElementById("imagem-analise");
        const nomeArquivo = document.getElementById("nome-arquivo");

        const progressoContainer = document.getElementById("progresso-container");
        const barraProgresso = document.getElementById("barra-progresso");
        const porcentagem = document.getElementById("porcentagem");

        const tituloAnalise = document.getElementById("titulo-analise");
        const descricaoAnalise = document.getElementById("descricao-analise");

        const resultadoAnalise = document.getElementById("resultado-analise");
        const classificacao = document.getElementById("classificacao");
        const valorConfianca = document.getElementById("valor-confianca");
        const barraFinal = document.getElementById("barra-final");

        const botaoExplicacao = document.getElementById("botao-explicacao");
        const explicacao = document.getElementById("explicacao");
        const setaExplicacao = document.getElementById("seta-explicacao");

        const botaoNovamente = document.getElementById("analisar-novamente");

        let temporizador = null;
        let urlImagem = null;

     
        inputImagem.addEventListener("change", function () {

            const arquivo = inputImagem.files[0];

            if (!arquivo) {
                return;
            }

            const formatosPermitidos = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            // Verifica o formato do arquivo
            if (!formatosPermitidos.includes(arquivo.type)) {
                alert("Selecione uma imagem JPG, PNG ou WEBP.");
                inputImagem.value = "";
                return;
            }

            // Verifica o tamanho máximo de 10 MB
            if (arquivo.size > 10 * 1024 * 1024) {
                alert("A imagem deve ter no máximo 10 MB.");
                inputImagem.value = "";
                return;
            }

            // Libera a imagem anterior, se existir
            if (urlImagem) {
                URL.revokeObjectURL(urlImagem);
            }

            // Cria uma prévia local da imagem
            urlImagem = URL.createObjectURL(arquivo);

            imagemAnalise.src = urlImagem;
            nomeArquivo.textContent = arquivo.name;

            // Troca a tela inicial pela tela de análise
            areaUpload.hidden = true;
            painelAnalise.hidden = false;

            
            iniciarAnalise();

        });

        // ANIMAÇÃO DA ANÁLISE
        function iniciarAnalise() {

            clearInterval(temporizador);

            let progresso = 0;

            progressoContainer.hidden = false;
            resultadoAnalise.hidden = true;

            barraProgresso.style.width = "0%";
            porcentagem.textContent = "0%";

            tituloAnalise.textContent = "Analisando imagem";

            descricaoAnalise.textContent =
                "Analisando texturas e padrões...";

            // Atualiza a barra gradualmente
            temporizador = setInterval(function () {

                progresso += 1;

                barraProgresso.style.width = progresso + "%";
                porcentagem.textContent = progresso + "%";

                if (progresso === 30) {
                    descricaoAnalise.textContent =
                        "Verificando características visuais...";
                }

                if (progresso === 65) {
                    descricaoAnalise.textContent =
                        "Concluindo a simulação...";
                }

                // Quando chegar a 100%, mostra o resultado
                if (progresso >= 100) {

                    clearInterval(temporizador);

                    mostrarResultado();

                }

            }, 40);

        }

        
        function mostrarResultado() {

            progressoContainer.hidden = true;
            resultadoAnalise.hidden = false;

            // RESULTADO APENAS DEMONSTRATIVO
            const confianca = 10;

            classificacao.textContent = "Provavelmente autêntica";
            valorConfianca.textContent = confianca + "%";

            barraFinal.style.width = confianca + "%";

            explicacao.hidden = false;

            botaoExplicacao.setAttribute("aria-expanded", "true");
            setaExplicacao.textContent = "⌃";

        }

        // ABRIR OU FECHAR A EXPLICAÇÃO
        botaoExplicacao.addEventListener("click", function () {

            const estaAberta = !explicacao.hidden;

            explicacao.hidden = estaAberta;

            botaoExplicacao.setAttribute(
                "aria-expanded",
                String(!estaAberta)
            );

            setaExplicacao.textContent = estaAberta ? "⌄" : "⌃";

        });

        // SELECIONAR OUTRA IMAGEM
        botaoNovamente.addEventListener("click", function () {

            clearInterval(temporizador);

            inputImagem.value = "";

            painelAnalise.hidden = true;
            areaUpload.hidden = false;

            resultadoAnalise.hidden = true;
            progressoContainer.hidden = false;

            // Leva o usuário de volta ao início
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

        // ARRASTAR E SOLTAR IMAGENS
        const areaArrastar = document.querySelector(".area-upload");

        areaArrastar.addEventListener("dragover", function (evento) {

            evento.preventDefault();
            areaArrastar.classList.add("arrastando");

        });

        areaArrastar.addEventListener("dragleave", function () {

            areaArrastar.classList.remove("arrastando");

        });

        areaArrastar.addEventListener("drop", function (evento) {

            evento.preventDefault();
            areaArrastar.classList.remove("arrastando");

            const arquivo = evento.dataTransfer.files[0];

            if (!arquivo) {
                return;
            }

            const transferencia = new DataTransfer();
            transferencia.items.add(arquivo);

            inputImagem.files = transferencia.files;

            // Reutiliza as mesmas validações
            inputImagem.dispatchEvent(new Event("change"));

        });

        // LIBERAR A PRÉVIA QUANDO A PÁGINA FOR FECHADA
        window.addEventListener("beforeunload", function () {

            clearInterval(temporizador);

            if (urlImagem) {
                URL.revokeObjectURL(urlImagem);
            }

        });
