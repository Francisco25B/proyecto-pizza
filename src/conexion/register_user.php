<?php
// Configuración de la conexión a la base de datos
$host = 'localhost';
$user = 'root'; // Usuario de MySQL
$password = ''; // Contraseña de MySQL (deja vacío si no tienes configurada una contraseña)
$database = 'giovannis'; // Nombre de la base de datos

// Establecer conexión
$conn = new mysqli($host, $user, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Manejar la solicitud de registro
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos del formulario
    $fullName = $_POST['fullName'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $placeReferences = $_POST['placeReferences'];

    // Query para insertar datos en la tabla 'users'
    $sql = "INSERT INTO users (nombre, numero, gmail, direccion, referencias) VALUES ('$fullName', '', '$email', '$address', '$placeReferences')";

    if ($conn->query($sql) === TRUE) {
        echo "Registro exitoso";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Cerrar conexión
$conn->close();
?>
