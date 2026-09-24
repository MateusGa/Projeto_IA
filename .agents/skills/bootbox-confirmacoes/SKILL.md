---
name: bootbox-confirmacoes
description: Use sempre que for escrever alert()/confirm()/prompt() nativo do JavaScript neste projeto Django, exibir carregamento no front-end ou implementar exclusão de registro. Substitua por diálogos Bootbox com título, texto em português e visual alinhado ao layout do site: Bootstrap 5 + glassmorphism, botões redondos e cores azul/rosa do tema.
---

## Padrão visual do projeto

Este site usa um visual leve e "glassmorphism" em [static/css/estilo.css](../../static/css/estilo.css):

- fundo com gradientes suaves e transparência;
- botões com bordas arredondadas, brilho, sombra e gradiente azul/rosa;
- fontes `Fredoka` e `Quicksand` com classe `.comic`;
- uso frequente de `btn btn-primary`, `btn btn-danger`, `btn btn-secondary` e `table` com visual clean.

Os diálogos gerados com Bootbox devem respeitar esse mesmo visual, sem parecer janelas "cruas" do navegador ou botões genéricos fora do tema.

## Antes de gerar qualquer diálogo

1. Verifique se o projeto já tem uma convenção própria de botões em `static/css/`.
2. Se houver, use as classes já existentes nos `buttons.confirm.className` e `buttons.cancel.className`.
3. Se não houver convenção específica, use os padrões do Bootstrap do site:
   - confirmação positiva: `btn btn-primary`
   - exclusão / perigo: `btn btn-danger`
   - secundário: `btn btn-secondary`
4. Não invente classes novas para modal, a menos que o projeto já tenha um padrão de CSS para esse componente.
5. Preserve o mesmo humor visual do site: textos em português, fontes amigáveis e botões redondos.

## Instruções obrigatórias

1. Nunca gere `alert(...)`, `confirm(...)` ou `prompt(...)` nativos do JavaScript neste projeto.
   Use sempre o Bootbox equivalente:
   - aviso simples → `bootbox.alert({ title, message })`
   - pergunta sim/não → `bootbox.confirm({ title, message, buttons, callback })`
   - entrada de texto → `bootbox.prompt({ title, placeholder, callback })`
   - operação demorada → `bootbox.dialog({ title, message, closeButton: false })`

2. Todo diálogo precisa ter `title`.
   - Nunca gere Bootbox sem título, mesmo que a mensagem pareça óbvia.
   - O título deve ser específico e descritivo, por exemplo: `"Excluir evento"` ou `"Salvar alteração"`.

3. O rodapé do modal só existe quando houver `buttons`.
   - Diálogos de carregamento devem usar `bootbox.dialog({ ... , closeButton: false })` sem botão fake de fechar.
   - O fechamento acontece quando a operação termina, normalmente com `.modal('hide')`.

4. Toda ação de exclusão deve ser interceptada por `bootbox.confirm(...)` e precisa seguir este padrão:
   - `title: 'Excluir <nome do que está sendo excluído>'`
   - mensagem contextualizada: `"Excluir o evento {{ evento.titulo }}?"`
   - confirmação em português: `"Sim, excluir"`
   - cancelamento em português: `"Cancelar"`
   - o envio real (`form.submit()`, `fetch`, `ajax`) só acontece dentro do `callback` quando `result === true`

5. Ao escrever o código de confirmação, mantenha a mesma semântica visual do site:

   ```javascript
   bootbox.confirm({
     title: 'Excluir evento',
     message: 'Deseja excluir o evento "{{ evento.titulo }}"?',
     buttons: {
       confirm: {
         label: 'Sim, excluir',
         className: 'btn btn-danger comic'
       },
       cancel: {
         label: 'Cancelar',
         className: 'btn btn-secondary comic'
       }
     },
     callback: function (result) {
       if (result) {
         $('#form-excluir').submit();
       }
     }
   });
   ```

6. Para operações demoradas, como upload, relatório ou chamada de IA, use carga visual consistente com o tema:

   ```javascript
   const dialog = bootbox.dialog({
     title: 'Processando',
     message: `
       <div class="text-center py-3">
         <div class="spinner-border text-primary" role="status"></div>
         <p class="mb-0 mt-3 comic">Gerando relatório...</p>
       </div>
     `,
     closeButton: false
   });

   // ... operação ...
   dialog.modal('hide');
   ```

7. Garanta que o Bootbox esteja carregado no `base.html` na ordem correta:
   - jQuery
   - Bootstrap bundle
   - `bootbox.min.js`

8. Não remova a confirmação de exclusão para "simplificar" a interface. O diálogo é parte do comportamento seguro do sistema e da experiência do usuário.

## Regra de ouro

O código gerado deve parecer parte do mesmo app, não uma janela genérica de navegador. Sempre preserve o padrão visual do site, os rótulos em português e a consistência dos botões.