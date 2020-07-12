import { Recipes } from '@entities/Recipes.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import faker from 'faker';
import { Connection } from 'typeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const deleteRecipe: string = `
query(
  $id: Float!
) {
  admin {
    Recipes {
      crud {
        deleteRecipes(id:$id){
          error
          message
          data{
            id
            name
            recipeIdentifier
            price
            description
            recipeCategory
          }
        }
      }
    }
  }
}
`;

const updateRecipe: string = `
query($id:Float!, $name: String!, $price: Float!, $desc:String!, $category:String!) {
  admin {
    Recipes {
      crud {
        updateRecipes(
          id: $id
          data: {
            name: $name
            price: $price
            description: $desc
            recipeCategory: $category
          }
        ) {
          error
          message
          data {
            id
            name
            recipeIdentifier
            price
            description
            recipeCategory
          }
        }
      }
    }
  }
}
`;

const findById: string = `
query(
  $id: Float!
) {
  admin {
    Recipes {
      crud {
        findRecipesById(id:$id){
          error
          message
          data{
            id
            name
            recipeIdentifier
            price
            description
            recipeCategory
          }
        }
      }
    }
  }
}
`;

const findAll: string = `
query {
  admin {
    Recipes {
      crud {
        getAllRecipes{
          error
          message
          data{
            id
            name
            recipeIdentifier
            price
            description
            recipeCategory
          }
        }
      }
    }
  }
}
`;

const updateRelations: string = `
query($id:Float!, $restaurantId:Float!) {
  admin {
    Recipes {
      crud {
        updateRecipesRelations(data:{restaurantId:$restaurantId},id:$id) {
          error
          message
          data {
            id
            name
            recipeIdentifier
            price
            description
            recipeCategory
            restaurantMenu{
              name
            }
          }
        }
      }
    }
  }
}
`;

const createRecipe: string = `
query(
  $name: String!
  $price: Float!
  $description: String!
  $category: String!
) {
  admin {
    Recipes {
      crud {
        createRecipes(
          data: {
            name: $name
            price: $price
            description: $description
            recipeCategory: $category
          }
        ){
          error
          message
          data{
            id
            name
            recipeIdentifier
            price
            description
            recipeCategory
          }
        }
      }
    }
  }
}
`;

const fakeUser = {
  phone: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  confirmed: true,
  confirmationCode: 123123,
};
describe('Admin recipes CRUD test', () => {
  it('should Create Recipe', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: createRecipe,
      accessToken,
      variableValues: {
        name: 'testRecipe',
        price: 123123,
        description: 'This is a test description',
        category: 'dessert',
      },
    });
    expect(response.data?.admin.Recipes.crud.createRecipes.error).toBe(false);
    expect(response.data?.admin.Recipes.crud.createRecipes.data.description).toBe('This is a test description');
    expect(response.data?.admin.Recipes.crud.createRecipes.data.name).toBe('testRecipe');
    expect(response.data?.admin.Recipes.crud.createRecipes.data.price).toBe(123123);
    expect(response.data?.admin.Recipes.crud.createRecipes.data.recipeIdentifier).toBeDefined();
  });

  it('should Not Access granted Create Recipe', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: createRecipe,
      accessToken,
      variableValues: {
        name: 'testRecipe',
        description: 'This is a test description',
      },
    });
    expect(response.errors).toBeDefined();
  });

  it('should Not access denied Create Recipe', async () => {
    const response = await gCall({
      source: createRecipe,
      variableValues: {
        name: 'testRecipe',
        price: 123123,
        description: 'This is a test description',
        category: 'dessert',
      },
    });
    expect(response.errors).toBeDefined();
  });

  it('Delete Recipes by Id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const recipe = await Recipes.create({
      name: 'deletabletest',
      recipeCategory: 'lunch',
      price: 12304002,
      description: 'its a deletable test',
    }).save();

    const response = await gCall({
      source: deleteRecipe,
      accessToken,
      variableValues: {
        id: recipe.id,
      },
    });
    const recipe1 = await Recipes.findOne(recipe.id);
    expect(recipe1).toBeUndefined();
    expect(response.data?.admin.Recipes.crud.deleteRecipes.error).toBeFalsy();
  });

  it('Should not Delete access granted Recipes by Id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: deleteRecipe,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.data?.admin.Recipes.crud.deleteRecipes.error).toBeTruthy();
    expect(response.data?.admin.Recipes.crud.deleteRecipes.message).toBeDefined();
  });

  it('should Not Delete access denied Recipe', async () => {
    const recipe = await Recipes.create({
      name: 'deletabletest2',
      recipeCategory: 'lunch',
      price: 12304002,
      description: 'its a deletable test',
    }).save();

    const response = await gCall({
      source: deleteRecipe,
      variableValues: {
        id: recipe.id,
      },
    });
    expect(response.errors).toBeDefined();
  });

  it('Should find Recipes by Id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const recipe = await Recipes.create({
      name: 'find',
      recipeCategory: 'lunch',
      price: 12304002,
      description: 'its a findable test',
    }).save();
    const response = await gCall({
      source: findById,
      accessToken,
      variableValues: {
        id: recipe.id,
      },
    });
    expect(response.data?.admin.Recipes.crud.findRecipesById.error).toBeFalsy();
    expect(response.data?.admin.Recipes.crud.findRecipesById.data).toBeDefined();
    expect(parseInt(response.data?.admin.Recipes.crud.findRecipesById.data.id)).toBe(recipe.id);
    expect(response.data?.admin.Recipes.crud.findRecipesById.data.recipeIdentifier).toBe(recipe.recipeIdentifier);
  });

  it('Should not Find Recipes access granted by Id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: findById,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.data?.admin.Recipes.crud.findRecipesById.error).toBeTruthy();
    expect(response.data?.admin.Recipes.crud.findRecipesById.message).toBeDefined();
  });

  it('should find recipes', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: findAll,
      accessToken,
    });
    expect(response.data?.admin.Recipes.crud.getAllRecipes.error).toBeFalsy();
    expect(response.data?.admin.Recipes.crud.getAllRecipes.data).toBeDefined();
  });

  it('should update Recipe', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const recipe = await Recipes.create({
      name: 'deletabletest',
      recipeCategory: 'lunch',
      price: 12304002,
      description: 'its a deletable test',
    }).save();

    if (!recipe) throw new Error('no recipe found');
    const response = await gCall({
      source: updateRecipe,
      accessToken,
      variableValues: {
        id: recipe.id,
        name: 'Lechona',
        price: 9000,
        desc: 'Es lechona',
        category: 'Almuerzo',
      },
    });
    const updatedRecipe = await Recipes.findOne({ id: recipe.id });
    if (!updatedRecipe) throw new Error('no recipe found');
    expect(response.data?.admin.Recipes.crud.updateRecipes.error).toBeFalsy();
    expect(response.data?.admin.Recipes.crud.updateRecipes.data).toBeDefined();
    expect(parseInt(response.data?.admin.Recipes.crud.updateRecipes.data.id)).toBe(updatedRecipe.id);
    expect(response.data?.admin.Recipes.crud.updateRecipes.data.recipeIdentifier).toBe(updatedRecipe.recipeIdentifier);
    expect(response.data?.admin.Recipes.crud.updateRecipes.data.name).toBe(updatedRecipe.name);
    expect(response.data?.admin.Recipes.crud.updateRecipes.data.price).toBe(updatedRecipe.price);
    expect(response.data?.admin.Recipes.crud.updateRecipes.data.description).toBe(updatedRecipe.description);
    expect(response.data?.admin.Recipes.crud.updateRecipes.data.recipeCategory).toBe(updatedRecipe.recipeCategory);
  });
  it('should Not update Recipe', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: updateRecipe,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        name: 'Lechona',
        price: 9000,
        desc: 'Es lechona',
        category: 'Almuerzo',
      },
    });

    expect(response.data?.admin.Recipes.crud.updateRecipes.error).toBeTruthy();
    expect(response.data?.admin.Recipes.crud.updateRecipes.data).toBeNull();
    expect(response.data?.admin.Recipes.crud.updateRecipes.message).toBeDefined();
  });

  it('should update recipe relations', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const recipe = await Recipes.create({
      name: 'deletabletest',
      recipeCategory: 'lunch',
      price: 12304002,
      description: 'its a deletable test',
    }).save();
    const restaurant = await Restaurant.create({
      maxCapacity: 10,
      phoneNumber: '978034590783',
      name: 'restaurantTest',
      address: 'cra5 jsdfjlksdf',
    }).save();
    if (!recipe || !restaurant) throw new Error('Error creating entities');

    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: recipe.id,
        restaurantId: restaurant.id,
      },
    });
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.error).toBeFalsy();
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.data).toBeDefined();
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.data.restaurantMenu.name).toBe(restaurant.name);
  });

  it('should Not update recipe relations wrong restaurant', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const recipe = await Recipes.create({
      name: 'deletabletest',
      recipeCategory: 'lunch',
      price: 12304002,
      description: 'its a deletable test',
    }).save();
    if (!recipe) throw new Error('Error creating entities');

    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: recipe.id,
        restaurantId: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.error).toBeTruthy();
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.data).toBeNull();
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.message).toBeDefined();
  });

  it('should Not update recipe relations wrong recipe id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const restaurant = await Restaurant.create({
      maxCapacity: 10,
      phoneNumber: '978034590783',
      name: 'restaurantTest',
      address: 'cra5 jsdfjlksdf',
    }).save();
    if (!restaurant) throw new Error('Error creating entities');

    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        restaurantId: restaurant.id,
      },
    });
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.error).toBeTruthy();
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.data).toBeNull();
    expect(response.data?.admin.Recipes.crud.updateRecipesRelations.message).toBeDefined();
  });
});
