<h1> MoonShotBackend </h1>
Moonshot restaurant Backend end made with Apollo server, Next js, typescript and typeorm for the purpose of doing a prototype.

<h2>Entities</h2>
<h3> &nbsp; BusinessTypes</h3>
<p>The BusinessTypes entity is the one that contains all the necessary information about any user in the application.</p>
<h3>&nbsp; &nbsp; &nbsp; Fields</h3>
<ul>
    <li>id</li>
    <li style="color: red">userID *</li>
    <li style="color: red">phone *</li>
    <li style="color: red">username *</li>
    <li style="color: red">password *</li>
    <li style="color: red">email *</li>
    <li style="color: red">firstName *</li>
    <li>secondName</li>
    <li style="color: red">firstLastname *</li>
    <li>secondLastname</li>
    <li>confirmationCode</li>
    <li>confirmed</li>
    <li>tokenVersion</li>
    <li>updatedAt</li>
    <li>createAt</li>
</ul>
* Marked fields are necessary at any query to create a user
<h3>&nbsp; &nbsp; &nbsp; Relations</h3>
<ul>
    <li>role: A many to one relation, it gives the role to the corresponding user, 3 kinds: admin, business, user</li>
    <li>restaurants: A one to many relation, if the role is business, the restaurants will contain all the restaurants that the user is owner off.</li>
    <li>reservations: A one to many relation, the user can contain multiple reservations.</li>
</ul>

<h3> &nbsp; UserRole</h3>
<p>The user role entity consist only in 4 fields, the important one is name. it gives the user entity the rights to do certain querys.</p>
<h3>&nbsp; &nbsp; &nbsp; Fields</h3>
<ul>
    <li>id</li>
    <li style="color: red">name *</li>
    <li>updatedAt</li>
    <li>createAt</li>
</ul>
* Marked fields are necessary at any query to create a user
<h3>&nbsp; &nbsp; &nbsp; Relations</h3>
<ul>
    <li>users: A one to many relation with the user entity</li>
</ul>

<h3> &nbsp; Restaurant</h3>
<p>The restaurant entity contains all the necessary information to manage the restaurant.</p>
<h3>&nbsp; &nbsp; &nbsp; Fields</h3>
<ul>
    <li>id</li>
    <li style="color: red">name *</li>
    <li style="color: red">address *</li>
    <li style="color: red">phoneNumber *</li>
    <li>updatedAt</li>
    <li>createAt</li>
</ul>
* Marked fields are necessary at any query to create a user
<h3>&nbsp; &nbsp; &nbsp; Relations</h3>
<ul>
    <li>owner: A Many to One relation, this entity is connected with a user, the user may have business role and have to own that restaurant</li>
    <li>recipes: A Many to One relation (it can change to a many to many relation), here each of the restaurant will save its menu</li>
    <li>reservations: A Many to One relation (it can change to a many to many relation), here each of the restaurant will save its menu</li>
</ul>

<h3> &nbsp; Recipes</h3>
<p>The recipes entity contains all the necessary information to make a restaurant menu.</p>
<h3>&nbsp; &nbsp; &nbsp; Fields</h3>
<ul>
    <li>id</li>
    <li style="color: red">name *</li>
    <li style="color: red">price *</li>
    <li style="color: red">description *</li>
    <li style="color: red">recipeCategory *</li>
    <li>updatedAt</li>
    <li>createAt</li>
</ul>
* Marked fields are necessary at any query to create a user
<h3>&nbsp; &nbsp; &nbsp; Relations</h3>
<ul>
    <li>restaurantMenu: A Many to one relation with the restaurant entity</li>
</ul>

<h3> &nbsp; Reservations</h3>
<p>The reservation entity contains all the necessary information to make a reservation system.</p>
<h3>&nbsp; &nbsp; &nbsp; Fields</h3>
<ul>
    <li>id</li>
    <li style="color: red">peopleQuantities *</li>
    <li>updatedAt</li>
    <li>createAt</li>
</ul>
* Marked fields are necessary at any query to create a user
<h3>&nbsp; &nbsp; &nbsp; Relations</h3>
<ul>
    <li>restaurant: one to many relation, 1 reservation only has 1 restaurant and the restaurant can have many reservations</li>
    <li>owner: one to many relation, 1 reservation only has 1 user and the user can have many reservations</li>
</ul>
