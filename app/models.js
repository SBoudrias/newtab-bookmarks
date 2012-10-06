
var db = openDatabase("todos", "", "Backbone-websql example", 1024*1024);



var Bookmark = Backbone.Model.extend({
 // url: '/bookmarks',
 defaults:{
   hasHtml: false
 },
 //store: new WebSQLStore(db, "todos"),
  //localStorage : new Backbone.LocalStorage('settingsStore'),
  promptColor: function() {
    var cssColor = prompt("Please enter a CSS color:");
    this.set({color: cssColor});
  },
  initialize: function(){
    //console.log(this.attributes.url);
    var url = this.attributes.url;
    
    if(isUrl(url)){
      this.set('domain', getDomain(url))
    }else{
      //this can be a bookmarklet, a FTP, or special page bookmark...
    }
    
    //if there's no title, set the domain name or URL?
    
    
  },
  downloadHTML: function(cb){
    var that = this;
    if(!cb)var cb = function(){};
    console.log(this.get('url'));
    $.get(this.get('url'), {},
      function(data, textStatus, jqXHR){
        that.set('html',data);
        that.set('hasHtml',true);
        var dom = new DOMParser().parseFromString(data, 'text/html');
        var body = dom.body;
        //console.log(dom);
        var includeWhitespace = false;
        var textNodes = getTextNodesIn(body, includeWhitespace); //get all text nodes from the fetched DOM
        texts = _.pluck(textNodes, 'data'); //array of all text STR
          var arrays = _.map(texts, function(t){ return t.split(' ') });
           var words =_.uniq(_.flatten( arrays ));//merge all words arrays into one
           var keywords = _.uniq(_.map(words, function(w){ //lowercase, trim, and exclude punctuation
             w = w.replace(/[\.,\/#!?$%\^&\*;:{}=\_`~()]/g,"").toLowerCase();//w.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
             w = w.replace(/\s{2,}/g," "); //remove dbl whitespace
             w = w.replace(' ',"").replace(' ',"").replace(' ',"");
             w = w.replace(' ',"");
             return w; 
             }));
           /*
           console.log(textNodes);
           console.log(texts);
          console.log(arrays);
          console.log(words);
          console.log(keywords);*/
         // console.log(ms_end - ms_start);
        console.log(keywords.length+' keywords found for '+that.get('url'));
        //that.save();
      }).error(function() { 
        console.log('error found!')
        that.set('html','');
        that.set('hasHtml','error');
        that.save(); 
      })
  }
});



var BookmarkCollection = Backbone.Collection.extend({
  model: Bookmark,
  //localStorage : new Backbone.LocalStorage('settingsStore'),
  store: new WebSQLStore(db, "todos"),
  saveAll: function(){
    _.each(this.models, function(m){
      m.save();
    });
  },
  scheduleHtmlDownload: function(){
    var that = this;
    this.htmlInterval = window.setInterval(function(){
      console.log('downloading...')
      //find a model with no HTML
      var todo = that.where({hasHtml: false});
      if(todo.length >1){
        
        var remaining = todo.length - that.length
        console.log('('+remaining+'/'+that.length+')');
      //  var model = todo[Math.floor(Math.random()*todo.length)]; //pick a random one...
        var model = todo[0];
        model.downloadHTML();
      }else{
        console.log('download complete!...')
        window.clearInterval(that.htmlInterval); // window.clearInterval(app.collection.htmlInterval) /works
      }
      /// call your function here
    }, 1000);
  },
  
    //////////////////////////////////////////
   //   meta data
  //////////////////////////////////////////
  computeDomainCounts: function(){
  var models    = _.pluck(this.models, 'attributes');
  var domains    = _.pluck(models, 'domain');
  //console.log(domains);
  result = { };
  for(i = 0; i < domains.length; ++i) {
      if(!result[domains[i]])
          result[domains[i]] = 0;
      ++result[domains[i]];
  }
  var sorted = sortObject(result).reverse(); //_.sortBy(result, function(item){ 
  this.domains = sorted ;
  
  
  //populate the view!!
  var html = '';
  _.each(this.domains, function(d){
    console.log(d);
    if(d.value > 1){
      html += '<li data-domain="'+d.key+'"><a>'+d.key+'('+d.value+')'+'</a></li>'
    }
  })
  $('.favourites_sites .sites').html(html);
  
  
  return sorted;
  
  },
  //////////////////////////////////////////
 //   CHROME IMPORTER
//////////////////////////////////////////
  importChromeBookmarks: function(){
    var that = this;
   
    var bookmarkTreeNodes = chrome.bookmarks.getTree(
      function(bookmarkTreeNodes) {
         console.log(bookmarkTreeNodes);
        that.parseChromeBookmarkTree(bookmarkTreeNodes); //start the recursive process
        that.render();
      });
  },
  parseChromeBookmarkTree: function(tree){
    var that= this
    _.each(tree, function(n){
    if (n.children && n.children.length > 0) {//it's a folder
      that.parseChromeBookmarkTree(n.children);
    }else{ //it's a URL
        that.addChromeBookmark(n);
    }
    })//eo each
  },
  addChromeBookmark: function(tree){
    //TODO: cleanup the garbage in this object...
    //TODO: only add if it doesn't exists...
    this.add({title: tree.title, url:tree.url, dateAdded:tree.dateAdded, id:tree.id}); //add to collection
  },
  
  
  //////////////////////////////////////////
 //   DISPLAY
//////////////////////////////////////////  

  render: function(){
    var that =this;
    this.computeDomainCounts(); //populate the dropdown for sites list
    
    // POPULATE THE LIST
    var html = "";
    var urls = _.pluck(this.models, 'attributes');//returns the naked models
    _.each(urls, function(u) {
      
      html += '<li data-id="'+u.id+'">';
      html += '<div class="meta">';
      html += '<img src="chrome://favicon/'+ u.url +'" class="favicon" />';
      html += '<a href="'+ u.url +'">'+ u.title +'</a>';
      html +=' ~ <em class="domain">'+u.domain + '</em>';
      html += '</div">';
       html += '<img src="http://pagepeeker.com/thumbs.php?size=x&url='+ u.url +'" class="thumb" />'; //http://pagepeeker.com/thumbs.php?size=x&url=www.weareacademy.com
      
      html +='</li>';
    });
    $('#bookmarks').html(html);
    _.defer(function(){
      that.setBgColors();
    })
    
  },
  setBgColors: function(){
    var that = this;
    $('img.favicon').each(function(me){
      var color = getDominantColor($(this)) 
      //console.log('color', color);
      
      $(this).parent().parent().css('background-color', "rgb("+color[0]+"," + color[1] + "," + color[2] + ")");
      
      var model = app.collection.get( $(this).parent().parent().attr('data-id') );
      model.set('dominantColor',color);
      //TODO: save color into the model...
    })
  }
  
}

  


);

