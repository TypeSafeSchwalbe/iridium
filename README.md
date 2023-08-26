# Iridium

Iridium is *the* library for 2D game development in the [Vilm programming language](https://github.com/typesafeschwalbe/vilm). It features:

- resource loading
- vector math
- 2D graphics
- keyboard, mouse and touch input
- 3D audio
- 2D collision detection
- entity component system (ECS)

# Using Iridium in your Vilm project

To include Iridium in your project, first copy the `src` directory into your project sources and rename it (for example `iridium`). Then, include the `iridium.js`-script from that directory in your HTML.
To now load Iridium for an instance of Vilm pass the instance, the path of the directory containg all the iridium source files as a string and a canvas element to `iridium.load`, which will return the instance of Vilm you passed to it.

```js
window.onload = () => {
    const vilm = iridium.load(
        new Vilm(),   // Vilm instance
        "./src",   // directory containing Iridium source files
        document.getElementById("game")   // canvas to draw onto
    );
    vilm.evalFiles("test.vl");   // load files that depend on Iridium afterwards
};
```

# Documentation

Now that you have Iridium up and running, let's get familiar with the packages and the macros / functions they contain.

### `iridium`

This package contains *ALL* macros and functions that are part of Iridium:
```
pkg iridium
useall iridium:core
useall iridium:math
useall iridium:graphics
useall iridium:resources
useall iridium:input
useall iridium:audio
useall iridium:collision
useall iridium:ecs
```

### `iridium:core`

This package contains functions and macros related to the game loop.

**`gameloop <body>`** - Starts the gameloop, executing the given body for each frame. `<body>` shall be an expression or list of expressions.

**`delta_time`** - Returns the time passed since the last frame in seconds.

### `iridium:math`

This package contains functions and macros related to vector math. A "vector" shall be a list of numbers, meaning a "2D vector" would be `(x y)`, a "3D vector" would be `(x y z)`, and so on. None of the functions in this package modify the vectors they are given.

**`[dim] <x>`** - Returns the number of dimensions of the given vector.

**`[+] <a> <b>`** - Returns the two given vectors added component-wise. Both values may also be a number.

**`[-] <a> <b>`** - Returns the two given vectors subtracted component-wise. Both values may also be a number.

**`[*] <a> <b>`** - Returns the two given vectors multiplied component-wise. Both values may also be a number.

**`[/] <a> <b>`** - Returns the two given vectors divided component-wise. Both values may also be a number.

**`[%] <a> <b>`** - Returns the two given vectors reduced to modulo component-wise. Both values may also be a number.

**`[~] <x>`** - Returns the vector negated.

**`[len] <x>`** - Returns the norm of the vector.

**`[unit] <x>`** - Returns the vector as a unit vector pointing in the same direction.

**`[dot] <a> <b>`** - Returns the dot product of the the given vectors.

**`[cross] <a> <b>`** - Returns the cross product of the given vectors. Both vectors must be 3-dimensional.

**`[rotated] <x> <angle>`** - Returns the given vector rotated by a given angle around the origin. The given vector must be 2-dimensional.

**`[.x] <x>`** - Returns the x-component of the given vector.

**`[.y] <x>`** - Returns the y-component of the given vector.

**`[.z] <x>`** - Returns the z-component of the given vector.

**`[.w] <x>`** - Returns the w-component of the given vector.

**`[.] <x> <components>`** - Returns a new vector, created by the specified components of the given vector in the specified order. `<components>` shall be a single identifier. Example: calling `[.] (1 2 3) xzy` would result in `(1 3 2)`, or `[.] (4 5 6) zzx` in `(6 6 4)`. [More info about swizzling here](https://en.wikipedia.org/wiki/Swizzling_(computer_graphics)).

### `iridium:graphics`

This package contains functions and macros related to 2D graphics.

**`Color <r> <g> <b>`** - Returns a new object representing the given color. All three values shall be numbers in the range of 0 to 255.

**`enabled`** - A fancier alternative to `true`.

**`disabled`** - A fancier alternative to `false`.

**`Surface <size>`** - Returns a new surface with the given size. `<size>` shall be a 2-dimensional vector.

**`canvas`** - Returns the surface representing the canvas that was provided to Iridium at load time.

**`render_text <height> <content> <font_family> <color>`** - Returns a new transparent surface with the given text rendered onto it with the given font family and color. 

**`size_of <surface>`** - Returns a vector representing the size of the given surface.

**`target <surface>`** - Configures *all drawing operations* to be done on the given surface.

**`current_target`** - Returns the surface that is the current target of all drawing operations.

**`with_target <surface> <body>`** - Configures *all drawing operations* to be done on the given surface, but *only as long as the provided body is executed*. `<body>` shall be an expression or list of expressions.

**`custom <v1> <v2>`** - Returns a function representing the creation of a 2D transformation matrix with custom values. `<v1>` and `<v2>` shall be 3-dimensional vectors.

**`translate <offset>`** - Returns a function representing translation by the given offset. `<offset>` shall be a 2-dimensional vector.

**`rotate <angle>`** - Returns a function representing rotation around the origin by a given angle.

**`scale <amount>`** - Returns a function representing scaling by a given amount on the x- and y-axis. `<amount>` shall be a 2-dimensional vector.

**`transformation <transformations>`** - Configures the given transformations to be applied to *all drawing operations*. `<transformations>` shall be a list of functions returned from calls to `custom`, `translate`, `rotate` and `scale`.

**`with_transformation <transformations> <body>`** - Configures the given transformations to be applied to *all drawing operations*, but *only as long as the provided body is executed*. `<transformations>` shall be a list of functions returned from calls to `custom`, `translate`, `rotate` and `scale`. `<body>` shall be an expression or list of expressions.

**`image_smoothing <enabled>`** - Configures image smoothing to be enabled or disabled for *all drawing operations*.

**`current_image_smoothing`** - Returns if image smoothing is currently enabled.

**`with_image_smoothing <enabled> <body>`** - Configures image smoothing to be enabled or disabled for *all drawing operations*, but *only as long as the provided body is executed*. `<body>` shall be an expression or list of expressions.

**`composition <composition_operation>`** - Configures the [composition operation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing/Example) for *all drawing operations*.

**`current_composition`** - Returns the current composition operation.

**`with_composition <composition_operation> <body>`** - Configures the [composition operation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing/Example) for *all drawing operations*, but *only as long as the provided body is executed*. `<body>` shall be an expression or list of expressions.

**`alpha <alpha>`** - Configures the amount of alpha to use for *all drawing operations*. The alpha value shall be a number in the range of 0 to 255.

**`current_alpha`** - Returns the current alpha value.

**`with_alpha <alpha> <body>`** - Configures the amount of alpha to use for *all drawing operations*, but *only as long as the provided body is executed*. The alpha value shall be a number in the range of 0 to 255. `<body>` shall be an expression or list of expressions.

**`draw_rect <d_pos> <d_size> <color>`** - Draws a rectangle at the given position with the given size and the given color. `<d_pos>` and `<d_size>` shall be 2-dimensional vectors. `<color>` shall be a `Color`.

**`draw_oval <d_pos> <d_size> <color>`** - Draws an oval that has the box described by the given position and the given size as its bounds with the given color. `<d_pos>` and `<d_size>` shall be 2-dimensional vectors. `<color>` shall be a `Color`.

**`draw_subsurface <d_pos> <d_size> <surface> <src_pos> <src_size>`** - Draws a given surface at the given position with the given size, drawing only the part of the surface at the given position with a given size. `<d_pos>`, `<d_size>`, `<src_pos>` and `<src_size>` shall be 2-dimensional vectors.

**`draw_surface <d_pos> <d_size> <surface>`** - Draws a given surface at the given position with the given size. `<d_pos>` and `<d_size>` shall be 2-dimensional vectors.

**`draw_subimage <d_pos> <d_size> <image> <src_pos> <src_size>`** - Draws a given image at the given position with the given size, drawing only the part of the image at the given position with a given size. `<d_pos>`, `<d_size>`, `<src_pos>` and `<src_size>` shall be 2-dimensional vectors. `<image>` shall be a loaded image file returned from a call to `getr` (from `iridium:resources`).

**`draw_image <d_pos> <d_size> <image>`** - Draws a given image at the given position with the given size. `<d_pos>` and `<d_size>` shall be 2-dimensional vectors. `<image>` shall be a loaded image file returned from a call to `getr` (from `iridium:resources`).

**`draw_line <start_pos> <end_pos> <width> <color>`** - Draws a line from the given start position to the given end position with the given width and color.  `<start_pos>` and `<end_pos>` shall be 2-dimensional vectors. `<color>` shall be a `Color`.

**`draw_quadratic_bezier <start_pos> <c1_pos> <end_pos> <width> <color>`** - Draws a bezier curve from the given start position over the given control point to the given end position with the given width and color. `<start_pos>`, `<c1_pos>` and `<end_pos>` shall be 2-dimensional vectors. `<color>` shall be a `Color`.

**`draw_cubic_bezier <start_pos> <c1_pos> <c2_pos> <end_pos> <width> <color>`** - Draws a bezier curve from the given start position over the given control points to the given end position with the given width and color. `<start_pos>`, `<c1_pos>`, `<c2_pos>` and `<end_pos>` shall be 2-dimensional vectors. `<color>` shall be a `Color`.

**`draw_shape js <lines> <color>`** - Draws a shape that has the given lines as its outline with the given color. `<lines>` shall be a list of at least three elements, each of which shall be a list consisting of 1 2-dimensional vector (straight line), 2 2-dimensional vectors (quadratic bezier) or 3 2-dimensional vectors (cubic bezier). The first element must be a list consisting of a single 2-dimensional vector. `<color>` shall be a `Color`.

### `iridium:resources`

This package contains functions and macros related to loading resources from files.

**`Image <path>`** - Represents a path to a file containing image data.

**`Audio <path>`** - Represents a path to a file containing audio data.

**`load <resources>`** - Loads a list of resources. `<resources>` shall be a list containing objects returned from calls to `Image` and `Audio` and returns an object representing them.

**`when_loaded <res> <body>`** - Executes the given body when all the resources in the provided resource bundle have finished loading. `<res>` shall be an object returned from a call to `load`. `<body>` shall be an expression or list of expressions.

**`getr <res> <path>`** - Returns the object loaded from a given path from inside of a given resource bundle. `<res>` shall be an object returned from a call to `load`, and shall have finished loading. `<path>` shall be the exact same path passed to `Image` or `Audio`.

### `iridium:input`

This package contains functions and macros related to keyboard, mouse and touch input.

**`Key:CtrlL` `Key:CtrlR` `Key:ShiftL` `Key:ShiftR` `Key:Space` `Key:Backspace` `Key:Enter` `Key:AltL` `Key:AltR`
`Key:A` `Key:B` `Key:C` `Key:D` `Key:E` `Key:F` `Key:G` `Key:H` `Key:I` `Key:J` `Key:K` `Key:L` `Key:M` `Key:N` `Key:O` `Key:P` `Key:Q` `Key:R` `Key:S` `Key:T` `Key:U` `Key:V` `Key:W` `Key:X` `Key:Y` `Key:Z`
`Key:ArrUp` `Key:ArrDown` `Key:ArrLeft` `Key:ArrRight`
`Key:0` `Key:1` `Key:2` `Key:3` `Key:4` `Key:5` `Key:6` `Key:7` `Key:8` `Key:9`
`Key:F1` `Key:F2` `Key:F3` `Key:F4` `Key:F5` `Key:F6` `Key:F7` `Key:F8` `Key:F9` `Key:F10` `Key:F11` `Key:F12`
`Key:Esc`** - Represent keys on the keyboard.

**`is_pressed <key>`** - Returns a boolean representing if the given key is pressed. `<key>` shall be one of `Key:XXX`.

**`Button:Left` `Button:Scroll` `Button:Right`** - ...

**`is_clicked <button>`** - Returns a boolean representing if the given button is clicked. If touch input is received, `Button:Left` will be registered as clicked. `<button>` shall be one of `Button:XXX`.

**`cursor_position`** - Returns a 2-dimensional vector representing the position of the cursor on the canvas. If touch input is received, the "primary" touch position is returned.

**`touch_positions`** - Returns a list of 2-dimensional vectors representing the positions of all received touches.

### `iridium:audio`

This package contains functions and macros related to 3D audio.

**`set_listener_position <pos>`** - Sets the position of the audio listener. `<pos>` shall be a 3-dimensional vector.

**`set_listener_orientation <at> <up>`** - Sets the orientation of the audio listener to look in the given direction, with the given vector pointing up. `<at>` and `<up>` shall be 3-dimensional vectors.

**`set_listener_volume <volume>`** - Sets the volume of all the audio perceived by the audio listener. 

**`AudioSource <position>`** - Returns a new audio source, configured to be at the given position. `<position>` shall be a 3-dimensional vector.

**`set_source_position <source> <position>`** - Sets the position of the given audio source. `<source>` shall be an `AudioSource`. `<position>` shall be a 3-dimensional vector.

**`set_source_volume <source> <volume>`** - Sets the playback volume of the given audio source. `<source>` shall be an `AudioSource`.

**`set_source_pitch <source> <pitch>`** - Sets the playback pitch of the given audio source. `<source>` shall be an `AudioSource`.

**`set_source_repeating <source> <repeating>`** - Configures the given audio source to repeat the audio that's played back over and over again. `<source>` shall be an `AudioSource`.

**`play <source> <audio>`** - Plays the given audio from the given audio source. `<source>` shall be an `AudioSource`. `<audio>` shall be a loaded audio file returned from a call to `getr` (from `iridium:resources`).

**`is_playing <source>`** - Returns a boolean representing if the given audio source is currently playing back audio.`<source>` shall be an `AudioSource`.

### `iridium:collision`

This package contains functions and macros related to 2D collision.

**`BoxCollider <pos> <size>`** - Returns an object representing a 2-dimensional, axis aligned box collider. `<pos>` shall be a 2-dimensional vector.

**`CircleCollider <pos> <radius>`** - Returns an object representing a circle collider. `<pos>` shall be a 2-dimensional vector.

**`colliding_with <a> <b>`** - Returns a boolean representing if the two given colliders overlap. `<a>` and `<b>` shall be objects returned from calls to `BoxCollider` and `CircleCollider`.

### `iridium:ecs`

This package contains functions and macros related to Iridium's entity component system (ECS).

**`system <body>`** - Registers a system with the given body. The system will only start being called every frame once `gameloop` (from `iridium:core`) has been invoked. `<body>` shall be a list of expressions.

**`component <name> <value>`** - Registers a component with the given name and default value. `<name>` shall be a single identifier.

**`entity <name> <component_names>`** - Registers an entity with the given name and contained components. A function with the name of the entity will be registered in the package the macro was invoked from, which can be invoked to create new instances of the entity. `<name>` shall be a single identifier. `<component_names>` shall be a list of single identifiers, being names of already registered components.

**`entities`** - Returns an iterator over all entity instances.

**`entities_called <name>`** - Returns an iterator over all entity instances of the given name. `<name>` shall be a single identifier.

**`entities_with <component_names>`** - Returns an iterator over all entity instances that have all the given components. `<component_names>` shall be a single identifier or list of single identifiers, being names of already registered components.

**`delete_entity <entity>`** - Removes the given entity from the ECS. **DO NOT USE THE ENTITY AFTERWARDS**, as the ECS will keep a reference to it to reuse it when a new entity of the same name is created.

**`hasc <e> <component_name>`** - Returns a boolean representing if the given entity instance has a component with the given name. `<component_name>` shall be a single identifier.

**`setc <e> <component_name> <value>`** - Sets the value of the component with the given name of the given entity instance. `<component_name>` shall be a single identifier, being the name of a component inside of the entity instance.

**`getc <e> <component_name>`** - Gets the value of the component with the given name of the given entity instance. `<component_name>` shall be a single identifier, being the name of a component inside of the entity instance.