const internals = {
  loginPrefix: (user) => {
    if (user && principal.account !== user) {
      return `:login/users/${user}`;
    }

    return (principal.user) ? `:login/users/${principal.user}` : ':login';
  }
};


module.exports = {
  account: require('./account'),
  keys: require('./keys'),
  users: require('./users'),
  roles: require('./roles'),
  policies: require('./policies'),
  config: require('./config'),
  datacenters: require('./datacenters'),
  services: require('./services'),
  images: require('./images'),
  packages: require('./packages'),
  machines: require('./machines'),
  firewall: require('./firewall-rules'),
  vlans: require('./vlans'),
  networks: require('./networks'),
  nics: require('./nics')
};
