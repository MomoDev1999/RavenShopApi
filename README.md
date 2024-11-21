

<h1>Products Store - API</h1>

<p>
    API desarrollada en Node.js para gestionar una tienda ficticia de ropa. El proyecto ofrece dos versiones en sus ramas, adaptadas a diferentes necesidades de almacenamiento: una basada en base de datos y otra en archivos JSON.
</p>

<h2>Características</h2>
<ul>
    <li><strong>Versión con Base de Datos:</strong> Utiliza una base de datos (como MongoDB, MySQL, etc.) para un almacenamiento robusto y escalable.</li>
    <li><strong>Versión con Archivos JSON:</strong> Almacenamiento ligero en archivos JSON, ideal para prototipos rápidos sin configuraciones complejas.</li>
</ul>

<h2>Ramas del Proyecto</h2>
<ul>
    <li><code>database-version</code>: Implementación de la API con almacenamiento en base de datos.</li>
    <li><code>json-version</code>: Implementación de la API con almacenamiento en archivos JSON.</li>
</ul>

<h2>Requisitos Previos</h2>
<ul>
    <li>Node.js instalado.</li>
    <li>Base de datos específica (solo para la rama <code>database-version</code>).</li>
    <li>Git instalado para clonar y gestionar el repositorio.</li>
</ul>

<h2>Instalación</h2>
<ol>
    <li>Clona el repositorio:</li>
    <pre><code>git clone &lt;URL-del-repositorio&gt;</code></pre>
    <li>Cambia a la rama deseada:</li>
    <pre><code>git checkout database-version</code></pre>
    <p>o</p>
    <pre><code>git checkout json-version</code></pre>
    <li>Instala las dependencias:</li>
    <pre><code>npm install</code></pre>
</ol>

<h2>Uso</h2>

<h3>Versión con Base de Datos</h3>
<ol>
    <li>Configura la conexión a la base de datos en el archivo <code>.env</code>.</li>
    <li>Realiza las migraciones para la creación de las tablas</li>
    <pre><code>npx sequelize-cli db:migrate</code></pre>
    <li>Inicia la API:</li>
    <pre><code>npm start</code></pre>
</ol>

<h3>Versión con Archivos JSON</h3>
<ol>
    <li>Inicia la API sin necesidad de configuraciones adicionales:</li>
    <pre><code>npm start</code></pre>
</ol>



