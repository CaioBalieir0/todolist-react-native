# Como usar Toast no React Native (Alternativa ao Sonner)

O projeto usa `react-native-toast-message` como alternativa ao Sonner do React para React Native.

## Instalação

Já está instalado! A biblioteca `react-native-toast-message` foi adicionada ao projeto.

## Configuração

O Toast já está configurado no `App.js`. Não é necessário fazer nada adicional.

## Uso Básico

### Importar as funções utilitárias

```javascript
import { showSuccess, showError, showInfo, showToast } from '../utils/toast';
```

### Exemplos de uso

#### Toast de Sucesso

```javascript
showSuccess('Tarefa criada!', 'A tarefa foi criada com sucesso');
```

#### Toast de Erro

```javascript
showError('Erro', 'Não foi possível salvar a tarefa');
```

#### Toast de Informação

```javascript
showInfo('Atenção', 'Você tem 3 tarefas pendentes');
```

#### Toast Simples

```javascript
showToast('Mensagem simples');
```

## Uso Avançado

Para casos mais avançados, você pode usar o Toast diretamente:

```javascript
import Toast from 'react-native-toast-message';

Toast.show({
  type: 'success', // 'success' | 'error' | 'info'
  text1: 'Título',
  text2: 'Descrição (opcional)',
  position: 'top', // 'top' | 'bottom'
  visibilityTime: 3000, // tempo em ms
  autoHide: true,
  topOffset: 60,
  bottomOffset: 40,
});
```

## Comparação com Sonner

| Sonner (React)              | react-native-toast-message |
| --------------------------- | -------------------------- |
| `toast.success('Mensagem')` | `showSuccess('Mensagem')`  |
| `toast.error('Mensagem')`   | `showError('Mensagem')`    |
| `toast.info('Mensagem')`    | `showInfo('Mensagem')`     |
| `toast('Mensagem')`         | `showToast('Mensagem')`    |

## Exemplos no Projeto

### TodoFormScreen.js

```javascript
// Sucesso ao salvar
showSuccess('Tarefa criada!', 'A tarefa foi criada com sucesso');

// Erro ao salvar
showError('Erro', 'Não foi possível criar a tarefa');
```

### RegisterScreen.js

```javascript
// Sucesso ao criar conta
showSuccess('Conta criada!', 'Sua conta foi criada com sucesso');

// Erro ao criar conta
showError('Erro', 'Email já cadastrado');
```

## Personalização

Você pode personalizar o Toast editando o componente no `App.js`:

```javascript
<Toast position="top" visibilityTime={3000} topOffset={60} />
```

## Documentação Completa

Para mais opções e personalizações, consulte a documentação oficial:
https://github.com/calintamas/react-native-toast-message
