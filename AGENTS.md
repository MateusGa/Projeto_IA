# Diretrizes para Agentes de IA — Projeto Calendário IA

Este documento (`AGENTS.md`) define as instruções, padrões arquiteturais e convenções obrigatórias para qualquer agente de IA (Antigravity, Cursor, GitHub Copilot, Claude Code, ChatGPT, etc.) atuando no desenvolvimento e manutenção deste projeto.

---

## 1. Visão Geral do Projeto

O **Calendário IA** é uma aplicação web construída com **Django 5.x** voltada para gerenciamento pessoal e acadêmico de eventos, subtarefas, anexos, lembretes e participantes.

### Stack Tecnológica
- **Backend**: Python 3.11+ / Django 5.2.x
- **Banco de Dados**: PostgreSQL (hospedado na Neon) / SQLite para testes locais
- **Autenticação**: Django Auth (`auth.User`) com controle estrito de propriedade por usuário
- **Filtros e Paginação**: `django-filter` com querystring preservation tag (`{% pagination_url %}`)
- **Frontend**: Bootstrap 5, Crispy Forms (`crispy_bootstrap5`), Glassmorphism / Frutiger Aero CSS
- **Plugins JavaScript/jQuery**:
  - `jQuery 3.7.1`
  - `Bootbox.js` (confirmações e modais)
  - `jQuery Mask Plugin` (máscaras de formulários para datas e valores)
  - `DataTables` (listagens interativas com paginação, busca e ordenação em PT-BR)

---

## 2. Estrutura de Diretórios

```text
Projeto_IA/
├── .agents/
│   └── skills/                  # Skills especializadas para agentes de IA
│       ├── bootbox-confirmacoes/
│       ├── commit-padrao/
│       ├── datatables-listagens/
│       └── django-crud-seguro/
├── Projeto_la_sla/              # Configurações do projeto Django
│   ├── settings.py              # Definições de apps, middleware, DB e emails
│   ├── urls.py                  # URLs principais e rotas de recuperação de senha
│   └── wsgi.py / asgi.py
├── site_legal_e_bacana/         # App principal da aplicação
│   ├── filters.py               # FilterSets do django-filter
│   ├── models.py                # Modelos de dados com vínculo de usuário
│   ├── views.py                 # Class-Based Views (CBVs)
│   ├── urls.py                  # Rotas internas da aplicação
│   ├── templatetags/            # Tags customizadas (ex: querystring_tags.py)
│   └── templates/               # Templates HTML organizados
│       └── site_legal_e_bacana/
│           ├── includes/        # Parciais (paginacao.html)
│           ├── listas/          # Telas de listagem (eventos, lembretes, etc.)
│           ├── ver/             # Telas de detalhe
│           └── *.html           # Telas gerais (login, form, password reset)
├── static/                      # Arquivos estáticos (CSS, JS, imagens, sons)
├── manage.py
├── requirements.txt
└── AGENTS.md
```

---

## 3. Diretrizes Arquiteturais e Regras de Implementação

### 3.1. Isolamento de Dados por Usuário (Mandatório)
1. **Modelos**: Toda entidade criada (`Evento`, `Subtarefa`, `Lembrete`, `Anexo`, `Participante`, etc.) deve possuir um campo ForeignKey apontando para `'auth.User'` (ex: `Evento_usuario`).
2. **Criação (CreateView)**:
   - O campo de usuário **nunca** deve aparecer no formulário público (`fields`).
   - Sobrescreva `form_valid(self, form)` atribuindo `form.instance.<modelo>_usuario = self.request.user`.
3. **Consulta, Edição e Exclusão (ListView, DetailView, UpdateView, DeleteView)**:
   - É **proibido** permitir que um usuário visualize, altere ou exclua registros de terceiros.
   - Toda view deve herdar de `LoginRequiredMixin` e sobrescrever `get_queryset()` com:
     ```python
     def get_queryset(self):
         return super().get_queryset().filter(<modelo>_usuario=self.request.user)
     ```

### 3.2. Framework de Mensagens do Django
1. Toda operação de mutação (Create, Update, Delete) deve enviar uma mensagem de feedback ao usuário através de `django.contrib.messages`:
   - Criação: `messages.success(self.request, "Registro criado com sucesso!")`
   - Edição: `messages.success(self.request, "Registro alterado com sucesso!")`
   - Exclusão: `messages.success(self.request, "Registro excluído com sucesso!")`
