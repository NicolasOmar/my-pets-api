export default {
  testEnv: {
    user: {
      name: 'new name',
      lastName: 'new lastName',
      userName: 'userName',
      email: 'newUser@test.com',
      password: 'newUserEmailPass'
    },
    pet: {
      name: 'test',
      birthday: null,
      isAdopted: true,
      adoptionDate: null,
      weight: 10,
      gender: true,
      hasHeterochromia: false,
      passedAway: false
    },
    petType: ['Cat', 'Dog'],
    color: ['White', 'Black', 'Brown', 'Beige', 'Grey'],
    event: {
      description: 'Created event for test pet'
    }
  },
  prodEnv: {
    user: {},
    pet: {},
    petType: ['Cat', 'Dog'],
    color: ['White', 'Black', 'Brown', 'Beige', 'Grey'],
    event: {}
  }
}
