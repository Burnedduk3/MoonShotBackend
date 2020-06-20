import { getDBConfig } from '@config/database';
// import { LawyerCategory } from '@entities/LawyerCategory.entity';
import { User } from '@entities/User.entity';
// import { UserRole } from '@entities/UserRole.entity';
// import { getConnection } from 'typeorm';

export const connectSqlDB = async () => await getDBConfig();

export const boilerplateData = async () => {
  // // UserRoles
  // let lawyerRole = await UserRole.findOne({ name: 'lawyer' });
  // if (!lawyerRole) {
  //   lawyerRole = await UserRole.create({ name: 'lawyer' }).save();
  // }
  //
  // let userRole = await UserRole.findOne({ name: 'user' });
  // if (!userRole) {
  //   userRole = await UserRole.create({ name: 'user' }).save();
  // }
  //
  // // LawyerCategories
  //
  // let categoryOne = await LawyerCategory.findOne({
  //   name: 'Derecho constitucional',
  // });
  // if (!categoryOne) {
  //   categoryOne = await LawyerCategory.create({
  //     name: 'Derecho constitucional',
  //     description: 'Derecho constitucional',
  //   }).save();
  // }
  //
  // let categoryTwo = await LawyerCategory.findOne({
  //   name: 'Derecho Ambiental',
  // });
  // if (!categoryTwo) {
  //   categoryTwo = await LawyerCategory.create({
  //     name: 'Derecho Ambiental',
  //     description: 'Derecho Ambiental',
  //   }).save();
  // }
  //
  // Users
  let userOne = await User.findOne({ phone: '123123' });
  if (!userOne) {
    userOne = await User.create({
      phone: '123123',
      firstLastname: 'Pereira',
      firstName: 'Juan',
    }).save();
    // await getConnection().createQueryBuilder().relation(User, 'role').of(userOne).set(lawyerRole);

    // await getConnection().createQueryBuilder().relation(User, 'categories').of(userOne).add(categoryOne);
    // await getConnection().createQueryBuilder().relation(User, 'categories').of(userOne).add(categoryTwo);
  }

  let userTwo = await User.findOne({ phone: '123456' });
  if (!userTwo) {
    userTwo = await User.create({
      phone: '123456',
      firstLastname: 'Sebastiano',
      firstName: 'Sebastian',
    }).save();
    // await getConnection().createQueryBuilder().relation(User, 'role').of(userTwo).set(userRole);
  }

  let userThree = await User.findOne({ phone: '456789' });
  if (!userThree) {
    userThree = await User.create({
      phone: '456789',
      firstLastname: 'Santiago',
      firstName: 'Petrovich',
    }).save();
    // await getConnection().createQueryBuilder().relation(User, 'role').of(userThree).set(lawyerRole);
    // await getConnection().createQueryBuilder().relation(User, 'categories').of(userThree).add(categoryTwo);
  }
};
