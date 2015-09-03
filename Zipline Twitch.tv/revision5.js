// Linted with airbnb

$(document).ready(function start() {
  // 'use strict';;
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
    // 'comster404',
    // 'brunofin',
    'thomasballinger',
    'noobs2ninjas',
    'beohoff',
    'medrybw',
  ];
  // Creates user objects: gets display name and logo
  function getUsers(user) {
    users[user] = {};
    $.getJSON(baseURL + 'users/' + user, function (data) {
      users[user] = data;

      if (users[user].logo === null) {
        users[user].logo = 'http://cdn3.rd.io/user/no-user-image-square.jpg';
      }

      var userInfo = [
        '<li class="text-left">',
        '<img src="' + users[user].logo + '">',
        '</li>',
        '<li id="display-' + user + '">',
        '<p id="username">' + users[user]['display_name'] + '</p>',
        '</li>',
      ];

      $('<li/>', {
        id: user,
      html: $('<ul/>', {
        class: 'list-inline',
        id: 'inner-' + user,
        html: userInfo.join(''),
      })}).appendTo('#users');

      lastUser = '#' + user;
    });
  }

  // Checks whether users are streaming or not
  function getStreams(user) {
    $.getJSON(baseURL + 'streams/' + user, function (data) {
      users[user].stream = data.stream;

      var statusIcon = '';
      console.log('Users: ', users);
      console.log('User: ', user);
      console.log('Object: ', users[user]);
      if (users[user].stream !== null) {
        statusIcon = 'glyphicon glyphicon-ok-sign';
      } else {
        statusIcon = 'glyphicon glyphicon-remove-sign';
      }

      $('<li/>', {
        class: 'pull-right',
        html: $('<span/>', {
          class: statusIcon,
      })}).appendTo('#inner-' + user);

    });
  }

  // Goes through and populates the users object
  userList.forEach(function (user) {
    getUsers(user);
    getStreams(user);
  });

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
