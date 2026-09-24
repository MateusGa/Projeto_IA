(function ($) {
    $(function () {
        $('input[name]').each(function () {
            const campo = `${this.name} ${this.id}`.toLowerCase();

            if (campo.includes('data') || campo.includes('entrega')) {
                $(this).mask('00/00/0000');
            }
        });
    });
})(jQuery);