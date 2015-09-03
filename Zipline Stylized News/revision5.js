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
    var titleMaxChar = 50;
    var descMaxChar = 30;
    var authMaxChar = 12;
    var width;
    var img;
    // Shorten these texts if too long
    // Slower here but improves readability
    item.headline = item.headline.length > titleMaxChar ?
        item.headline.substr(0, titleMaxChar) + '...' : item.headline;
    item.description = item.metaDescription.length > descMaxChar ?
        item.metaDescription.substr(0, descMaxChar) + '...' : item.metaDescription;
    item.author.username = item.author.username.length > authMaxChar ?
        item.author.username.substr(0, authMaxChar) : item.author.username;
    
    
    // Makes image tags blank and changes card width
    if (item.image) {
      width = 'col-md-2 col-xs-2 section-large';
      img = '<img src="' + item.image + '">';
    } else {
      width = 'col-md-1 col-xs-1 section-small';
      img = '';
    }
    
    var head = [
      '<div class="image">', img, '</div>',
      '<div class="head-list">', item.headline,
      '<div class="space"></div>',
      '<div class="desc">', item.description, '</div>',
      '</div>',
    ];

    var foot = [
      '<div id="votes">', 'Votes: ', item.upVotes.length, '</div>',
      '<div id="author">', item.author.username, '</div>',
    ];
    
    $('<a/>', {
      href: item.link,
      html: $('<div/>', {
        id: 'section', 
        class: width + ' nonhover section-' + item.id,
        html: $('<div/>', {
          id: 'subsection',
          class: item.id,
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

    // Makes hovered item opaque and darker shadow
    $('.section-' + item.id).hover(
      function() {
        $(this).addClass('hover');
        $(this).removeClass('nonhover');
      }, function() {
        $(this).removeClass('hover');
        $(this).addClass('nonhover');
      }
    );
  });
}

$(document).ready(function start() {  
  
  $.getJSON('http://www.freecodecamp.com/stories/hot', function(data) {
    var sortDateInfo = {};
    var sortVoteInfo = {};
    var voteHelp = 1;
    
    // creates two objects that have keys as timestamps or votes
    // values are corresponding IDs for createAndSort to pull from
    data.forEach(function(item) {
      sortDateInfo[item.timePosted] = item.id;
      
      if (sortVoteInfo[item.upVotes.length]) {
        sortVoteInfo[item.upVotes.length * 100] = item.id;
      } else {
        sortVoteInfo[item.upVotes.length * 100 + voteHelp] = item.id;
        // Adds one hundreth of a point to votes for duplicates to prevent
        // Entries overriding other entries with same number of votes
        voteHelp += 1
      } 
    });

    // defaults to sorting by date
    createAndSort(data, sortDateInfo);

    $('.date').click(function() {
      $('#app').fadeOut('slow');
      $('#app').children().remove();
      createAndSort(data, sortDateInfo);
      $('#app').fadeIn('slow');
    });

    $('.votes').click(function() {
      $('#app').fadeOut('slow');
      $('#app').children().remove();
      createAndSort(data, sortVoteInfo);
      $('#app').fadeIn('slow');
    });
  });
});
