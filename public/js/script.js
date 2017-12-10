$(document).ready(function(){
    showCategories()
    showSongs()
})

function showCategories() {
    $.get('/categories', function(){
        $.get( "/categories", function( data ) {
            var html = ''
            data.forEach(function(category) {
                html = html + '<li><a href="#" onClick="showSongs('+category.id+')">'+category.name+'</a></li>'
            })
            $('#categories').html(html)
        });
    })
}

//todo: implement showSongs method
function showSongs(categoryId) {
    if(categoryId) {
        var url = '/categories/'+ categoryId +'/songs';
    } else {
        var url = '/songs'   
    }
    $.get(url, function(data) {
        var html = '';
        data.forEach(
            function(song) {
                html = html + '<div class="song">'
                  +  '<h2>'+song.name+'</h2>'
                  +  '<p>'+song.description+'</p>'
                  +  '<p>Pret: '+song.pret+'</p>'
                  +  '<p>Categorie: '+song.category.name+'</p>'
                + '</div>';
            }
        )
        $('#content').html(html);
    })
}