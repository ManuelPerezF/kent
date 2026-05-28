# Kent

Kent es una aplicación de **finanzas personales** para escritorio. Combina un cliente **React + Electron** con una API **Express** y base de datos **SQLite** (Prisma). Permite registrar ingresos y gastos, gestionar cuentas y categorías, controlar suscripciones recurrentes y consultar reportes con gráficas.

## Características

- **Autenticación** — registro e inicio de sesión con JWT.
- **Resumen (Home)** — vista general, gasto por categoría, gasto diario y próximos cargos de suscripciones.
- **Movimientos** — libro mayor con filtros por tipo, categoría y búsqueda; totales según filtros activos.
- **Suscripciones** — alta, pausa/reactivación y proyección del próximo cobro.
- **Cuentas** — efectivo y tarjeta; saldo calculado a partir del saldo inicial y los movimientos.
- **Categorías** — clasificación por tipo ingreso/gasto.
- **Reportes** — resumen financiero, gasto mensual, top gastos y desglose por categoría, con filtro por **mes** o **año**.

## Stack tecnológico


| Capa     | Tecnologías                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| Cliente  | React 18, TypeScript, Vite, Electron, React Router, Tailwind CSS 4, shadcn/ui, Recharts |
| Servidor | Node.js, Express 5, TypeScript, Zod, bcrypt, jsonwebtoken                               |
| Datos    | SQLite, Prisma 7, better-sqlite3                                                        |


## Estructura del repositorio

```
kent/
├── client/                 # Frontend + Electron
│   ├── electron/           # Proceso principal de Electron
│   └── src/
│       ├── app/            # Rutas y shell de la app
│       ├── modules/        # Módulos por dominio (auth, home, movimientos, …)
│       └── shared/         # UI compartida, layout, utilidades
├── server/                 # API REST
│   └── src/
│       ├── modules/        # auth, accounts, categories, transactions, …
│       ├── prisma/         # Schema y migraciones
│       └── shared/         # DB, middlewares, utilidades
└── README.md
```

## Configuración

### 1. Servidor

```bash
cd server
npm install
```

Crea un archivo `.env` en `server/` con variables similares a:

```env
DATABASE_URL="file:./src/shared/db/db.sqlite"
JWT_SECRET="cambia-esto-por-un-secreto-largo"
JWT_EXPIRES_IN="7d"
```

Aplica migraciones y genera el cliente de Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Cliente

```bash
cd client
npm install
```

Opcional: crea `client/.env` si el backend no corre en el puerto por defecto:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Si no defines `VITE_BACKEND_URL`, el cliente usa `http://localhost:3000`.

## Desarrollo

Puedes levantar backend y frontend con un solo comando desde la raíz:

```bash
npm install
npm run dev
```

También puedes seguir usando dos terminales si lo prefieres:

- API: `cd server && npm run dev`
- Cliente / Electron: `cd client && npm run dev`

## API REST

Todas las rutas protegidas requieren cabecera:

```
Authorization: Bearer <token>
```


| Prefijo                   | Descripción                                       |
| ------------------------- | ------------------------------------------------- |
| `POST /api/auth/register` | Registro de usuario                               |
| `POST /api/auth/login`    | Login (devuelve JWT)                              |
| `/api/accounts`           | Cuentas del usuario                               |
| `/api/categories`         | Categorías                                        |
| `/api/transactions`       | Movimientos (ingreso/gasto)                       |
| `/api/subscriptions`      | Suscripciones recurrentes                         |
| `/api/reports/*`          | Resumen, gastos por categoría/mes/día, top gastos |


## Rutas de la aplicación (cliente)


| Ruta                  | Pantalla      |
| --------------------- | ------------- |
| `/login`, `/register` | Autenticación |
| `/home`               | Resumen       |
| `/movimientos`        | Transacciones |
| `/suscripciones`      | Suscripciones |
| `/cuentas`            | Cuentas       |
| `/categorias`         | Categorías    |
| `/reportes`           | Reportes      |


## Build de producción (Electron)

```bash
cd client
npm run build
```

## Notas

- La base SQLite por defecto vive en `server/src/shared/db/` (el archivo `.sqlite` está en `.gitignore`).
- El script raíz `npm run dev` ejecuta servidor y cliente en paralelo con `concurrently`.

