# What is it?

A collection of schematics that extends the default one.

I did it for making simpler my daily work with Angular.
Its only purpose is to improve DX.



# Getting Started 

```
ng new my-project
cd my-project
npm i @jlguenego/schematics
```

Edit `angular.json`, and add 

```
{ 
    // rest of the file
    "cli": {
        "defaultCollection": "@jlguenego/schematics"
    }
}
```

Done!

# Using schematics

Create a routing module `hello`.
```
ng g routing hello
```

Create a route `home`
```
ng g route hello/home ""
```

Create a page `success`

```
ng g page hello/success
```

# Schematics Reference

## routing

Create a routing module.

1. Create a module if it does not exist.
2. Create the associated routing module.

## route

1. Find the module A where to create the route.
2. Create the routing module B if not already present.
3. Create the route component and declare it in the module A.
4. Create the route with the path specified in the routing module B.

Example:

```
ng g route hello world
```

Create the HomeComponent in the AppModule.
Configure the route as:

```
const routes: Routes = [
    // ...
    { path: "world", component: HelloComponent }
];
```

## page

1. Create a component with suffix `PageComponent`.
2. Declare it inside a module in `entryComponents` section.

Options are same as the @schematics/angular component.

# Author

Jean-Louis GUENEGO <jlguenego@gmail.com> - 2019.
 