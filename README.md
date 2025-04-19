
# 🌤️ API de Dados Meteorológicos do Brasil

Este projeto é uma API construída com **Next.js** e hospedada na **Vercel**, que consulta dados históricos de clima provenientes da base aberta do [INMET (Instituto Nacional de Meteorologia)](https://www.kaggle.com/datasets/gregoryoliveira/brazil-weather-information-by-inmet).  
Os dados estão armazenados em um banco **PostgreSQL** via **Supabase**, e são acessados por meio de uma rota de API customizada.

## 🚀 Funcionalidades

- 🔍 Busca por **cidade** (mesmo parcial)
- 📅 Filtro por data (`data_inicio`, `data_fim` ou ambos)
- 🔗 Conexão com Supabase usando variáveis de ambiente
- ✅ Retorna também informações de `estado` e nome da cidade original da estação (`city_station` e `state`)
- 🌐 Deploy contínuo via **Vercel**

---

## 📦 Estrutura

A API está localizada no arquivo:

```
/pages/api/consultaSupabase.js
```

Ela realiza duas consultas principais:
1. **Busca na tabela `stations`** com base em um nome parcial de cidade.
2. **Busca na tabela `weather_data`** usando os `id_station` encontrados e os filtros opcionais de data.

---

## 📥 Instalação

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
npm install
```

---

## 🧪 Execução local

Crie um arquivo `.env.local` na raiz do projeto com suas chaves da Supabase:

```
SUPABASE_URL=https://<sua-url>.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

Agora, inicie o servidor local:

```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).

---

## 📡 Como usar a API

### Endpoint

```
GET /api/consultaSupabase
```

### Parâmetros disponíveis:

| Parâmetro     | Obrigatório | Tipo   | Descrição |
|---------------|-------------|--------|-----------|
| `cidade`      | Opcional    | string | Nome (ou parte) da cidade. Ex: `Fortaleza`, `sao`, `paulo`. |
| `data_inicio` | Opcional    | string | Data inicial no formato `YYYY-MM-DD`. |
| `data_fim`    | Opcional    | string | Data final no formato `YYYY-MM-DD`. |

### Exemplo de requisição:

```bash
curl "http://localhost:3000/api/consultaSupabase?cidade=rio&data_inicio=2023-01-01&data_fim=2023-01-10"
```

### Exemplo de resposta:

```json
[
  {
    "station_code": 123,
    "data": "2023-01-01",
    "temperature": 32.5,
    "humidity": 70,
    "city_station": "RIO DE JANEIRO",
    "state": "RJ"
  },
  ...
]
```

---

## ☁️ Deploy na Vercel

1. Faça login no [Vercel](https://vercel.com)
2. Crie um novo projeto a partir deste repositório
3. Adicione as variáveis de ambiente (`SUPABASE_URL` e `SUPABASE_KEY`)
4. Acesse sua URL pública: `https://seu-projeto.vercel.app/api/consultaSupabase`

---

## 📚 Fontes dos dados

Os dados foram retirados desta base pública no Kaggle:

👉 [Brazil Weather Information by INMET](https://www.kaggle.com/datasets/gregoryoliveira/brazil-weather-information-by-inmet)

---

## 👨‍💻 Contribuindo

Sinta-se à vontade para abrir PRs com melhorias, novas funcionalidades ou correções.

---

## 🛡️ Licença

Este projeto está licenciado sob a [MIT License](LICENSE).