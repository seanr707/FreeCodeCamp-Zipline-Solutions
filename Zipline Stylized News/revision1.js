$(document).ready(function start() {
  var articles = [];
  $.getJSON('http://www.freecodecamp.com/stories/hotStories', function(data) {
    var divCounter = 5;
    var rowCounter = 0;
    var lastDiv;
    data = [data[0], data[1], data[2], data[3]];
    data.forEach(function(item) {
      var img = item.image == '' ?
          '' : '<img src="' + item.image + '">';
      var props = [
        '<h1>', item.headline, ,'</h1>',
        img,
        '<p id="desc">', item.metaDescription, '</p>',
        '<p id="votes">', item.upVotes.length, '</p>',
        '<p id="comments">', item.comments.length, '</p>',
        '<p id="author">', item.author.username, '</p>',
      ];

      if (divCounter >= 5) {
        rowCounter += 1;
        divCounter = 0;
        $('<div/>', {
          id: 'num-' + rowCounter,
          class: 'row',
        }).appendTo('#app');
      }

      $('<a/>', {
        href: item.link,
        html: $('<div/>', {
          id: 'section',
          class: 'col-md-2',
          html: $('<div/>', {
            id: 'subsection',
            html: props.join(''),
          }),
        })
      }).appendTo('#num-' + rowCounter)

      divCounter += 1
    });
  });
});
