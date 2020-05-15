var URL = "https://www.googleapis.com/books/v1/volumes?q=";
//contient l'auteur recherché
var recherche;
//Index des résultats google
var startIndex = 0;
//Nombre maximum des resultats retournés par google
const maxResults = '9';
//contient la requête complete
var request;

function affichage(){
    recherche = $("header input")[0].value
    request = URL+"inauthor:" +recherche+ "&startIndex="+startIndex+"&maxResults="+maxResults;

    //On envoie une requete à google et on attends le résultat
    $.get( request, function(datas) {
        console.log(datas)
        if(datas.totalItems > 0){
            
            // On supprime récursivement tous les éléments enfants de l'Element App
            var child = document.getElementById("App").lastElementChild;
            while(child){
                document.getElementById("App").removeChild(child);
                child = document.getElementById("App").lastElementChild;
            }
            
            datas.items.forEach(function(data){
                //On créée une block div pour le passer dans le render
                var childBlock = document.getElementById("App").appendChild(document.createElement('div'))
                ReactDOM.render(
                    <Vignette data={data}/>,
                    childBlock
                )
            })
        }
        else{
            alert("Aucun résultat pour l'auteur "+recherche)
        }
    })
}

//ajout d'un evenement au bouton de recherche
$("header button")[0].onclick = function(){affichage()}

//ajout d'un evenement au bouton de défilement gauche
$("footer button[side=left]")[0].onclick = function(){
    if(startIndex > 0){
        startIndex -= 9;
        affichage()
    }
}
//ajout d'un evenement au bouton de défilement droit
$("footer button[side=right]")[0].onclick = function(){
    startIndex += 9
    affichage()
}
//classe de vignette
class Vignette extends React.Component{
    constructor(props){
        super(props)
        this.titre = props.data.volumeInfo.title;
        this.annee = props.data.volumeInfo.publishedDate;
        this.description = props.data.volumeInfo.description;
        this.image = props.data.volumeInfo.imageLinks.smallThumbnail;
        this.page = props.data.saleInfo.buyLink;
        //format de l'année de publication
        this.annee = "publié le "+ new Date(this.annee).toLocaleDateString('fr');
        //nombre de caractères limité à 100 caractères
        if(this.description.length > 100){
            this.description = this.description.substr(0,97)+"...";
        }
    }

    render(){
        return(
            <div>
                <a href={this.page}>
                    <img src={this.image} />
                </a>
                <div>
                    <h1><a href={this.page}>{this.titre}</a></h1>
                    <h3>{this.annee}</h3>
                    <p>{this.description}</p>
                </div>
            </div>
        );
    }
}