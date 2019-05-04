const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '123',
      name:'Vri',
      room:'Node'
    },
    {
      id: '123456',
      name:'Vrishab',
      room:'MongoDb'
    },
    {
      id: '123321',
      name:'eminem',
      room:'Node'
    }
  ];
});

  it('should add new User', () => {
    var users = new Users();
    var user = {
      id:123,
      name:'Vrishab',
      room:'The Avengers'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return node names', () => {
    var userList = users.getUserList('Node');
    expect(userList).toEqual(['Vri', 'eminem']);
  });

  it('should remove a user', () => {
    var userId ='123';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);

  });

  it('should not remove a user', () => {
    var userId ='99';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    var userId = '123';
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    var userId = '420';
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return MongoDb names', () => {
    var userList = users.getUserList('MongoDb');
    expect(userList).toEqual(['Vrishab']);
  });
});
