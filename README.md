# JWT-Angular

Cliente Angular 18 que implementa el flujo de autenticación con **JSON Web Tokens (JWT)**: login contra una API, almacenamiento del token e inyección automática de la cabecera `Authorization: Bearer` en las peticiones HTTP.

> Proyecto de formación. Es solo el frontend; necesita una API que exponga `POST /auth/login` (ver [contrato esperado](#contrato-de-la-api)).

## Funcionalidades

- **Formulario de login reactivo** (`ReactiveFormsModule`) con validación de usuario y contraseña obligatorios.
- **`LoginService`:** llama a la API, guarda el token en `sessionStorage` y expone el estado de sesión (`currentUserLoginOn`) y el token (`currentUserData`) como `BehaviorSubject`.
- **Interceptor de autenticación** (`authInterceptor`): añade `Authorization: Bearer <token>` a cada petición si hay sesión.
- **Interceptor de errores** (`ErrorInterceptorService`): implementado para registrar los fallos HTTP, pero aún no está registrado en `provideHttpClient` (pendiente de activar con `withInterceptorsFromDi()` o pasarlo a interceptor funcional).
- **Mensaje de error unificado** cuando las credenciales son incorrectas o la API no responde.
- **Logout:** elimina el token de la sesión.
- Preparado para **SSR** con `@angular/ssr` y Express.

## Tecnologías

| Área | Stack |
|---|---|
| Framework | Angular 18 (componentes *standalone*) |
| Lenguaje | TypeScript 5.5 |
| Reactividad | RxJS 7.8 |
| SSR | `@angular/ssr`, Express 4 |
| Tests | Jasmine y Karma |

## Estructura del proyecto

```
JWT-Angular/
├── src/
│   ├── app/
│   │   ├── auth/login/            # Componente de login (formulario reactivo)
│   │   ├── services/auth/
│   │   │   ├── login.service.ts        # Login, logout y estado de sesión
│   │   │   ├── loginRequest.ts         # Interfaz { username, password }
│   │   │   ├── auth-interceptor.ts     # Añade el Bearer token a las peticiones
│   │   │   └── error-interceptor.service.ts
│   │   ├── app.routes.ts          # Redirige / a /login
│   │   ├── app.config.ts          # Providers de la aplicación
│   │   └── app.config.server.ts   # Configuración SSR
│   ├── main.ts / main.server.ts
│   └── index.html
├── server.ts                      # Servidor Express para SSR
├── angular.json
└── package.json
```

## Instalación y ejecución

Requisitos: [Node.js](https://nodejs.org) 18.19 o superior y npm.

```bash
git clone https://github.com/jortegadmr/jwt-angular.git
cd jwt-angular
npm install
npm start
```

La app queda en <http://localhost:4200/> y recarga sola al guardar cambios.

Otros comandos:

```bash
npm run build       # compila en dist/jwt-angular
npm test            # tests con Karma
npm run serve:ssr:JWT-Angular   # sirve la build SSR (tras npm run build)
```

## Contrato de la API

Por defecto el cliente apunta a `http://localhost:8008` (definido en `src/app/services/auth/login.service.ts`; cámbialo si tu API corre en otra URL).

| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| `POST` | `/auth/login` | `{ "username": "...", "password": "..." }` | `{ "token": "<jwt>" }` |

El resto de peticiones enviarán `Authorization: Bearer <jwt>` mientras haya sesión. La API debe permitir CORS desde `http://localhost:4200`.

## Notas de seguridad

El token se guarda en `sessionStorage` (se borra al cerrar la pestaña, pero es accesible desde JavaScript). Es una decisión válida para un proyecto de aprendizaje; en producción valora cookies `HttpOnly` con `SameSite`.
