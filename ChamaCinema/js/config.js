const TMDB_API_KEY = '1252fb3b6a045009b37647a44f008051';
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

function Favoritar(id = 0){
    let usu = getmemoria("usuarioLogado");
    let usus= getmemoria("usuarios");
    if (usu && usus) {
        if (!usu.favoritos.contains(id)){
            usu.favoritos.push(id);
            for (let i = 0; i < usus.length; i++) {
                if (usus[i].usuario == usu.usuario){
                    usus[i] = usu;
                }
            }
        }
        else{
            for (let i = 0; i < usu.preferencias.length; i++) {
                if(usu.preferencias[i] == id) usu.preferencias.splice(i, 1);
            }
        }
        
    }
    setmemoria("usuarioLogado", usu);
    setmemoria("usuarios", usus);
}
