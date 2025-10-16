const users = [
  {
      id: 1,
      mail: 'test@test.com',
      pwd: 'passwod'
  },

  {
      id: 2,
      mail: 'yasmina@bravo.com',
      pwd: 'the1Best!'
  },
];

export const userRepository = {
  getUserByCredentials: async (mail, pwd) => {
      const user = users.find(user => user.mail === mail && user.pwd === pwd);
      return user;
  },
  
  getUserById: async (id) => {
      const user = users.find(user => user.id === id);
      return user;
  },

  createUser: async (mail, pwd) => {
      const id = users.length + 1;
      const newUser = { id, mail, pwd };
      users.push(newUser);
      return newUser;
  },
}