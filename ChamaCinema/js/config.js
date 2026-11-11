const TMDB_API_KEY = '1252fb3b6a045009b37647a44f008051';
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

function Favoritar(id = 0){
    let usu = getmemoria("usuarioLogado");
    let usus= getmemoria("usuarios");
    if (usu && usus) {
        usu.favoritos.push(id);
        usus.forEach(i => {
            if (i.usuario == usu.usuario){
                i = usu;
            }
        });
    }
    setmemoria("usuarioLogado", usu);
    setmemoria("usuarios", usus);
}
