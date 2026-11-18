---
name: django-crud-seguro
description: Use sempre que for criar, modificar ou revisar Models, Views (CBVs) ou rotas de CRUD neste projeto Django. Garante que os registros sejam vinculados ao usuário autenticado, com isolamento rigoroso de acesso e mensagens de feedback via Django Messages framework.
---

# Padrão de CRUD Seguro e Mensagens no Django

Esta skill orienta os agentes de IA na implementação de operações de Create, Read, Update e Delete (CRUD) no projeto, garantindo conformidade com a segurança de dados e experiência do usuário.

---

## 1. Model: Vínculo Obrigatório com o Usuário

Ao modelar qualquer entidade que pertença a um usuário:
- Inclua um campo ForeignKey apontando para `'auth.User'` (ou `settings.AUTH_USER_MODEL`) com `on_delete=models.CASCADE`.
- Convenção de nomenclatura: `<Modelo>_usuario`.

```python
from django.db import models

class ExemploItem(models.Model):
    item_nome = models.CharField(max_length=100)
    item_usuario = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.item_nome
```

---

## 2. Views (CBVs): Isolamento Estrito por Usuário

Toda View de manipulação ou visualização de dados deve herdar de `LoginRequiredMixin` e garantir que o usuário autenticado acesse **apenas** seus próprios registros:

### CreateView
- Não exponha o campo `*_usuario` nos `fields` do formulário.
- Sobrescreva `form_valid` para associar automaticamente `request.user`:

```python
def form_valid(self, form):
    form.instance.item_usuario = self.request.user
    messages.success(self.request, "Item cadastrado com sucesso!")
    return super().form_valid(form)
```

### UpdateView, DeleteView e DetailView
- Sobrescreva `get_queryset()` para filtrar exclusivamente os registros do usuário logado:

```python
def get_queryset(self):
    return super().get_queryset().filter(item_usuario=self.request.user)
```

### ListView
- Sempre restrinja a listagem no `get_queryset()`:

```python
def get_queryset(self):
    return super().get_queryset().filter(item_usuario=self.request.user).order_by('-id')
```

---

## 3. Mensagens do Django (Django Messages Framework)

Toda operação de modificação (Create, Update, Delete) deve emitir feedback explícito para o usuário:

1. **CreateView**:
   ```python
   def form_valid(self, form):
       form.instance.item_usuario = self.request.user
       messages.success(self.request, "Item cadastrado com sucesso!")
       return super().form_valid(form)
   ```

2. **UpdateView**:
   ```python
   def form_valid(self, form):
       messages.success(self.request, "Item atualizado com sucesso!")
       return super().form_valid(form)
   ```

3. **DeleteView** (Django 5.x):
   ```python
   def form_valid(self, form):
       messages.success(self.request, "Item excluído com sucesso!")
       return super().form_valid(form)
   ```

---

## 4. Checklist para o Agente de IA

- [ ] A View herda de `LoginRequiredMixin`?
- [ ] O usuário consegue ver/editar dados de outro usuário alterando o ID na URL? (Se `get_queryset` estiver filtrado, receberá 404 automaticamente).
- [ ] O `form_valid` define `form.instance.<modelo>_usuario = self.request.user`?
- [ ] Há mensagens de sucesso emitidas para Create, Update e Delete?
- [ ] As mensagens são exibidas no template base através do bloco `{% if messages %}`?
