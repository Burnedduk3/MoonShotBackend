import { getDBConfig } from '@config/database';
import { Recipes } from '@entities/Recipes.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { getConnection } from 'typeorm';

export const connectSqlDB = async () => await getDBConfig();

export const boilerplateData = async () => {
  // UserRoles
  let restaurantOwnerRole = await UserRole.findOne({ name: 'business' });
  if (!restaurantOwnerRole) {
    restaurantOwnerRole = await UserRole.create({ name: 'business' }).save();
  }

  let userRole = await UserRole.findOne({ name: 'user' });
  if (!userRole) {
    userRole = await UserRole.create({ name: 'user' }).save();
  }

  let adminRole = await UserRole.findOne({ name: 'admin' });
  if (!adminRole) {
    adminRole = await UserRole.create({ name: 'admin' }).save();
  }

  // recipes
  let recipe1 = await Recipes.findOne({ name: 'Helado' });
  if (!recipe1) {
    recipe1 = await Recipes.create({
      name: 'Helado',
      description: 'Helado de vainilla',
      price: 5000,
      recipeCategory: 'Postre',
    }).save();
  }

  let recipe2 = await Recipes.findOne({ name: 'Carne Asada' });
  if (!recipe2) {
    recipe2 = await Recipes.create({
      name: 'Carne Asada',
      description: 'Carne asada adobada con cerveza',
      price: 15000,
      recipeCategory: 'Plato fuerte',
    }).save();
  }

  let recipe3 = await Recipes.findOne({ name: 'Jugo de naranja' });
  if (!recipe3) {
    recipe3 = await Recipes.create({
      name: 'Jugo de naranja',
      description: 'Jugo de naranja con hielo',
      price: 8000,
      recipeCategory: 'Bebidas',
    }).save();
  }

  let recipe4 = await Recipes.findOne({ name: 'Helado de Chocolate' });
  if (!recipe4) {
    recipe4 = await Recipes.create({
      name: 'Helado de Chocolate',
      description: 'Helado de Chocolate',
      price: 8000,
      recipeCategory: 'Postre',
    }).save();
  }

  let recipe5 = await Recipes.findOne({ name: 'Pollo Asada' });
  if (!recipe5) {
    recipe5 = await Recipes.create({
      name: 'Pollo Asada',
      description: 'Pollo asado adobada con cerveza',
      price: 13000,
      recipeCategory: 'Plato fuerte',
    }).save();
  }

  let recipe6 = await Recipes.findOne({ name: 'Jugo de Mandarina' });
  if (!recipe6) {
    recipe6 = await Recipes.create({
      name: 'Jugo de Mandarina',
      description: 'Jugo de Mandarina con hielo',
      price: 4000,
      recipeCategory: 'Bebidas',
    }).save();
  }
  let recipe7 = await Recipes.findOne({ name: 'Jugo de Toronja' });
  if (!recipe7) {
    recipe7 = await Recipes.create({
      name: 'Jugo de Toronja',
      description: 'Jugo de Toronja con hielo',
      price: 8000,
      recipeCategory: 'Bebidas',
    }).save();
  }
  let recipe8 = await Recipes.findOne({ name: 'Lomo al trapo' });
  if (!recipe8) {
    recipe8 = await Recipes.create({
      name: 'Lomo al trapo',
      description: 'Lomo echo en horno de barro',
      price: 21000,
      recipeCategory: 'Plato fuerte',
    }).save();
  }

  // restaurant

  let restaurantOne = await Restaurant.findOne({ name: 'Andres' });
  if (!restaurantOne) {
    restaurantOne = await Restaurant.create({
      name: 'Andres',
      address: 'cra 4 # 123 - 54',
      phoneNumber: '5434632',
      maxCapacity: 30,
    }).save();
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantOne).add(recipe2);
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantOne).add(recipe5);
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantOne).add(recipe8);
  }
  let restaurantTwo = await Restaurant.findOne({ name: 'Crepes & Waffles' });
  if (!restaurantTwo) {
    restaurantTwo = await Restaurant.create({
      name: 'Crepes & Waffles',
      address: 'cra 4 # 123 - 54',
      phoneNumber: '5434632',
      maxCapacity: 15,
    }).save();
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantTwo).add(recipe1);
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantTwo).add(recipe3);
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantTwo).add(recipe7);
  }
  let restaurantThree = await Restaurant.findOne({ name: 'Kokoriko' });
  if (!restaurantThree) {
    restaurantThree = await Restaurant.create({
      name: 'Kokoriko',
      address: 'cra 4 # 123 - 54',
      phoneNumber: '5434632',
      maxCapacity: 10,
    }).save();
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantThree).add(recipe4);
    await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurantThree).add(recipe6);
  }

  // Users
  let userOne = await User.findOne({ phone: '+573007974390' });
  if (!userOne) {
    userOne = await User.create({
      phone: '+573007974390',
      firstLastname: 'Pereira',
      userID: '29358093458',
      firstName: 'Juan',
      username: 'JuanPer',
      password: 'Restaurant1',
      email: 'juanPerreira@guerrilamail.com',
    }).save();
    await getConnection().createQueryBuilder().relation(User, 'role').of(userOne).set(restaurantOwnerRole);
    await getConnection().createQueryBuilder().relation(User, 'restaurant').of(userOne).set(restaurantOne);
  }

  let userTwo = await User.findOne({ phone: '+573152993743' });
  if (!userTwo) {
    userTwo = await User.create({
      phone: '+573152993743',
      firstLastname: 'Ramirez',
      userID: '123089530323',
      firstName: 'Sebastian',
      username: 'SebastianRam',
      password: 'normalUser',
      email: 'SebastianRam@guerrilamail.com',
    }).save();
    await getConnection().createQueryBuilder().relation(User, 'role').of(userTwo).set(userRole);
  }

  let userThree = await User.findOne({ phone: '+57317404216' });
  if (!userThree) {
    userThree = await User.create({
      phone: '+57317404216',
      firstLastname: 'Santiago',
      userID: '598456544',
      firstName: 'Petrovich',
      username: 'SantiagoPetro',
      password: 'normalUser',
      email: 'SantiagoPetro@guerrilamail.com',
    }).save();
    await getConnection().createQueryBuilder().relation(User, 'role').of(userThree).set(restaurantOwnerRole);
    await getConnection().createQueryBuilder().relation(User, 'restaurant').of(userThree).set(restaurantTwo);
  }

  const userFive = await User.findOne({ phone: '+57317404216' });
  if (!userThree) {
    userThree = await User.create({
      phone: '+57317204216',
      firstLastname: 'Santiago',
      userID: '523445',
      firstName: 'Petrovich',
      username: 'User',
      password: 'User',
      email: 'User@guerrilamail.com',
    }).save();
    await getConnection().createQueryBuilder().relation(User, 'role').of(userFive).set(restaurantOwnerRole);
    await getConnection().createQueryBuilder().relation(User, 'restaurant').of(userFive).set(restaurantThree);
  }

  let userFour = await User.findOne({ phone: '+573167404216' });
  if (!userFour) {
    userFour = await User.create({
      phone: '+573167404216',
      firstLastname: 'Cabrera',
      secondLastname: 'Duran',
      userID: '1072585245',
      firstName: 'Juan',
      secondName: 'David',
      username: 'JuanCabDu',
      password: 'AdminPassword',
      email: 'juandavid.juandis@gmail.com',
    }).save();
    await getConnection().createQueryBuilder().relation(User, 'role').of(userFour).set(adminRole);
  }
};
