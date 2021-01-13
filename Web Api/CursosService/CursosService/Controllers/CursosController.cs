using CursosDataAccess;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace CursosService.Controllers
{

  [RoutePrefix("api/curso")]  
  public class CursoController : ApiController
  {

    private int CalcularDistancia(double origem_lat, double origem_lng, double destino_lat, double destino_lng)
    {
      double x1 = origem_lat;
      double x2 = destino_lat;
      double y1 = origem_lng;
      double y2 = destino_lng;

      // Distancia entre os 2 pontos no plano cartesiano ( pitagoras )
      //double distancia = System.Math.Sqrt( System.Math.Pow( (x2 - x1), 2 ) + System.Math.Pow( (y2 - y1), 2 ) );

      // ARCO AB = c 
      double c = 90 - (y2);

      // ARCO AC = b 
      double b = 90 - (y1);

      // Arco ABC = a 
      // Diferença das longitudes: 
      double a = x2 - x1;

      // Formula: cos(a) = cos(b) * cos(c) + sen(b)* sen(c) * cos(A) 
      double cos_a = Math.Cos(b) * Math.Cos(c) + Math.Sin(c) * Math.Sin(b) * Math.Cos(a);

      double arc_cos = Math.Acos(cos_a);

      // 2 * pi * Raio da Terra = 6,28 * 6.371 = 40.030 Km 
      // 360 graus = 40.030 Km 
      // 3,2169287 = x 
      // x = (40.030 * 3,2169287)/360 = 357,68 Km 

      double distancia = (40030 * arc_cos) / 360;
      
      return Convert.ToInt32(distancia);
    }

    [Route("")]
    public IEnumerable<CURSO> GetAll()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        return entities.CURSOS.Where(a => a.ATIVO == "SIM").ToList();
      }
    }

    [Route("publicidade")]
    public IEnumerable<PUBLICIDADE> getPublicidade()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {

        return entities.PUBLICIDADEs.Where(x => x.ATIVO == "SIM").ToList();
      }
    }

    [Route("addUser/{nomeUsuario}/{emailUsuario}/")]    
    public void getAddUsuario(string nomeUsuario, string emailUsuario)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<USUARIO> result = new List<USUARIO>();

        result = (from a in entities.USUARIOS
                  where a.EMAIL == emailUsuario
                  select a).ToList();

        if(result.Count == 0)
        {
          USUARIO usuario = new USUARIO();
          usuario.NOME = nomeUsuario;
          usuario.EMAIL = emailUsuario;
          entities.USUARIOS.Add(usuario);
          entities.SaveChanges();
        }
      }
    }

    [Route("filtro/{filtroCurso}/{latitude}/{longitude}/")]    
    public IEnumerable<CURSO> getCursosFilt(string filtroCurso, double latitude, double longitude)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<CURSO> result = new List<CURSO>();
        string ufdoCurso = (filtroCurso.Split(';')[0] == "null" ? null : filtroCurso.Split(';')[0]);
        string cidadedoCurso = (filtroCurso.Split(';')[1] == "null" ? null : filtroCurso.Split(';')[1]);
        string categdoCurso = (filtroCurso.Split(';')[2] == "null" ? null : filtroCurso.Split(';')[2]);
        string instdoCurso = (filtroCurso.Split(';')[3] == "null" ? null : filtroCurso.Split(';')[3]);
        var precodoCurso = Convert.ToDecimal(filtroCurso.Split(';')[4]);
        var distdoCurso = Convert.ToDecimal(filtroCurso.Split(';')[5]);
        string curso = (filtroCurso.Split(';')[6] == "null" ? null : filtroCurso.Split(';')[6]);

        result = (from a in entities.CURSOS
                  where precodoCurso == 0 ? a.VALOR > 0 : a.VALOR <= precodoCurso
                  where String.IsNullOrEmpty(ufdoCurso) ? a.UFCURSO != " " : a.UFCURSO == ufdoCurso
                  where String.IsNullOrEmpty(cidadedoCurso) ? a.CIDADE != " " : a.CIDADE == cidadedoCurso
                  where String.IsNullOrEmpty(categdoCurso) ? a.CATEGCURSO != " " : a.CATEGCURSO == categdoCurso
                  where String.IsNullOrEmpty(instdoCurso) ? a.INSTITUICAO != " " : a.INSTITUICAO == instdoCurso
                  where String.IsNullOrEmpty(curso) ? a.CURSO1 != " " : a.CURSO1 == curso
                  where a.ATIVO == "SIM"
                  select a).ToList();

        for (int index = 0; index < result.ToArray().Length; index++)
        {
          result[index].DISTANCIA = CalcularDistancia(latitude, longitude, Convert.ToDouble(result[index].LATITUDE), Convert.ToDouble(result[index].LONGITUDE));
        }

        return distdoCurso == 0 ? result : result.Where(x => x.DISTANCIA <= distdoCurso).ToList();        
      }
    }

    [Route("{id:int}")]
    public CURSO Get(int id)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        return entities.CURSOS.FirstOrDefault(e => e.ID == id && e.ATIVO == "SIM");
      }
    }

    [Route("{instituicao}/{latitude}/{longitude}/")]
    public IEnumerable<CURSO> GetCursosInst(string instituicao, double latitude, double longitude)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {        
        string instdoCurso = (instituicao.Split(';')[0] == "null" ? null : instituicao.Split(';')[0]);
        int idCurso = Convert.ToInt32(instituicao.Split(';')[1] == "null" ? null : instituicao.Split(';')[1]);

        var result = entities.CURSOS.Where(e => e.ID != idCurso && e.INSTITUICAO == instdoCurso && e.ATIVO == "SIM").ToList();

        for (int index = 0; index < result.ToArray().Length; index++)
        {
          result[index].DISTANCIA = CalcularDistancia(latitude, longitude, Convert.ToDouble(result[index].LATITUDE), Convert.ToDouble(result[index].LONGITUDE));
        }

        return result;
      }
    }

    [Route("listauf")]
    public IEnumerable<ESTADOCURSO> GetUF()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {

        List<ESTADOCURSO> result = new List<ESTADOCURSO>();

        result = (from a in entities.CURSOS
                  where a.ATIVO == "SIM"
                  group a by new { a.UFCURSO, a.DESCUF } into tmp
               select new ESTADOCURSO()
               {
                 UFCURSO = tmp.Key.UFCURSO,
                 DESCUF = tmp.Key.DESCUF
               }).ToList();

        return result;
      }
    }

    [Route("estados")]
    public IEnumerable<ESTADO> GetESTADO()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<ESTADO> result = new List<ESTADO>();

        result = (from a in entities.ESTADOS
                  orderby a.NOME
                  select a).ToList();

        return result;
      }
    }

    [Route("categoria")]
    public IEnumerable<CATEGFILTRO> GetCategoria()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<CATEGFILTRO> result = new List<CATEGFILTRO>();

        result = (from a in entities.CURSOS
                  where a.ATIVO == "SIM"
                  group a by a.CATEGCURSO into tmp
                  select new CATEGFILTRO()
                  {
                    CATEGCURSO = tmp.Key                    
                  }).ToList();

        return result;
      }
    }

    [Route("instituicao")]
    public IEnumerable<INSTITUICAO> GetInstituicao()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<INSTITUICAO> result = new List<INSTITUICAO>();

        result = (from a in entities.CURSOS
                  where a.ATIVO == "SIM"
                  group a by a.INSTITUICAO into tmp
                  select new INSTITUICAO()
                  {
                    INSTCURSO = tmp.Key
                  }).ToList();

        return result;
      }
    }

    [Route("desccurso")]
    public IEnumerable<DESCCURSO> GetCurso()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<DESCCURSO> result = new List<DESCCURSO>();

        result = (from a in entities.CURSOS
                  where a.ATIVO == "SIM"
                  group a by a.CURSO1 into tmp
                  select new DESCCURSO()
                  {
                    DESCRICAO = tmp.Key
                  }).ToList();

        return result;
      }
    }

    [Route("listaCategorias")]
    public IEnumerable<CATEGORIA> getListaCategorias()
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<CATEGORIA> result = new List<CATEGORIA>();

        result = (from a in entities.CATEGORIAS
                  orderby a.NOME
                  select a).ToList();

        return result;
      }
    }

    [Route("getUser/{emailUsuario}")]
    public IEnumerable<USUARIO> GetUsuario(string emailUsuario)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<USUARIO> result = new List<USUARIO>();

        result = (from a in entities.USUARIOS
                  where a.EMAIL == emailUsuario
                  select a).ToList();

        return result;
      }
    }

    [Route("cidades/{estadoCurso}")]
    public IEnumerable<CIDADES> GetCidades(string estadoCurso)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        var result = (from a in entities.CURSOS
                      where a.UFCURSO == estadoCurso
                      where a.ATIVO == "SIM"
                      group a by a.CIDADE into tmp
                      select new CIDADES()
                      {
                        CIDADECURSO = tmp.Key,
                      }).ToList();

        return result;
      }
    }

    [Route("municipios/{codEstado}")]
    public IEnumerable<MUNICIPIO> getMunicipios(int codEstado)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        return entities.MUNICIPIOS.Where(a => a.CODIGO_UF == codEstado).ToList();
      }
    }

    [Route("meusCursos/{usuario}")]
    public IEnumerable<CURSO> getMeusCursos(string usuario)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        return entities.CURSOS.Where(a => a.EMAILUSUARIO == usuario && a.ATIVO == "SIM").ToList();
      }
    }

    [Route("getCheckFavorito/{idCurso}/{emailUsuario}")]
    public IEnumerable<CURSOSFAVORITO> getCheckFavorito(int idCurso, string emailUsuario)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        return entities.CURSOSFAVORITOS.Where(a => a.IDCURSO == idCurso && a.EMAIL == emailUsuario).ToList();
      }
    }

    [Route("meusCursosFavoritos/{usuario}/{latitude}/{longitude}/")]
    public IEnumerable<CURSO> getMeusCursosFavoritos(string usuario, double latitude, double longitude)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        var result = (from favorito in entities.CURSOSFAVORITOS
                      join curso in entities.CURSOS
                      on favorito.IDCURSO equals curso.ID into meusFavoritos
                      from cursos in meusFavoritos
                      where favorito.EMAIL == usuario
                      where cursos.ATIVO == "SIM"
                      select cursos).ToList();

        for (int index = 0; index < result.ToArray().Length; index++)
        {
          result[index].DISTANCIA = CalcularDistancia(latitude, longitude, Convert.ToDouble(result[index].LATITUDE), Convert.ToDouble(result[index].LONGITUDE));
        }

        return result;
      }
    }

    //Get action methods of the previous section
    [AcceptVerbs("POST")]
    [Route("addCadastroUsuario")]
    public IHttpActionResult PostAddCadastroUsuario(USUARIO usuario)
    {
      if (!ModelState.IsValid)
        return BadRequest("Invalid data.");

      using (var ctx = new STUDYEntities())
      {
        var registros = ctx.USUARIOS.First<USUARIO>(a => a.ID == usuario.ID);

        registros.NOMECOMPLETO = usuario.NOMECOMPLETO;
        registros.ENDERECO = usuario.ENDERECO;
        registros.NUMEROLOCAL = usuario.NUMEROLOCAL;
        registros.BAIRRO = usuario.BAIRRO;
        registros.CIDADE = usuario.CIDADE;
        registros.ESTADO = usuario.ESTADO;
        registros.TELEFONE = usuario.TELEFONE;
        registros.CELULAR = usuario.CELULAR;
        registros.WHATSAPP = usuario.WHATSAPP;
        registros.EMAILCOMERCIAL = usuario.EMAILCOMERCIAL;
        registros.WEBSITE = usuario.WEBSITE;
        registros.CEP = usuario.CEP;
        registros.UF = usuario.UF;

        ctx.SaveChanges();
      }

      return Ok();
    }

    [AcceptVerbs("POST")]
    [Route("addNovoCurso")]
    public void getAddNovoCurso(CURSO dadosCurso)
    {
      using (STUDYEntities entities = new STUDYEntities())
      {
        List<USUARIO> result = new List<USUARIO>();

        result = (from a in entities.USUARIOS
                  where a.EMAIL == dadosCurso.EMAILUSUARIO
                  select a).ToList();


        CURSO curso = new CURSO();
        curso.UFCURSO = result[0].UF.ToUpper();
        curso.DESCUF = result[0].ESTADO.ToUpper();
        curso.CIDADE = result[0].CIDADE.ToUpper();
        curso.CATEGCURSO = dadosCurso.CATEGCURSO.ToUpper();
        curso.INSTITUICAO = result[0].NOMECOMPLETO.ToUpper();
        curso.VALOR = dadosCurso.VALOR;
        curso.CURSO1 = dadosCurso.CURSO1.ToUpper();
        curso.ENDERECO = result[0].ENDERECO.ToUpper();
        curso.NUMRESIDENCIA = result[0].NUMEROLOCAL.ToUpper();
        curso.BAIRRO = result[0].BAIRRO.ToUpper();
        curso.TELEFONE = result[0].TELEFONE;
        curso.DETALHE = dadosCurso.DETALHE.ToUpper();
        curso.CEP = result[0].CEP;
        curso.WEBSITE = result[0].WEBSITE;
        curso.ATIVO = "NAO";
        curso.EMAILUSUARIO = dadosCurso.EMAILUSUARIO;
        curso.CARGAHORARIA = dadosCurso.CARGAHORARIA;
        curso.VAGAS = dadosCurso.VAGAS;
        curso.DATAINICIO = dadosCurso.DATAINICIO;
        curso.LATITUDE = result[0].LATITUDE;
        curso.LONGITUDE = result[0].LONGITUDE;
        entities.CURSOS.Add(curso);
        entities.SaveChanges();

      }
    }

    [AcceptVerbs("POST")]
    [Route("DesativarCurso")]
    public string DesativarCurso(CURSO curso)
    {

      STUDYEntities context = new STUDYEntities();      
      CURSO cursos = context.CURSOS.First(p => p.ID == curso.ID);
      cursos.ATIVO = "NAO";
      context.SaveChanges();

      return "SUCESSO";
    }

    [AcceptVerbs("POST")]
    [Route("favoritarCurso")]
    public string postFavoritarCurso(CURSOSFAVORITO favorito)
    {

      STUDYEntities context = new STUDYEntities();
      CURSOSFAVORITO cursosfavoritos = new CURSOSFAVORITO();
      cursosfavoritos.EMAIL = favorito.EMAIL;
      cursosfavoritos.IDCURSO = favorito.IDCURSO;
      cursosfavoritos.CURSO = favorito.CURSO;
      context.CURSOSFAVORITOS.Add(cursosfavoritos);
      context.SaveChanges();

      return "SUCESSO";
    }

    [HttpDelete]
    [Route("desfavoritarCurso/{idCurso}/{emailUsuario}")]
    public string deletarCursoFavorito(int idCurso, string emailUsuario)
    {
      using (var ctx = new STUDYEntities())
      {
        var registros = ctx.CURSOSFAVORITOS.First<CURSOSFAVORITO>(a => a.EMAIL == emailUsuario && a.IDCURSO == idCurso);
        ctx.CURSOSFAVORITOS.Remove(registros);
        ctx.SaveChanges();
      }

      return "SUCESSO";
    }

    [HttpPost]
    [Route("UploadImage")]
    public HttpResponseMessage UploadImage()
    {
      string imageName = null;
      var httpRequest = HttpContext.Current.Request;
      //Upload Image
      var postedFile = httpRequest.Files["Image"];
      //Create custom filename
      imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
      imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
      var filePath = HttpContext.Current.Server.MapPath("~/StudyImages/" + imageName);
      postedFile.SaveAs(filePath);

      return Request.CreateResponse(HttpStatusCode.Created);
    }
  }

  public partial class ESTADOCURSO {

    public string UFCURSO { get; set; }
    public string DESCUF { get; set; }

  }

  public partial class CATEGFILTRO
  {
    public string CATEGCURSO { get; set; }    
  }

  public partial class DESCCURSO
  {
    public string DESCRICAO { get; set; }
  }

  public partial class INSTITUICAO
  {
    public string INSTCURSO { get; set; }
  }

  public partial class CIDADES
  {
    public string CIDADECURSO { get; set; }
  }

  public partial class Image
  {
    public int ImageID { get; set; }
    public string ImageCaption { get; set; }
    public string ImageName { get; set; }
  }

}
