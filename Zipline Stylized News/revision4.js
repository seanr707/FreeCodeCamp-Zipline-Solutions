function createAndSort(dataObj, sortObj) {
  var keys = Object.keys(sortObj).sort(function(a, b) {
              return a - b;
            }).reverse();

  // A very long for loop
  keys.forEach(function(key) {
    // Reduces dataObj to the one item we want (use [0] to take out the one item in array)
    var item = dataObj.filter(function(dataPiece) {
      return dataPiece.id == sortObj[key] ? true : false;
    })[0]; 
  
    // This section creates the html code of our received data
    var maxChar = 30;
    var width;
    var img; 
    var head = [
      '<div class="image">', img, '</div>',
      '<div class="head-list">', item.headline, ,'</div>',
    ];
    var desc = ['<p id="desc">', 
                item.metaDescription.length > maxChar ?
                item.metaDescription.substr(0, maxChar) + '...' : item.metaDescription,
                '</p>',];
    var foot = [
      '<div id="votes">', 'Votes: ', item.upVotes.length, '</div>',
      '<div id="author">', item.author.username, '</div>',
    ];
    
    if (item.image == '') {
        width = 'col-md-1 col-xs-1 section-small';
        img = '';
      } else {
        width = 'col-md-2 col-xs-2 section-large';
        img = '<img src="' + item.image + '">';
    }
    
    $('<a/>', {
      href: item.link,
      html: $('<div/>', {
        id: 'section',
        class: width + ' nonhover section-' + item.id,
        html: $('<div/>', {
          id: 'subsection',
          class: item.id,
          // html: props.join(''),
        }),
      }),
    }).appendTo('#app');
    
    $('<div/>', {
      class: 'header-' + item.id,
      id: 'header',
      html: head.join(''),
    }).appendTo('.' + item.id);
    
    $('<a/>', {
      href: 'http://www.freecodecamp.com/news/' + item.storyLink.replace(/[\s]/g, '-'),
      html: $('<div/>', {
        class: 'footer-' + item.id,
        id: 'footer',
        html: foot.join(''),
      })
    }).appendTo('.' + item.id);
    
    var $desc = $('<div/>', {
      class: 'desc',
      html: desc.join(''),
    });

    $('.section-' + item.id).hover(
      function() {
        $(this).addClass('hover');
        $(this).removeClass('nonhover');
        $(this).css('height', '256px');
        $desc.appendTo($(this.subsection));
      }, function() {
        $(this).removeClass('hover');
        $(this).addClass('nonhover');
        $(this).css('height', '128px');
        $desc.remove();
      }
    );
  });
}

$(document).ready(function start() {  
  
  $.getJSON('http://www.freecodecamp.com/stories/hot', function(data) {
    var sortDateInfo = {};
    var sortVoteInfo = {};
    var voteHelp = 1;
    
    data.forEach(function(item) {
      sortDateInfo[
        item.timePosted / Math.
          pow(10, parseInt(item.timePosted.toString().length - 1))
      ] = item.id;
      
      if (sortObj[item.upVotes.length]) {
        sortObj[
          item.upVotes.length * 100
        ] = item.id;
      } else {
        sortObj[
          item.upVotes.length * 100 + voteHelp
        ] = item.id;
        
        voteHelp += 1
      } 
    });

    createAndSort(data, sortDateInfo);

    $('.date').click(function() {
      createAndSort(data, sortDateInfo);
    });

    $('.vote').click(function() {
      createAndSort(data, sortVoteInfo);
    });
  });
});
