---
layout: blog-post
title: Getting Started with Backbone.js
category: blog
tags: [JavaScript, backbone.js]
description: Getting cozy with Backbone.js Models, Collections, Views, and Routes.
---
In this tutorial I will go over [Backbone.js](http://backbonejs.org/) main components:  Models, Collections, Views, and Routes. We will not be building an application but instead we will be going over a number of simple examples of each Backbone compoment, that hopefully after we are done you will have a firm understanding of Backbone.js and be able to put it all together.

## Models

Models are a key component of Backbone applications. With model objects you can easily keep track of your data and update as needed. A strength of Backbone models is that you can synchronize your model data to the server which we will go over later.

### Model basics

### Creating models

Creating a Backbone model:

```javascript
var TodoItem = Backbone.Model.extend({});
```

Creating a Backbone model with default attributes (properties):

```javascript
var TodoItem = Backbone.Model.extend({
  defaults: {
    description: 'Empty todo...',
    done: false
  }
});
```

Creating an instance of a Backbone model:

```javascript
var todoItem = new TodoItem({});
```

Creating an instance of a Backbone model with attributes:

```javascript
var todoItem = new TodoItem({
  description: 'Pick up milk'
});
```

Doing something when a model instance gets created:

```javascript
var TodoItem = Backbone.Model.extend({
  initialize: function() {
    console.log('Welcome, new model.');
  }
});

var todoItem = new TodoItem();
```

### Setting model data

Setting attributes on a model:

```javascript
todoItem.set({description: 'Pick up eggs'});
```

### Getting model data


Retrieving an attribute:

```javascript
var description = todoItem.get('description');
```

Retrieving all attributes in JSON format:

```javascript
var attributes = todoItem.attributes;
```

### Destroying model

Destroying a model:

```javascript
todoItem.destroy({
  success: function() {
    console.log('Todo item destroyed');
  },
  error: function(model, xhr, options) {
    console.log('Destroy error');
  }
});
```

### Model methods

Adding custom model methods:

```javascript
var TodoItem = Backbone.Model.extend({
  priority: function(level) {
    this.set({priority: level});
  }
});

var todoItem = new TodoItem();
todoItem.priority('high');
```

### Synchronizing model with server

Backbone gives us the ability maintain the same state of the model on the server and vice versa.

### Setting sync url

To get sync going we need to tell our model what url to fetch from.

```javascript
var TodoItem = Backbone.Model.extend({
  urlRoot: '/todo'
});
```

In this example, the RESTful `/todo` url will return a todo item in JSON format. For the server to know which todo item to fetch from the database an `id` parameter is required when doing the request. Let's just say that the server responds with the following JSON:

```javascript
{
  id: 1,
  description: 'Pick up milk',
  done: false
}
```

### Fetching from server

To pull the server data into a Backbone model, we call the `fetch` method:

```javascript
var todoItem = new TodoItem({id: 1});

todoItem.fetch({
  success: function(model) {
    model.get('description'); // Pick up milk
  },
  error: function(model, xhr, options) {
    console.log('Fetch error');
  }
});

```

### Parsing response from server

If the response from the server is formatted differently than our model, for example it looks like:

```javascript
{
  todo: {
    id: 1,
    desc: 'Pick up milk',
    done: false
  }
};
```

We can easily parse the response from the server:

```javascript
var TodoItem = Backbone.Model.extend({
  parse: function(response) {
    response = response.todo;
    response.description = response.desc;
    delete response.desc;
    return response;
  }
});

var todoItem = new TodoItem(data, {parse: true});
```

### Posting to server

After we have done some change to the model we can do a PUT request to the server to persist the changes:

```javascript
todoItem.save({description: 'Pick up eggs'}, {
  success: function(model) {
   console.log('Todo item saved');
  },
  error: function(model, xhr, options) {
   console.log('Save error');
  }
});
```

### Parsing request to server

Once again we can format the data before we send it if the server is expecting it in a different format:

```javascript
var TodoItem = Backbone.Model.extend({
  toJSON: function() {
    var attrs = _.clone(this.attributes);
    attrs.desc = attrs.description;
    attrs = _.pick(attrs, 'desc', 'status'); // Pick out only object properties we want
    return { todo: attrs };
  }
});

...

todoItem.save();
```

Retrieving model formatted JSON:

```javascript
var json = todoItem.toJSON();
```

### Model unique identifier

By default Backbone models use `id` as a unique identifier. If your server is expecting a different id we can easily change it:

```javascript
var TodoItem = Backbone.Model.extend({
  idAttribute: '_id'
});

var todoItem = new TodoItem({id: 1});

todoItem.fetch(); // Fetches _id 1 from server
```

### Model validation

Performing validation before data is stored on the model:

```javascript
var TodoItem = Backbone.Model.extend({
  validate: function(attributes, options) {
    if (attributes.description.length === 0) {
      return 'Description cannot be empty';
    }
  },
  initialize: function() {
    this.on('invalid', function(model, error) {
      console.log('Validation error:', error);
    });
  }
});

var todoItem = new TodoItem({description: ''});
todoItem.save(); // Triggers an error
```

### Model events

Backbone models can listen to events and fire a callback. For example when a todoItem model gets destroyed you might want to remove the todo list item from the view with having to think about it. We'll go over views shortly.

### Common events

Listen to the destory event:

```javascript
todoItem.on('destroy', function(model, collection, options) {
  console.log('todoItem destroyed');
});
```

Listening to attribute changes:

```javascript
todoItem.on('change', function(model, options) {
  console.log('todoItem was changed');
});
```

Listening to changes on a specific attribute:

```javascript
todoItem.on('change:description', function(model, options) {
  console.log('todoItem description changed to %s', model.get('description'));
});
```

Listening to the error event (when the model `save` call fails):

```javascript
todoItem.on('error', function(model, error, options) {
  console.error('Error:', error);
});
```

Listening to validation errors:

```javascript
todoItem.on('invalid', function(model, error) {
  console.error('Validation error:', error);
});
```

Listening to sync event:

```javascript
todoItem.on('sync', function(model, resp, options) {
  console.log('Successfully synced to server');
});
todoItem.trigger('hello');
```

Listening to all events:

```javascript
todoItem.on('all', function(event) {
  console.log('The %s event got triggered', event);
});
```

### Custom events

Custom event:

```javascript
todoItem.on('foo', function(model) {
  console.log('foo event triggered');
});

todoItem.trigger('foo');
```

### Unbinding from an event

Stop listening to an event

```javascript
todoItem.off('change', function() {
  console.log('No longer listening to changes');
});
```

If you don't want any events triggered on a model when you do something:

```javascript
todoItem.set({description: 'Pick up eggs'}, {silent: true});
```

### Overrding sync method

### Models and local storage

Instead of syncing our model to the server we can have it save to [local storage](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage) To do this we must override the four syn methods: `read`, `create`, `update`, and `delete`.

```javascript
var TodoItem = Backbone.Model.extend({
  // method = <read|create|update|delete>
  sync: function(method, model, options) {
    options || (options = {});
    switch(method) {
      case 'create':
        var key = 'TodoItem-' + model.id;
        localStorage.setItem(key, JSON.stringify(model));
      break;
      case 'read':
        var key = 'TodoItem-' + model.id;
        var result = localStorage.getItem(key);
        if (result) {
          result = JSON.parse(result);
          options.success && options.success(result);
        } else if (options.error) {
          options.error('Could not find TodoItem id=' + model.id);
        }
      break;
      case 'update':
        var key = 'TodoItem-' + model.id;
        localStorage.setItem(key, JSON.stringify(model));
      break;
      case 'delete':
        var key = 'TodoItem-' + model.id;
        localStorage.removeItem(key);
      break;
    }
  }
});

(new TodoItem({id: 1, description: 'Pick up milk'})).save(); // will store in local storage

var todoItem = new TodoItem({id: 1}); // will read from local storage
todoItem.fetch({
  error: function(msg) {
    console.log(msg};
  }
);
```

Luckily the [Backbone.localStorage](https://github.com/jeromegn/Backbone.localStorage) adapter by [Jerome Gravel-Niquest](https://github.com/jeromegn) takes care of all the messy work. Simply include the `backbone.localStorage.js` in your page and set the `localStorage` property on your Backbone collection:

```javascript
var TodoItems = Backbone.Collection.extend({
  model: TodoItem,
  localStorage: new Backbone.LocalStorage('TodoItems')
});
```

### Read-only model

Overriding the sync method to make model *read-only*:

```javascript
var TodoItem = Backbone.Model.extend({
  sync: function(method, model, options) {
    if (method === 'read') {
      Backbone.sync(method, model, options);
    } else {
      console.error('You can not ' + method + ' the TodoItem model');
    }
  }
});
```

### Creating a base model

```javascript
var BaseModel = Backbone.Model.extend({
  foo: function() {
    return 'bar';
  }
});

var todoItem = new BaseModel.extend({});
todoItem.foo();
```

## Collections

A Backbone collection is simply put: a collection of Backbone models. Collections make it easy to iterate and filter a list models to get what we need.

### Collection basics

### Creating a Collection

Creating a Backbone TodoList collection that will hold TodoItem models.

```javascript
var TodoList = Backbone.Collection.extend({
  model: TodoItem
});

var todoList = new TodoList();
```

### Adding to collection

Adding a todo item model to the todo list collection:

```javascript
todoList.add(todoItem);
```

Append model to end collection:

```javascript
todoList.push(todoItem);
```

Prepend model to beginning of collection:

```javascript
todoList.unshift(todoItem);
```

### Retrieving model from collection

Getting a model from collection based on the model id:

```javascript
var todoItemOne = todoList.get(1);
```

Getting a model from collection by index:

```javascript
var thirdTodoItem = todoList.at(2);
```

Getting array of collection models:

```javascript
var models = todoList.models;
```

### Removing model from collection

Removing model from collection:

```javascript
todoList.remove(todoItem);
```

Remove and return the last model from collection:

```javascript
var lastTodo = todoList.pop();
```

### Collection length

Number of models in a collection:

```javascript
todoList.length;
```

### Collection sorting

Backbone gives us a [`comparator`](http://backbonejs.org/#Collection-comparator) which we can utilize to sort the collection:

```javascript
var TodoItems = Backbone.Collection.extend({
  comparator: 'description' // sort by "description" attribute
});
```

We can define our own custom comparator method:

```javascript
var TodoItems = Backbone.Collection.extend({
  comparator: function(todo1, todo2) {
    return todo1.get('done') < todo2.get('done') // sort by "done" attribute in reverse order
  }
});
```

### Collection methods

Like with models we can add custom methods to our Backbone collection. Here we will create a method that returns the number fo completed todos:

```javascript
var TodoItems = Backbone.Collection.extend({
  completedCount: function() {
    return this.where({done: true}).length
  }
});

var completed = todoItems.completedCount();
```

### Collection events

Just like models, collection can have event listeners attached.

Listening for collection reset:

```javascript
todoList.on('reset', function() {
  console.log('todoList reseted with data');
});
```

Listening for when collection is fetch:

```javascript
todoList.on('fetch', function() {
  console.log('todoList fetched from server');
});
```

Listening for new models added to list:

```javascript
todoList.on('add', function(todoItem) {
  console.log('New todo item added to list');
});
```

Listening for model removal from list:

```javascript
todoList.on('remove', function() {
  console.log('Todo item removed from list');
});
```

Unbinding a listener:

```javascript
todoList.off('reset', function() {
  console.log('No longer listening to reset event');
});
```

### Collection bulk population

Bulk populating a collection:

```javascript
var TodoItem = Backbone.Model.extend({});

var TodoList = Backbone.Collection.extend({
  model: TodoItem
});

var todoItem1 = new TodoItem({description: 'Pick up milk'});
var todoItem2 = new TodoItem({description: 'Pick up eggs'});

var todoList = new TodoList([todoItem1, todoItem1]);
```

Bulk populating a collection using reset:

```javascript
var TodoList = Backbone.Collection.extend({
  model: TodoItem
});

var todoList = new TodoList();

var todos = [
  {description: 'Pick up milk'},
  {description: 'Pick up eggs'}
];

todoList.reset(todos);
```

### Fetching collection from server

Just like with models we can fetch a collection from the server into our collection instance. To do so the server should respond with an array of objects that our Backbone model can parse. For example:

```javascript
[
  {id: 1, description: 'Pick up milk', done: false},
  {id: 2, description: 'Pick up eggs', done: false}
]
```

We need to set the url property on our collection and do a fetch:

```javascript
var TodoList = Backbone.Collection.extend({
  url: '/todos'
});

todoList.fetch();
```

After fetch the todoList collection will contain an array of TodoItem instances loaded with attribute data from the server.

### Collection parsing

Like with our models we can parse the response from the server if it differs than from what our collection is expecting. Let's say that the response from the server looks like this:

```javascript
{
  "total": 25, "per_page": 10, "page": 2,
  "todos": [{"id": 1}, {"id": 2}]
}
```

We can parse the response, as well keep additional meta data:

```javascript
var TodoITems =  Backbone.Collection.extend({
  url: '/todos',
  parse: function(response) {
    this.perPage = response.per_page;
    this.page = resposne.page;
    this.total = response.total;
    return response.todos;
  }
});
```

When we do a fetch we can use that addional meta data to get specified results:

```javascript
todoItems.fetch({data: {page: todoItems.page + 1}}); // GET /todos?page=3
```

We can then incorporate simple pagination into our view:

```javascript
var TodoListView = Backbone.View.extend({
  template: _.template('<a href="#/todos/p<%= page %>/pp<%= per_page %>">View Next</a>'),
  initialize: function(){
    this.collection.on('reset', this.render, this);
  },
  render: function(){
    this.$el.empty();
    this.collection.forEach(this.addOne, this);
    this.$el.append(this.template({page: this.collection.page + 1, per_page: this.collection.per_page}));
  },
  addOne: function(model){
    var todoListView = new TodoListView({model: model});
    todoListView.render();
    this.$el.append(todoListView.el);
  }
});
```

### Collection iteration

Iterarte over collection:

```javascript
todoList.forEach(function(index, todoItem) {
  console.log(todoItem.get('description'));
});
```

Build array of values mapped by iterator function:

```javascript
var descriptions = todoList.map(function(todoItem, index) {
  return todoItem.get('description');
});
```

Filter by some criteria and return an array with those models:

```javascript
var doneTodoItems = todoList.filter(function(todoItem, index) {
  return todoItem.get('done') === true;
});
```

These are just a few but the Underscore library provides many more [collection iteration methods](http://documentcloud.github.io/backbone/#Collection-Underscore-Methods).

## Views

A view is an ouput representation of data. Views allows us to display dynamic model data to the user.

### Generating a view

Here we are creating a simple view. We are an [Underscore template](http://underscorejs.org/#template) and once the view render function gets called we will set the compiled template html to `el` property of the view. By default the `el` property is a div element. After we render the view we append the view html to our body.

```javascript
var TodoView = Backbone.View.extend({
  template: _.template('Pick up milk'),
  render: function() {
    this.$el.html(this.template());
  }
});

var todoView = new TodoView();

todoView.render();

$('body').append(todoView.el);
```

Now the DOM will look like this:

```html
<body>
  <div>
    Pick up milk
  </div>
</body>
```

Like I mentioned earlier the default view element is a `div` but we can easily change that:

```javascript
var TodoView = Backbone.View.extend({
  tagName: 'section',
  id: 'todo-view',
  className: 'todo',
  template: _.template('Pick up milk'),
  render: function() {
    this.$el.html(this.template());
  }
});

var todoView = new TodoView();

todoView.render();

$('body').append(todoView.el);
```

Generated DOM:

```html
<body>
  <section id="todo-view" class="todo">
  Pick up milk
  </section>
</body>
```

We can also use an existing element on the page to insert our view rather than append it everytime:

```html
<body>
  <div id="todo"></div>
</body>
```

```javascript
var TodoView = Backbone.View.extend({
  el: '#todo',
  template: _.template('Pick up milk'),
  render: function() {
    this.$el.html(this.template());
  }
});

var todoView = new TodoView();

todoView.render();
```

Generated DOM:

```html
<body>
  <div id="todo">
    Pick up milk
  </div>
</body>
```

Note that we can also specify the `el` element during view instantiation.

```javascript
var todoView = new TodoView({el: $('#todo'});
```

### Models and views

With Underscore templates we can use variables, that once the view is compiled, will be replaced with our model data.

```javascript
var TodoView = Backbone.View.extend({
  template: _.template('<%= description %>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

var todoView = new TodoView({
  model: todoItem
});

todoView.render();

$('body').append(todoView.el);
```

Generated DOM:

```html
<body>
  <div>
    Pick up milk
  </div>
</body>
```

### Keeping templates seperate

It is good practice to keep to templates seperate from our application logic. One way we can do this is by placing the template html into a script tag. By setting the `src` attribute to something other than `text/javascript` the document will ignore it and not try to execute the code.

```html
<script src="text/template" id="todo-template">
  <%= description %>
</script>
```

```javascript
var TodoView = Backbone.View.extend({
  template: _.template($('#todo-template').html()),
  render: function() {
    this.$el.html(this.template(this.model.attributess));
  }
});
```

### Using alternative templating libaries

There are plenty of alternative templating libraries that you can use if you're not diggin' Underscore's ERB-style delimeters, such as [Handlebars.js](http://handlebarsjs.com/), [Mustache.js](http://mustache.github.io/), and [Hogan.js](http://twitter.github.io/hogan.js/).

Example using Mustache.js templates:

```javascript
var TodoItemView = BackboneView.extend({
  template: Mustache.compile('{{ description }}</span>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});
```

### View events

The neat thing about Backbone views is that we can bind events that attach to only the view's `el` and children elements. We first specify the event, then the optional selector, and lastly the method:

```javascript
var TodoView = Backbone.View.extend({
  events: {
    'dblclick': 'open',
    'click .icon': 'select',
    'mouseover .title': 'showtooltip',
    'keypress input': 'autocomplete'
  },
  open: function(event) {
    console.log('You double clicked somewhere in the view');
  },
  select: function(event) {
    console.log('You click on .icon');
  },
  showtooltip: function(event) {
    console.log('You hovered over .title');
  },
  autocomplete: function(event) {
    console.log('You did a keypress in the input field');
  }
});
```

### Form submission

Here we are displaying a todo form which has an input field and a save button. When the form is submitted we are capturing the submit event and creating a new todo model with the description inputed:

```javascript
var TodoForm = Backbone.View.extend({
  template: _.template('<form><input name="description" value="<%= description %>"><button>Save</button></form>'),
  events: {
    submit: 'save'
  },
  save: function(e) {
    e.preventDefault();
    var description = this.$('input[name="description"]').val();
    this.model.save({description: description}, {
      success: function(model, response, options) {
        console.log('Save successful');
      },
      error: function(model, xhr, options) {
        var errors = JSON.parse(xhr.response.text).errors;
        console.log('Save error:',  errors);
      }
    });
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

var todoItem = new TodoItem();
var todoForm = new TodoForm({model: todoItem});
$('#app').html(todoForm.render().el);
```

We can easily turn the form into an edit form:

```javascript
var todoItem = todoItems.get(1);
var editTodoFrom = new TodoForm({model: todoItem});
$('#app').html(editTodoForm.render().el);
```

### View options

View options is extra data we can pass along to our view object.

For example we can a todo item model and user model on our view:

```javascript
var todoView = new TodoView({
  model: todoItem,
  user: currentUser
});

var user = todoView.options.user;
```

Another example:

```javascript
var TodoView = Backbone.View.extend({
  initialize: function(options) {
    this.user = options.user;
  }
});

var todoView = new TodoView({user: currentUser});

var user = todoView.options.user;
```

### Collections and views

### Adding collection models to view

Append all collection models to view on view initialization and listen to the add event on the collection to update view accordingly:

```javascript
var TodoListView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('add', this.addOne, this); // bind context to view
    this.collection.on('reset', this.addAll, this);
  },
  addOne: function(todoItem) {
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el);
  },
  addAll: function() {
    this.collection.forEach(this.addOne, this);
  },
  render: function() {
    this.addAll();
  }
});

var newTodoItem = new TodoItem({
  description: 'Pick up milk'
});

todoList.add(newTodoItem);
```

### Updating view when model deleted

Listening to the remove event on the collection and updating view:

```javascript
var TodoList = Backbone.Collection.extend({
  initialize: function() {
    this.on('remove', this.hideModel);
  },
  hideModel: function(model) {
    model.trigger('hide');
  }
});

var TodoItemView = Backbone.View.extend({
  initialize: function() {
    this.model.on('hide', this.remove, this);
  }
});

todoList.remove(todoItem);
```

### Tying view events to models

### Updating views on model change

Update view when model changes and highlight corresponding view item.

```javascript
var TodoView = Backbone.View.extend({
  template: _.template('<%= model.("description") %>'),
  initialize: function(options) {
    this.model.on('change:description', this.change, this);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  },
  change: function(model, value, options) {
    this.$('span').html(value);
    if (options.highlight) {
      this.$el.effect('highlight', {}, 1000);
    }
  }
});

todoItem.set({description: 'Pick up eggs'}, {highlight: false});
```


### Checkbox toggle example

Update model when view checkbox changes and update view as well:

```javascript
var TodoView = Backbone.View.extend({
  template: _.template(),
  events: {
    'change input': 'toggleStatus'
  },
  initialize: function() {
    this.model.on('change', this.render, this); // bind context to view
  },
  toggleStatus: function() {
    this.model.toggleStatus();
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

// Keeping checkbox model logic in model
var TodoItem = Backbone.Model.extend({
  toggleStatus: function() {
    if (this.get('status') === 'incomplete') {
      this.set({'status': 'complete'});
    } else {
      this.set({'status': 'incomplete'});
    }
  }
});
```

### Removing view when model is destroyed

Remove view on model destroy:

```javascript
var TodoView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this); // bind context to view
    this.model.on('destroy', this.remove, this);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  },
  remove: function() {
    this.$el.remove();
  }
});
```


### Removing view reference on model when view gets deleted

Before a view gets removed we want to unbind all listeners:

```javascript
todoView.stopListening();
todoView.remove();
```

Backbone automatically calls `stopListening` when the `remove` method is executed.

### Preventing XSS attacks

[Cross-site scripting](http://en.wikipedia.org/wiki/Cross-site_scripting) (XSS) attacks is when an end user inject malicious scripts into our application. One way to prevent this from happening to to escape script tags so that the script does not execute:

```javascript
var TodoView = Backbone.View.extend({
  template: _.template('<%= model.escape("description") %>')
});
```

## Routes

Routes allows us to create pages and map them to actions and events. It makes bookmarkable urls possible.

### Router basics

In Backbone we specify our routes in a Router object and map a function to each route. When a particular route is triggered the routes function will execute:

```javascript
var TodoRouter = new (Backbone.Router.extend({
  routes: {
    '': 'index',
    'about': 'about'
  },
  index: function() {
    console.log('/ route');
  },
  about: function() {
    console.log('/about route');
  }
}));
```

### Route paramaters

We can set our router to have parameter parts in order to have dynamic routing. To do this we set a colon followed by the parameter name on the route and then pass the parameter name in the function to get the value:

```javascript
var TodoRouter = new (Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos/:id': 'todos'
  },
  index: function() {
    console.log('/');
  },
  todos: function(id) {
  }
}));
```

Another way we can define route functions:

```javascript
TodoRouter.on('route:index', function(id) {
  console.log('/');
});

TodoRouter.on('route:todos', function(id) {
  console.log('/todos/%s', id);
});
```

To pass a parameter that can match any number of url components, for example a path to a file, we use a *splat*:

```javascript
var TodoRouter = new (Backbone.Router.extend({
  routes: {
    '': 'home',
    'download/*file': 'file' // GET /download/http://example.com/path/file.png
  },
  download: function(file) {
    console.log('File:', file); // File: http://example.com/path/file.png
  }
}));
```

### Default route

Having the last route match any url can serve as the default route:

```javascript
var TodoRouter = new (Backbone.Router.extend({
  routes: {
    // other routes here
    '*path': 'notFound'
  },
  notFound: function(path) {
    console.log('The %s was not found', path);
  }
}));
```

### Trigger a route

Calling the router's `navigate` method will update the current url to the specified route, but to call the corresponding route function we must set `trigger` to true:

```javascript
TodoRouter.navigate('todo', {trigger: true});
```

### Search route

We can create a search route with an optional page parameter:

```javascript
var TodoRouter = new (Backbone.Router.extend({
  routes: {
    'search/:query(/p:page)(/)': 'search' // page and last slash is optional
  },
  search: function(query, page) {
    page = page || 0;
    query = decodeURIComponent(query);
  }
});

TodoRouter.navigate('search/milk', {trigger: true});
TodoRouter.navigate('search/milk/p2', {trigger: true});
```

### Regular expression routes

Regular expression can be used to define routes. Note that we have to use the route method instead. In this example we are matching the route `/todos/&lt;id&gt;` where id must be a digit:

```javascript
var TodoRouter = new (Backbone.Router.extend({
  initialize: function() {
    this.route(/^todos\/(\d+)$/, 'show');
  },
  show: function(id) {
   console.log('/todo/%d', id);
  }
}):
```

### Handle links outside of views

```javascript
var App = new (Backbone.View.extend({
  events: {
    'click a[data-internal]': function(e) {
      e.preventDefault();
      Backbone.history.navigate(e.target.pathname, {trigger: true});
    }
  },
  start: function() {
    Backbone.history.start({pushState: true});
  }
})({el: document.body});

$(function() {
	App.start();
});
```

### Backbone.history

When initializing a Backbone router it's *really important* to start `Backbone.history` to begin monitoring `hashchange` events and dispatching routes. To use HTML5 [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history) we must set the `pushState` attribute to true within Backbone.history.start():

```javascript
var TodoRouter = new (Backbone.Router.extend({
  routes: {
    '': 'index'
  },
  initialize: function() {
    Backbone.history.start({pushState: true});
  },
  index: function(index) {
    console.log('/ route');
  }
}));
```

### Route history

Store an array of route navigated:

```javascript
var history = [];
this.listenTo(this, 'route', function (name, args) {
  history.push({
      name : name,
      args : args,
      fragment : Backbone.history.fragment
    });
  console.log(history);
});
```

### Tying routes, views, and collections

### Fetching collection on route

On router initialization append the the todoView with todoList collection to the #app element and fetch the todo items on index route:

```javascript
var TodoApp = new (Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos/:id', 'show'
  },
  initialize: function() {
    this.todoList = new TodoList();
    this.todosView = new TodoListView({collection: this.todoList});
    $('#app').append(this.todosView.el);
  },
  start: function() {
    Backbone.history.start({pushState: true});
  },
  index: function() {
    this.todoList.fetch();
  },
  show: function(id) {
    this.todoList.focusOnTodoItem(id);
  }
}));

$(function() {
  TodoApp.start();
});
```

Another example with routes for creating and editing a todo:

```javascript
var TodoApp = new (Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos/:id/edit': 'edit',
    'todos/new': 'newTodo'
  },
  initialize: function() {
    this.todoItems = new TodoItems();
    this.todosView = new TodosView({collection: this.todoItems});
  },
  index: function() {
    this.todoItems.fetch();
    $('#app').html(this.todosView.render().el);
  },
  newTodo: function() {
    var todoItem = new TodoItem();
    var todoForm = new TodoForm({model: todoItem});
    $('#app').append(toodForm.render().el);
  },
  edit: function(id) {
    var todoForm = new TodoForm({model: this.todoItems.get(id)});
    $('#app').html(todoForm.render().el);
  }
}));
```

### Starting with initial data

Starting our application with some initial HTML:

```javascript
var App = new (Backbone.View.extend({
  template: _.template('<h1>ToDo List</h1><div id="app"></div>');
  render: function() {
    this.$el.html(this.template());
  },
  start: function() {
    console.log('App started');
  }
}))({el: document.body});

$(function() {
  App.render();
  App.start();
});
```

Here we are passing bootstrap data to start our collection with and initializing our objects within a namespace:

```javascript
var App = new (Backbone.View.extend({
  start: function(bootstrap) {
    var todos = new App.Collections.TodoItems(bootstrap.todos);
    var todoView = new App.Views.TodoItems({collection: todos});
    this.$el.append(todosView.render().el);
    todos.fetch();
  }
}))({el: document.body});

var bootstrap = {
  todos: [
    {id:1, description: "", done: false},
    {id:2, description: "", done: false}
  ]
};

$(function() {
  App.start(bootstrap);
});
```


## Conclusion

With Backbone.js we keep our application organized and structured which in a sense forces us to avoid writing messy [Spaghetti code](http://en.wikipedia.org/wiki/Spaghetti_code). I hope this tutorial gave you a decent understanding of Backbone principles and are now ready to give it a go. If the examples aren't too clear or if I made a mistake, leave your feedback in the comments below.

Helpful Backbone.js resources:

- [Backbone Todos](http://documentcloud.github.io/backbone/examples/todos/index.html)
- [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals/)
- [Backbone patterns](http://ricostacruz.com/backbone-patterns/)
- [Backbone Boilerplate](https://github.com/backbone-boilerplate/backbone-boilerplate)