2. O template base (`modelo.html`) possui o bloco padronizado para renderizar as mensagens:
   ```html
   {% if messages %}
     <div class="container mt-3">
       {% for message in messages %}
         <div class="alert alert-{{ message.tags }} alert-dismissible fade show comic" role="alert">
           {{ message }}
           <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
         </div>
       {% endfor %}
     </div>
   {% endif %}
   ```

### 3.3. Django Filter e Paginação Preservada
1. Para filtragem em ListViews, utilize a biblioteca `django-filter`.
2. As classes de filtro devem residir em `filters.py`.
3. Ao integrar filtros em views com `paginate_by`, certifique-se de que a paginação utilize a tag de template `{% pagination_url page_num %}` (disponível via `{% load querystring_tags %}`), para que os parâmetros de filtro sejam preservados ao mudar de página.

### 3.4. Padrões de Frontend e Plugins jQuery
O projeto requer a presença e funcionamento integrado de pelo menos três plugins jQuery:
1. **jQuery Mask Plugin**:
   - Usado para máscaras automáticas de entrada (ex: datas no formato `00/00/0000`).
   - Configurado em `static/js/mascaras.js`.
2. **Bootbox.js**:
   - Usado para confirmações modais estilizadas (ex: exclusão de registros).
   - Nunca use `window.confirm()` nativo. O manipulador em `static/js/bootbox-confirmacoes.js` intercepta links e botões com `data-confirm-delete`.
   - **Atenção**: Não adicione `data-confirm-delete` em formulários de criação/edição; use apenas nos fluxos de confirmação de exclusão.
3. **DataTables**:
   - Usado em tabelas de listagem para ordenação rápida, busca dinâmica e responsividade.
   - Configurado com internacionalização para Português do Brasil (`pt-BR.json`).

### 3.5. Recuperação de Senha por E-mail
- A recuperação de senha utiliza as views padrão do Django Auth configuradas em `Projeto_la_sla/urls.py` (`password_reset`, `password_reset_done`, `password_reset_confirm`, `password_reset_complete`).
- Os templates correspondentes residem em `templates/site_legal_e_bacana/`.
- O link "Esqueceu sua senha?" deve estar sempre presente na tela de login (`login.html`).

---

## 4. Skills Disponíveis no Projeto

Os agentes de IA devem consultar e seguir as skills localizadas no diretório `.agents/skills/`:

| Skill | Localização | Propósito |
|---|---|---|
| **`commit-padrao`** | `.agents/skills/commit-padrao/` | Padroniza as mensagens de commit no Git seguindo Conventional Commits, com título no imperativo e corpo explicativo obrigatório citando classes e arquivos alterados. |
| **`bootbox-confirmacoes`** | `.agents/skills/bootbox-confirmacoes/` | Instruções para criação de diálogos de confirmação de exclusão e alertas com Bootbox alinhados ao visual do site. |
| **`datatables-listagens`** | `.agents/skills/datatables-listagens/` | Orientações para estruturar tabelas de listagem integradas ao DataTables em PT-BR sem quebrar a paginação do Django. |
| **`django-crud-seguro`** | `.agents/skills/django-crud-seguro/` | Padrão arquitetural de isolamento de registros por usuário e emissão de mensagens Django nas CBVs. |

---

## 5. Boas Práticas ao Executar Tarefas

1. **Checagem de Sintaxe**: Antes de considerar qualquer modificação concluída em arquivos Python, valide com:
   ```bash
   python -m py_compile <arquivo.py>
   ```
2. **Não Quebrar Funcionalidades Existentes**: Mantenha as rotas, mixins e lógicas existentes ao adicionar novas funcionalidades.
3. **Dependências**: Ao utilizar um novo pacote Python, verifique se ele está presente no `requirements.txt` e informe claramente o comando de instalação (`pip install <pacote>`).
4. **Respeito ao Tema Visual**: Este projeto utiliza uma temática visual personalizada com elementos Retro Web 2.0 / Frutiger Aero (fontes amigáveis, animações, áudios interativos e classe `.comic`). Mantenha a coerência estilística nos novos templates.
