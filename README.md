# Sistema formularios

Es necesario verificar que el equipo cuente con ``Angular ^17.3.3``, ``NodeJS ^20.11``.

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

## IMPORTANTE

Si se están realizando pruebas con ``ngrok``, es necesario agregar un ``header`` para que no falle la API. En cada servicio hay que agregar esta constante **fuera** del ``export class``:

    const headers = new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value'
    });

y luego, en cada llamada ``GET``, agregar el ``header`` como parámetro, como en este ejemplo de ``src/app/services/formularios.service.ts``:

    getselects(): Observable<any> {
        return this.http.get(this.url+'/getselects', {headers} );
    }

Por otra parte, cada *request* que no tenga una autenticación y que no sea un ``GET`` (como un post a /login, /register, /forgot-password), debería pedir un csfrToken, realizando esto antes de la llamada:

    this.http.get(env.CSRF_COOKIE_URL);