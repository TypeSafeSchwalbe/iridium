
const iridium = {
    load: null,
    startGameloop: null,
    createEntityGenerator: null,

    vilm: null,

    canvas: null,
    canvasSize: null,
    canvasG: null,
    canvasSurface: null,

    imageSmoothing: null,
    globalAlpha: null,
    globalCompositeOperation: null,
    target: null,
    transform: null,

    keyStates: new Map(),
    buttonStates: new Map(),
    mousePosition: [0, 0],
    touchPositions: [],

    audioContext: new (window.AudioContext || window.webkitAudioContext)(),
    globalGainNode: null,

    entityGenerators: new Map(),
    systems: [],
    entities: new Map(),
    deadEntities: []
};

{
    window.addEventListener("keydown", (e) => iridium.keyStates.set(e.code, true));
    window.addEventListener("keyup", (e) => iridium.keyStates.set(e.code, false));

    function updateMousePosition(globalX, globalY) {
        const canvasRect = iridium.canvas.getBoundingClientRect();
        iridium.mousePosition = [
            Math.max(Math.min(globalX, canvasRect.right) - canvasRect.left, 0),
            Math.max(Math.min(globalY, canvasRect.bottom) - canvasRect.top, 0)
        ];
    }
    window.addEventListener("mousedown", (e) => {
        iridium.buttonStates.set(e.button, true);
        updateMousePosition(e.clientX, e.clientY);
    });
    window.addEventListener("mouseup", (e) => {
        iridium.buttonStates.set(e.button, false);
        updateMousePosition(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", (e) => {
        updateMousePosition(e.clientX, e.clientY);
    });

    function updateTouchPositions(touches) {
        const canvasRect = iridium.canvas.getBoundingClientRect();
        iridium.touchPositions = Array.from(touches).map((t) => [
            Math.max(Math.min(t.pageX, canvasRect.right) - canvasRect.left, 0),
            Math.max(Math.min(t.pageY, canvasRect.bottom) - canvasRect.top, 0)
        ]);
        if(iridium.touchPositions.length > 0) {
            iridium.mousePosition = Array.from(iridium.touchPositions[0]);
        }
    }
    window.addEventListener("touchstart", (e) => {
        iridium.buttonStates.set(0 /* left mouse button */, true);
        updateTouchPositions(e.touches);
    });
    window.addEventListener("touchend", (e) => {
        iridium.buttonStates.set(0 /* left mouse button */, false);
        updateTouchPositions(e.touches);
    });
    window.addEventListener("touchmove", (e) => {
        updateTouchPositions(e.touches);
    });

    iridium.globalGainNode = iridium.audioContext.createGain();
    iridium.globalGainNode.connect(iridium.audioContext.destination);
}

iridium.load = function(vilm, libFolder, targetCanvas) {
    iridium.vilm = vilm;
    iridium.canvas = targetCanvas;
    iridium.canvasSize = [ iridium.canvas.offsetWidth, iridium.canvas.offsetHeight ];
    iridium.canvasG = targetCanvas.getContext("2d");
    iridium.canvasSurface = { g: iridium.canvasG, size: iridium.canvasSize, canvas: iridium.canvas };

    iridium.imageSmoothing = false;
    iridium.globalAlpha = 255;
    iridium.globalCompositeOperation = "source-over";
    iridium.target = iridium.canvasSurface;
    iridium.transform = iridium.canvasG.getTransform();

    libFolder = libFolder.replaceAll("\\\\", "/");
    if(!libFolder.endsWith("/")) { libFolder += "/"; }
    vilm.evalFiles(
        libFolder + "math.vl",
        libFolder + "core.vl",
        libFolder + "resources.vl",
        libFolder + "graphics.vl",
        libFolder + "input.vl",
        libFolder + "audio.vl",
        libFolder + "collision.vl",
        libFolder + "ecs.vl",
        libFolder + "all.vl"
    );
    return vilm;
}

iridium.startGameloop = (frame) => {
    let lastTimestamp = null;
    const frameHandler = (timestamp) => {
        if(lastTimestamp === null) { lastTimestamp = timestamp; }
        iridium.deltaTime = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;
        iridium.canvas.width = iridium.canvas.offsetWidth;
        iridium.canvas.height = iridium.canvas.offsetHeight;
        iridium.canvasSize[0] = iridium.canvas.width;
        iridium.canvasSize[1] = iridium.canvas.height;
        frame();
        for(const system of iridium.systems) { system(); }
        window.requestAnimationFrame(frameHandler);
    };
    window.requestAnimationFrame(frameHandler);
};

iridium.createEntityGenerator = (name, componentNames, componentValues) => {
    iridium.entityGenerators.set(name, () => {
        let e = null;
        for(let deadEntityIndex = 0; deadEntityIndex < iridium.deadEntities.length; deadEntityIndex += 1) {
            const de = iridium.deadEntities[deadEntityIndex];
            if(de.IRIDIUM_ENTITY_NAME === name) {
                e = de;
                iridium.deadEntities.splice(deadEntityIndex, 1);
                break;
            }
        }
        if(e === null) {
            e = {};
            e.IRIDIUM_ENTITY_NAME = name;
        }
        for(let i = 0; i < componentNames.length; i += 1) {
            e[componentNames[i]] = componentValues[i]();
        }
        iridium.entities.set(e, e);
        return e;
    });
    return iridium.vilm.eval(`pkg iridium:ecs:impl macro raw(expr) expr raw (
        vfunc ${name} js "() => iridium.entityGenerators.get('${name}')()"
        0 0
    )`, "iridium_entity_generator.vl");
};
