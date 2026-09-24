(function ($) {
    function abrirConfirmacaoDelete(itemNome, callback) {
        if (typeof bootbox === 'undefined') {
            callback(false);
            return;
        }

        const titulo = `Excluir ${itemNome}`;
        const mensagem = `Deseja excluir ${itemNome}?`;

        bootbox.confirm({
            title: titulo,
            message: mensagem,
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
            callback: function (resultado) {
                callback(resultado === true);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('a[data-confirm-delete]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const itemNome = link.dataset.itemName || 'este item';
                const destino = link.getAttribute('href');

                abrirConfirmacaoDelete(itemNome, function (confirmado) {
                    if (confirmado && destino) {
                        window.location.href = destino;
                    }
                });
            });
        });

        document.querySelectorAll('form[data-confirm-delete]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                const itemNome = form.dataset.itemName || 'este item';

                abrirConfirmacaoDelete(itemNome, function (confirmado) {
                    if (confirmado) {
                        form.submit();
                    }
                });
            });
        });
    });
})(jQuery);
