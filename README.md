<h1>RavenShop - API</h1>

<p>
    API desarrollada en Node.js para gestionar una tienda ficticia de ropa. El proyecto ofrece una versión adaptada a necesidades de almacenamiento utilizando una base de datos.
</p>

<h2>Características</h2>
<ul>
    <li><strong>Versión con Base de Datos:</strong> Utiliza una base de datos (como MongoDB, MySQL, etc.) para un almacenamiento robusto y escalable.</li>
</ul>

<h2>Requisitos Previos</h2>
<ul>
    <li>Node.js instalado.</li>
    <li><a href="#">Base de datos específica</a> (solo para la rama <code>database-version</code>).</li>
    <li>Git instalado para clonar y gestionar el repositorio.</li>
</ul>

<h2>Instalación</h2>
<ol>
    <li>Clona el repositorio:</li>
    <pre><code>git clone &lt;URL-del-repositorio&gt;</code></pre>
    <li>Cambia a la rama <code>database-version</code>:</li>
    <pre><code>git checkout database-version</code></pre>
    <li>Instala las dependencias:</li>
    <pre><code>npm install</code></pre>
</ol>

<h2>Uso</h2>

<h3>Versión con Base de Datos</h3>
<ol>
    <li>Configura la conexión a la base de datos en el archivo <code>.env</code>.</li>
    <li>Realiza las migraciones para la creación de las tablas dentro de la carpeta src con el siguiente comando:</li>
    <pre><code>npx sequelize-cli db:migrate</code></pre>
    <li>Inicia la API:</li>
    <pre><code>npm start</code></pre>
</ol>
