var miImage = document.querySelector ('img');
miImage.onclick = function(){
    var miSrc = miImage.getAttribute('src');
    if (miSrc === 'images/firefox_logo.png'){
        miImage.setAttribute('src', 'images/mozilla2.jpg');
    }
    else {
        miImage.setAttribute('src','images/firefox_logo.png');
    }
}
var miTitulo = document.querySelector('h1');
var miBoton = document.querySelector ('button');
function estableceNombreUsuario(){
    var miNombre = prompt ('Por favor, ingresa tu nombre.');
    localStorage.setItem ('nombre', miNombre);
    miTitulo.textContent = 'Mozilla is cool,' + miNombre;
}
 if (!localStorage.getItem('nombre')){
       estableceNombreUsuario();
 }
 else{
    var nombreAlmacenado = localStorage.getItem ('nombre');
    miTitulo.textContent = 'Mozilla is cool,' + nombreAlmacenado;
 }
miBoton.onclick = function(){
    estableceNombreUsuario();
}