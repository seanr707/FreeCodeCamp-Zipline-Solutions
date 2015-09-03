$(document).ready(function start() {
  $.getJSON('http://www.freecodecamp.com/stories/hot', function(data) {
    data = [data[0], data[1], data[2], data[3]];
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
      var head = [
        '<div class="image">', img, '</div>',
        '<div class="head-list"><div id="head">', item.headline, ,'</div></div>',
      ];
      var desc = ['<p id="desc">', 
                  item.metaDescription.length > maxChar ?
                  item.metaDescription.substr(0, maxChar) + '...' : item.metaDescription,
                  '</p>',];
      var foot = [
        '<li id="votes">', 'Votes: ', item.upVotes.length, '</li>',
        '<li id="comments">', 'Comments: ', item.comments !== undefined ? item.comments.length : '', '</li>',
        '<li id="author pull-right">', item.author.username, '</li>',
      ];
      
      /*
      if (divCounter >= 2) {
        rowCounter += 1;
        divCounter = 0;
        $('<div/>', {
          id: 'num-' + rowCounter,
          class: 'row',
        }).appendTo('#app');
      }
      */
      
      $('<a/>', {
        href: item.link,
        html: $('<div/>', {
          id: 'section',
          class: width + ' shadow section-' + item.id,
          html: $('<div/>', {
            id: 'subsection',
            class: item.id,
            // html: props.join(''),
          }),
        }),
      }).appendTo('#app');
      
      $('<div/>', {
        class: 'container header-' + item.id,
        id: 'header',
        html: head.join(''),
      }).appendTo('.' + item.id);
      
      $('<ul/>', {
        class: 'list-inline',
        id: 'footer',
        html: foot.join(''),
      }).appendTo('.' + item.id);
      
      $('<li/>', {
        class: 'desc',
        html: desc.join(''),
      }).appendTo('.header-' + item.id);
      
      $('.section-' + item.id).hover(
        function() {
          $(this).addClass('hover');
          $(this).removeClass('shadow')
      }, function() {
          $(this).removeClass('hover');
          $(this).addClass('shadow');
      });
    });
  });
});
