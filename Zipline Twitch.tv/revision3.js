// Linted with airbnb

$(document).ready(function start() {
  // 'use strict';
  var users = {};
  var lastUser = '#users';
  var baseURL = 'https://jsonp.afeld.me/?url=https://api.twitch.tv/kraken/';
  // List from FreeCodeCamp
  var userList = [
    'freecodecamp',
    'storbeck',
    'terakilobyte',
    'habathcx',
    'RobotCaleb',
    'comster404',
    'brunofin',
    'thomasballinger',
    'noobs2ninjas',
    'beohoff',
    'medrybw',
  ];
  // Creates user objects: gets display name and logo
  function getUsers(user) {
    users[user] = {};
    $.getJSON(baseURL + 'users/' + user, function (data) {
      users[user].logo = data.logo;
      users[user].display_name = data.display_name;
    });
  }

  // Checks whether users are streaming or not
  function getStreams(user) {
    $.getJSON(baseURL + 'streams/' + user, function (data) {
      users[user].stream = data.stream;
    });
  }

  // Goes through and populates the users object
  userList.forEach(function (user) {
    getUsers(user);
    getStreams(user);
  });

  for (var user in users) {
    var statusIcon = '';
    console.log('Users: ', users);
    console.log('User: ', user);
    console.log('Object: ', users[user]);
    if (users[user].stream !== null) {
      statusIcon = '<span class="glyphicon glyphicon-ok-sign"></span>';
    } else {
      statusIcon = '<span class="glyphicon glyphicon-remove-sign"></span>';
    }

    var userInfo = [
      '<img src="' + users[user].logo + '">',
      '<p>' + users[user].display_name + '</p>',
      statusIcon,
    ];
    $('<li/>', {
      id: user,
      html: userInfo.join(''),
    }).appendTo(lastUser);

    lastUser = '#' + user;
  }

  // Function for clicking through categories
  $('.status').click(function () {
    var id = this.id;
    var buttons = {
      'all': $('#all'),
      'online': $('#online'),
      'offline': $('#offline'),
    };
    // Goes through and checks which
    // is current button and changes state
    $.each(buttons, function (k, v) {
      if (id === k) {
        v.attr('class', 'btn btn-info status');
      } else {
        v.attr('class', 'btn btn-default status');
      }
    });
  });
});
