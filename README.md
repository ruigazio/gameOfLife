# Conway's Game of Life
Conway's Game of Life implemented in three ways: Angular, React and Libraryless

The models for the automaton are shared across implementations

Look at the folders (README.md) `angular`, `react` and `bare` for instructions to run the code

You can try it at http://ruigazio.github.io/gameOfLife

This is an edge case for the popular rendering libraries because of the high
number of children attached to a single parent - the cell matrix.
React falls far behind Angular as you can see looking at the reported times of drawing.

The model objects are the same in all implementations so any performance difference is due to the intrinsics of the libraries.

The level of decoupling from the models they allow was also under scrutiny. Keeping them out of the render task brings plenty of advantages, easy switching between them being one of great value. In this regard they are on par.

Both use _dirty checking_ to know if they should update the DOM, as does the libraryless version.

Closer inspection on _React_ sluggishness reveals the garbage collection causing the stuttering due to the scrapping of all _React_ children objects (cells) on each iteration.

Performance between Firefox and Chrome(ium) is very pronounced.

