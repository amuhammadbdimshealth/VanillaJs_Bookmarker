//----                                      INCREMENTAL ID FOR EACH  OBJECT CREATION                    -----//
/*
//Practice - 1 => Find out why the code below does not act as expected. The id does not increment on each object creation. Why ?? 

function Bookmark(bookmarkName, bookmarkUrl, tags) {
    console.log(this);
    this.name = bookmarkName;
    this.url =  bookmarkUrl;
    this.tags = tags;
    this.createdDate = Date();
    this.index = this.setIndex();
    console.log(this);
}
Bookmark.prototype.id = 100;
Bookmark.prototype.getIndex = function() {
    console.log(this.id);
}
Bookmark.prototype.setIndex = function() {
    console.log("this",this)
    return (this.id ++);
}
const testObj1 = new Bookmark();
const testObj2 = new Bookmark();

//Practice - 2 => accomplish this by creating a global variable

var counter = 0;
  function Bookmark() {
    this.index = window.counter++;
 }
 var b1 = new Bookmark(); // global.counter 1
 var b2 = new Bookmark(); // global.counter 2
 var b3 = new Bookmark(); // global.counter 3

//Practice - 3 => Explain how the id increments sequentially on each object creation

var MyClass = (function() {
    var nextId = 1;
  
    return function MyClass(name) {  // this function will take advantage of closure and have access to the "nextId" variable in memory since                                       this function "MyClass(name)" was created inside the outer functions's execution context  
        this.name = name;
        this.id = nextId++;
     }
  })();
  
  var obj1 = new MyClass('joe'); //{name: "joe", id: 1}
  var obj2 = new MyClass('doe'); //{name: "doe", id: 2}

//Practice - 4 => more flexible solution you can create simple factory:

  function MyObjectFactory(initialId) {
    this.nextId = initialId || 1;
  
    // better to create the method inside prototype as methods define a behaviour which should be common to all instances   
    this.createObject = function(name) {
        console.log('this',this);
      return {name: name, id: this.nextId++}
    }

  }
  
    // better to create the method inside prototype as methods define a behaviour which should be common to all instances 
  MyObjectFactory.prototype.createObject = function(name) {
      console.log('this',this);
    return {name: name, id: this.nextId++}
  }
  
  var myFactory = new MyObjectFactory(9);
  var obj1 = myFactory.createObject('joe'); //{name: 'joe', id: 9}
  var obj2 = myFactory.createObject('doe'); //{name: 'doe', id: 10}
*/

//----                      FIND MAX INDEX NUMBER           -----//

/*
// Practice - 1 => Max of items in Simple Array 

var arr = [3,5,8,70,10];
var max = arr.reduce(function(a, b) {
    return Math.max(a, b);
},0);

var max2 = arr.reduce((a,b)=> Math.max(a, b),0);

// Practice - 2 => Max of items in Array of Objects 

var max = [{index: 1}, {index:2}, {index:3}].reduce((a,b)=>{
    // console.log(a,b);
    return Math.max(a ,b.index);
},0)




//----                      REF VS VALUE           -----//


// Practice - 1 => Array.find
var array1 = [5, 12, 8, 130, 44];

var found = array1.find(function(element) {
  return element > 10;
});

console.log(found);
// expected output: 12

// Practice - 2 => Find an object in an array by one of its properties
var sInv = [];
var inventory = [
    {name: 'apples', quantity: 2},
    {name: 'bananas', quantity: 0},
    {name: 'cherries', quantity: 5}
];

function isCherries(fruit) { 
    return fruit.name === 'cherries';
}

var found1 = inventory[2]
// inventory.find(i=>i.name=='cherries');
sInv.push(found1);


var found2 = inventory[1]
inventory.find(i=>i.name=='bananas');
sInv.push(found2);

// sInv[0].name = "New Food";
// sInv[1].name = "New Food2";

sInv = sInv.filter(b => b.name != "bananas"); //returns new array
sInv[0].name = "New Food";

console.log({sInv,inventory,found1,found2}); 
// { name: 'cherries', quantity: 5 }


// Practice - 3 => Difference between Array of primitives and Array of objects
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 7);
result[0] = "FOUND";
console.log({words,result}); // result - keeps no reference of primitive elements in "words" Array


var wordsObj = [{word:'spray'}, {word:'limit'}, {word:'elite'}, {word:'exuberant'}, {word:'destruction'}, {word:'present'}];
const resultsObj = wordsObj.filter(w => w.word.length > 7);
resultsObj[0].word = "FOUND";
console.log({wordsObj, resultsObj}); // resultsObj - seems to keep reference of object elements in "wordsObj" Array


*/
