# ENTREGA - SPRINT 4 

## IMPORTANTE:

Debido al cambio a la autenticación hacia JWT, todas las solicitudes deben incluir el header `Authorization` con la palabra `Bearer ` (y un espacio) y luego valor del token de usuario asignado por el backend. Se puede acceder a este token con `localStorage.getItem('userToken')!`. Además, los headers deben ir acompañados con `withCredentials: true`.

Ejemplo:

    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'Authorization' : 'Bearer '+ localStorage.getItem('userToken')
        }),
      withCredentials : true
    }

Hasta el momento, están actualizados los servicios:
- Formularios       (Necesario para el sidebar)
- Clasificaciones   (Como ejemplo)
- Personas          (Necesario para los datos de usuario/nombres)

# Sistema formularios

Es necesario verificar que el equipo cuente con ``Angular ^17.3.3``, ``NodeJS ^20.11``.

## Varibles de entorno

En src/environments/env.ts realizar las siguientes modificaciones:

    API_URL : 'http://localhost:8000/api/',                                 <- URL del back-end
    GOOGLE_REDIRECT_URL : 'http://localhost:8000/login/google/redirect',    <- URL de redirección hacia Google, desde el backend
    GOOGLE_CALLBACK_URL : 'http://localhost:8000/login/google/callback'     <- URL donde enviar los datos desde Google al backend

En Google Cloud es necesario configurar la dirección del frontend`/google/callback` como `URI de redireccionamiento autorizado`, ya el front hace de tunel para enviar los datos recibidos al backend. (POR IMPLEMENTAR)


## Iniciar el proyecto

Verificar que se tenga ``Angular ^17.3.3`` instalado, sino, instalar la última versión (quitando la anterior).

    npm uninstall --global @angular/cli
    npm install --global @angular/cli@latest

Luego, una vez dentro del directorio del proyecto, limpiar caché e instalar los módulos de NodeJS.

    npm cache clean --force
    npm install --legacy-peer-deps

También, recordar modificar las variables de entorno en ``src/environments/env``, donde se modifica la URL de la API y la URL de redireccionamiento de Google para el inicio de sesión.

Finalmente, para iniciar el proyecto usar el comando

    ng serve

El cual levantará el servidor en [http://localhost:4200](http://localhost:4200)

## Construir el proyecto

Ejecutar `ng build` para construir el proyecto. El resultado se creará en el directorio `dist/`.


## Errores frecuentes

#### Access to XMLHttpRequest at 'backendoUrl/api/login' from origin 'frontendUrl' has been blocked by CORS policy: (...)

- Verificar las variables de entorno del backend, el archivo ``.env`` debe configurada la línea:


        FRONTEND_URL=frontendUrl

#### HTTP 401

- Verificar que se incluya el header ``Authorization`` en la solicitud, y que este tenga un token válido.
