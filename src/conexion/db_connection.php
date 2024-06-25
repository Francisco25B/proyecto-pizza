<?php
$host = 'localhost';
$user = 'root'; // Usuario de MySQL
$password = ''; // Contraseña de MySQL (deja vacío si no tienes configurada una contraseña)
$database = 'react_php_app'; // Nombre de la base de datos

// Conexión a la base de datos
$conn = new mysqli($host, $user, $password, $database);

// Verifica la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
