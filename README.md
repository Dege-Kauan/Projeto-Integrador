# 🛒 Compras+ – Otimizando seus gastos

Este repositório contém os artefatos de documentação, modelagem e código do sistema **Compras+**, um aplicativo web projetado para auxiliar usuários na **organização de itens para compra** e no **controle de gastos pessoais**, oferecendo uma solução prática, intuitiva e eficiente.

---

## 📌 Objetivo do Projeto

O objetivo do Compras+ é resolver um problema cotidiano: a **falta de organização nas compras e o descontrole financeiro**. Com ele, o usuário pode planejar suas compras, acompanhar o que foi comprado, o que ainda falta pagar e visualizar o total dos gastos.

---

## 👤 Público-alvo

O sistema é voltado para **usuários finais comuns**, como estudantes, profissionais, famílias e qualquer pessoa que deseje:
- Planejar suas compras com mais eficiência
- Acompanhar seus gastos com praticidade
- Controlar o que já foi pago ou ainda está pendente

---

## 💡 Proposta de Valor

- Cadastro e login de usuários
- Edição de **perfil pessoal**, incluindo foto de perfil
- Adição, edição e remoção de itens em uma lista de compras única
- Inclusão de produtos com **preço, quantidade ou peso**
- **Controle de gastos**: pagos, fiado e pendentes
- **Relatórios visuais** com gráficos de pizza e barra
- Interface **responsiva** e adaptada para uso em dispositivos móveis
- Transições suaves entre telas
- Visualização rápida de **resumo financeiro mensal**
- Menu lateral com acesso rápido às funcionalidades

---

## 🧪 Testes Realizados

Foi implementado um **teste de integração** utilizando Spring Boot para verificar o funcionamento correto da API de usuários. O teste garante que o sistema consegue:
- Criar um novo usuário
- Buscar um usuário pelo ID
- Verificar se os dados persistem corretamente no banco

O teste é executado com `mvn test` e validado por meio do framework JUnit com suporte ao MockMvc.
`Desenvolvimento/back-end/comprasplus-api/src/test/java/br/com/comprasplus`
---

## 📁 Conteúdo do PDF

O arquivo `Compras+.pdf` incluído neste repositório contém:

### 1. 📄 **Modelo de Negócio e de Sistema**
- Definição do problema
- Identificação dos usuários/clientes
- Proposta de valor e funcionalidades

### 2. 📃 **Requisitos do Sistema**
- Requisitos Funcionais (RF001 a RF015)
- Requisitos Não Funcionais (RNF001 a RNF010)

### 3. 🧪 **Justificativa das Tecnologias Utilizadas**
- Frontend: HTML, CSS e JavaScript
- Backend: Java + Spring Boot
- Banco de Dados: MySQL
- Swagger para documentação da API

### 4. 🗂️ **Modelagem de Banco de Dados**
- Modelo Entidade-Relacionamento Conceitual
- Modelo Entidade-Relacionamento Lógico

### 5. 📐 **Modelagem UML**
- Diagrama de Classes
- Diagrama de Caso de Uso Geral
- **Diagramas de Sequência** (um para cada fluxo principal)
- **Diagramas de Atividades** (mapeando os fluxos do usuário)

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Java 21 com Spring Boot
- **Banco de Dados**: MySQL
- **Documentação da API**: Swagger UI (OpenAPI)
- **Controle de Versão**: Git e GitHub

---

## 👨‍🎓 Autor

- **Nome**: Kauan Degenhart
- **Instituição**: UNOESC
- **Curso**: Análise e Desenvolvimento de Sistemas

---

## 📌 Status do Projeto

✅ Documentação e modelagem concluídas  
✅ Protótipo funcional implementado  
✅ Teste automatizado de integração executado com sucesso  
🚀 Pronto para demonstração e entrega final
