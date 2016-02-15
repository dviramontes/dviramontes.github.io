{:title "(map ,,,) vs [...].map(v => v)"
 :layout :post
 :tags  ["clojure" "javascript"]}

### *A case for even higher-order abstractions*

- - -

Recently I was asked what the difference between
[JavaScript's map function](https://www.google.com/search?q=mdn%20map) 
vs [ClojureScript's map function](http://clojuredocs.org/clojure.core/map). 

I thought I would write this blog 	post to sort out the differences for myself.


While you might be thinking:
> well, isn't this comparing apples to oranges?

JavaScript and ClojureScript're are, after all, different languages.

To which I would say that as long as they are both sold to us as a general way to do function composition; we can compare them to see if one is *better* suited for a particular set of problems more than the other (Note: this will not be a comparison of space/time operation or language implementation, there are better places to find that sort of thing).


On the surface they promise to solve similar problems:

####Javascript's Map

> The map() method creates a new array with the results of calling a provided function on every element in this array.

Source **Mozilla Developers Network**.

- - -

####Clojure's Map

> Returns a lazy sequence consisting of the result of applying f to
the set of first items of each coll, followed by applying f to the
set of second items in each coll, until any one of the colls is
exhausted.  Any remaining items in other colls are ignored. Function
f should accept number-of-colls arguments. Returns a transducer when
no collection is provided.

Source: **Clojure-Docs**.
  

If we just skip the bit about transducers in Clojure for a moment[1](#1), we can say that they both deal with applying f to every item in a collection.

In practice:


```javascript
const given = [1,2,3]

```

- - -
<a name="1">1.</a> The other big difference is that in Clojure, these data structures are immutable by default where as in [JavaScript we have to do a bit more work to get this level of simplicity working.](https://facebook.github.io/immutable-js/)
