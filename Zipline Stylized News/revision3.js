// By seanr707

$(document).ready(function start() {
  $.getJSON('http://www.freecodecamp.com/stories/hot', function(data) {
    data.forEach(function(item) {

      if (item.image == '') {
        width = 'col-md-1 col-xs-1 section-small';
        img = '';
      } else {
        width = 'col-md-2 col-xs-2 section-large';
        img = '<img src="' + item.image + '">';
      }

      var maxChar = 30;
      var width;
      var img; 

      // Items for upper portion of card
      var head = [
        '<div class="image">', img, '</div>',
        '<div class="head-list">', item.headline, ,'</div>',
      ];

      // Description to be displayed upon hover
      var desc = [
        '<p id="desc">', 
        item.metaDescription.length > maxChar ?
            item.metaDescription.substr(0, maxChar) + '...' : item.metaDescription,
        '</p>',
      ];

      // FCC Info at bottom, also a link to FCC discussion
      var foot = [
        '<div id="votes">', 'Votes: ', item.upVotes.length, '</div>',
        '<div id="author">', item.author.username, '</div>',
      ];

      // Creates card and links to orign site
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
          // class: 'list-inline',
          id: 'footer',
          html: foot.join(''),
        })
      }).appendTo('.' + item.id);

      /* To be added as a click
      $('<div/>', {
        class: 'desc',
        html: desc.join(''),
      }).appendTo('.header-' + item.id);
      */

      $('.section-' + item.id).hover(
        function() {
          $(this).addClass('hover');
          $(this).removeClass('nonhover');
          $(this).css('height', '256px');
        }, function() {
          $(this).removeClass('hover');
          $(this).addClass('nonhover');
          $(this).css('height', '256px');
        }
      );
    });
  });
});
