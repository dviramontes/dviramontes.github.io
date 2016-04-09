{:title "(map ,,,) vs [...].map(v => v)"
 :layout :post
 :tags  ["clojure" "javascript"]}

### *A case for even higher-order abstractions*

- - -

Recently I was asked what the difference between
**JavaScript's map function** vs **ClojureScript's map function**.

I thought I would write this blog 	post to sort out the differences for myself.


While you might be thinking:
> well, isn't this comparing apples to oranges?

JavaScript and ClojureScript are, after all, different languages.

To which I would say that as long as they are both sold to us as data transformation functions, we can compare them for their power of abstraction. Moreover, [ClojureScript is a hosted language on top of JavaScript](http://clojure.org/about/clojurescript), so it ought to be able to do all of the things that JavaScript can do plus some, as we'll see later on.


On the surface they promise to solve similar problems:

####Javascript's Map

> The map() method creates a new array with the results of calling a provided function on every element in this array.

Source **[Mozilla Developers Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)**.

- - -

####Clojure's Map

> Returns a lazy sequence consisting of the result of applying f to
the set of first items of each coll, followed by applying f to the
set of second items in each coll, until any one of the colls is
exhausted.  Any remaining items in other colls are ignored. Function
f should accept number-of-colls arguments. Returns a transducer when
no collection is provided.

Source: **[Clojure-Docs](http://clojuredocs.org/clojure.core/map)**.


If we just skip the bit about transducers in Clojure for a moment[<sup>1</sup>](#1), we can say that they both deal with applying `f` to every item in a `collection`. At their core they both produce immutable results. In Clojure this is by design and in Javascript's case this can be achieved by adopting best practices [<sup>2</sup>](#2).

In practice:
<a class="jsbin-embed" href="http://jsbin.com/ledobiq/embed?js,console">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.35.9"></script>
- - -
<small>
<a name="1">1. </a>[See this post about transducers in JavaScript.](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data)

<a name="2">2. </a>
[See immutable.js](https://facebook.github.io/immutable-js/) and 
[seemless-immutable](https://github.com/rtfeldman/seamless-immutable) and 
[mori](https://github.com/swannodette/mori)
</small>
