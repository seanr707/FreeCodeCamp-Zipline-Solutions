$(document).ready(function start() {
  var users = {};
  var status = 'all';
  var baseURL = 'https://jsonp.afeld.me/?url=https://api.twitch.tv/kraken/';
  // List from FreeCodeCamp
  var userList = [
    'freecodecamp',
    'storbeck',
    'terakilobyte',
    'habathcx',
    'RobotCaleb',
    'thomasballinger',
    'noobs2ninjas',
    'beohoff',
    'medrybw',
  ];
  // Creates user objects: gets display name and logo
  function getUsers(user) {
    // makes users.name = an object to be filled next
    users[user] = {};
    $.getJSON(baseURL + 'users/' + user, function (data) {
      users[user] = data;

      // For users w/o avatars
      if (users[user].logo === null) {
        users[user].logo = 'http://cdn3.rd.io/user/no-user-image-square.jpg';
      }

      // sets up text for an inline list of avatar, uname, and status
      var userInfo = [
        '<li>',
        '<img src="' + users[user].logo + '">',
        '</li>',
        '<li id="display-' + user + '" class="test">',
        '<p id="p-' + user + '" class="display-name">' + users[user]['display_name'] + '</p>',
        '</li>',
      ];

      $('<li/>', {
        id: user,
      html: $('<ul/>', {
        class: 'list-inline',
        id: 'inner-' + user,
        html: userInfo.join(''),
      })}).appendTo('#users');
    });
  }

  // Checks whether users are streaming or not
  function getStreams(user) {
    $.getJSON(baseURL + 'streams/' + user, function (data) {
      var isOnline = 'user-offline';
      var playing = 'Offline';
      var statusIcon = '';
      users[user].stream = data.stream;

      // Adjusts text and icon if the user is online
      if (users[user].stream !== null) {
        statusIcon = 'glyphicon glyphicon-ok-sign status-icon';
        isOnline = 'user-online';
        playing = 'Playing: ' + users[user].stream.game;
      } else {
        statusIcon = 'glyphicon glyphicon-remove-sign status-icon';
      }

      // Adds class to be used for filtering
      $('#' + user).addClass(isOnline);

      // Adds info about game user is playing
      $('<p/>', {
        class: 'playing',
        text: playing,
      }).appendTo('#display-' + user);

      // Adds small status icon
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

  // Filters user list based on selected button
  function filterUser(id) {
    switch(id) {
      case('all'):
        status = id;
        $('.user-online').show();
        $('.user-offline').show();
        break;
      case('online'):
        status = id;
        $('.user-online').show();
        $('.user-offline').hide();
        break;
      case('offline'):
        status = id;
        $('.user-online').hide();
        $('.user-offline').show();
        break;
    }
  };

  // Function for clicking through categories
  $('.status').click(function filterUser() {
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

    switch(id) {
      case('all'):
        status = id;
        $('.user-online').show();
        $('.user-offline').show();
        break;
      case('online'):
        status = id;
        $('.user-online').show();
        $('.user-offline').hide();
        break;
      case('offline'):
        status = id;
        $('.user-online').hide();
        $('.user-offline').show();
        break;
    }
  });

  // Searches users that match search input
  $('.btn-search').click(function() {
    var re = new RegExp($('input').val(), 'gi');
    console.log(re);
    userList.forEach(function(user) {
      console.log(user);
      if (user.match(re) === null) {
        $('#' + user).hide();
        filterUser(status);
      } else {
        $('#' + user).show();
        filterUser(status);
      }
    })
  })
});
