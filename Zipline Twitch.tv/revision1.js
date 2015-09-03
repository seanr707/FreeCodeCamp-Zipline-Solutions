$(document).ready(function() {
  var users = {},
      baseURL = 'https://jsonp.afeld.me/?url=https://api.twitch.tv/kraken/',
      // List from FreeCodeCamp
      userList = [
        "freecodecamp",
        "storbeck",
        "terakilobyte",
        "habathcx",
        "RobotCaleb",
        "comster404",
        "brunofin",
        "thomasballinger",
        "noobs2ninjas",
        "beohoff",
        "medrybw"
      ];
  // Creates user objects: gets display name and logo
  function getUsers (user) {
    users[user] = {}
    $.getJSON(baseURL+'users/'+user, function(data) {
      users[user] = data;
    });
  };

  // Checks whether users are streaming or not
  function getStreams (user) {
    $.getJSON(baseURL+'streams/'+user, function(data) {
      users[user].stream = data.stream;
    });
  };

  // Goes through and populates the users object
  userList.forEach(function(user) {
    getUsers(user)
    getStreams(user);


  });

  console.log(users);

  // Function for clicking through categories
  $('.status').click(function() {
    var id = this.id,
        buttons = {
          'all': $('#all'),
          'online': $('#online'),
          'offline': $('#offline')
        };
    // Goes through and checks which
    // is current button and changes state
    $.each(buttons, function (k, v) {
      if (id === k) {
        v.attr('class', 'btn btn-info status');
      } else {
        v.attr('class', 'btn btn-default status');
      }
    })
  })
});
