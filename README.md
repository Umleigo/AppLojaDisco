# Justificativa da Estrutura do Projeto: Loja de Discos

Este documento detalha as decisões de design e arquitetura tomadas ao adaptar os requisitos de um sistema de terminal (CLI) para uma aplicação web moderna, construída com Next.js, React e TypeScript.

## 1. Das Classes às Interfaces TypeScript

Em uma aplicação web com React, a prática comum é separar a **estrutura dos dados** da **lógica que os manipula**. Por isso, em vez de classes com métodos, utilizamos interfaces TypeScript para definir a "forma" dos nossos dados no arquivo `src/lib/types.ts`.

### Atributos Adicionados e Modificados

#### `id: string` (Adicionado em todas as entidades)
**Justificativa:** A adição de um identificador único (`id`) é crucial em aplicações web pelos seguintes motivos:
1.  **Relacionamentos:** Permite que um disco se refira a um gênero ou autor de forma precisa e eficiente, sem duplicar dados.
2.  **Renderização no React:** O React exige uma chave (`key`) única para cada item em uma lista para otimizar a performance da renderização e evitar bugs na interface. O `id` é perfeito para isso.
3.  **Manipulação de Dados:** Facilita a busca, atualização e exclusão de um item específico, garantindo que estamos modificando o registro correto.

#### `genreId: string` e `authorIds: string[]` (Modificados na interface `VinylRecord`)
**Justificativa:** Em vez de aninhar o objeto `Gênero` completo ou uma lista de objetos `Autor` dentro do `VinylRecord` (disco), optamos por armazenar apenas seus `id`s. Esta técnica, conhecida como **Normalização**, é uma prática padrão que oferece dois grandes benefícios:
1.  **Consistência e Manutenção:** Se a descrição de um gênero precisar ser alterada, a mudança é feita em um único lugar (na lista de gêneros). Todos os discos associados a ele refletirão a mudança automaticamente, sem a necessidade de atualizar cada registro de disco individualmente.
2.  **Eficiência:** Mantém a estrutura do objeto `VinylRecord` mais "leve" e performática, contendo apenas referências. As informações completas (como o nome do gênero) são obtidas no momento da exibição, cruzando o `id` com a lista principal de gêneros.

## 2. Dos Métodos à Lógica de Componentes

A lógica que seria implementada em métodos de classe (`getInfo()`, `inativar()`) é distribuída de forma mais apropriada para o paradigma do React: na interface do usuário (componentes) e no gerenciador de estado.

#### `getInfo()`
**Justificativa:** Em uma aplicação web, a "informação formatada" é a própria interface visual.
-   **Listagem Geral:** As tabelas nas páginas `/genres`, `/authors` e `/records` funcionam como um `getInfo()` para a lista completa de cada entidade, apresentando os dados de forma clara para o usuário.
-   **Informação Específica:** Funções auxiliares dentro dos componentes, como `getGenreName` e `getAuthorNames` na página de discos, executam a lógica de "buscar informação" no momento da renderização, pegando o `id` e exibindo o nome correspondente.

#### `inativar()`
**Justificativa:** A lógica de negócio para alterar dados (como inativar um disco) é desacoplada da estrutura de dados e centralizada no gerenciador de estado (no nosso caso, o `useReducer` em `src/context/store.tsx`).
-   A interface do usuário (o componente `Switch` na tabela de discos) apenas dispara uma **ação** (`TOGGLE_RECORD_STATUS`) com o `id` do disco a ser alterado.
-   O `reducer` ouve essa ação, encontra o registro correto pelo `id`, e cria um novo estado com o valor do campo `active` invertido.
-   Essa abordagem, que separa a **UI** (o que o usuário vê e faz) da **lógica de estado** (como os dados mudam), é um princípio fundamental do React, resultando em um código mais previsível e fácil de manter.
