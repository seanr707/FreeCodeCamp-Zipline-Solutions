function createAndSort(dataObj, sortObj) {
  // Sorts keys for numeric value not unicode value
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
    var titleMaxChar = 80;
    var descMaxChar = 80;
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
    // HTML for upper bulk of card
    var head = [
      '<div class="image">', img, '</div>',
      '<div class="head-list">', item.headline,'</div>',
    ];
    // HTML for small sliver at bottom
    var foot = [
      '<div id="votes">', 'Votes: ', item.upVotes.length, '</div>',
      '<div id="author">', item.author.username, '</div>',
    ];
    
    // Sets up main card
    $('<a/>', {
      href: item.link,
      // Opens link in new tab
      target: '_blank',
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
      title: item.description,
      id: 'header',
      html: head.join(''),
    }).appendTo('.' + item.id);
    
    // Don't know how to add hyphenated attr's in $(</>...) function
    // Bootstrap tooltip settings
    $('.header-' + item.id).attr('data-toggle', 'tooltip');
    $('.header-' + item.id).attr('data-placement', 'bottom');
    
    // Makes footer a link back to FCC News
    $('<a/>', {
      target: '_blank',
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
  // Calls Bootstrap JS for tooltips
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
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
      $('#app').fadeIn('slow');
      createAndSort(data, sortDateInfo);
    });

    $('.votes').click(function() {
      $('#app').fadeOut('slow');
      $('#app').children().remove();
      $('#app').fadeIn('slow');
      createAndSort(data, sortVoteInfo);
    });
  });
});
