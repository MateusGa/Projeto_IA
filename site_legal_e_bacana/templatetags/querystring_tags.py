from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def pagination_url(context, page_number):
    """Retorna a URL da página atual preservando todos os parâmetros da querystring."""
    request = context.get("request")
    if request is None:
        return f"?page={page_number}"

    params = request.GET.copy()
    params["page"] = str(page_number)
    query_string = params.urlencode()
    return f"?{query_string}" if query_string else ""
