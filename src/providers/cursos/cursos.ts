import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';

/*
  Generated class for the CursosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CursosProvider {

    private API_URL = 'http://192.168.0.14/api/';
    distCurso: any;
    coordenada = { latitude: 0, longitude: 0 };

    constructor(public http: Http, public geolocation: Geolocation) { }

    getAll() {

        let url = this.API_URL + 'CURSO';
        //let options = new RequestOptions();
        //options.headers = new Headers();
        //options.headers.append('Content-Type', 'application/json');
        //options.headers.append('X-Requested-With', 'XMLHttpRequest');    

        this.getLocation();

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;            
                    this.geolocation.getCurrentPosition().then((resp) => {

                        //Tratamento para distância dos cursos
                        for (var index in response) {
                            this.distCurso = this.calcDistancia(response[index].LATITUDE, response[index].LONGITUDE, resp.coords.longitude, resp.coords.latitude);
                            response[index].DISTANCIA = Math.round(this.distCurso);
                        }

                    }).catch((error) => {
                        console.log('Error getting location cursos', error);
                    });

                    return response;
                },
                error => {              // Error callback
                    console.log('erro: ' + error);
                    return null;
                });
    }

    getPublicidade() {

        let url = this.API_URL + 'CURSO/PUBLICIDADE';
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('X-Requested-With', 'XMLHttpRequest');

        return this.http.get(url, options)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    return response;
                },
                error => {              // Error callback
                    console.log('erro: ' + error);
                    return null;
                });
    }

    getCursosFilt(filtroCurso: any) {
        //return new Promise((resolve, reject) => {         
        let url = this.API_URL + 'CURSO/filtro/' + filtroCurso.estado + ';'
            + filtroCurso.cidade + ';'
            + filtroCurso.categoria + ';'
            + filtroCurso.instituicao + ';'
            + filtroCurso.preco + ';'
            + filtroCurso.distancia + ';'
            + filtroCurso.curso + '/'
            + this.coordenada.latitude + '/'
            + this.coordenada.longitude + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getMeusCursos(usuario: string) {
        //return new Promise((resolve, reject) => {         
        let url = this.API_URL + 'CURSO/meusCursos/' + usuario + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getMeusCursosFavoritos(usuario: string) {
        //return new Promise((resolve, reject) => {         
        let url = this.API_URL + 'CURSO/meusCursosFavoritos/' + usuario + '/'
            + this.coordenada.latitude + '/'
            + this.coordenada.longitude + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    get(id: number) {

        let url = this.API_URL + 'CURSO/' + id;

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });

    }

    getUF() {

        let url = this.API_URL + 'CURSO/listauf';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getEstados() {

        let url = this.API_URL + 'CURSO/estados';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getCategoria() {

        let url = this.API_URL + 'CURSO/categoria';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getListaCategorias() {

        let url = this.API_URL + 'CURSO/listaCategorias';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    console.log(error);
                    return null;
                });
    }

    getCursos() {

        let url = this.API_URL + 'CURSO/desccurso';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getCursosInst(cursosInstituicao: any) {

        let url = this.API_URL + 'CURSO/' + cursosInstituicao.INSTITUICAO + ';'
            + cursosInstituicao.ID + '/'
            + this.coordenada.latitude + '/'
            + this.coordenada.longitude + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });

    }

    getInstituicao() {

        let url = this.API_URL + 'CURSO/instituicao';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getCidade(ufCurso: string) {

        let url = this.API_URL + 'CURSO/cidades/' + ufCurso;

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    getMunicipio(ufCurso: string) {

        let url = this.API_URL + 'CURSO/municipios/' + ufCurso;

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    buscaUsuario(emailUsuario: string) {

        let url = this.API_URL + 'CURSO/getUser/' + emailUsuario + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    checkCursoFavorito(dadosCurso: any) {

        let url = this.API_URL + 'CURSO/getCheckFavorito/' + dadosCurso.idCurso + '/' + dadosCurso.emailUsuario + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    salvaUsuario(nomeUsuario: string, emailUsuario: string) {
        //return new Promise((resolve, reject) => {      
        let url = this.API_URL + 'CURSO/addUser/' + nomeUsuario + '/'
            + emailUsuario + '/';

        return this.http.get(url)
            .map(res => res.json())     // Get the body of the response
            .toPromise()                // Convert the observable into a promise
            .then(
                response => {           // Success callback
                    //this.results = response;
                    return response;
                },
                error => {              // Error callback
                    return null;
                });
    }

    async salvaCadastroUsuario(dadosCadastrais: any) {
        let url = this.API_URL + 'CURSO/addCadastroUsuario';

        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        const requestOptions = new RequestOptions({ headers: headers });

        let postData = {
            "ID": dadosCadastrais[0].ID,
            "NOMECOMPLETO": dadosCadastrais[0].NOME,
            "ENDERECO": dadosCadastrais[0].ENDERECO,
            "NUMEROLOCAL": dadosCadastrais[0].NUMEROLOCAL,
            "BAIRRO": dadosCadastrais[0].BAIRRO,
            "CIDADE": dadosCadastrais[0].CIDADE,
            "ESTADO": dadosCadastrais[0].ESTADO,
            "TELEFONE": dadosCadastrais[0].TELEFONE,
            "CELULAR": dadosCadastrais[0].CELULAR,
            "WHATSAPP": dadosCadastrais[0].WHATSAPP,
            "EMAILCOMERCIAL": dadosCadastrais[0].EMAILCOMERCIAL,
            "WEBSITE": dadosCadastrais[0].WEBSITE,
            "CEP": dadosCadastrais[0].CEP,
            "UF": dadosCadastrais[0].UF
        }

        try {
            const response = await this.http.post(url, postData, requestOptions)
                .map(res => res.json()) // Get the body of the response
                .toPromise(); // Convert the observable into a promise
            console.log(response);
            return response;
        }
        catch (error) {
            return null;
        }
    }

    async salvaNovoCurso(dadosCurso: any) {
        //return new Promise((resolve, reject) => {      
        let url = this.API_URL + 'CURSO/addNovoCurso';
        let tratacateg = dadosCurso.categenvio == "OUTRO" ? dadosCurso.categenvio + '/' + dadosCurso.novacategenvio : dadosCurso.categenvio;
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        const requestOptions = new RequestOptions({ headers: headers });

        let postData = {
            "EMAILUSUARIO": dadosCurso.emailUsuario,
            "CURSO1": dadosCurso.cursoenvio,
            "DETALHE": dadosCurso.descenvio,
            "CATEGCURSO": tratacateg,
            "VALOR": dadosCurso.precoenvio,
            "CARGAHORARIA": dadosCurso.cargahorariaenvio,
            "VAGAS": dadosCurso.vagasenvio,
            "DATAINICIO": dadosCurso.dataenvio,
            "LATITUDE": this.coordenada.latitude,
            "LONGITUDE": this.coordenada.longitude
        }

        try {
            const response = await this.http.post(url, postData, requestOptions)
                .map(res => res.json()) // Get the body of the response
                .toPromise(); // Convert the observable into a promise
            console.log(response);
            return response;
        }
        catch (error) {
            return null;
        }
    }

    async favoritarCurso(dadosCurso: any) {
        //return new Promise((resolve, reject) => {      
        let url = this.API_URL + 'CURSO/favoritarCurso';
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        const requestOptions = new RequestOptions({ headers: headers });

        let postData = {
            "EMAIL": dadosCurso.emailUsuario,
            "IDCURSO": dadosCurso.idCurso,
            "CURSO": dadosCurso.tituloCurso
        }

        try {
            const response = await this.http.post(url, postData, requestOptions)
                .map(res => res.json()) // Get the body of the response
                .toPromise(); // Convert the observable into a promise
            console.log(response);
            return response;
        }
        catch (error) {
            return null;
        }
    }

    async desfavoritarCurso(dadosCurso: any) {
        //return new Promise((resolve, reject) => {      
        let url = this.API_URL + 'CURSO/desfavoritarCurso/' + dadosCurso.idCurso + '/' + dadosCurso.emailUsuario + '/';
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        const requestOptions = new RequestOptions({ headers: headers });

        let postData = {
            "EMAIL": dadosCurso.emailUsuario,
            "IDCURSO": dadosCurso.idCurso,
            "CURSO": dadosCurso.tituloCurso
        }

        try {
            const response = await this.http.delete(url, requestOptions)
                .map(res => res.json()) // Get the body of the response
                .toPromise(); // Convert the observable into a promise
            console.log(response);
            return response;
        }
        catch (error) {
            return null;
        }
    }

    async desativarCurso(idCurso: any) {
        //return new Promise((resolve, reject) => {      
        let url = this.API_URL + 'CURSO/DesativarCurso';

        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        const requestOptions = new RequestOptions({ headers: headers });

        let postData = {
            "ID": idCurso
        }

        try {
            const response = await this.http.post(url, postData, requestOptions)
                .map(res => res.json()) // Get the body of the response
                .toPromise(); // Convert the observable into a promise        
            console.log(response);
            return response;
        }
        catch (error) {
            return null;
        }
    }

    calcDistancia(latitudeCurso, longitudeCurso, longitudeUser, latitudeUser) {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((latitudeCurso - latitudeUser) * p) / 2 + c(latitudeUser * p) * c((latitudeCurso) * p) * (1 - c(((longitudeCurso - longitudeUser) * p))) / 2;
        let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
        return dis;
    }

    getLocation() {
        this.geolocation.getCurrentPosition().then((resp) => {

            this.coordenada.latitude = resp.coords.latitude;
            this.coordenada.longitude = resp.coords.longitude;

        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }
}
