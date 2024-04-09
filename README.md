# Sistema formularios

Es necesario verificar que el equipo cuente con ``Angular ^17.3.3``, ``NodeJS ^20.11``.

## Iniciar el proyecto

Verificar que se tenga ``Angular ^17.3.3`` instalado, sino, instalar la última versión (quitando la anterior).

    npm uninstall --global @angular/cli
    npm install --global @angular/cli@latest

Luego, una vez dentro del directorio del proyecto, limpiar caché e instalar los módulos de NodeJS.

    npm cache clean --force
    npm install --legacy-peer-deps

Finalmente, para iniciar el proyecto usar el comando

    ng serve

El cual levantará el servidor en [http://localhost:4200](http://localhost:4200)

## Construir el proyecto

Ejecutar `ng build` para construir el proyecto. El resultado se creará en el directorio `dist/`.


